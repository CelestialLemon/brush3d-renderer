# Yard props: a stack of harvest crates, a sack and a jar.
from kit import P

TITLE, GROUP, TILES = 'Crates', 'home', (1, 1)
ABOUT = 'A stack of harvest crates with a sack and a jar: yard dressing.'


def build(m):
    m.crate((-1.5, 0, -1.0), (-0.3, 0.72, 0.2), heap=(P.red, 6))
    m.crate((-0.1, 0, -1.2), (1.1, 0.72, 0.0), fill=P.dark, heap=(P.gold, 5))
    with m.at((-0.25, 0.72, -0.55), yaw=18):
        m.crate((-0.55, 0, -0.5), (0.55, 0.62, 0.5), fill=P.dark, heap=(P.moss_light, 5))
    m.sack((0.9, 0, 0.9), 0.36)
    m.jar((-0.6, 0, 1.0), 0.2, 0.5, P.gold, P.copper)
