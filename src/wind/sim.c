// The living wind near the ground (#36), for WebAssembly with SIMD. Built by tools/wind-build.ts into engine.ts.
//
// A flat layer of air over the world, a cell a metre: how much air sits in each cell (rho, 1 at rest) and how it moves
// (momentum rho*u, rho*v). It is pushed around by its own pile-ups (pressure c^2*rho), goes round walls (solid cells
// reflect it), is slowed by what it passes through (hedges, crowns: drag per second) and by the ground (S1). The faster
// free air above (U = 1.5 f, f the gust recipe's wind at ground level) reaches down into it at rate K: gusts are fed in
// from above, then live on their own, so two gusts meeting pile up and spill sideways.
//
// The shelter memory k (1 = open air): how well the free air can still reach this air. Obstacles lower it (hedges and
// crowns by their drag, walls where air brushes past them); it is carried with the air and grows back towards 1 over
// about 40 m of travel. The free air reaches down at K*k, so a calm streak trails behind each obstacle. In open air k
// stays exactly 1. Sol's round 6 (#36): the contract is in docs/WIND.md.
//
// Each tick of dt seconds, in substeps of ds: at least the n set up, more when the wind is fast enough to cross too much
// of a cell in one (worked out from the wind at the tick's start, so it's the same on every replay):
//   1. carry k with the old ground wind: dk/dt = -div(u k) + k div(u) (carried, never compressed);
//   2. move the air: limited second-order fluxes (Rusanov), two-stage Runge-Kutta;
//   3. per cell, implicitly: u' = (u + ds*K*k*U) / (1 + ds*(K*k + S1 + drag)), then
//      k' = (k + ds*r) / (1 + ds*(r + eat)), r = |u'|/40, eat = drag + (20 next to a wall),
//      and pile-ups relax back towards 1 over half a second, keeping their velocity.
// Inflow at the edges comes from the recipe where the wind blows in (k = 1); elsewhere the outside copies the edge.
//
// Only + - * / , sqrt, floor, min/max/abs and selects, in float32: bit-identical on every machine (WebAssembly has no
// fused multiply-add). Built with -ffp-contract=off so the compiler doesn't fuse them either.

#define MAXW 256
#define MAXN (MAXW * MAXW)
#define PAD (MAXW + 16)
#define EXPORT(name) __attribute__((export_name(#name)))

typedef float f32;

// Sol's calibration (rounds 4 and 6): pile-up relaxation, how much faster the free air above is, the free air's reach
// (K = K0 + KG*e, e how hard the recipe gusts here), and the shelter memory's recovery and eating. All calibrated at
// 6 m/s, with the pressure speed (how fast a pile-up spreads) 7 m/s. Above 6 m/s the caller sets a pace, the wind over
// 6 m/s: the pressure speed and every rate (friction, drag, reach, relaxation, eating) go up by it, so a storm is a
// breeze sped up, the same shapes and the same average (real drag grows with the wind too). At pace 1 nothing changes.
static const f32 C0 = 7.0f;
static f32 C = C0, pace = 1.0f;
static const f32 TAU = 0.5f, UPPER = 1.5f, K0 = 0.15f, KG = 2.0f, RECOVERY = 40.0f, WALL = 20.0f;
// Safety bounds on the column amount. None is reached in any tested case; they only keep a bad input from blowing up.
static const f32 RMIN = 0.03f, RMAX = 40.0f;
// How far a substep may carry anything, in cells, across x and y together (the fastest air plus the pressure speed, on
// each axis): about 0.85 is where a diagonal storm starts to blow up, so this leaves room. And the most substeps a tick.
static const f32 COURANT = 0.7f;
static const int MAXSUB = 64;

static int nx, ny, N, substeps, lastSubsteps;
static f32 h, x0, y0, S1;
static unsigned floorHits;

