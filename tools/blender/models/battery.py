# The battery: four slim ceramic cells on a timber deck, copper bus bars between their terminals. Each cell has four
# charge rings, each ring its own piece (`charge_0` the lowest .. `charge_3`), for the game to show as it fills.
from kit import P, lin, rng, shade

TITLE, GROUP, TILES = 'Battery', 'power', (2, 2)
ABOUT = 'Four ceramic cells on a timber deck, joined by copper bars. The charge rings are separate pieces for the game to light.'
CHARGE = lin(0x7fe3c2)
CELLS = [(-1.75, -1.55), (1.75, -1.55), (-1.75, 1.75), (1.75, 1.75)]


def build(m):
    r = rng(4)
    for x in (-3.2, 0, 3.2):
        for z in (-3.2, 0, 3.2):
            m.shoe(x, z, 0.7, 0.3)
    for i in range(12):
        x = -3.6 + i * 0.6
        m.box((x, 0.3, -3.6), (x + 0.6, 0.48, 3.6), shade(P.timber, r.uniform(0.92, 1.05)), 'timber', (0, 0, 1))
    for cx, cz in CELLS:
        m.lathe([(1.04, 0.48), (1.0, 0.85), (1.0, 3.05), (0.82, 3.5), (0.32, 3.72)], sides=16, centre=(cx, cz),
                cols=[P.terracotta, P.ceramic, P.ceramic, P.ceramic])
        m.lathe([(0.32, 3.72), (0.32, 3.95), (0.2, 4.05), (0.0, 4.05)], P.copper, sides=10, centre=(cx, cz))
    for k in range(4):
        m.part(f'charge_{k}')
        y = 1.0 + k * 0.52
        for cx, cz in CELLS:
            # A band just proud of the cell, with no lip: a ring of colour, not four more ink lines.
            m.lathe([(1.012, y), (1.012, y + 0.3)], CHARGE, sides=16, centre=(cx, cz))
    m.part()
    # Bus bars: each pair joined over the top, and the pairs to each other along one side.
    for z in (-1.55, 1.75):
        m.pipe([(-1.75, 4.0, z), (-1.75, 4.45, z), (1.75, 4.45, z), (1.75, 4.0, z)], 0.07, P.copper, sides=6)
    m.pipe([(1.75, 4.45, -1.55), (1.75, 4.45, 1.75)], 0.07, P.copper, sides=6)
    # The switch cabinet at the front, a gauge in its face.
    m.prism([(-0.6, 3.0), (0.6, 3.0), (0.6, 3.5), (-0.6, 3.5)], 0.48, 1.9, P.ceramic)
    m.box((-0.68, 1.9, 2.94), (0.68, 2.0, 3.56), P.copper)
    with m.at((0, 1.35, 3.5)):
        m.porthole(0.26, P.copper, CHARGE, proud=0.04, sides=10)
    m.pipe([(0, 1.95, 3.1), (0, 2.3, 3.1), (0, 2.3, 2.6)], 0.05, P.copper, sides=5)
