# The composter: three slatted timber bins (fresh cuttings, half-done, dark compost), a ceramic tumbler on a frame
# (its own piece, ready to turn), a barrow and sacks of the finished stuff.
from kit import P, rng, rrect, jitter, shade

TITLE, GROUP, TILES = 'Composter', 'farming', (2, 2)
ABOUT = 'Three slatted timber bins from fresh cuttings to dark compost, a ceramic tumbler on a frame, a barrow and sacks.'
TX, TY, TZ = -1.75, 1.5, 1.7


def build(m):
    r = rng(101)
    for i, (fill, top) in enumerate(((P.moss_deep, 1.45), (shade(P.soil, 1.35), 1.2), (P.soil, 1.0))):
        x0 = -3.65 + i * 2.45
        m.crate((x0, 0, -3.6), (x0 + 2.4, 1.5, -1.3), P.timber_light, fill=fill)
        m.poly([(x0 + 0.05, top, -3.55), (x0 + 0.05, top, -1.35), (x0 + 2.35, top, -1.35), (x0 + 2.35, top, -3.55)], fill)
        for x in (x0 + 0.06, x0 + 2.34):
            for z in (-3.54, -1.36):
                m.box((x - 0.08, 0, z - 0.08), (x + 0.08, 1.62, z + 0.08), P.timber, 'timber', (0, 1, 0))
    m.plant('herb', (-2.45, 1.4, -2.45), 0.85, 0.45)
    m.plant('flower', (0.0, 1.15, -2.3), 0.4, 0.25)
    with m.at((2.45, 1.52, -3.62), pitch=-68):
        m.box((-1.2, 0, 0), (1.2, 0.07, 2.3), P.timber, 'timber', (1, 0, 0))
    # The tumbler.
    for x in (TX - 1.3, TX + 1.3):
        for e in (-1, 1):
            m.beam((x, 0.08, TZ + e * 0.85), (x, TY + 0.05, TZ), (0.13, 0.13), P.timber)
        m.box((x - 0.08, 0, TZ - 1.0), (x + 0.08, 0.12, TZ + 1.0), P.timber_dark, 'timber')
    m.part('move_spin_drum', origin=(TX, TY, TZ), axis=(1, 0, 0), speed=0.4)
    with m.at((TX, TY, TZ), roll=90):
        m.lathe([(0.0, -1.42), (0.07, -1.42), (0.07, -1.05), (0.6, -1.05), (0.9, -0.85), (0.9, -0.14), (0.9, 0.14), (0.9, 0.85), (0.6, 1.05), (0.07, 1.05), (0.07, 1.42), (0.0, 1.42)], sides=14,
                cols=[P.copper, P.copper, P.terracotta, P.terracotta, P.ceramic, P.copper, P.ceramic, P.terracotta, P.terracotta, P.copper, P.copper])
    m.part()
    m.pipe([(TX + 1.42, TY, TZ), (TX + 1.6, TY, TZ), (TX + 1.6, TY - 0.4, TZ), (TX + 1.85, TY - 0.4, TZ)], 0.04, P.copper, sides=5)
    # The barrow, and the finished compost in sacks.
    with m.at((2.3, 0, 1.3), yaw=-25):
        m.prism(rrect(0.9, 1.3, 0.15, 2), 0.5, 0.95, P.terracotta, top=1.3, caps=(True, False))
        m.prism(rrect(1.1, 1.6, 0.15, 2), 0.86, 0.88, P.soil)
        with m.at((0, 0.3, 1.0), roll=90):
            m.lathe([(0.0, -0.08), (0.3, -0.06), (0.3, 0.06), (0.0, 0.08)], P.tyre, sides=10)
        for s in (-1, 1):
            m.beam((s * 0.42, 0.42, 1.0), (s * 0.5, 0.78, -1.5), (0.06, 0.07), P.timber)
            m.box((s * 0.42 - 0.04, 0, -0.6), (s * 0.42 + 0.04, 0.55, -0.52), P.timber_dark, 'timber')
    for x, z in ((1.0, 3.0), (1.75, 3.2)):
        m.sack((x, 0, z), 0.36, jitter(r, P.linen, 0.04))
    m.sack((0.2, 0, 3.2), 0.36, lying=True)
