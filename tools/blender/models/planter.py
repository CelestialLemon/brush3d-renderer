# Yard props: two raised beds of herbs and flowers, and a copper watering can.
from kit import P

TITLE, GROUP, TILES = 'Planters', 'home', (1, 1)
ABOUT = 'Two raised timber beds of herbs and flowers and a copper watering can: yard dressing.'


def build(m):
    m.planter((-1.7, 0, -1.6), (1.7, 0.55, -0.5), P.timber, 'herb', plants=4)
    m.planter((-1.7, 0, 0.3), (0.5, 0.55, 1.4), P.timber, 'flower', plants=3, tall=0.45)
    m.lathe([(0.24, 0), (0.26, 0.42), (0.2, 0.5)], P.copper, sides=10, centre=(1.2, 0.9), cap0=True)
    m.pipe([(1.44, 0.15, 0.9), (1.75, 0.5, 0.9)], 0.04, P.copper, sides=5)
    m.pipe([(1.0, 0.45, 0.9), (0.82, 0.5, 0.9), (0.82, 0.2, 0.9), (0.97, 0.12, 0.9)], 0.03, P.copper, sides=5)
