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
// of a cell in one (worked out from the wind itself as the tick goes, so it's the same on every replay):
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
// each axis): about 0.85 is where a diagonal storm starts to blow up, so this leaves room. And the most substeps a tick:
// air faster than they allow is held to it (another safety bound, counted with the others; no tested wind reaches it).
static const f32 COURANT = 0.7f;
static const int MAXSUB = 128;

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
// A float of zero or more as its bits, which order the same as the float: a running largest of these vectorises (one
// of floats doesn't, without fast-math), and turns back exactly. NaN orders above everything.
typedef unsigned u32;
static inline u32 bits(f32 x) { return __builtin_bit_cast(u32, x); }
static inline f32 unbits(u32 x) { return __builtin_bit_cast(f32, x); }
static inline u32 umax(u32 a, u32 b) { return a > b ? a : b; }
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
// ---- The gust recipe (#36; Sol's research, tools/research-wind36 in her worktree, summed up in docs/WIND.md) ----
// Gusts come one to an interval: the intervals follow each other along the wind, each its own length (0.4 to 1.6 of
// the usual), and each holds one gust with its own strength, length, rise (1 to 2 s, or now and then a 0.3 s slap) and fall,
// all from a seeded hash of the interval's number, so the same seed gives the same gusts. Each interval's gust is
// balanced against a lull over the rest of it, so the recipe's mean over every interval is exactly 1 whatever the gust:
// that is what keeps the game's average from drifting with the luck of the draw. The caller sets each generation of
// gusts (a heading, the interval's length in metres and in seconds, the lull floor B and the peak ceiling H) and the
// spell (the slow swell of gusty and quiet minutes); the fronts bend and their strength varies along them, as before.
static inline f32 smooth(f32 x) { x = x < 0 ? 0 : (x > 1 ? 1 : x); return x * x * (3 - 2 * x); }
static inline f32 fmod_(f32 x, f32 L) { return x - __builtin_floorf(x / L) * L; }
static inline f32 wave(f32 y, f32 L) { f32 u = fmod_(y, L) / L; return u < 0.5f ? smooth(u * 2) : 1 - smooth((u - 0.5f) * 2); }

static u32 seed;
static inline u32 hash(u32 a) { a ^= a >> 16; a *= 0x7feb352dU; a ^= a >> 15; a *= 0x846ca68bU; a ^= a >> 16; return a; }
// A seeded random number in [0, 1) for interval k, one stream per salt.
static inline f32 rnd(u32 k, u32 salt) { return (f32)(hash((k ^ seed) + salt * 0x9e3779b9U) >> 8) * (1.0f / 16777216.0f); }

// A generation of gusts: its heading (hx, hy), how far across it's shifted (o), an interval's usual length in metres
// (L) and seconds (T), the lull floor and peak ceiling at full gustiness (B, H), the share of slaps, and where it is:
// interval k0 + p is at the world's centre now (k0 whole, p small, so it stays exact however long the game runs).
typedef struct { f32 hx, hy, o, L, T, B, H, slap, p; u32 k0; } Gen;
static Gen gens[2];
// An interval (numbered from k0): where it starts, its length (in intervals), its gust's share of it (d), rise and fall
// (shares of the gust), its tilt (> 0 it hits hardest at first and eases off, < 0 it builds to the end), the gust's
// share Q of the mean, and how strong the gust is before the strength along the front
// and the spell.
typedef struct { f32 left, span, d, rise, fall, tilt, Q, budget; } Interval;
#define MAXI 128
static Interval table[2][MAXI];
static int tmin[2], tn[2];

EXPORT(setSeed) void setSeed(u32 s) { seed = s; }
EXPORT(setGusts) void setGusts(int slot, f32 hx, f32 hy, f32 o, f32 L, f32 T, f32 B, f32 H, f32 slap, u32 k0, f32 p) {
  Gen *G = &gens[slot & 1];
  G->hx = hx; G->hy = hy; G->o = o; G->L = L; G->T = T; G->B = B; G->H = H; G->slap = slap; G->k0 = k0; G->p = p;
}

// Where interval k0 + k starts, in intervals from k0: k, moved up to 0.3 either way.
static inline f32 edge(const Gen *G, int k) { return (f32)k + 0.3f * (2 * rnd(G->k0 + (u32)k, 17) - 1); }

