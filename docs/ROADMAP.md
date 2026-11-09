# Roadmap

Where the renderer stands and what is left, so nothing noticed in review is lost. Newest work first.

## Now

- **Weather, epic #3** (planned 2026-10-30): season, weather and hour change the whole picture. The decisions are in #3; in
  short, the game owns the weather's state and logic and the renderer only draws it. The order:
  1. #6 performance: measure the frame and set the weather's budget (done 2026-10-30: the farm 17.5 ms on the laptop,
     leaving the weather about 5);
  2. #7 the handoff from the game (`setWeather`), a scripted weather timeline in the demo, and the overcast look (done
     2026-10-31, #29 and #30: see Weather);
  3. #8 clouds: one cloud recipe the game shares (cloud shadows will cut solar panels' power, CelestialLemon/Soil-n-Silo#198),
     shadows on the land (#34), reflections in the water and panels (#37), golden-hour light under a cloud deck (#49)
     (done 2026-11-03: see Weather);
  4. #9 mist, fog, dust and heat haze (done 2026-10-31, #33 and #35: see Weather);
  5. #10 the shelter map, so rain and snow stop at roofs, and a test shed (done 2026-10-31, #31 and #32: two depth maps
     from above, roofs and crowns (a crown keeps off 60%), drawn only when cover changes, `?shelter` to see it; a
     barn-red shed (the developer's pick of three) modelled by `tools/blender/shed.py`, the first model made in Blender);
  6. #36 wind: gusts and lulls as fronts sweeping the land, one gust field for the grass, trees, water and dust (with
     depth, a rolling head), and for the game to query. It grew out of #9: dust's gusts didn't read (done 2026-11-03,
     #41 to #44: see Wind);
  7. #18 dynamic water: a state the game drives (done 2026-11-03, #45 and #48: see Water);
  8. #11 rain and wet ground (the falling rain done 2026-11-09, #53: see Weather; wet ground is open);
  9. #12 storms and lightning (the lightning in #55: see Weather; the storm look is open);
  10. #13 seasons (the trees' look in a thread of its own; parts 1 and 2, the hour following the game's sun and the season's look for the rest, merged 2026-11-07 as #51 and #52);
  11. #14 snow, frost and ice;
  12. #19 the water's own look, chosen under every weather.
- **The demo on GitHub Pages** (#15, shipped 2026-10-30): https://celestiallemon.github.io/brush3d-renderer/main/, and a preview
  of every open pull request from this repo at `.../pr-<number>/`, removed when it closes.
- **Wind, issue #2** (2026-10-30, shipped in #5): `renderer.setWind({ speed, direction, gust })`, eased, from calm to a
  hurricane (0, 5, 17, 25, 35 m/s), with a slider and direction in the demo and a `tools/video.ts` move per strength plus
  `wind-ramp`.
  - Trees lean downwind and rock about the lean (big trees slowly, shrubs quickly), stronger in a gust. Each crown moves as
    one piece, never turning or bending (that reorders its dabs), and the trunk and limbs bend up into it. The movement is
    drawn only across the view, which puts it on the same pixels without changing depth, so neighbouring trees never swap
    their overlapping edges; it's lit and casts its shadow in full 3D. Paint is keyed to where things rest, so it rides
    with them.
  - Leaves flutter (across the view only, as before), and from a gale up turn over in waves to show pale undersides.
  - Gusts roll over the grass and through the wheat, which shows them as travelling bands of light; the water chops, with
    whitecaps in a storm. From a gale up leaves fly through the air (the renderer's own, round the camera).
  - `tools/pops.ts` finds patches that change colour all at once between frames 4 ms apart. Breeze and gale: none in either
    scene. Storm and hurricane: none bar the flying leaves, which are moving, not popping. A one-pixel pan is unchanged from
    before (farm 0.290, meadow 0.144).
- **Water, step 1 of issue #1** (2026-10-29, shipped in #4): we don't copy the reference's near-white stream, which read
  as glass. The see-through water of the first pass is back (the bed, stones and depth show, the colour deepens to
  blue-green, a little sky where it's deep), grass and reeds are reflected again, so the banks' green fringe is back in the
  water, and the glints on the ripples' crests are kept but softer (a little over half their old weight, and no longer
  brighter than white), so they sit on the clear water. The reflection stays premultiplied and read through its small blur,
  which by eye doesn't soften the old look and keeps the reflected grass steadier. A one-pixel pan over the meadow's
  stream: 0.15 (0.17 without the blur; it was 0.17 before the reference pass, 0.34 with all that sky); over the farm's
  stream, 0.33 (was 0.51). Next, within the weather epic (#3): water as a state the game drives (depth, flow, turbidity),
  #18, after the shelter map (#10) and before rain (#11); our own look on it, #19, after snow (#14).
- **The farm scene** (`?scene=farm`, the default; first pass 2026-10-29): the *Dear Alice* aerial (0:37) rebuilt with more
  assets and detail. Wheat in banded rows with a solar array, a fenced track, curved orchard rows with crates of apples, a dark
  clump of big trees over a picnic table, a stream with a plank bridge and thickets, a fork in the track by a dry-stone wall,
  and a nursery in rows.
- **Closing the gap with the reference** (second pass 2026-10-29), awaiting review:
  - Trees are painted as masses: big dark strokes inside, the skin in mid-sized ones, small loose ones at the edge. A stroke's
    colour follows where it sits on the crown (lighter and yellower turning up, darker inside), so neighbours differ only a
    little and the crown reads as a few masses of light and shade. Crowns' shade goes deeper and cooler than the ground's.
    Cypresses are one ragged flame of upright strokes, deep green rather than teal.
  - The stream is 60% wider. (Its water went mostly sky, like the reference's, then back to our own see-through water: see
    above.)
  - The solar panels are bigger and tilted 22°, less than the camera looks down, facing along the map's axis: the glass shows
    from every view. It reflects one sky across the array, with drifting light, long glints and the sun's sheen.
  - More props: big apple bins, empty ones stacked, baskets, a wheelbarrow, beehives, round hay bales, barrels by the table.

- **The farm valley** (third pass 2026-11-03), awaiting review: the farm grown from a 68 m square into a 176 m valley, a
  bigger and more varied test scene for renderer features. The *Dear Alice* core stays in the middle, and round it:
  - A farmstead to the right: farmhouse, barn, hen house with its run, well, glasshouse in a paled kitchen garden of raised
    beds, a hay wagon, under old trees.
  - A hedged patchwork above: sunflowers, a ploughed field, barley, a hay meadow being cut with its bales, a back track.
  - A windmill on a knoll up the stream to the left, with outcrops, dry-stone walls and lone pasture trees.
  - Below: the stream opens into a pond (willows, reeds, a jetty and a rowing boat) and leaves by an outflow; lavender
    with cypresses and hives, cabbages, an old orchard of standard fruit trees, a scarecrow.
  - Woods along the edges, more hedges and drifts of wild flowers.
  - The models (farmhouse, barn, hen house, well, glasshouse, windmill, hay wagon, rowing boat, scarecrow) were made in
    Blender by Sol (`tools/blender/`); the layout is `src/scenes/farm.ts`'s header.
  - For the bigger land: the big meshes are cut into 24 m tiles, each drawn only when a pass can see it
    (`src/renderer/tiles.ts`), and the sun's shadow covers only the ground on screen (`shadowFollow`).

### Farm: known gaps

- The reference looks down more steeply than the game's camera (30°), so its frame shows more ground and flatter trees; ours
  can't match its framing, only its paint.
- The reference's big tree clump is darker and larger, one huge canopy; ours is several trees.
- Higher-contrast crowns make the dab edges' pixel-phase shimmer stronger: a one-pixel pan over the farm changes the picture
  by 0.18 (was 0.15), all of it foliage (see Motion and stability).
- Broadleaf crowns still read partly as repeated rounded clusters, and the water's reflections ripple more crisply than
  painted ones would.
- The land stops at a square edge, with the sky beyond; the woods hide some of it, but panned to an edge it shows. No people or
  machines: those are the game's.
- The valley costs more than the old farm: 13.9 ms at 1080p on the RX 570 in the default view (11.9 before), 23 at the widest
  zoom, and 3 to 5 ms of CPU (0.6 before: more draw calls, and 691 trees' springs). Most of the GPU's extra is trees
  throwing shadows. Not tuned yet, by choice (see docs/PERFORMANCE.md, The farm valley).
- Sunflowers read as dots from far off.

## Later

### Water (first pass shipped 2026-10-29; reviewed, these are known weak)

- **Evening water is dull slate-blue.** At golden hour and sunset it should glow warm. Under part cover the clouds in it
  now catch the evening's warm light (#37); a clear evening's water is still slate-blue, and may want a sun-glare streak.
- **No change with the camera's tilt.** The water looks much the same at every angle (Fresnel is fixed by depth, not by the
  view). Fine from the aerial camera, flat otherwise.
- **The stream is brook-sized.** A wider river or a pond would show the reflections off better. (#47's valley has a pond.)
- **Dynamic water (#18, done 2026-11-03, #45 and #48):** the game sends the water as a map (`setWater`: the surface,
  flow and mud per tile, `docs/WATER.md`), eased in over 0.6 s, so a flood creeps over the land and drains. Reflections
  work at any height from one pass, shifted on screen. The developer's picks (2026-11-03): fast water gets "streaks"
  (long light bands along the flow), mud is "brown" (ochre, opaque), and things standing in water get a "foam line"
  with a faint wet band above it; floating things (the boat) get none. Left out: foam on fast water, milky mud, the
  plain wet band. Known: laying out the farm's 250 × 250 map costs 9 to 20 ms per send (a dropped frame; move it to a
  worker if the game sends big maps often), and the demo's boat doesn't float up in a flood (the game's to move).
- **Half-res reflections smear up close.** Soft by design, but edges blur at high zoom.
- **Cloud reflections** (#8, #37): the water and the solar glass mirror the clouds overhead, drifting with them. The
  developer's picks (2026-11-01): "lit" (each cloud bright on its sunward side, its thick middle a cooler grey, warm in
  the evening) at "clear" strength. The other looks (plain, painted) and strengths (faint, bold) were left out.
- **Order** (decided 2026-10-30): #1's later steps are now their own issues in the weather epic. The dynamic water, #18, comes
  in the middle, before rain (#11); the water's own look, #19, comes last, so it's chosen under every sky.
- **Grass and reeds are reflected again** (2026-10-29), read through the reflection's small blur. What the water still adds
  to a one-pixel pan over the meadow's stream (0.15 against 0.10 with it hidden) is mostly its half-size passes: the
  reflected grass is about two fifths of it and the bed's pass about as much; the ripples and glints next to nothing. A
  full-size, 4x multisampled reflection with no blur measured steadier still and sharper (0.13 on the meadow; 0.17 against
  0.24 over the farm's stream at `zoom=80`): worth trying once the extra passes are profiled (see Performance). All of these
  are `AB=2 node tools/motion.ts` on the RX 570, `scene=meadow&zoom=32&t=3` and `x=0&z=24&zoom=40&t=3` (or `zoom=80`), the
  one-pixel pan's full-frame mean; the shares come from leaving one thing out at a time (grass from the reflection; a
  constant bed), so they overlap rather than add up.

### Weather

Planned 2026-10-30 as epic #3, with its tasks #6 to #14, #18 and #19 (see Now).

- **The handoff and the overcast look (#7, done 2026-10-31 in #29 and #30).** `renderer.setWeather` takes the game's
  weather (cloud, rain, snow, heat, haze); the cover is drawn exactly as given (#8's cloud shadows read it) and the light
  that follows from it eases over about 1.5 s. Presets, URL params, sliders and a scripted timeline (`src/app/timeline.ts`)
  stand in for the game; the tools take the weather, with `falling=0` to leave out what's in the air. Under cloud the light
  comes from the whole sky (tops lit, sides half, undersides shade), the sun's shadows fade to a soft darkening under
  things, and the tones close up with the colour kept (`src/renderer/overcast.ts`). The developer chose Slate, of three
  candidates, for the shadow it keeps at full cover (depth), with a little colour taken out so a grey day isn't more
  colourful than a sunny morning. Left: a small brightness swing at part cover (dawn and sunset are a little brighter at
  half to three-quarter cover than either end); judge it again with #8's cloud shadows, which change what part cover looks
  like.

- **Clouds (#8, done 2026-11-03 in #34, #37 and #49).** One cloud recipe (`src/renderer/clouds.ts`, `CLOUD_SHAPE`) that
  the game shares for its solar panels, drawn exactly as the game sends its cover and drift. Shadows on the land: shape
  "ab" (cumulus turning into big soft masses as the sky closes), "mid" shade, "mid" drift (0.85 m/s in a breeze); the gaps
  between clouds are a clear day's sun until the sky nearly closes. Reflections in the water and the solar glass: "lit"
  at "clear" strength, warm in the evening (see Water). Golden-hour light under a cloud deck: at dawn and dusk under a
  heavy cover (60% to full) the low sun gets in under the deck and lights the land gold under a grey sky, the look
  "rake" (#49, the developer's pick of glow, rake and blaze): about half the sun's strength, long soft shadows, sunward
  sides and crowns' edges catching the gold, the water still mirroring the grey deck (`src/renderer/golden.ts`). It's a
  rare sight, so the game asks for it now and then (`setWeather`'s `sunUnder`, 0 if left out; `?sunUnder=1` in the
  demo), and it's light only: the cloud field and the panels' power don't change. `tools/video.ts sunset` and `sunrise`
  (QUERY="cloud=1&sunUnder=1") show the sun sinking and rising under the deck.

- **Mist and fog (#9, part 1, merged in #33).** The haze from `setWeather` lies on the land: thickest low down and thinning
  to its top, so a shallow mist pools along the water and in the hollows and a deep fog veils the land while roofs and
  crowns rise out of it; thin, it breaks into patches keyed to the world that drift with the wind (a gale thins it and
  drags it into streaks). An optional `base` lifts it off the ground (low cloud). Its colour is the game's in noon's
  light, lit by the hour. The game lifts a mist by lowering its amount and top (the demo's timeline has a morning fog
  lifting). Picked by the developer: ink lines fade halfway into fog, so the things the player can use still show,
  and the fog drains the paint's colour but keeps a trace of it.
- **Dust and the heat wave (#9, part 2, merged in #35).** A haze can be dust (`kind: 'dust'`, the developer's call): the wind
  carries it, in clouds and fine streaks blowing along the ground, rather than thinning it, the gusts sweep it in in
  waves, and the light through it turns orange. The heat wave (`heat`) gives a hot yellow light and a warm cream air over
  the land, by day only ('gold', the developer's pick), with a shimmer keyed to the land that grows with the heat (3.5
  pixels at full heat, 'clear'). The dust's gusts ('strong') are a stopgap: they're hard to see in a thick storm, and the
  wind's gusts are to be rebuilt as fronts sweeping the land (#36). The demo's timeline has a dust storm blowing through.
  The haze's patches no longer swing when the wind turns (#36): a new set is laid along the new wind and fades in.

- **Falling rain (#11, part 1, #53; wet ground is open).** Painted strokes, not a field of particles (`src/renderer/rain.ts`):
  long, fine, crisp strokes, a fine streaked veil over the distance (in the post pass), crowns of ticks where drops land
  and thin crisp rings on the water, flood water too ('B', the developer's pick of three). How hard it rains sets how
  many strokes, how fast they fall and the veil; the wind and its gusts slant them. Each drop belongs to an 8 m patch of
  the world, so none jumps as the camera moves, and about as many show on screen at any zoom. Drops stop at roofs and
  (some of the time) crowns, traced along their slanted path through the shelter map, which gained a third map, the land
  itself. `settings.fallingShare` is the quality knob (fewer strokes, the same look); `falling=0` leaves it all out.
  Snow (#14) can reuse the patches, the stops and the count. Costs in `docs/PERFORMANCE.md`.

- **Lightning (#12, #55; the storm look is open).** The game says where and when: `renderer.strike({ x, z })` and
  `renderer.flicker()` (distant lightning, the developer's call: the game calls each one, #12). The renderer draws a bolt, a
  flash of the whole picture, and a glow where it landed (`src/renderer/lightning.ts`). The flash is laid over the finished
  picture, the last thing done to a pixel, so it can't lift one by more than its limit whatever the hour or the exposure; no
  pass or shader is added when one starts (no hitch), and a frame with no lightning is byte for byte what it was.
  `lightning.setting` is the player's: `full`, `gentle` (one soft swell) or `off` (the picture doesn't light up; the bolt and
  glow show, dim). Safety is the default, not a setting (Sol's calibration, #12): at most two flashes in any second, 0.6 s
  apart, and two in any ten seconds, on a real-seconds clock a sped-up game can't outrun; a strike held back still shows its
  bolt and glow, and nothing is queued. `tools/flash.ts` measures it on the finished frames, by the published tests (WCAG 2.2
  2.3.1); it isn't a certified test, and the game's own frames would want one before release. `FLASH_LIMIT` is the one line to
  loosen if a heavy storm feels short of flashes.
- **Seasons (#13, all but the trees done 2026-11-07, #51 and #52; the trees' look is open).** The developer's scope (2026-11-03): the trees' seasonal look (turning, bare limbs,
  blossom, the bushes and hedges with them, fallen and flying leaves) is a separate thread; this one does the rest. The
  decisions are on #13. Part 1: `renderer.setSeason({ season, character, sunrise, sunset })`, once per level, with the
  game's sunrise and sunset (its table's by default: spring 6–19, summer 5–21, autumn 7–18, winter 8–16), and
  `renderer.setHour(hour)` each frame. The hour's looks follow the game's sun (`src/renderer/season.ts`): its clock is
  mapped onto the looks' own day (sun up 6 to 20), sunrise to sunrise, the middle of the game's day to noon, sunset to
  sunset, the twilights keeping their hours. The sun is lowered to the season's noon height (summer 58°, spring and autumn
  45°, winter 25°, the developer's pick of 18°, 25° and 32°), least near the horizon so dawn and golden hour
  keep their light, and a winter sun's path is shorter. With no season set the frames are main's. Part 2, the season's
  look for everything but the trees (`src/renderer/seasonLook.ts`): the greens of the ground, the grass and
  reeds, and the leaves of flowers and garden plants take the season's colour, turned once per level (a hue shift within
  a green window, so earths, crops and flowers keep theirs; `MeshOptions.seasonal`); the season's light is a base coat on
  the hour's look; the game's character words shift the grass (a dry summer golden, a wet one lusher, a hard winter
  drabber). The developer's picks (2026-11-07): the look near the game's turf with a gentle light (not the bolder painted
  one), winter's grass a dormant straw-olive (not bleached pale, which read as frost). The demo's scenes stand in for the game's crops by
  season (young, ripe, stubble, ploughed; the wildflowers thinning out; the lavender in flower only in summer).

### Motion and stability

First round done 2026-10-29: `tools/motion.ts` measures crawl (sub-pixel pans, frames lined back up), `tools/video.ts`
records moves to judge by eye. The wheat's crawl went with the painted mass; blades turn to the camera; dab edges and the
panel cells are antialiased; the brush blends between planes instead of switching. Wind moves leaves and grass only across
the view, never nearer or farther, so overlapping dabs no longer swap and swatches no longer pop (trees' lean and sway too,
since #2). Left, most visible first (Sol's ranking):

- **Thin vegetation coverage.** Grass blades and the wheat's fringe are still the largest share of sub-pixel crawl: 4x
  multisampling on long thin edges. Try coverage-aware tapering, or easing tufts into painted masses as the camera pulls back.
- **Foliage edges on odd pixels.** Dab edges change on a one-pixel pan but not on a two-pixel one, and the change goes with
  alpha-to-coverage (likely its dither pattern; turning it off makes sub-pixel crawl worse). Compare sample counts and other coverage schemes at matched edge softness.
- **Thin inked things.** Fence rails, posts, crates and panel silhouettes, and the post pass's thresholded outline. Test in
  turns and zooms before the scenes get busier.
- **Water and reflections in motion.** Measured on the streams (see Water): the half-size passes are most of it. Reflected
  canopy edges and turns and zooms over the water are still to test.
- **Haze and vignette on long pans.** Both follow the camera: haze thickens toward the top of the screen as a real aerial
  camera's would, and that is kept on purpose; report their slow change apart from crawl.
- Measure better: several starting phases and directions, views and hours, local crops and percentiles (a mean hides sparse
  pops), and wind-only videos apart from camera moves.

### Wind (first pass shipped with #2)

- **Gusts (#36, done 2026-11-03):** one gust field for everything, starting from the research in the issue. The groundwork is the living wind the
  game owns (`src/wind`, `docs/WIND.md`): simulated over the world, going round sheds and through hedges, with
  `?windMap` to see it. The renderer draws it (the grass, the trees' crowns, the wheat, the water and the dust each read
  the wind where they are, so a hedge's calm shows in the grass behind it), and the haze's patches hold still when the
  wind turns. Trees have weight: each is a spring that leans into a gust, overshoots and rocks to a stop, each kind its
  own, and crowns bend with their trunks (a cypress like a whip). The gusts come as a seeded sequence, each gust its own
  (strength, length, build-up, the odd sudden slap, one in six a quiet one), swelling and easing over gusty and quiet
  minutes; the look is the developer's pick, "gentler" (#41, 2026-11-02): shallow lulls, slow fronts, rare slaps. Dust is
  lifted by the gusts off bare, dry ground, only in a dust storm (#42), the look "billows" (#43): heavy puffs up to 7 m,
  each gust's front a rolling wall, clearing in 5 s. In a light wind a gust passing over the water leaves a cat's paw,
  a patch of fine glitter, the look "glitter" (#44).
- **Hedge density is the game's choice, when a mechanic needs it** (#36, the developer, 2026-11-01). A dense hedge (drag
  8/s, the default) gives deep calm close behind; a medium one (Hagen's measured windbreaks) is less calm at 1 H but
  calmer over 4–10 H. Nothing in the game is hurt by strong wind yet; decide when something is (crops flattened, things
  blown over), with the numbers in #36.
- **The flying leaves are fast.** In a hurricane they cross several pixels a frame, which may read as confetti; slow them
  if it does. They also ignore the ground and the trees (they fly at a few metres, round the camera).
- **The game's half** isn't drawn yet: snapped branches, fallen trees, a field flattened by a storm. The renderer will take
  them as states (a fallen pose, how flat a field is) when the game has them.
- **Weather (#3)** drives the wind's goal (`src/wind`) along with the dynamic water (#18); the game calls `setWind` and `setWeather` side by side. Rain is #11.

### Looks

- The night is moonlight blue (#7, the developer's pick, 2026-10-31): cooler light and haze and the whole picture nudged
  from yellow-green toward blue. It used to lean green.

### Performance

Targets (decided 2026-10-30, #6): at least 45 fps at 1080p, weather included, on the developer's three machines (the RX 570
PC, a laptop with an Intel Arc 140T, a MacBook Air M4). The laptop is the floor: 22 ms a frame there, about 12 ms on the
RX 570. `docs/PERFORMANCE.md` has the budget.

- Measured 2026-10-30 (#6, `docs/PERFORMANCE.md`): the farm takes 37 ms a frame at 1080p on the RX 570, the meadow 14,
  nearly all of it the GPU painting pixels (the trees above all, then the ground and the grass); on the laptop 47 and 26.
  Cuts that keep the picture reach about 18 ms here; the rest is the developer's choice from side-by-side comparisons.
  Done (#6, part 2): the main view's silhouettes drawn first, and the water's passes only round the water: the farm 23 ms
  here, the meadow 13 (on the laptop 29 and 23, from 50 and 27), the picture unchanged.
  Done (#6, part 3): the ground's brush baked into a 2048² texture at load (the developer's pick; the same to the eye):
  the farm 20 ms here and 27 on the laptop, the meadow 8 here.
  Done (#6, part 4): the painting only reads the silhouettes' depth (the leaves at equal depth), and the reflection has
  silhouettes too: the farm 14 ms here and about 20 on the laptop (from 26.6), the meadow 6 here, byte-for-byte the same
  picture.
  Done (#6, part 5): the grass's and the crops' brush baked by place at load, seven angles a brush scale (a crop's
  growing, harvest and sowing need no new bake): the farm 11.7 ms here, 17.5 on the laptop (from 20.3) and 15.0 on the MacBook (from 19.0), the meadow
  4.9 here.
  Done (#6, part 6): at most 1080p's pixel count drawn, scaled up to a high-DPI screen (the MacBook's), so it costs what
  it does at 1080p (the developer's pick over 1440p's and the screen's own).
  `node tools/profile.ts` measures here, `?profile` on any machine.