#define CELLS(name) static f32 name##_buf[MAXN + 2 * PAD]; static f32 *const name = name##_buf + PAD;
// State, stage and next state; the substep's combined state and right-hand sides; geometry; the recipe's forcing.
CELLS(R) CELLS(M) CELLS(V) CELLS(Ra) CELLS(Ma) CELLS(Va) CELLS(Rs) CELLS(Ms) CELLS(Vs)
CELLS(dR) CELLS(dM) CELLS(dV) CELLS(dRs) CELLS(dMs) CELLS(dVs) CELLS(SR) CELLS(SM) CELLS(SV)
CELLS(solid) CELLS(drag) CELLS(fluid) CELLS(slopeX) CELLS(slopeY) CELLS(EAT)
CELLS(FX) CELLS(FY) CELLS(UX) CELLS(UY) CELLS(K)
// The shelter memory, its stage and right-hand sides, and the old velocity that carries it.
CELLS(KT) CELLS(KTa) CELLS(dKT) CELLS(dKTs) CELLS(WX) CELLS(WY)
static f32 FX0[MAXW * (MAXW + 1)], FX1[MAXW * (MAXW + 1)], FX2[MAXW * (MAXW + 1)];
static f32 FY0[(MAXW + 1) * MAXW], FY1[(MAXW + 1) * MAXW], FY2[(MAXW + 1) * MAXW];
static f32 FK[MAXW * (MAXW + 1)], FW[MAXW * (MAXW + 1)], FKY[(MAXW + 1) * MAXW], FWY[(MAXW + 1) * MAXW];

EXPORT(ptrR) f32 *ptrR(void) { return R; }
EXPORT(ptrM) f32 *ptrM(void) { return M; }
EXPORT(ptrV) f32 *ptrV(void) { return V; }
EXPORT(ptrK) f32 *ptrK(void) { return KT; }
EXPORT(ptrFX) f32 *ptrFX(void) { return FX; }
EXPORT(ptrFY) f32 *ptrFY(void) { return FY; }
EXPORT(ptrSolid) f32 *ptrSolid(void) { return solid; }
EXPORT(ptrDrag) f32 *ptrDrag(void) { return drag; }
EXPORT(hits) unsigned hits(void) { return floorHits; }
EXPORT(substepsUsed) int substepsUsed(void) { return lastSubsteps; }

static inline f32 fabs_(f32 x) { return __builtin_fabsf(x); }
static inline f32 min_(f32 a, f32 b) { return a < b ? a : b; }
static inline f32 max_(f32 a, f32 b) { return a > b ? a : b; }
// Monotonised-central limiter: minmod((a+b)/2, minmod(2a, 2b)).
static inline f32 mc(f32 a, f32 b) {
  f32 m = min_(min_(0.25f * fabs_(a + b), fabs_(a)), fabs_(b));
  f32 sa = a > 0 ? 1.0f : (a < 0 ? -1.0f : 0.0f), sb = b > 0 ? 1.0f : (b < 0 ? -1.0f : 0.0f);
  return (sa + sb) * m;
}

// nx by ny cells of h metres, the first cell's corner at (x0, y0) in the world; n substeps a tick.
EXPORT(setup) int setup(int nx_, int ny_, f32 h_, f32 x0_, f32 y0_, int n) {
  if (nx_ < 3 || ny_ < 3 || nx_ > MAXW || ny_ > MAXW) return 0;
  nx = nx_; ny = ny_; N = nx * ny; h = h_; x0 = x0_; y0 = y0_; substeps = n; floorHits = 0;
  for (int k = 0; k < N; k++) { solid[k] = 0; drag[k] = 0; }
  return 1;
}

