# Performance

What a frame costs, what it may cost, and how to measure it. Set in #6 (2026-10-30), before the weather (#3) goes in; every
weather task checks itself against the budget here.

## Targets

Decided with the developer on 2026-10-30 (#6). The game is played by the developer, on three machines:

| Machine | GPU |
|---|---|
| The development PC | AMD RX 570 (Ryzen 5 1600) |
| A work laptop | Intel Arc 140T, integrated (a 2025 Core Ultra) |
| A MacBook Air | Apple M4, 16 GB |

- **At least 45 fps at 1080p on all three**, weather included. Below that isn't good enough.
- **The laptop is the floor**: the weakest of the three, so its 22 ms a frame is the budget. Measured there with `?profile`.
- **The RX 570 stands in for it day to day.** A millisecond here costs up to 1.9 on the laptop (see "On integrated
  graphics"), so the laptop's 22 ms is about **12 ms here**.
- **The MacBook Air** is still to measure. Its screen is high-DPI: at its full sharpness it draws about twice the pixels
  of 1080p, so there it should draw at about 1080p's pixel count (to set up once it's measured). Safari has no GPU
  timers; Chrome on the Mac may.
- If the floor needs it, the look may change, but only as the developer chooses: each change built behind a button on the
  PR's preview, to flip between in any scene, hour and weather.

## Measuring

```sh
node tools/profile.ts out                       # both scenes, on this machine's GPU (needs the dev server)
node tools/profile.ts out "scene=farm&samples=2" "scene=farm&shadowMap=2048"
CPU=3 node tools/profile.ts out                 # the page's CPU work 3x slower (Chrome's throttling, that browser only)
```

On any other machine, open the demo with `?profile` (on `main` or a PR's preview), press Run and then Copy: the same cases,
in that browser. Plug a laptop in and close other apps first.

Each case draws the frame at a set size, showing the same piece of the world at every size (the zoom scales with the
height, as on a high-DPI screen), for 90 frames with the clock running. It reports each pass's median GPU time (WebGL
timer queries, where the browser has them: Chromium on desktop, not Safari), the CPU's time for the whole frame, and the
uncapped frame (frames drawn back to back, which is what the GPU or CPU, whichever is slower, allows). Frames are drawn in
short bursts so the GPU never idles partway through a pass waiting for the page, which a timer would count as work. The
cases: calm and storm at 720p, 1080p, 1440p and 4K, then the stormy 1080p frame with each kind of mesh left out.

Sol checked the method on the RX 570 (#6): the timers' total agrees with the uncapped frame within a millisecond at every
size, and bursts of 1, 6 or 30 frames give the same numbers. They measure what drawing costs, through ANGLE on Vulkan;
they aren't a windowed browser's displayed fps.

## The frame today (2026-10-30)

RX 570, 1080p, the demo's default view, a storm; GPU ms (`node tools/profile.ts`):

| | shadow | under water | reflection | main | post | frame | fps |
|---|---:|---:|---:|---:|---:|---:|---:|
| farm | 3.4 | 1.6 | 5.6 | 26.5 | 0.3 | **37.4** | 27 |
| meadow | 0.3 | 1.7 | 1.4 | 10.6 | 0.2 | **14.1** | 68 |

- **Over budget, the farm three times over.** Calm and storm cost the same within a millisecond; the flying leaves are
  almost free.
- **The GPU paints pixels; the CPU is idle.** Under 1 ms of CPU a frame, and still under 1 ms with the CPU three times
  slower. Antialiasing off saves 2 ms; geometry is modest (60k leaf cards, 200k grass triangles on the farm).
- **What costs**, on the farm (the frame without each kind): the trees 18 ms (in all three views of the world: main,
  shadow, reflection), the ground 9 ms, the grass 6 ms, everything else 0–2 ms each.
- **Why** (Sol's experiments, #6): each pixel's paint is expensive (the brush dabs are worked out afresh in every pixel,
  every frame), and the trees' leaf cards overlap about 17 deep where they cover the screen, each one painted in full
  before the nearest hides it. The same leaves drawn near-first cost 30 ms a frame, far-first 49.

### On integrated graphics

The developer's laptop, through `?profile` on #21's preview (2026-10-30): an **Intel Arc 140T** (a 2025 Core Ultra laptop,
16 GB shared; Windows, Chrome 150, ANGLE on Direct3D 11), plugged in. Two runs of each scene agreed within about 3%. The
full tables are on #21.

| 1080p, storm, GPU ms | RX 570 | Arc 140T | ratio |
|---|---:|---:|---:|
| farm | 37.4 | 47.3 | ×1.26 |
| meadow | 14.1 | 26.4 | ×1.87 |
| the ground's paint (saved without it), farm / meadow | 9.1 / 8.0 | 13.6 / 15.4 | ×1.5 / ×1.9 |
| the trees (saved without them), farm | 18.2 | 15.9 | ×0.9 |

- **No single ratio.** The ground's brush recipe, a lot of arithmetic in every pixel, runs about twice as slowly on the
  laptop; the trees' layered leaf cards about as fast. So on integrated graphics the ground costs the most, and cuts to
  the per-pixel paint count for more than on the RX 570.
- **The CPU stays idle there too**: 0.1–0.2 ms a frame.
- **The rule:** a millisecond on the RX 570 costs ×1.3 to ×1.9 on the laptop, the most where the work is per-pixel paint.
  Plan with ×1.9, and check on the laptop.

## The budget

GPU ms a frame at 1080p: the laptop's (the floor), and the RX 570's at ×1.9 less (what to check against day to day). Weather
pieces that never run together (rain and snow) share a line; a storm, the heaviest weather, adds up to about 4 ms on the
laptop.

| | laptop | RX 570 |
|---|---:|---:|
| The scene (shadow, water, main view, post) | 17.0 | 9.0 |
| Cloud shadows (#8): a cloud texture, read where the sun's light is | 0.5 | 0.3 |
| Mist, fog, dust and haze (#9), in the post pass | 0.8 | 0.4 |
| The shelter map (#10): buildings from above, redrawn only when they change | 0.2 | 0.1 |
| Rain or snow falling (#11, #14) | 1.5 | 0.8 |
| Wet ground, puddles, frost, snow cover (#11, #13, #14), in the materials | 0.8 | 0.4 |
| Lightning (#12): a flash and a bolt | 0.3 | 0.15 |
| Spare | 1.1 | 0.55 |
| **The frame** | **22.2** (45 fps) | **11.7** |

Before the cuts, the scene was 47 ms on the laptop on the farm and 26 on the meadow (37 and 14 here); here it is now 23 and
13. The scene's 17 ms is the target for the cuts below.

## Quality settings

One look on every machine for now. These are the knobs a weather task builds in, so a machine that misses its 45 fps can
drop detail without changing the look:

| | full | reduced |
|---|---|---|
| Raindrops, snowflakes on screen | all | about a third |
| Shelter map size | 1024² | 512² |
| Shadow map | 4096² (farm) | 2048² |
| Weather seen in the reflection | rain rings, fog | fog only |

## The cuts

The farm's frame has to drop to the scene's 17 ms on the laptop (about 9 here) before the weather goes in. Sol's experiments
(#6, throwaway code on the RX 570, the farm at 1080p) measured these first; the ones marked done are in the renderer.

| Cut | Picture | Saves, in Sol's experiments |
|---|---|---:|
| **Done:** the main view's silhouettes first (a depth pre-pass), then paint only what shows (`prepass=0` turns it off) | the same | 9.5 |
| **Done:** the water's two passes only round the water on screen (a scissor padded by how far the water's lookups reach, `WATER_REACH`; `scissor=0` turns it off) | the same | 4.7 |
| A 2048² shadow map on the farm, not 4096² | to compare | 2.3 |
| **Done:** bake the ground's brush fields into a 2048² texture at load; the light stays live (`ground=live` turns it off) | the same to the eye | 2.7 |

The savings are from Sol's chain of experiments, each cut on top of the ones above it: 37.3 ms before, 18.0 with all four.
The renderer's own numbers for the done cuts are below; the frame with them is 23.1 ms, so the two still to do would
bring it to about 18.

The two done (#6, part 2), measured by `node tools/profile.ts` at 1080p in a storm, both off against both on: the farm
37.5 → **23.1 ms**, the meadow 14.1 → **13.1**. The silhouettes are drawn in the same render as the painting, so the
multisampled frame is resolved once, not twice (worth about 0.8 ms on each scene here, more on the laptop's shared
memory). On the meadow they save less (it has few trees, and its stream crosses most of the screen); drawing silhouettes for only the leaves and grass came out no better on
either scene. Frames with them on and off are byte-for-byte the same in both scenes, all four views, zoomed in and out,
at noon, dusk and dawn and in a storm.

On the laptop (`?profile` on #22's preview, 2026-10-30), at 1080p in a storm, GPU ms:

| | cuts off | cuts on | saved |
|---|---:|---:|---:|
| farm | 49.6 | **28.6** (35 fps) | 21.0 |
| meadow | 26.9 | **23.3** (42 fps) | 3.6 |

The cuts save more there than here (the farm's 14 ms here is 21 there): the stacked leaf cards cost more on the laptop
than this machine's numbers suggested. Both scenes are now within about 6 ms of the laptop's 22 ms, but the weather
still needs its 5 ms on top of that.

- **The pre-pass's saving may shrink.** With the painting made cheap it saves nothing here (10.5 ms with it, 10.4
  without), so check it again, on the laptop too, as the shaders change. It costs nothing to the laptop today.
- **9 ms here may not come from tidying alone.** From the 18 ms frame, removing all the leaves' and the grass's painting (a
  ceiling, not a cut) still leaves 10.5 ms. The rest may take changes that show (fewer leaf cards far off, a cheaper paint
  recipe, a softer ground up close); the developer chooses from side-by-side comparisons.
- **On the laptop the ground's paint costs the most**, now more than ever: with the cuts in, the frame without the
  paint (the ground, with the stones and wood) is 9.6 ms on the meadow (of 23.3) and 21.3 on the farm (of 28.6). So
  baking the ground's brush fields may save much more there than the 2.7 ms measured here.

### The ground's brush, baked (#6, part 3)

The ground's brush (its dabs, strokes, fine strokes and the colour's drift) depends only on where a point of the ground
is, so it's worked out once at load, into a texture laid over the ground's square, and read from there. The light,
shadows and the fine strokes' fading with zoom stay live. The ground is now its own kind (`ground`), so the profile shows
it apart from the stones and wood (`paint`).

**Decided** (the developer, on #23, 2026-10-30): **2048²**. Flipping between live and 2048 on the preview, no difference
showed; 4096² looked and ran the same, at four times the memory (64 MB against 16).

RX 570, 1080p, storm, GPU ms (`node tools/profile.ts`):

| | live | baked 4096² (64 MB) | baked 2048² (16 MB) | the frame without the ground |
|---|---:|---:|---:|---:|
| farm | 23.1 | 20.2 | 20.2 | 18.4 |
| meadow | 13.1 | **7.8** | 7.7 | 6.0 |

- **Most of the ground's cost goes.** On the meadow, where the ground fills the screen, the frame nearly halves.
- **Both sizes cost the same** to draw: the choice between them is the look and the memory. Baking took Sol's prototype about
  10 ms (2048) to 30 ms (4096) of GPU time at load here.
- **The picture is nearly the same**: the mean difference is under 0.2 of 255, and at most about one pixel in 2,000 differs by
  more than 8 (single texels on the edges of brush marks), in both scenes, every view, zoomed in and out. 2048 is a little
  further off than 4096, but neither shows at the closest zoom. With `ground=live` the frame is today's but for a few
  pixels (the shader's arithmetic in a different order).
- **The ground must be a heightfield** (one surface over each point), which both scenes' are; stones and wood stay live.

On the laptop (`?profile` on #23's preview, two runs each, 1080p storm): the farm 28.7 → **26.6 ms** (37 fps). There the
frame without the ground at all is 22.5 ms, so the ground has little more to give on the farm; the trees (about 6.5 ms)
and the grass (about 5) are what's left, with the shadow pass's 3.4.


### Painting over the silhouettes (#6, part 4)

Sol's second round of experiments (#6) found that the silhouettes weren't yet saving all they could. The painting still
wrote depth, which the silhouettes had already written, and on most GPUs a pass that writes depth from a shader that can
discard pixels (the leaves') must paint a pixel before it knows whether it's hidden. So now:

- **The main view only reads depth** after its silhouettes, and the **leaves paint only at their silhouette's exact
  depth** (`equal=0` turns that part off: nearer-or-equal instead, the same picture, slower).
- **The reflection has silhouettes too** (leaving out what's under the water, as its painting does), and paints at
  nearer-or-equal depth (equal was slower there on the laptop, below).
- **The sun's shadow pass writes no colour**: only its depth is read.

Frames are byte-for-byte main's, with `equal` on and off, in 11 views (both scenes, all four views, zoomed in and out,
dawn, noon, dusk, night, a storm). RX 570, 1080p, storm, GPU ms:

| | shadow | under | reflect | main | post | frame |
|---|---:|---:|---:|---:|---:|---:|
| farm, before | 3.43 | 0.27 | 2.66 | 13.52 | 0.26 | 20.1 |
| farm, after | 3.29 | 0.27 | 1.72 | 8.20 | 0.26 | **13.7** |
| farm, after, `equal=0` | 3.30 | 0.27 | 1.73 | 9.77 | 0.26 | 15.3 |
| meadow, after (before: 7.7) | 0.18 | 0.38 | 0.90 | 4.65 | 0.19 | **6.3** |

On the laptop (`?profile` on #26's preview, 1080p storm, GPU ms), the farm went from 26.6 to **about 20 ms** (scaled from
this machine, about 18 was expected), and the leaves look the same with `equal` on and off:

| | shadow | under | reflect | main | post | frame |
|---|---:|---:|---:|---:|---:|---:|
| equal depth in the reflection and the leaves | 2.64 | 0.43 | 3.09 | 14.59 | 0.65 | 21.4 |
| `equal=0`: neither | 2.66 | 0.40 | 1.94 | 14.86 | 0.48 | 20.4 |

Intel's GPU paints the reflection slower at equal depth (here it was a little faster), so the reflection now paints at
nearer-or-equal, and only the main view's leaves at equal: about 20.1 ms there, 0.1 more here.

### The grass's and the crops' brush, baked by place (#6, part 5)

The grass and the crops worked their brush out in every pixel every frame, as the ground did. On the flat it depends only
on where it is (x and z), the brush's scale and its angle, and the brush only ever blends two of seven fixed angles (0°,
30°, ... 180°). So at load, for each brush scale the grass and the crops use, seven layers are baked over the ground's
square, one per angle: the dabs, the strokes, the fine strokes and the colour's drift. A blade or a crop's top reads the
two layers either side of its own angle and blends them as the live brush does (Sol's design, #6). The light, the
shadows and the wind stay live.

- **By place, not by mesh**, unlike the ground's: in the game a field is built anywhere, its crop changes stage every few
  seconds and goes back to bare soil at harvest, so a bake of the crop's shape would be stale at once. This one holds for
  any field, at any stage, anywhere on the map, and needs re-baking only for a new brush scale. A crop's sides (its edges,
  whatever their height) are worked out live.
- **1024² a layer**: 28 MB a brush scale; the farm uses three (two for the grass, one for the wheat), 84 MB.
- **The picture is nearly the same:** in 11 views the mean difference is under 0.08 of 255, and at most about one pixel
  in 700 differs by more than 8. Those sit on the edges of light and shade bands (most on the wheat in the panels'
  shadows), which a small change in the brush moves by a pixel. `grass=live` and `crop=live` put back the live brush;
  both together give main's frame exactly.

RX 570, 1080p, storm, GPU ms:

| | shadow | under | reflect | main | post | frame |
|---|---:|---:|---:|---:|---:|---:|
| farm, before (live) | 3.30 | 0.27 | 1.74 | 8.21 | 0.26 | 13.8 |
| farm, the wheat baked | 3.30 | 0.27 | 1.70 | 7.52 | 0.26 | 13.1 |
| farm, the grass baked | 3.30 | 0.27 | 1.41 | 7.15 | 0.26 | 12.4 |
| farm, both | 3.29 | 0.27 | 1.37 | 6.46 | 0.26 | **11.7** |
| meadow, both (before: 6.5) | 0.18 | 0.38 | 0.68 | 3.44 | 0.19 | **4.9** |

**Tried and dropped:**
- shadows of still things kept between frames: with a 3-to-10-minute day the sun moves a texel every frame or two, so
  it saved nothing and its held shadows stepped;
- octagonal leaf cards: slower;
- tighter rectangular cards: change edge pixels, deferred;
- leaving kinds out of the reflection: visible, and the reflection's silhouettes save more.

**Visible, if still needed:** a 2048² shadow map about 2.3 ms on the laptop, 2× MSAA about 1.5, a quarter-size
reflection about 1.2.
- Each cut is measured on the laptop too, with `?profile` on its PR's preview.
