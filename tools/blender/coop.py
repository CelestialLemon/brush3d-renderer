# Deterministic farm model, in metres: x right, y up, +z front; footprint centred at ground y=0.
# Build: flatpak run org.blender.Blender -b --factory-startup --python $PWD/tools/blender/coop.py -- $PWD/src/scenes/models
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


# Raised 2.2 x 1.6 m hen house. +z pop-hole/ramp; +x external nesting box.
# Overall envelope includes the nesting lid and the ground-reaching ramp (see report).
def build():
    m=Model()
    rng=random.Random(211)
    blue=[lin(c) for c in (0xb5c9ce,0xadc3ca,0xbcd0d2,0xb1c6cc)]
    cream,wood,tin=lin(0xf0e5ca),lin(0xa18a63),lin(0x85968b)
    shadow=lin(0x655744)
    board=lambda: rng.choice(blue)
    # Four short stout legs and a floor platform, all rooted at y=0.
    for x in (-.92,.92):
        for z in (-.64,.64):
            m.box((x-.075,0,z-.075),(x+.075,.5,z+.075),wood,'timber')
    m.box((-1.13,.35,-.83),(1.13,.45,.83),wood,'timber')
    # Horizontal weatherboards with subdued alternating tones; front pop-hole is genuinely open.
    for i in range(6):
        y0,y1=.45+i*.16,.45+(i+1)*.16
        for z in (-.8,.8):
            spans=[(-1.1,1.1)]
            if z>0 and y0<.94:
                spans=[(-1.1,-.55),(-.05,1.1)]
                if y1 > .94:
                    m.box((-.55,.94,z-.035),(-.05,y1,z+.025),board(),'timber',(1,0,0))
            for a,b in spans:
                m.box((a,y0,z-.035),(b,y1,z+.025),board(),'timber',(1,0,0))
        for x in (-1.1,1.1):
            m.box((x-.025,y0,-.8),(x+.025,y1,.8),board(),'timber',(0,0,1))
    # Gables in vertical boards under a modest front-to-back ridge.
    def roof_y(x):
        return 1.85-.44*abs(x)/1.1
    for z in (-.8,.8):
        for i in range(10):
            a,b=-1.1+i*.22,-1.1+(i+1)*.22
            m.hexa([(a,1.41,z-.035),(b,1.41,z-.035),(b,1.41,z+.025),(a,1.41,z+.025),
                    (a,roof_y(a),z-.035),(b,roof_y(b),z-.035),(b,roof_y(b),z+.025),(a,roof_y(a),z+.025)],board(),'timber')
    for x in (-1.1,1.1):
        for z in (-.8,.8):
            m.box((x-.055,.44,z-.055),(x+.055,1.42,z+.055),cream,'timber')
    # A soft brown inner landing is visible through the small entrance, never a black painted rectangle.
    m.box((-.55,.43,.4),(-.05,.48,.84),wood,'timber')
    m.box((-.55,.47,.21),(-.05,.94,.27),shadow)
    for x in (-.60,0):
        m.box((x-.04,.44,.83),(x+.04,.94,.90),cream,'timber')
    m.box((-.64,.94,.83),(.04,1.04,.90),cream,'timber')
    # A simple little window beside the pop-hole. Blue-green glass, proud cream frame.
    m.box((.33,.85,.83),(.83,1.17,.845),lin(0x648c9b),'glass')
    for x in (.3,.85):
        m.box((x-.035,.855,.84),(x+.035,1.165,.915),cream,'timber')
    for y in (.82,1.2):
        m.box((.265,y-.035,.84),(.885,y+.035,.915),cream,'timber')
    m.box((.56,.85,.85),(.60,1.17,.91),cream,'timber')
    # Nesting box on the right-hand wall, divided into two broad compartments.
    m.box((1.08,.60,-.48),(1.64,1.03,.4),cream,'timber',(0,0,1))
    for z in (-.48,-.04,.4):
        m.box((1.63,.59,z-.025),(1.70,1.05,z+.025),wood,'timber')
    # Hinged sloping lid, high at the wall and low at its outer edge.
    pts=[(1.05,1.17,-.56),(1.76,1.04,-.56),(1.76,1.04,.48),(1.05,1.17,.48)]
    m.hexa(pts+[(x,y+.065,z) for x,y,z in pts],tin,'tin',(1,-.18,0))
    m.box((1.69,.82,-.12),(1.77,.94,.04),wood)
    # Rear cleaning hatch gives the back a clear, useful detail.
    m.box((-.57,.56,-.855),(.57,1.23,-.81),shade(wood,1.04),'timber')
    for x in (-.59,.59):
        m.box((x-.04,.575,-.91),(x+.04,1.225,-.85),cream,'timber')
    for y in (.54,1.26):
        m.box((-.63,y-.035,-.91),(.63,y+.035,-.85),cream,'timber')
    for x in (-.4,.4):
        m.box((x-.06,.83,-.94),(x+.06,.92,-.9),shadow)
    # Thin pitched tin roof with clear fascia and a ridge cap.
    for side in (-1,1):
        for i in range(4):
            za,zb=-.98+i*.49,-.98+(i+1)*.49
            pts=[(0,roof_y(0),za),(side*1.29,roof_y(1.29),za),
                 (side*1.29,roof_y(1.29),zb),(0,roof_y(0),zb)]
            m.hexa(pts+[(x,y+.045,z) for x,y,z in pts],shade(tin,rng.uniform(.96,1.04)),'tin',(side,-.4,0))
        for z in (-1.0,1.0):
            m.beam((0,1.83,z),(side*1.31,roof_y(1.31)-.02,z),(.065,.095),cream)
    m.box((-.075,1.85,-1.01),(.075,1.92,1.01),shade(tin,.9),'tin',(0,0,1))
    # Ramp reaches ground in front. Six chunky treads read even at the game camera's scale.
    pts=[(-.58,.435,.86),(-.02,.435,.86),(-.02,.055,2.02),(-.58,.055,2.02)]
    m.hexa([(x,y-.055,z) for x,y,z in pts]+pts,wood,'timber',(0,-.38,1.16))
    for i in range(6):
        z=.99+i*.18
        y=.435-(z-.86)*.38/1.16
        m.beam((-.57,y+.027,z),(-.03,y+.027,z),(.07,.055),shade(wood,.85))
    return m.finish('coop')


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
        scene.render.filepath=str(directory / f'coop-{label}.png')
        bpy.ops.render.render(write_still=True)


def export():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    obj=build()
    bpy.context.view_layer.objects.active=obj
    obj.select_set(True)
    Path(OUT).mkdir(parents=True,exist_ok=True)
    path=str(Path(OUT)/'coop.glb')
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