// After solid (0/1) and drag are filled: the masks that keep solids and edges out of the interior loops, and where the
// shelter memory is eaten.
EXPORT(prepare) void prepare(void) {
  for (int j = 0; j < ny; j++) for (int i = 0; i < nx; i++) {
    int k = j * nx + i, so = solid[k] != 0;
    fluid[k] = so ? 0.0f : 1.0f;
    int fx = so || i == 0 || i == nx - 1 || solid[k - 1] != 0 || solid[k + 1] != 0;
    int fy = so || j == 0 || j == ny - 1 || solid[k - nx] != 0 || solid[k + nx] != 0;
    slopeX[k] = fx ? 0.0f : 1.0f; slopeY[k] = fy ? 0.0f : 1.0f;
    int wall = (i > 0 && solid[k - 1] != 0) | (i < nx - 1 && solid[k + 1] != 0) | (j > 0 && solid[k - nx] != 0) | (j < ny - 1 && solid[k + nx] != 0);
    EAT[k] = drag[k] + (wall ? WALL : 0.0f);
  }
}

// Fills the air with a steady wind (u, v), open everywhere.
EXPORT(reset) void reset(f32 u, f32 v) {
  for (int k = 0; k < N; k++) { R[k] = 1; M[k] = fluid[k] * u; V[k] = fluid[k] * v; KT[k] = fluid[k]; }
}

// ---- The gust recipe (Sol's round 4, a placeholder look for the look PR to replace) ----
// Fronts across the wind, every L metres; how much of the cycle is gust (duty), a sharp rise over 2 m and a long fall;
// the fronts bend and their strength varies along them. Mean 1 over a cycle, so the game's speed stays the mean.
static inline f32 smooth(f32 x) { x = x < 0 ? 0 : (x > 1 ? 1 : x); return x * x * (3 - 2 * x); }
static inline f32 fmod_(f32 x, f32 L) { return x - __builtin_floorf(x / L) * L; }
static inline f32 wave(f32 y, f32 L) { f32 u = fmod_(y, L) / L; return u < 0.5f ? smooth(u * 2) : 1 - smooth((u - 0.5f) * 2); }
static inline f32 pat(f32 x, f32 y, f32 rhythm, f32 g, f32 lull) {
  f32 L = 108 - 72 * rhythm, duty = 0.55f + 0.4f * rhythm, tail = L * duty - 2;
  f32 phase = 5 * (wave(y, 40) - 0.5f) + 1.5f * (wave(y + 7, 17) - 0.5f), amp = 0.65f + 0.35f * wave(y + 11, 53);
  f32 s = fmod_(-x + phase, L);
  f32 p = s < 2 ? smooth(s / 2) : (s < 2 + tail ? 1 - smooth((s - 2) / tail) : 0);
  return 1 + g * lull * amp * (p / (duty * 0.5f) - 1);
}

// The free wind for this tick at every cell, from the recipe: the wind blows along (dx, dy) at `speed` times the
// pattern. The pattern comes in up to two generations, each laid along its own frozen heading (hx, hy) and travelled s
// metres along it; after a turn the new one fades in (weight w) while the old fades out, so nothing swings.
// Sets the inflow f, the free air above U = 1.5 f and its reach K.
EXPORT(force) void force(f32 speed, f32 dx, f32 dy, f32 g, f32 rhythm, f32 lull,
                         f32 hx0, f32 hy0, f32 s0, f32 o0, f32 hx1, f32 hy1, f32 s1, f32 o1, f32 w) {
  if (speed <= 0) {
    for (int k = 0; k < N; k++) { FX[k] = 0; FY[k] = 0; UX[k] = 0; UY[k] = 0; K[k] = K0; }
    return;
  }
  const f32 is2 = 1.0f / (speed * speed);
  for (int j = 0; j < ny; j++) {
    const f32 y = y0 + ((f32)j + 0.5f) * h;
    for (int i = 0; i < nx; i++) {
      const int k = j * nx + i;
      const f32 x = x0 + ((f32)i + 0.5f) * h;
      f32 a = 1.0f, b = 1.0f;
      if (g != 0) {
        a = pat(x * hx0 + y * hy0 - s0, y * hx0 - x * hy0 + o0, rhythm, g, lull);
        b = w != 0 ? pat(x * hx1 + y * hy1 - s1, y * hx1 - x * hy1 + o1, rhythm, g, lull) : a;
      }
      f32 mag = speed * (a + (b - a) * w), u = mag * dx, v = mag * dy;
      FX[k] = u; FY[k] = v; UX[k] = UPPER * u; UY[k] = UPPER * v;
      f32 e = ((u * u + v * v) * is2 - 0.25f) / 3.75f;
      K[k] = K0 + KG * (e < 0 ? 0 : (e > 1 ? 1 : e));
    }
  }
}

