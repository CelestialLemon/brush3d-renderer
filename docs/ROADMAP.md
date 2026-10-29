# Roadmap

Where the renderer stands and what is left, so nothing noticed in review is lost. Newest work first.

## Now

- **The farm scene** (`?scene=farm`, the default; first pass 2026-10-29): the *Dear Alice* aerial (0:37) rebuilt with more
  assets and detail. Wheat in banded rows with a solar array, a fenced track, curved orchard rows with crates of apples, a dark
  clump of big trees over a picnic table, a stream with a plank bridge and thickets, a fork in the track by a dry-stone wall,
  and a nursery in rows. Awaiting review.

### Farm: known gaps

- From views 1 and 3 the solar panels are seen from behind, nearly edge-on: thin lines on posts. True to the geometry, but they
  lose their read; a visible underframe would help.
- The props are few and small (one table, three crates). No people or machines: those are the game's.
- The land stops at a square edge; at the widest zoom, or turned, its corners can show.

## Later

### Water (first pass shipped 2026-10-29; reviewed, these are known weak)

- **Evening water is dull slate-blue.** At golden hour and sunset it should glow warm. It probably needs a sun-glare streak
  on the water, done together with the sky and clouds.
- **No change with the camera's tilt.** The water looks much the same at every angle (Fresnel is fixed by depth, not by the
  view). Fine from the aerial camera, flat otherwise.
- **The stream is brook-sized.** A wider river or a pond would show the reflections off better.
- **Half-res reflections smear up close.** Soft by design, but edges blur at high zoom.
- **Cloud reflections** wait on a real cloud layer (see Weather).

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
