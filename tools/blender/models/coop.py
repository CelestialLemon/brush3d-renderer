# The coop: a long rounded henhouse off the ground under a planted roof with a solar sheet, a pop-hole and its ramp, and
# a fenced run whose gate arch always stands open.
from kit import P, rng, rrect, archway, shade

TITLE, GROUP, TILES = 'Coop', 'farming', (3, 3)
ABOUT = 'A long rounded henhouse under a planted roof with a solar sheet, a pop-hole and ramp, and a run with an open gate arch.'
FLOOR = 0.7


def build(m):
    cx, cz = 0.0, -2.9
    for x in (-3.6, 0, 3.6):
        for z in (cz - 1.6, cz + 1.6):
            m.shoe(x, z, 0.7, 0.5)
    house = rrect(9.2, 4.6, 1.5, 4, cx, cz)
    m.prism(rrect(9.4, 4.8, 1.6, 4, cx, cz), 0.5, FLOOR, P.timber, 'timber')
    m.hut(house, FLOOR, 3.2, skirt_h=0.5)
    m.pillow(rrect(10.0, 5.4, 1.8, 4, cx, cz), 3.2, 1.2, flat=0.38)
    for p, kind in (((-3.2, 4.4, cz + 0.3), 'herb'), ((-1.4, 4.5, cz - 0.4), 'flower'), ((3.6, 4.35, cz + 0.2), 'herb'), ((-2.4, 4.3, cz - 1.2), 'herb')):
        m.plant(kind, p, 0.6, 0.36)
    for x in (0.6, 2.5):
        m.tube((x, 4.5, cz - 0.55), (x, 4.95, cz - 0.55), 0.04, P.copper, sides=5)
    with m.at((1.55, 4.84, cz), pitch=14):
        m.solar(3.0, 1.7)
    front = cz + 2.3
    # The hens' door and its ramp; the keeper's door and step.
    with m.at((-2.2, FLOOR, front)):
        m.poly(archway(0.9, 1.0, 0.03), P.dark)
        m.pipe([(0.45, 0, 0.03), *archway(0.9, 1.0, 0.03)[2:], (-0.45, 0, 0.03)], 0.06, P.timber, 'timber', sides=4)
    m.beam((-2.2, FLOOR, front + 0.05), (-2.2, 0.05, front + 1.9), (0.8, 0.07), P.timber_light)
    with m.at((2.6, FLOOR, front)):
        m.door(0.95, 1.95)
    m.box((2.0, 0.0, front), (3.2, 0.36, front + 0.7), P.stone)
    for x in (-0.4, 0.9):
        with m.at((x, 2.05, front)):
            m.porthole(0.36)
    with m.at((cx - 4.6, 2.0, cz), yaw=-90):
        m.porthole(0.4)
    with m.at((cx + 4.6, 2.0, cz), yaw=90):
        m.porthole(0.4)
    # The nest boxes along the back, under a sloping lid.
    m.box((-2.6, 1.2, cz - 2.85), (2.6, 2.0, cz - 2.3), P.timber_light, 'timber')
    m.hexa([(-2.7, 2.0, cz - 2.95), (2.7, 2.0, cz - 2.95), (2.7, 2.0, cz - 2.3), (-2.7, 2.0, cz - 2.3),
            (-2.7, 2.06, cz - 2.95), (2.7, 2.06, cz - 2.95), (2.7, 2.3, cz - 2.3), (-2.7, 2.3, cz - 2.3)], P.copper)
    # The run.
    m.fence([(-1.0, 0, 5.6), (-5.6, 0, 5.6), (-5.6, 0, -0.9)], h=1.05, gap=2.3)
    m.fence([(1.0, 0, 5.6), (5.6, 0, 5.6), (5.6, 0, -0.9)], h=1.05, gap=2.3)
    for x in (-1.0, 1.0):
        m.box((x - 0.09, 0, 5.51), (x + 0.09, 1.9, 5.69), P.timber, 'timber', (0, 1, 0))
    m.pipe([(-1.0, 1.9, 5.6), (-0.7, 2.45, 5.6), (0, 2.68, 5.6), (0.7, 2.45, 5.6), (1.0, 1.9, 5.6)], 0.075, P.timber, 'timber', sides=4)
    m.plant('vine', (-1.05, 0, 5.6), 0.3, 2.0)
    # A feeder, the water, a straw bale and a perch.
    m.lathe([(0.5, 0.0), (0.5, 0.14), (0.2, 0.2), (0.3, 0.9), (0.36, 0.95), (0.0, 1.25)], sides=10, centre=(2.6, 2.6),
            cols=[P.terracotta, P.terracotta, P.ceramic, P.copper, P.copper])
    m.box((-4.3, 0, 2.0), (-3.0, 0.3, 2.7), P.stone)
    m.poly([(-4.2, 0.305, 2.1), (-4.2, 0.305, 2.6), (-3.1, 0.305, 2.6), (-3.1, 0.305, 2.1)], P.sky)
    m.box((3.6, 0, 0.3), (4.9, 0.6, 1.1), P.straw)
    for x in (-4.6, -3.0):
        m.box((x - 0.05, 0, 4.0), (x + 0.05, 0.7, 4.1), P.timber_dark, 'timber')
    m.beam((-4.75, 0.7, 4.05), (-2.85, 0.7, 4.05), (0.08, 0.08), P.timber)
