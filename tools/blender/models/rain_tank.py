# Yard props: a ceramic rain tank on stone feet, with its copper downpipe, tap and bucket.
from kit import P

TITLE, GROUP, TILES = 'Rain tank', 'home', (1, 1)
ABOUT = 'A ceramic rain tank on stone feet, with a copper downpipe, a tap and a bucket.'


def build(m):
    for x, z in ((-0.6, -0.6), (0.6, -0.6), (-0.6, 0.6), (0.6, 0.6)):
        m.shoe(x, z, 0.5, 0.3)
    m.lathe([(1.0, 0.3), (1.05, 0.6), (1.05, 0.75), (1.05, 2.0), (1.05, 2.15), (1.05, 2.4), (0.8, 2.65), (0.3, 2.75)], sides=16, cap0=True,
            cols=[P.terracotta, P.copper, P.ceramic, P.copper, P.ceramic, P.ceramic, P.copper])
    m.lathe([(0.3, 2.75), (0.3, 2.9), (0.0, 2.9)], P.copper, sides=10)
    m.pipe([(0, 2.9, 0), (0, 3.4, 0), (-1.2, 3.6, 0)], 0.07, P.copper, sides=6)
    m.tube((0, 0.72, 1.05), (0, 0.72, 1.3), 0.045, P.brass, sides=5)
    m.tube((0, 0.72, 1.28), (0, 0.6, 1.28), 0.04, P.brass, sides=5)
    m.lathe([(0.2, 0), (0.26, 0.36)], P.copper, sides=10, centre=(0, 1.3), cap0=True)
