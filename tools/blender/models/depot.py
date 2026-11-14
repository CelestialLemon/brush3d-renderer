# The depot: where the farm's goods leave. A stone platform with a rounded office and a cargo canopy, a ramp for the
# truck, a landing ring on the apron, and a tall mooring mast with a wind-sock for the cargo airship.
from kit import P, rng, rrect, at_y, jitter, shade

TITLE, GROUP, TILES = 'Depot', 'logistics', (3, 3)
ABOUT = 'A stone platform with a rounded office and a cargo canopy, a ramp, a landing ring and a mooring mast for the airship.'
PLAT = 0.85
MX, MZ = -4.7, 4.5


def build(m):
    r = rng(81)
    m.deck(11.6)
    plat = rrect(11.0, 6.0, 0.5, 3, 0, -2.5)
    m.loft([at_y(plat, 0.2), at_y(plat, PLAT - 0.14), at_y(plat, PLAT)], cols=[P.stone_dark, P.terracotta_light], cap1=True, cap_col=P.stone)
    m.hexa([(1.6, 0.2, 0.5), (4.6, 0.2, 0.5), (4.6, 0.2, 3.3), (1.6, 0.2, 3.3), (1.6, PLAT, 0.5), (4.6, PLAT, 0.5), (4.6, 0.215, 3.3), (1.6, 0.215, 3.3)], P.stone)
    for i in range(2):
        m.box((-3.9, 0.2, 0.5 + i * 0.4), (-2.3, PLAT - 0.3 * (i + 1) + 0.02, 0.9 + i * 0.4), P.stone)
    # The office.
    cx, cz = -3.1, -2.8
    m.hut(rrect(4.4, 3.8, 1.0, 4, cx, cz), PLAT, 3.7)
    m.pillow(rrect(5.0, 4.4, 1.25, 4, cx, cz), 3.7, 1.05)
    for p, kind in (((cx - 0.8, 4.85, cz), 'herb'), ((cx + 0.9, 4.85, cz - 0.4), 'flower'), ((cx + 0.2, 4.9, cz + 0.6), 'herb')):
        m.plant(kind, p, 0.55, 0.34)
    with m.at((cx - 0.9, PLAT, cz + 1.9)):
        m.door(1.1, 2.2)
    with m.at((cx + 0.9, PLAT + 1.0, cz + 1.9)):
        m.window(1.0, 1.1)
    with m.at((cx - 2.2, PLAT + 1.6, cz), yaw=-90):
        m.porthole(0.42)
    for x in (cx - 1.0, cx + 1.0):
        with m.at((x, PLAT + 1.6, cz - 1.9), yaw=180):
            m.porthole(0.42)
    # The cargo canopy: a barrel roof on four posts, planted behind, solar in front.
    n = 8
    for x in (0.4, 5.0):
        for z in (-5.0, -0.4):
            m.post(x, z, 4.0, 0.2, y0=PLAT)
        m.box((x - 0.1, 3.85, -5.3), (x + 0.1, 4.05, -0.1), P.timber, 'timber')
    for z in (-5.0, -0.4):
        m.box((0.0, 3.8, z - 0.1), (5.4, 4.0, z + 0.1), P.timber, 'timber')
    m.vault(-0.1, 5.5, 2.75, 4.05, 1.0, lambda k: (P.solar, 'glass') if k >= n // 2 else (P.moss if k else P.moss_deep, 'moss'), n=n, cz=-2.7)
    m.plant('herb', (2.6, 4.95, -4.1), 0.55, 0.34)
    # Cargo waiting under it.
    m.crate((0.9, PLAT, -4.6), (2.1, PLAT + 0.8, -3.5), heap=(P.red, 6))
    m.crate((2.3, PLAT, -4.7), (3.4, PLAT + 0.7, -3.6), fill=P.dark, heap=(P.gold, 5))
    m.crate((1.1, PLAT + 0.8, -4.5), (2.0, PLAT + 1.4, -3.7), fill=P.dark, heap=(P.moss_light, 4))
    for x, z in ((3.9, -4.3), (4.5, -3.8), (3.8, -3.4)):
        m.sack((x, PLAT, z), 0.36, jitter(r, P.linen, 0.04))
    for i in range(3):
        m.jar((1.0 + i * 0.5, PLAT, -1.3), 0.19, 0.5, P.gold, P.copper)
    m.barrel((4.4, PLAT, -1.4), 0.42, 0.95)
    # The landing ring on the apron, and the mast.
    m.lathe([(2.0, 0.212), (1.62, 0.212)], P.terracotta_light, sides=28, centre=(-0.9, 3.3))
    m.lathe([(0.45, 0.212), (0.0, 0.212)], P.terracotta_light, sides=14, centre=(-0.9, 3.3))
    m.lathe([(0.95, 0.2), (0.85, 0.5)], P.stone_dark, sides=12, centre=(MX, MZ), cap1=True)
    m.lathe([(0.42, 0.5), (0.36, 1.4), (0.3, 3.6), (0.3, 3.8), (0.2, 9.3), (0.24, 9.4), (0.24, 9.55)], sides=12, centre=(MX, MZ),
            cols=[P.terracotta, P.ceramic, P.copper, P.ceramic, P.copper, P.copper])
    m.torus((MX, 9.75, MZ), 0.5, 0.06, P.copper, sides=14, around=5)
    for a in ((0.45, 0), (-0.45, 0), (0, 0.45), (0, -0.45)):
        m.tube((MX + a[0], 9.75, MZ + a[1]), (MX, 9.5, MZ), 0.035, P.copper, sides=4)
    m.part('running_beacon')
    m.ball((MX, 10.0, MZ), 0.17, P.glow, sides=8)
    m.part()
    m.tube((MX, 9.55, MZ), (MX, 9.9, MZ), 0.05, P.copper, sides=5)
    m.tube((MX, 7.7, MZ), (MX + 0.7, 7.7, MZ), 0.035, P.copper, sides=4)
    with m.at((MX + 0.7, 7.7, MZ), roll=-90):
        m.lathe([(0.32, 0), (0.28, 0.5), (0.23, 1.0), (0.17, 1.5), (0.12, 1.9)], sides=10, cols=[P.terracotta, P.ceramic, P.terracotta, P.ceramic])
    m.fence([(5.5, 0.2, 0.9), (5.5, 0.2, 5.5), (2.2, 0.2, 5.5)], h=0.9, gap=2.3)
    m.planter((-5.6, 0.2, 0.7), (-4.4, 0.7, 1.3), P.terracotta, 'flower')
