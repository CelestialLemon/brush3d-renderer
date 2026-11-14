# The weather station: a white louvred instrument screen under a living lid, on four timber legs; beside it a thin copper
# mast with a vane and a three-cup anemometer (`move_spin_anemometer`), and a rain gauge. Valley furniture, not a landmark.
import math
from kit import P, at_y, rrect, shade

TITLE, GROUP, TILES = 'Weather station', 'farming', (1, 1)
ABOUT = 'A louvred white instrument box under a planted lid, a copper mast with vane and spinning cups, and a rain gauge.'
MAST = (1.25, -1.15)


def build(m):
    for sx in (-1, 1):
        for sz in (-1, 1):
            m.shoe(sx * 0.78, sz * 0.78, 0.36, 0.16)
            m.beam((sx * 0.78, 0.16, sz * 0.78), (sx * 0.56, 1.36, sz * 0.56), (0.11, 0.11), P.timber)
    # The screen: its louvres are bands of tone, not slats, so it stays quiet.
    box = rrect(1.4, 1.4, 0.12, 2)
    n = 8
    m.loft([at_y(box, 1.3 + 1.05 * i / n) for i in range(n + 1)], cols=[P.ceramic if i % 2 else shade(P.ceramic, 0.86) for i in range(n)], cap0=True)
    m.pillow(rrect(1.75, 1.75, 0.2, 2), 2.35, 0.26, flat=0.4, rim_h=0.1)
    m.plant('herb', (0.2, 2.62, -0.1), 0.42, 0.26)
    m.ball((0.35, 1.85, 0.72), 0.06, P.brass, sides=6)
    # The mast.
    mx, mz = MAST
    m.shoe(mx, mz, 0.4, 0.16)
    m.tube((mx, 0.16, mz), (mx, 4.45, mz), 0.05, P.copper, sides=6)
    with m.at((mx, 4.45, mz), yaw=35):
        m.beam((-0.5, 0, 0), (0.45, 0, 0), (0.04, 0.04), P.copper)
        m.poly([(-0.5, 0.0, 0), (-0.86, 0.22, 0), (-0.86, -0.22, 0)], P.terracotta)
        m.tube((0.45, 0, 0), (0.68, 0, 0), 0.07, P.copper, sides=5, r2=0.0)
    m.part('move_spin_anemometer', origin=(mx, 3.85, mz), axis=(0, 1, 0), speed=2.5)
    m.ball((mx, 3.85, mz), 0.09, P.copper, sides=6)
    for k in range(3):
        a = 2 * math.pi * k / 3 + 0.4
        tip = (mx + 0.55 * math.cos(a), 3.85, mz + 0.55 * math.sin(a))
        m.tube((mx, 3.85, mz), tip, 0.025, P.copper, sides=4)
        m.ball(tip, 0.15, P.ceramic, sides=8)
    m.part()
    # The rain gauge.
    gx, gz = -1.2, 1.2
    m.lathe([(0.26, 0.0), (0.22, 0.12), (0.22, 0.85)], sides=10, centre=(gx, gz), cols=[P.stone, P.ceramic])
    m.lathe([(0.22, 0.85), (0.34, 1.05), (0.34, 1.1), (0.1, 0.9)], P.copper, sides=10, centre=(gx, gz))
