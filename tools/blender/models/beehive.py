# The beehive: an apiary. Three stacked hives in soft colours on a timber stand, a planter of flowers in front for the bees.
from kit import P, at_y, lin, rrect, shade

TITLE, GROUP, TILES = 'Beehive', 'farming', (1, 1)
ABOUT = 'Three stacked hives in soft colours on a timber stand, with a planter of flowers for the bees.'
HONEY = lin(0xf0c86a)


def build(m):
    for x in (-1.45, 1.45):
        for z in (-0.75, 0.25):
            m.box((x - 0.08, 0, z - 0.08), (x + 0.08, 0.5, z + 0.08), P.timber_dark, 'timber')
    m.box((-1.7, 0.5, -0.95), (1.7, 0.62, 0.45), P.timber, 'timber')
    stacks = [(-1.1, [P.linen, HONEY, P.linen]), (0.0, [P.seaglass, P.linen]), (1.1, [HONEY, P.terracotta_light, P.linen])]
    for x, boxes in stacks:
        sq = rrect(0.86, 0.86, 0.07, 2, x, -0.25)
        h = 0.46
        m.loft([at_y(sq, 0.62 + h * i) for i in range(len(boxes) + 1)], cols=boxes)
        top = 0.62 + h * len(boxes)
        lid = rrect(1.0, 1.0, 0.1, 2, x, -0.25)
        m.prism(lid, top, top + 0.09, P.copper, caps=(True, False))
        m.dome(lid, top + 0.09, 0.2, P.copper, steps=2, flat=0.45)
        # The bees' way in: a dark slot and a landing board.
        m.poly([(x - 0.2, 0.68, 0.185), (x + 0.2, 0.68, 0.185), (x + 0.2, 0.75, 0.185), (x - 0.2, 0.75, 0.185)], P.dark)
        m.box((x - 0.26, 0.62, 0.18), (x + 0.26, 0.66, 0.36), shade(P.timber, 0.9), 'timber')
    m.planter((-1.7, 0, 0.95), (1.7, 0.42, 1.6), P.terracotta, 'flower', plants=4, tall=0.42)
