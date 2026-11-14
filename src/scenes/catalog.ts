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

/** Where a scene shows a model: its place on the ground, and which way its front faces (radians about y). */
export interface Stand { model: ModelInfo; x: number; y: number; z: number; yaw: number }
