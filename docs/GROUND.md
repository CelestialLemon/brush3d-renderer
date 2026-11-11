# The ground's state: snow, frost, wet and mud (#14, #11)

The game owns the ground's state: how deep the snow lies on the land, how much frost there is, how wet the land is and
how muddy, and the rules that change them (snow falling builds it up, the sun and a thaw take it away, a clear cold
night brings frost, rain wets the land and the sun and wind dry it). The renderer
draws whatever state it's given, as a map over the land in the water's format (docs/WATER.md), sent again whenever it
changes. Ice on the river isn't here: it goes in the water's map (#18), since the water owns the river.

Wet ground and mud (#11) were tried first, in #50, and that look wasn't kept: the developer didn't like its puddles
(2026-11-11). The map's plumbing was sound, so #14 brought it back for the snow, and #11's second try put the wet and
the mud in its two free slots, without puddles.

## In plain words

The game paints a number on each tile of the land: how deep the snow lies there. The renderer does the rest:

- **Snow lies on what faces up**: the ground, roofs, the tops of walls, fences and crates, the solar panels, a crown's
  top, a branch's top. Steep banks and the sides of things stay clear, unless the snow is deep enough to bury them.
- **None under a roof**, right to the roof's edge, and less under a tree. The renderer knows what's sheltered from the
  shelter map (#10), finer than the game's tiles: the shed's roof takes snow, its porch floor doesn't.
- **Thin snow lies in patches** along the land's own shape: the hollows fill first and the rises go bare, so a dusting
  looks like snow that settled, not a pattern laid over the picture. On a roof or a panel a thin snow is a veil the
  roof shows through, thickening to white.
- **Grass and crops poke through thin snow**, and are buried as it deepens: snow at 1 lies 0.9 m deep, over the
  tallest grass.
- **Its shade is blue and violet, never grey** (the developer's pick of three, #58): white in the sun, a clear blue in
  shade that follows the hour's shade (violet at dusk, lavender at night). The snow has its own paint, lit by the same light as everything else
  (the sun's shadows, the clouds', the hour's colour). Under an overcast sky it stays the brightest thing on the land,
  with a pale cool tint, not grey.

And a number for how wet each tile is, and one for how muddy:

- **Wet things go darker and richer**, as a stone darkens when it's splashed: the ground, grass, crops, leaves, stones
  and wood. They're still lit by the same light, so a wet field's shade is still the hour's teal or violet, only deeper.
- **What people build takes a sheen** as well: a bright band of wet shine on the side facing the light (the sun, or the
  bright sky overhead under cloud), in streaks down it as the water runs.
- **Bare earth turns to mud**: the tracks, the yard, a ploughed bed. Only the earth itself, not the grass beside it,
  though the game's tiles are coarser than a track: the renderer tells the earth from the grass by its colour.
- **Under a roof it stays dry**, to the roof's edge (with a painted edge, not a ruled one), and less wet under a tree,
  as for the snow.
- **The game dries it**, by lowering the numbers: the renderer has no clock of its own for it.

## The contract

```ts
renderer.setGround({
  nx, nz, cell, x0, z0,          // the grid: the water's, the wind's and the dust's; its corner at (x0, z0), x fastest
  snow,                          // optional Float32Array: how deep the snow lies per cell, 0 to 1 (none if left out)
  frost,                         // optional Float32Array: how much frost per cell, 0 to 1 (#14's frost; none if left out)
  wet,                           // optional Float32Array: how wet the land is per cell, 0 dry to 1 soaked (none if left out)
  mud,                           // optional Float32Array: how muddy, 0 to 1, where there's bare earth (none if left out)
}, ease);                        // seconds to ease in (0.6 by default; 0 at once: a level loading, a screenshot)
renderer.setGround(null, ease);  // bare everywhere, eased out as any map is (at once with 0)
```

- **Snow** is how deep it lies: about 0.2 a dusting, with the grass poking through; 0.3 covers flat open ground whole;
  0.5 covers the grass; 1 is deep, burying everything short. Every surface in a cell takes that cell's snow: the
  ground, a roof, a solar panel, a tree. The renderer takes away what shelters it, so the game needn't.
- **Frost** is how much rime there is, 0 to 1. The game says how much the night has brought; the renderer lets the
  shade keep it longer and the hollows hold more, so it melts as the sun reaches it. (Drawn from #14's frost pull
  request; until then it's carried but not drawn.)
- **Wet** is how wet the land is: it shows from the first drops, darkest by about 0.6. The game lowers it as the land
  dries, cell by cell: hollows and shade dry last, rises and open ground first.
- **Mud** is how muddy the bare earth in a cell is. The game marks it on the tiles with bare earth (a track, the yard, a
  ploughed field), as they wet; the renderer paints it only on the earth itself, so it can mark a whole tile. It's
  spread a cell when it's sent (a cell takes the muddiest round it), so a track's mud runs to its edge however the tiles
  fall, and the earth's own colour draws its edge. Mud with no wet is still mud (a track drying out last).
- **Muddy water** after a storm is the water's map's `mud` (docs/WATER.md, #18), not this one: the game sends both.
- **Updates.** Send a new map when the state changes, a few times a second at most. Each one eases in from what's drawn
  at that moment. A map on a new grid comes in at once. The values are stored to 1/255.
- **Cost.** Uploading the map is cheap: two small textures and a blend between them. While the ground is bare
  everywhere, the materials skip it all. Snow lying costs about 0.45 ms a frame at 1080p on the development machine's
  RX 570, a little over docs/PERFORMANCE.md's line for it (0.4); wet ground about 0.33 (#11); the details there. The land's low places are found once (see below), the first time
  there's any snow, and again only if the land is reshaped or what shelters it changes.

## How it's drawn

`src/renderer/ground.ts` (from #50):

- **`GroundField`** keeps the map as it was and as last sent, as two textures every material blends (`groundState`):
  snow in the red channel, frost in the green, wet in the blue and mud in the alpha (#11). Off the grid's edge the
  nearest cell carries on, so a one-cell map covers the whole land.
- **`HollowMap`** finds the land's low places once: the ground drawn from straight above into a depth map (its height at
  each texel, 17 cm over the farm's valley; over the ground's brush square, or a square round all the ground without
  one), then for each texel how far it lies below the ground round it, within 1.2 m and within 4 m, the deeper of the
  two (on a rise, how far above). With it: how far the ground faces up; how sheltered it is; and the pattern a thin
  snow breaks along (the hollows, the ground's unevenness fixed to the world, a finer drift), worked out once here
  rather than in every pixel. Done again only when ground is
  added or taken out, or the shelter map changes.

`src/renderer/snow.ts`:

- **`SNOW_GLSL`** runs in every material but the water. Each material works out its own colour as before, then how
  much of it the snow covers (`snowAt`, `snowCover`, `snowBuries`), and lays the snow's paint (`snowPaint`) over that
  much. What stands on the ground (the ground, grass, crops, stones, wood, trunks) reads its shelter from the hollows
  map, at its foot; roofs and crowns read the shelter map where they are. The bed under the water takes no snow.
- **`SnowPaint`** works out the snow's colours (its shade, half-tone and lit band, in the gaps between the clouds and
  under them) once a frame on the CPU, from the hour's light.

`src/renderer/wet.ts` (#11):

- **`WET_GLSL`** runs in every material but the water, before the snow (so snow on wet ground is still white). A
  material reads how wet and muddy it is there, less what shelters it (`wetAt`), then darkens its own colour before
  it's lit (`wetBase`: painted things, and the ground's earth muddy), or adds its sheen after (`wetInked`: inked things).
  The mud tells the earth from the grass by the ground's colour: its hue, from the earth's to the grass's as the season
  has turned it (winter's straw is nearer the earth's).

`src/app/ground.ts` is the demo's stand-in for the game: the snow a little deeper in some places than others, from the
demo's `Lying` slider or `?lying=0..1`; the land wetting in rain and drying after, hollows last and rises first, from the
`Wet` slider, `?wet=0..1` or the timeline's showers and storms; and the tracks and the yard (the scene's bare ground)
muddy as they wet.