EXPORT(setFriction) void setFriction(f32 S1_) { S1 = S1_; }
EXPORT(setPace) void setPace(f32 p) { pace = p; C = C0 * p; }

// ---- Moving the air ----
#define FLUX_X(rl, ml, vl, rr, mr, vr, F0, F1, F2) { \
  f32 ul = ml / rl, ur = mr / rr, s = max_(fabs_(ul), fabs_(ur)) + C; \
  F0 = 0.5f * (ml + mr) - 0.5f * s * (rr - rl); \
  F1 = 0.5f * (ml * ul + mr * ur + c2 * (rl + rr)) - 0.5f * s * (mr - ml); \
  F2 = 0.5f * (vl * ul + vr * ur) - 0.5f * s * (vr - vl); }
#define FLUX_Y(rl, ml, vl, rr, mr, vr, F0, F1, F2) { \
  f32 ul = vl / rl, ur = vr / rr, s = max_(fabs_(ul), fabs_(ur)) + C; \
  F0 = 0.5f * (vl + vr) - 0.5f * s * (rr - rl); \
  F1 = 0.5f * (ml * ul + mr * ur) - 0.5f * s * (mr - ml); \
  F2 = 0.5f * (vl * ul + vr * ur + c2 * (rl + rr)) - 0.5f * s * (vr - vl); }

