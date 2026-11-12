"""Wheat mill: stone base, timber-framed granary, clay tiles and linen sails.

Blender 4.5+:
  blender -b --factory-startup --python tools/blender/wheatmill.py -- src/scenes/models
Add --preview for opposing renders in out/models, --blend for an editable source beside this script.
All geometry uses the existing renderer's linear _COLOR and named finish contract.
"""
import math
import sys
from pathlib import Path

import bpy
from mathutils import Vector

sys.path.insert(0, str(Path(__file__).resolve().parent))
sys.dont_write_bytecode = True
from barn import Model, lin, shade

ARGS = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
OUT = Path(ARGS[0]) if ARGS else Path('src/scenes/models')
ART = Path(__file__).resolve().parents[2] / 'out' / 'models'
CREAM, WOOD, DARK = map(lin, (0xe7d9b5, 0x98724c, 0x594b3b))
TEAL, GOLD, STONE = map(lin, (0x527f7b, 0xd6af57, 0xb2aa91))
TILE, GLASS, LINEN = map(lin, (0xb96f50, 0x78a4a5, 0xf4e7c5))
HUB = 9.0


def build():
    m = Model()

    def ring(cx, cz, levels, color, mat='plain', sides=16):
        # Levels are (height, radius); each course is a closed faceted shell.
        for (y0, r0), (y1, r1) in zip(levels, levels[1:]):
            for i in range(sides):
                a, b = 2*math.pi*i/sides, 2*math.pi*(i+1)/sides
                pts = [(cx+r0*math.cos(a), y0, cz+r0*math.sin(a)),
                       (cx+r1*math.cos(a), y1, cz+r1*math.sin(a)),
                       (cx+r1*math.cos(b), y1, cz+r1*math.sin(b)),
                       (cx+r0*math.cos(b), y0, cz+r0*math.sin(b))]
                m.face(pts, [shade(color, .96+.025*(i % 4))]*4,
                       [(y0,i*.4),(y1,i*.4),(y1,(i+1)*.4),(y0,(i+1)*.4)], mat)
        y, r = levels[-1]
        m.face([(cx+r*math.cos(2*math.pi*i/sides),y,cz+r*math.sin(2*math.pi*i/sides))
                for i in reversed(range(sides))], [color]*sides, [(0,0)]*sides, mat)

    # Tower stands left of the milling house. Broad irregular stone courses read at game zoom.
    cx = -1.8
    # Mortar core closes the narrow joints between the individually modelled blocks.
    ring(cx,0,[(0,2.08),(1.8,1.96)],shade(STONE,.76))
    for course in range(5):
        for i in range(16):
            a = 2*math.pi*(i + .5*(course % 2))/16
            b = a+2*math.pi/16-.016
            y0, y1 = course*.36, (course+1)*.36-.018
            r = 2.16-course*.025
            pts = [(cx+rr*math.cos(t), y, rr*math.sin(t))
                   for y in (y0,y1) for rr,t in ((r-.18,a),(r,a),(r,b),(r-.18,b))]
            m.hexa(pts, shade(STONE,.88+.055*((i+course*3)%5)), 'plain')
    ring(cx,0,[(1.78,2.04),(7.85,1.43)],CREAM)
    for y,r in ((1.82,2.09),(5.45,1.72),(7.75,1.53)):
        ring(cx,0,[(y,r),(y+.16,r)],WOOD,'timber')
    # Octagonal copper-green cap, with a finial and a small gold pennant.
    ring(cx,0,[(7.90,1.72),(8.35,1.81),(9.40,1.14),(9.95,.20)],TEAL,'plain')
    m.cylinder((cx,0),.10,9.9,10.45,10,GOLD,'plain')
    m.face([(cx,10.43,0),(cx+.85,10.24,0),(cx,10.08,0)], [GOLD]*3,[(0,0)]*3,'plain')
    m.face([(cx,10.08,-.01),(cx+.85,10.24,-.01),(cx,10.43,-.01)], [GOLD]*3,[(0,0)]*3,'plain')

    # Recessed-looking window panels follow the tower's taper, framed in teal.
    for y in (3.35,6.18):
        r = 2.04-(y-1.78)*.1
        for angle in (0, math.pi/2, math.pi, 3*math.pi/2):
            n = Vector((math.cos(angle),0,math.sin(angle)))
            side = Vector((-math.sin(angle),0,math.cos(angle)))
            center = Vector((cx,y,0))+n*(r+.03)
            p = lambda x,h: center+side*x+Vector((0,h,0))-n*(h*.1)
            m.face([p(-.32,0),p(-.32,.80),p(.32,.80),p(.32,0)], [GLASS]*4,
                   [(0,0),(0,1),(1,1),(1,0)],'glass')
            for a,b in ((p(-.38,-.06),p(-.38,.88)),(p(.38,-.06),p(.38,.88)),
                        (p(-.42,-.06),p(.42,-.06)),(p(-.42,.88),p(.42,.88)),(p(0,0),p(0,.80))):
                m.beam(a+n*.05,b+n*.05,(.09,.09),TEAL)

    # Milling house: its gabled roof joins the right side of the tower.
    x0,x1,z0,z1 = -.15,4.8,-2.05,2.05
    m.box((x0,0,z0),(x1,.35,z1),STONE)
    m.box((x0,.35,z0),(x1,3.35,z1),CREAM)
    for z in (z0-.06,z1+.06):
        for x in (x0,.55,2.2,4.0,x1):
            m.box((x-.08,.34,z-.07),(x+.08,3.45,z+.07),WOOD,'timber')
        for y in (.48,2.55,3.32):
            m.box((x0,y-.07,z-.095),(x1,y+.07,z+.095),WOOD,'timber')
        for x in (.65,2.45):
            m.beam((x,2.62,z),(x+.75,3.25,z),(.12,.13),WOOD)
    # Closed triangular gables and a roof of individually overlapping clay tiles.
    for x in (x0,x1):
        pts = [(x,3.35,z0),(x,4.90,0),(x,3.35,z1)]
        if x == x0: pts.reverse()
        m.face(pts,[CREAM]*3,[(0,0)]*3,'plain')
        for z in (-2.20,2.20):
            m.beam((x,4.95,0),(x,3.26,z),(.14,.18),DARK)
        m.beam((x,3.35,0),(x,4.85,0),(.14,.14),WOOD)
    roof_y = lambda z: 4.96-abs(z)*.75
    for sign in (-1,1):
        for row in range(6):
            za,zb = sign*row*.39,sign*(row*.39+.45)
            for col in range(12):
                a = -.38+col*.45
                b = a+.44
                # Higher courses sit above the overlap; coplanar overlapping
                # tiles otherwise flicker in the renderer's depth/ink pass.
                lift=.028*(6-row)
                pts=[(a,roof_y(za)+.04+lift,za),(b,roof_y(za)+.04+lift,za),
                     (b,roof_y(zb)+.04+lift,zb),(a,roof_y(zb)+.04+lift,zb)]
                m.hexa(pts+[(x,y+.085,z) for x,y,z in pts],
                       shade(TILE,.9+.045*((row*7+col*3)%5)),'plain')
    for i in range(13):
        m.beam((-.4+i*.43,5.08,0),(-.4+(i+1)*.43-.015,5.08,0),(.23,.17),shade(TILE,1.1),'plain')

    # Teal double doors, brass handles and a covered loading deck.
    for i in range(8):
        x=.76+i*.19
        m.box((x,.37,2.12),(x+.185,2.48,2.21),shade(TEAL,.92+.04*(i%3)),'timber')
    for x in (.68,2.36):
        m.box((x-.07,.34,2.10),(x+.07,2.62,2.27),WOOD,'timber')
    for side in (0,1):
        for y in (.65,2.18):
            m.box((.80+side*.76,y,2.22),(1.48+side*.76,y+.09,2.29),WOOD,'timber')
        m.beam((.84+side*.76,.77,2.26),(1.43+side*.76,2.14,2.26),(.10,.06),WOOD)
        m.box((1.43+side*.21,1.35,2.29),(1.49+side*.21,1.52,2.34),GOLD)
    m.box((.10,0,2.05),(4.9,.24,3.12),STONE)
    for i in range(17):
        m.box((.12+i*.28,.24,2.07),(.39+i*.28,.34,3.10),shade(WOOD,.94+.03*(i%4)),'timber')
    m.box((.65,0,3.10),(2.5,.16,3.55),STONE)
    # Awning and supporting curved-look diagonal struts, clear of the sail plane.
    for x in (.4,4.65):
        m.beam((x,.33,2.95),(x,2.82,2.95),(.14,.14),WOOD)
        m.beam((x,2.15,2.95),(x,2.85,2.36),(.10,.10),WOOD)
    pts=[(.12,3.08,2.10),(4.92,3.08,2.10),(4.92,2.8,3.22),(.12,2.8,3.22)]
    m.hexa(pts+[(x,y+.08,z) for x,y,z in pts],TEAL,'tin',(0,-.28,1.12))

    # Windows on the back and east end, with timber shutters.
    for z in (-2.13,):
        for x in (1.1,3.5):
            m.box((x-.44,1.3,z-.04),(x+.44,2.25,z),GLASS,'glass')
            for xx in (x-.48,x,x+.48):
                m.box((xx-.045,1.24,z-.08),(xx+.045,2.32,z+.01),WOOD,'timber')
            for y in (1.25,2.29):
                m.box((x-.53,y-.04,z-.105),(x+.53,y+.04,z+.025),WOOD,'timber')
    m.box((4.81,1.4,-.48),(4.87,2.5,.48),GLASS,'glass')
    for z in (-.56,0,.56):
        m.box((4.87,1.34,z-.04),(4.94,2.57,z+.04),WOOD,'timber')
    for z in (-.97,.68):
        m.box((4.86,1.40,z),(4.96,2.5,z+.29),TEAL,'timber')

    # Projecting sack hoist at the east gable, with a visible hanging load.
    m.beam((4.65,4.05,0),(5.85,4.05,0),(.18,.18),DARK)
    m.beam((4.78,3.35,0),(5.63,4.02,0),(.12,.12),WOOD)
    m.beam((5.65,4.02,0),(5.65,1.35,0),(.035,.035),DARK,'plain')

    def sack(x,z,y,scale=1):
        ring(x,z,[(y,.27*scale),(y+.18*scale,.38*scale),(y+.62*scale,.34*scale),
                  (y+.82*scale,.12*scale),(y+.94*scale,.17*scale)],LINEN,'plain',12)
        m.cylinder((x,z),.13*scale,y+.80*scale,y+.86*scale,12,DARK,'plain')
        # Woven coloured band, broad enough to survive the distant camera.
        ring(x,z,[(y+.3*scale,.375*scale),(y+.41*scale,.365*scale)],TEAL,'plain',12)
    sack(5.65,0,.50)
    for x,z,y,s in ((3.2,2.63,.34,1),(3.95,2.55,.34,.9),(3.65,2.56,1.16,.75),(.3,-2.65,0,1)):
        sack(x,z,y,s)
    # Grain bin beside the mill, slatted with gold wheat visible above the rim.
    m.box((3.1,0,-3.45),(4.5,.78,-2.35),WOOD,'timber')
    for y in (.12,.65):
        m.box((3.08,y,-3.48),(4.52,y+.065,-3.44),DARK)
    for i in range(6):
        m.box((3.13+i*.23,.15,-3.49),(3.15+i*.23,.72,-3.47),DARK)
    m.box((3.19,.77,-3.34),(4.40,.82,-2.46),GOLD)

    # A wheat emblem carved in a sign on the house's east gable.
    # Use beams for the raised seed heads: reads as wheat without tiny lettering.
    m.box((4.84,3.10,-.58),(4.94,4.25,.58),TEAL,'timber')
    for zz in (-.27,0,.27):
        m.beam((4.97,3.27,zz),(4.97,4.04,zz),(.035,.035),GOLD,'plain')
        for k in range(3):
            y=3.57+k*.15
            for side in (-1,1):
                m.beam((4.98,y,zz),(4.98,y+.13,zz+side*.11),(.065,.065),GOLD,'plain')

    # Four balanced linen sails on an exposed ladder frame. The axle sits ahead
    # of the awning, so every sail clears the house even if animated in future.
    origin=Vector((cx,HUB,3.65))
    m.beam((cx,HUB,1.2),origin,(.36,.36),DARK)
    for k in range(4):
        angle=math.pi/4+k*math.pi/2
        d=Vector((math.cos(angle),math.sin(angle),0))
        t=Vector((-math.sin(angle),math.cos(angle),0))
        p=lambda r,s,z=0: origin+d*r+t*s+Vector((0,0,z))
        m.beam(p(.10,0),p(6.45,0),(.18,.17),DARK,up=(0,0,1))
        for s in (.54,1.07):
            m.beam(p(1.85,s),p(6.45,s),(.085,.085),WOOD,up=(0,0,1))
        for j in range(10):
            r=1.85+j*.51
            m.beam(p(r,-.05),p(r,1.13),(.085,.075),WOOD,up=(0,0,1))
        for j in range(7):
            r=2.88+j*.50
            pts=[p(r,.05,-.055),p(r+.48,.05,-.055),p(r+.48,1.02,-.055),p(r,1.02,-.055)]
            m.hexa(pts+[v+Vector((0,0,.025)) for v in pts],shade(LINEN,.96+.018*(j%3)),'plain')
    m.box((cx-.32,HUB-.32,3.67),(cx+.32,HUB+.32,3.97),TEAL)
    m.box((cx-.12,HUB-.12,3.97),(cx+.12,HUB+.12,4.06),GOLD)
    return m.finish('wheatmill')


