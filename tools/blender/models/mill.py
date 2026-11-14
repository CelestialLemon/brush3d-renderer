# The mill: a grain hopper up a slim timber tower under a planted cap, the millstones in the open at its foot, flour
# running to a sack. Not a windmill: it runs off the farm's own power.
from kit import P, rng, rrect, at_y, jitter, shade

TITLE, GROUP, TILES = 'Mill', 'processing', (2, 2)
ABOUT = 'A hopper up a slim timber tower, millstones turning in the open at its foot, flour running into a sack.'
CX, CZ = 0.0, -0.7


def build(m):
    r = rng(21)
    m.deck()
    # The tower: four posts leaning in, on stone shoes.
    for sx in (-1, 1):
        for sz in (-1, 1):
            m.shoe(CX + sx * 1.8, CZ + sz * 1.8, 0.6, 0.5)
            m.beam((CX + sx * 1.8, 0.4, CZ + sz * 1.8), (CX + sx * 1.3, 4.5, CZ + sz * 1.3), (0.2, 0.2), P.timber)
    for sx, sz in ((1, 0), (-1, 0), (0, -1)):
        a = (CX + (sx - sz) * 1.52 if sx else CX - 1.52, 2.7, CZ + sz * 1.52 if sz else CZ - 1.52)
        b = (CX + sx * 1.52 if sx else CX + 1.52, 2.7, CZ + sz * 1.52 if sz else CZ + 1.52)
        m.beam(a, b, (0.12, 0.16), P.timber_dark)
    # The hopper house: boards as tone, a round window, a planted cap.
    box = rrect(3.0, 3.0, 0.3, 2, CX, CZ)
    cols = [jitter(r, P.timber_light, 0.06) for _ in range(len(box))]
    m.loft([at_y(box, 4.4), at_y(box, 6.3)], mat='timber', cols=lambda i, j: cols[j], cap0=True, cap_col=P.timber_dark)
    m.pillow(rrect(3.7, 3.7, 0.6, 3, CX, CZ), 6.3, 0.85, flat=0.35)
    m.lathe([(0.2, 7.2), (0.22, 7.4), (0.0, 7.75)], P.copper, sides=8, centre=(CX, CZ))
    m.plant('herb', (CX + 0.5, 7.2, CZ + 0.4), 0.5, 0.3)
    with m.at((CX, 5.4, CZ + 1.5)):
        m.porthole(0.4)
    m.prism(rrect(0.6, 0.6, 0.08, 2, CX, CZ), 3.2, 4.4, P.timber, 'timber', top=3.6, caps=(True, False))
    m.tube((CX, 1.7, CZ), (CX, 3.2, CZ), 0.16, P.copper, sides=8)
    # The stones: the bed stone still, the runner its own piece, ready to turn.
    m.lathe([(1.4, 0.2), (1.4, 0.95)], P.stone, sides=18, centre=(CX, CZ), cap1=True)
    m.part('move_spin_stone', origin=(CX, 1.0, CZ), axis=(0, 1, 0), speed=1.0)
    m.lathe([(1.22, 1.0), (1.22, 1.2), (1.22, 1.32), (1.22, 1.5), (0.3, 1.66), (0.3, 1.72)], sides=18, centre=(CX, CZ),
            cols=[P.stone_dark, P.copper, P.stone_dark, P.stone_dark, P.copper])
    m.part()
    # The spout to the front, a sack under it, the flour running: the game's `running_` look.
    m.beam((CX, 0.92, CZ + 1.3), (CX, 0.62, CZ + 2.5), (0.5, 0.1), P.timber_light)
    with m.at((CX, 0.2, CZ + 2.75)):
        m.lathe([(0.34, 0), (0.42, 0.28), (0.4, 0.62)], P.linen, sides=8, cap0=True)
        m.part('running_flour')
        m.lathe([(0.37, 0.56), (0.0, 0.8)], P.ceramic, sides=8)
        m.part()
    # A hoist at the top, a sack on its rope.
    m.beam((CX, 6.05, CZ), (CX + 3.0, 6.05, CZ), (0.14, 0.16), P.timber_dark)
    m.tube((CX + 2.7, 6.0, CZ), (CX + 2.7, 3.5, CZ), 0.025, P.linen, sides=4)
    m.sack((CX + 2.7, 2.75, CZ), 0.36)
    for i, (x, z) in enumerate(((-2.9, 2.5), (-2.15, 2.8), (-2.6, 1.75))):
        m.sack((x, 0.2, z), 0.36, jitter(r, P.linen, 0.04))
    m.sack((2.4, 0.2, 2.6), 0.36, lying=True)
    m.crate((2.3, 0.2, 0.9), (3.3, 0.85, 1.9), fill=P.straw, heap=(P.gold, 0))
    m.planter((-3.65, 0.2, -3.3), (-3.1, 0.7, -0.9), P.timber, 'herb')
