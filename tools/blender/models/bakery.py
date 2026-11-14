# The bakery: a tiled clay oven with a tall chimney, bulging out of a small lime-white bakehouse under a planted roof, and a
# bread counter under a solar awning.
import math
from kit import P, jitter, rng, rrect, shade, lin

TITLE, GROUP, TILES = 'Bakery', 'processing', (2, 2)
ABOUT = 'A domed clay oven with its chimney, a lime-white bakehouse under a planted roof, bread on the counter.'

BREAD = lin(0xd79a52)


def build(m):
    r = rng(11)
    m.prism(rrect(7.5, 7.5, 0.7, 3), 0, 0.2, P.stone, top=0.985)
    # The bakehouse: rounded walls on a terracotta skirt, under a planted pillow of a roof.
    body = rrect(6.3, 4.0, 1.0, 4, cz=-1.55)
    m.loft([[(x, y, z) for x, z in body] for y in (0.2, 0.75, 3.2)], cols=[P.terracotta, P.plaster])
    eave = rrect(7.0, 4.5, 1.25, 4, cz=-1.55)
    m.prism(eave, 3.2, 3.36, P.timber, 'timber', caps=(True, False))
    m.dome(eave, 3.36, 1.15, P.moss, 'moss', steps=4, flat=0.3, cols=[P.moss_deep, P.moss, P.moss, P.moss_light])
    for p in ((-0.3, 4.5, -1.3), (1.9, 4.45, -2.2), (2.3, 4.4, -0.6), (0.6, 4.5, -2.6)):
        m.plant('herb' if p[0] < 1 else 'flower', p, 0.6, 0.38)
    # The chimney, through the roof at the oven's end.
    cx, cz = -1.9, -1.9
    m.lathe([(0.56, 3.4), (0.46, 6.9)], P.plaster, sides=14, centre=(cx, cz))
    m.lathe([(0.52, 6.9), (0.52, 7.2)], P.terracotta, sides=14, centre=(cx, cz), cap1=True, cap_col=P.dark)
    m.lathe([(0.3, 7.2), (0.3, 7.42), (0.6, 7.5), (0.0, 7.85)], P.copper, sides=10, centre=(cx, cz))
    m.empty('smoke_emitter', (cx, 7.9, cz))
    # The oven: a tiled dome coming out of the front wall, its mouth to the front.
    ox, oz = -1.55, 0.75
    tiles = [[jitter(r, P.terracotta, 0.07) for j in range(16)] for i in range(4)]
    m.lathe([(1.55, 0.2), (1.55, 1.0), (1.36, 1.7), (0.85, 2.2), (0.0, 2.42)], sides=16, centre=(ox, oz),
            cols=lambda i, j: tiles[i][j], phase=math.pi / 16)
    with m.at((ox, 0.78, oz + 1.5)):
        arch = lambda w, h, z: [(-w / 2, 0, z), (w / 2, 0, z)] + [(w / 2 * math.cos(math.pi * i / 8), h - w / 2 + w / 2 * math.sin(math.pi * i / 8), z) for i in range(9)]
        m.poly(arch(1.2, 1.05, 0.06), P.dark)
        m.pipe([(0.6, 0, 0.06), *arch(1.2, 1.05, 0.06)[2:], (-0.6, 0, 0.06)], 0.09, P.stone, sides=5)
        # The fire's glow, the game's `running_` look.
        m.part('running_glow')
        m.poly(arch(0.8, 0.62, 0.075), P.glow)
        m.part()
    m.box((ox - 0.85, 0.2, oz + 1.3), (ox + 0.85, 0.74, oz + 1.95), P.stone)
    # The counter, under a solar awning on two posts.
    for x in (0.55, 3.35):
        m.shoe(x, 3.3, 0.5, 0.26)
        m.box((x - 0.085, 0.26, 3.215), (x + 0.085, 2.5, 3.385), P.timber, 'timber')
    m.box((0.3, 2.5, 3.2), (3.6, 2.68, 3.4), P.timber, 'timber')
    for x in (0.55, 3.35):
        m.beam((x, 3.0, 0.5), (x, 2.6, 3.3), (0.12, 0.14), P.timber)
    with m.at((1.95, 2.92, 2.0), pitch=8.5):
        m.solar(3.5, 3.1)
    with m.at((2.35, 0.2, 0.45)):
        m.door(1.15, 2.25)
    with m.at((0.75, 1.3, 0.45)):
        m.window(0.85, 1.1)
    m.box((0.75, 0.9, 2.3), (3.15, 1.0, 3.0), P.timber_light, 'timber')
    for x in (0.9, 3.0):
        m.box((x - 0.07, 0.2, 2.4), (x + 0.07, 0.9, 2.9), P.timber, 'timber')
    for i, x in enumerate((1.15, 1.75, 2.35)):
        m.ball((x, 1.13, 2.62 + 0.08 * (i % 2)), 0.24, jitter(r, BREAD, 0.06), sides=8, squash=0.62)
    m.box((2.6, 1.0, 2.4), (3.05, 1.2, 2.9), P.timber_dark, 'timber')
    m.ball((2.82, 1.24, 2.65), 0.19, jitter(r, BREAD, 0.06), sides=8, squash=0.6)
    # Portholes at the back, herbs along the side, a climber up one corner.
    for x in (-1.5, 1.5):
        with m.at((x, 2.0, -3.55), yaw=180):
            m.porthole(0.42)
    m.planter((3.2, 0.2, -2.9), (3.72, 0.7, -0.4), P.timber, 'herb')
    m.plant('vine', (-3.2, 0.2, -1.5), 0.45, 3.0)
