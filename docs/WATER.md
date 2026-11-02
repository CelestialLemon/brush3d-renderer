# The water (#18)

The game owns the water: its rivers, ponds and floods, and the rules that move them (Soil-n-Silo's `flood.ts` is the
model). The renderer draws whatever water it's given, as a map over the land, sent again whenever it changes.

## In plain words

Think of the water as one sheet of cloth laid over the land and pinned at each tile to the height the game says the
water stands there. Where the land rises above the cloth, the land hides it, so the shore is exactly where the water
meets the ground, smooth however big the tiles are. For that to work the cloth has to reach a little past the last wet
tile: it carries on flat for one more tile (so the shore between a wet tile and a dry one lands where the ground really
meets the water) and then dives steeply under the land, where it isn't drawn.

A flood is no special case: it's the river's tiles spreading over the land, at whatever heights the game's rules give
them. When the game sends a new map, the cloth moves to it over a moment rather than jumping, so a rising flood creeps
over the land instead of stepping a tile at a time.

## The contract

```ts
renderer.setWater({
  nx, nz, cell, x0, z0,          // the grid: like the wind's and the dust's, its corner at (x0, z0), x fastest
  level,                         // Float32Array: the surface per cell, metres; NaN where it's dry
  flowX, flowZ,                  // optional Float32Arrays: the flow per cell, m/s (still water if left out)
  mud,                           // optional Float32Array: 0 clear to 1 brown with silt (clear if left out)
}, ease);                        // seconds to ease in (0.6 by default; 0 at once: a level loading, a screenshot)
renderer.setWater(null);         // no water
```

- **Levels** are the water's surface, not its depth: the renderer doesn't need the ground's height, and water at
  different heights (a river either side of a fall, a flood standing higher than the river) is just different numbers.
  A cell is wet if its level isn't NaN. Mark a cell wet when the land at its middle is under the surface (as
  `flood.ts` does); the sheet's flat cell beyond takes care of the shore between cells.
- **Flow** is the water's velocity. It carries the ripples and the glints along; calm water is glassy, fast water busy.
  The stream in the demo runs at 0.35 m/s, 3.5 times that in spate.
- **Mud** is carried to the shaders for the look (still to be chosen, #18's second PR).
- **Updates.** Send a new map when the water changes, a few times a second at most. Each one eases in from what's
  drawn at that moment, so maps sent faster than the ease still move smoothly. A map on a new grid comes in at once.
- **Cost.** The map is laid out on the CPU when it's sent (a few milliseconds for 100 × 100 cells) and uploaded as two
  small textures; nothing is done per frame but a blend between them. The sheet's triangles are only round the water.
- **The land's edge.** The water stops at the edge of the ground's square (the `fields` square it's baked over), where
  nothing would hide the sheet reaching past the last wet cell.

## How it's drawn

`src/renderer/water.ts` lays the map out (`layWater`): wet cells as sent, then a breadth-first pass outwards giving each
dry cell the surface, flow and mud of the highest water it's reached from, flat for one cell and then diving 1.5 m a
cell (at most 4 m). Where the sheet dives, its mud channel holds how far down it is, negative, and the shader doesn't
draw it there: under the land it's hidden anyway, and at the land's edge it would show beneath it. `WaterField` keeps
the map as it was and as last sent, as two float textures the shaders blend; the sheet is a vertex per cell, its height
read from them, and its triangles are rebuilt on each map to cover only the cells within one of water.

- **The flow** carries the ripples and glints by a flow map: two copies of the pattern, each carried along for four
  seconds and then put back, crossfaded so neither's jump shows, each place on its own beat so no pulse sweeps the
  river. However the flow turns and changes speed, the pattern never drags out of shape (the old ribbon carried it
  along for ever, so its bends would have smeared it in a long session).
- **Reflections at any height.** The reflection is drawn once, mirrored about one surface (the median of the water).
  The camera is orthographic, so water standing higher or lower mirrors exactly the same picture moved up or down the
  screen by twice the difference: each pixel reads it shifted by its own amount. What's under the water isn't
  reflected, judged by the water just where it is (a fence standing in a flood isn't mirrored below the flood's
  surface), not by one plane. The only error left is at the screen's edge, as before.
- **The haze** in hollows measures from the lowest water, as it measured from the stream.

## The demo

The demo stands in for the game (`src/app/water.ts`): the scene describes its stream (its usual level, its channel and
which way it flows), and the demo makes the map with the game's rule: the water stands at the stream's level plus a
rise and reaches every cell lower than that which it can get to over lower ground, never off the land. Out of the
channel it runs at a quarter of the stream's speed.

- `?water=usual|spate|flood`, then `rise` (m over the usual), `flow` (times the usual speed) and `mud` over it.
- The Water, flow and mud sliders.
- `?timeline&spell=flood`: a storm swells the stream, which runs fast and brown, spills over the floodplain, and drains
  under clearing skies (17 game hours, about a minute at 3x).
- `npm run test:water` checks the layout, the rule and the easing. `tools/video.ts` has `flood`, `flood-meadow`
  (`QUERY=scene=meadow`), `stream-spate` and `stream-usual`.
