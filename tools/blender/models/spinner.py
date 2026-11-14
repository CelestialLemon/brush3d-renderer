# The spinner: a great spinning wheel taller than a person, in the open (its own piece, ready to turn), bobbins of dyed
# thread on a rack under a solar awning, and a little round wool store behind.
from kit import P, rng, rrect, jitter, shade

TITLE, GROUP, TILES = 'Spinner', 'processing', (2, 2)
ABOUT = 'A great spinning wheel in the open, bobbins of dyed thread under a solar awning, a round wool store behind.'
WX, WZ, WY = 1.35, 1.0, 2.45


def build(m):
    r = rng(41)
    m.deck()
    # The round store, under a planted cap.
    cx, cz = -1.55, -1.6
    m.lathe([(1.9, 0.2), (1.9, 0.75), (1.9, 2.7)], sides=20, centre=(cx, cz), cols=[P.terracotta, P.plaster])
    m.lathe([(1.9, 2.7), (2.2, 2.76), (2.2, 2.9)], P.timber, 'timber', sides=20, centre=(cx, cz))
    m.lathe([(2.2, 2.9), (1.95, 3.5), (1.25, 3.95), (0.4, 4.15)], sides=20, centre=(cx, cz), mat='moss',
            cols=[P.moss_deep, P.moss, P.moss_light])
    m.lathe([(0.4, 4.15), (0.4, 4.3), (0.0, 4.6)], P.copper, sides=10, centre=(cx, cz))
    m.plant('herb', (cx + 0.9, 3.7, cz + 0.5), 0.5, 0.32)
    m.plant('flower', (cx - 0.8, 3.75, cz - 0.3), 0.45, 0.32)
    with m.at((cx, 0.2, cz + 1.86)):
        m.door(1.0, 2.05)
    for yaw in (90, 180, 270):
        with m.at((cx, 1.85, cz), yaw=yaw):
            with m.at((0, 0, 1.88)):
                m.porthole(0.36)
    # The great wheel, turned so it reads from every side.
    with m.at((WX, 0.2, WZ), yaw=45):
        for s in (-1, 1):
            for e in (-1, 1):
                m.beam((s * 0.5, 0.06, e * 0.95), (s * 0.5, WY - 0.2, 0), (0.14, 0.14), P.timber)
            m.box((s * 0.5 - 0.09, 0, -1.2), (s * 0.5 + 0.09, 0.14, 1.2), P.timber_dark, 'timber')
        # The spindle head out in front of the wheel, a bobbin filling on it.
        m.box((-0.12, 0, 2.3), (0.12, 1.35, 2.54), P.timber, 'timber', (0, 1, 0))
        m.box((-0.09, 0, 1.2), (0.09, 0.14, 2.54), P.timber_dark, 'timber')
        with m.at((0, 1.42, 2.42), roll=90):
            m.spool((0, -0.3, 0), 0.2, 0.6, P.linen)
    m.part('move_spin_wheel', origin=(WX, WY, WZ), axis=(0.7071, 0, -0.7071), speed=1.5)
    with m.at((WX, WY, WZ), yaw=45, roll=90):
        m.wheel(2.0, 0.14, rim=P.timber_light, spoke=P.timber, spokes=10, hub=P.copper, rim_w=0.16)
    m.part()
    # Bobbins on a rack under a solar awning.
    for x in (-3.3, -0.9):
        m.post(x, 2.0, 2.7, 0.15)
        m.beam((x, 2.62, 2.0), (x, 2.38, 3.45), (0.1, 0.12), P.timber)
    with m.at((-2.1, 2.62, 2.72), pitch=9.5):
        m.solar(3.0, 1.75)
    m.box((-3.2, 0.95, 2.45), (-1.0, 1.03, 3.0), P.timber_light, 'timber')
    for x in (-3.15, -1.05):
        m.box((x - 0.05, 0.2, 2.5), (x + 0.05, 0.95, 2.95), P.timber, 'timber')
    for i, col in enumerate((P.linen, P.teal, P.terracotta_light, P.gold)):
        m.spool((-2.88 + i * 0.52, 1.03, 2.72), 0.2, 0.55, col)
    # A basket of wool, and lavender for the dye.
    m.crate((2.4, 0.2, -2.9), (3.4, 0.75, -1.9), fill=P.linen, heap=(P.ceramic, 5))
    m.planter((0.9, 0.2, -3.55), (2.1, 0.65, -3.05), P.terracotta, 'flower', tall=0.45)
