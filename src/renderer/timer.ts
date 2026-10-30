// Times the frame pass by pass, for tools/profile.ts and the demo's ?profile page: the GPU's time where the browser has timer
// queries (EXT_disjoint_timer_query_webgl2: Chromium on desktop, not Safari), and the CPU's time spent issuing each pass.
// Passes run one after another, each between two marks: mark('shadow') ... mark('main') ... endFrame(). GPU results come
// back a few frames late, and only once the page has returned to the event loop; frames the GPU reports as disjoint (a clock
// change, a context switch) are dropped.

interface TimerExt { TIME_ELAPSED_EXT: number; GPU_DISJOINT_EXT: number }
/** One frame: each pass's CPU time (ms) and, once it comes back, its GPU time (ms). */
export interface FrameTimes { cpu: Record<string, number>; gpu: Record<string, number> | null }

export class PassTimer {
  readonly gpu: boolean;
  /** Finished frames, oldest first. */
  readonly frames: FrameTimes[] = [];
  private ext: TimerExt | null;
  private pool: WebGLQuery[] = [];
  private current: { name: string; cpu: number; gpu: boolean } | null = null;
  private frame: { cpu: Record<string, number>; queries: [string, WebGLQuery][] } = { cpu: {}, queries: [] };
  private waiting: { times: FrameTimes; queries: [string, WebGLQuery][] }[] = [];

  constructor(private gl: WebGL2RenderingContext) {
    this.ext = gl.getExtension('EXT_disjoint_timer_query_webgl2') as TimerExt | null;
    this.gpu = this.ext !== null;
  }

  /**
   * Ends the pass running (if any) and starts the next. A pass that draws nothing should be CPU-only (gpu false): its query
   * would time the GPU waiting for the frame's first commands.
   */
  mark(name: string | null, gpu = true) {
    const now = performance.now(), gl = this.gl, ext = this.ext;
    if (this.current) {
      this.frame.cpu[this.current.name] = (this.frame.cpu[this.current.name] ?? 0) + now - this.current.cpu;
      if (ext && this.current.gpu) gl.endQuery(ext.TIME_ELAPSED_EXT);
    }
    this.current = name === null ? null : { name, cpu: now, gpu };
    if (name !== null && ext && gpu) {
      const q = this.pool.pop() ?? gl.createQuery()!;
      gl.beginQuery(ext.TIME_ELAPSED_EXT, q);
      this.frame.queries.push([name, q]);
    }
  }

  endFrame() {
    this.mark(null);
    const times: FrameTimes = { cpu: this.frame.cpu, gpu: null };
    this.frames.push(times);
    if (this.ext) this.waiting.push({ times, queries: this.frame.queries });
    this.frame = { cpu: {}, queries: [] };
    this.poll();
  }

  /** Collects the GPU times that have come back. */
  poll() {
    const gl = this.gl, ext = this.ext;
    if (!ext) return;
    // The disjoint flag says something happened since it was last read, not to which frame: it spoils every frame still
    // waiting, so all of them are dropped.
    if (gl.getParameter(ext.GPU_DISJOINT_EXT)) {
      for (const w of this.waiting.splice(0)) for (const [, q] of w.queries) gl.deleteQuery(q);
      return;
    }
    while (this.waiting.length) {
      const w = this.waiting[0];
      if (!w.queries.every(([, q]) => gl.getQueryParameter(q, gl.QUERY_RESULT_AVAILABLE))) break;
      this.waiting.shift();
      const gpu: Record<string, number> = {};
      for (const [name, q] of w.queries) {
        gpu[name] = (gpu[name] ?? 0) + (gl.getQueryParameter(q, gl.QUERY_RESULT) as number) / 1e6;
        this.pool.push(q);
      }
      w.times.gpu = gpu;
    }
  }

  /** Waits until every frame's GPU times have come back (or been dropped). */
  async settle() {
    for (let i = 0; this.waiting.length && i < 600; i++) {
      await new Promise((r) => setTimeout(r, 5));
      this.poll();
    }
  }

  reset() { this.frames.length = 0; }
}
