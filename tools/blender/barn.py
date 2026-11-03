# Deterministic farm model, in metres: x right, y up, +z front; footprint centred at ground y=0.
# Build: flatpak run org.blender.Blender -b --factory-startup --python $PWD/tools/blender/barn.py -- $PWD/src/scenes/models
# Append --preview=$PWD/out/models to also render two orthographic 30-degree views.
import math
import random
import sys
from pathlib import Path
import bmesh
import bpy
from mathutils import Vector
ARGS = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
OUT = ARGS[0] if ARGS else '.'

def lin(hex_rgb):
    """sRGB hex to linear RGBA, as glTF's vertex colours are."""
    def f(c):
        c /= 255
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    return (f((hex_rgb >> 16) & 255), f((hex_rgb >> 8) & 255), f(hex_rgb & 255), 1.0)


def shade(c, k):
    """A colour lighter (k > 1) or darker."""
    return (min(c[0] * k, 1), min(c[1] * k, 1), min(c[2] * k, 1), 1.0)


def mix(a, b, t):
    return tuple(a[i] + (b[i] - a[i]) * t for i in range(3)) + (1.0,)


MATERIALS = ['plain', 'timber', 'glass', 'tin']


class Model:
    def __init__(self):
        self.bm = bmesh.new()
        # Exported as a custom attribute, _COLOR: the exporter's own vertex colours depend on how a material is wired.
        self.col = self.bm.loops.layers.float_color.new('_COLOR')
        self.uv = self.bm.loops.layers.uv.new('UVMap')

    @staticmethod
    def blender(p):
        return Vector((p[0], -p[2], p[1]))

    def face(self, pts, cols, uvs, mat, verts=None, smooth=False):
        vs = verts or [self.bm.verts.new(self.blender(p)) for p in pts]
        f = self.bm.faces.new(vs)
        f.material_index = MATERIALS.index(mat)
        f.smooth = smooth
        for loop, c, uv in zip(f.loops, cols, uvs):
            loop[self.col] = c
            loop[self.uv].uv = uv
        return f

    def hexa(self, c, col, mat, grain=(0, 1, 0), cols=None):
        """
        A six-sided piece from its eight corners (c[0..3] the bottom ring, c[4..7] the top, the same order), in one colour
        (or a colour per corner, `cols`). UVs in metres-ish along the grain (u) and across it (v), for the timber's streaks
        and the roof's ribs.
        """
        c = [Vector(p) for p in c]
        g = Vector(grain).normalized()
        quads = [(0, 3, 2, 1), (4, 5, 6, 7), (0, 1, 5, 4), (1, 2, 6, 5), (2, 3, 7, 6), (3, 0, 4, 7)]
        mid = sum(c, Vector()) / 8
        for q in quads:
            pts = [c[i] for i in q]
            n = (pts[1] - pts[0]).cross(pts[2] - pts[0])
            if n.length < 1e-9:
                n = (pts[2] - pts[1]).cross(pts[3] - pts[1])
            n.normalize()
            # Outward.
            if n.dot(sum(pts, Vector()) / 4 - mid) < 0:
                pts.reverse()
                q = tuple(reversed(q))
                n = -n
            w = n.cross(g)
            if w.length < 0.3:
                w = n.cross(Vector((1, 0, 0)) if abs(n.x) < 0.9 else Vector((0, 0, 1)))
            w.normalize()
            uvs = [(p.dot(g), p.dot(w)) for p in pts]
            self.face(pts, [cols[i] for i in q] if cols else [col] * 4, uvs, mat)

    def box(self, lo, hi, col, mat='plain', grain=None):
        """An axis-aligned box from its low and high corners; the grain runs along its longest side."""
        x0, y0, z0 = lo
        x1, y1, z1 = hi
        size = (x1 - x0, y1 - y0, z1 - z0)
        if grain is None:
            k = max(range(3), key=lambda i: size[i])
            grain = tuple(1 if i == k else 0 for i in range(3))
        self.hexa([(x0, y0, z0), (x1, y0, z0), (x1, y0, z1), (x0, y0, z1),
                   (x0, y1, z0), (x1, y1, z0), (x1, y1, z1), (x0, y1, z1)], col, mat, grain)

    def beam(self, a, b, size, col, mat='timber', up=(0, 1, 0)):
        """A square-ish beam from a to b (its centre line), `size` (width, height) across it."""
        a, b = Vector(a), Vector(b)
        d = (b - a).normalized()
        side = d.cross(Vector(up))
        if side.length < 1e-6:
            side = d.cross(Vector((1, 0, 0)))
        side.normalize()
        upv = side.cross(d).normalized()
        sw, sh = side * size[0] / 2, upv * size[1] / 2
        ring = lambda p: [p - sw - sh, p + sw - sh, p + sw + sh, p - sw + sh]
        r0, r1 = ring(a), ring(b)
        # hexa wants the bottom ring then the top: here the two ends.
        self.hexa([r0[0], r0[1], r0[2], r0[3], r1[0], r1[1], r1[2], r1[3]], col, mat, tuple(d))

    def cylinder(self, centre, radius, y0, y1, sides, col, mat='timber'):
        """An upright cylinder, smooth round its side (shared vertices), flat caps."""
        cx, cz = centre
        ring = lambda y: [self.bm.verts.new(self.blender((cx + radius * math.cos(a), y, cz + radius * math.sin(a))))
                          for a in (2 * math.pi * i / sides for i in range(sides))]
        lo, hi = ring(y0), ring(y1)
        circ = 2 * math.pi * radius
        for i in range(sides):
            j = (i + 1) % sides
            # Wound to face out.
            self.face(None, [col] * 4, [(y0, circ * i / sides), (y1, circ * i / sides), (y1, circ * (i + 1) / sides),
                                        (y0, circ * (i + 1) / sides)], mat, verts=[lo[i], hi[i], hi[j], lo[j]], smooth=True)
        cap = lambda vs: self.face(None, [col] * sides, [(0, 0)] * sides, 'plain', verts=vs)
        cap(list(reversed(hi)))
        cap(lo)

    def finish(self, name):
        mesh = bpy.data.meshes.new(name)
        self.bm.to_mesh(mesh)
        self.bm.free()
        for m in MATERIALS:
            mat = bpy.data.materials.get(m) or bpy.data.materials.new(m)
            mesh.materials.append(mat)
        obj = bpy.data.objects.new(name, mesh)
        bpy.context.scene.collection.objects.link(obj)
        return obj


