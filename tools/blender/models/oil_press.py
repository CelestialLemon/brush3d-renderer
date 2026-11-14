# The oil press: a big timber screw press in the open, its copper handwheel above everything (its own piece, ready to turn),
# golden oil running to a jar; beside it a small rounded store with jars on a shelf under a solar awning.
from kit import P, rng, rrect, jitter, shade

TITLE, GROUP, TILES = 'Oil press', 'processing', (2, 2)
ABOUT = 'A timber screw press with a copper handwheel, golden oil running to a jar, and a small store with a shelf of oil.'
PX, PZ = 1.6, -0.7


def build(m):
    r = rng(31)
    m.deck()
    # The store.
    cx, cz = -1.85, -1.6
    m.hut(rrect(3.4, 3.6, 0.85, 3, cx, cz), 0.2, 2.8)
    m.pillow(rrect(3.95, 4.15, 1.05, 3, cx, cz), 2.8, 0.9)
    m.plant('herb', (cx - 0.4, 3.75, cz + 0.2), 0.55, 0.34)
    m.plant('flower', (cx + 0.7, 3.7, cz - 0.6), 0.5, 0.34)
    with m.at((cx - 0.6, 0.2, cz + 1.8)):
        m.door(1.05, 2.1)
    with m.at((cx, 1.9, cz - 1.8), yaw=180):
        m.porthole(0.4)
    with m.at((cx - 1.7, 1.9, cz), yaw=-90):
        m.porthole(0.4)
    # The press: a stone bed, a slatted basket, the screw up through the head beam, the wheel on top.
    m.lathe([(1.5, 0.2), (1.5, 0.75), (1.32, 0.92)], P.stone, sides=18, centre=(PX, PZ), cap1=True, cap_col=shade(P.gold, 0.9))
    slat = [jitter(r, P.timber_light, 0.07) for _ in range(16)]
    m.lathe([(0.95, 0.92), (0.95, 1.12), (0.95, 1.26), (0.95, 1.7), (0.95, 1.84), (0.95, 2.05)], sides=16, centre=(PX, PZ), mat='timber',
            cols=lambda i, j: P.copper if i in (1, 3) else slat[j], mats=lambda i, j: 'plain' if i in (1, 3) else 'timber')
    m.lathe([(0.86, 2.05), (0.86, 2.3)], P.timber_dark, 'timber', sides=16, centre=(PX, PZ), cap1=True)
    for s in (-1, 1):
        m.shoe(PX + s * 1.75, PZ, 0.7, 0.36)
        m.box((PX + s * 1.75 - 0.16, 0.3, PZ - 0.18), (PX + s * 1.75 + 0.16, 4.5, PZ + 0.18), P.timber, 'timber', (0, 1, 0))
        m.beam((PX + s * 1.75, 3.3, PZ), (PX + s * 0.9, 4.2, PZ), (0.14, 0.14), P.timber_dark, up=(0, 0, 1))
    m.box((PX - 2.1, 4.2, PZ - 0.22), (PX + 2.1, 4.62, PZ + 0.22), P.timber, 'timber')
    n = 12
    m.lathe([(0.13, 2.3 + (5.25 - 2.3) * i / n) for i in range(n + 1)], sides=8, centre=(PX, PZ), cols=[P.copper if i % 2 else P.brass for i in range(n)])
    m.part('move_spin_wheel', origin=(PX, 5.25, PZ), axis=(0, 1, 0), speed=0.6)
    with m.at((PX, 5.25, PZ)):
        m.wheel(1.3, 0.1, rim=P.copper, spokes=6, hub=P.brass, rim_w=0.11, mat='plain')
        for k in range(6):
            import math
            a = math.pi / 3 * k
            m.ball((1.4 * math.cos(a), 0, 1.4 * math.sin(a)), 0.1, P.brass, sides=6)
    m.part()
    # The oil: a copper spout off the bed, a big jar.
    m.pipe([(PX, 0.66, PZ + 1.45), (PX, 0.66, PZ + 1.95), (PX, 0.45, PZ + 2.1)], 0.07, P.copper, sides=6)
    m.jar((PX, 0.2, PZ + 2.2), 0.42, 0.95, P.gold, P.copper)
    # The shelf of oil under a solar awning on the store's front.
    for x in (-3.3, -0.55):
        m.post(x, 3.1, 2.45, 0.15)
    m.box((-3.5, 2.45, 3.02), (-0.35, 2.6, 3.18), P.timber, 'timber')
    with m.at((-1.92, 2.72, 1.7), pitch=7):
        m.solar(3.1, 3.0)
    for y in (0.85, 1.5):
        m.box((-3.2, y, 0.45), (-1.45, y + 0.07, 0.95), P.timber_light, 'timber')
        for i in range(4):
            m.jar((-3.0 + i * 0.45, y + 0.07, 0.7), 0.16, 0.4, jitter(r, P.gold, 0.06), P.copper)
    for x in (-3.2, -1.45):
        m.box((x - 0.05, 0.2, 0.45), (x + 0.05, 1.57, 0.95), P.timber, 'timber')
    m.crate((-2.9, 0.2, 1.75), (-1.9, 0.8, 2.7), fill=P.dark, heap=(P.straw, 5))
    m.planter((3.1, 0.2, 1.6), (3.65, 0.7, 3.5), P.timber, 'flower', tall=0.7)
