# The models

The buildings and props, made for the game (Soil n Silo) in the renderer's look: a solarpunk farm. Decided with the
developer on 2026-11-14; this set replaces the first eleven models (the barn, the windmill and so on), which are gone.

Only buildings and props are models. Trees, bushes and crops are painted kinds the renderer draws itself.

## See them

- **The gallery**: `?scene=gallery` (or the demo's **To the gallery** button). Every model on its own plot, a row for each
  group, a pale pad under each showing its footprint.
- **The tour**: the ◀ name ▶ row in the demo's controls steps through the models, in the farm and in the gallery, keeping
  the hour, weather, season and view.
- **One model**: `?focus=<name>` (say `?focus=bakery`, `?scene=gallery&focus=water_wheel&view=2`). The names are the files'
  in `src/models/`.
- From all four sides: `view=0..3`, or the demo's turn buttons.

## The style

"Painted world, inked things" (`docs/DIRECTION.md`), and the game's mood: hopeful, green, crafted, with renewable power
woven into warm, human-scale buildings. Not medieval (no thatch, half-timber or stone keeps), not cyberpunk (no neon, no
grime, no tangle of cables).

- **Rounded lime-white huts** on a terracotta skirt, standing on a pale stone deck. Round-headed doors, portholes,
  sea-glass windows.
- **Planted roofs**: soft pillow roofs and barrel vaults under moss, with herbs and flowers growing on them. Often half
  planted, half solar glass.
- **Solar glass** as awnings and roof sheets, copper for pipes, caps and hoops, honey-coloured timber for frames.
- **The machine is the building.** A workshop is a small hut with its one big, readable machine standing in the open
  beside it: the loom's cloth, the spinner's wheel, the press's screw, the mill's stones, the cannery's kettle, the
  bakery's oven. From the game's camera a roof hides what's under it, so nothing important is indoors.
- **Calm lines.** The ink draws a line wherever a surface folds sharply or one thing stands in front of another. So
  detail is kept flat: hoops, boards, tiles, louvres and charge rings are bands of colour flush with the surface, not
  raised strips, and curves are smooth. A building reads as a few clean shapes with a little drawing on them.

### Palette

One small palette for the whole set (`Palette` in `tools/blender/kit.py`): lime white (`#f3ecdb`), ceramic white
(`#f6f2e8`), honey timber (`#c9975c`, with a lighter and a darker), terracotta (`#cf6a40`), copper (`#c87848`), brass
(`#d9aa52`), verdigris (`#62b09c`), solar blue (`#1d4fa0`), sea glass (`#9ad2c8`), pale stone (`#bdb29c`), linen
(`#f0e6ca`), and three moss greens. A few accents, used sparingly: red, gold, a warm glow for lamps and fires.

## Scale

**One game tile is 4 metres.** People are real-world size (a door is about 2 m), so a 2×2 workshop is an 8 m plot and the
3×3 farmhouse a 12 m one. Each model fits the game's footprint for that building, centred on the ground, its front
towards +Z. `TILE` in `src/models/catalog.ts` and in the kit.

Two models reach past their tile on purpose: the wind turbine's rotor, and the water wheel, whose wheel hangs off the
front of its bank tile over the river and dips 0.87 m below the bank (the game puts it on a bank; its axle runs along the
bank). The wheel's inner half turns inside its own tile, in a pit cut in the deck's front edge (1.8 m wide, from 1.6 m in
front of the tile's middle to its front edge): whoever places it has to open the ground there down to the water, or
the wheel turns in earth. `wheelRace` in `src/models/catalog.ts` is that strip's shape; the farm cuts it through a quay
to the stream, and the gallery, which has no water, cuts it as a dry pit so the whole wheel shows.

## What's in a file

Each model is one `.glb` in `src/models/`, read by `src/kit/model.ts`:

- metres, Y up, front towards +Z, the footprint centred at the origin on the ground;
- no textures: each face has one colour (a `_COLOR` attribute, linear), and UVs in metres for the finishes that have a grain;
- the material's name picks the finish:

  | Material | Look |
  | --- | --- |
  | `plain` | flat inked colour (plaster, ceramic, copper, stone) |
  | `timber` | inked, with a wood grain along the boards |
  | `glass` | solar glass: opaque, in half-metre cells, mirrors the sky |
  | `tin` | inked, corrugated |
  | `moss` | **new**: a planted surface. Painted like the land, not inked, with no lines: what grows is painted. Rain and snow stop at it, as at an inked roof |

- **Plants** are not modelled. A model marks where they grow with empty points named `plant_<kind>_<nn>` (kinds: `herb`,
  `flower`, `shrub`, `vine`), sized by the point's scale; the scene grows a painted clump there, as it does bushes.
- **Pieces for the game** are separate named objects, drawn where they rest for now (nothing moves in the renderer yet):

  | Name | What it's for |
  | --- | --- |
  | `move_spin_*` | a part that turns (a rotor, a wheel, millstones). Its origin is on its axle, its local X along the axle, and a `speed` extra says how fast it should look |
  | `running_*` | shown only while the building works: a fire's glow, a lamp, flour running, a lit control window |
  | `charge_0` to `charge_3` | the battery's rings, for the game to light from the bottom up |
  | `smoke_emitter` | an empty point where smoke or steam leaves |
  | `dynamo` | the water wheel's generator, out on the shaft |

  These follow the game's own conventions (`src/world/models.ts` there), so the files should drop in.

`src/models/index.json` lists every model's title, group, footprint, triangle count, bounds and named pieces; the
demo reads it (`src/models/catalog.ts`).

## Making and changing them

Every model is a short Python script in `tools/blender/models/`, run by Blender. Nothing is modelled by hand, so a build
always gives the same file, and a change is a diff anyone can review.

```sh
# all of them (Blender is a Flatpak here), about half a minute
flatpak run org.blender.Blender -b --factory-startup --python-exit-code 1 --python $PWD/tools/blender/build.py -- $PWD/src/models
# or just some
flatpak run org.blender.Blender -b --factory-startup --python-exit-code 1 --python $PWD/tools/blender/build.py -- $PWD/src/models bakery mill
```

- `tools/blender/kit.py` is the shared kit: the palette, and the parts the set is built from (`hut`, `pillow` and `vault`
  roofs, `solar` sheets, `deck`, `door`, `window`, `porthole`, `planter`, `barrel`, `crate`, `sack`, `wheel`, `pipe`,
  `fence` and plain shapes). A model that uses them looks like the others without trying.
- A model's script sets `TITLE`, `GROUP`, `TILES` and `ABOUT`, and draws in `build(m)`. Optional: `FREE` (pieces allowed
  outside the footprint or below the ground) and `BUDGET` (triangles; 6000 unless set).
- The build **checks** each model: it must stay inside its footprint, above the ground, and under its triangle budget. A
  model that fails stops the build, and the index is only written when all pass.
- To add one: copy a script that's close, change it, build it, then look at it in the gallery from the front and the
  back (`node tools/shot.ts out "scene=gallery&focus=<name>" "scene=gallery&focus=<name>&view=2"`). It joins the gallery
  and the tour by itself; to stand it on the farm, add a `place(...)` line to `BUILDINGS` in `src/demo/scenes/farm.ts`.

## The set

28 models, 37 978 triangles in all. Tiles are the game's footprint (along the front × deep); height in metres.

| Model | Group | Tiles | Height | Triangles | Pieces for the game | Plants | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `depot` | logistics | 3×3 | 10.2 | 3629 | `running_beacon` | 6 | A stone platform with a rounded office and a cargo canopy, a ramp, a landing ring and a mooring mast for the airship. |
| `garage` | logistics | 2×2 | 4.7 | 1174 | `running_lamp` | 7 | An open-fronted timber shelter for the truck: boarded walls, a barrel roof half planted and half solar, a charging post. |
| `silo` | logistics | 2×2 | 10.1 | 1013 | - | 3 | A ceramic grain store: copper hoops, a planted cap, a gauge window showing how full it is, and a filling pipe. |
| `truck` | logistics | 1×1 | 2.0 | 920 | `move_spin_wheel_fl`, `_fr`, `_bl`, `_br` | 0 | A small electric farm truck: a rounded ceramic cab with solar glass on its roof and an open timber bed. |
| `beehive` | farming | 1×1 | 2.3 | 594 | - | 4 | Three stacked hives in soft colours on a timber stand, with a planter of flowers for the bees. |
| `composter` | farming | 2×2 | 3.7 | 1096 | `move_spin_drum` | 2 | Three slatted timber bins from fresh cuttings to dark compost, a ceramic tumbler on a frame, a barrow and sacks. |
| `coop` | farming | 3×3 | 5.0 | 2020 | - | 5 | A long rounded henhouse under a planted roof with a solar sheet, a pop-hole and ramp, and a run with an open gate arch. |
| `greenhouse` | farming | 3×3 | 5.3 | 1911 | - | 10 | A long barrel of sea-glass panes on a low timber wall, timber ribs, a copper ridge with two vent hoods, a glazed door. |
| `sprinkler` | farming | 1×1 | 3.1 | 504 | `move_spin_head` | 0 | A copper riser on a ceramic valve, taller than a person. The two-armed head is a separate piece, ready to spin. |
| `weather_station` | farming | 1×1 | 4.7 | 979 | `move_spin_anemometer` | 1 | A louvred white instrument box under a planted lid, a copper mast with vane and spinning cups, and a rain gauge. |
| `bakery` | processing | 2×2 | 7.8 | 1639 | `running_glow`, `smoke_emitter` | 9 | A domed clay oven with its chimney, a lime-white bakehouse under a planted roof, bread on the counter. |
| `cannery` | processing | 2×2 | 5.6 | 3119 | `running_glow`, `smoke_emitter` | 2 | A big copper kettle on a tiled stove, steam off its pipe, red jars on a rack under a solar awning. |
| `loom` | processing | 2×2 | 4.4 | 1435 | - | 4 | A big timber loom in the open, striped linen growing down it, bolts of cloth on a rack, a rounded store behind. |
| `mill` | processing | 2×2 | 7.8 | 1498 | `move_spin_stone`, `running_flour` | 5 | A hopper up a slim timber tower, millstones turning in the open at its foot, flour running into a sack. |
| `oil_press` | processing | 2×2 | 5.4 | 2811 | `move_spin_wheel` | 5 | A timber screw press with a copper handwheel, golden oil running to a jar, and a small store with a shelf of oil. |
| `spinner` | processing | 2×2 | 4.6 | 2257 | `move_spin_wheel` | 4 | A great spinning wheel in the open, bobbins of dyed thread under a solar awning, a round wool store behind. |
| `battery` | power | 2×2 | 4.5 | 2030 | `charge_0` to `charge_3` | 0 | Four ceramic cells on a timber deck, joined by copper bars. The charge rings are separate pieces for the game to light. |
| `digester` | power | 2×2 | 7.0 | 1182 | `smoke_emitter` | 5 | A round tank under a planted dome: farm waste in at the hopper, gas to the copper bell, a small flare on its pipe. |
| `pylon` | power | 1×1 | 5.7 | 422 | - | 0 | A slim timber pole with ceramic insulators, a copper cap and a small lamp. Quiet: a farm has many. |
| `solar_panel` | power | 2×2 | 3.3 | 242 | - | 0 | One sheet of solar glass on two copper posts, low and quiet; the meadow grows under it. |
| `water_wheel` | power | 2×2 | 4.6 | 1961 | `move_spin_wheel`, `dynamo`, `running_control_window` | 6 | A ten-paddle wheel hung over the river off the front of its bank, a copper dynamo on its shaft, a generator house behind. |
| `wind_turbine` | power | 1×1 | 18.8 | 639 | `move_spin_rotor` | 0 | A slim ceramic tower, a rotor ten metres across with terracotta tips. The rotor is a separate piece, ready to turn. |
| `bench` | home | 1×1 | 1.0 | 268 | - | 2 | A timber bench between two terracotta pots: somewhere to sit and look at the farm. |
| `crates` | home | 1×1 | 1.6 | 994 | - | 0 | A stack of harvest crates with a sack and a jar: yard dressing. |
| `farmhouse` | home | 3×3 | 8.9 | 2749 | `smoke_emitter` | 19 | A rounded two-storey house under a planted roof, a sunroom under solar glass, a vine pergola, a rain tank off the roof. |
| `lantern` | home | 1×1 | 3.3 | 208 | `running_glow` | 0 | A solar lantern on a timber post: a small solar cap, a copper arm, a globe for the game to light at dusk. |
| `planter` | home | 1×1 | 0.6 | 148 | - | 7 | Two raised timber beds of herbs and flowers and a copper watering can: yard dressing. |
| `rain_tank` | home | 1×1 | 3.7 | 536 | - | 0 | A ceramic rain tank on stone feet, with a copper downpipe, a tap and a bucket. |

The first four groups are the game's 22 buildings and vehicles; `home` is the farmhouse and five yard props for dressing
a scene.

## On the farm

The farm valley (`src/demo/scenes/farm.ts`, its `BUILDINGS` list and header) is laid out as a working solarpunk farm:

- **The homestead**, right: bakery, the truck's garage, the farmhouse and the coop along a yard, with a rain tank,
  lanterns, a bench and crates.
- **The market corner**, below the track: the depot with its airship mast, the silo and the mill, a weather station.
- **The kitchen garden**: the greenhouse, the composter and raised beds behind a paling fence.
- **The workshop row**, left, along the road in: cannery, loom, spinner, oil press.
- **Power**: three wind turbines on the knoll, six solar sheets over the wheat (the crop grows under them), the water
  wheel on the stream below the bridge with the battery beside it and the digester down the footpath, and pylons along
  the tracks.
- **In the fields**: beehives by the lavender and the big trees, sprinklers in the cabbages and the barley.

The ground is levelled under each building's footprint, after the land is shaped down to the streams, so a building near
a bank still stands level. The water wheel stands on a small quay cut into the bank, half a metre above the water, turned
so its wheel is over the stream, with a race cut through the quay for the wheel to turn in. Stones, reeds, grass and
trees keep off footprints and the race.

## Cost

About 48 000 triangles of models on the farm (63 of them stand there). On the RX 570 at 1080p in a storm, the farm's frame
is 14.5 ms of GPU time with the new set against 14.5 on `main` before it (`node tools/profile.ts`, 2026-11-14): no
measurable change, and all the inked things together are about 0.3 ms of it. See `docs/PERFORMANCE.md`.

## Not done, and known gaps

- Nothing moves or lights up in the renderer yet: rotors, wheels and millstones are drawn at rest, and every `running_*`
  piece is drawn as if working. Showing them idle or turning is the game's (or a later issue here).
- Seen from the front (as the game's footprint has it), the water wheel is edge on, because its axle runs along the
  bank. On the farm it's turned to show its face.
- Inside the open garage the walls read as one flat shade from some sides.
- The models aren't in the game yet: that's the game repo's work, and its call when.
