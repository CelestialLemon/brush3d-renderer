# Deterministic pastoral props. Game coordinates: x right, y up, z front.
# Run: flatpak run org.blender.Blender -b --factory-startup --python $PWD/tools/blender/props.py -- $PWD/src/scenes/models
# Optional --previews renders two orthographic views per model under out/models; --only=rowboat limits rebuilding.
# Placement: footprints are centred at x=z=0. Wagon front/drawbar and boat bow are +x; scarecrow face is +z.
# Ground is y=0 for wagon/scarecrow. Boat waterline is y=0, keel -.18, highest gunwale .515.
# Palette: weathered sage wagon/honey timber, pale golden loose hay, faded teal/cream clinker boat, blue coat/straw hat.
import math
import random
import sys
from pathlib import Path
import bmesh
import bpy
from mathutils import Vector
ARGS = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
OUT = Path(ARGS[0]) if ARGS else Path('src/scenes/models')

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



def polygon(m, pts, colour, mat='plain', grain=(1, 0, 0)):
    g = Vector(grain)
    pts = [Vector(p) for p in pts]
    n = (pts[1] - pts[0]).cross(pts[2] - pts[0]).normalized()
    w = n.cross(g)
    if w.length < 0.1:
        w = Vector((0, 0, 1))
    m.face(pts, [colour] * len(pts), [(p.dot(g), p.dot(w)) for p in pts], mat)


def tube(m, a, b, radius, colour, mat='timber', sides=12, radius2=None):
    a, b = Vector(a), Vector(b)
    d = (b - a).normalized()
    u = d.cross(Vector((0, 1, 0)))
    if u.length < 0.1:
        u = d.cross(Vector((1, 0, 0)))
    u.normalize()
    v = d.cross(u).normalized()
    rings = [[p + r * (u * math.cos(i * math.tau / sides) + v * math.sin(i * math.tau / sides))
              for i in range(sides)] for p, r in [(a, radius), (b, radius if radius2 is None else radius2)]]
    for i in range(sides):
        j = (i + 1) % sides
        polygon(m, [rings[0][i], rings[0][j], rings[1][j], rings[1][i]], colour, mat, tuple(d))
    polygon(m, list(reversed(rings[0])), colour, mat)
    polygon(m, rings[1], colour, mat)


def ellipsoid(m, centre, radii, colour, seed=1, sides=14, rings=7):
    rng = random.Random(seed)
    cx, cy, cz = centre
    rx, ry, rz = radii
    rows = []
    for j in range(1, rings):
        phi = math.pi * j / rings
        rows.append([(cx + rx * math.sin(phi) * math.cos(i * math.tau / sides),
                      cy + ry * math.cos(phi),
                      cz + rz * math.sin(phi) * math.sin(i * math.tau / sides)) for i in range(sides)])
    for i in range(sides):
        k = (i + 1) % sides
        polygon(m, [(cx, cy + ry, cz), rows[0][k], rows[0][i]], shade(colour, rng.uniform(.96, 1.04)))
        for j in range(len(rows) - 1):
            polygon(m, [rows[j][i], rows[j][k], rows[j + 1][k], rows[j + 1][i]], shade(colour, rng.uniform(.96, 1.04)))
        polygon(m, [rows[-1][i], rows[-1][k], (cx, cy - ry, cz)], colour)


