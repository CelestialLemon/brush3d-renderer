# The sprinkler: a copper riser on a ceramic valve, with a spinning head (`move_spin_head`, turning about the riser).
from kit import P, circle

TITLE, GROUP, TILES = 'Sprinkler', 'farming', (1, 1)
ABOUT = 'A copper riser on a ceramic valve, taller than a person. The two-armed head is a separate piece, ready to spin.'


def build(m):
    m.prism(circle(0.85, 12), 0, 0.18, P.stone, top=0.92)
    m.lathe([(0.4, 0.18), (0.5, 0.5), (0.42, 0.95), (0.16, 1.12)], sides=16, cols=[P.terracotta, P.ceramic, P.ceramic])
    m.tube((0, 1.1, 0), (0, 2.5, 0), 0.1, P.copper, sides=8)
    m.lathe([(0.1, 1.7), (0.15, 1.74), (0.15, 1.86), (0.1, 1.9)], P.brass, sides=8)
    # A valve wheel on the side, and the supply pipe off across the tile.
    m.tube((0.4, 0.62, 0), (0.62, 0.62, 0), 0.04, P.copper, sides=5)
    with m.at((0.64, 0.62, 0), roll=90):
        m.torus((0, 0, 0), 0.24, 0.04, P.copper, sides=10, around=4)
    m.pipe([(-0.42, 0.42, 0), (-1.0, 0.42, 0), (-1.0, 0.1, 0), (-1.85, 0.1, 0)], 0.07, P.copper, sides=6)
    m.part('move_spin_head', origin=(0, 2.5, 0), axis=(0, 1, 0), speed=2.0)
    m.ball((0, 2.58, 0), 0.2, P.brass, sides=8)
    for s in (-1, 1):
        m.tube((s * 0.1, 2.62, 0), (s * 1.2, 2.95, 0), 0.06, P.copper, sides=6)
        m.tube((s * 1.2, 2.95, 0), (s * 1.42, 3.02, s * 0.12), 0.1, P.brass, sides=6, r2=0.05)
    m.tube((0, 2.7, 0), (0, 3.0, 0), 0.07, P.brass, sides=6, r2=0.03)
    m.part()
