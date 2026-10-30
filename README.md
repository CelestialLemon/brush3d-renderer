# brush3d-renderer

A painterly 3D renderer for three.js games: **painted worlds, inked things**. An experiment for
[Soil n Silo](https://github.com/CelestialLemon/Soil-n-Silo), a solarpunk farming game, to find out whether it can look like
the reference below instead of pixel art. Its pixel-art sibling is
[pixel3d-renderer](https://github.com/CelestialLemon/pixel3d-renderer).

The look is taken from [*Dear Alice*](https://www.youtube.com/watch?v=z-Ng5ZvrDm4) (The Line, 2021; the aerial shot of the farm at
0:37 is almost exactly the game's camera): the land is painted (no outlines, brushy, colour drifting across every
surface, teal and violet shadows, gold rim light, blue distance), and the things people made are inked (clean coloured lines,
crisp cel bands). In a builder that split does real work: everything the player placed or that moves stands out from the land.
`docs/DIRECTION.md` has the rules.

**Try it:** [the demo as on `main`](https://celestiallemon.github.io/brush3d-renderer/main/). Every open pull request has its own
preview at `.../pr-<number>/`, linked in a comment on it and removed when it closes (`.github/workflows/pages.yml`).

```sh
npm install
npm run dev          # http://127.0.0.1:5190: drag to pan, wheel to zoom, Q/E to turn, 1-5 for the hour, L for lines
npm run typecheck
npm run shot -- out "hour=12" "hour=17.5&view=2"     # headless frames as PNGs (needs the dev server)
node tools/motion.ts out "zoom=40"                     # how steady the picture is under sub-pixel pans
node tools/video.ts out pan turn wind                  # moves recorded as mp4 (needs ffmpeg)
node tools/video.ts out wind-ramp                      # the wind rising from calm to a hurricane and dying down again
node tools/video.ts out weather-ramp timeline          # clear to overcast and back; the demo's scripted weather
node tools/pops.ts out "wind=storm"                    # swatch pops in the wind: patches that change colour all at once
node tools/profile.ts out                              # what a frame costs, pass by pass, on the GPU (docs/PERFORMANCE.md)
```

The demo's URL takes `scene` (`farm`, the default, or `meadow`), `view` (0-3), `zoom` (screen px per metre, 16-96), `hour`, `x`/`z` (the camera's target), `t` (freeze
the clock), `lines=0`, `shadows=0`, `still` (hide the buttons), and the wind: `wind` (m/s, or `calm`, `breeze`,
`gale`, `storm`, `hurricane`), `windDir` (degrees it blows towards) and `gust` (0-1). The weather: `weather` (a preset:
`clear`, `scattered`, `overcast`, `soft-rain`, `storm`, `fog`, `dust`, `heat-wave`, `snow`, `blizzard`), then any value
over it, `cloud`, `rain`, `snow`, `heat`, `haze` (0-1), `hazeColor` (hex) and `hazeTop` (metres); `timeline` plays a
scripted spell standing in for the game (`timeline=3` at 3× its speed), and `falling=0` leaves out the things in the air
(rain, snow, dust, the wind's leaves) for the stability tools. `samples` (MSAA) and `shadowMap`
(texels) try quality settings, `prepass=0`, `scissor=0` and `equal=0` turn off speed-ups (for comparing), `ground=live`,
`grass=live` and `crop=live` work that kind's brush out in every pixel rather than reading it from the textures baked
at load, and `profile` times
the frame on whatever machine opens it.

The game sets the wind with `renderer.setWind({ speed, direction, gust })`; the drawn wind eases towards it. Trees lean and
rock as whole crowns, leaves flutter, gusts roll over the grass and through the wheat, the water chops, and from a gale up
leaves show their pale undersides and blow through the air. `src/renderer/wind.ts` has the scale and the curves.

The game sets the weather with `renderer.setWeather({ cloud, rain, snow, heat, haze: { amount, color, top } })`, the same
over the whole valley, beside `setWind`. The cloud cover is drawn exactly as given (gameplay reads it: cloud shadows cut
solar panels' power); the looks ease over about a second and a half, hiding the steps between the game's updates, and
`setWeather(weather, true)` skips the ease (a level loading). `src/renderer/weather.ts` has the presets.

The renderer is only the presentation layer: the game owns the state and the logic of the wind, the water and the weather, and
anything they cause, and the renderer draws what it's given. Weather is an epic, #3.

## How it draws

- **One G-buffer pass** at the screen's resolution, 4× MSAA: colour, plus view normal, view depth and an ink flag. Its
  silhouettes are drawn first, depth only, so each pixel is painted once, by the surface that shows.
- **Painted materials** (ground, grass, foliage, water, crops) shade in OKLab: three bands (shade, half-tone, lit) whose edges
  are broken by brush dabs and strokes keyed to world positions, so the paint stays put as the camera moves. Shade leans to the
  hour's hue (teal at noon, violet at dusk), the colour drifts in hue and value across a surface, and foliage is clumps of leafy
  dabs whose normals are the crown's.
- **Inked materials** shade in crisp cel bands; the post pass draws their lines in a darker shade of their own colour, only on
  their side of an edge, thinner as the camera zooms out.
- **Post**: lines, distance haze, grade, sRGB.

## Layout

- `src/renderer/`: the renderer (`renderer.ts`), its materials and GLSL, the camera, the time-of-day looks.
- `src/scenes/`: demo scenes, built in TypeScript: `farm.ts` (the *Dear Alice* aerial, rebuilt), `meadow.ts` (the first slice),
  and `kit.ts`, the pieces both are made of (trees, stones, grass, reeds, lines on the map, water).
- `src/app/`: the demo viewer, and the scripted weather standing in for the game (`timeline.ts`).
- `tools/`: headless capture (`shot.ts`), motion measurement (`motion.ts`), pops in the wind (`pops.ts`), videos
  (`video.ts`) and the frame's cost (`profile.ts`), on `browser.ts`.
- `reference/`: how to pull frames from the reference film (kept out of git: they're copyrighted).