# Main wall footprint 12 x 8 m. Ridge runs along x; front double doors meet z=+4.
# Roof: a steep lower pitch and shallow upper pitch, with a small hay dormer and ridge vent.
PROFILE = [(0.0, 7.35), (2.25, 6.5), (4.35, 4.12)]


def roof_y(z):
    z = abs(z)
    a, b = (PROFILE[:2] if z <= 2.25 else PROFILE[1:])
    return a[1] + (b[1] - a[1]) * (z - a[0]) / (b[0] - a[0])


def build():
    m = Model()
    rng = random.Random(210)
    wood = [lin(c) for c in (0xa68760, 0xad9069, 0x9d805d, 0xb19773, 0xa98c66)]
    trim, roof, dark = lin(0xeee4ca), lin(0x7b897d), lin(0x62523c)
    board = lambda: shade(rng.choice(wood), rng.uniform(0.97, 1.03))
    # A low stone foundation with broad blocks; the front threshold is flush with the ground.
    stones = [lin(c) for c in (0xaba28c, 0xb4a68c, 0x968f7e)]
    for z in (-4, 4):
        for i in range(16):
            a, b = -6 + i * .75, -6 + (i+1)*.75
            if z > 0:
                if a >= -1.8 and b <= 1.8:
                    continue
                if a < -1.8 < b:
                    b = -1.8
                if a < 1.8 < b:
                    a = 1.8
            m.box((a, 0, z-.08), (b-.018, .36, z+.08), rng.choice(stones))
    for x in (-6, 6):
        for i in range(10):
            z = -4+i*.8
            m.box((x-.08, 0, z), (x+.08, .36, z+.78), rng.choice(stones))
    # Coplanar broad planks, with the front entrance genuinely cut out.
    for z in (-4, 4):
        for i in range(40):
            a, b = -6+i*.3, -6+(i+1)*.3
            low = 3.65 if z > 0 and -1.801 <= a and b <= 1.801 else .36
            m.box((a, low, z-.055), (b, 4.5, z+.015), board(), 'timber', (0,1,0))
    # The end walls follow all four roof pitches.
    cuts = [-4, -2.25, 0, 2.25, 4]
    for x in (-6, 6):
        for c, d in zip(cuts, cuts[1:]):
            n = math.ceil((d-c)/.3)
            for i in range(n):
                a, b = c+(d-c)*i/n, c+(d-c)*(i+1)/n
                m.hexa([(x-.04,.36,a),(x+.04,.36,a),(x+.04,.36,b),(x-.04,.36,b),
                        (x-.04,roof_y(a),a),(x+.04,roof_y(a),a),(x+.04,roof_y(b),b),(x-.04,roof_y(b),b)], board(),'timber')
    for x in (-6,6):
        for z in (-4,4):
            m.box((x-.09,.32,z-.09),(x+.09,4.47,z+.09),trim,'timber')
    for z in (-4.06,4.06):
        m.box((-6.08,4.27,z-.06),(6.08,4.45,z+.06),trim,'timber')
    # Barn doors, cream ledges and braces; understated ironwork in warm bronze.
    for side in (-1,1):
        x0, x1 = (-1.8, -.025) if side < 0 else (.025,1.8)
        for i in range(6):
            a,b=x0+(x1-x0)*i/6,x0+(x1-x0)*(i+1)/6
            m.box((a,.05,3.94),(b,3.65,4.025),shade(board(),.84),'timber',(0,1,0))
        for y in (.4,3.3):
            m.box((x0+.07,y-.075,4.025),(x1-.07,y+.075,4.1),trim,'timber')
        m.beam((side*1.65,.48,4.07),(side*.16,3.22,4.07),(.14,.065),trim,up=(0,0,1))
        m.box((side*.13-.035,1.65,4.10),(side*.13+.035,1.95,4.17),dark)
    for x in (-1.88,1.88):
        m.box((x-.08,.02,4.01),(x+.08,3.65,4.16),trim,'timber')
    m.box((-1.96,3.65,4.01),(1.96,3.85,4.16),trim,'timber')
    # Tin sheets: leave space for the front dormer instead of running the roof through its opening.
    xcuts = [-6.4,-5.6,-4.8,-4,-3.2,-2.4,-1.5,0,1.5,2.4,3.2,4,4.8,5.6,6.4]
    for side in (-1,1):
        for a,b in zip(xcuts,xcuts[1:]):
            for za,zb in ((0,2.1),(2.1,2.25),(2.25,4.35)):
                if side>0 and a>=-1.5 and b<=1.5 and za>=2.1:
                    continue
                z0,z1=side*za,side*zb
                pts=[(a,roof_y(z0),z0),(b,roof_y(z0),z0),(b,roof_y(z1),z1),(a,roof_y(z1),z1)]
                m.hexa(pts+[(x,y+.065,z) for x,y,z in pts],shade(roof,rng.uniform(.94,1.06)),'tin',(0,roof_y(z1)-roof_y(z0),z1-z0))
    for x in (-6.43,6.43):
        for side in (-1,1):
            for (za,ya),(zb,yb) in zip(PROFILE,PROFILE[1:]):
                m.beam((x,ya-.035,side*za),(x,yb-.035,side*zb),(.1,.18),trim)
    m.box((-6.44,7.35,-.12),(6.44,7.45,.12),shade(roof,.9),'tin',(1,0,0))
    # Projecting hay dormer. Its cheeks spring out of the lower roof; the back meets the main slope.
    def dormer_y(x,z):
        return 6.55 + (6.08-6.55)*(z-2.1)/2.3 + .93*(1-abs(x)/1.5)
    # Front facade in short planks around an actual loft opening.
    for i in range(12):
        a,b=-1.5+i*.25,-1.5+(i+1)*.25
        spans=[(4.45,None)] if a<-.801 or b>.801 else [(4.45,4.85),(6.13,None)]
        # Edges of opening align to 0.75 m to preserve a clean rectangle.
        if a>=-.75 and b<=.75:
            spans=[(4.45,4.85),(6.13,None)]
        for lo,hi in spans:
            ya,yb=(dormer_y(a,4.18),dormer_y(b,4.18)) if hi is None else (hi,hi)
            m.hexa([(a,lo,4.10),(b,lo,4.10),(b,lo,4.18),(a,lo,4.18),
                    (a,ya,4.10),(b,yb,4.10),(b,yb,4.18),(a,ya,4.18)],board(),'timber')
    # Hay visible as a generous pale-gold mass, recessed behind the open cream frame.
    m.box((-.75,4.85,3.7),(.75,6.13,3.98),lin(0xd9bc70),'timber',(1,0,0))
    for x in (-.83,.83):
        m.box((x-.08,4.77,4.18),(x+.08,6.23,4.27),trim,'timber')
    for y in (4.8,6.2):
        m.box((-.91,y-.06,4.18),(.91,y+.06,4.31),trim,'timber')
    # One open wooden shutter folded beside the loft, so the yellow opening reads at distance.
    m.box((.96,4.87,4.20),(1.45,6.10,4.28),shade(wood[0],.83),'timber')
    for x in (-1.5,1.5):
        # Lower edge follows the gambrel break so no cheek sits below the tin.
        for za,zb in ((2.1,2.25),(2.25,4.18)):
            m.hexa([(x-.035,roof_y(za),za),(x+.035,roof_y(za),za),(x+.035,roof_y(zb),zb),(x-.035,roof_y(zb),zb),
                    (x-.035,dormer_y(x,za),za),(x+.035,dormer_y(x,za),za),
                    (x+.035,dormer_y(x,zb),zb),(x-.035,dormer_y(x,zb),zb)],wood[1],'timber')
    # Close the rear triangle above the main roof: it is visible from the opposite valley view.
    for a,b in ((-1.5,0),(0,1.5)):
        m.hexa([(a,6.53,2.07),(b,6.53,2.07),(b,6.53,2.13),(a,6.53,2.13),
                (a,dormer_y(a,2.1),2.07),(b,dormer_y(b,2.1),2.07),
                (b,dormer_y(b,2.1),2.13),(a,dormer_y(a,2.1),2.13)],wood[1],'timber')
    for side in (-1,1):
        pts=[(0,dormer_y(0,2.1),2.1),(side*1.67,dormer_y(side*1.67,2.1),2.1),
             (side*1.67,dormer_y(side*1.67,4.43),4.43),(0,dormer_y(0,4.43),4.43)]
        m.hexa(pts+[(x,y+.065,z) for x,y,z in pts],roof,'tin',(side,-.62,0))
        m.beam((0,dormer_y(0,4.43),4.44),(side*1.69,dormer_y(side*1.69,4.43),4.44),(.08,.15),trim)
    # Small louvred ridge vent placed away from the dormer, with a hipped cap.
    cx=-3.2
    m.box((cx-.46,7.23,-.44),(cx+.46,7.96,.44),shade(wood[0],.75),'timber')
    for y in (7.47,7.64,7.81):
        for z in (-.47,.47):
            m.box((cx-.45,y,z-.035),(cx+.45,y+.07,z+.035),trim,'timber')
        for x in (cx-.47,cx+.47):
            m.box((x-.035,y,-.45),(x+.035,y+.07,.45),trim,'timber')
    for x in (cx-.47,cx+.47):
        for z in (-.47,.47):
            m.box((x-.05,7.25,z-.05),(x+.05,8,z+.05),trim,'timber')
    ring=[(cx-.65,7.98,-.65),(cx+.65,7.98,-.65),(cx+.65,7.98,.65),(cx-.65,7.98,.65)]
    # Winding is outward and the cap has real thickness at the eaves.
    for i in range(4):
        p,q=ring[i],ring[(i+1)%4]
        m.face([q,p,(cx,8.43,0)],[roof]*3,[(0,0),(1,0),(.5,1)],'tin')
    return m.finish('barn')


