# The pylon: quiet. A slim timber pole on a stone shoe, two ceramic insulators on a short arm, a copper cap and a small
# lamp. There are many of them, so they sit in the background; the game draws their wires.
from kit import P

TITLE, GROUP, TILES = 'Pylon', 'power', (1, 1)
ABOUT = 'A slim timber pole with ceramic insulators, a copper cap and a small lamp. Quiet: a farm has many.'


def build(m):
    m.shoe(0, 0, 0.8, 0.32)
    m.tube((0, 0.32, 0), (0, 5.3, 0), 0.17, P.timber, 'timber', sides=8, r2=0.12)
    m.box((-1.0, 4.45, -0.08), (1.0, 4.62, 0.08), P.timber, 'timber')
    for s in (-1, 1):
        m.beam((s * 0.1, 3.9, 0), (s * 0.7, 4.45, 0), (0.08, 0.08), P.timber_dark, up=(0, 0, 1))
        m.lathe([(0.07, 4.62), (0.17, 4.7), (0.1, 4.79), (0.17, 4.88), (0.1, 4.97), (0.15, 5.04), (0.05, 5.12)], P.ceramic, sides=8, centre=(s * 0.82, 0))
    m.lathe([(0.2, 5.3), (0.22, 5.36), (0.0, 5.72)], P.copper, sides=8)
    # The lamp, on a copper bracket to the front.
    m.pipe([(0, 3.4, 0.1), (0, 3.75, 0.5), (0, 3.62, 0.68)], 0.035, P.copper, sides=5)
    m.lathe([(0.0, 3.66), (0.2, 3.56), (0.2, 3.52)], P.copper, sides=8, centre=(0, 0.68))
    m.ball((0, 3.42, 0.68), 0.13, P.glow, sides=8)
