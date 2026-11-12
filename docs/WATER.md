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

**Ice** (#14) is one more number per tile: how frozen the water is. The game says how much; the renderer decides where
inside each tile it forms first, as a pond does: along the banks and in the slow water, the middle and the fast water
last. Freezing, it creeps out from the banks as a dark skin with a pale rim, and pales as it ages. Thawing (the number
falling), dark leads open along the flow, the middle breaks into floes that drift downstream and shrink, and the ice
along the banks goes last. Snow lying on the land dusts it.

## The contract

```ts
renderer.setWater({
  nx, nz, cell, x0, z0,          // the grid: like the wind's and the dust's, its corner at (x0, z0), x fastest
  level,                         // Float32Array: the surface per cell, metres; NaN where it's dry
  flowX, flowZ,                  // optional Float32Arrays: the flow per cell, m/s (still water if left out)
  mud,                           // optional Float32Array: 0 clear to 1 brown with silt (clear if left out)
  ice,                           // optional Float32Array: 0 open, about 0.3 ice along the banks, 1 frozen over (#14)
}, ease);                        // seconds to ease in (0.6 by default; 0 at once: a level loading, a screenshot)
renderer.setWater(null);         // no water
```

- **Levels** are the water's surface, not its depth: the renderer doesn't need the ground's height, and water at
  different heights (a river either side of a fall, a flood standing higher than the river) is just different numbers.
  A cell is wet if its level isn't NaN. Mark a cell wet when the land at its middle is under the surface (as
  `flood.ts` does); the sheet's flat cell beyond takes care of the shore between cells.
- **Flow** is the water's velocity. It carries the ripples and the glints along; calm water is glassy, fast water busy.
  The stream in the demo runs at 0.35 m/s, 3.5 times that in spate.
- **Mud** turns the water brown and opaque (see below).
- **Ice** is how frozen the water is (see "In plain words"). Whether it's freezing or thawing the renderer tells from
  which way it last moved in each cell, so send it rising while it freezes and falling while it thaws; held, it keeps
  the way it was going. Steps however small add up: it turns once the value comes back from the furthest it went. With
  no `ice` (or all 0) the water's shader skips it, and once a thaw to 0 has eased out, it stops painting ice.
- **Updates.** Send a new map when the water changes, a few times a second at most. Each one eases in from what's
  drawn at that moment, so maps sent faster than the ease still move smoothly. A map on a new grid comes in at once.
- **Cost.** The map is laid out on the CPU when it's sent and uploaded as two textures; nothing is done per frame but a
  blend between them. The sheet's triangles are only round the water. Laying out grows with the map: about 2 ms for
  100 × 100 cells, and for the farm's valley (250 × 250) about 9 ms once warmed up, 15 to 20 ms in the browser for the
  first few sends (on the dev machine). That's a dropped frame each time a big map is sent, fine a few times a second
  while a flood moves; if the game sends big maps more often, the laying out can move off the main thread (a worker).
