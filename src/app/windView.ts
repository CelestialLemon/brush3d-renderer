import type { WindSnapshot } from '../wind/sim';
import type { WindWorker } from '../wind/client';

// The wind from above (#36), for looking at the simulation itself: a panel in the corner showing the whole world's
// ground wind, turned as the camera is, so up the panel is up the screen. Colour is how hard it blows, from still (deep
// blue) through the game's average (teal) to twice it (pale yellow); arrows show which way, every 10 m. Or the shelter
// memory: yellow where the free air above reaches down, blue where obstacles have cut it off. Walls are white, things
// the wind blows through are dark green, and the camera's target is the cross.

/** still → average → twice the average. */
const RAMP = [[0.07, 0.1, 0.25], [0.1, 0.32, 0.52], [0.2, 0.62, 0.62], [0.72, 0.8, 0.45], [1, 0.97, 0.8]];
/** sheltered → open. */
const SHELTER = [[0.15, 0.12, 0.35], [0.16, 0.38, 0.6], [0.3, 0.68, 0.55], [0.85, 0.86, 0.35]];

function colour(ramp: number[][], t: number): [number, number, number] {
  const x = Math.min(1, Math.max(0, t)) * (ramp.length - 1), i = Math.min(ramp.length - 2, Math.floor(x)), f = x - i;
  return [0, 1, 2].map((c) => 255 * (ramp[i][c] + (ramp[i + 1][c] - ramp[i][c]) * f)) as [number, number, number];
}

export class WindView {
  readonly el: HTMLDivElement;
  mode: 'wind' | 'shelter' = 'wind';
  private readonly canvas = document.createElement('canvas');
  private readonly field = document.createElement('canvas');
  private readonly info = document.createElement('div');
  private mask: HTMLCanvasElement | null = null;

  /** `goalSpeed`: the game's average wind, which the colours are scaled to. */
  constructor(private readonly wind: WindWorker, private readonly goalSpeed: () => number) {
    this.el = document.createElement('div');
    this.el.id = 'wind-view';
    this.canvas.width = this.canvas.height = 360;
    const toggle = Object.assign(document.createElement('button'), { textContent: 'wind' });
    toggle.title = 'Show how hard the wind blows, or the shelter memory (how well the free air above still reaches down)';
    toggle.onclick = () => { this.mode = this.mode === 'wind' ? 'shelter' : 'wind'; toggle.textContent = this.mode; };
    this.el.append(this.canvas, toggle, this.info);
  }

  /** The obstacles, drawn once: walls white, porous things dark green, darker the denser. */
  private obstacleMask(nx: number, nz: number) {
    const o = this.wind.obstacles;
    if (this.mask || !o) return this.mask;
    this.mask = Object.assign(document.createElement('canvas'), { width: nx, height: nz });
    const ctx = this.mask.getContext('2d')!, img = ctx.createImageData(nx, nz);
    for (let k = 0; k < o.solid.length; k++) {
      if (o.solid[k]) img.data.set([255, 255, 255, 255], k * 4);
      else if (o.drag[k] > 0) img.data.set([20, 70, 30, Math.min(255, 60 + o.drag[k] * 20)], k * 4);
    }
    ctx.putImageData(img, 0, 0);
    return this.mask;
  }

