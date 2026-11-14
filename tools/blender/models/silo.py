# The silo: a white ceramic grain store with copper hoops and a planted roof, on a stone apron. The tall one of the set:
# in the game it shelters turbines.
import math
from kit import P, circle, shade

TITLE, GROUP, TILES = 'Silo', 'logistics', (2, 2)
ABOUT = 'A ceramic grain store: copper hoops, a planted cap, a gauge window showing how full it is, and a filling pipe.'


def build(m):
    m.prism(circle(3.75, 24), 0, 0.22, P.stone, top=0.97)
    # The drum, turned in one piece: a terracotta skirt, ceramic between flush copper hoops (colour only, so no lines).
    hoop = lambda y: [(3.0, y), (3.0, y + 0.26)]
    prof = [(3.06, 0.22), (3.0, 0.9)] + hoop(2.7) + hoop(5.1) + [(3.0, 7.3), (3.0, 7.55)]
    cols = [P.terracotta, P.ceramic, P.copper, P.ceramic, P.copper, P.ceramic, P.copper]
    m.lathe(prof, sides=24, cols=cols)
    # The eave and the planted cap.
    m.lathe([(3.0, 7.55), (3.32, 7.62), (3.32, 7.78)], P.timber, 'timber', sides=24)
    m.lathe([(3.32, 7.78), (2.95, 8.45), (2.1, 9.0), (1.1, 9.32), (0.55, 9.4)], sides=24, mat='moss',
            cols=[P.moss_deep, P.moss, P.moss, P.moss_light])
    m.lathe([(0.55, 9.4), (0.55, 9.62), (0.36, 9.72), (0.0, 10.05)], P.copper, sides=12)
    m.plant('herb', (0, 8.5, 2.4), 0.6, 0.4)
    m.plant('flower', (-2.2, 8.5, 0.9), 0.55, 0.4)
    m.plant('herb', (1.6, 8.6, -1.9), 0.6, 0.4)
    # The gauge: a strip of glass up the front, gold where the grain stands behind it.
    for y0, y1, col, mat in ((1.3, 4.6, P.gold, 'plain'), (4.6, 6.9, P.seaglass, 'glass')):
        m.poly([(-0.28, y0, 3.02), (0.28, y0, 3.02), (0.28, y1, 3.02), (-0.28, y1, 3.02)], col, mat)
    for x in (-0.33, 0.33):
        m.box((x - 0.05, 1.22, 2.96), (x + 0.05, 6.98, 3.06), P.copper)
    # A round-headed hatch to one side, and the filling pipe up the other from a hopper on the apron.
    with m.at(yaw=42):
        with m.at((0, 0.22, 2.97)):
            m.door(1.3, 2.3, P.timber)
    m.prism([(-3.72, 0.55), (-2.9, 0.55), (-2.9, 1.45), (-3.72, 1.45)], 0.22, 1.25, P.timber, 'timber', top=1.0)
    m.box((-3.66, 1.25, 0.6), (-2.96, 1.3, 1.4), P.gold)
    m.pipe([(-3.3, 1.0, 1.0), (-3.3, 7.4, 1.0), (-1.3, 9.1, 0.4)], 0.17, P.copper, sides=8)
    for y in (2.8, 5.2):
        m.box((-3.3, y, 0.92), (-2.85, y + 0.12, 1.08), shade(P.copper, 0.85))
