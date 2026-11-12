# Wheat mill

The farm's northern knoll now has a wheat mill with a stone foundation, tapered plaster tower,
patinated teal cap, four linen-covered timber sails and an attached milling house. Individual
clay tiles, timber bracing, shuttered windows, a covered loading deck, tied flour sacks, a grain
bin, a sack hoist and a raised wheat emblem give it detail at close zoom without textures.

Use the **Wheat mill** button in the farm demo, or open `?focus=mill` (append `&still&t=0`
for a fixed, clean frame). Camera parameters `x`, `z`, `view` and `zoom` override the preset.
The button preserves the current weather, hour and season. Drag, zoom and Q/E still work.
The preset fits the window size and pixel density; an explicit URL `zoom` remains absolute.

## Source and export

- `tools/blender/wheatmill.blend`: editable Blender scene with material preview, camera and studio lights.
- `tools/blender/wheatmill.py`: deterministic model generator; reuses `Model`, `lin` and `shade` from `barn.py`.
- `src/scenes/models/wheatmill.glb`: runtime asset, 7,112 triangles, about 696 KiB.

Rebuild from the repository root using Blender 4.5 or newer (verified with Blender 5.2.2):

```sh
blender -b --factory-startup --python tools/blender/wheatmill.py -- src/scenes/models
# Also regenerate the editable source and two opposing studio previews:
blender -b --factory-startup --python tools/blender/wheatmill.py -- src/scenes/models --blend --preview
# macOS: replace blender with /Applications/Blender.app/Contents/MacOS/Blender
```

The generator is the reproducible source: `--blend` overwrites the companion Blender file.
Previews go to ignored `out/models/`. Only the selected mill mesh is exported, before the
presentation lights and camera are added. The model follows the existing importer contract:
metres, Y up, +Z front, linear `_COLOR`, metre-scaled UVs and `plain`/`timber`/`glass`/`tin`
material names. It uses the renderer's ink, grain, lighting, shadows and weather treatments.
Sails are static, matching the other farm props.

The mesh spans X −7.18…6.03, Y 0…14.38 and Z −3.49…4.06 m, including sails. The farm
levels and clears a 12.2 × 7.2 m footprint beneath it; sails overhang that footprint. The
wind obstacle is derived from that footprint (90% of each extent) and uses a 14.4 m height,
following the farm's existing obstacle approximation.

## Visual verification

```sh
npm run dev
node tools/shot.ts /tmp/wheatmill 'focus=mill&t=0&hour=12' \
  'x=-78&z=-21&zoom=38&t=0&hour=12' \
  'x=-51&z=5&view=2&zoom=34&t=0&hour=12'
npm run typecheck
npm run build
```

Inspect both sides for intact roof and sail faces, the loading deck against the terrain,
material colours, shadowing and nearby vegetation. The studio renders also show details
that are deliberately small at the game's usual zoom.
