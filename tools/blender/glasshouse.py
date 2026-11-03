# Deterministic model in game coordinates: x right, y up, front +z; metres.
# Build: flatpak run org.blender.Blender -b --factory-startup --python $PWD/tools/blender/glasshouse.py -- $PWD/src/scenes/models
# Add --preview to render two opposing 30-degree orthographic views to out/models/.
import math
import random
import sys
from pathlib import Path
import bmesh
import bpy
from mathutils import Vector
ARGS = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
OUT = Path(ARGS[0]) if ARGS else Path('.')

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


# Long ridge along x; the door is centred in the long wall facing +z.
# The game's glass finish is opaque sky-reflecting glass today. Interior geometry is
# retained for a future transparent finish; Blender previews show the actual interior.
W, D, EAVE, RIDGE = 7.0, 3.6, 2.2, 3.15

def build():
    m = Model()
    rng = random.Random(31)
    white, brick, mortar = lin(0xeee6d2), lin(0xb87958), lin(0xcbb99b)
    glass, wood, soil = lin(0x90b8b0), lin(0x9b7950), lin(0x695039)
    xs = [-3.5 + i for i in range(8)]
    def bar(a, b, size=0.075):
        m.beam(a, b, (size, size), white)
    def pane(pts):
        a,b,c = [Vector(p) for p in pts[:3]]
        axis = (b-a).normalized()
        other = (c-b).normalized()
        uvs = [(Vector(p).dot(axis),Vector(p).dot(other)) for p in pts]
        m.face(pts, [glass]*len(pts), uvs, 'glass')
        m.face(list(reversed(pts)), [glass]*len(pts), list(reversed(uvs)), 'glass')
    # Continuous pale mortar under three staggered courses of terracotta brick.
    for z in (-1.8,1.8):
        for lo,hi in ([(-3.5,3.5)] if z < 0 else [(-3.5,-0.54),(0.54,3.5)]):
            m.box((lo,0,z-.105),(hi,.6,z+.105),mortar)
            for row in range(3):
                x=lo
                while x < hi-.01:
                    end=min(hi,x+(0.25 if row%2 and x==lo else .5))
                    m.box((x+.012,row*.2+.015,z-.12),(end-.012,(row+1)*.2-.01,z+.12),shade(brick,.9+rng.random()*.2))
                    x=end
    for x in (-3.5,3.5):
        m.box((x-.105,0,-1.7),(x+.105,.6,1.7),mortar)
        for row in range(3):
            z=-1.7
            while z<1.69:
                end=min(1.7,z+(0.25 if row%2 and z==-1.7 else .5))
                m.box((x-.12,row*.2+.015,z+.012),(x+.12,(row+1)*.2-.01,end-.012),shade(brick,.9+rng.random()*.2))
                z=end
    for z in (-1.8,1.8):
        for x in xs:
            bar((x,.57,z),(x,EAVE,z),.09)
        for y in (.62,1.4,EAVE):
            for a,b in zip(xs,xs[1:]):
                if z>0 and a==-.5 and y<2: continue
                bar((a,y,z),(b,y,z),.08)
        for a,b in zip(xs,xs[1:]):
            for y0,y1 in ((.65,1.4),(1.4,EAVE)):
                pane([(a,y0,z),(b,y0,z),(b,y1,z),(a,y1,z)])
    # End walls and their triangular gables; roof bars sit above the panes.
    for x in (-3.5,3.5):
        for z in (0,):  # Corner posts already belong to the long walls.
            bar((x,.6,z),(x,RIDGE if z==0 else EAVE,z),.09)
        for y in (.62,1.4,EAVE): bar((x,y,-1.8),(x,y,1.8))
        for z0,z1 in ((-1.8,0),(0,1.8)):
            for y0,y1 in ((.65,1.4),(1.4,EAVE)):
                pane([(x,y0,z0),(x,y0,z1),(x,y1,z1),(x,y1,z0)])
            pane([(x,EAVE,z0),(x,EAVE,z1),(x,RIDGE,0)])
    for s in (-1,1):
        def p(x,t): return (x,RIDGE+(EAVE-RIDGE)*t,s*1.8*t)
        for x in xs: bar(p(x,0),p(x,1),.085)
        for t in ((0,.5,1) if s<0 else (.5,1)):
            a,b=Vector(p(-3.56,t)),Vector(p(3.56,t))
            a.y+=.035; b.y+=.035
            bar(a,b,.075)
        for a,b in zip(xs,xs[1:]):
            for t0,t1 in ((0,.5),(.5,1)):
                # Outward normal, so both roof slopes are visible in the game's culled mesh.
                pts=[p(a,t0),p(b,t0),p(b,t1),p(a,t1)]
                if s<0: pts.reverse()
                pane(pts)
    # Central glazed door: separate raised frame, timber kickplate, warm brass handle.
    z=1.865
    for x in (-.53,.53): bar((x,0,z),(x,2.22,z),.09)
    for y in (.08,.6,1.4,2.2): bar((-.53,y,z),(.53,y,z),.085)
    m.box((-.48,.08,z-.04),(.48,.56,z+.015),white,'timber')
    bar((0,.6,z),(0,2.2,z),.065)
    m.box((.32,.92,z),(.39,1.05,z+.07),lin(0xba934c))
    m.box((-.68,0,1.8),(.68,.10,2.18),lin(0xc8b99b))
    # Two staging benches, one split to leave a clear entrance and centre aisle.
    for z in (-1.30,1.30):
        spans=[(-3.18,3.18)] if z<0 else [(-3.18,-.8),(.8,3.18)]
        for a,b in spans:
            for zz in (z-.24,z,z+.24):
                m.box((a,.92,zz-.105),(b,.99,zz+.105),wood,'timber')
            for x in (a+.12,b-.12):
                for zz in (z-.23,z+.23):
                    m.box((x-.045,0,zz-.045),(x+.045,.94,zz+.045),wood,'timber')
            for i in range(max(2,int((b-a)/.55))):
                x=a+.27+i*.56
                m.cylinder((x,z),.16,1.,1.29,10,lin(0xb76b45),'plain')
                m.cylinder((x,z),.18,1.24,1.31,10,lin(0xc78156),'plain')
                m.cylinder((x,z),.145,1.30,1.32,10,soil,'plain')
                # Faceted clustered leaves: deliberately broad enough to survive the game camera.
                for dx,dz,dy in ((0,0,.24),(-.11,.03,.13),(.10,-.04,.17)):
                    r=.18+rng.random()*.05
                    m.cylinder((x+dx,z+dz),r,1.32,1.32+dy,7,lin(rng.choice([0x648451,0x769654,0x4b7952])),'plain')
    return m.finish('glasshouse')


