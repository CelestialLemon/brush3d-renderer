# The ground's state: snow and frost (#14)

The game owns the ground's state: how deep the snow lies on the land and how much frost there is, and the rules that
change them (snow falling builds it up, the sun and a thaw take it away, a clear cold night brings frost). The renderer
draws whatever state it's given, as a map over the land in the water's format (docs/WATER.md), sent again whenever it
changes. Ice on the river isn't here: it goes in the water's map (#18), since the water owns the river.

Wet ground and mud (#11) were tried first, in #50, and their look wasn't kept. The map's plumbing was sound, so #14 brought
it back without the wet look; the map keeps two free slots for wet and mud when #11 is tried again.

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

## The contract

```ts
renderer.setGround({
  nx, nz, cell, x0, z0,          // the grid: the water's, the wind's and the dust's; its corner at (x0, z0), x fastest
  snow,                          // optional Float32Array: how deep the snow lies per cell, 0 to 1 (none if left out)
  frost,                         // optional Float32Array: how much frost per cell, 0 to 1 (#14's frost; none if left out)
}, ease);                        // seconds to ease in (0.6 by default; 0 at once: a level loading, a screenshot)
renderer.setGround(null, ease);  // bare everywhere, eased out as any map is (at once with 0)
```

- **Snow** is how deep it lies: about 0.2 a dusting, with the grass poking through; 0.3 covers flat open ground whole;
  0.5 covers the grass; 1 is deep, burying everything short. Every surface in a cell takes that cell's snow: the
  ground, a roof, a solar panel, a tree. The renderer takes away what shelters it, so the game needn't.
- **Frost** is how much rime there is, 0 to 1. The game says how much the night has brought; the renderer lets the
  shade keep it longer and the hollows hold more, so it melts as the sun reaches it. (Drawn from #14's frost pull
  request; until then it's carried but not drawn.)
- **Updates.** Send a new map when the state changes, a few times a second at most. Each one eases in from what's drawn
  at that moment. A map on a new grid comes in at once. The values are stored to 1/255.
- **Cost.** Uploading the map is cheap: two small textures and a blend between them. While the ground is bare
  everywhere, the materials skip it all. Snow lying costs about 0.45 ms a frame at 1080p on the development machine's
  RX 570, a little over docs/PERFORMANCE.md's line for it (0.4); the details there. The land's low places are found once (see below), the first time
  there's any snow, and again only if the land is reshaped or what shelters it changes.

## How it's drawn

`src/renderer/ground.ts` (from #50):

- **`GroundField`** keeps the map as it was and as last sent, as two textures every material blends (`groundState`):
  snow in the red channel, frost in the green; blue and alpha are kept for wet and mud (#11). Off the grid's edge the
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

`src/app/ground.ts` is the demo's stand-in for the game: the snow a little deeper in some places than others, from the
demo's `Lying` slider or `?lying=0..1`.