// The rate of change of (rho, rho*u, rho*v) from the fluxes through each cell's faces. Loops run over whole rows with
// masks rather than branches, so they vectorise.
static void rhs(const f32 *restrict Q0, const f32 *restrict Q1, const f32 *restrict Q2,
                f32 *restrict oR, f32 *restrict oM, f32 *restrict oV) {
  const f32 c2 = C * C, inv = 1.0f / h;
  const int W = nx + 1;
  for (int k = 0; k < N; k++) {
    f32 m = slopeX[k];
    SR[k] = m * mc(Q0[k] - Q0[k - 1], Q0[k + 1] - Q0[k]);
    SM[k] = m * mc(Q1[k] - Q1[k - 1], Q1[k + 1] - Q1[k]);
    SV[k] = m * mc(Q2[k] - Q2[k - 1], Q2[k + 1] - Q2[k]);
  }
  // x faces: interior face i of row j lies between cells i-1 and i. A solid side mirrors the other (a wall).
  for (int j = 0; j < ny; j++) {
    const int row = j * nx;
    f32 *restrict a = FX0 + j * W, *restrict b = FX1 + j * W, *restrict d = FX2 + j * W;
    for (int i = 1; i < nx; i++) {
      int kl = row + i - 1, kr = row + i;
      f32 rl = Q0[kl] + 0.5f * SR[kl], ml = Q1[kl] + 0.5f * SM[kl], vl = Q2[kl] + 0.5f * SV[kl];
      f32 rr = Q0[kr] - 0.5f * SR[kr], mr = Q1[kr] - 0.5f * SM[kr], vr = Q2[kr] - 0.5f * SV[kr];
      int soL = fluid[kl] == 0, soR = fluid[kr] == 0;
      f32 rl2 = soL ? rr : rl, ml2 = soL ? -mr : ml, vl2 = soL ? vr : vl;
      f32 rr2 = soR ? rl2 : rr, mr2 = soR ? -ml2 : mr, vr2 = soR ? vl2 : vr;
      f32 F0, F1, F2;
      FLUX_X(rl2, ml2, vl2, rr2, mr2, vr2, F0, F1, F2);
      int both = soL & soR;
      a[i] = both ? 0.0f : F0; b[i] = both ? 0.0f : F1; d[i] = both ? 0.0f : F2;
    }
    // West edge: the recipe's wind comes in if it blows inwards, else the outside copies the cell. East likewise.
    {
      int k = row; f32 rr = Q0[k], mr = Q1[k], vr = Q2[k], tu = FX[k], tv = FY[k];
      int in = tu > 0; f32 rl = in ? 1.0f : rr, ml = in ? tu : mr, vl = in ? tv : vr;
      if (fluid[k] == 0) { rr = rl; mr = -ml; vr = vl; }
      f32 F0, F1, F2; FLUX_X(rl, ml, vl, rr, mr, vr, F0, F1, F2);
      a[0] = F0; b[0] = F1; d[0] = F2;
    }
    {
      int k = row + nx - 1; f32 rl = Q0[k], ml = Q1[k], vl = Q2[k], tu = FX[k], tv = FY[k];
      int in = tu < 0; f32 rr = in ? 1.0f : rl, mr = in ? tu : ml, vr = in ? tv : vl;
      if (fluid[k] == 0) { rl = rr; ml = -mr; vl = vr; }
      f32 F0, F1, F2; FLUX_X(rl, ml, vl, rr, mr, vr, F0, F1, F2);
      a[nx] = F0; b[nx] = F1; d[nx] = F2;
    }
  }
  for (int j = 0; j < ny; j++) {
    const int row = j * nx;
    const f32 *a = FX0 + j * W, *b = FX1 + j * W, *d = FX2 + j * W;
    for (int i = 0; i < nx; i++) {
      f32 m = fluid[row + i] * inv;
      oR[row + i] = m * (a[i] - a[i + 1]); oM[row + i] = m * (b[i] - b[i + 1]); oV[row + i] = m * (d[i] - d[i + 1]);
    }
  }
  for (int k = 0; k < N; k++) {
    f32 m = slopeY[k];
    SR[k] = m * mc(Q0[k] - Q0[k - nx], Q0[k + nx] - Q0[k]);
    SM[k] = m * mc(Q1[k] - Q1[k - nx], Q1[k + nx] - Q1[k]);
    SV[k] = m * mc(Q2[k] - Q2[k - nx], Q2[k + nx] - Q2[k]);
  }
  // y faces: face row f lies between cell rows f-1 and f.
  for (int k = nx; k < N; k++) {
    int kl = k - nx, kr = k;
    f32 rl = Q0[kl] + 0.5f * SR[kl], ml = Q1[kl] + 0.5f * SM[kl], vl = Q2[kl] + 0.5f * SV[kl];
    f32 rr = Q0[kr] - 0.5f * SR[kr], mr = Q1[kr] - 0.5f * SM[kr], vr = Q2[kr] - 0.5f * SV[kr];
    int soL = fluid[kl] == 0, soR = fluid[kr] == 0;
    f32 rl2 = soL ? rr : rl, ml2 = soL ? mr : ml, vl2 = soL ? -vr : vl;
    f32 rr2 = soR ? rl2 : rr, mr2 = soR ? ml2 : mr, vr2 = soR ? -vl2 : vr;
    f32 F0, F1, F2;
    FLUX_Y(rl2, ml2, vl2, rr2, mr2, vr2, F0, F1, F2);
    int both = soL & soR;
    FY0[k] = both ? 0.0f : F0; FY1[k] = both ? 0.0f : F1; FY2[k] = both ? 0.0f : F2;
  }
  for (int i = 0; i < nx; i++) {
    {
      int k = i; f32 rr = Q0[k], mr = Q1[k], vr = Q2[k], tu = FX[k], tv = FY[k];
      int in = tv > 0; f32 rl = in ? 1.0f : rr, ml = in ? tu : mr, vl = in ? tv : vr;
      if (fluid[k] == 0) { rr = rl; mr = ml; vr = -vl; }
      f32 F0, F1, F2; FLUX_Y(rl, ml, vl, rr, mr, vr, F0, F1, F2);
      FY0[i] = F0; FY1[i] = F1; FY2[i] = F2;
    }
    {
      int k = N - nx + i; f32 rl = Q0[k], ml = Q1[k], vl = Q2[k], tu = FX[k], tv = FY[k];
      int in = tv < 0; f32 rr = in ? 1.0f : rl, mr = in ? tu : ml, vr = in ? tv : vl;
      if (fluid[k] == 0) { rl = rr; ml = mr; vl = -vr; }
      f32 F0, F1, F2; FLUX_Y(rl, ml, vl, rr, mr, vr, F0, F1, F2);
      FY0[N + i] = F0; FY1[N + i] = F1; FY2[N + i] = F2;
    }
  }
  for (int k = 0; k < N; k++) {
    f32 m = fluid[k] * inv;
    oR[k] += m * (FY0[k] - FY0[k + nx]); oM[k] += m * (FY1[k] - FY1[k + nx]); oV[k] += m * (FY2[k] - FY2[k + nx]);
  }
}

