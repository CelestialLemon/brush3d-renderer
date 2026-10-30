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

Today the scene is 47 ms on the laptop on the farm and 26 on the meadow (37 and 14 here). The scene's 17 ms is the target
for the cuts below.

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

Today's farm frame has to drop to the scene's 17 ms on the laptop (about 9 here) before the weather goes in. Sol's experiments (#6, throwaway code on the
RX 570, the farm at 1080p) measured these:

| Cut | Picture | Saves | The frame |
|---|---|---:|---:|
| Today | | | 37.3 |
| Draw the main view's silhouettes first (a depth pre-pass), then paint only what shows | the same | 9.5 | |
| Draw the water's two passes only round the water on screen (a scissor; the pad worked out from how far the ripples and the reflection's blur reach) | the same | 4.7 | |
| A 2048² shadow map on the farm, not 4096² | to compare | 2.3 | 20.7 |
| Bake the ground's brush fields into a texture at load (4096², 64 MB); the light stays live | nearly the same | 2.7 | **18.0** |

- **The pre-pass's saving won't last.** With the painting made cheap it saves nothing (10.5 ms with it, 10.4 without), so
  check it again as the shaders change, and on the laptop, where repeating the vertex work may cost more.
- **9 ms here may not come from tidying alone.** From the 18 ms frame, removing all the leaves' and the grass's painting (a
  ceiling, not a cut) still leaves 10.5 ms. The rest may take changes that show (fewer leaf cards far off, a cheaper paint
  recipe, a softer ground up close); the developer chooses from side-by-side comparisons.
- **On the laptop the ground's paint costs the most** (see "On integrated graphics"), so the baked ground may save more
  there than the 2.7 ms measured here.
- **Still to try:** a texture for the grass's own brush fields (they aren't the ground's), the leaves' colour work that is
  exact to move out of the pixel shader, tighter leaf cards, and culling whole clumps of trees off screen.
- Each cut is measured on the laptop too, with `?profile` on its PR's preview.
