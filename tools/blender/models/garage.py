# The garage: an open-fronted timber shelter on stone shoes for the truck, under a barrel roof that is planted behind
# and solar glass in front, with a copper charging post at the door.
from kit import P, rng, lin

TITLE, GROUP, TILES = 'Garage', 'logistics', (2, 2)
ABOUT = 'An open-fronted timber shelter for the truck: boarded walls, a barrel roof half planted and half solar, a charging post.'
W, BACK, FRONT, EAVE = 3.2, -3.3, 3.0, 3.3


def build(m):
    r = rng(71)
    m.deck()
    for x in (-W, W):
        for z in (BACK, FRONT):
            m.post(x, z, EAVE, 0.2, y0=0.2)
    m.post(0, BACK, EAVE, 0.2, y0=0.2)
    m.boards((-W, 0.2, BACK), (W, 0.2, BACK), 3.0, P.timber_light, rng_=r)
    for x in (-W, W):
        m.boards((x, 0.2, BACK), (x, 0.2, FRONT), 2.25, P.timber_light, rng_=r)
        m.box((x - 0.1, EAVE - 0.1, BACK - 0.3), (x + 0.1, EAVE + 0.1, FRONT + 0.3), P.timber, 'timber')
    for z in (BACK, FRONT):
        m.box((-W - 0.3, EAVE - 0.14, z - 0.1), (W + 0.3, EAVE + 0.1, z + 0.1), P.timber, 'timber')
    n = 8
    m.vault(-3.78, 3.78, 3.7, EAVE + 0.1, 1.3, lambda k: (P.solar, 'glass') if k >= n // 2 else (P.moss if k else P.moss_deep, 'moss'), n=n, cz=-0.15)
    for x in (-W, W):
        m.lunette(x, 3.7, EAVE + 0.1, 1.3, P.timber_light, 'timber', cz=-0.15, inset=0.17)
    m.plant('herb', (-1.6, 4.6, -1.7), 0.6, 0.36)
    m.plant('flower', (1.4, 4.55, -2.0), 0.55, 0.36)
    # Inside: a bench along the back wall, tools as shapes of tone on the boards.
    m.box((-2.9, 1.0, BACK + 0.1), (-0.4, 1.1, BACK + 0.8), P.timber, 'timber')
    for x in (-2.8, -0.5):
        m.box((x - 0.06, 0.2, BACK + 0.15), (x + 0.06, 1.0, BACK + 0.75), P.timber_dark, 'timber')
    m.crate((-2.6, 1.1, BACK + 0.2), (-1.9, 1.5, BACK + 0.7), fill=P.dark)
    # The charging post: ceramic, a copper cap, a lamp that the game lights, its cable to the ground.
    cx, cz = 3.5, 3.55
    m.lathe([(0.2, 0.2), (0.17, 0.5), (0.15, 1.35), (0.2, 1.42), (0.0, 1.62)], sides=10, centre=(cx, cz), cols=[P.terracotta, P.ceramic, P.copper, P.copper])
    m.part('running_lamp')
    m.ball((cx, 1.12, cz + 0.15), 0.07, lin(0x7fe3c2), sides=6)
    m.part()
    m.pipe([(cx - 0.14, 0.95, cz), (cx - 0.5, 0.8, cz), (cx - 0.62, 0.3, cz - 0.1)], 0.035, P.tyre, sides=5)
    m.planter((-3.76, 0.2, -2.6), (-3.36, 0.62, 1.8), P.terracotta, 'herb', plants=4)
    m.plant('vine', (3.45, 0.2, -3.35), 0.4, 2.8)
