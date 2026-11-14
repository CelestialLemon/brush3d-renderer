# The digester: a low round tank under a planted dome, with a copper gas bell, a feed hopper and a slim flare pipe (the
# game's `smoke_emitter` at its tip).
from kit import P, circle, rrect

TITLE, GROUP, TILES = 'Digester', 'power', (2, 2)
ABOUT = 'A round tank under a planted dome: farm waste in at the hopper, gas to the copper bell, a small flare on its pipe.'


def build(m):
    m.prism(circle(3.78, 24), 0, 0.2, P.stone, top=0.97)
    m.lathe([(3.3, 0.2), (3.25, 0.8), (3.25, 1.75), (3.25, 2.0)], sides=24, cols=[P.terracotta, P.plaster, P.copper])
    m.lathe([(3.25, 2.0), (3.4, 2.05), (3.4, 2.15)], P.timber, 'timber', sides=24)
    m.lathe([(3.4, 2.15), (3.1, 3.0), (2.4, 3.75), (1.3, 4.25), (0.5, 4.4)], sides=24, mat='moss', cols=[P.moss_deep, P.moss, P.moss, P.moss_light])
    m.lathe([(0.5, 4.4), (0.5, 4.62), (0.26, 4.74), (0.0, 4.74)], P.copper, sides=10)
    for p, kind in (((1.9, 3.3, 1.4), 'flower'), ((-1.2, 3.75, 1.6), 'herb'), ((-2.2, 3.1, -1.2), 'herb'), ((0.9, 3.8, -1.7), 'flower'), ((2.4, 2.9, -1.4), 'herb')):
        m.plant(kind, p, 0.6, 0.4)
    # Gas off the top, along to the flare pipe at the back corner.
    fx, fz = -3.2, -3.2
    m.pipe([(0, 4.7, 0), (0, 5.15, 0), (fx, 5.15, fz)], 0.09, P.copper, sides=6)
    m.shoe(fx, fz, 0.6, 0.3)
    m.tube((fx, 0.3, fz), (fx, 6.5, fz), 0.11, P.copper, sides=8)
    m.lathe([(0.11, 6.5), (0.24, 6.66), (0.24, 6.95)], P.copper, sides=8, centre=(fx, fz))
    m.empty('smoke_emitter', (fx, 7.1, fz))
    # The gas bell: a copper holder, its verdigris band, a small dome.
    m.lathe([(0.8, 0.2), (0.8, 1.2), (0.8, 1.45), (0.8, 2.0), (0.6, 2.4), (0.0, 2.55)], sides=14, centre=(-2.9, 2.8),
            cols=[P.copper, P.verdigris, P.copper, P.copper, P.copper])
    # The feed hopper: a timber funnel on legs against the tank.
    hx, hz = 2.75, 2.75
    m.prism(rrect(1.0, 1.0, 0.1, 2, hx, hz), 1.35, 2.3, P.timber, 'timber', top=1.55, caps=(True, False))
    m.prism(rrect(1.4, 1.4, 0.1, 2, hx, hz), 2.2, 2.24, P.soil)
    for dx, dz in ((0.45, 0.45), (-0.45, 0.45), (0.45, -0.45)):
        m.box((hx + dx - 0.07, 0.2, hz + dz - 0.07), (hx + dx + 0.07, 1.4, hz + dz + 0.07), P.timber_dark, 'timber')
    with m.at((0, 1.3, 3.25)):
        m.porthole(0.38)
    with m.at((-1.3, 1.1, 3.1), pitch=90):
        m.torus((0, 0, 0), 0.26, 0.04, P.copper, sides=10, around=4)
