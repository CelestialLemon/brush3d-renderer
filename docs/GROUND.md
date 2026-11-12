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

And a number for how much frost there is (#14, part 3):

- **A pale rime, not a cover**: the land whitens and its own colours read through, the greens and browns paled, its
  shade a softer blue than the snow's. Grass and crop tips whiten, built things' tops take a rime, bare branches and the
  crowns' tops a pale edge. None under a roof, less under a tree; lying snow covers it.
- **It keeps to the land.** As the game's frost rises, the hollows and the grass tips whiten first and the open rises
  last; as it falls, the same in reverse. Frost at 1 is a hard frost, everywhere in the open.
- **The sun takes it first where it has shone.** The renderer remembers how much sun each spot of the ground has had
  since dawn, so as the game lowers the frost through the morning, the ground the sun has reached clears first and
  the long shade of a building or a tree holds it, the shape of where the shadows have lain (soft-edged: shadows move).
  A cloud passing over doesn't bring frost back. At nightfall it's forgotten.
- **The game sets the pace**, by lowering the number: the renderer has no weather clock of its own. A cold snap is the
  game holding it high all day.

And a number for how wet each tile is, and one for how muddy:

- **Wet things go darker and richer**, as a stone darkens when it's splashed: the ground, grass, crops, leaves, stones
  and wood. They're still lit by the same light, so a wet field's shade is still the hour's teal or violet, only deeper.
- **What people build takes a glaze** as well: the sky mirrored faintly in it, its clouds drifting over, more where you
  see the surface at a low angle, as on a wet road.
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
- **Frost** is how hard the frost is, 0 to 1: about 0.2 only the hollows and the grass tips, 0.5 most of the open
  ground where the sun hasn't been, 1 everywhere in the open whatever the sun. The game says how much the night has
  brought and lowers it through the morning; the renderer clears first where the sun has shone since dawn, so it melts
  as the sun reaches it. It needs the game's clock (`setHour`), which the renderer counts the sun's hours by.
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
  much of it the snow covers (`groundAt`, `snowCover`, `snowBuries`), and lays the snow's paint (`snowPaint`) over that
  much. What stands on the ground (the ground, grass, crops, stones, wood, trunks) reads its shelter from the hollows
  map, at its foot; roofs and crowns read the shelter map where they are. The bed under the water takes no snow.
- **`SnowPaint`** works out the snow's colours (its shade, half-tone and lit band, in the gaps between the clouds and
  under them) once a frame on the CPU, from the hour's light.

`src/renderer/frost.ts` (#14):

- **`FROST_GLSL`** (part of `SNOW_GLSL`): `groundAt` reads the frost with the snow, less what shelters it. A material
  then works out how much of its surface the frost whitens (`frostCover`: how early that spot frosts, the hollows and
  tips first; the sun it's had; an edge that wanders a little) and lays the rime over it (`frostPaint`), before the snow.
- **`SunMemory`** keeps how much sun each spot has had since dawn: a 512² map over the hollows map's square (about
  34 cm a texel on the farm), for the ground and for what's highest there (a roof's top, a crown's). A few times a
  second while there's frost, after the shadow pass, it adds the sun now at each texel: the sun's height, the shadow
  map (six taps over 0.6 m), and the clouds' shade. It reads the game's clock: when the hour jumps (a still at 10, the
  hour dragged), the hours skipped are taken as if this sun had shone through them, what's in shade now counted at a
  third of the open's, since the shadows swung through them. Ground beyond the shadow map's window (it follows the
  view) is counted the same way, a third, since its shade there is unknown. Going back, or nightfall, starts afresh;
  night is told by the hour and the day's sunset, not the light's height, which at night is the moon's.

`src/renderer/wet.ts` (#11):

- **`WET_GLSL`** runs in every material but the water, before the snow (so snow on wet ground is still white). A
  material reads how wet and muddy it is there, less what shelters it (`wetAt`). A painted thing is lit as it is dry,
  then darkened and made richer (`wetFinish`); only the ground's mud changes its own colour before it's lit (`wetBase`).
  An inked thing adds its glaze to its lit colour (`wetInked`).
  The mud tells the earth from the grass by the ground's own colour, as the game sent it (`earthShares`, once per vertex
  as the ground is added): its hue, from the earth's to the grass's. Not the colour the season has turned it to: a dry
  winter turns a yellow-green to a straw the dirt's own colour.

`src/app/ground.ts` is the demo's stand-in for the game: the snow a little deeper in some places than others, from the
demo's `Lying` slider or `?lying=0..1`; the land wetting in rain and drying after, hollows last and rises first, from the
`Wet` slider, `?wet=0..1` or the timeline's showers and storms; and the tracks and the yard (the scene's bare ground)
muddy as they wet; the frost from the `Frost` slider, `?frost=0..1` or the timeline's `late-frost` (spring) and
`cold-snap` (winter) spells, which run the clock too.

## Falling snow and the blizzard (#14, part 2)

Not the ground's state: the snow in the air, from the weather's `snow` (0..1) and the wind (`setWind`). Here because it's
#14's, beside the snow it lays (which is the game's map alone: the falling snow adds nothing to it).

In plain words:

- **Soft, slow flakes drifting on the wind**, each swaying on its own beat, the gusts hurrying them on and holding them
  back as they pass (#36's wind map). In a breeze they drift at part of the wind's speed, so a light snow still falls.
- **None under a roof**, and fewer under a tree: each flake stops where its slanted path down meets a roof or (some of the
  time) a crown, as the rain's drops do (#10's shelter map). It fades where it lands: no puff, no rings on the water.
- **Painted a little brighter than the lying snow's lit band**, so it reads as white flecks over a white land as well as
  over the dark. Close up, a flake shows its form: its lower side in the snow's blue shade.
- **A blizzard is heavy snow in a strong wind**, not a value of its own (the developer's call, 2026-11-12): from about
  7 m/s to 20 the flakes turn sideways, fall faster, thicken and streak; the distance whites out (the middle of the view
  at most about 30%, the far land up to 85%) in sheets that sweep with the gusts, and the ink lines fade halfway into it.
- **Snow blows along the ground** in a gale, low white wisps over the lying snow only (the dust's streaks, #9).

How it's drawn (`src/renderer/snowfall.ts`): one instanced draw in the main view, see-through paint as the rain's (no
depth, no ink lines round it), and two functions in the post pass (`snowVeil` for the whiteout, `snowDrifting` for the
wisps). A flake belongs to a cell of the air (8 m) that the wind carries along, not to the spot it lands on as a raindrop
does: a blizzard's flakes travel far further sideways than they fall. The cells over the view are drawn; panning or
zooming moves no flake. The stops share the rain's tracing (`coverAlong`, `FALLING_GLSL` in rain.ts), up to 24 reads of
each map (and a few to refine the stop), only down the part of the path a flake has already fallen. `falling=0` leaves it all out, the whiteout and wisps too; `fallingShare` thins it.

The demo: the `Snow` slider, the `blizzard` preset (with a gale), and the `snowfall` and `blizzard` spells on the
timeline, which lay the snow as they go (`timelineLying`).
