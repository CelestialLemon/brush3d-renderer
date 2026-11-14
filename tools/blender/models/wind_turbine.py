# The wind turbine: a slim white tower and a big three-blade rotor with terracotta tips. The rotor is its own piece
# (`move_spin_rotor`, its origin at the hub, its local x along the axle), ready to turn; it sweeps past the tile, high up.
import math
from kit import P

TITLE, GROUP, TILES = 'Wind turbine', 'power', (1, 1)
ABOUT = 'A slim ceramic tower, a rotor ten metres across with terracotta tips. The rotor is a separate piece, ready to turn.'
FREE = ('move_spin_rotor',)
HUB = (0, 14.4, 0.95)


def build(m):
    m.prism([(1.5 * math.cos(a), 1.5 * math.sin(a)) for a in (2 * math.pi * i / 16 for i in range(16))], 0, 0.25, P.stone, top=0.95)
    m.lathe([(0.78, 0.25), (0.62, 1.0), (0.54, 3.0), (0.54, 3.25), (0.38, 9.0), (0.28, 13.75), (0.34, 13.85), (0.34, 14.0)], sides=14,
            cols=[P.terracotta, P.ceramic, P.copper, P.ceramic, P.ceramic, P.copper, P.copper])
    with m.at((0, 0.25, 0.7)):
        m.door(0.62, 1.5, P.timber)
    # The nacelle: a rounded pod along the axle.
    with m.at((0, 14.4, 0), pitch=90):
        m.lathe([(0.0, -1.25), (0.3, -1.1), (0.5, -0.4), (0.52, 0.3), (0.4, 0.8)], sides=12, cols=[P.copper, P.ceramic, P.ceramic, P.ceramic], cap1=True)
    m.part('move_spin_rotor', origin=HUB, axis=(0, 0, 1), speed=1.2)
    with m.at(HUB):
        with m.at(pitch=90):
            m.lathe([(0.4, -0.15), (0.4, 0.1), (0.26, 0.42), (0.0, 0.62)], sides=12, cols=[P.ceramic, P.copper, P.copper], cap0=True)
        for k in range(3):
            with m.at(roll=120 * k + 30):
                rings = []
                for y, w, twist in ((0.25, 0.34, 26), (1.3, 0.72, 16), (3.0, 0.52, 8), (4.3, 0.36, 4), (4.95, 0.2, 2)):
                    c, s = math.cos(math.radians(twist)), math.sin(math.radians(twist))
                    rings.append([(x * c - z * s, y, x * s + z * c) for x, z in ((-0.38 * w, 0.035), (0.62 * w, 0.02), (0.62 * w, -0.02), (-0.38 * w, -0.035))])
                m.loft(rings, cols=[P.ceramic, P.ceramic, P.ceramic, P.terracotta], cap1=True)
    m.part()