def wagon():
    m = Model()
    wood, sage, tyre = lin(0xb68b53), lin(0x849789), lin(0x75694f)
    # Body is centred on the running gear; drawbar projects toward +x.
    for z in (-.48, .48):
        m.box((-1.8, .57, z - .08), (1.12, .77, z + .08), wood, 'timber')
    for x, r in [(-1.22, .52), (.83, .39)]:
        tube(m, (x, r, -.96), (x, r, .96), .075, wood)
        for side in (-1, 1):
            z = side * .86
            # An annular rim keeps the space between spokes open.
            n = 20
            for i in range(n):
                a, b = i * math.tau / n, (i + 1) * math.tau / n
                def pt(t, rr, zz): return (x + rr * math.cos(t), r + rr * math.sin(t), zz)
                m.hexa([pt(a, r - .10, z - .07), pt(b, r - .10, z - .07), pt(b, r, z - .07), pt(a, r, z - .07),
                        pt(a, r - .10, z + .07), pt(b, r - .10, z + .07), pt(b, r, z + .07), pt(a, r, z + .07)], tyre, 'timber')
            for i in range(10):
                a = math.tau * i / 10
                m.beam((x, r, z), (x + (r - .055) * math.cos(a), r + (r - .055) * math.sin(a), z), (.055, .07), wood)
            tube(m, (x, r, z - .105), (x, r, z + .105), .12, wood)
    for i in range(9):
        x = -1.8 + i * .33
        m.box((x, .77, -.76), (x + .325, .87, .76), shade(wood, .94 + i % 3 * .04), 'timber')
    for side in (-1, 1):
        z = side * .77
        for j in range(3):
            m.box((-1.85, .87 + j * .18, z - .045), (1.18, 1.04 + j * .18, z + .045), shade(sage, .94 + j * .045), 'timber')
        for x in (-1.72, -.35, 1.05):
            m.box((x - .05, .77, z - .075), (x + .05, 1.5, z + .075), wood, 'timber')
    for x in (-1.85, 1.15):
        for j in range(3):
            m.box((x - .04, .87 + j * .18, -.76), (x + .04, 1.04 + j * .18, .76), sage, 'timber')
    m.beam((.75, .65, 0), (2.12, .45, 0), (.15, .15), wood)
    tube(m, (2.08, .45, -.16), (2.08, .45, .16), .065, sage)
    # Broad overlapping masses, not a stack of separate bales.
    hay = lin(0xd9bd74)
    ellipsoid(m, (-.35, 1.48, 0), (1.59, .73, .88), hay, 17, 18, 8)
    for i, (x, y, z, rx, ry, rz) in enumerate([(-1.05, 1.84, -.19, .72, .47, .64),
            (-.25, 1.96, .16, .77, .50, .64), (.55, 1.72, -.10, .65, .48, .72)]):
        ellipsoid(m, (x, y, z), (rx, ry, rz), shade(hay, 1 + i * .025), i + 3)
    # A few broad straw wisps make the load read as loose hay from the aerial view.
    rng = random.Random(82)
    for i in range(22):
        x, z = rng.uniform(-1.45, .8), rng.uniform(-.63, .63)
        y = 1.48 + .73 * math.sqrt(max(.05, 1 - ((x + .35) / 1.6)**2 - (z / .9)**2))
        m.beam((x - .12, y + .025, z), (x + .15, y + .055, z + .06), (.025, .025), shade(hay, 1.14), 'plain')
    return m.finish('haywagon')