// One substep's two stages; leaves the combined state in Rs, Ms, Vs (before the source).
static void advect(f32 ds) {
  rhs(R, M, V, dR, dM, dV);
  for (int k = 0; k < N; k++) { Ra[k] = R[k] + ds * dR[k]; Ma[k] = M[k] + ds * dM[k]; Va[k] = V[k] + ds * dV[k]; }
  rhs(Ra, Ma, Va, dRs, dMs, dVs);
  for (int k = 0; k < N; k++) {
    Rs[k] = 0.5f * (R[k] + Ra[k] + ds * dRs[k]); Ms[k] = 0.5f * (M[k] + Ma[k] + ds * dMs[k]); Vs[k] = 0.5f * (V[k] + Va[k] + ds * dVs[k]);
  }
}

// ---- Carrying the shelter memory ----
// Upwind of each face's velocity, MC-limited; walls let nothing through; open air (1) comes in at the edges.
static void memoryRHS(const f32 *restrict q, f32 *restrict dq) {
  const f32 inv = 1.0f / h;
  const int W = nx + 1;
  for (int k = 0; k < N; k++) SR[k] = slopeX[k] * mc(q[k] - q[k - 1], q[k + 1] - q[k]);
  for (int j = 0; j < ny; j++) {
    const int row = j * nx;
    f32 *restrict F = FK + j * W, *restrict Fw = FW + j * W;
    for (int i = 1; i < nx; i++) {
      int kl = row + i - 1, kr = row + i;
      f32 wf = 0.5f * (WX[kl] + WX[kr]), ql = q[kl] + 0.5f * SR[kl], qr = q[kr] - 0.5f * SR[kr];
      f32 f = wf > 0 ? wf * ql : wf * qr;
      int wall = (fluid[kl] == 0) | (fluid[kr] == 0);
      F[i] = wall ? 0.0f : f; Fw[i] = wall ? 0.0f : wf;
    }
    { int k = row; f32 wf = fluid[k] == 0 ? 0.0f : WX[k]; F[0] = wf * (wf > 0 ? 1.0f : q[k]); Fw[0] = wf; }
    { int k = row + nx - 1; f32 wf = fluid[k] == 0 ? 0.0f : WX[k]; F[nx] = wf * (wf < 0 ? 1.0f : q[k]); Fw[nx] = wf; }
  }
  for (int j = 0; j < ny; j++) {
    const int row = j * nx; const f32 *F = FK + j * W, *Fw = FW + j * W;
    for (int i = 0; i < nx; i++) dq[row + i] = fluid[row + i] * inv * ((F[i] - F[i + 1]) - q[row + i] * (Fw[i] - Fw[i + 1]));
  }
  for (int k = 0; k < N; k++) SR[k] = slopeY[k] * mc(q[k] - q[k - nx], q[k + nx] - q[k]);
  for (int k = nx; k < N; k++) {
    int kl = k - nx, kr = k;
    f32 wf = 0.5f * (WY[kl] + WY[kr]), ql = q[kl] + 0.5f * SR[kl], qr = q[kr] - 0.5f * SR[kr];
    f32 f = wf > 0 ? wf * ql : wf * qr;
    int wall = (fluid[kl] == 0) | (fluid[kr] == 0);
    FKY[k] = wall ? 0.0f : f; FWY[k] = wall ? 0.0f : wf;
  }
  for (int i = 0; i < nx; i++) {
    { int k = i; f32 wf = fluid[k] == 0 ? 0.0f : WY[k]; FKY[i] = wf * (wf > 0 ? 1.0f : q[k]); FWY[i] = wf; }
    { int k = N - nx + i; f32 wf = fluid[k] == 0 ? 0.0f : WY[k]; FKY[N + i] = wf * (wf < 0 ? 1.0f : q[k]); FWY[N + i] = wf; }
  }
  for (int k = 0; k < N; k++) dq[k] += fluid[k] * inv * ((FKY[k] - FKY[k + nx]) - q[k] * (FWY[k] - FWY[k + nx]));
}