- **The land's edge.** The water stops at the edge of the ground's square (the `fields` square it's baked over), where
  nothing would hide the sheet reaching past the last wet cell.

## How it's drawn

`src/renderer/water.ts` lays the map out (`layWater`): wet cells as sent, then a breadth-first pass outwards giving each
dry cell the surface, flow and mud of the highest water it's reached from, flat for one cell and then diving 1.5 m a
cell (at most 4 m). Where the sheet dives, its mud channel holds how far down it is, negative, and the shader doesn't
draw it there: under the land it's hidden anyway, and at the land's edge it would show beneath it. `WaterField` keeps
the map as it was and as last sent, as two float textures the shaders blend; the sheet is a vertex per cell (and a ring
round the grid's edge, so water reaches it), its height read from them, and its triangles are rewritten on each map to
cover only the cells within one of water (into one buffer per grid, with room for them all).

- **The flow** carries the ripples and glints by a flow map: two copies of the pattern, each carried along for four
  seconds and then put back, crossfaded so neither's jump shows, each place on its own beat so no pulse sweeps the
  river. However the flow turns and changes speed, the pattern never drags out of shape (the old ribbon carried it
  along for ever, so its bends would have smeared it in a long session).
- **Reflections at any height.** The reflection is drawn once, mirrored about one surface (the median of the water).
  The camera is orthographic, so water standing higher or lower mirrors exactly the same picture moved up or down the
  screen by twice the difference: each pixel reads it shifted by its own amount. What's under the water isn't
  reflected, judged by the nearest water, not by one plane: in water, its surface just there, read off the sheet's own
  triangles (a fence standing in a flood isn't mirrored below the flood's surface); on dry land, the surface of the
  water the sheet dives from (a dry hollow lower than the river beside it isn't mirrored, or it would show in the
  river). The only error left is at the screen's edge, as before, and where water at two heights is equally near.
- **The haze** in hollows measures from the lowest water, as it measured from the stream.
- **Fast water, mud and the waterline** (the developer's picks, 2026-11-03): fast water (from about a metre a second)
  gets long light streaks along the flow ("streaks"); mud turns the water ochre brown and opaque ("brown"), lit by the
  sun as well as the sky, as silt is; things standing in water get a thin foam line where it meets them and a faint wet
  band above it ("foam line"). The waterline is drawn by everything but the water (`waterline` in `writeGBuffer`), only
  below the highest water, not along blades and leaves (no foam line on them), and not on things that float (the boat:
  `addModel`'s `floats`). Left out: foam carried on fast water, milky mud with swirls of silt, the wet band alone.

- **Ice** (#14). `layWater` carries each wet cell's ice to the dry cells beyond it (as it does the mud), and works out how
  far each wet cell is from the nearest dry one (`shoreDistance`, metres, up to 8). `WaterField` keeps, per cell, the
  ice, whether it's thawing (it has come back down from the most it reached since it last turned) and that distance,
  as two more textures (as it was and as last sent), read by the sheet's vertices and smoothed between them. The water's shader (`WATER_FRAG`, materials.ts) ranks
  each point by how late it freezes: its distance from the shore (most of it, up to 3.5 m), how fast the flow is, and a
  noise breaking the edge up. Where the ice reaches past that, it's frozen; a pale line marks its edge. How long it's
  been frozen (how far past) turns a new dark skin to the look. Thawing, dark lanes along the flow cut it, and the open
  middle fills with floes: a cracked pattern carried by the flow as the ripples are (two copies crossfaded), shrinking
  as the ice goes. Under the ice there are no ripples, glints, whitecaps or rain's rings; it mirrors the sky and the
  banks whole. Lying snow (the ground's map) dusts it in drifts along the wind. The looks (the developer's pick, to come):
  A black (dark, the bed faint through it, a calm mirror, pale cracks), B milky (pale, lit as snow is, streaked along
  the flow), C both (milky by the banks, dark over the channel).

## The demo

The demo stands in for the game (`src/app/water.ts`): the scene describes its water (its usual level, its channel and
which way and how fast it flows: on the farm, the stream, the pond it runs into and the brook out of it), and the demo
makes the map with the game's rule: the water stands at the stream's level plus a
rise and reaches every cell lower than that which it can get to over lower ground, never off the land. Out of the
channel it runs at a quarter of the stream's speed.

- `?water=usual|spate|flood`, then `rise` (m over the usual), `flow` (times the usual speed), `mud` and `ice` over it.
- The Water, flow, mud and ice sliders, and the ice look button (`?iceLook=a|b|c`, #14).
- `?timeline&spell=flood`: a storm swells the stream, which runs fast and brown, spills over the floodplain, and drains
  under clearing skies (17 game hours, about a minute at 3x).
- `?timeline&spell=freeze-thaw&season=winter` (#14): the stream freezes over from its banks, holds, and thaws (8 game
  hours, all in daylight, about 27 s at 3x).
- `npm run test:water` checks the layout, the rule and the easing. `tools/video.ts` has `flood`, `flood-meadow`
  (`QUERY=scene=meadow`), `stream-spate`, `stream-usual` and `river-freeze` (#14, `QUERY=season=winter`).
