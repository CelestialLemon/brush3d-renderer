# Yard props: a solar lantern on a timber post. Its globe is its own piece (`running_glow`) for the game to light at dusk.
from kit import P

TITLE, GROUP, TILES = 'Lantern', 'home', (1, 1)
ABOUT = 'A solar lantern on a timber post: a small solar cap, a copper arm, a globe for the game to light at dusk.'


def build(m):
    m.shoe(0, 0, 0.6, 0.3)
    m.tube((0, 0.3, 0), (0, 3.0, 0), 0.1, P.timber, 'timber', sides=8, r2=0.08)
    m.lathe([(0.12, 3.0), (0.14, 3.05), (0.0, 3.2)], P.copper, sides=8)
    with m.at((0, 3.22, 0), pitch=18):
        m.solar(0.8, 0.6, thick=0.05, edge=0.05)
    m.pipe([(0, 2.6, 0.08), (0, 2.75, 0.5), (0, 2.62, 0.62)], 0.03, P.copper, sides=5)
    m.lathe([(0.0, 2.64), (0.2, 2.54), (0.2, 2.5)], P.copper, sides=8, centre=(0, 0.62))
    m.part('running_glow')
    m.ball((0, 2.38, 0.62), 0.15, P.glow, sides=8)
    m.part()
