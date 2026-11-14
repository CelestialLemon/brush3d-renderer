# The farmhouse: the home on the farm. A two-storey rounded house under a planted roof with a solar sheet and a copper
# flue, a low sunroom under a barrel roof of solar glass, a vine pergola with a bench, a rain tank filled off the roof.
from kit import P, rng, rrect, at_y, jitter, shade

TITLE, GROUP, TILES = 'Farmhouse', 'home', (3, 3)
ABOUT = 'A rounded two-storey house under a planted roof, a sunroom under solar glass, a vine pergola, a rain tank off the roof.'
BUDGET = 7000


def build(m):
    m.deck(11.6)
    cx, cz = -1.7, -1.9
    main = rrect(7.2, 6.0, 1.6, 4, cx, cz)
    m.loft([at_y(main, y) for y in (0.2, 0.9, 2.95, 3.15, 5.7)], cols=[P.terracotta, P.plaster, P.timber_light, P.plaster],
           mats=['plain', 'plain', 'timber', 'plain'])
    m.pillow(rrect(8.0, 6.8, 1.9, 4, cx, cz), 5.7, 1.5, flat=0.32, rim_h=0.2)
    for p, kind in (((cx - 2.4, 7.2, cz + 0.5), 'herb'), ((cx - 1.0, 7.35, cz - 1.0), 'flower'), ((cx + 2.5, 7.15, cz + 0.4), 'herb'),
                    ((cx + 0.2, 7.3, cz + 1.4), 'flower'), ((cx - 2.6, 6.9, cz - 1.5), 'shrub')):
        m.plant(kind, p, 0.65, 0.4)
    for x in (cx + 0.2, cx + 2.0):
        m.tube((x, 7.3, cz - 0.6), (x, 7.8, cz - 0.6), 0.04, P.copper, sides=5)
    with m.at((cx + 1.1, 7.68, cz - 0.1), pitch=14):
        m.solar(2.8, 1.7)
    fx, fz = cx - 2.4, cz - 1.5
    m.tube((fx, 6.3, fz), (fx, 8.5, fz), 0.16, P.copper, sides=8)
    m.lathe([(0.16, 8.5), (0.32, 8.62), (0.0, 8.95)], P.copper, sides=8, centre=(fx, fz))
    m.empty('smoke_emitter', (fx, 9.0, fz))
    front = cz + 3.0
    with m.at((cx + 1.5, 0.2, front)):
        m.door(1.2, 2.3)
    with m.at((cx - 1.4, 1.15, front)):
        m.window(1.1, 1.25)
    for x in (cx - 1.4, cx + 1.5):
        with m.at((x, 3.85, front)):
            m.window(0.95, 1.3, arch=True)
        m.planter((x - 0.65, 3.5, front), (x + 0.65, 3.74, front + 0.34), P.timber, 'flower', plants=2, tall=0.3)
    for y in (1.9, 4.5):
        with m.at((cx - 3.6, y, cz), yaw=-90):
            m.porthole(0.45)
    for x in (cx - 1.5, cx + 1.5):
        with m.at((x, 4.5, cz - 3.0), yaw=180):
            m.porthole(0.45)
    with m.at((cx - 0.8, 1.2, cz - 3.0), yaw=180):
        m.window(1.1, 1.2)
    # The sunroom.
    sx, sz = 3.55, -2.5
    m.hut(rrect(3.9, 4.6, 0.9, 3, sx, sz), 0.2, 3.0, skirt_h=0.7)
    n = 8
    m.vault(1.75, 5.7, 2.6, 3.0, 1.0, lambda k: (P.solar, 'glass') if k >= n // 2 else (P.moss if k else P.moss_deep, 'moss'), n=n, cz=sz)
    m.lunette(5.45, 2.6, 3.0, 1.0, P.plaster, n=n, cz=sz, inset=0.17)
    with m.at((sx, 1.75, sz + 2.3)):
        m.porthole(0.8, sides=18)
    with m.at((sx + 1.95, 1.2, sz), yaw=90):
        m.window(1.2, 1.3)
    with m.at((sx, 1.9, sz - 2.3), yaw=180):
        m.porthole(0.45)
    # The pergola along the front, vines up its posts, a bench under it.
    px = (cx - 3.2, cx - 0.4)
    for x in px:
        m.post(x, 3.6, 2.75, 0.16, y0=0.2)
        m.beam((x, 2.85, front), (x, 2.75, 3.75), (0.11, 0.14), P.timber)
        m.plant('vine', (x, 0.2, 3.6), 0.32, 2.5)
    m.box((px[0] - 0.3, 2.68, 3.52), (px[1] + 0.3, 2.82, 3.68), P.timber, 'timber')
    for i in range(3):
        x = px[0] + 0.7 + i * 0.7
        m.beam((x, 2.9, front), (x, 2.84, 3.75), (0.08, 0.1), P.timber_light)
    m.box((cx - 2.9, 0.62, front + 0.12), (cx - 0.9, 0.7, front + 0.62), P.timber, 'timber')
    for x in (cx - 2.8, cx - 1.0):
        m.box((x - 0.05, 0.2, front + 0.15), (x + 0.05, 0.62, front + 0.6), P.timber_dark, 'timber')
    # The rain tank, filled off the sunroom's roof.
    tx, tz = 4.4, 1.2
    m.lathe([(0.95, 0.2), (0.95, 0.5), (0.95, 0.62), (0.95, 1.7), (0.95, 1.82), (0.95, 2.2), (0.7, 2.42), (0.0, 2.5)], sides=16, centre=(tx, tz),
            cols=[P.terracotta, P.copper, P.ceramic, P.copper, P.ceramic, P.ceramic, P.copper])
    m.pipe([(tx, 3.05, 0.0), (tx, 2.9, tz), (tx, 2.5, tz)], 0.06, P.copper, sides=6)
    m.tube((tx, 0.6, tz + 0.95), (tx, 0.6, tz + 1.15), 0.04, P.brass, sides=5)
    # Planters by the door and along the front.
    m.planter((cx + 2.5, 0.2, front + 0.1), (cx + 3.2, 0.7, front + 1.6), P.terracotta, 'herb')
    m.planter((-5.5, 0.2, 4.6), (-2.9, 0.65, 5.3), P.timber, 'flower')
    m.planter((1.6, 0.2, 4.6), (4.2, 0.65, 5.3), P.timber, 'herb')
    for i, z in enumerate((2.3, 3.5, 4.7)):
        m.lathe([(0.5, 0.215), (0.0, 0.215)], shade(P.stone, 0.9), sides=9, centre=(cx + 1.5 + 0.12 * (i % 2), z))
