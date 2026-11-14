# The truck: small, rounded and electric. A ceramic cab with sea-glass windows and solar glass on its roof, an open timber
# bed for the game's cargo (its floor 1.08 m up), four wheels as their own pieces. Its front faces +z.
from kit import P, at_y, rrect, shade

TITLE, GROUP, TILES = 'Truck', 'logistics', (1, 1)
ABOUT = 'A small electric farm truck: a rounded ceramic cab with solar glass on its roof and an open timber bed.'
BED = 1.08


def build(m):
    m.box((-0.78, 0.42, -1.64), (0.78, 0.66, 1.5), P.tyre)
    cab = rrect(1.96, 1.32, 0.34, 3, 0, 1.0)
    m.loft([at_y(cab, 0.6), at_y(cab, 0.92), at_y(cab, 1.3), at_y(cab, 1.8, 0.97, 0, 1.0), at_y(cab, 1.95, 0.84, 0, 1.0)],
           cols=[P.terracotta, P.ceramic, P.ceramic, P.ceramic], cap0=True, cap1=True)
    m.poly([(-0.66, 1.962, 0.52), (-0.66, 1.962, 1.42), (0.66, 1.962, 1.42), (0.66, 1.962, 0.52)], P.solar, 'glass', grain=(1, 0, 0))
    m.poly([(-0.66, 1.22, 1.69), (0.66, 1.22, 1.69), (0.66, 1.72, 1.672), (-0.66, 1.72, 1.672)], P.seaglass, 'glass')
    for s in (-1, 1):
        m.poly([(s * 1.008, 1.22, 0.62), (s * 1.008, 1.22, 1.36), (s * 0.99, 1.72, 1.36), (s * 0.99, 1.72, 0.62)], P.seaglass, 'glass')
        m.ball((s * 0.62, 1.0, 1.64), 0.11, P.glow, sides=8)
    m.box((-0.92, 0.5, 1.6), (0.92, 0.64, 1.72), P.copper)
    # The bed: a floor, low boards round it, a taller headboard behind the cab.
    m.box((-1.0, BED - 0.1, -1.7), (1.0, BED, 0.3), P.timber, 'timber', (0, 0, 1))
    for s in (-1, 1):
        m.box((s * 1.0 - 0.035, BED, -1.7), (s * 1.0 + 0.035, BED + 0.42, 0.3), P.timber_light, 'timber', (0, 0, 1))
    m.box((-1.0, BED, -1.735), (1.0, BED + 0.42, -1.665), P.timber_light, 'timber', (1, 0, 0))
    m.box((-1.0, BED, 0.23), (1.0, BED + 0.78, 0.3), P.timber_light, 'timber', (1, 0, 0))
    for i, (x, z) in enumerate(((0.9, 1.0), (-0.9, 1.0), (0.9, -1.05), (-0.9, -1.05))):
        m.part(f'move_spin_wheel_{"fb"[i // 2]}{"lr"[i % 2]}', origin=(x, 0.42, z), axis=(1, 0, 0), speed=4.0)
        with m.at((x, 0.42, z), roll=90):
            m.lathe([(0.0, -0.17), (0.22, -0.15), (0.36, -0.15), (0.42, -0.09), (0.42, 0.09), (0.36, 0.15), (0.22, 0.15), (0.0, 0.17)], sides=12,
                    cols=[P.copper, P.tyre, P.tyre, P.tyre, P.tyre, P.tyre, P.copper])
    m.part()