def boat():
    m = Model()
    teal, cream, wood = lin(0x668f99), lin(0xe0d6b6), lin(0xba915e)
    # Longitudinal stations; pointed bow +x, a narrow rounded stern -x.
    stations = [(-1.8, .055), (-1.55, .36), (-1.1, .55), (-.55, .635),
                (0, .65), (.6, .59), (1.12, .43), (1.55, .21), (1.8, .015)]
    def pt(x, w, t, side, inner=False):
        # Keel at -.18, sheer at .36: one third of hull depth is submerged.
        rise = .11 * (abs(x) / 1.8)**3
        y = -.18 + .54 * t + rise
        z = side * (w * (.13 + .87 * math.sin(t * math.pi / 2)))
        if inner:
            y += .045
            z -= side * min(.045, abs(z) * .45)
        return (x, y, z)
    for side in (-1, 1):
        for j in range(5):
            t0, t1 = j / 5, (j + 1) / 5
            for (x, w), (xx, ww) in zip(stations, stations[1:]):
                # Thick shell plus raised overlapping lower edge on every strake.
                corners = [pt(x, w, t0, side), pt(xx, ww, t0, side), pt(xx, ww, t1, side), pt(x, w, t1, side),
                           pt(x, w, t0, side, True), pt(xx, ww, t0, side, True), pt(xx, ww, t1, side, True), pt(x, w, t1, side, True)]
                m.hexa(corners, shade(teal if j < 4 else cream, .94 + j * .025), 'timber', (1, 0, 0))
                if j > 0:
                    a, b = Vector(pt(x, w, t0, side)), Vector(pt(xx, ww, t0, side))
                    a.z += side * .015
                    b.z += side * .015
                    m.beam(a, b, (.035, .035), shade(teal, .88), 'timber')
        for (x, w), (xx, ww) in zip(stations, stations[1:]):
            m.beam(pt(x, w, 1, side), pt(xx, ww, 1, side), (.065, .065), wood)
    # Close the bottom and the two end sections: a watertight shell under the floorboards.
    for (x, w), (xx, ww) in zip(stations, stations[1:]):
        m.hexa([pt(x, w, 0, -1), pt(xx, ww, 0, -1), pt(xx, ww, 0, 1), pt(x, w, 0, 1),
                pt(x, w, 0, -1, True), pt(xx, ww, 0, -1, True), pt(xx, ww, 0, 1, True), pt(x, w, 0, 1, True)], teal, 'timber', (1, 0, 0))
    for x, w in (stations[0], stations[-1]):
        profile = [pt(x, w, j / 5, -1) for j in range(5, -1, -1)] + [pt(x, w, j / 5, 1) for j in range(6)]
        # End caps face away from the boat's centre.
        if x > 0:
            profile.reverse()
        polygon(m, profile, teal, 'timber', (0, 1, 0))
    m.beam((-1.77, -.08, 0), (1.78, -.08, 0), (.10, .13), wood)
    # Bottom floorboards, two thwarts and exposed ribs inside the open hull.
    for z in (-.21, -.07, .07, .21):
        m.box((-1.16, -.05, z - .06), (1.12, .005, z + .06), shade(wood, .94), 'timber')
    for x in (-.95, -.2, .6, 1.1):
        w = .57 if x < .8 else .43
        for side in (-1, 1):
            pts = [(x, -.03, 0), (x, .05, side * w * .55), (x, .23, side * (w - .035)), (x, .36, side * w)]
            for a, b in zip(pts, pts[1:]):
                m.beam(a, b, (.055, .055), wood)
    for x, w in [(-.58, .59), (.55, .55)]:
        m.box((x - .14, .23, -w), (x + .14, .30, w), wood, 'timber', (0, 0, 1))
    # Oars lie diagonally inside, with broad, unmistakable paddle blades.
    for side in (-1, 1):
        a = Vector((-.99, .335, side * .20))
        b = Vector((.96, .335, side * .23))
        tube(m, a, b, .028, wood, sides=8)
        d = (b - a).normalized()
        p = b - d * .16
        m.beam(p, b + d * .39, (.18, .045), shade(wood, 1.1))
    return m.finish('rowboat')


def scarecrow():
    m = Model()
    wood, straw, sack = lin(0x9d7851), lin(0xd6b66c), lin(0xccb58a)
    blue, seam = lin(0x758b9b), lin(0x596f80)
    m.beam((0, 0, 0), (0, 1.91, 0), (.11, .11), wood)
    m.beam((-.76, 1.49, 0), (.76, 1.49, 0), (.085, .085), wood)
    # Closed, flared coat torso with a gently uneven hem.
    m.hexa([(-.34, .75, -.14), (.32, .79, -.14), (.32, .79, .16), (-.34, .75, .16),
            (-.23, 1.57, -.12), (.23, 1.57, -.12), (.23, 1.57, .15), (-.23, 1.57, .15)], blue, 'plain')
    for side in (-1, 1):
        m.beam((side * .16, 1.46, 0), (side * .70, 1.35, 0), (.25, .27), blue, 'plain')
        m.beam((side * .64, 1.37, .005), (side * .73, 1.35, .005), (.28, .285), seam, 'plain')
        for j in range(4):
            m.beam((side * .71, 1.34 + (j - 1.5) * .045, (j % 2 - .5) * .09),
                   (side * (.88 + (j % 2) * .045), 1.25 + j * .05, (j % 2 - .5) * .12), (.027, .027), straw, 'plain')
    # Collar, front placket, large repair patch, and warm wooden buttons.
    m.beam((-.20, 1.57, .17), (0, 1.38, .185), (.085, .045), seam, 'plain')
    m.beam((.20, 1.57, .17), (0, 1.38, .185), (.085, .045), seam, 'plain')
    m.box((-.025, .84, .163), (.025, 1.42, .19), seam)
    m.box((.12, .91, .165), (.27, 1.09, .185), lin(0xac9476))
    for y in (1.02, 1.20, 1.36):
        tube(m, (.055, y, .17), (.055, y, .205), .028, wood, 'plain', sides=8)
    ellipsoid(m, (0, 1.78, .015), (.175, .215, .15), sack, 1, 12, 6)
    # Friendly sewn face; no black marks.
    for x in (-.065, .065):
        tube(m, (x, 1.82, .142), (x, 1.82, .16), .022, lin(0x756451), 'plain', sides=6)
    m.beam((-.055, 1.71, .153), (.055, 1.70, .153), (.018, .018), lin(0x977754), 'plain')
    # Wide brim and tapered crown.
    tube(m, (0, 1.94, .005), (0, 1.995, .005), .35, straw, 'plain', 18, .34)
    tube(m, (0, 1.985, .005), (0, 2.17, .005), .20, straw, 'plain', 14, .145)
    tube(m, (0, 1.997, .005), (0, 2.045, .005), .202, lin(0xa17e54), 'plain', 14, .188)
    return m.finish('scarecrow')


