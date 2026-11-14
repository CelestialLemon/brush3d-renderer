// What the game's rules share with the picture, so the two can't disagree (docs/API.md): the wind simulation (the wind the
// turbines feel is the wind in the grass) and the cloud recipe (a cloud's shadow on a solar panel). Plain code, with no
// drawing and no bundler in it, so the rules' tests and bots import this file straight into Node; src/index.ts exports
// it all too. Keep it so: its imports carry their `.ts` and reach nothing that needs three.js or Vite
// (`npm run typecheck` loads it in Node to check).

export {
  DRAG, MAX_SPEED as MAX_WIND, SOLID_DRAG, TICK as WIND_TICK, WindSim, windAt, windBetween,
  type Obstacle, type Shape, type WindGoal, type WindGrid, type WindOptions, type WindSave, type WindSnapshot,
} from './wind/sim.ts';
export { CLOUD_SHAPE, cloudDriftSpeed, cloudShade, type CloudField, type CloudLayer, type CloudShape } from './renderer/clouds.ts';
