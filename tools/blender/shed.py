# The farm's test shed (#10): a small timber field shed with an open porch, modelled in Blender by this script and exported
# as glTF for the renderer, one file per style:
#   flatpak run org.blender.Blender -b --factory-startup --python tools/blender/shed.py -- src/scenes/models [style ...]
# Styles: timber (weathered boards, a rusty tin roof: the developer's pick, #10), red (barn-red boards, white trim, grey
# tin), pale (sage boards, cream trim, timber shingles). With none given, all three.
#
# Inked, as the farm's other made things are: each piece is one flat colour per face (per corner on the roof, for its rust),
# so the post pass draws lines only where pieces meet at an angle or stand proud: the corners, the trim, the door's
# braces, the roof's edges. The boards of a wall are coplanar, so they show as a change of tone, not as lines.
# Each face's material says how the ink shader finishes it (src/scenes/model.ts): plain, timber (grain), glass (panes),
# tin (corrugations) or shingle (courses).
#
# Built in the game's frame (x right, y up, z towards the front: the porch), metres, the floor's middle at the origin;
# Blender's own frame is z-up, so points are turned into it as they're made, and the glTF exporter turns them back.
import math
import random
import sys

import bmesh
import bpy
from mathutils import Vector

ARGS = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
OUT = ARGS[0] if ARGS else '.'
STYLES = ARGS[1:] or ['timber', 'red', 'pale']

# The shed: a room W wide and D deep, an open porch P deep in front of it, under one gabled roof.
W, D, P = 4.0, 3.0, 2.0
H = 2.3             # the walls' top (the eaves' plates)
RISE = 1.2          # the ridge above the walls (about 31°)
T = 0.07            # wall boards' thickness
OVER_SIDE, OVER_BACK, OVER_FRONT = 0.35, 0.3, 0.25
SILL = 0.12         # the sill the walls stand on, sunk into the ground below 0
ZB, ZF, ZP = -D / 2, D / 2, D / 2 + P   # back wall, front wall, porch posts' line


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


STYLE = {
    'timber': dict(boards=[0xb8a48a, 0xae9a80, 0xc2ae94, 0xa8957c], trim=0x8a7660, sill=0x6a5646, door=0x7f9a82,
                   frame=0xe2d8c2, roof='tin', sheet=0x8e999e, rust=0xb0663c, rusty=0.55),
    'red': dict(boards=[0xa84a3c, 0xa04436, 0xb05042, 0x9a4234], trim=0xeee6d2, sill=0x6a5646, door=0xa84a3c,
                frame=0xeee6d2, roof='tin', sheet=0x7f8b93, rust=0xa8643c, rusty=0.2),
    'pale': dict(boards=[0xb4c49c, 0xaebe96, 0xbccaa4, 0xa8b892], trim=0xf2e6c4, sill=0x6a5646, door=0x8fbccc,
                 frame=0xf2e6c4, roof='shingle', sheet=0x9a6c48, rust=0x7e5a40, rusty=0.0),
}

MATERIALS = ['plain', 'timber', 'glass', 'tin', 'shingle']


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


def roof_y(x):
    """The roof's underside over x: the ridge at the middle, falling to the eaves (past the walls)."""
    return H + RISE * (1 - abs(x) / (W / 2))


