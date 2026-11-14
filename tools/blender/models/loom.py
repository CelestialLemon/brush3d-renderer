# The loom: a big timber loom in the open, linen growing down it in soft stripes, bolts of cloth on a rack, and the
# weaver's rounded store behind.
from kit import P, rng, rrect, jitter, shade

TITLE, GROUP, TILES = 'Loom', 'processing', (2, 2)
ABOUT = 'A big timber loom in the open, striped linen growing down it, bolts of cloth on a rack, a rounded store behind.'


def build(m):
    r = rng(51)
    m.deck()
    cx, cz = 0.0, -2.1
    m.hut(rrect(6.4, 2.7, 0.9, 3, cx, cz), 0.2, 2.6)
    m.pillow(rrect(7.0, 3.25, 1.1, 3, cx, cz), 2.6, 0.85)
    for p, kind in (((-1.9, 3.5, -2.0), 'herb'), ((0.4, 3.55, -2.3), 'flower'), ((2.2, 3.5, -1.9), 'herb')):
        m.plant(kind, p, 0.5, 0.32)
    with m.at((2.3, 0.2, cz + 1.35)):
        m.door(1.0, 2.0)
    with m.at((-2.3, 1.3, cz + 1.35)):
        m.window(0.8, 0.9)
    for x in (-1.6, 1.6):
        with m.at((x, 1.75, cz - 1.35), yaw=180):
            m.porthole(0.36)
    # The loom: two side frames, the warp running down from the top beam to the cloth beam at the front.
    lz = 0.05
    for s in (-1, 1):
        x = s * 1.95
        m.shoe(x, lz, 0.55, 0.3)
        m.shoe(x, lz + 2.7, 0.55, 0.3)
        m.box((x - 0.11, 0.25, lz - 0.11), (x + 0.11, 4.3, lz + 0.11), P.timber, 'timber', (0, 1, 0))
        m.box((x - 0.11, 0.25, lz + 2.59), (x + 0.11, 1.45, lz + 2.81), P.timber, 'timber', (0, 1, 0))
        m.beam((x, 1.1, lz), (x, 1.1, lz + 2.7), (0.12, 0.16), P.timber_dark)
        m.beam((x, 3.2, lz), (x, 1.4, lz + 2.6), (0.1, 0.12), P.timber_dark)
    m.box((-2.3, 4.1, lz - 0.14), (2.3, 4.38, lz + 0.14), P.timber, 'timber')
    m.tube((-2.15, 1.3, lz + 2.7), (2.15, 1.3, lz + 2.7), 0.2, P.linen, sides=10, cap_col=P.timber)
    top, foot = (4.1, lz + 0.16), (1.47, lz + 2.62)
    bands = [(0.0, 0.52, P.linen), (0.52, 0.6, P.teal), (0.6, 0.7, P.linen), (0.7, 0.78, P.terracotta_light), (0.78, 0.9, P.linen), (0.9, 1.0, P.gold)]
    at = lambda t: (top[0] + (foot[0] - top[0]) * t, top[1] + (foot[1] - top[1]) * t)
    for t0, t1, col in bands:
        (y0, z0), (y1, z1) = at(t0), at(t1)
        m.poly([(-1.6, y0, z0), (1.6, y0, z0), (1.6, y1, z1), (-1.6, y1, z1)], shade(col, 1.04) if t0 == 0 else col)
    # The heddles: a bar across the warp.
    (hy, hz) = at(0.42)
    m.box((-1.95, hy + 0.1, hz + 0.1), (1.95, hy + 0.24, hz + 0.24), P.timber_light, 'timber')
    # Bolts of cloth on a rack, a basket of thread.
    for i, (col, y) in enumerate(((P.teal, 0.62), (P.linen, 0.62), (P.terracotta_light, 1.02))):
        z = (3.0, 3.42, 3.2)[i]
        m.tube((2.55, y, z), (3.5, y, z), 0.2, col, sides=8)
    m.box((2.5, 0.2, 2.75), (3.55, 0.42, 3.65), P.timber, 'timber')
    m.crate((-3.5, 0.2, 2.6), (-2.6, 0.72, 3.5), fill=P.linen, heap=(P.teal, 4))
    m.plant('vine', (-3.35, 0.2, -1.0), 0.4, 2.4)