static void interval(const Gen *G, int k, Interval *I) {
  const u32 n = G->k0 + (u32)k;
  const f32 left = edge(G, k), span = edge(G, k + 1) - left, seconds = span * G->T;
  // The gust's peak (up to the ceiling H) and the lull's floor (down to B, now and then shallower), at full gustiness,
  // strength along the front and spell; then the gust's length that balances them over the interval, so a long
  // interval holds a long push and a long lull, both full strength. It builds over 1 to 2 s (or slaps in 0.3) and dies
  // away over 1 to 2.5.
  // One in six intervals is a quiet one, its gust barely there, so the gusts don't come like clockwork. (0.03 kept
  // clear of each bound for the spell's own swell.)
  const f32 strength = rnd(n, 59) < 0.16f ? 0.1f + 0.15f * rnd(n, 53) : 0.55f + 0.45f * rnd(n, 53);
  const f32 peak = 1 + (G->H - 1.03f) * strength, floor = G->B + 0.03f + (0.97f - G->B) * 0.3f * rnd(n, 131);
  f32 rise = rnd(n, 97) < G->slap ? 0.3f : 1 + rnd(n, 71), fall = 1 + 1.5f * rnd(n, 113);
  const f32 length = min_((1 - floor) / (peak - floor) * seconds + 0.5f * (rise + fall), 0.9f * seconds);
  if (rise + fall > length) { const f32 s = length / (rise + fall); rise *= s; fall *= s; }
  I->left = left; I->span = span; I->d = length / seconds; I->rise = rise / length; I->fall = fall / length;
  // Some gusts hit hardest at first and ease off, some build through, some hold: the gust times 1 - tilt u (or
  // 1 + tilt (1 - u) when it builds). Its mean, exactly: the ramps' and the hold's, less the tilt times their moment.
  const f32 r = I->rise, f = I->fall, tilt = 0.6f * (rnd(n, 157) - 0.4f), area = 1 - 0.5f * (r + f);
  const f32 moment = 0.35f * r * r + 0.5f * ((1 - f) * (1 - f) - r * r) + f * (0.5f - 0.35f * f);
  I->tilt = tilt;
  I->Q = I->d * (tilt >= 0 ? area - tilt * moment : area + tilt * (area - moment));
  // How far the gust goes over and the lull under, balanced over the interval (the two agree unless the gust was cut
  // short to fit, when the nearer bound holds).
  I->budget = min_((1 - floor) / I->Q, (peak - 1) / (1 - I->Q));
}

// The intervals that cross the world this tick, from the furthest upwind to the furthest down, one either side spare.
static void tabulate(int g, f32 halfX, f32 halfY) {
  const Gen *G = &gens[g];
  const f32 reach = (fabs_(G->hx) * halfX + fabs_(G->hy) * halfY) / G->L + 0.05f;
  const int lo = (int)__builtin_floorf(G->p - reach) - 1, hi = (int)__builtin_floorf(G->p + reach) + 1;
  tmin[g] = lo; tn[g] = hi - lo + 1 > MAXI ? MAXI : hi - lo + 1;
  for (int i = 0; i < tn[g]; i++) interval(G, lo + i, &table[g][i]);
}

// The gust's part of the recipe at a point (x, y from the world's centre), before gustiness: positive in the gust,
// negative in the lull, averaging 0 over each interval.
static inline f32 gust(int g, f32 x, f32 y, f32 spell) {
  const Gen *G = &gens[g];
  const f32 along = x * G->hx + y * G->hy, across = y * G->hx - x * G->hy + G->o;
  const f32 bend = (5 * (wave(across, 40) - 0.5f) + 1.5f * (wave(across + 7, 17) - 0.5f)) / 108;
  const f32 amp = 0.65f + 0.35f * wave(across + 11, 53);
  const f32 z = G->p - along / G->L - bend;
  int k = (int)__builtin_floorf(z);
  Interval spare;
  const Interval *I;
  // The interval the point is in: its number's, or the one before or after (an edge moves at most 0.3).
  for (int pass = 0;; pass++) {
    const int i = k - tmin[g];
    if (i >= 0 && i < tn[g]) I = &table[g][i]; else { interval(G, k, &spare); I = &spare; }
    if (pass) break;
    if (z < I->left) k--; else if (z >= I->left + I->span) k++; else break;
  }
  const f32 u = ((z - I->left) / I->span - 0.5f * (1 - I->d)) / I->d;
  const f32 pulse = smooth(u / I->rise) * smooth((1 - u) / I->fall) * (I->tilt >= 0 ? 1 - I->tilt * u : 1 + I->tilt * (1 - u));
  return amp * spell * I->budget * (pulse - I->Q);
}