def previews(obj, name):
    # Preview-only material wiring; GLBs are already exported with the shed settings.
    for mat in obj.data.materials:
        mat.use_nodes = True
        nt = mat.node_tree
        bsdf = nt.nodes.get('Principled BSDF')
        attr = nt.nodes.new('ShaderNodeAttribute')
        attr.attribute_name = '_COLOR'
        nt.links.new(attr.outputs['Color'], bsdf.inputs['Base Color'])
        bsdf.inputs['Roughness'].default_value = .9
    scene = bpy.context.scene
    scene.render.engine = 'CYCLES'
    scene.cycles.samples = 12
    scene.cycles.use_denoising = True
    scene.render.resolution_x, scene.render.resolution_y = 720, 560
    scene.render.resolution_percentage = 100
    scene.world = bpy.data.worlds.new('warm sky')
    scene.world.use_nodes = True
    scene.world.node_tree.nodes['Background'].inputs[0].default_value = (.70, .78, .85, 1)
    scene.world.node_tree.nodes['Background'].inputs[1].default_value = .65
    scene.view_settings.view_transform = 'Standard'
    bounds = [obj.matrix_world @ Vector(p) for p in obj.bound_box]
    centre = sum(bounds, Vector()) / 8
    size = max(obj.dimensions)
    bpy.ops.object.light_add(type='AREA', location=centre + Vector((-3, -4, 7)))
    bpy.context.object.data.energy = 450
    bpy.context.object.data.shape = 'DISK'
    bpy.context.object.data.size = 5
    dest = Path(__file__).resolve().parents[2] / 'out/models'
    dest.mkdir(parents=True, exist_ok=True)
    for view, (sx, sy) in enumerate([(1, -1), (-1, 1)]):
        bpy.ops.object.camera_add(location=centre + Vector((sx * .6124, sy * .6124, .5)) * 10)
        camera = bpy.context.object
        camera.rotation_euler = (centre - camera.location).to_track_quat('-Z', 'Y').to_euler()
        camera.data.type = 'ORTHO'
        camera.data.ortho_scale = size * 1.40
        scene.camera = camera
        scene.render.filepath = str(dest / f'{name}-{view}.png')
        bpy.ops.render.render(write_still=True)


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for name, build in [('haywagon', wagon), ('rowboat', boat), ('scarecrow', scarecrow)]:
        if any(a.startswith('--only=') for a in ARGS) and f'--only={name}' not in ARGS:
            continue
        bpy.ops.wm.read_factory_settings(use_empty=True)
        obj = build()
        # Centre each footprint, keeping the boat's waterline and the others' ground at y=0.
        xs = [v.co.x for v in obj.data.vertices]
        zs = [-v.co.y for v in obj.data.vertices]
        dx, dz = (min(xs) + max(xs)) / 2, (min(zs) + max(zs)) / 2
        for v in obj.data.vertices:
            v.co.x -= dx
            v.co.y += dz
        bpy.context.view_layer.objects.active = obj
        obj.select_set(True)
        path = str(OUT / f'{name}.glb')
        bpy.ops.export_scene.gltf(
            filepath=path, export_format='GLB', use_selection=True, export_yup=True, export_apply=False,
            export_normals=True, export_texcoords=True, export_materials='EXPORT', export_vertex_color='NONE',
            export_all_vertex_colors=False, export_attributes=True, export_tangents=False, export_animations=False, export_extras=False)
        obj.data.calc_loop_triangles()
        bounds = [(min(v.co[k] for v in obj.data.vertices), max(v.co[k] for v in obj.data.vertices)) for k in range(3)]
        print(f'MODEL {name}: {len(obj.data.loop_triangles)} triangles; game x={bounds[0]}, y={bounds[2]}, z={(-bounds[1][1], -bounds[1][0])}', flush=True)
        if '--previews' in ARGS:
            previews(obj, name)


main()
