# Deterministic farm asset. Game frame: x right, y up, front +z, metres.
# Add --preview after the output directory to render two 30-degree orthographic views.
# Run: flatpak run org.blender.Blender -b --factory-startup --python $PWD/tools/blender/farmhouse.py -- $PWD/src/scenes/models
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


def build():
    m = Model()
    rng = random.Random(271)
    cream, stone, sage = lin(0xeee0bd), lin(0xb5a48c), lin(0x719785)
    timber, terra = lin(0x806148), lin(0xb86845)
    # Main footprint is centred on the origin. Long ridge runs along x.
    m.box((-4.5, 0, -3.25), (4.5, 5.65, 3.25), cream)
    # Low stone plinth with quiet, coplanar colour changes rather than deep mortar.
    for z in (-3.29, 3.29):
        for i in range(12):
            x = -4.55 + i * 9.1 / 12
            m.box((x, 0, z - 0.06), (x + 9.1 / 12, 0.46, z + 0.06), shade(stone, rng.uniform(.88, 1.08)))
    for x in (-4.54, 4.54):
        m.box((x-.07, 0, -3.25), (x+.07, .46, 3.25), stone)
        for z in (-3.25, 3.25):
            for row in range(10):
                w = .32 if row % 2 else .5
                m.box((x-w/2, .48+row*.51, z-.19), (x+w/2, .91+row*.51, z+.19), shade(stone, 1.05 if row%2 else .97))
    # Solid triangular gables, with flat outward-facing normals.
    for sx in (-1, 1):
        x = sx*4.5
        p = [(x, 5.65, -3.25), (x, 7.9, 0), (x, 5.65, 3.25)]
        if sx < 0: p.reverse()
        m.face(p, [cream]*3, [(0,0)]*3, 'plain')
    # Windows are shallow inset-colour panels with proud surrounds; the wall behind stays closed.
    def window(cx, cy, cz, side=False, shutters=True, width=1.05, height=1.32):
        def pt(u, v, d):
            return (cx+d, cy+v, cz-u) if side else (cx+u, cy+v, cz+d)
        n = (1,0,0) if side else (0,0,1 if cz>0 else -1)
        # Orient back-facing window panels outward as well.
        def pos(u,v,d): return pt(u,v,d if side or cz>0 else -d)
        def bar(a,b,size,col=sage): m.beam(pos(*a),pos(*b),size,col,up=n)
        w,h=width/2,height/2
        pts=[pos(-w,-h,.035),pos(w,-h,.035),pos(w,h,.035),pos(-w,h,.035)]
        if not side and cz<0: pts.reverse()
        m.face(pts,[lin(0x597c83)]*4,[(0,0),(1,0),(1,1),(0,1)],'glass')
        for u in (-w,w): bar((u,-h,.085),(u,h,.085),(.095,.09))
        for v in (-h,h): bar((-w-.05,v,.085),(w+.05,v,.085),(.095,.09))
        bar((0,-h,.075),(0,h,.075),(.065,.07))
        bar((-w,0,.075),(w,0,.075),(.065,.07))
        bar((-w-.16,-h-.12,.13),(w+.16,-h-.12,.13),(.17,.16),stone)
        if shutters:
            for sign in (-1,1):
                a,b=sign*(w+.12),sign*(w+.47)
                for k in range(3):
                    u=a+(b-a)*(k+.5)/3
                    bar((u,-h,.09),(u,h,.09),(.115,.09),shade(sage,.88+k*.07))
                for v in (-h+.16,h-.16):
                    bar((a,v,.16),(b,v,.16),(.09,.07),shade(sage,.85))
    for z in (-3.25,3.25):
        for x in (-2.8,0,2.8):
            window(x,4.35,z)
            if x or z<0: window(x,1.85,z)
    for x in (-4.5,4.5):
        # Mirror the construction at the left side, preserving the material/UV pipeline.
        start=set(m.bm.verts)
        for z in (-1.65,1.65): window(4.5,4.3,z,True,False)
        window(4.5,6.25,0,True,False,.75,.9)
        if x<0:
            mirrored = set(m.bm.verts)-start
            for v in mirrored: v.co.x=-v.co.x
            # Reflection reverses winding.
            for f in list(m.bm.faces):
                if all(v in mirrored for v in f.verts): f.normal_flip()
    # Entry and two broad stone steps. Path meets (0, 0, 4.6).
    m.box((-.63,.23,3.255),(.63,2.55,3.31),lin(0x527c70),'timber')
    for x in (-.71,.71): m.box((x-.06,.2,3.27),(x+.06,2.66,3.43),stone)
    m.box((-.77,2.55,3.27),(.77,2.7,3.43),stone)
    for y in (.73,1.75):
        m.box((-.46,y-.32,3.31),(.46,y+.32,3.365),shade(sage,.83),'timber')
    m.box((.38,1.21,3.36),(.48,1.32,3.44),lin(0xb39254))
    m.box((-.95,0,3.25),(.95,.14,4.6),stone)
    m.box((-.82,.14,3.25),(.82,.28,4.22),shade(stone,1.08))
    for x in (-1.06,1.06):
        m.box((x-.075,.1,4.22),(x+.075,2.55,4.37),timber,'timber')
        m.beam((x,2.03,4.3),(x,2.58,3.82),(.11,.11),timber)
    m.beam((-1.17,2.52,4.29),(1.17,2.52,4.29),(.16,.18),timber)
    # Courses are shallow overlapping steps, with broad clay tone variation.
    def slope(x0,x1,z0,z1,y0,y1,col):
        m.hexa([(x0,y0,z0),(x1,y0,z0),(x1,y1,z1),(x0,y1,z1),
                (x0,y0+.075,z0),(x1,y0+.075,z0),(x1,y1+.075,z1),(x0,y1+.075,z1)],col,'plain')
    for sign in (-1,1):
        for row in range(10):
            a,b=row*3.65/10,(row+1)*3.65/10+.035
            for i in range(14):
                x0=-4.85+i*9.7/14
                slope(x0,x0+9.7/14,sign*a,sign*b,7.9-a*2.25/3.25,7.9-b*2.25/3.25,shade(terra,rng.uniform(.9,1.1)))
        for x in (-4.87,4.87):
            m.beam((x,7.86,0),(x,5.3,sign*3.7),(.13,.18),timber)
    for i in range(22):
        m.box((-4.9+i*.445,7.94,-.12),(-4.9+(i+1)*.445,8.06,.12),shade(terra,1.07))
    slope(-1.35,1.35,3.18,4.65,3.04,2.59,shade(terra,.91))
    # Single-storey kitchen to x+, a slate lean-to that breaks the silhouette.
    m.box((4.4,0,-2.3),(6.8,2.7,2.1),shade(cream,.96))
    m.box((4.4,0,-2.35),(6.85,.4,2.15),stone)
    for row in range(6):
        a,b=4.35+row*.46,4.35+(row+1)*.46+.035
        ya,yb=3.55-(a-4.35)*.32,3.55-(b-4.35)*.32
        m.hexa([(a,ya,-2.6),(b,yb,-2.6),(b,yb,2.4),(a,ya,2.4),
                (a,ya+.08,-2.6),(b,yb+.08,-2.6),(b,yb+.08,2.4),(a,ya+.08,2.4)],shade(lin(0x74838a),rng.uniform(.9,1.08)),'plain')
    window(5.7,1.65,2.1,False,False,.85,1)
    window(6.8,1.65,0,True,False,.95,1)
    # Warm stone chimney and two terracotta pots; capped but no smoke.
    for row in range(6):
        m.box((-3.35,6.8+row*.26,-1.18),(-2.65,7.06+row*.26,-.48),shade(stone,.88+row%2*.12))
    m.box((-3.48,8.28,-1.31),(-2.52,8.43,-.35),shade(stone,.94))
    for x in (-3.2,-2.8):
        m.cylinder((x,-.83),.13,8.43,8.78,10,shade(terra,.8),'plain')
        m.cylinder((x,-.83),.16,8.7,8.8,10,terra,'plain')
    return m.finish('farmhouse')