def build(style):
    s = STYLE[style]
    rand = random.Random(10)
    m = Model()
    trim, sill, door_col, frame = lin(s['trim']), lin(s['sill']), lin(s['door']), lin(s['frame'])
    board_cols = [lin(h) for h in s['boards']]

    def board_col():
        c = rand.choice(board_cols)
        return shade(c, 0.95 + rand.random() * 0.1)

    def widths(a, b):
        """Board edges from a to b, each board 17 to 23 cm."""
        xs, x = [a], a
        while b - x > 0.3:
            x += 0.17 + rand.random() * 0.06
            xs.append(x)
        xs.append(b)
        return xs

    def edges_with(a, b, cuts):
        """Board edges from a to b, with an edge at each cut (an opening's side, the ridge), so boards stop at them."""
        stops = sorted({a, b, *[c for c in cuts if a < c < b]})
        out = []
        for p, q in zip(stops, stops[1:]):
            out += widths(p, q)[:-1]
        return out + [b]

    # The sill: a frame of heavy timber round the room, sunk into the ground.
    for (x0, x1, z0, z1) in [(-W / 2 - 0.04, W / 2 + 0.04, ZB - 0.04, ZB + 0.1), (-W / 2 - 0.04, W / 2 + 0.04, ZF - 0.1, ZF + 0.04),
                             (-W / 2 - 0.04, -W / 2 + 0.1, ZB, ZF), (W / 2 - 0.1, W / 2 + 0.04, ZB, ZF)]:
        m.box((x0, -0.4, z0), (x1, SILL, z1), sill, 'timber')

    DOOR = (-0.55, 0.55, 2.0)          # x from, x to, top
    FRONT_WINDOW = (0.95, 1.65, 1.05, 1.65)   # x from, x to, y from, y to
    SIDE_WINDOW = (-0.45, 0.45, 1.05, 1.65)   # z from, z to (on the right wall), y from, y to

    def gable_wall(z_out, thick, openings, y_from=SILL):
        """A front or back wall of upright boards, its top following the roof; openings: (x0, x1, y0, y1) left out."""
        z0, z1 = (z_out - thick, z_out) if z_out > 0 else (z_out, z_out + thick)
        edges = edges_with(-W / 2, W / 2, [0.0] + [x for o in openings for x in o[:2]])
        for a, b in zip(edges, edges[1:]):
            col = board_col()
            spans = [(y_from, None)]
            for (ox0, ox1, oy0, oy1) in openings:
                if a >= ox0 - 1e-6 and b <= ox1 + 1e-6:
                    spans = [(y_from, oy0), (oy1, None)] if oy0 > y_from + 0.01 else [(oy1, None)]
            for (y0, y1) in spans:
                ya, yb = (roof_y(a), roof_y(b)) if y1 is None else (y1, y1)
                m.hexa([(a, y0, z0), (b, y0, z0), (b, y0, z1), (a, y0, z1), (a, ya, z0), (b, yb, z0), (b, yb, z1), (a, ya, z1)],
                       col, 'timber', (0, 1, 0))

    def side_wall(x_out, openings):
        x0, x1 = (x_out - T, x_out) if x_out > 0 else (x_out, x_out + T)
        edges = edges_with(ZB, ZF, [z for o in openings for z in o[:2]])
        for a, b in zip(edges, edges[1:]):
            col = board_col()
            spans = [(SILL, H)]
            for (oz0, oz1, oy0, oy1) in openings:
                if a >= oz0 - 1e-6 and b <= oz1 + 1e-6:
                    spans = [(SILL, oy0), (oy1, H)]
            for (y0, y1) in spans:
                m.box((x0, y0, a), (x1, y1, b), col, 'timber', (0, 1, 0))

    gable_wall(ZB, T, [])
    gable_wall(ZF, T, [(DOOR[0], DOOR[1], SILL, DOOR[2]), (FRONT_WINDOW[0], FRONT_WINDOW[1], FRONT_WINDOW[2], FRONT_WINDOW[3])])
    side_wall(-W / 2, [])
    side_wall(W / 2, [SIDE_WINDOW])

    # Corner posts, standing a little proud of the boards.
    for x in (-W / 2, W / 2):
        for z in (ZB, ZF):
            m.box((x - 0.07, SILL, z - 0.07), (x + 0.07, H, z + 0.07), trim, 'timber')
    # Plates along the eaves, out to the porch's posts, and the porch's posts on stone pads, braced to the plates and the beam.
    for sx in (-1, 1):
        # Kept under the roof's underside, which falls past the walls: its top a little below the walls'.
        x = sx * (W / 2 - 0.06)
        m.box((x - 0.07, H - 0.15, ZB - 0.1), (x + 0.07, H - 0.03, ZP + 0.1), trim, 'timber')
        m.box((x - 0.08, -0.3, ZP - 0.08), (x + 0.08, H - 0.12, ZP + 0.08), trim, 'timber')
        m.box((x - 0.16, -0.2, ZP - 0.16), (x + 0.16, 0.08, ZP + 0.16), lin(0x9a9184), 'plain')
        m.beam((x, H - 0.62, ZP), (x, H - 0.12, ZP - 0.5), (0.08, 0.08), trim)
        m.beam((x, H - 0.62, ZP), (x - sx * 0.5, H - 0.12, ZP), (0.08, 0.08), trim)
    # The porch's beam across the front, and the gable over it boarded in.
    m.box((-W / 2 - 0.04, H - 0.24, ZP - 0.07), (W / 2 + 0.04, H - 0.04, ZP + 0.07), trim, 'timber')
    gable_wall(ZP + 0.03, 0.05, [], y_from=H - 0.04)

    # The door: two ledged-and-braced leaves, set in a little, in a frame of trim.
    zd = ZF - 0.03
    for (x0, x1) in [(DOOR[0], 0), (0, DOOR[1])]:
        edges = [x0 + (x1 - x0) * k / 4 for k in range(5)]
        for a, b in zip(edges, edges[1:]):
            m.box((a, SILL, zd - 0.03), (b, DOOR[2], zd), shade(door_col, 0.95 + rand.random() * 0.1), 'timber', (0, 1, 0))
        for y in (0.45, DOOR[2] - 0.35):
            m.box((x0 + 0.04, y - 0.06, zd), (x1 - 0.04, y + 0.06, zd + 0.025), shade(door_col, 0.9), 'timber')
        m.beam((x0 + 0.1 if x0 < 0 else x1 - 0.1, 0.51, zd + 0.0125), (x1 - 0.1 if x0 < 0 else x0 + 0.1, DOOR[2] - 0.41, zd + 0.0125),
               (0.1, 0.025), shade(door_col, 0.9), up=(0, 0, 1))
    m.box((DOOR[0] - 0.08, SILL, ZF), (DOOR[0], DOOR[2] + 0.08, ZF + 0.03), frame, 'timber')
    m.box((DOOR[1], SILL, ZF), (DOOR[1] + 0.08, DOOR[2] + 0.08, ZF + 0.03), frame, 'timber')
    m.box((DOOR[0] - 0.08, DOOR[2], ZF), (DOOR[1] + 0.08, DOOR[2] + 0.08, ZF + 0.03), frame, 'timber')

    def window(corners, normal_out):
        """Glass in four panes, set back in its frame of trim, a sill under it. corners: the opening's four, outside face."""
        (a, b, c, d) = [Vector(p) for p in corners]
        n = Vector(normal_out)
        back = -n * 0.04
        m.face([a + back, b + back, c + back, d + back], [lin(0x1d4fa0)] * 4, [(0, 0), (1, 0), (1, 1), (0, 1)], 'glass')
        across, up = (b - a).normalized(), (d - a).normalized()
        o = n * 0.025
        for (p, q) in [(a, b), (d, c)]:
            m.beam(p - across * 0.07 + o, q + across * 0.07 + o, (0.08, 0.06), frame, up=tuple(n))
        for (p, q) in [(a, d), (b, c)]:
            m.beam(p + o, q + o, (0.08, 0.06), frame, up=tuple(n))
        # The glazing bars.
        m.beam((a + b) / 2 + back * 0.5, (d + c) / 2 + back * 0.5, (0.03, 0.03), frame, up=tuple(n))
        m.beam((a + d) / 2 + back * 0.5, (b + c) / 2 + back * 0.5, (0.03, 0.03), frame, up=tuple(n))
        m.beam(a - across * 0.12 - up * 0.05 + n * 0.06, b + across * 0.12 - up * 0.05 + n * 0.06, (0.08, 0.05), frame, up=tuple(n))

    fx0, fx1, fy0, fy1 = FRONT_WINDOW
    window([(fx0, fy0, ZF), (fx1, fy0, ZF), (fx1, fy1, ZF), (fx0, fy1, ZF)], (0, 0, 1))
    sz0, sz1, sy0, sy1 = SIDE_WINDOW
    window([(W / 2, sy0, sz1), (W / 2, sy0, sz0), (W / 2, sy1, sz0), (W / 2, sy1, sz1)], (1, 0, 0))

    # The roof: two slopes from the ridge, out past the walls, over the porch; each in sheets down the slope (tin) or
    # in one piece (shingles), on top of the walls' gables, with a cap along the ridge and barge boards at the ends.
    sheet, rust = lin(s['sheet']), lin(s['rust'])
    zr0, zr1 = ZB - OVER_BACK, ZP + OVER_FRONT
    xe = W / 2 + OVER_SIDE
    th = 0.05
    for sx in (-1, 1):
        # The underside's line from the ridge (x 0) to the eave (x xe), then the top's, th above it.
        def at(x, z, top):
            return (sx * x, roof_y(x) + (th if top else 0.0), z)
        edges = [zr0 + (zr1 - zr0) * k / 7 for k in range(8)] if s['roof'] == 'tin' else [zr0, zr1]
        for a, b in zip(edges, edges[1:]):
            base = shade(sheet, 0.94 + rand.random() * 0.12)
            # Rust creeps up from the eave, more on some sheets than others.
            r = s['rusty'] * (0.4 + rand.random() * 0.6)
            low = mix(base, rust, r)
            # Upper part, then the lower part, the colour easing to rust towards the eave.
            x_mid = xe * 0.62
            for (xa, xb, ca, cb) in [(0.0, x_mid, base, base), (x_mid, xe, base, low)]:
                cols = [ca, cb, cb, ca, ca, cb, cb, ca]
                m.hexa([at(xa, a, False), at(xb, a, False), at(xb, b, False), at(xa, b, False),
                        at(xa, a, True), at(xb, a, True), at(xb, b, True), at(xa, b, True)],
                       base, s['roof'], (sx, -RISE / (W / 2), 0), cols)
    # Ridge cap.
    cap = shade(sheet, 0.85) if s['roof'] == 'tin' else lin(0x7e5a40)
    for sx in (-1, 1):
        m.hexa([(0, roof_y(0) + th, zr0 - 0.02), (sx * 0.16, roof_y(0.16) + th, zr0 - 0.02),
                (sx * 0.16, roof_y(0.16) + th, zr1 + 0.02), (0, roof_y(0) + th, zr1 + 0.02),
                (0, roof_y(0) + th + 0.035, zr0 - 0.02), (sx * 0.16, roof_y(0.16) + th + 0.035, zr0 - 0.02),
                (sx * 0.16, roof_y(0.16) + th + 0.035, zr1 + 0.02), (0, roof_y(0) + th + 0.035, zr1 + 0.02)],
               cap, 'plain', (0, 0, 1))
    # Barge boards along the gables' edges, front and back.
    for z in (zr0 - 0.01, zr1 + 0.01):
        for sx in (-1, 1):
            p0, p1 = Vector((0, roof_y(0) - 0.04, z)), Vector((sx * (xe + 0.02), roof_y(xe + 0.02) - 0.04, z))
            m.beam(p0, p1, (0.04, 0.2), trim, up=(0, 1, 0))

    # On the porch: a bench under the window, two crates by the door, and a water butt at the corner under the eave.
    bench = shade(lin(0x8a7660), 1.05)
    m.box((0.75, 0.42, ZF + 0.12), (1.85, 0.47, ZF + 0.5), bench, 'timber')
    for x in (0.85, 1.75):
        m.box((x - 0.04, 0.0, ZF + 0.16), (x + 0.04, 0.42, ZF + 0.46), bench, 'timber')
    crate = lin(0xb07a4a)
    for (x, y, z, turn) in [(-1.45, 0.0, ZF + 0.55, 0.0), (-1.4, 0.42, ZF + 0.55, 0.08)]:
        c, s_ = math.cos(turn), math.sin(turn)
        pt = lambda lx, ly, lz: (x + lx * c - lz * s_, y + ly, z + lx * s_ + lz * c)
        L, Dd, Hc = 0.6, 0.4, 0.4
        m.hexa([pt(-L / 2, 0, -Dd / 2), pt(L / 2, 0, -Dd / 2), pt(L / 2, 0, Dd / 2), pt(-L / 2, 0, Dd / 2),
                pt(-L / 2, Hc, -Dd / 2), pt(L / 2, Hc, -Dd / 2), pt(L / 2, Hc, Dd / 2), pt(-L / 2, Hc, Dd / 2)],
               shade(crate, 0.95 + rand.random() * 0.1), 'timber', (c, 0, s_))
    butt = (-W / 2 - 0.42, ZF - 0.35)
    m.cylinder(butt, 0.32, -0.05, 0.9, 16, shade(crate, 0.85))
    for y in (0.12, 0.75):
        m.cylinder(butt, 0.335, y - 0.025, y + 0.025, 16, shade(lin(0xc08a48), 0.7), 'plain')

    return m.finish(f'shed-{style}')


def export(style):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    obj = build(style)
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    path = f'{OUT}/shed-{style}.glb'
    bpy.ops.export_scene.gltf(
        filepath=path, export_format='GLB', use_selection=True, export_yup=True, export_apply=False,
        export_normals=True, export_texcoords=True, export_materials='EXPORT', export_vertex_color='NONE',
        export_all_vertex_colors=False, export_attributes=True, export_tangents=False, export_animations=False, export_extras=False,
    )
    print(f'wrote {path}')


for st in STYLES:
    export(st)
