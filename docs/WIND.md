# The living wind (#36)

The game owns the wind. It simulates the air near the ground over the whole world (`src/wind`), steps it on its own
clock, reads it for gameplay (turbines, and whatever else the wind comes to push), and saves it with the game. The
renderer draws only what it's given: the same snapshots. There's no three.js in `src/wind`.

## In plain words

Think of the open sky as a conveyor belt of gusts: a pattern of stronger and weaker wind laid along the wind's
direction and carried with it (the *recipe*). No two gusts are alike: each has its own strength, length, build-up and
dying away, the gaps between them vary, and the whole swells and eases over gusty and quiet minutes. It's a random
sequence fixed by a seed, so the same seed gives the same gusts. Under it lies a sheet of air a couple of metres deep, a cell a metre
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
  { nx: 200, nz: 200, cell: 1, x0: -100, z0: -100 }, obstacles, { speed: 6, direction: 0.5, gustiness: 0.5, rhythm: 0.5 },
  { seed: 1 });                                         // which gusts: the same seed, the same gusts
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
  in the middle (the developer's call). It sets the usual time between gusts, the same at any speed: 24, 19 and 13 s
  apart at 0, 0.5 and 1, each gap 0.4 to 1.6 of that. Speeds above `MAX_SPEED` (60 m/s) are taken as 60.
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
- **Saves.** `WindSim.save()` holds the eased state, the seed, where each set of gusts is in its sequence, and the air
  (about 960 KB over 200 m at 1 m). The gusty and quiet spells run on the wind's own clock (its tick), so they need
  nothing more.
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
2. **Recipe.** The gusts are a seeded sequence laid along a heading that travels with the wind (below). A turn of more
   than 25° from the gusts' heading, or a wind asked to blow 20% faster or slower than the set was laid for, or its
   rhythm moved by more than 0.1, lays a new set for the wind asked for. That set fades in over 6 s while the old one
   fades out, so nothing swings round the map or stretches. The new set carries on the same sequence from where the old
   one is at the world's centre.
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

### The gusts (#36, Sol's research and the developer's choices)

The look is the developer's pick of three (2026-11-02), "gentler", for the game's serene vibe: shallow lulls, slow
fronts, rare slaps. (The others had deeper lulls, or quicker fronts and more slaps; #41 has them side by side.)

The world along the wind is cut into *intervals*, each holding one gust and the lull around it. An interval is
usually T = (108 − 48·rhythm) / 4.5 seconds long, its edges each moved up to 0.3 of that either way, so gaps run 0.4 to 1.6 of T. On the ground it's
0.75 × speed × T metres long (at least 2 m/s worth; the fronts travel at 0.75 of the wind), since the gusts travel with the wind. Each interval's gust,
from a hash of the seed and its number:

- **Strength**: a peak between 0.55 and 1 of the way from the average to the ceiling H = 1.95 − 0.4·rhythm; one
  interval in six is a quiet one, its gust barely there, so the gusts don't come like clockwork.
- **Lull**: down to the floor B = 0.38 + 0.15·rhythm, now and then shallower.
- **Length**: what balances the peak against the lull over the interval, so a long interval holds a long push and a
  long lull, both at full strength. Balanced over every interval, the recipe's mean is exactly 1 whatever the draw
  (Sol's finding: balancing only on average let one stretch of gusts run several per cent off another).
- **Build-up**: 1 to 2 s, or, for one gust in 25, a 0.3 s slap. Dying away: 1 to 2.5 s.
- **Tilt**: some hit hardest at first and ease off, some build through, some hold.

Along each front the strength varies (0.65 to 1) and the front bends a few metres, as before.

**Spells**: on the wind's clock, blocks of 120 to 240 s (seeded), each a gusty half and a quiet half. The gusts' strength
goes from 0.4 (quiet) to 1 (gusty), and the average from 0.97 to 1.03 of the goal, balanced over each block.

Gusts are measured in seconds, not metres, so a storm's gusts build as slowly as a breeze's (in metres, every storm gust
slapped in under half a second). The ground air takes its own time to pick a gust up, though: in a breeze a 1–2 s
build reads as 2–3 s on the ground, and a 0.3 s slap is hardly quicker than an ordinary gust there; above about 15 m/s
the slaps stand out (Sol's round 2).

## Calibration (Sol's rounds 4–6, and the gusts' fit, checked by `npm run test:wind`)

| What | Value |
|---|---|
| Open-air average (gustiness 0.5–1, rhythm 0–1, 2 to 60 m/s, at the fit's knots and between) | within 0.2% of the goal over half an hour, with a seed the fit never saw |
| Steady (gustiness 0) | the goal exactly, everywhere |
| Shelter behind a single dense hedge, 2.5 m, steady 6 m/s | 0.34, 0.41, 0.61, 0.89 of the open wind at 1, 4, 10, 25 H |
| A tick, 200 m at 1 m, on the developer's machine | about 12 ms in a breeze, 50 ms in a hurricane with full gusts |

The ground's friction (`friction(speed, rhythm, gustiness)` in `sim.ts`) is an offline fit of the recipe that keeps
the average on the goal: at 2, 3.5, 6, 10, 17 and 35 m/s, rhythm 0, 0.5 and 1 and gustiness 0.5, 0.75 and 1, each knot
over half an hour of open field, between them by the speed's logarithm, and holding the 35 m/s fit beyond. It depends
on speed because the gusts are timed in seconds, not metres: a gust is a different shape to the engine at each speed.
A new recipe needs a new fit.

Reading the shelter numbers: real windbreaks measured in the field (Hagen) are about 0.54 at 1 H, 0.26 at 4 H and 0.95
at 25 H for a medium-dense hedge. Ours is calmer right behind the hedge and comes back a little sooner. That's the dense
hedge (drag 8/s), and hedge density is a gameplay choice deferred until a mechanic needs it (see the ROADMAP).

## Open questions

- **The height rule is approximate.** Sol proposed an optional carried "height" memory if crowns and rotors need more.
- **The shelter memory doesn't recover in dead calm** (it grows back per metre travelled). Sol's restart test was fine.
- **Slaps in a breeze.** The ground air smooths a 0.3 s slap to about 2 s below about 10 m/s. Making it sudden there
  would mean letting the sky reach down faster as a gust arrives, which touches the average and the shelter.
- **Peaks at full gusts reach about twice the average at the ground** (2.3 times with rare gusts, 1.7 with frequent
  ones; about 65 m/s in a 35 m/s hurricane, 104 in a 60 m/s storm).
  Gameplay that breaks things in the wind should decide what it reads.

## How the renderer draws it

The game gives the renderer, every frame, the wind client's last two snapshots and how far the frame is between them:
`renderer.setWind(wind.prev, wind.cur, wind.alpha)`. It draws exactly that and never eases it. A scene with no game wind
(the profile's cases, a model viewer) gives `steadyWind(speed, direction)` for both.

- **The map.** Each tick's snapshot is uploaded as a texture of half floats, a texel a cell: the ground air (`u`, `v`).
  Two textures, the earlier tick and the later; the shaders blend them by `alpha`. Only the new tick is uploaded
  as the wind moves on (about 0.6 ms of the main thread a tick, 200 m at 1 m). Outside the map the edge cells carry on.
- **Who reads what.** Grass bends by the ground air where each blade stands, which way it blows there too, so the calm
  behind a hedge shows as grass standing up. Trees are read on the main thread (below). The wheat, the water's
  chop and the dust's waves read how hard it blows against the average (`windGust`: 0.5 at the average, 1 at twice it).
  The renderer's own motion, which nothing in the game reads, stays its own: leaves fluttering, the flying leaves, and how a
  tree answers the wind.
- **Trees have weight** (`src/renderer/trees.ts`). Each tree is a mass on a spring, pushed by the game's wind at its crown
  (6 m up, by the height rule, in the ground's terms so the calibrated lean holds: 1.3% of its height in a breeze, 12% in
  a gale, 30% in a hurricane). It leans into a gust with a lag, overshoots a little and rocks to a stop after the gust
  passes. Each kind has its own spring (how often it rocks, how fast the rocking dies, more so as the wind rises through
  its leaves); a bigger tree of a kind rocks more slowly. The whole tree bends from its foot, the top furthest, its crown
  with it as far as its kind's `TREE_BEND` says: a cypress all the way, like a whip; an orchard bush hardly. Bending is
  drawn across the view only, so a crown's strokes never swap over (`tools/pops.ts`: none in a gale). The steady rocking
  of before is gone. The small quick swirls the wind's 1 m grid can't carry are added as shoves into each spring, as strong
  as the game's gustiness: at gustiness 0 a tree leans and holds still. The springs are the developer's pick, 'stiff' (#40):
  trees settle within a few swings. About 0.5 ms of the main thread a frame for the farm's 174 trees.
- **Fresh dust** (`src/renderer/dust.ts`). In a dust storm, and only then, the gusts lift dust off bare, dry ground in
  puffs. The rule is the developer's (2026-11-02): never on an ordinary dry, windy day, and a minor storm can come in a gale.
  The storm is the weather's dust haze: half strength at a thin haze, full from a haze of 0.25, none once it has thinned
  away. The game gives the renderer its map of where dust can lift, `renderer.setDustSource({ nx, nz, cell, x0, z0, lift,
  ground })`: a grid of how readily each cell gives up dust (0 grass, crops, water, wet soil; 1 bare, dry earth) and the
  ground's height. Send a new map when the ground wets or dries. The demo's map is the farm's tracks and the shed's porch,
  less as rain or snow wets them.
  The ground air lifts dust where it's over 5.5 m/s and over 1.1 times the day's average, so it's the gusts that lift it,
  a bigger puff in a stronger gust. The dust is carried downwind at 0.6 times the ground air's speed and rises from 0.5 m.
  How much lifts, how long it lingers, how high it rises, and the rolling head are the look (`DUST_LOOKS`). A gust's
  front lifts more, and higher, where the wind picks up fast. The developer picked billows (C of three: heavy puffs up
  to 7 m, each gust's front a rolling wall), clearing sooner than C's 10 s so dust doesn't hang behind the shed after a
  gust: 5 s or 3 s, offered while they pick (the demo's Dust buttons, `?dust=c5|c3`). It's the renderer's own motion,
  which no game logic reads, stepped a tick of the game's wind at a time: it holds still while the game is paused. The
  post pass draws it as a layer of depth, read along each pixel's view. Its cost: none while there's no storm and no dust left up. In a storm, up to
  about 1.2 ms of the main thread per wind tick (10 a second), 200 m at 1 m, on a Ryzen 5 1600, and about 0.2 ms of the
  GPU a frame at 1080p.
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
