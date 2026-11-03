# Deterministic farm asset. Game frame: x right, y up, front +z, metres.
# Add --preview after the output directory to render two 30-degree orthographic views.
# Run: flatpak run org.blender.Blender -b --factory-startup --python $PWD/tools/blender/well.py -- $PWD/src/scenes/models
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
    m=Model()
    rng=random.Random(92)
    stone,timber,clay=lin(0xb9ab91),lin(0x886747),lin(0xb56847)
    # Real open ring: staggered wedge stones, never a capped cylinder.
    def ring(ro,ri,y0,y1,count,col,offset=0):
        for i in range(count):
            a=2*math.pi*(i+offset)/count+.007
            b=2*math.pi*(i+1+offset)/count-.007
            pts=lambda y:[(r*math.cos(t),y,r*math.sin(t)) for r,t in [(ri,a),(ro,a),(ro,b),(ri,b)]]
            m.hexa(pts(y0)+pts(y1),shade(col,rng.uniform(.89,1.08)),'plain')
    for row in range(3): ring(.7,.49,row*.24,(row+1)*.24,14,stone,.5*(row%2))
    ring(.76,.46,.72,.87,14,shade(stone,1.06))
    m.cylinder((0,0),.485,.04,.06,24,lin(0x405c58),'plain')
    for x in (-.91,.91):
        m.box((x-.11,0,-.14),(x+.11,1.84,.08),timber,'timber')
        m.box((x-.16,0,-.19),(x+.16,.12,.13),shade(stone,.9))
        m.beam((x,1.47,-.03),(x*.55,1.92,-.03),(.09,.09),timber)
    # Ridge along z, gable and handle facing +z.
    for sign in (-1,1):
        for row in range(5):
            a,b=row*.24,(row+1)*.24+.025
            ya,yb=2.35-a*.49,2.35-b*.49
            m.hexa([(sign*a,ya,-.73),(sign*b,yb,-.73),(sign*b,yb,.73),(sign*a,ya,.73),
                    (sign*a,ya+.06,-.73),(sign*b,yb+.06,-.73),(sign*b,yb+.06,.73),(sign*a,ya+.06,.73)],shade(clay,rng.uniform(.92,1.08)),'plain')
        for z in (-.76,.76):
            m.beam((0,2.33,z),(sign*1.25,1.72,z),(.085,.13),timber)
    m.beam((-.99,1.76,0),(.99,1.76,0),(.14,.16),timber)
    m.box((-.085,2.38,-.77),(.085,2.44,.77),shade(clay,1.08))
    # Winch spindle along x. Faceted round section, metre UVs along its grain.
    def axle(x0,x1,y,z,r,col):
        count=12
        for i in range(count):
            a,b=i*2*math.pi/count,(i+1)*2*math.pi/count
            pts=[(x0,y+r*math.cos(a),z+r*math.sin(a)),(x1,y+r*math.cos(a),z+r*math.sin(a)),
                 (x1,y+r*math.cos(b),z+r*math.sin(b)),(x0,y+r*math.cos(b),z+r*math.sin(b))]
            m.face(list(reversed(pts)),[col]*4,list(reversed([(x0,r*a),(x1,r*a),(x1,r*b),(x0,r*b)])),'timber')
    axle(-1.07,1.1,1.45,0,.1,shade(timber,.85))
    # Crank is offset towards the front so its silhouette reads from +z.
    m.beam((1.1,1.45,0),(1.1,1.45,.35),(.085,.085),shade(timber,.82))
    axle(1.06,1.29,1.45,.35,.065,timber)
    # Rope winds round the spindle; hanging bucket clears the well's mouth.
    rope=lin(0xb6a077)
    for x in (-.13,-.065,0,.065,.13):
        for i in range(12):
            a,b=i*math.pi/6,(i+1)*math.pi/6
            m.beam((x,1.45+.12*math.cos(a),.12*math.sin(a)),(x,1.45+.12*math.cos(b),.12*math.sin(b)),(.025,.025),rope,'plain')
    m.beam((0,1.43,.12),(0,1.13,.12),(.035,.035),rope,'plain')
    # Bucket has an open top, tapered staves and broad hoops.
    for i in range(12):
        a,b=i*math.pi/6,(i+1)*math.pi/6
        p=lambda r,y,t:(r*math.cos(t),y,.12+r*math.sin(t))
        pts=[p(.12,.88,a),p(.12,.88,b),p(.18,1.11,b),p(.18,1.11,a)]
        m.face(list(reversed(pts)),[shade(timber,.9+i%3*.08)]*4,[(0,.23),(.08,.23),(.08,0),(0,0)],'timber')
    m.cylinder((0,.12),.12,.88,.90,12,shade(timber,.8),'plain')
    # Hoops follow the bucket taper and have thickness.
    for y,r in ((.91,.133),(1.075,.178)):
        for i in range(12):
            a,b=i*math.pi/6,(i+1)*math.pi/6
            m.beam((r*math.cos(a),y,.12+r*math.sin(a)),(r*math.cos(b),y,.12+r*math.sin(b)),(.035,.035),lin(0x797b68),'plain')
    m.beam((-.16,1.08,.12),(0,1.23,.12),(.035,.035),rope,'plain')
    m.beam((.16,1.08,.12),(0,1.23,.12),(.035,.035),rope,'plain')
    return m.finish('well')

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
    scene.cycles.samples = 16
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

export('well')
