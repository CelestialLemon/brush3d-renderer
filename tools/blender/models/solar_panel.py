# The solar panel: one thin sheet of deep-blue cells in a slim white frame, tilted to the front on a copper rail and two
# slender posts, the meadow free to grow beneath.
from kit import P

TITLE, GROUP, TILES = 'Solar panel', 'power', (2, 2)
ABOUT = 'One sheet of solar glass on two copper posts, low and quiet; the meadow grows under it.'


def build(m):
    for x in (-2.3, 2.3):
        m.shoe(x, 0.3, 0.7, 0.28)
        m.tube((x, 0.28, 0.3), (x, 2.2, 0.3), 0.1, P.copper, r2=0.075)
        # A strut up to the sheet's high edge.
        m.tube((x, 1.5, 0.3), (x, 2.75, -1.25), 0.05, P.copper, sides=6)
    m.tube((-3.3, 2.2, 0.3), (3.3, 2.2, 0.3), 0.075, P.copper, sides=8)
    with m.at((0, 2.36, 0.3), pitch=22):
        m.solar(7.4, 5.0, edge=0.12)
