# The living wind (#36)

The game owns the wind. It simulates the air near the ground over the whole world (`src/wind`), steps it on its own
clock, reads it for gameplay (turbines, and whatever else the wind comes to push), and saves it with the game. The
renderer draws only what it's given: the same snapshots. There's no three.js in `src/wind`.

## In plain words

Think of the open sky as a conveyor belt of gusts: a pattern of stronger and weaker wind laid along the wind's
direction and carried with it (the *recipe*). Under it lies a sheet of air a couple of metres deep, a cell a metre
square. The sky reaches down into that sheet and drags it along, hardest in a gust. After that the sheet's air lives
its own life. It flows round a shed, is slowed and thinned through a hedge or an orchard row, and is held back by the
ground. Where two gusts meet it piles up and spills sideways.

Behind every obstacle a calm streak trails off downwind. The air there remembers it was sheltered (the *shelter memory*,
`k`, 1 in open air), and while it remembers, the sky can't reach down into it. The memory comes back over about 40
metres of travel, so the calm behind a 2.5 m hedge reaches out to about 25 hedge heights. In open air the memory is
exactly 1 and plays no part.

Higher up, the wind is a rule rather than a second simulated layer. From 0.75 m it blends towards the sky's wind,
which is 1.5 times faster by 8 m and a little more beyond, so a rotor on a tall mast catches more. Where the shelter
memory says the air is sheltered, it keeps more of the calm.

## The contract

```ts
import { WindWorker } from './wind/client';
const wind = new WindWorker(new Worker(new URL('./wind/worker.ts', import.meta.url), { type: 'module' }),
  { nx: 200, nz: 200, cell: 1, x0: -100, z0: -100 }, obstacles, { speed: 6, direction: 0.5, gustiness: 0.5, rhythm: 0.5 });
wind.setGoal({ speed, direction, gustiness, rhythm });  // what the game wants; it eases there over a few seconds
wind.advance(gameSeconds);                               // each frame, by game time (none while paused)
wind.at(x, z, height);                                   // m/s along x and z, between the last two ticks
wind.onTick((snap) => { /* every tick, in order: the whole field, for the renderer or for gameplay */ });
const save = await wind.save();                          // as of every tick due so far
wind.restore(save);                                      // carries on from it, bit for bit
```

