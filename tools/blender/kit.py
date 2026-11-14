# The modelling kit shared by every generator in tools/blender/models/ (see docs/MODELS.md).
# Model space is the renderer's: metres, x right, y up, +z front, the footprint centred on the ground at y = 0.
import math
import random
from contextlib import contextmanager
import bmesh
import bpy
from mathutils import Matrix, Vector

# The importer (src/scenes/model.ts) reads the finish from the material's name. `moss` is the one that isn't inked: living
# surfaces (a planted roof, a planter's greens) are painted, as everything that grows is (docs/DIRECTION.md).
MATERIALS = ['plain', 'timber', 'glass', 'tin', 'moss']
# One game tile, in this renderer's metres (docs/MODELS.md, "Scale").
TILE = 4.0
# Edges that fold more sharply than this are creases (the ink draws them); gentler ones shade smoothly, with no line.
SHARP = math.radians(40)


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


class Palette:
    """The set's few colours (docs/MODELS.md, "Palette"): lime-white walls, honey timber, terracotta, copper, solar blue."""
    plaster = lin(0xf3ecdb)
    plaster_warm = lin(0xead9b8)
    ceramic = lin(0xf6f2e8)
    timber = lin(0xc9975c)
    timber_light = lin(0xddb47e)
    timber_dark = lin(0x9c6c44)
    terracotta = lin(0xcf6a40)
    terracotta_light = lin(0xe08a5c)
    copper = lin(0xc87848)
    brass = lin(0xd9aa52)
    verdigris = lin(0x62b09c)
    solar = lin(0x1d4fa0)
    seaglass = lin(0x9ad2c8)
    moss = lin(0x6aa24a)
    moss_light = lin(0x8cba52)
    moss_deep = lin(0x4a8a4e)
    stone = lin(0xbdb29c)
    stone_dark = lin(0xa39a88)
    linen = lin(0xf0e6ca)
    soil = lin(0x5c4030)
    dark = lin(0x4a3a30)
    red = lin(0xd8452e)
    gold = lin(0xe9b134)
    straw = lin(0xe3c273)
    glow = lin(0xffb44a)
    teal = lin(0x3f8f8a)
    sky = lin(0x86b8d8)
    tyre = lin(0x4c4a52)


P = Palette


def rrect(w, d, r, seg=3, cx=0.0, cz=0.0):
    """A rounded rectangle's outline on the ground, (x, z) points: w wide, d deep, corners of radius r in `seg` steps."""
    r = min(r, w / 2 - 1e-4, d / 2 - 1e-4)
    out = []
    for qx, qz, a0 in ((1, 1, 0), (-1, 1, 90), (-1, -1, 180), (1, -1, 270)):
        ox, oz = cx + qx * (w / 2 - r), cz + qz * (d / 2 - r)
        for i in range(seg + 1):
            a = math.radians(a0 + 90 * i / seg)
            out.append((ox + r * math.cos(a), oz + r * math.sin(a)))
    return out


def circle(r, n, cx=0.0, cz=0.0, phase=0.0):
    return [(cx + r * math.cos(phase + 2 * math.pi * i / n), cz + r * math.sin(phase + 2 * math.pi * i / n)) for i in range(n)]


def arc(half, rise, n):
    """A shallow arch's profile, (z, y) points from z = -half over the crown (y = rise) to z = +half."""
    rc = (half * half + rise * rise) / (2 * rise)
    th = math.asin(min(1.0, half / rc))
    return [(rc * math.sin(-th + 2 * th * k / n), rise - rc + rc * math.cos(-th + 2 * th * k / n)) for k in range(n + 1)]


def archway(w, h, z=0.0, n=8):
    """A round-headed opening's outline, (x, y, z) points: w wide, h high, its foot at y = 0."""
    return [(-w / 2, 0, z), (w / 2, 0, z)] + [(w / 2 * math.cos(math.pi * i / n), h - w / 2 + w / 2 * math.sin(math.pi * i / n), z) for i in range(n + 1)]


def at_y(outline, y, scale=1.0, cx=0.0, cz=0.0):
    """An outline lifted to a height, optionally scaled about (cx, cz)."""
    return [(cx + (x - cx) * scale, y, cz + (z - cz) * scale) for x, z in outline]