static void carryMemory(f32 ds) {
  for (int k = 0; k < N; k++) { WX[k] = fluid[k] * M[k] / R[k]; WY[k] = fluid[k] * V[k] / R[k]; }
  memoryRHS(KT, dKT);
  for (int k = 0; k < N; k++) KTa[k] = KT[k] + ds * dKT[k];
  memoryRHS(KTa, dKTs);
  for (int k = 0; k < N; k++) { f32 q = 0.5f * (KT[k] + KTa[k] + ds * dKTs[k]); KT[k] = q > 0 ? q : 0.0f; }
}

// The substeps this tick needs, from the fastest air on each axis at its start (COURANT leaves room for it to pick up
// within the tick).
static int substepsFor(f32 dt) {
  f32 px = 0, py = 0;
  for (int k = 0; k < N; k++) {
    f32 ir = fluid[k] / min_(max_(R[k], RMIN), RMAX);
    px = max_(px, fabs_(M[k] * ir));
    py = max_(py, fabs_(V[k] * ir));
  }
  f32 need = dt * ((px + C) + (py + C)) / (h * COURANT);
  int n = substeps;
  while (n < MAXSUB && (f32)n < need) n++;
  return n;
}

// Advances one tick of dt seconds. dp: a substep at the pace, for the rates (recovery is per metre, so already paced).
EXPORT(step) void step(f32 dt) {
  const int n = lastSubsteps = substepsFor(dt);
  const f32 ds = dt / (f32)n, dp = ds * pace, relax = 1.0f / (1.0f + dp / TAU), ir40 = 1.0f / RECOVERY;
  for (int s = 0; s < n; s++) {
    carryMemory(ds);
    advect(ds);
    unsigned hit = 0;
    for (int k = 0; k < N; k++) {
      f32 r = Rs[k], rc = min_(max_(r, RMIN), RMAX), fl = fluid[k];
      hit += (rc != r) & (fl != 0);
      f32 kt = KT[k], reach = K[k] * kt;
      f32 ir = 1.0f / rc, nr = 1.0f + (rc - 1.0f) * relax, keep = 1.0f / (1.0f + dp * (reach + S1 + drag[k]));
      f32 pu = (Ms[k] * ir + dp * reach * UX[k]) * keep, pv = (Vs[k] * ir + dp * reach * UY[k]) * keep;
      R[k] = fl != 0 ? nr : 1.0f;
      M[k] = fl * (nr * pu);
      V[k] = fl * (nr * pv);
      f32 rl = __builtin_sqrtf(pu * pu + pv * pv) * ir40;
      KT[k] = fl * ((kt + ds * rl) / (1.0f + ds * (rl + pace * EAT[k])));
    }
    floorHits += hit;
  }
}