def export(name):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    obj = build()
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    Path(OUT).mkdir(parents=True, exist_ok=True)
    path = str(Path(OUT) / (name + '.glb'))
    bpy.ops.export_scene.gltf(
        filepath=path, export_format='GLB', use_selection=True, export_yup=True, export_apply=False,
        export_normals=True, export_texcoords=True, export_materials='EXPORT', export_vertex_color='NONE',
        export_all_vertex_colors=False, export_attributes=True, export_tangents=False, export_animations=False, export_extras=False)
    obj.data.calc_loop_triangles()
    pts = [obj.matrix_world @ v.co for v in obj.data.vertices]
    print(name, 'triangles', len(obj.data.loop_triangles), 'game bounds',
          [(min(p.x for p in pts), max(p.x for p in pts)),
           (min(p.z for p in pts), max(p.z for p in pts)),
           (min(-p.y for p in pts), max(-p.y for p in pts))])
    if '--preview' not in ARGS:
        return
    # Preview-only shading uses exactly the exported linear _COLOR; never exported.
    for mat in obj.data.materials:
        mat.use_nodes = True
        nodes = mat.node_tree.nodes
        attr = nodes.new('ShaderNodeAttribute')
        attr.attribute_name = '_COLOR'
        bsdf = nodes.get('Principled BSDF')
        mat.node_tree.links.new(attr.outputs['Color'], bsdf.inputs['Base Color'])
        bsdf.inputs['Roughness'].default_value = 0.85
    scene = bpy.context.scene
    scene.render.engine = 'CYCLES'
    scene.render.threads_mode = 'FIXED'
    scene.render.threads = 4
    scene.cycles.samples = 24
    scene.cycles.use_denoising = True
    scene.render.resolution_x = 880
    scene.render.resolution_y = 720
    scene.render.resolution_percentage = 100
    scene.world = bpy.data.worlds.new('warm daylight')
    scene.world.use_nodes = True
    scene.world.node_tree.nodes['Background'].inputs[0].default_value = (0.65, 0.74, 0.8, 1)
    scene.world.node_tree.nodes['Background'].inputs[1].default_value = 0.7
    scene.view_settings.view_transform = 'Standard'
    scene.view_settings.look = 'None'
    bpy.ops.mesh.primitive_plane_add(size=200, location=(0, 0, -0.025))
    ground = bpy.data.materials.new('preview ground')
    ground.diffuse_color = (0.25, 0.31, 0.21, 1)
    bpy.context.object.data.materials.append(ground)
    bpy.ops.object.light_add(type='AREA', location=(-7, -10, 15))
    bpy.context.object.data.energy = 1900
    bpy.context.object.data.shape = 'DISK'
    bpy.context.object.data.size = 8
    target = Vector((1 if name == 'farmhouse' else 0, 0, 3.4 if name == 'farmhouse' else 1.1))
    scale = 18 if name == 'farmhouse' else 3.9
    directory = Path(__file__).resolve().parents[2] / 'out' / 'models'
    directory.mkdir(parents=True, exist_ok=True)
    for label, sx, sz in [('front-right', 1, 1), ('back-left', -1, -1)]:
        # 30 degrees down, diagonally between cardinal views.
        direction = Vector((sx / math.sqrt(2), -sz / math.sqrt(2), math.tan(math.radians(30))))
        bpy.ops.object.camera_add(location=target + direction * 24)
        camera = bpy.context.object
        camera.rotation_euler = (target - camera.location).to_track_quat('-Z', 'Y').to_euler()
        camera.data.type = 'ORTHO'
        camera.data.ortho_scale = scale
        scene.camera = camera
        scene.render.filepath = str(directory / (name + '-' + label + '.png'))
        bpy.ops.render.render(write_still=True)
    print('wrote', path)

export('farmhouse')