def planar_uv(pts, grain=None):
    """UVs in metres for a flat face: u along the grain (or its longest edge), v across."""
    pts = [Vector(p) for p in pts]
    n = Vector()
    for i in range(len(pts)):
        n += (pts[i] - pts[0]).cross(pts[(i + 1) % len(pts)] - pts[0])
    if n.length < 1e-12:
        return [(0, 0)] * len(pts)
    n.normalize()
    g = Vector(grain) if grain else max(((pts[(i + 1) % len(pts)] - pts[i]) for i in range(len(pts))), key=lambda e: e.length)
    g = g - n * g.dot(n)
    if g.length < 1e-6:
        g = n.cross(Vector((1, 0, 0)) if abs(n.x) < 0.9 else Vector((0, 0, 1)))
    g.normalize()
    w = n.cross(g)
    return [(p.dot(g), p.dot(w)) for p in pts]


class Model:
    """
    One model: its main mesh, and any named parts (a turbine's rotor) kept as separate pieces with their own origin, ready
    to move when the renderer can. Shapes are drawn through a stack of transforms (`at`), so a piece is built upright at
    the origin and then placed.
    """

    def __init__(self, name):
        self.name = name
        self.parts = {}
        self.empties = []
        self.stack = [Matrix.Identity(4)]
        self.part()

    # --- parts and transforms ---

    def part(self, name=None, origin=(0, 0, 0), axis=None, **props):
        """
        Draw into a named piece from here on (no name: the main mesh). Its origin and, for a spinning part, the axis its
        local x lies along are given in the current frame.
        """
        name = name or self.name
        if name not in self.parts:
            bm = bmesh.new()
            m = self.stack[-1]
            ax = (m.to_3x3() @ Vector(axis)).normalized() if axis else None
            self.parts[name] = dict(bm=bm, col=bm.loops.layers.float_color.new('_COLOR'), uv=bm.loops.layers.uv.new('UVMap'),
                                    origin=m @ Vector(origin), axis=ax, props=props)
        self.cur = self.parts[name]

    @contextmanager
    def at(self, pos=(0, 0, 0), yaw=0.0, pitch=0.0, roll=0.0, scale=1.0):
        """Draw in a frame moved to `pos` and turned (degrees): yaw about y, then pitch about x, then roll about z."""
        s = scale if isinstance(scale, (tuple, list)) else (scale, scale, scale)
        m = (Matrix.Translation(Vector(pos)) @ Matrix.Rotation(math.radians(yaw), 4, 'Y') @ Matrix.Rotation(math.radians(pitch), 4, 'X')
             @ Matrix.Rotation(math.radians(roll), 4, 'Z') @ Matrix.Diagonal((s[0], s[1], s[2], 1.0)))
        self.stack.append(self.stack[-1] @ m)
        try:
            yield
        finally:
            self.stack.pop()

    def world(self, p):
        return self.stack[-1] @ Vector(p)

    @staticmethod
    def blender(p):
        return Vector((p[0], -p[2], p[1]))

    def v(self, p):
        return self.cur['bm'].verts.new(self.blender(self.world(p)))

    def empty(self, name, pos, scale=(1, 1, 1)):
        """A named point the game or the scene reads (a smoke emitter, a plant to grow)."""
        self.empties.append((name, self.world(pos), scale))

    def plant(self, kind, pos, radius, tall):
        """
        Where the scene grows a painted plant on the model (never modelled: what grows is painted). Kinds: `herb` (a low
        green cushion), `flower` (the same, in bloom), `shrub` (a rounder, deeper green clump), `vine` (a climber: a column
        `tall` high).
        """
        self.empties.append((f'plant_{kind}_{len(self.empties):02d}', self.world(pos), (radius, tall, radius)))

    # --- faces ---

    def face(self, pts, cols, uvs, mat, verts=None, smooth=True):
        vs = verts or [self.v(p) for p in pts]
        try:
            f = self.cur['bm'].faces.new(vs)
        except ValueError:
            return None
        f.material_index = MATERIALS.index(mat)
        f.smooth = smooth
        for loop, c, uv in zip(f.loops, cols, uvs):
            loop[self.cur['col']] = c
            loop[self.cur['uv']].uv = uv
        return f

    def poly(self, pts, col, mat='plain', grain=None):
        """A flat face (seen from both sides), UVs in metres."""
        return self.face(pts, [col] * len(pts), planar_uv(pts, grain), mat)

    def hexa(self, c, col, mat='plain', grain=(0, 1, 0), cols=None):
        """A six-sided piece from its eight corners (c[0..3] one ring, c[4..7] the other, the same order)."""
        c = [Vector(p) for p in c]
        mid = sum(c, Vector()) / 8
        for q in [(0, 3, 2, 1), (4, 5, 6, 7), (0, 1, 5, 4), (1, 2, 6, 5), (2, 3, 7, 6), (3, 0, 4, 7)]:
            pts = [c[i] for i in q]
            n = (pts[1] - pts[0]).cross(pts[2] - pts[0])
            if n.length < 1e-9:
                n = (pts[2] - pts[1]).cross(pts[3] - pts[1])
            if n.dot(sum(pts, Vector()) / 4 - mid) < 0:
                pts.reverse()
                q = tuple(reversed(q))
            self.face(pts, [cols[i] for i in q] if cols else [col] * 4, planar_uv(pts, grain), mat)

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
        self.hexa(ring(a) + ring(b), col, mat, tuple(d))

    def loft(self, rings, col=None, mat='plain', cols=None, mats=None, closed=True, cap0=False, cap1=False, uv='along',
             wrap=False, flip=False, cap_col=None, cap_mat=None):
        """
        A skin over a run of rings (each a list of points, the same count in each, or one point for a tip). Shared corners,
        so it shades smoothly wherever it bends gently and creases where it folds. `cols` / `mats`: a list by band, or a
        function of (band, segment). UVs in metres: u along the run, v round the ring (`uv='around'` swaps them).
        """
        R = [[Vector(p) for p in ring] for ring in rings]
        L = len(R)
        n = max(len(r) for r in R)
        V = [[self.v(p) for p in ring] for ring in R]
        pt = lambda i, j: R[i % L][j % n if len(R[i % L]) > 1 else 0]
        vt = lambda i, j: V[i % L][j % n if len(R[i % L]) > 1 else 0]
        U = [[0.0] * (n + 1)]
        for i in range(1, L + 1):
            U.append([U[i - 1][j] + (pt(i, j) - pt(i - 1, j)).length for j in range(n + 1)])
        W = []
        for i in range(L):
            w = [0.0]
            for j in range(1, n + 1):
                w.append(w[-1] + (pt(i, j) - pt(i, j - 1)).length)
            W.append(w)
        uvof = lambda i, j: (U[i][j], W[i % L][j]) if uv == 'along' else (W[i % L][j], U[i][j])
        pick = lambda table, default, i, j: (table(i, j) if callable(table) else table[i]) if table is not None else default
        faces = []
        for i in range(L if wrap else L - 1):
            la, lb = len(R[i]), len(R[(i + 1) % L])
            for j in range(n if closed else n - 1):
                if la == 1 and lb == 1:
                    continue
                # A tip's ring is one point: the band is a fan of triangles.
                idx = [(i, j), (i + 1, j + 1), (i + 1, j)] if la == 1 else [(i, j), (i, j + 1), (i + 1, j)] if lb == 1 else \
                    [(i, j), (i, j + 1), (i + 1, j + 1), (i + 1, j)]
                faces.append((idx, i, j))
        centre = sum((p for ring in R for p in ring), Vector()) / sum(len(r) for r in R)
        sign = 0.0
        for idx, _, _ in faces:
            ps = [pt(i, j) for i, j in idx]
            nrm = (ps[1] - ps[0]).cross(ps[2] - ps[0]) + ((ps[2] - ps[0]).cross(ps[3] - ps[0]) if len(ps) == 4 else Vector())
            sign += nrm.dot(sum(ps, Vector()) / len(ps) - centre)
        rev = (sign < 0) != flip
        for idx, i, j in faces:
            if rev:
                idx = list(reversed(idx))
            self.face(None, [pick(cols, col, i, j)] * len(idx), [uvof(a, b) for a, b in idx], pick(mats, mat, i, j),
                      verts=[vt(a, b) for a, b in idx])
        for on, i, back in ((cap0, 0, True), (cap1, L - 1, False)):
            if not on or len(R[i]) < 3:
                continue
            order = list(range(len(R[i])))
            # The start's cap faces back along the run, the end's forward.
            if back != rev:
                order.reverse()
            ps = [R[i][k] for k in order]
            self.face(None, [cap_col or pick(cols, col, min(i, L - 2), 0)] * len(ps), planar_uv(ps), cap_mat or 'plain',
                      verts=[V[i][k] for k in order])

    def prism(self, outline, y0, y1, col, mat='plain', top=1.0, caps=(True, True), cap_col=None, cap_mat=None, uv='along'):
        """An outline (x, z points) raised from y0 to y1; `top` scales the upper ring about the outline's middle."""
        cx = sum(p[0] for p in outline) / len(outline)
        cz = sum(p[1] for p in outline) / len(outline)
        self.loft([at_y(outline, y0), at_y(outline, y1, top, cx, cz)], col, mat, cap0=caps[0], cap1=caps[1], cap_col=cap_col,
                  cap_mat=cap_mat, uv=uv)

    def lathe(self, profile, col=None, mat='plain', sides=16, cols=None, mats=None, centre=(0, 0), phase=0.0, cap0=False,
              cap1=False, cap_col=None):
        """A turned shape: a profile of (radius, height) points swept round the y axis through `centre`."""
        rings = [[(centre[0], y, centre[1])] if r < 1e-6 else at_y(circle(r, sides, centre[0], centre[1], phase), y) for r, y in profile]
        self.loft(rings, col, mat, cols=cols, mats=mats, cap0=cap0, cap1=cap1, cap_col=cap_col)

    def dome(self, outline, y0, rise, col, mat='plain', steps=4, flat=0.0, cols=None, mats=None):
        """A pillow of a roof over an outline: it rounds in and up by `rise`; `flat` leaves that share of the top level."""
        cx = sum(p[0] for p in outline) / len(outline)
        cz = sum(p[1] for p in outline) / len(outline)
        rings = []
        for i in range(steps + 1):
            a = math.pi / 2 * i / steps
            rings.append(at_y(outline, y0 + rise * math.sin(a), flat + (1 - flat) * math.cos(a), cx, cz))
        if flat < 1e-6:
            rings[-1] = [(cx, y0 + rise, cz)]
        self.loft(rings, col, mat, cols=cols, mats=mats, cap1=flat > 1e-6, cap_mat=mat)

    def tube(self, a, b, r, col, mat='plain', sides=10, r2=None, caps=True, cap_col=None):
        """A round bar from a to b (a cone if r2 differs)."""
        a, b = Vector(a), Vector(b)
        d = (b - a).normalized()
        s = d.cross(Vector((0, 1, 0)))
        if s.length < 1e-6:
            s = Vector((1, 0, 0))
        s.normalize()
        t = d.cross(s)
        ring = lambda p, rad: [p + (s * math.cos(k) + t * math.sin(k)) * rad for k in (2 * math.pi * i / sides for i in range(sides))]
        r2 = r if r2 is None else r2
        self.loft([ring(a, r), [b] if r2 < 1e-6 else ring(b, r2)], col, mat, cap0=caps, cap1=caps and r2 > 1e-6, cap_col=cap_col)

    def pipe(self, pts, r, col, mat='plain', sides=8):
        """A round pipe through points, mitred at its bends."""
        pts = [Vector(p) for p in pts]
        rings = []
        ref = None
        for i, p in enumerate(pts):
            d0 = (p - pts[i - 1]).normalized() if i > 0 else None
            d1 = (pts[i + 1] - p).normalized() if i < len(pts) - 1 else None
            d = ((d0 or d1) + (d1 or d0)).normalized()
            if ref is None:
                ref = d.cross(Vector((0, 1, 0)))
                if ref.length < 1e-6:
                    ref = Vector((1, 0, 0))
            s = (ref - d * ref.dot(d)).normalized()
            ref = s
            t = d.cross(s)
            # A mitre is wider across the bend, so the pipe keeps its width either side of it.
            k = 1 / max(0.5, d.dot(d1 or d0))
            rings.append([p + (s * math.cos(a) + t * math.sin(a)) * r * k for a in (2 * math.pi * j / sides for j in range(sides))])
        self.loft(rings, col, mat, cap0=True, cap1=True)

    def ball(self, c, r, col, mat='plain', sides=10, squash=1.0):
        steps = max(3, sides // 2)
        prof = [(r * math.sin(math.pi * i / steps), -r * squash * math.cos(math.pi * i / steps)) for i in range(steps + 1)]
        prof[0], prof[-1] = (0, -r * squash), (0, r * squash)
        with self.at(c):
            self.lathe(prof, col, mat, sides)

    def torus(self, c, R, r, col, mat='plain', sides=20, around=6):
        """A ring lying flat (round the y axis) at c: a hoop, a rim."""
        rings = []
        for i in range(sides):
            a = 2 * math.pi * i / sides
            rings.append([(c[0] + (R + r * math.cos(b)) * math.cos(a), c[1] + r * math.sin(b), c[2] + (R + r * math.cos(b)) * math.sin(a))
                          for b in (2 * math.pi * k / around for k in range(around))])
        self.loft(rings, col, mat, wrap=True)

    def extrude(self, profile, x0, x1, col=None, mat='plain', cols=None, mats=None, caps=True, cap_col=None, cap_mat=None,
                uv='around', closed=True):
        """
        A profile of (z, y) points run along x: a roof, a gutter, a rail. `cols` / `mats` by profile segment. UVs: u down the
        profile (down a roof's slope), v along the run, as the tin and the solar glass want.
        """
        seg = lambda t: (lambda i, j: t[j % len(t)]) if t is not None else None
        self.loft([[(x0, y, z) for z, y in profile], [(x1, y, z) for z, y in profile]], col, mat, cols=seg(cols), mats=seg(mats),
                  closed=closed, cap0=caps and closed, cap1=caps and closed, cap_col=cap_col, cap_mat=cap_mat, uv=uv)

    def lunette(self, x, half, y0, rise, col, mat='plain', n=8, cz=0.0, inset=0.0):
        """The wall under a vault's end: the arch's shape, flat, at x."""
        pts = [(x, y0 + y, cz + z) for z, y in arc(half - inset, rise - inset, n)]
        return self.poly(pts, col, mat, grain=(0, 1, 0))

    def vault(self, x0, x1, half, y0, rise, top, thick=0.16, n=8, cz=0.0, edge=None, under=None):
        """
        A barrel-vault roof along x: `half` its half-span, springing at y0 and rising by `rise`. `top(k)` gives (colour,
        finish) for band k of n, from the back eave (k = 0) over the crown to the front one.
        """
        outer = [(cz + z, y0 + y) for z, y in arc(half, rise, n)]
        inner = [(cz + z, y0 + y - thick) for z, y in arc(half, rise, n)]
        tops = [top(k) for k in range(n)]
        edge = edge or P.timber
        cols = [c for c, _ in tops] + [edge] + [under or P.timber_light] * n + [edge]
        mats = [f for _, f in tops] + ['timber'] + ['timber'] * n + ['timber']
        self.extrude(outer + list(reversed(inner)), x0, x1, cols=cols, mats=mats, cap_col=edge, cap_mat='timber')

    # --- pieces of buildings ---

    def window(self, w, h, frame=None, glass=None, arch=False, proud=0.05, bar=0.09):
        """A window in the current frame: centred on x, its sill at y = 0, facing +z, standing `proud` of z = 0."""
        frame = frame or P.timber
        glass = glass or P.seaglass
        z = proud
        if arch:
            n = 8
            top = [(w / 2 * math.cos(math.pi * i / n), h - w / 2 + w / 2 * math.sin(math.pi * i / n), z * 0.6) for i in range(n + 1)]
            self.poly([(-w / 2, 0, z * 0.6), (w / 2, 0, z * 0.6)] + top, glass, 'glass')
            self.pipe([(w / 2, 0, z), *[(x, y, z) for x, y, _ in top], (-w / 2, 0, z)], bar / 2, frame, 'timber', sides=4)
            self.box((-w / 2 - bar / 2, -bar / 2, 0), (w / 2 + bar / 2, bar / 2, z + bar / 2), frame, 'timber')
            return
        self.poly([(-w / 2, 0, z * 0.6), (w / 2, 0, z * 0.6), (w / 2, h, z * 0.6), (-w / 2, h, z * 0.6)], glass, 'glass')
        for x in (-w / 2, w / 2):
            self.box((x - bar / 2, -bar / 2, 0), (x + bar / 2, h + bar / 2, z), frame, 'timber')
        for y in (0, h):
            self.box((-w / 2 - bar / 2, y - bar / 2, 0), (w / 2 + bar / 2, y + bar / 2, z + (0.04 if y == 0 else 0)), frame, 'timber')

    def porthole(self, r, frame=None, glass=None, proud=0.05, sides=14):
        """A round window centred on the current frame's origin, facing +z."""
        pts = [(r * math.cos(2 * math.pi * i / sides), r * math.sin(2 * math.pi * i / sides), proud * 0.6) for i in range(sides)]
        self.poly(pts, glass or P.seaglass, 'glass')
        with self.at((0, 0, proud * 0.5), pitch=90):
            self.torus((0, 0, 0), r, 0.06, frame or P.copper, sides=sides, around=5)

    def door(self, w, h, col=None, arch=True, proud=0.05, pull=None):
        """A plank door centred on x, its foot at y = 0, facing +z; round-headed unless told otherwise."""
        col = col or P.timber
        z = proud
        if arch:
            n = 8
            top = [(w / 2 * math.cos(math.pi * i / n), h - w / 2 + w / 2 * math.sin(math.pi * i / n), z) for i in range(n + 1)]
            self.poly([(-w / 2, 0, z), (w / 2, 0, z)] + top, col, 'timber', grain=(0, 1, 0))
            self.pipe([(w / 2, 0, z), *top, (-w / 2, 0, z)], 0.06, shade(col, 0.8), 'timber', sides=4)
        else:
            self.box((-w / 2, 0, 0), (w / 2, h, z), col, 'timber', (0, 1, 0))
        self.ball((w * 0.28, h * 0.45, z + 0.05), 0.06, pull or P.brass, sides=6)

    def planter(self, lo, hi, col=None, kind='herb', plants=None, tall=0.35):
        """A planter box filled with soil, with painted plants growing in it (see `plant`)."""
        col = col or P.terracotta
        x0, y0, z0 = lo
        x1, y1, z1 = hi
        self.box(lo, hi, col, 'timber' if col in (P.timber, P.timber_light, P.timber_dark) else 'plain')
        self.box((x0 + 0.06, y1 - 0.02, z0 + 0.06), (x1 - 0.06, y1 + 0.015, z1 - 0.06), P.soil)
        long_x = (x1 - x0) >= (z1 - z0)
        length, width = (x1 - x0, z1 - z0) if long_x else (z1 - z0, x1 - x0)
        n = plants or max(1, round(length / (width * 1.1)))
        for i in range(n):
            t = (i + 0.5) / n
            p = (x0 + length * t, y1, (z0 + z1) / 2) if long_x else ((x0 + x1) / 2, y1, z0 + length * t)
            self.plant(kind, p, width * 0.55, tall)

    def barrel(self, c, r=0.42, h=1.0, col=None, hoop=None):
        """A rain barrel standing at c (its foot)."""
        col = col or P.timber
        with self.at(c):
            self.lathe([(r * 0.86, 0), (r, h * 0.3), (r, h * 0.7), (r * 0.86, h)], col, 'timber', 12, cap1=True, cap_col=P.dark)
            for y in (h * 0.22, h * 0.78):
                self.lathe([(r * 0.98, y - 0.04), (r * 1.03, y - 0.04), (r * 1.03, y + 0.04), (r * 0.98, y + 0.04)], hoop or P.copper, sides=12)

    def solar(self, w, d, frame=None, edge=0.08, thick=0.07):
        """A sheet of solar glass lying in the current frame's xz plane, centred, its glass facing +y."""
        self.box((-w / 2, -thick, -d / 2), (w / 2, 0, d / 2), frame or P.ceramic)
        self.poly([(-w / 2 + edge, 0.012, -d / 2 + edge), (-w / 2 + edge, 0.012, d / 2 - edge), (w / 2 - edge, 0.012, d / 2 - edge),
                   (w / 2 - edge, 0.012, -d / 2 + edge)], P.solar, 'glass', grain=(1, 0, 0))

    def hut(self, outline, y0, y1, wall=None, skirt=None, skirt_h=0.55):
        """Rounded lime-white walls on a flush terracotta skirt: the set's bakehouses, offices and stores."""
        self.loft([at_y(outline, y) for y in (y0, y0 + skirt_h, y1)], cols=[skirt or P.terracotta, wall or P.plaster])

    def pillow(self, outline, y, rise, flat=0.3, rim=None, rim_h=0.16):
        """A planted pillow of a roof over an outline, on a timber rim."""
        self.prism(outline, y, y + rim_h, rim or P.timber, 'timber', caps=(True, False))
        self.dome(outline, y + rim_h, rise, P.moss, 'moss', steps=4, flat=flat, cols=[P.moss_deep, P.moss, P.moss, P.moss_light])

    def post(self, x, z, y1, size=0.17, col=None, shoe=True, y0=0.0):
        """A timber post on a stone shoe."""
        if shoe:
            with self.at((0, y0, 0)):
                self.shoe(x, z, size * 3, 0.26)
        self.box((x - size / 2, y0 + (0.26 if shoe else 0), z - size / 2), (x + size / 2, y1, z + size / 2), col or P.timber, 'timber', (0, 1, 0))

    def sack(self, c, r=0.38, col=None, lying=False):
        """A tied linen sack standing at c (its foot), or lying."""
        col = col or P.linen
        if lying:
            with self.at((c[0], c[1] + r * 0.7, c[2]), roll=90):
                self.lathe([(0, -r * 1.2), (r * 0.62, -r * 0.95), (r * 0.7, 0), (r * 0.62, r * 0.95), (0, r * 1.2)], col, sides=8)
            return
        with self.at(c):
            self.lathe([(r * 0.8, 0), (r, r * 0.6), (r * 0.85, r * 1.5), (r * 0.3, r * 2.0), (r * 0.42, r * 2.25)], col, sides=8, cap0=True, cap1=True)

    def jar(self, c, r=0.2, h=0.45, col=None, lid=None):
        """A preserving jar standing at c."""
        with self.at(c):
            self.lathe([(r * 0.85, 0), (r, h * 0.2), (r, h * 0.7), (r * 0.7, h * 0.86)], col or P.red, sides=7, cap0=True)
            self.lathe([(r * 0.78, h * 0.86), (r * 0.78, h)], lid or P.brass, sides=7, cap1=True)

    def crate(self, lo, hi, col=None, fill=None, heap=None):
        """A slatted crate: boards as tone, not as lines. `fill`: the colour of what's in it; `heap`: (colour, count) of round things on top."""
        col = col or P.timber_light
        x0, y0, z0 = lo
        x1, y1, z1 = hi
        n = max(2, round((y1 - y0) / 0.22))
        rings = [[(x0, y0 + (y1 - y0) * i / n, z0), (x1, y0 + (y1 - y0) * i / n, z0), (x1, y0 + (y1 - y0) * i / n, z1), (x0, y0 + (y1 - y0) * i / n, z1)] for i in range(n + 1)]
        self.loft(rings, mat='timber', cols=[shade(col, 1.0 if i % 2 else 0.88) for i in range(n)], cap0=True, uv='around')
        self.poly([(x0, y1 - 0.06, z0), (x0, y1 - 0.06, z1), (x1, y1 - 0.06, z1), (x1, y1 - 0.06, z0)], fill or P.dark)
        if heap:
            hc, count = heap
            r = min(x1 - x0, z1 - z0) * 0.16
            g = random.Random(int((x0 + z0 * 7 + y0 * 13) * 100))
            for _ in range(count):
                self.ball((g.uniform(x0 + r, x1 - r), y1 - 0.02 + g.uniform(0, r * 0.6), g.uniform(z0 + r, z1 - r)), r, shade(hc, g.uniform(0.9, 1.08)), sides=8)

    def wheel(self, r, width, rim=None, spoke=None, spokes=8, hub=None, rim_w=0.12, paddles=0, paddle_col=None, mat='timber'):
        """
        A spoked wheel lying flat in the current frame (turning about y), centred on the origin: two rims `width` apart,
        spokes, a hub, and paddles across the rims if asked. Stand it up with `at(..., pitch=90)` or `roll=90`.
        """
        rim = rim or P.timber
        spoke = spoke or rim
        for y in ((-width / 2, width / 2) if width > 0.3 else (0,)):
            w = min(width, 0.14) if width > 0.3 else width
            self.lathe([(r - rim_w, y - w / 2), (r, y - w / 2), (r, y + w / 2), (r - rim_w, y + w / 2), (r - rim_w, y - w / 2)], rim, mat, sides=max(12, spokes * 2))
            for i in range(spokes):
                a = 2 * math.pi * i / spokes
                self.beam((0, y, 0), ((r - rim_w * 0.5) * math.cos(a), y, (r - rim_w * 0.5) * math.sin(a)), (0.09, 0.08), spoke, mat)
        self.tube((0, -width / 2 - 0.08, 0), (0, width / 2 + 0.08, 0), max(0.12, r * 0.12), hub or P.copper, sides=8)
        for i in range(paddles):
            a = 2 * math.pi * (i + 0.5) / paddles
            c, s = math.cos(a), math.sin(a)
            self.hexa([((r - 0.5) * c, -width / 2, (r - 0.5) * s), ((r + 0.12) * c, -width / 2, (r + 0.12) * s),
                       ((r + 0.12) * c - 0.05 * s, -width / 2, (r + 0.12) * s + 0.05 * c), ((r - 0.5) * c - 0.05 * s, -width / 2, (r - 0.5) * s + 0.05 * c),
                       ((r - 0.5) * c, width / 2, (r - 0.5) * s), ((r + 0.12) * c, width / 2, (r + 0.12) * s),
                       ((r + 0.12) * c - 0.05 * s, width / 2, (r + 0.12) * s + 0.05 * c), ((r - 0.5) * c - 0.05 * s, width / 2, (r - 0.5) * s + 0.05 * c)],
                      paddle_col or shade(rim, 0.92), 'timber', (0, 1, 0))

    def boards(self, a, b, h, col=None, n=None, thick=0.06, rng_=None):
        """A wall of upright boards from a to b (points on the ground line, y its foot), `h` high: one flat face each side, the boards as tone."""
        col = col or P.timber
        a, b = Vector(a), Vector(b)
        d = b - a
        length = d.length
        n = n or max(1, round(length / 0.45))
        g = rng_ or random.Random(int(length * 1000))
        side = Vector((-d.z, 0, d.x)).normalized() * thick / 2
        up = Vector((0, h, 0))
        for i in range(n):
            p, q = a + d * (i / n), a + d * ((i + 1) / n)
            self.hexa([p - side, q - side, q + side, p + side, p - side + up, q - side + up, q + side + up, p + side + up],
                      shade(col, g.uniform(0.9, 1.05)), 'timber', (0, 1, 0))

    def shoe(self, x, z, size=0.5, h=0.3, col=None):
        """A stone shoe under a post."""
        self.prism(rrect(size, size, size * 0.2, 2, x, z), 0, h, col or P.stone, top=0.82)

    def deck(self, size=7.5, h=0.2, col=None, d=None):
        """The stone deck a building stands on."""
        self.prism(rrect(size, d or size, 0.7, 3), 0, h, col or P.stone, top=0.985)

    def fire(self, w, h, surround=None, name='running_glow'):
        """An oven's or stove's round-headed mouth in the current frame (facing +z): dark, a stone surround, and the fire's
        glow as its own piece (the game's `running_` look)."""
        self.poly(archway(w, h, 0.06), P.dark)
        self.pipe([(w / 2, 0, 0.06), *archway(w, h, 0.06)[2:], (-w / 2, 0, 0.06)], 0.09, surround or P.stone, sides=5)
        self.part(name)
        self.poly(archway(w * 0.66, h * 0.6, 0.075), P.glow)
        self.part()

    def spool(self, c, r=0.26, h=0.6, col=None):
        """A bobbin of thread standing at c."""
        with self.at(c):
            self.lathe([(r * 1.05, 0), (r * 1.05, 0.05)], P.timber, 'timber', sides=8, cap0=True, cap1=True)
            self.lathe([(r * 0.7, 0.05), (r * 0.95, h * 0.5), (r * 0.7, h - 0.05)], col or P.linen, sides=8)
            self.lathe([(r * 1.05, h - 0.05), (r * 1.05, h)], P.timber, 'timber', sides=8, cap0=True, cap1=True)

    def fence(self, pts, h=1.0, gap=2.2, col=None, rails=(0.42, 0.82)):
        """A low post-and-rail fence through points on the ground."""
        col = col or P.timber
        for k, (a, b) in enumerate(zip(pts, pts[1:])):
            a, b = Vector(a), Vector(b)
            n = max(1, round((b - a).length / gap))
            for i in range(0 if k == 0 else 1, n + 1):
                p = a + (b - a) * (i / n)
                self.box((p.x - 0.07, p.y, p.z - 0.07), (p.x + 0.07, p.y + h, p.z + 0.07), col, 'timber', (0, 1, 0))
            for y in rails:
                self.beam((a.x, a.y + y, a.z), (b.x, b.y + y, b.z), (0.05, 0.09), shade(col, 0.92))

    # --- finishing ---

    def finish(self):
        """Makes the Blender objects: the main mesh, each named part at its own origin, and the named points."""
        objs = []
        for name, part in self.parts.items():
            bm = part['bm']
            if not bm.faces:
                bm.free()
                continue
            # A part's own frame: its origin, and its local x along the axis it turns about.
            frame = Matrix.Translation(self.blender(part['origin']))
            if part['axis'] is not None:
                x = self.blender(part['axis']).normalized()
                y = x.cross(Vector((0, 0, 1)))
                if y.length < 1e-6:
                    y = x.cross(Vector((0, 1, 0)))
                y.normalize()
                z = x.cross(y)
                rot = Matrix((x, y, z)).transposed().to_4x4()
                frame = frame @ rot
            bmesh.ops.transform(bm, matrix=frame.inverted(), verts=bm.verts)
            bm.normal_update()
            for e in bm.edges:
                e.smooth = len(e.link_faces) == 2 and e.calc_face_angle(0.0) < SHARP
            # Normals weighted by each face's size: a wide flat wall stays flat beside the small faces of its rounded corner.
            normals = []
            for f in bm.faces:
                for loop in f.loops:
                    fan, seen, queue = Vector(), {f}, [f]
                    while queue:
                        g = queue.pop()
                        fan += g.normal * g.calc_area()
                        for e in g.edges:
                            if e.smooth and loop.vert in e.verts:
                                for h in e.link_faces:
                                    if h not in seen:
                                        seen.add(h)
                                        queue.append(h)
                    normals.append(fan.normalized() if fan.length > 1e-12 else f.normal.copy())
            mesh = bpy.data.meshes.new(name)
            bm.to_mesh(mesh)
            bm.free()
            mesh.normals_split_custom_set(normals)
            for m in MATERIALS:
                mesh.materials.append(bpy.data.materials.get(m) or bpy.data.materials.new(m))
            obj = bpy.data.objects.new(name, mesh)
            obj.matrix_world = frame
            for k, v in part['props'].items():
                obj[k] = v
            bpy.context.scene.collection.objects.link(obj)
            objs.append(obj)
        for name, pos, scale in self.empties:
            e = bpy.data.objects.new(name, None)
            e.location = self.blender(pos)
            e.scale = (scale[0], scale[2], scale[1])
            bpy.context.scene.collection.objects.link(e)
            objs.append(e)
        return objs


def jitter(rng, col, amount=0.04):
    """A colour a touch lighter or darker, for boards and tiles laid side by side."""
    return shade(col, rng.uniform(1 - amount, 1 + amount))


def rng(seed):
    return random.Random(seed)
