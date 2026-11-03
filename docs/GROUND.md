# The ground's state: wet and muddy (#11)

The game owns the ground's state: how wet the land is and how muddy, and the rules that change it (rain wets it, sun and
wind dry it, traffic churns bare earth to mud). The renderer draws whatever state it's given, as a map over the land in
the water's format (docs/WATER.md), sent again whenever it changes. Frost and snow cover (#13, #14) will join it.

## In plain words

The game paints two numbers on each tile of the land: how wet it is and how muddy. The renderer does the rest:

- **Wet things go darker and richer.** Grass, crops, leaves and earth darken and their colour deepens, the way a
  stone darkens when you splash it. Painted surfaces wet fast: half wet already looks soaked.
- **Built things take a shine.** What's inked (the shed, fences, crates) darkens a little and catches the light: the
  sun's, or under cloud the bright sky's.
- **Under a roof it stays dry**, right to the roof's edge, and under a tree partly. The renderer knows what's sheltered
  from the shelter map (#10), finer than the game's tiles, so the dry patch under a porch is the porch's shape.
- **Muddy earth goes dark brown**, but only the earth itself: a tile is coarser than a track, so the renderer keeps the
  mud off the grass beside it.
- **Puddles are the renderer's.** The game doesn't place them. Once the ground is well soaked, water collects in its
  low places: bare, muddy ground (a track, a yard) holds a string of separate puddles, a real hollow in the grass a
  pool, a lawn none. They mirror the sky, and grow and shrink with how wet the ground is.

## The contract

```ts
renderer.setGround({
  nx, nz, cell, x0, z0,          // the grid: the water's, the wind's and the dust's; its corner at (x0, z0), x fastest
  wet,                           // Float32Array: how wet per cell, 0 dry to 1 soaked
  mud,                           // optional Float32Array: how muddy per cell, 0 to 1 (none if left out)
}, ease);                        // seconds to ease in (0.6 by default; 0 at once: a level loading, a screenshot)
renderer.setGround(null);        // dry everywhere
```

- **Wet** is how wet the surface is, not how much water the soil holds. Things look soaked by about 0.5; puddles start
  at about 0.55 and are full at 1. Let it rise as soon as rain starts and fall last as the land dries: the puddles then
  linger after the rain, as they do.
- **Mud** is how churned and muddy bare earth is: a track, a yard, a ploughed field. Muddy ground holds puddles. On
  grass it does nothing, so a tile half track, half grass can be sent as muddy.
- **Updates.** Send a new map when the state changes, a few times a second at most. Each one eases in from what's drawn
  at that moment. A map on a new grid comes in at once. The values are stored to 1/255.
- **Cost.** Uploading the map is cheap: no laying out, two small textures and a blend between them. Nothing is drawn
  while it's dry everywhere (frames match a build without this, to the byte). The land's low places are found once (see
  below), about 5 ms on the farm the first time the ground is wet, and again only if the land is reshaped or what
  shelters it changes.

## How it's drawn

`src/renderer/ground.ts`:

- **`GroundField`** keeps the map as it was and as last sent, as two textures every material blends (`groundState`).
  Off the grid's edge the nearest cell carries on, so a one-cell map covers the whole land.
- **`HollowMap`** finds the land's low places once: the ground drawn from straight above into a depth map (its height at
  each 17 cm texel, exactly), then for each texel how far it lies below the ground round it, within 1.2 m (a track's
  width) and within 4 m (a hollow's), the deeper of the two. With it, a pattern of the ground's unevenness, fixed to the
  world, picks which parts of a low place hold the water, and how sheltered the ground is. Done again only when ground
  is added or taken out, or the shelter map changes.
- **`WET_GLSL`** runs in every material but the water, at the end of the painting (`wetLook` in `writeGBuffer`): the
  state where the surface is, less where it's sheltered, then the looks above. In the water's reflection it skips the
  shelter and the puddles (blurred and broken by the ripples, neither would show), and the bed under the water isn't
  wetted at all.

**Cost** on the RX 570 at 1080p in a storm, GPU ms: the farm 14.37 dry, 14.61 wet (+0.24); the meadow 5.25, 5.53
(+0.28, more of its screen being open ground), inside the line's 0.4. Two things kept it there (it was +0.9 at first):
- what's drawn at the ground (the ground, grass and crops: most of the screen) reads its shelter from the dips map, with
  the dips, rather than from the shelter map's eight lookups (0.2 ms on the meadow). The dips map is found again
  whenever the shelter map is;
- the colour work is in plain RGB rather than OKLab (half the cost, paid on every pixel of the ground).

Moving the camera shows no new crawl (`tools/motion.ts`, `AB=2`: the farm's pan differs a little less wet, being darker).

## The looks being picked

The developer picks, on the PR's preview (each a button in the demo's Wet row and a URL option):

- `damp`, painted things: `a` richer (a little darker, the colour deeper), `b` darker (much darker, a little deeper).
- `sheen`, inked things: `a` streaks of shine where the surface turns to the light, `b` glaze (the sky and its clouds
  mirrored faintly, more at a glancing angle), `c` both.
- `puddles`: `a` mirror (the sky and clouds, clear, in a dark wet rim), `b` pale (a flat, soft patch of the sky's colour).
- `mudLook`: `a` dark (dark, rich brown), `b` churned (dark brown with streaks of wet shine).

## The demo

The demo stands in for the game (`src/app/ground.ts`): one number, how soaked the land is, makes the map. Hollows and
low ground dry last and rises first, a little patchy, so the land dries in patches; the scene's bare ground (the
tracks, the porch, the yard, the ploughed field: the same map as the dust's) turns to mud as it wets.

- `?wet=0..1` (1 by default in rain), and the looks above. The Wet slider and the look buttons.
- `?timeline`: the shower wets the land as it rains and dries it after, faster in sun than under cloud
  (`timelineSoak`).
- `tools/video.ts` has `timeline` and `shower-shed` (the same, close by the shed).
