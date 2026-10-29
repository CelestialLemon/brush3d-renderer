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

### Motion and stability (from Sol's review, 2026-10-29)

- Re-measure the wheat crawl now that wheat is a painted mass (it was the worst motion artefact: MAE 6.37 over 40% of pixels).
- Anchor the haze to the world: it is measured from the camera's target, so it breathes slightly on long pans.
- `brushPlane`'s 0.6 threshold is a latent seam where the brush flips projection.
- Screen-anchored grain explains the low-level frame-to-frame differences; decide whether to keep it.
- Record pan videos to judge motion by eye.

### Looks

- Night still leans green.

### Performance

- Profile: the frame now draws the scene four times (shadow, under-water, reflection, main). Measure on the RX 570 and cull
  the extra passes to what the water can see.