// The free wind for this tick at every cell, from the recipe: the wind blows along (dx, dy) at `speed` times
// 1 + g (0.03 swell + gust). The gusts come in up to two generations (set by setGusts); after a turn or a change of
// pace the new one fades in (weight w) while the old fades out, so nothing swings or jumps. `swell` is the spell, -1
// (quiet) to 1 (gusty), and `spell` the gusts' strength in it.
// Sets the inflow f, the free air above U = 1.5 f and its reach K.
EXPORT(force) void force(f32 speed, f32 dx, f32 dy, f32 g, f32 swell, f32 spell, f32 w) {
  if (speed <= 0) {
    for (int k = 0; k < N; k++) { FX[k] = 0; FY[k] = 0; UX[k] = 0; UY[k] = 0; K[k] = K0; }
    return;
  }
  const f32 is2 = 1.0f / (speed * speed), halfX = 0.5f * (f32)nx * h, halfY = 0.5f * (f32)ny * h;
  if (g != 0) { tabulate(0, halfX, halfY); if (w != 0) tabulate(1, halfX, halfY); }
  const f32 base = 1 + g * 0.03f * swell;
  for (int j = 0; j < ny; j++) {
    const f32 y = ((f32)j + 0.5f) * h - halfY;
    for (int i = 0; i < nx; i++) {
      const int k = j * nx + i;
      const f32 x = ((f32)i + 0.5f) * h - halfX;
      f32 a = 1.0f, b = 1.0f;
      if (g != 0) {
        a = base + g * gust(0, x, y, spell);
        b = w != 0 ? base + g * gust(1, x, y, spell) : a;
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

// The substeps needed for `left` seconds, with the air no faster than px, py on each axis.
static int substepsFor(f32 left, f32 px, f32 py) {
  f32 need = left * ((px + C) + (py + C)) / (h * COURANT);
  int n = 1;
  while (n < MAXSUB && (f32)n < need) n++;
  return n;
}

// Advances one tick of dt seconds, in substeps planned from the fastest air: at the tick's start, the inflow at the edges,
// and after each substep (a gust can speed the air up within a tick; the source is implicit, so a substep never makes it
// faster than the air before it or the free air it's pulled towards, and planning after each keeps every substep's
// carrying within COURANT). While the plan holds, the substeps are equal: in a breeze, the n set up. dp: a substep at the
// pace, for the rates (recovery is per metre, so already paced).
EXPORT(step) void step(f32 dt) {
  // The air, and the free air (the inflow at the edges, which stays put through the tick).
  u32 bx = 0, by = 0, ex = 0, ey = 0;
  for (int k = 0; k < N; k++) {
    f32 ir = fluid[k] / min_(max_(R[k], RMIN), RMAX);
    bx = umax(bx, bits(fabs_(M[k] * ir))); by = umax(by, bits(fabs_(V[k] * ir)));
    ex = umax(ex, bits(fabs_(FX[k]))); ey = umax(ey, bits(fabs_(FY[k])));
  }
  int n = substepsFor(dt, unbits(umax(bx, ex)), unbits(umax(by, ey)));
  if (n < substeps) n = substeps;
  // The most a substep can carry at, per axis, within MAXSUB substeps a tick.
  const f32 cap = max_(0.0f, (f32)MAXSUB * h * COURANT / dt - 2.0f * C) * 0.5f;
  f32 ds = dt / (f32)n;
  int done = 0;
  for (int s = 0; s < n; s++, done++) {
    const f32 dp = ds * pace, relax = 1.0f / (1.0f + dp / TAU), ir40 = 1.0f / RECOVERY;
    carryMemory(ds);
    advect(ds);
    unsigned hit = 0;
    u32 qx = 0, qy = 0;
    for (int k = 0; k < N; k++) {
      f32 r = Rs[k], rc = min_(max_(r, RMIN), RMAX), fl = fluid[k];
      f32 kt = KT[k], reach = K[k] * kt;
      f32 ir = 1.0f / rc, nr = 1.0f + (rc - 1.0f) * relax, keep = 1.0f / (1.0f + dp * (reach + S1 + drag[k]));
      f32 pu0 = (Ms[k] * ir + dp * reach * UX[k]) * keep, pv0 = (Vs[k] * ir + dp * reach * UY[k]) * keep;
      f32 pu = min_(max_(pu0, -cap), cap), pv = min_(max_(pv0, -cap), cap);
      hit += ((rc != r) | (pu != pu0) | (pv != pv0)) & (fl != 0);
      R[k] = fl != 0 ? nr : 1.0f;
      M[k] = fl * (nr * pu);
      V[k] = fl * (nr * pv);
      qx = umax(qx, bits(fl * fabs_(pu))); qy = umax(qy, bits(fl * fabs_(pv)));
      f32 rl = __builtin_sqrtf(pu * pu + pv * pv) * ir40;
      KT[k] = fl * ((kt + ds * rl) / (1.0f + ds * (rl + pace * EAT[k])));
    }
    floorHits += hit;
    // Faster than planned for: the rest of the tick in more, shorter substeps.
    int rest = n - s - 1;
    if (rest > 0) {
      f32 left = ds * (f32)rest;
      int more = substepsFor(left, unbits(umax(qx, ex)), unbits(umax(qy, ey)));
      if (more > MAXSUB - done - 1) more = MAXSUB - done - 1;
      if (more > rest) { ds = left / (f32)more; n = s + 1 + more; }
    }
  }
  lastSubsteps = done;
}