def presentation(obj):
    for mat in obj.data.materials:
        mat.use_nodes=True
        bs=mat.node_tree.nodes.get('Principled BSDF')
        attr=mat.node_tree.nodes.new('ShaderNodeAttribute'); attr.attribute_name='_COLOR'
        mat.node_tree.links.new(attr.outputs['Color'],bs.inputs['Base Color'])
        bs.inputs['Roughness'].default_value=.82
    scene=bpy.context.scene
    scene.world=bpy.data.worlds.new('Wheat mill studio')
    scene.world.use_nodes=True
    scene.world.node_tree.nodes['Background'].inputs['Color'].default_value=(.65,.74,.82,1)
    scene.world.node_tree.nodes['Background'].inputs['Strength'].default_value=.6
    scene.render.engine='CYCLES'; scene.cycles.samples=24
    scene.render.resolution_x=1100; scene.render.resolution_y=1000; scene.render.resolution_percentage=100
    scene.view_settings.view_transform='Standard'
    bpy.ops.object.light_add(type='AREA',location=(-7,-10,18))
    bpy.context.object.data.energy=2400; bpy.context.object.data.shape='DISK'; bpy.context.object.data.size=10
    bpy.ops.object.light_add(type='SUN')
    bpy.context.object.data.energy=1.2; bpy.context.object.rotation_euler=(.4,-.5,-.4)
    bpy.ops.object.camera_add()
    cam=bpy.context.object; scene.camera=cam; cam.data.type='ORTHO'; cam.data.ortho_scale=19.5
    target=Vector((0,-.5,6.5))
    ART.mkdir(parents=True,exist_ok=True)
    for label,offset in [('front-right',(22,-32,19)),('rear-left',(-22,32,19))]:
        cam.location=target+Vector(offset)
        cam.rotation_euler=(target-cam.location).to_track_quat('-Z','Y').to_euler()
        if '--preview' in ARGS:
            scene.render.filepath=str(ART/f'wheatmill-{label}.png')
            bpy.ops.render.render(write_still=True)
    cam.location=target+Vector((22,-32,19))
    cam.rotation_euler=(target-cam.location).to_track_quat('-Z','Y').to_euler()
    bpy.ops.object.select_all(action='DESELECT'); obj.select_set(True); bpy.context.view_layer.objects.active=obj
    # Opening the editable source shows the coloured asset, framed in its camera.
    for screen in bpy.data.screens:
        for area in screen.areas:
            if area.type == 'VIEW_3D':
                area.spaces.active.shading.type='MATERIAL'
                area.spaces.active.region_3d.view_perspective='CAMERA'
    if '--blend' in ARGS:
        bpy.context.preferences.filepaths.save_version = 0
        bpy.ops.wm.save_as_mainfile(filepath=str(Path(__file__).with_suffix('.blend')))


def export():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    obj=build(); obj.select_set(True); bpy.context.view_layer.objects.active=obj
    obj.data.calc_loop_triangles()
    triangles=len(obj.data.loop_triangles)
    assert triangles < 15000, f'Farm asset exceeds triangle budget: {triangles}'
    coords=[(v.co.x,v.co.z,-v.co.y) for v in obj.data.vertices]
    bounds=[(min(p[i] for p in coords),max(p[i] for p in coords)) for i in range(3)]
    assert all(math.isfinite(v) for p in coords for v in p)
    OUT.mkdir(parents=True,exist_ok=True)
    bpy.ops.export_scene.gltf(filepath=str(OUT/'wheatmill.glb'),export_format='GLB',use_selection=True,
        export_yup=True,export_apply=False,export_normals=True,export_texcoords=True,export_materials='EXPORT',
        export_vertex_color='NONE',export_all_vertex_colors=False,export_attributes=True,
        export_tangents=False,export_animations=False,export_extras=False)
    print(f'Wheat mill: {triangles} triangles; game xyz bounds {bounds}',flush=True)
    if '--preview' in ARGS or '--blend' in ARGS: presentation(obj)


if __name__ == '__main__':
    export()
