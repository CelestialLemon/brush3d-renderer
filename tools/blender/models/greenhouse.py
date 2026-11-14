# The greenhouse: a long barrel of sea-glass panes on a low timber wall and a stone kerb, timber ribs, a copper ridge with
# two vent hoods, a glazed door in the front gable, vines up two corners. No floor and no crops: the game grows those.
from kit import P, arc, rng, shade

TITLE, GROUP, TILES = 'Greenhouse', 'farming', (3, 3)
ABOUT = 'A long barrel of sea-glass panes on a low timber wall, timber ribs, a copper ridge with two vent hoods, a glazed door.'
LEN, HALF, KNEE, RISE = 5.4, 4.3, 1.05, 3.6


def build(m):
    r = rng(91)
    # The kerb and the low wall (drawn along x here, then the whole turned so its glazed gable is the front, +z).
    with m.at(yaw=90):
        for z in (-HALF, HALF):
            m.box((-LEN - 0.2, 0, z - 0.25), (LEN + 0.2, 0.3, z + 0.25), P.stone)
            m.boards((-LEN, 0.3, z), (LEN, 0.3, z), KNEE - 0.3, P.timber, thick=0.14, rng_=r)
        for x in (-LEN, LEN):
            m.box((x - 0.25, 0, -HALF + 0.25), (x + 0.25, 0.3, HALF - 0.25), P.stone)
            m.boards((x, 0.3, -HALF), (x, 0.3, HALF), KNEE - 0.3, P.timber, thick=0.14, rng_=r)
        n = 12
        prof = [(z, KNEE + y) for z, y in arc(HALF, RISE, n)]
        ribs = [-LEN + i * (2 * LEN - 0.2) / 5 for i in range(6)]
        for i, x in enumerate(ribs):
            m.extrude(prof, x, x + 0.2, P.timber, 'timber', caps=False, closed=False)
            if i < 5:
                m.extrude(prof, x + 0.2, ribs[i + 1], P.seaglass, 'glass', caps=False, closed=False)
        for x in (-LEN + 0.1, LEN - 0.1):
            m.lunette(x, HALF, KNEE, RISE, P.seaglass, 'glass', n=n, inset=0.02)
        top = KNEE + RISE
        m.tube((-LEN - 0.1, top + 0.03, 0), (LEN + 0.1, top + 0.03, 0), 0.1, P.copper, sides=8)
        for x in (-2.6, 2.6):
            m.box((x - 0.8, top - 0.25, -0.75), (x + 0.8, top + 0.3, 0.75), P.seaglass, 'glass')
            m.extrude([(z, top + 0.3 + y) for z, y in arc(0.95, 0.32, 5)], x - 0.95, x + 0.95, P.copper, caps=True)
    # The door in the front gable, on a timber frame.
    with m.at((0, 0.3, LEN - 0.08)):
        m.box((-0.95, -0.3, 0), (0.95, 2.75, 0.07), P.timber, 'timber', (0, 1, 0))
        with m.at((0, 0.95, 0.07)):
            m.window(1.2, 1.45, arch=True, proud=0.05)
        m.ball((0.68, 0.75, 0.13), 0.07, P.brass, sides=6)
    m.box((-1.0, 0, LEN + 0.12), (1.0, 0.14, LEN + 0.56), P.stone)
    m.plant('vine', (HALF + 0.1, 0.3, LEN - 0.3), 0.45, 2.6)
    m.plant('vine', (-HALF - 0.1, 0.3, -LEN + 0.3), 0.45, 2.6)
    # Down the sides: a rain barrel under a copper downpipe, and planters.
    m.barrel((HALF + 0.85, 0, -3.6), 0.48, 1.1)
    m.pipe([(HALF + 0.12, KNEE + 0.25, -3.6), (HALF + 0.85, KNEE + 0.45, -3.6), (HALF + 0.85, 1.15, -3.6)], 0.05, P.copper, sides=5)
    m.planter((HALF + 0.5, 0, -1.6), (HALF + 1.2, 0.5, 2.2), P.terracotta, 'herb', plants=4)
    m.planter((-HALF - 1.2, 0, -2.4), (-HALF - 0.5, 0.5, 1.4), P.terracotta, 'flower', plants=4)
