import * as THREE from 'three';

// The game's camera: orthographic, a 3/4 view pitched 30° down, four views 90° apart, zoom as screen pixels per metre.

export const PITCH = THREE.MathUtils.degToRad(30);
export const MIN_ZOOM = 16, MAX_ZOOM = 96;
/** How far the camera sits from its target along the view (orthographic, so this only has to clear the scene). */
export const CAMERA_DISTANCE = 120;

export class ViewCamera {
  readonly camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 400);
  readonly target = new THREE.Vector3();
  /** The view, 0..3: the camera looks from 45° + 90° × view. */
  view = 0;
  /** Screen pixels per metre. */
  zoom = 32;
  private yaw = THREE.MathUtils.degToRad(45);

  constructor(view = 0, zoom = 32) {
    this.view = view; this.zoom = zoom;
    this.yaw = this.goalYaw();
  }

  private goalYaw() { return THREE.MathUtils.degToRad(45 + 90 * this.view); }

  turn(dir: number) { this.view = (this.view + dir + 4) % 4; }

  /** Eases the turn; returns true while it is still moving. */
  update(dt: number, instant = false) {
    const goal = this.goalYaw();
    let d = goal - this.yaw;
    d = Math.atan2(Math.sin(d), Math.cos(d));
    this.yaw = instant || Math.abs(d) < 1e-4 ? goal : this.yaw + d * (1 - Math.exp(-dt * 9));
    return Math.abs(d) > 1e-4;
  }

  /** The unit vector from the target towards the camera. */
  backward() {
    return new THREE.Vector3(Math.sin(this.yaw) * Math.cos(PITCH), Math.sin(PITCH), Math.cos(this.yaw) * Math.cos(PITCH));
  }

  /** Moves the target by screen pixels (drag). */
  pan(dx: number, dy: number) {
    const right = new THREE.Vector3(Math.cos(this.yaw), 0, -Math.sin(this.yaw));
    const fwd = new THREE.Vector3(-Math.sin(this.yaw), 0, -Math.cos(this.yaw));
    // Screen up is the ground's forward foreshortened by the pitch.
    this.target.addScaledVector(right, -dx / this.zoom).addScaledVector(fwd, dy / this.zoom / Math.sin(PITCH));
  }

  apply(width: number, height: number) {
    const w = width / this.zoom / 2, h = height / this.zoom / 2;
    const c = this.camera;
    c.left = -w; c.right = w; c.top = h; c.bottom = -h;
    c.near = 1; c.far = CAMERA_DISTANCE * 2.5;
    c.position.copy(this.target).addScaledVector(this.backward(), CAMERA_DISTANCE);
    c.up.set(0, 1, 0);
    c.lookAt(this.target);
    c.updateProjectionMatrix();
    c.updateMatrixWorld();
  }
}