  /** Draws the wind between its last two ticks, with the camera at (x, z) looking from yaw radians. */
  draw(cx: number, cz: number, yaw: number) {
    const a = this.wind.prev, b = this.wind.cur;
    if (!a || !b) return;
    const t = this.wind.alpha, mean = Math.max(0.5, this.goalSpeed());
    if (this.field.width !== b.nx || this.field.height !== b.nz) Object.assign(this.field, { width: b.nx, height: b.nz });
    const fctx = this.field.getContext('2d')!, img = fctx.createImageData(b.nx, b.nz);
    let sum = 0, peak = 0;
    for (let k = 0; k < b.u.length; k++) {
      const u = a.u[k] + (b.u[k] - a.u[k]) * t, v = a.v[k] + (b.v[k] - a.v[k]) * t, s = Math.hypot(u, v);
      sum += s; peak = Math.max(peak, s);
      const c = this.mode === 'wind' ? colour(RAMP, s / (2 * mean)) : colour(SHELTER, a.k[k] + (b.k[k] - a.k[k]) * t);
      img.data.set([c[0], c[1], c[2], 255], k * 4);
    }
    fctx.putImageData(img, 0, 0);
    const ctx = this.canvas.getContext('2d')!, W = this.canvas.width;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = '#141824'; ctx.fillRect(0, 0, W, W);
    // World (x, z) to the panel: turned as the camera is (screen right = (cos yaw, -sin yaw), up = -(sin yaw, cos yaw)),
    // the world's square fitted inside the panel at any turn.
    const side = Math.max(b.nx, b.nz) * b.cell, scale = W / (side * Math.SQRT2), c = Math.cos(yaw), s = Math.sin(yaw);
    const mid = { x: b.x0 + (b.nx * b.cell) / 2, z: b.z0 + (b.nz * b.cell) / 2 };
    ctx.setTransform(c * scale, s * scale, -s * scale, c * scale, W / 2, W / 2);
    ctx.translate(-mid.x, -mid.z);
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(this.field, b.x0, b.z0, b.nx * b.cell, b.nz * b.cell);
    ctx.imageSmoothingEnabled = false;
    const mask = this.obstacleMask(b.nx, b.nz);
    if (mask) ctx.drawImage(mask, b.x0, b.z0, b.nx * b.cell, b.nz * b.cell);
    this.arrows(ctx, a, b, t, mean, scale);
    ctx.strokeStyle = '#ff5a8a'; ctx.lineWidth = 2 / scale;
    ctx.beginPath(); ctx.moveTo(cx - 4, cz); ctx.lineTo(cx + 4, cz); ctx.moveTo(cx, cz - 4); ctx.lineTo(cx, cz + 4); ctx.stroke();
    this.info.textContent = `tick ${b.tick} · ${(b.nx * b.cell).toFixed(0)} m square, ${b.cell} m cells · step ${this.wind.stepMs.toFixed(1)} ms` +
      ` · ground mean ${(sum / b.u.length).toFixed(2)} m/s, peak ${peak.toFixed(1)}${this.wind.safetyHits ? ` · safety hits ${this.wind.safetyHits}` : ''}`;
  }

  private arrows(ctx: CanvasRenderingContext2D, a: WindSnapshot, b: WindSnapshot, t: number, mean: number, scale: number) {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)'; ctx.lineWidth = 1.2 / scale;
    ctx.beginPath();
    const step = Math.round(10 / b.cell);
    for (let j = step >> 1; j < b.nz; j += step) for (let i = step >> 1; i < b.nx; i += step) {
      const k = j * b.nx + i, u = a.u[k] + (b.u[k] - a.u[k]) * t, v = a.v[k] + (b.v[k] - a.v[k]) * t;
      // Ten metres long at twice the average.
      const x = b.x0 + (i + 0.5) * b.cell, z = b.z0 + (j + 0.5) * b.cell, f = 5 / (2 * mean);
      const ex = x + u * f, ez = z + v * f, s = Math.hypot(u, v) * f;
      if (s < 0.3) continue;
      const hx = (ex - x) / s, hz = (ez - z) / s;
      ctx.moveTo(x - u * f, z - v * f); ctx.lineTo(ex, ez);
      ctx.moveTo(ex, ez); ctx.lineTo(ex - 1.6 * hx + 1.1 * hz, ez - 1.6 * hz - 1.1 * hx);
      ctx.moveTo(ex, ez); ctx.lineTo(ex - 1.6 * hx - 1.1 * hz, ez - 1.6 * hz + 1.1 * hx);
    }
    ctx.stroke();
  }
}
