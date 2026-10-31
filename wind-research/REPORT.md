# Initial research: shared wind gusts and dust fronts

Research for the follow-up to weather issue #9, 2026-10-31. **Starting points, not a specification.** No repository files changed by this research. Experiments are under `/tmp/sol-wind/`.

**Recommendation:** make one shared field of irregular travelling wind packets, with identifiable leading edges and softer tails. Let plants, water and dust respond differently to that same wind. Separate dust already suspended in the air from fresh dust raised by a gust. Reserve a pronounced rolling wall for a storm/outflow look: ordinary gusts do not each behave like miniature haboobs.

Confidence labels below distinguish established physical behaviour from illustrative measurements and renderer choices. The most uncertain inputs are universal gust dimensions, lull depths and cat’s-paw sizes: these are distributions that depend on terrain, height and atmospheric conditions, not weather constants.

## 1. Real gusts near the ground

### Shape, scale and timing

From above, ordinary surface-layer wind is closer to **ragged, elongated tongues of faster and slower air** than round islands or parallel marching walls. A sweep brings faster air downward; an ejection carries slower air upward. The ground blocks vertical motion, so horizontal movement becomes especially prominent near it.

Useful evidence, with limits:

- Drobinski et al. describe near-surface plumes **several hundred metres long and several tens of metres wide** under slightly unstable, windy conditions; smaller intermittent features span **10–100 m**. Identified small-eddy lifetimes range from **a few seconds to several tens of seconds**, while larger streaks evolve over minutes. These are different structures, and lifetime is not the interval between successive gusts. **Medium confidence for transfer to farmland; high for the existence of multiple scales.** [The Structure of the Near-Neutral Atmospheric Surface Layer, 2004](https://journals.ametsoc.org/view/journals/atsc/61/6/1520-0469_2004_061_0699_tsotna_2.0.co_2.xml).
- A related validated simulation has streak spacings around **100 m near the surface and 200 m higher up**. This is spacing **across** elongated streaks, not an along-wind wavelength or a gust recurrence distance. [Drobinski et al., 2008](https://journals.ametsoc.org/view/journals/atsc/65/8/2007jas2333.1.xml).
- A distinct strong-wind regime after spring cold fronts in northern China has reported coherent gust periods around **3 minutes**, with strongest disturbance energy at about **120 m height**. It demonstrates a slower envelope, not a universal period for grass-height wind. [Li et al., 2023](https://doi.org/10.1029/2023JD038790).

There is no single evidence-supported aspect ratio, spacing or period for the whole 0–20 m layer. Crop-top turbulence also differs from air above the canopy. Buildings, hedges, crop height, hot ground and atmospheric stability change the pattern.

For an approximately frozen feature, **duration ≈ along-wind length / travel speed**, and **recurrence ≈ along-wind spacing / travel speed**. Example arithmetic, not measurements: a 30 m packet travelling at 6 m/s lasts about 5 s; packets spaced 90 m along one path arrive about 15 s apart. At twice the travel speed, both times halve if geometry stays fixed. In real weather the geometry also evolves.

**Propagation:** do not assume the pattern always travels slower than the local air. A structure couples air at several heights, where speeds differ. The crop measurements below actually give propagation faster than the mean at crop top. A first renderer approximation of travel near the reference-height mean is defensible; a precise universal multiplier is not established here.

### Gust factor and lulls

A meteorological gust factor is **a peak averaged over a short interval divided by a longer-period mean**. The intervals and measurement height matter. An instantaneous shader maximum is a different statistic.

- A NOAA/NWS dataset of 15 tropical cyclones found land gust factors averaging **1.53**, standard deviation **0.218**, most often **1.4–1.5**; marine factors averaged **1.23**. These are context for roughness and variability, **not a calibration for ordinary farm breezes**. [Blaes et al., NWS study](https://www.weather.gov/media/rah/science/P1.43_Blaes_GustFactor_updated.pdf).
- Thunderstorm factors can be much larger and strongly depend on the averaging window. Singapore measurements found hourly-based factors about **1.5–2 times the factors based on 10-minute means**. This is a ratio of two gust-factor definitions, not a claim that all thunderstorms have gust factor 1.5–2. [Choi & Hidayat, 2002](https://www.sciencedirect.com/science/article/abs/pii/S0167610502002799).
- NIST’s thunderstorm work cautions that stationary-wind gust-factor relationships do not transfer reliably to longer windows through a thunderstorm’s rapid wind increase. [Lombardo et al., 2011](https://www.nist.gov/publications/thunderstorm-characteristics-importance-wind-engineering-part-ii-profiles-gust-factors).

**No reliable universal lull minimum emerged.** Near calm is possible between intermittent episodes; a sustained strong wind can retain a substantial background throughout. A renderer should expose this through its gustiness mapping rather than claim a fixed natural ratio.

**Suggested art starting ranges, not measured climatology:** nearly steady means roughly 0.9–1.15 times the mean; moderate variability roughly 0.65–1.5; deliberately squally packets roughly 0.25–2.0. These must be normalized so the supplied mean remains meaningful. They are bounds/targets for a synthetic signal, not predicted 3-second gust factors.

### Fronts, ramps and storm outflows

Fast rises and slower relaxations are useful visual shorthand for an arriving sweep, but **not every ordinary wind gust is a sharp-rise/slow-decay sawtooth**. Ramp/cliff patterns in atmospheric records are particularly clear in temperature; borrowing them wholesale for horizontal speed would overstate the evidence. [Structure analysis discussing this distinction](https://www.frontiersin.org/journals/environmental-science/articles/10.3389/fenvs.2014.00047/full).

A thunderstorm outflow is a different mechanism: a body of colder, denser air spreads along the ground, undercuts warmer air, and develops a deep leading head and shallower tail. Return flow and billows occur above/behind the head. This supplies a physical reference for the developer’s rolling-front idea. [Observed density-current structure; marine case, not a farm-scale haboob measurement](https://journals.ametsoc.org/view/journals/mwre/143/9/mwr-d-14-00359.1.xml).

Its speed is not a fixed fraction of pre-existing wind: density contrast, depth and background flow all matter. Strong idealized storm simulations give **18–21 m/s** front propagation in several cases; use this as an example, not a normal-day setting. [Weisman & Rotunno, 2006](https://journals.ametsoc.org/view/journals/atsc/63/4/jas3681.1.xml).

Heating-driven convection on an ordinary sunny day also changes streaks/plumes, but is not itself a squall line or cold outflow. Speed and gustiness alone cannot identify which physical regime is present.

## 2. Crops, grass and water

### Wheat and grass

A gust pushes a patch of stalks down; they spring back and ring briefly, like a brush stroked across its bristles. The **travelling wind envelope** and the **smaller waves of plant motion** need not have the same wavelength.

Finnigan’s synthesis describes coherent crop patches **3–4 times longer along wind than across**, containing **2–3 crests**. Crop-wave propagation was measured/modelled around **1.5–1.8 times the mean wind at canopy top**. The relation is `wavelength = propagation speed / plant waving frequency`. The crests are broadly transverse to their travel, with irregular finite patches. There is scientific disagreement about how strongly plants feed back onto the turbulent flow. **High confidence in the visible response; medium in any one coupling explanation.** [Finnigan, 2010](https://www.cambridge.org/core/services/aop-cambridge-core/content/view/833E9687F35823F2862DD2C5F3408E89/S0022112010001746a.pdf/waving_plants_and_turbulent_eddies.pdf).

A concrete wheat recording reports **1.4 m wavelength, 2.2 Hz waving frequency and 3.1 m/s phase speed**. The sampled wheat was about **0.68 m tall** with individual natural frequencies **2–3 Hz**; alfalfa frequencies were **0.8–1.5 Hz**. These are examples tied to plants and growth stage, not universal crop settings. [Py, de Langre & Moulia, 2006, figure 3 and table 1](https://yakari.polytechnique.fr/Django-pub/documents/py2006rp-1pp.pdf).

For this game, retain a shared broad gust envelope and add crop-specific damped motion or a little travelling ripple inside it. Grass can reveal the same arrival through bend and changing blade highlights. Avoid assigning a scientifically precise grass wavelength without species/height data. Trees should lag and rock more slowly rather than trace every small crop crest.

At 16 px/m, a 1.4 m crop wave spans about 22 px before foreshortening; it can remain useful at the widest zoom. A 30 m wind packet spans 480 px. These should be separate scales.

### Cat’s paws

These are patches of newly roughened water: short gravity/capillary waves appear where local wind stress increases. They are **not water lumps moving bodily with the air**. The patch envelope travels with the gust, while the individual ripples have their own wave motion. Field/laboratory work confirms local, intermittent onset and rapid relaxation as wind dies, particularly at low wind speeds below roughly **6 m/s**. [Veron & Melville, 2001](https://bpb-us-w2.wpmucdn.com/sites.udel.edu/dist/b/10612/files/2020/12/Veron_Melville_JFM01.pdf).

**Low confidence in a universal size or travel ratio:** the cited work does not establish one for farm ponds. Start with a few metres to tens of metres as an explicitly artistic footprint range, controlled by the shared gust. Show it through roughness/glint changes, with a short response delay. Keep whitecaps as a separate strong-wind response; cat’s paws are not little whitecaps.

## 3. Dust: lifting, persistence and haboobs

### Lifting has a threshold, but no single farm-wide wind speed

The relevant physical quantity is near-ground wind stress, often expressed as **friction velocity** `u*`. This has m/s units but is **not the ordinary wind speed** a player sets.

Loose sandy surfaces can have threshold `u*` around **0.2–0.6 m/s**; crusted soil can resist much more. A USDA study cites **2.9 m/s friction velocity** for rain-crusted sandy loam. These illustrate why one threshold cannot cover all fields. [USDA crust/erosion study](https://www.ars.usda.gov/ARSUserFiles/6112/microphyticCrustInfluenceOnWind.pdf).

For illustration, the neutral logarithmic profile gives `U10 = (u*/0.4) ln(10/z0)` without displacement. If `z0=0.01 m`, the loose-surface range above corresponds to about **3.5–10.4 m/s at 10 m**. This is a calculation under chosen assumptions, not a farmland measurement. Crop shelter changes soil stress; increasing roughness does not simply make a field emit more dust. [USDA treatment of vegetation shelter and wind profile](https://infosys.ars.usda.gov/WindErosion/publications/Andrew_pdf/93-562-J.pdf).

A measured desert example found saltation onset at **7.70 m/s at 10 m**, versus **5.67 m/s at 0.4 m** and **6.71 m/s at 2.25 m**. It is useful evidence about height, not a prescribed threshold for farmland. [Nelli et al., 2024](https://doi.org/10.1029/2024EA003512).

Saltation means sand-sized grains hopping and striking soil, releasing finer dust. Transport is intermittent near threshold, and the threshold needed to *start* hopping may exceed that needed to *keep it going*. Thus gusts can trigger emission that persists through modest dips. [Comola et al., 2019](https://agupubs.onlinelibrary.wiley.com/doi/10.1029/2019GL085739).

**Renderer implication:** use a soft emission threshold, optional start/stop hysteresis, and a dry/exposed-source weight. A grassy or wet patch should not raise dust just because its grass bends. Existing airborne dust can still pass over it. If there is no source map, treat `setWeather` dust as transported air and label local lifting as a visual approximation.

### Height, thinning and time history

Distinguish a shallow coarse-grain sheet close to its source from suspended fine dust. A gust can stop lifting dust without making the existing cloud vanish. The cloud also moves away and mixes with cleaner air.

EPA’s example at **16 km/h** places particles above about **100 micrometres** within roughly **6–9 m of the source**; **30–100 micrometres** may travel hundreds of feet; smaller dust is much less readily removed by settling and turbulence can keep it aloft. These are source-dependent transport examples. [EPA fugitive dust guidance](https://www.epa.gov/sites/production/files/2020-10/documents/13.2_fugitive_dust_sources.pdf).

Independent order-of-magnitude check: Stokes settling for spherical mineral grains of density 2650 kg/m³ in still air gives approximately **0.0005 m/s at 2.5 µm**, **0.008 m/s at 10 µm**, and **0.07 m/s at 30 µm**. From 5 m, that is roughly **3 h, 10 min and 70 s**, respectively. These are calculations, neglecting turbulence, nonsphericity and slip corrections; they are not natural cloud-clearance times. They explain why a seconds-long lull cannot remove fine dust by gravity alone.

At a point, expect fast-ish increases from nearby lifting or an arriving plume, followed by a lingering, uneven tail. Downwind height and decay depend on mixing, sources and grain sizes; **a universal “ordinary dusty gust is X metres high and clears after Y seconds” is not supported**. For a readable near-ground effect, **1–3 m tail / 4–12 m head and 3–15 s excess decay** are candidate art ranges. Rapid decay represents dilution/advection as much as settling.

The developer’s rule is physically sound: **lull dust = background airborne dust + remaining recent dust**, rather than background multiplied toward zero. Clean air can have clear gaps; a dusty air mass stays dusty between gusts.

### Haboobs

A pronounced rolling dust wall belongs here. NOAA describes walls up to **10,000 ft (~3 km)** and generating winds up to **60 mph (~27 m/s)**, with events commonly lasting **10–30 minutes**. The wind number is **not a separately measured front propagation speed**, and event duration is not guaranteed exposure time at every point. [NOAA haboob overview](https://www.noaa.gov/stories/haboobs-phenomena-with-unusual-name-is-no-joke).

For a farm-sized view, a true haboob can cover the entire scene and extend well above the visible layer. A repeated 10 m-high crest every few seconds is a stylized dusty gust, not a literal haboob. A future outflow event could use the same rendering machinery but should be driven by game weather state rather than inferred from gustiness alone.

## 4. A proposed renderer model

### Contract first

Recommend defining supplied `speed` as the **reference mean**, provisionally at 10 m over open land. Confirm this with the game; existing settings may instead mean a desired apparent strength. Return a local velocity in m/s plus a normalized activity value. A turbine should receive velocity; a material can use activity.

**Critical determinism limitation:** instantaneous `(time, position, seed, speed, direction, gustiness)` cannot reproduce a smoothly changing wind’s past travel. Two histories can finish with the same speed/direction but different packet positions. Choose either a replayable weather timeline or a serializable shared `WindState` containing integrated displacement, transition/event state and simulation time. CPU and GPU sample the same snapshot. Dust persistence adds history too.

Do not promise bit-identical arbitrary JavaScript/GLSL floating-point math. Aim for bounded agreement, e.g. below 0.01 m/s away from intentionally discrete decisions, then measure it. Use integer-seeded event generation on the CPU and upload descriptors; avoid sine-based floating-point hashes for cross-platform identities.

### Recommended: finite travelling packets with broken fronts

Picture a short, ragged brushstroke moving downwind. Its front is more definite than its tail; adjacent strokes rarely line up perfectly.

For each packet, store position, frozen orientation, crosswind width, rise distance, tail distance, amplitude, birth time and lifespan. In packet coordinates, let `b` be distance behind its advancing edge and `r` crosswind distance:

`P = amplitude × crosswindEnvelope(r) × smoothstep(-rise, 0, b) × exp(-max(b,0)/tail)`

Use compact envelopes or smoothly truncate negligible tails. Candidate starting values, **art choices**:

| Parameter | Starting range | What it controls |
|---|---:|---|
| Leading rise | 1–4 m | Visible arrival, without a hard clipping edge |
| Tail e-fold distance | 10–30 m | How long the push relaxes behind it |
| Effective crosswind width | 10–35 m | A broken segment, not a map-wide stripe |
| Along-wind separation | 40–140 m, jittered | Typical gaps; actual arrivals depend on overlap |
| Propagation | roughly 0.8–1.2 × reference mean | Start near air speed; offer slower artistic playback separately |
| Shape evolution | 20–60 s | Bend/split slowly rather than slide rigidly |

The perceptible footprint may be several tail lengths long. This can preserve along-wind elongation even though its **leading edge** is transverse. Rise time is rise distance divided by propagation speed. At 8 m/s, a 2 m rise passes a point in 0.25 s.

Break regularity with seeded spacing/amplitudes, crosswind offsets, finite lengths, modest orientation scatter, overlapping packets at two scales, smooth births/deaths and gentle curvature. Avoid a sine wave of ridges with noise merely painted on it. Do not change packet identity whenever a time bin or spatial cell changes.

Let a bounded aggregate `F` lie in 0–1 with known ensemble mean `mu`. Map to speed with

`u / U = (1-g) + g × [lull + (peak-lull)F]`

and require `mu = (1-lull)/(peak-lull)`. For lull 0.25 and peak 2, this is about 0.429. Tune coverage or a smooth monotone remapping **offline**, not from the current camera’s samples. Otherwise panning the camera changes the wind. Intermediate `g` naturally restores the steady background. `g=0` produces a constant envelope; leaf flutter can remain separately if desired.

A high-gust setting could also reduce packet overlap, but that changes the normalization and should be calibrated. Keep large, slow wind modulation separate from the 1–3 m crop response.

**Changing direction:** integrate world-space translation; never multiply elapsed time by the newest speed or rotate a long accumulated displacement. Existing packet orientations stay fixed while their travel vector turns smoothly, and replacement packets inherit the new direction. Alternatively crossfade two frozen pattern generations, each with its own phase anchor. Do not rotate all world coordinates around the map origin: distant gusts will swing sideways. Reversals and stopping deserve explicit tests. At zero speed, fade gust strength to zero; geometric evolution may continue invisibly.

### Shared evaluation options

1. **Analytic packets, CPU-generated descriptors:** strongest control over fronts, event identity and directional changes. CPU queries are straightforward; GPU cost depends on the number of candidates. Bin events so each sample considers a small bounded neighbourhood; do not loop over hundreds of packets per grass vertex. Smooth support and inclusion margins prevent bin-edge pops.
2. **Anisotropic evolving noise with sharpened ridges:** cheaper/simpler, especially with one shared baked lookup table and the same CPU interpolation. Better as a first experiment if packets prove costly. Harder to guarantee an asymmetric arrival/tail, and rotating its coordinate frame can reintroduce lurching. Freeze frames and crossfade generations. A lookup table must be shared with plants too; using simplex for them and unrelated baked noise for dust repeats the present mismatch.

A small **world-space gust atlas** is an optimization for either approach: CPU can populate a fixed grid and upload it, then CPU queries and all GPU consumers bilinearly read the same values. Include simulation coverage beyond the camera and future movement; camera-only tiles are inadequate for off-screen turbine queries. Cache/rebase tiles without changing the underlying field. Test resolution and interpolation before choosing it: a 512² tile spanning 256 m has 0.5 m texels, four samples across a 2 m front. Multiple tiles may be necessary for larger worlds.

### Dust response and rolling depth

Use `density = background + fresh`. Fresh dust should depend on above-threshold local wind and source availability, with a short rise and slower fall. A cheap source law is `E = sourceWeight × max(u² - threshold², 0)` with artistic scaling; this is a response curve, **not a full dust-emission law**.

Two levels of complexity:

- **Analytic packet dust:** derive fresh dust from each packet’s phase, with a longer decay tail and a slight lag. Deterministic at arbitrary points and times, cheap to seek. Approximate mixing; does not remember arbitrary soil-source histories or direction changes faithfully.
- **Coarse concentration grid:** advect fresh dust with the wind, add sources, remove/dilute gradually. CPU can mirror it or own it for consistent queries. Handles history better, but requires fixed-step replay/state serialization and has numerical diffusion. Do not describe an unadvected local smoother as a transported plume.

For a cheap rolling head, pack **fresh density, local top height, front phase and activity** into a world-space texture. Give the head a taller, rounded profile and let the tail settle toward a lower profile. Bend the head’s phase as a function of height, with slow moving internal detail, to suggest curl. This is a shaped volume, not fluid simulation. Keep the curl amplitude small enough that the top does not look like a travelling hose.

Evaluate that texture **at the world position of each fog ray sample**, not only where the ray hits the land. Integrate through a conservative maximum height so tall heads are not clipped. Preserve depth stopping at surfaces. Use fixed global density units: normalizing each column by its own height can cancel the extra thickness you hoped the head would create. If physically integrating distance, use ray length (`dy / viewVerticalComponent`), then recalibrate appearance.

At the current 30° camera elevation, a 10 m layer traverses about **17 m horizontally** along the sight line. Thus surface-only density sampling cannot safely stand in for the entire ray when fronts are 1–4 m thick. Four uniform steps may miss an edge or its head: compare four, six and eight samples, or split intervals at a known head boundary. Avoid animated random sample jitter unless temporally stabilized; it could cause painterly crawl.

**Cost: estimates only; no Arc benchmark performed.** Existing fog uses four samples × two patch reads, plus two dust-gust reads and one streak read: about **11 noise texture reads per affected pixel**. One packed gust/head read at each of four samples, retaining existing patch reads and one streak read, gives about **13**. That adds roughly **4.1 million texture instructions at full 1080p coverage**. This is not 4.1 million independent memory fetches; caching matters. Six/eight ray steps cost more substantially.

A 512² RGBA16F atlas is 2 MiB, 4 MiB if double-buffered. A full CPU upload is 2 MiB/frame (~120 MiB/s at 60 fps), so generate static fields once or update compact event data / affected tiles where possible. A plausible first engineering allowance is **+0.5–2 ms**, explicitly low confidence, to be accepted or rejected by GPU timings on the Arc 140T. No honest source-free conversion from texture counts to milliseconds exists. Benchmark near/far zoom, full dust coverage, rapid direction changes and the heavy farm scene. Defer full volumetric lighting and self-shadowing until this simpler depth cue is judged.

## 5. Critique of the current implementation

Code inspected: `src/renderer/wind.ts`, `post.ts`, `fog.ts`, gust consumers in `materials.ts`, plus issue #9, epic #3, DIRECTION and ROADMAP.

**Good foundations:** integrated world-space gust displacement already avoids the classic speed-times-current-time jump. Two noise octaves moving at different speeds evolve the pattern. A shared wind interface and several consumers already exist; this need not become separate gust systems for each material.

**Why it looks soft:** the two simplex samples have no preferred orientation, no leading-edge concept and no arrival/tail asymmetry. Frequencies 0.03 and 0.08 imply nominal noise-coordinate lengths about 33 and 12.5 m, **not measured gust diameters or periodic wavelengths**. Clamping strong noise creates flat extrema as well as broad smooth transitions.

**Travel:** `0.8 + 0.4U` gives 2.8 m/s at U=5 and 7.6 m/s at U=17, about 0.56 and 0.45 of the supplied mean. That was an intentional readability choice, not an atmospheric result. At U=0 the field still travels at 0.8 m/s. It is acceptable artistically if its strength becomes invisible at calm.

**Steady does not consistently mean steady:** `windGust` retains the factor `0.4 + 1.2*gustiness`, so it varies even at gustiness zero. Trees gate its contribution by gustiness, but grass still mixes in gust-dependent bend with weight 0.4 at zero gustiness; water also reads the varying field. A common local speed should settle this inconsistency.

**Lulls are limited for trees:** the effective tree speed is bounded to `U × (1 ± 0.36g)`, so even at maximum gustiness it remains between 0.64U and 1.36U. Grass and water use other mappings. One normalized 0–1 gust value therefore does not currently mean one shared local wind speed.

**Dust is only approximately synchronized:** `dustGust` copies frequencies and offsets but reads the periodic baked gradient noise; plants use analytic simplex noise. These are different functions, not merely different precision. Their strongest fronts need not coincide.

**Saturation diagnosis is right, with a caveat:** `opacity = 0.85 × (1-exp(-tau))`. At tau=3, doubling to 6 changes opacity **0.808 → 0.848**, only 0.040. The derivative tends toward zero in thick dust. But a sufficiently deep trough *can* make a large difference: tau=0.3 gives 0.220. Inspect the actual preset multipliers and histogram of tau before concluding that every kind of modulation is invisible. The floor of 0.1 in `fogDust` does not itself prove saturation throughout the scene.

**No concentration memory:** `fogDust` changes instantaneously with the gust and modulates existing haze, rather than distinguishing emission from suspended dust. It cannot naturally express background-dependent clearing and lingering emission tails.

**No head depth:** all dust modulation is sampled once at the surface and multiplied after the four fog steps. It cannot reveal the leading curl separately at height, and changing density alone cannot create a taller head.

**Further transition risk:** the integrated gust displacement is good, but `fogPatch` and streak coordinates still project absolute world position onto the changing current direction. Easing helps but does not stop a distant pattern swinging during rotation. Preserve/freeze spatial frames as well as displacement phase.

## Experiments and their limits

- `/tmp/sol-wind/point-history.png`: exact mathematical translation of the present scalar simplex field and tree speed mapping, alongside a bounded candidate. Mean input 8 m/s, maximum gustiness. Candidate uses seeded packet events, 6 m/s travel and slow front curvature. Its sampled 120 s mean is about **8.28 m/s**, range **2.29–15.37 m/s**; present tree input spans **5.12–10.88 m/s**. Ensemble normalization does not guarantee every short point record has exactly the requested mean. Max/sample-mean is **not a meteorological gust factor**.
- The dust panels are **illustrative column calculations**, not in-game screenshots or calibrated concentrations. Current comparison uses optical depth 3 and gust multiplier strength 2, with streaks and spatial ray integration omitted. Candidate uses a threshold at 8 m/s, one-second rise and five-second decay plus two background optical depths (0.12 and 2). The local smoother demonstrates persistence but does not simulate transport. Dust values and response strengths differ intentionally; this is not a matched-density performance/look A/B.
- `/tmp/sol-wind/field-strip.png`: 180 × 120 m top-down maps at 0, 3 and 6 seconds. Current/candidate rows have different scalar meanings, stated in labels. Judge front shape and displacement, not absolute intensity. The prototype still looks too stripe-like in places; vary packet orientation and break front segments further before adopting it. It is a sketch of a candidate, not the selected art direction.
- `/tmp/sol-wind/dust-head-section.png`: illustrative vertical section of a roughly 10 m head with a lower tail. This is a renderer-scale dust packet, not a 3 km haboob.
- `/tmp/sol-wind/experiment.py` and `experiment-stats.json`: reproducible throwaway code and results. Simplex translation uses float64 and is not a GPU bit-parity test. No renderer performance measurements were made.

## Questions for the implementation thread

1. Does `speed` mean a 10 m reference mean, a crop-height mean, or an apparent strength? Recommend documenting a reference mean and preserving it statistically.
2. At maximum gustiness, should lulls nearly stop exposed vegetation, or retain substantial lean? Compare moderate and deep-lull mappings in the demo before selecting.
3. Is the rolling head wanted for ordinary dusty weather, or chiefly an approaching storm? Recommend subtle low packets normally and an explicit outflow look for dramatic walls.
4. Can the game supply a dry/exposed-soil mask, and distinguish background dust from local emission? Otherwise keep source thresholding as an acknowledged visual approximation.
5. Must queries and arbitrary-time replay work for changing wind? If yes, agree on a shared state/timeline contract before implementing the field.
6. How much contrast and travel speed remains calm enough for the farm? Compare physically paced packets against modestly slowed packets at both zoom extremes, with grass, trees, dust and water visible together.

Suggested first reviewable unit: shared local-wind definition, deterministic sampling/transition handling, and a field debug view. Then show packet/noise look candidates in the demo with URL options, followed by dust depth. Keep the art choice with the developer and record it in the follow-up issue.
