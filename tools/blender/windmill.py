# Deterministic model in game coordinates: x right, y up, front +z; metres.
# Build: flatpak run org.blender.Blender -b --factory-startup --python $PWD/tools/blender/windmill.py -- $PWD/src/scenes/models
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


# The tower is 9 m tall. Hub at 9.5 m; seven-metre sails in a still X
# keep their lowest corners above 3.6 m, comfortably clear of the ground.
HUB = 9.5

def build():
    m=Model()
    cream, trim, timber = lin(0xe4d9ba), lin(0xc9b790), lin(0x826145)
    dark, sail = lin(0x70543d), lin(0xf0e5c6)
    sides=16
    def radius(y): return 2.25-.75*y/9
    def pt(i,y):
        a=2*math.pi*(i-.5)/sides
        return (radius(y)*math.cos(a),y,radius(y)*math.sin(a))
    # Door and windows are genuine gaps in the tower, with recessed coloured infills.
    holes={4:[(0,2.2),(4.4,5.2)],0:[(3.6,4.4)],12:[(6.8,7.6)]}
    levels=[0,.25,2.2,3.6,4.4,5.2,6.8,7.6,8.65,9]
    for y0,y1 in zip(levels,levels[1:]):
        for i in range(sides):
            if any(y0>=lo and y1<=hi for lo,hi in holes.get(i,[])): continue
            pts=[pt(i,y0),pt(i,y1),pt(i+1,y1),pt(i+1,y0)]
            col=shade(cream,1+(.025 if i%3==0 else -.015 if i%3==1 else 0))
            m.face(pts,[col]*4,[(0,0)]*4,'plain')
    for i,openings in holes.items():
        a=2*math.pi*i/sides
        normal=Vector((math.cos(a),0,math.sin(a)))
        for lo,hi in openings:
            corners=[Vector(pt(i,lo)),Vector(pt(i+1,lo)),Vector(pt(i+1,hi)),Vector(pt(i,hi))]
            recessed=[p-normal*.09 for p in corners]
            door=lo==0
            m.face(recessed,[lin(0x8c6347) if door else lin(0x719495)]*4,[(p.y,p.x if i==4 else p.z) for p in recessed],'timber' if door else 'glass')
            for j in range(4):
                if door and j == 0: continue  # Keep the threshold at ground level.
                m.beam(corners[j]+normal*.04,corners[(j+1)%4]+normal*.04,(.12,.12),trim,'plain')
            if door:
                for y in (.48,1.68):
                    mid=(corners[0]+corners[1])/2
                    m.beam((-.35,y,mid.z+.06),(.35,y,mid.z+.06),(.10,.08),dark)
                m.box((.22,.96,2.18),(.30,1.10,2.28),lin(0xb39051))
            else:
                m.beam((corners[0]+corners[1])/2,(corners[2]+corners[3])/2,(.075,.075),trim)
    # Basal stone skirt and collar beneath cap, both faceted to match the tower.
    m.cylinder((0,0),2.29,0,.24,16,lin(0xb5a487),'plain')
    m.cylinder((0,0),1.57,8.72,9.02,16,trim,'plain')
    m.box((-.75,0,1.92),(.75,.16,2.75),lin(0xb5a487))
    m.box((-.62,0,2.75),(.62,.08,3.02),lin(0xc4b494))
    # Rounded timber cap built from low-poly rings, elongated front to back like a boat.
    rings=[(8.98,1.68,1.83),(9.48,1.64,1.9),(10.05,1.24,1.62),(10.55,.62,1.02),(10.72,.08,.42)]
    def cp(i,ring):
        y,rx,rz=ring; a=2*math.pi*i/16
        return (rx*math.cos(a),y,rz*math.sin(a))
    for r0,r1 in zip(rings,rings[1:]):
        for i in range(16):
            pts=[cp(i,r0),cp(i,r1),cp(i+1,r1),cp(i+1,r0)]
            m.face(pts,[shade(timber,.92+.035*(i%5))]*4,[(p[1], (i+(1 if j>=2 else 0))*.6) for j,p in enumerate(pts)],'timber')
    m.face([cp(i,rings[-1]) for i in reversed(range(16))],[timber]*16,[(0,0)]*16,'timber')
    # Shaft points +z. A square hub with a metal-coloured wooden end cap.
    m.beam((0,HUB,1.5),(0,HUB,2.65),(.40,.40),dark)
    m.box((-.34,HUB-.34,2.48),(.34,HUB+.34,2.89),timber,'timber')
    m.box((-.16,HUB-.16,2.89),(.16,HUB+.16,2.99),lin(0xc3a478))
    # Four asymmetric sail ladders. Three long rails and 10 bold rungs per sail;
    # outer canvas on two opposite sails leaves the other pair visibly open lattice.
    for k in range(4):
        angle=math.pi/4+k*math.pi/2
        radial=Vector((math.cos(angle),math.sin(angle),0))
        across=Vector((-math.sin(angle),math.cos(angle),0))
        def sp(r,t,z=2.62): return Vector((0,HUB,z))+radial*r+across*t
        m.beam(sp(.15,0),sp(7,0),(.19,.17),dark,up=(0,0,1))
        for t in (.58,1.16):
            m.beam(sp(1.9,t),sp(7,t),(.10,.10),timber,up=(0,0,1))
        for j in range(11):
            r=1.9+(7-1.9)*j/10
            m.beam(sp(r,-.06),sp(r,1.22),(.10,.10),timber,up=(0,0,1))
        if k%2==0:
            for j in range(6):
                r=3.94+j*.51
                m.face([sp(r,.08,2.57),sp(r+.49,.08,2.57),sp(r+.49,1.1,2.57),sp(r,1.1,2.57)],
                       [shade(sail,.97+.015*(j%3))]*4,[(0,0),(1,0),(1,1),(0,1)],'plain')
                # Back face: cream canvas reads from the rear too.
                m.face([sp(r,1.1,2.565),sp(r+.49,1.1,2.565),sp(r+.49,.08,2.565),sp(r,.08,2.565)],
                       [shade(sail,.9)]*4,[(0,0),(1,0),(1,1),(0,1)],'plain')
    return m.finish('windmill')


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
        # Fit each view in camera space: the projecting sails otherwise shift the
        # silhouette upwards in rear views despite fitting the front view.
        q=cam.rotation_euler.to_quaternion()
        right,up=q @ Vector((1,0,0)),q @ Vector((0,1,0))
        px,py=[v.dot(right) for v in verts],[v.dot(up) for v in verts]
        cam.location+=right*((min(px)+max(px))/2-target.dot(right))+up*((min(py)+max(py))/2-target.dot(up))
        cam.data.ortho_scale=max(max(px)-min(px),(max(py)-min(py))*scene.render.resolution_x/scene.render.resolution_y)*1.12
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