def preview(obj, name):
    # Presentation materials only, applied AFTER export. _COLOR remains the sole
    # exported colour source. Transparency here is not supported by model.ts yet.
    for mat in obj.data.materials:
        mat.use_nodes=True
        nodes=mat.node_tree.nodes
        nodes.clear()
        out=nodes.new('ShaderNodeOutputMaterial')
        attr=nodes.new('ShaderNodeAttribute'); attr.attribute_name='_COLOR'
        bs=nodes.new('ShaderNodeBsdfPrincipled')
        mat.node_tree.links.new(attr.outputs['Color'],bs.inputs['Base Color'])
        bs.inputs['Roughness'].default_value=.72
        if mat.name=='glass':
            transparent=nodes.new('ShaderNodeBsdfTransparent')
            mix=nodes.new('ShaderNodeMixShader'); mix.inputs[0].default_value=.16
            mat.node_tree.links.new(transparent.outputs[0],mix.inputs[1])
            mat.node_tree.links.new(bs.outputs[0],mix.inputs[2])
            mat.node_tree.links.new(mix.outputs[0],out.inputs[0])
        else: mat.node_tree.links.new(bs.outputs[0],out.inputs[0])
    scene=bpy.context.scene
    scene.render.engine='CYCLES'
    scene.render.threads_mode='FIXED'
    scene.render.threads=2
    scene.cycles.samples=16
    scene.cycles.use_denoising=True
    scene.world=bpy.data.worlds.new('preview-world')
    scene.world.use_nodes=True
    scene.world.node_tree.nodes['Background'].inputs['Color'].default_value=(.65,.73,.85,1)
    scene.world.node_tree.nodes['Background'].inputs['Strength'].default_value=.5
    bpy.ops.mesh.primitive_plane_add(size=200,location=(0,0,-.015))
    ground=bpy.context.object
    mat=bpy.data.materials.new('preview-ground'); mat.use_nodes=True
    mat.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value=lin(0xa1ad7b)
    ground.data.materials.append(mat)
    bpy.ops.object.light_add(type='AREA',location=(-8,-10,18))
    light=bpy.context.object; light.data.energy=2400; light.data.shape='DISK'; light.data.size=10
    light.rotation_euler=(Vector((0,0,2))-light.location).to_track_quat('-Z','Y').to_euler()
    bpy.ops.object.light_add(type='SUN',location=(0,0,18))
    bpy.context.object.data.energy=1.5
    bpy.context.object.rotation_euler=(.4,-.5,-.4)
    verts=[v.co for v in obj.data.vertices]
    low=Vector(tuple(min(v[i] for v in verts) for i in range(3)))
    high=Vector(tuple(max(v[i] for v in verts) for i in range(3)))
    target=(low+high)/2
    bpy.ops.object.camera_add()
    cam=bpy.context.object; scene.camera=cam; cam.data.type='ORTHO'
    cam.data.ortho_scale=9.3 if name=='glasshouse' else 20.5
    scene.render.resolution_x=900; scene.render.resolution_y=765; scene.render.resolution_percentage=100
    scene.view_settings.view_transform='Standard'
    scene.render.image_settings.file_format='PNG'
    dest=Path(__file__).resolve().parents[2]/'out'/'models'; dest.mkdir(parents=True,exist_ok=True)
    for k,label in ((0,'front-right'),(2,'rear-left')):
        angle=math.pi/4+k*math.pi/2
        # Game +z is Blender -y; first view is +x,+z, then rotates around.
        cam.location=target+Vector((30*math.cos(angle),-30*math.sin(angle),30*math.tan(math.pi/6)))
        cam.rotation_euler=(target-cam.location).to_track_quat('-Z','Y').to_euler()
        scene.render.filepath=str(dest/f'{name}-{label}.png')
        bpy.ops.render.render(write_still=True)


def export():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    obj=build()
    bpy.context.view_layer.objects.active=obj
    obj.select_set(True)
    OUT.mkdir(parents=True,exist_ok=True)
    name=Path(__file__).stem
    path=str(OUT/f'{name}.glb')
    bpy.ops.export_scene.gltf(
        filepath=path, export_format='GLB', use_selection=True, export_yup=True, export_apply=False,
        export_normals=True, export_texcoords=True, export_materials='EXPORT', export_vertex_color='NONE',
        export_all_vertex_colors=False, export_attributes=True, export_tangents=False, export_animations=False, export_extras=False,
    )
    obj.data.calc_loop_triangles()
    coords=[(v.co.x,v.co.z,-v.co.y) for v in obj.data.vertices]
    bounds=[(min(p[i] for p in coords),max(p[i] for p in coords)) for i in range(3)]
    print(f'wrote {path}: {len(obj.data.loop_triangles)} triangles; game xyz bounds {bounds}',flush=True)
    if '--preview' in ARGS: preview(obj,name)


export()
