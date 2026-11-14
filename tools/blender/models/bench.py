# Yard props: a timber bench between two potted shrubs.
from kit import P

TITLE, GROUP, TILES = 'Bench', 'home', (1, 1)
ABOUT = 'A timber bench between two terracotta pots: somewhere to sit and look at the farm.'


def build(m):
    m.box((-1.1, 0.46, -0.3), (1.1, 0.54, 0.25), P.timber, 'timber')
    m.box((-1.1, 0.54, -0.36), (1.1, 1.0, -0.28), P.timber_light, 'timber')
    for x in (-0.95, 0.95):
        m.box((x - 0.05, 0, -0.34), (x + 0.05, 1.0, -0.26), P.timber_dark, 'timber', (0, 1, 0))
        m.box((x - 0.05, 0, 0.12), (x + 0.05, 0.46, 0.2), P.timber_dark, 'timber', (0, 1, 0))
    for x in (-1.6, 1.6):
        m.lathe([(0.24, 0), (0.34, 0.5), (0.38, 0.5), (0.38, 0.58), (0.3, 0.58)], P.terracotta, sides=10, centre=(x, -0.1), cap0=True)
        m.lathe([(0.3, 0.56), (0.0, 0.56)], P.soil, sides=10, centre=(x, -0.1))
        m.plant('shrub', (x, 0.56, -0.1), 0.42, 0.55)
