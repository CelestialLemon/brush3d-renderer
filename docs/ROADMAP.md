# Roadmap

Where the renderer stands and what is left, so nothing noticed in review is lost. Newest work first.

## Now

- **The farm scene** (`?scene=farm`, the default; first pass 2026-10-29): the *Dear Alice* aerial (0:37) rebuilt with more
  assets and detail. Wheat in banded rows with a solar array, a fenced track, curved orchard rows with crates of apples, a dark
  clump of big trees over a picnic table, a stream with a plank bridge and thickets, a fork in the track by a dry-stone wall,
  and a nursery in rows.
- **Closing the gap with the reference** (second pass 2026-10-29), awaiting review:
  - Trees are painted as masses: big dark strokes inside, the skin in mid-sized ones, small loose ones at the edge. A stroke's
    colour follows where it sits on the crown (lighter and yellower turning up, darker inside), so neighbours differ only a
    little and the crown reads as a few masses of light and shade. Crowns' shade goes deeper and cooler than the ground's.
    Cypresses are one ragged flame of upright strokes, deep green rather than teal.
  - The stream is 60% wider. Its water is mostly sky, with pale cloud-light drifting in it, and glints of sun on the ripples'
    crests. With this much sky in it, the half-size reflection's thin grass flickered as the camera moved (a one-pixel pan
    over the meadow's stream: 0.34, from 0.17), so grass is no longer reflected and the reflection is read through a small
    blur: 0.12 now.
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
- **Cloud reflections** wait on a real cloud layer (see Weather).
- **Grass and reeds aren't reflected** (since 2026-10-29): in the half-size reflection their thin blades flickered as the
  camera moved. The banks' reflected green fringe went with them; bringing reeds back needs a steadier way to draw them there.

### Weather

Held until the renderer looks right; the developer wants to get it right rather than early. A cloud layer (shadows on the land,
reflections in the water), fog, rain, dust and frost, each changing the whole picture.

### Motion and stability

First round done 2026-10-29: `tools/motion.ts` measures crawl (sub-pixel pans, frames lined back up), `tools/video.ts`
records moves to judge by eye. The wheat's crawl went with the painted mass; blades turn to the camera; dab edges and the
panel cells are antialiased; the brush blends between planes instead of switching. Wind moves leaves and grass only across
the view, never nearer or farther, so overlapping dabs no longer swap and swatches no longer pop. Left, most visible first (Sol's ranking):

- **Thin vegetation coverage.** Grass blades and the wheat's fringe are still the largest share of sub-pixel crawl: 4x
  multisampling on long thin edges. Try coverage-aware tapering, or easing tufts into painted masses as the camera pulls back.
- **Foliage edges on odd pixels.** Dab edges change on a one-pixel pan but not on a two-pixel one, and the change goes with
  alpha-to-coverage (likely its dither pattern; turning it off makes sub-pixel crawl worse). Compare sample counts and other coverage schemes at matched edge softness.
- **Thin inked things.** Fence rails, posts, crates and panel silhouettes, and the post pass's thresholded outline. Test in
  turns and zooms before the scenes get busier.
- **Water and reflections in motion.** Untested with the stream in frame: half-size passes, reflected canopy edges.
- **Haze and vignette on long pans.** Both follow the camera: haze thickens toward the top of the screen as a real aerial
  camera's would, and that is kept on purpose; report their slow change apart from crawl.
- Measure better: several starting phases and directions, views and hours, local crops and percentiles (a mean hides sparse
  pops), and wind-only videos apart from camera moves.

### Looks

- Night still leans green.

### Performance

- Profile: the frame now draws the scene four times (shadow, under-water, reflection, main). Measure on the RX 570 and cull
  the extra passes to what the water can see.
