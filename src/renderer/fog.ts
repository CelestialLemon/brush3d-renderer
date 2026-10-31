import * as THREE from 'three';
import { lookAt } from './look';

// The fog's patches (#9): smooth noise baked once into a small texture that repeats, read by the post pass. Working the
// noise out in every pixel at each step up through the fog cost twice the fog's budget (0.8 ms on the RX 570); reading it
// from a texture costs a fraction of that.

/** Texels across the texture, and noise cells across it (so a cell is FOG_NOISE_SIZE / FOG_NOISE_CELLS texels). */
export const FOG_NOISE_SIZE = 256;
export const FOG_NOISE_CELLS = 16;

/** Gradient noise that repeats every `cells` cells, at a point in cells: about -1..1. */
function periodicNoise(x: number, y: number, cells: number, grad: Float32Array) {
  const x0 = Math.floor(x), y0 = Math.floor(y), fx = x - x0, fy = y - y0;
  const g = (i: number, j: number, dx: number, dy: number) => {
    const k = ((((j % cells) + cells) % cells) * cells + (((i % cells) + cells) % cells)) * 2;
    return grad[k] * dx + grad[k + 1] * dy;
  };
  const s = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
  const a = g(x0, y0, fx, fy), b = g(x0 + 1, y0, fx - 1, fy), c = g(x0, y0 + 1, fx, fy - 1), d = g(x0 + 1, y0 + 1, fx - 1, fy - 1);
  const u = s(fx), v = s(fy);
  return (a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v) * 1.4;
}

/** The fog's noise: one octave of gradient noise, FOG_NOISE_CELLS cells across, repeating, in the red channel. */
export function fogNoiseTexture() {
  const n = FOG_NOISE_SIZE, cells = FOG_NOISE_CELLS;
  // Fixed gradients (a small LCG), so every run and every machine bakes the same texture.
  let seed = 12345;
  const rand = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
  const grad = new Float32Array(cells * cells * 2);
  for (let i = 0; i < cells * cells; i++) { const a = rand() * Math.PI * 2; grad[i * 2] = Math.cos(a); grad[i * 2 + 1] = Math.sin(a); }
  const data = new Uint8Array(n * n);
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const v = periodicNoise(((x + 0.5) * cells) / n, ((y + 0.5) * cells) / n, cells, grad);
      data[y * n + x] = Math.round(THREE.MathUtils.clamp(v * 0.5 + 0.5, 0, 1) * 255);
    }
  }
  const tex = new THREE.DataTexture(data, n, n, THREE.RedFormat, THREE.UnsignedByteType);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.magFilter = tex.minFilter = THREE.LinearFilter;
  tex.needsUpdate = true;
  return tex;
}

/** Light as the fog takes it: half the sun's, half the sky's. */
const fogLight = (sun: THREE.Color, sky: THREE.Color) => sun.clone().multiplyScalar(0.5).add(sky.clone().multiplyScalar(0.5));
let noon: THREE.Color | null = null;

/**
 * The fog's colour as lit (linear): the game's colour, which is its colour in noon's clear light, lit by the sun and sky as
 * they are now (pink-gold at dawn, moonlight blue at night, the grey day's light under cloud), by channel.
 */
export function litFog(out: THREE.Color, color: THREE.Color, sun: THREE.Color, sky: THREE.Color) {
  if (!noon) { const n = lookAt(12); noon = fogLight(n.sunColor, n.skyColor); }
  const l = fogLight(sun, sky);
  return out.setRGB((color.r * l.r) / noon.r, (color.g * l.g) / noon.g, (color.b * l.b) / noon.b);
}
