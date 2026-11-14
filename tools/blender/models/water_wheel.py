# The water wheel: a ten-paddle wheel hung off the front of its bank tile, over the river (its own piece, its axle along
# the bank), a copper dynamo on its shaft, and a rounded generator house under a planted roof behind.
import math
from kit import P, lin, rrect

TITLE, GROUP, TILES = 'Water wheel', 'power', (2, 2)
ABOUT = 'A ten-paddle wheel hung over the river off the front of its bank, a copper dynamo on its shaft, a generator house behind.'
# The wheel, its shaft and the dynamo hang past the tile's front edge, and the wheel dips below the bank into the river.
FREE = ('move_spin_wheel', 'dynamo')
AXLE = (0.0, 1.88, 3.92)


def build(m):
    m.deck()
    cx, cz = 0.0, -1.55
    m.hut(rrect(6.6, 3.9, 1.0, 4, cx, cz), 0.2, 3.0)
    m.pillow(rrect(7.2, 4.5, 1.25, 4, cx, cz), 3.0, 1.0)
    for p, kind in (((-2.0, 4.05, cz), 'herb'), ((0.3, 4.1, cz - 0.4), 'flower'), ((2.2, 4.05, cz + 0.2), 'herb')):
        m.plant(kind, p, 0.55, 0.34)
    front = cz + 1.95
    with m.at((2.2, 0.2, front)):
        m.door(1.05, 2.15)
    # The control window, left of the wheel so it shows past it: its glow is the game's `running_` look.
    with m.at((-1.75, 1.75, front)):
        m.porthole(0.48)
        # Just proud of the glass, inside the copper ring.
        m.part('running_control_window')
        m.poly([(0.4 * math.cos(2 * math.pi * i / 14), 0.4 * math.sin(2 * math.pi * i / 14), 0.04) for i in range(14)], lin(0x7fe3c2))
        m.part()
    for x in (-1.6, 1.6):
        with m.at((x, 1.9, cz - 1.95), yaw=180):
            m.porthole(0.4)
    # Stone piers at the bank's edge, copper bearings on them.
    for x0, x1 in ((-2.45, -0.9), (0.9, 1.5)):
        m.box((x0, 0.2, 3.3), (x1, 1.62, 3.99), P.stone)
    for x in (-1.1, 1.2):
        m.box((x - 0.18, 1.62, 3.66), (x + 0.18, 2.1, 3.995), P.copper)
    m.part('move_spin_wheel', origin=AXLE, axis=(1, 0, 0), speed=0.5)
    with m.at(AXLE, roll=90):
        m.wheel(2.75, 1.36, rim=P.timber, spoke=P.timber, spokes=10, hub=P.copper, rim_w=0.2, paddles=10, paddle_col=P.timber_light)
        m.tube((0, -1.4, 0), (0, 1.9, 0), 0.1, P.copper, sides=8)
    m.part('dynamo')
    with m.at((-1.85, AXLE[1], AXLE[2]), roll=90):
        m.lathe([(0.0, -0.5), (0.3, -0.45), (0.55, -0.32), (0.55, -0.1), (0.55, 0.1), (0.55, 0.32), (0.3, 0.45), (0.0, 0.5)], sides=12,
                cols=[P.copper, P.copper, P.copper, P.verdigris, P.copper, P.copper, P.copper])
    m.part()
    # The conduit from the dynamo into the house.
    m.pipe([(-1.85, 2.3, 3.6), (-1.85, 2.75, 3.6), (-1.85, 2.75, front + 0.02)], 0.07, P.copper, sides=6)
    m.planter((2.3, 0.2, 1.3), (3.6, 0.7, 1.9), P.terracotta, 'flower')
    m.plant('vine', (-3.35, 0.2, cz + 1.0), 0.4, 2.6)
