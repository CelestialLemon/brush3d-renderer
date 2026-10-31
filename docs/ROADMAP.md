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
     shadows on the land, reflections in the water and panels;
  4. #9 mist, fog, dust and heat haze;
  5. #10 the shelter map, so rain and snow stop at roofs, and a test shed (done 2026-10-31, #31 and #32: two depth maps
     from above, roofs and crowns (a crown keeps off 60%), drawn only when cover changes, `?shelter` to see it; a
     barn-red shed (the developer's pick of three) modelled by `tools/blender/shed.py`, the first model made in Blender);
  6. #18 dynamic water: a state the game drives;
  7. #11 rain and wet ground;
  8. #12 storms and lightning;
  9. #13 seasons;
  10. #14 snow, frost and ice;
  11. #19 the water's own look, chosen under every weather.
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

### Farm: known gaps

- The reference looks down more steeply than the game's camera (30°), so its frame shows more ground and flatter trees; ours
  can't match its framing, only its paint.
- The reference's big tree clump is darker and larger, one huge canopy; ours is several trees.
- Higher-contrast crowns make the dab edges' pixel-phase shimmer stronger: a one-pixel pan over the farm changes the picture
  by 0.18 (was 0.15), all of it foliage (see Motion and stability).
- Broadleaf crowns still read partly as repeated rounded clusters, and the water's reflections ripple more crisply than
  painted ones would.
- The land stops at a square edge; at the widest zoom, or turned, its corners can show. No people or machines: those are the
  game's.

## Later

### Water (first pass shipped 2026-10-29; reviewed, these are known weak)

- **Evening water is dull slate-blue.** At golden hour and sunset it should glow warm. It probably needs a sun-glare streak
  on the water, done together with the sky and clouds.
- **No change with the camera's tilt.** The water looks much the same at every angle (Fresnel is fixed by depth, not by the
  view). Fine from the aerial camera, flat otherwise.
- **The stream is brook-sized.** A wider river or a pond would show the reflections off better.
- **Half-res reflections smear up close.** Soft by design, but edges blur at high zoom.
- **Cloud reflections** wait on the cloud layer (#8).
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

- **Mist and fog (#9, part 1, in review).** The haze from `setWeather` lies on the land: thickest low down and thinning
  to its top, so a shallow mist pools along the water and in the hollows and a deep fog veils the land while roofs and
  crowns rise out of it; thin, it breaks into patches keyed to the world that drift with the wind (a gale thins it and
  drags it into streaks). An optional `base` lifts it off the ground (low cloud). Its colour is the game's in noon's
  light, lit by the hour. The game lifts a mist by lowering its amount and top (the demo's timeline has a morning fog
  lifting). Picked by the developer: ink lines fade halfway into fog, so the things the player can use still show,
  and the fog drains the paint's colour but keeps a trace of it. Dust and the heat wave come next.

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

- **The flying leaves are fast.** In a hurricane they cross several pixels a frame, which may read as confetti; slow them
  if it does. They also ignore the ground and the trees (they fly at a few metres, round the camera).
- **The game's half** isn't drawn yet: snapped branches, fallen trees, a field flattened by a storm. The renderer will take
  them as states (a fallen pose, how flat a field is) when the game has them.
- **Weather (#3)** drives `setWind` along with the dynamic water (#18); the game calls `setWind` and `setWeather` side by side. Rain is #11.

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