- **Goal.** `speed` is the average at ground level, m/s; gusts go above it and lulls below, and they average out to it.
  `direction` is where the wind blows towards, radians from +x towards +z. `gustiness` runs from 0 (truly steady) to
  1. `rhythm` runs from 0 (rare, strong gusts) to 1 (frequent, mild ones), with the same average either way; it starts
  in the middle (the developer's call). Speeds above `MAX_SPEED` (60 m/s) are taken as 60.
- **Obstacles** are shapes in world metres: a circle, a strip (from a to b, so wide) or a turned box. Each is either
  `solid: true` with a height (the wind goes round it; one lower than 2 m is blown over and slows the air instead) or
  has a `drag` per second (`DRAG.hedge` 8, `DRAG.crown` 4.4, `DRAG.railFence` 0.4). The scenes list theirs as
  `scene.wind`.
- **Ticks.** The wind steps every `TICK` (0.1 s) of game time, whatever the frame rate (60 frames of 1/60 s are 10
  ticks). A slow machine's worker catches up a few ticks at a time, and every tick still reaches `onTick`, in order.
  Between ticks, `at` and the renderer blend the last two ticks' snapshots, always consecutive ones.
- **Order.** Goals, saves and restores are queued against the ticks: a goal set once the clock has reached tick n
  applies from tick n + 1, however far behind the worker is, so the same calls replay the same wind.
- **Snapshots** hold the grid, the tick, the ground air's velocity (`u`, `v`), the shelter memory (`k`) and the free air
  at ground scale (`fu`, `fv`), cell by cell with x fastest. `windAt(snap, x, z, height)` reads one in the game's own
  code, with no worker, for example in a test.
- **Saves.** `WindSim.save()` holds the eased state, the gusts' travel and the air (about 960 KB over 200 m at 1 m).
  `restore` carries on bit for bit as if it had never stopped. Through the worker: `WindWorker.save()` and `restore()`
  (a restore drops the ticks not yet stepped).
- **Determinism.** The same obstacles, goals and ticks give the same wind, bit for bit. The engine (`sim.c`, WebAssembly,
  float32, no fused multiply-adds) is bit-identical on every machine. The few sines and cosines in `sim.ts` that turn
  the wind are exact within one JavaScript engine (V8: Chrome, Electron, Node) but aren't specified to the last bit
  across engines.

## How it's built

`src/wind/sim.c` is the engine, compiled to WebAssembly with SIMD by `npm run build:wind` (clang compiled to
WebAssembly, fetched once into `node_modules/.cache`). The result is checked in as `src/wind/engine.ts`, so only a change
to `sim.c` needs a rebuild. `sim.ts` holds the recipe, the easing and the turns, the obstacles' rasterising and the
queries. `worker.ts` runs it off the main thread, and `client.ts` is the game's side of the worker.

Per tick:

1. **Ease** speed, gustiness and rhythm towards the goal, 1 − e^(−0.1/1.5) of the gap a tick, and turn the direction the
   short way at 0.7 times that rate.
2. **Recipe.** The gusts are a pattern laid along a heading that travels with the wind. A turn of more than 25° from
   the gusts' heading lays a new set along the new heading. That set fades in over 6 s while the old one fades out, so
   nothing swings round the map.
3. **Engine.** The air is an isothermal compressible sheet (pressure speed 7 m/s; pile-ups relax back over 0.5 s),
   moved with limited second-order fluxes (Rusanov, MC limiter, two-stage Runge–Kutta) in at least 5 substeps. The
   sky's reach is K = 0.15 + 2·e, where e is how hard the recipe gusts at that cell, times the shelter memory k. It pulls
   the air towards U = 1.5·f, implicitly, against the ground's friction and any drag. The memory k is carried with the
   air, eaten by drag (and at 20/s next to a wall), and grows back at |u|/40 per second.

**Storms are a breeze sped up.** Everything is calibrated at 6 m/s. Above it, the engine runs at a *pace* of speed / 6:
the pressure speed and every rate (friction, drag, reach, relaxation, eating) go up by it. So a 35 m/s storm has the same
shapes and the same average as a breeze, only faster. Real drag grows with the wind too. Without this, at 35 m/s the
wind outran its own pile-ups fivefold and blew up, and with only the pressure scaled the average drifted 7–25% over the
goal. The faster wind needs more substeps. No substep may carry anything more than 0.7 of a cell across x and y together
(about 0.85 is where a diagonal storm blew up). The engine plans them from the fastest air and the inflow at the tick's
start, and plans the rest of the tick again after each substep, since a gust can speed the air up within a tick. All of
it is worked out from the wind itself, so the count is the same on every replay. A 60 m/s diagonal storm with full rare
gusts takes up to 65 substeps (128 at most; air faster than that allows would be held to it, as a safety bound). At or
below 6 m/s the physics is as calibrated; a breeze with strong gusts may take a sixth or seventh substep where its
peaks ask for one, and is otherwise the same to the bit.

## Calibration (Sol's rounds 4–6, checked by `npm run test:wind`)

| What | Value |
|---|---|
| Open-air average, 6 m/s (gustiness 0.5–1, rhythm 0, 0.5, 1) | within 1% of the goal over whole repeats of the gusts |
| … at 2, 14 and 35 m/s | within 1% |
| Gust contrast (spread of the ground's speed against the recipe's) | 1.08–1.11 |
| Steady (gustiness 0) | the goal exactly, everywhere |
| Shelter behind a single dense hedge, 2.5 m, steady 6 m/s | 0.34, 0.41, 0.61, 0.89 of the open wind at 1, 4, 10, 25 H |
| A tick, 200 m at 1 m, on the developer's machine | about 12 ms in a breeze, 60 ms in a hurricane with full gusts |

The ground's friction (`friction(rhythm, gustiness)` in `sim.ts`) is Sol's offline fit of the recipe that keeps the
average on the goal. A new recipe needs a new fit, and the look PR's gust shapes will need one.

Reading the shelter numbers: real windbreaks measured in the field (Hagen) are about 0.54 at 1 H, 0.26 at 4 H and 0.95
at 25 H for a medium-dense hedge. Ours is calmer right behind the hedge and comes back a little sooner. That's the dense
hedge (drag 8/s), and hedge density is a gameplay choice deferred until a mechanic needs it (see the ROADMAP).

## Open questions

- **The height rule is approximate.** Sol proposed an optional carried "height" memory if crowns and rotors need more.
- **The shelter memory doesn't recover in dead calm** (it grows back per metre travelled). Sol's restart test was fine.
- **The recipe's pattern scale changes with the rhythm** (rare gusts are 108 m apart, frequent ones 36 m). It's a
  placeholder until the look PR picks the gust shapes, the lull depth and the fronts' speed.
- **Peaks in a hurricane with full gusts reach about 95 m/s at the ground** (2.7 times the average, as in a breeze).
  Gameplay that breaks things in the wind should decide what it reads.

## How the renderer draws it

The game gives the renderer, every frame, the wind client's last two snapshots and how far the frame is between them:
`renderer.setWind(wind.prev, wind.cur, wind.alpha)`. It draws exactly that and never eases it. A scene with no game wind
(the profile's cases, a model viewer) gives `steadyWind(speed, direction)` for both.

- **The map.** Each tick's snapshot is uploaded as a texture of half floats, a texel a cell: the ground air (`u`, `v`) and
  the air at a crown's height (6 m, by the height rule, divided by the rule's open-air factor so it reads in the ground's
  terms). Two textures, the earlier tick and the later; the shaders blend them by `alpha`. Only the new tick is uploaded
  as the wind moves on (about 2.5 ms of the main thread a tick, 200 m at 1 m). Outside the map the edge cells carry on.
- **Who reads what.** Grass bends by the ground air where each blade stands, which way it blows there too, so the calm
  behind a hedge shows as grass standing up. A tree's crown leans and rocks by the air at its crown. The wheat, the water's
  chop and the dust's waves read how hard it blows against the average (`windGust`: 0.5 at the average, 1 at twice it).
  The renderer's own motion, which nothing in the game reads, stays its own: leaves fluttering, the flying leaves, a crown
  still rocking after a gust.
- **Steady is steady.** With gustiness 0 the map is the goal everywhere (but in shelter), so nothing gusts.
- **The haze's patches** (fog and dust) are laid along the wind and drift with it. When the wind turns more than 25° from
  them, or strengthens or slackens enough to stretch or shrink them by 30%, a new set is laid along the wind as it is and fades
  in over 6 s while the old fades out, so a turn never swings the patches round the map.
- **The demo** runs the wind on 10 s before showing it, so the gusts have filled the world and each hedge's calm has formed.
  In shot mode (`tools/`) each `__draw` steps the wind to the frame's time and resolves once it's drawn; a time before
  the last starts again from a save and replays, and a wind asked for at once (not eased) starts a new wind already
  blowing as asked.

## Seeing it

`?windMap` in the demo (or the *Wind map* button) shows the whole world's ground wind from above, turned as the camera
is: how hard it blows (still deep blue, the average teal, twice it pale yellow), arrows every 10 m, the obstacles (walls
white, porous things green) and the camera's target. Its button switches to the shelter memory. `?rhythm=0..1` and the
*gusts* and *rhythm* sliders set the goal along with the wind's speed and direction.
