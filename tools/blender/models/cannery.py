# The cannery: a big copper kettle on a tiled stove, steam off its pipe, jars of red preserve on a rack under a solar
# awning, and a rounded store behind.
import math
from kit import P, rng, rrect, jitter, shade

TITLE, GROUP, TILES = 'Cannery', 'processing', (2, 2)
ABOUT = 'A big copper kettle on a tiled stove, steam off its pipe, red jars on a rack under a solar awning.'
KX, KZ = -1.95, 0.75


def build(m):
    r = rng(61)
    m.deck()
    cx, cz = 1.55, -1.7
    m.hut(rrect(4.0, 3.5, 0.9, 3, cx, cz), 0.2, 2.9)
    m.pillow(rrect(4.6, 4.1, 1.1, 3, cx, cz), 2.9, 0.95)
    for p, kind in (((cx - 0.9, 3.9, cz), 'herb'), ((cx + 0.8, 3.9, cz - 0.5), 'flower')):
        m.plant(kind, p, 0.55, 0.34)
    with m.at((cx + 0.9, 0.2, cz + 1.75)):
        m.door(1.05, 2.15)
    with m.at((cx, 1.95, cz - 1.75), yaw=180):
        m.porthole(0.4)
    with m.at((cx + 2.0, 1.4, cz), yaw=90):
        m.window(0.9, 1.0)
    # The stove and the kettle.
    tiles = [[jitter(r, P.terracotta, 0.07) for _ in range(16)] for _ in range(2)]
    m.lathe([(1.5, 0.2), (1.5, 0.7), (1.5, 1.15)], sides=16, centre=(KX, KZ), cols=lambda i, j: tiles[i][j], phase=math.pi / 16, cap1=True, cap_col=P.stone)
    with m.at((KX, 0.25, KZ + 1.46)):
        m.fire(0.9, 0.75)
    m.lathe([(0.95, 1.15), (1.36, 1.6), (1.42, 2.1), (1.42, 2.3), (1.2, 2.95), (1.0, 3.1)], sides=16, centre=(KX, KZ),
            cols=[P.copper, P.copper, P.verdigris, P.copper, P.copper])
    m.lathe([(1.05, 3.1), (0.9, 3.4), (0.3, 3.62), (0.14, 3.62)], P.copper, sides=16, centre=(KX, KZ))
    m.ball((KX + 0.6, 3.6, KZ + 0.3), 0.12, P.brass, sides=6)
    m.tube((KX, 3.6, KZ), (KX, 5.2, KZ), 0.13, P.copper, sides=8)
    m.lathe([(0.13, 5.2), (0.26, 5.34), (0.26, 5.6)], P.copper, sides=8, centre=(KX, KZ))
    m.empty('smoke_emitter', (KX, 5.75, KZ))
    # A tap off the kettle to the filling bench.
    m.pipe([(KX + 1.38, 2.0, KZ), (KX + 2.0, 2.0, KZ), (KX + 2.0, 1.45, KZ)], 0.06, P.copper, sides=6)
    m.box((KX + 1.6, 0.9, KZ - 0.45), (KX + 2.5, 1.0, KZ + 0.45), P.timber_light, 'timber')
    for dx, dz in ((1.68, -0.37), (2.42, -0.37), (1.68, 0.37), (2.42, 0.37)):
        m.box((KX + dx - 0.05, 0.2, KZ + dz - 0.05), (KX + dx + 0.05, 0.9, KZ + dz + 0.05), P.timber, 'timber')
    m.jar((KX + 2.0, 1.0, KZ), 0.17, 0.4)
    # The rack of jars, under a solar awning on the store's front.
    for x in (1.0, 3.45):
        m.post(x, 3.2, 2.5, 0.15)
        m.beam((x, 2.86, 0.2), (x, 2.56, 3.2), (0.1, 0.12), P.timber)
    m.box((0.8, 2.5, 3.12), (3.65, 2.64, 3.28), P.timber, 'timber')
    with m.at((2.22, 2.84, 1.7), pitch=6):
        m.solar(2.9, 3.0)
    for y in (0.75, 1.3, 1.85):
        m.box((1.2, y, 2.2), (3.3, y + 0.07, 2.7), P.timber_light, 'timber')
        for i in range(5):
            m.jar((1.45 + i * 0.4, y + 0.07, 2.45), 0.15, 0.36, jitter(r, P.red, 0.07))
    for x in (1.2, 3.3):
        m.box((x - 0.05, 0.2, 2.2), (x + 0.05, 1.92, 2.7), P.timber, 'timber')
    m.crate((-3.4, 0.2, -3.2), (-2.3, 0.8, -2.1), fill=P.dark, heap=(P.red, 6))
    m.crate((-2.1, 0.2, -3.3), (-1.2, 0.7, -2.4), fill=P.dark, heap=(P.moss_light, 5))
