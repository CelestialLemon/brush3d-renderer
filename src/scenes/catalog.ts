import index from './models/index.json';

// The models (docs/MODELS.md): what tools/blender/build.py wrote about each, and where its file is.

/** One game tile in this renderer's metres: the models are built on the game's footprints at this size. */
export const TILE = 4;

export interface ModelInfo {
  name: string; url: string; title: string; about: string;
  group: 'logistics' | 'farming' | 'processing' | 'power' | 'home';
  /** The footprint in game tiles (along its front, and deep). */
  tiles: [number, number];
  triangles: number;
  /** Its bounds in its own frame, metres. */
  lo: [number, number, number]; hi: [number, number, number];
  /** Its named pieces: moving parts, the game's `running_` looks, emitters, plants. */
  parts: string[];
}

const urls = import.meta.glob('./models/*.glb', { query: '?url', import: 'default', eager: true }) as Record<string, string>;
export const MODELS: Record<string, ModelInfo> = Object.fromEntries(Object.entries(index as unknown as Record<string, Omit<ModelInfo, 'name' | 'url'>>)
  .map(([name, info]) => [name, { ...info, name, url: urls[`./models/${name}.glb`] }]));

export const GROUPS: ModelInfo['group'][] = ['logistics', 'farming', 'processing', 'power', 'home'];
/** The models in the tour's order: by group, then by name. */
export const TOUR: ModelInfo[] = GROUPS.flatMap((g) => Object.values(MODELS).filter((m) => m.group === g));

/**
 * Whether a model shelters what's behind it from the wind (#36): a building with walls. Not a pole, a turbine, a prop, or
 * a sheet of glass on two posts, which the wind passes.
 */
export const blocksWind = (m: ModelInfo) => m.tiles[0] >= 2 && m.hi[1] > 1.5 && m.name !== 'solar_panel';

/**
 * The water wheel's race: the strip its wheel turns in, which a scene has to open in the ground (the wheel dips 0.87 m
 * below its floor), from a pit in its own footprint out past its front. In the model's own frame (x along its front, z
 * out through it): 1 in the race, easing to 0 over `margin` round it. The wheel is 1.4 m wide and reaches from 1.2 m to
 * 6.8 m out from the model's middle (tools/blender/models/water_wheel.py).
 */
export function wheelRace(lx: number, lz: number, margin = 0.5) {
  const ease = (a: number, b: number, v: number) => { const t = Math.min(1, Math.max(0, (v - a) / (b - a))); return t * t * (3 - 2 * t); };
  return (1 - ease(1, 1 + margin, Math.abs(lx))) * ease(1.7 - margin, 1.7, lz) * (1 - ease(8, 8 + margin, lz));
}

/** Where a scene shows a model: its place on the ground, and which way its front faces (radians about y). */
export interface Stand { model: ModelInfo; x: number; y: number; z: number; yaw: number }