def previews(obj, directory):
    """Blender-only inspection rig, installed after export so lights/ground never enter the asset."""
    directory = Path(directory)
    directory.mkdir(parents=True, exist_ok=True)
    scene = bpy.context.scene
    scene.render.engine = 'CYCLES'
    scene.cycles.samples = 16
    scene.render.resolution_x = 800
    scene.render.resolution_y = 680
    scene.render.resolution_percentage = 100
    scene.world = bpy.data.worlds.new('preview sky')
    scene.world.use_nodes = True
    scene.world.node_tree.nodes['Background'].inputs['Color'].default_value = (.65,.74,.82,1)
    scene.world.node_tree.nodes['Background'].inputs['Strength'].default_value = .7
    scene.view_settings.view_transform = 'Standard'
    # Preview uses the exact exported linear colour layer; production adds its own ink and grain.
    for mat in obj.data.materials:
        mat.use_nodes=True
        nodes=mat.node_tree.nodes
        bsdf=nodes.get('Principled BSDF')
        attr=nodes.new('ShaderNodeAttribute')
        attr.attribute_name='_COLOR'
        mat.node_tree.links.new(attr.outputs['Color'],bsdf.inputs['Base Color'])
        bsdf.inputs['Roughness'].default_value=.85
    bpy.ops.mesh.primitive_plane_add(size=200, location=(0,0,-.025))
    floor=bpy.context.object
    mat=bpy.data.materials.new('preview ground')
    mat.diffuse_color=(.50,.55,.39,1)
    floor.data.materials.append(mat)
    bpy.ops.object.light_add(type='AREA',location=(-8,-10,16))
    bpy.context.object.data.energy=2200
    bpy.context.object.data.shape='DISK'
    bpy.context.object.data.size=10
    points=[obj.matrix_world @ Vector(c) for c in obj.bound_box]
    lo=Vector(tuple(min(p[i] for p in points) for i in range(3)))
    hi=Vector(tuple(max(p[i] for p in points) for i in range(3)))
    target=(lo+hi)/2
    span=max(hi.x-lo.x,hi.y-lo.y,hi.z-lo.z)
    bpy.ops.object.camera_add()
    cam=bpy.context.object
    cam.data.type='ORTHO'
    cam.data.ortho_scale=span*1.55
    cam.data.lens=45
    scene.camera=cam
    for label,sx,sz in [('front-right',1,1),('rear-left',-1,-1)]:
        # Model.blender maps game +z into Blender -y. Elevation is precisely 30 degrees.
        offset=Vector((sx/math.sqrt(2),-sz/math.sqrt(2),math.tan(math.pi/6))) * span*2.5
        cam.location=target+offset
        cam.rotation_euler=(target-cam.location).to_track_quat('-Z','Y').to_euler()
        scene.render.filepath=str(directory / f'barn-{label}.png')
        bpy.ops.render.render(write_still=True)


def export():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    obj=build()
    bpy.context.view_layer.objects.active=obj
    obj.select_set(True)
    Path(OUT).mkdir(parents=True,exist_ok=True)
    path=str(Path(OUT)/'barn.glb')
    bpy.ops.export_scene.gltf(
        filepath=path, export_format='GLB', use_selection=True, export_yup=True, export_apply=False,
        export_normals=True, export_texcoords=True, export_materials='EXPORT', export_vertex_color='NONE',
        export_all_vertex_colors=False, export_attributes=True, export_tangents=False, export_animations=False, export_extras=False,
    )
    obj.data.calc_loop_triangles()
    assert len(obj.data.loop_triangles)<15000, 'Farm asset exceeds triangle budget'
    print(f'wrote {path}: {len(obj.data.loop_triangles)} triangles')
    for arg in ARGS[1:]:
        if arg.startswith('--preview='):
            previews(obj,arg.split('=',1)[1])


if __name__ == '__main__':
    export()
