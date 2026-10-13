/*
 * Procedural "dark deco" skyline, drawn as SVG and rasterized into textures for the hero scene.
 * A composite of 1920s New York, Chicago and Detroit: setback towers, a mast, gothic pinnacles,
 * a pyramid roof, and one hero tower with a gold crown after Chicago's Carbide & Carbon Building.
 * Everything is navy silhouette; gold appears only where light would fall (crowns, windows,
 * searchlights), the way Batman: The Animated Series painted light onto black.
 *
 * Every layer is ART_W units wide with y growing downward. The bottom GROUND units of each layer
 * are solid fill that sits below the screen edge, so vertical parallax never reveals a gap.
 */

export const ART_W = 2400;
export const HERO_U = 0.7; // horizontal position of the hero tower, as a fraction of ART_W

export type LayerArt = {
	width: number;
	height: number;
	svg: string;
};

const GOLD = '#c0914b';
const GOLD_LIGHT = '#d8b478';
const GROUND = 150;

// Small seeded PRNG so the skyline is identical on every load.
const random = (seed: number) => () => {
	seed = (seed + 0x6d2b79f5) | 0;
	let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
	t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
	return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const n = (v: number) => Math.round(v * 10) / 10;
const rect = (x: number, y: number, w: number, h: number) => `M${n(x)} ${n(y)}h${n(w)}v${n(h)}h${n(-w)}z`;

type Tier = { w: number; h: number };

/** Stacks centered tiers upward from the base; returns the path plus the top edge and width. */
const setbacks = (cx: number, base: number, tiers: Tier[]) => {
	let y = base;
	let d = '';
	for (const t of tiers) {
		d += rect(cx - t.w / 2, y - t.h, t.w, t.h);
		y -= t.h;
	}
	return { d, top: y, topW: tiers[tiers.length - 1].w };
};

const spire = (cx: number, top: number, w: number, h: number) =>
	`M${n(cx - w / 2)} ${n(top)}L${n(cx)} ${n(top - h)}L${n(cx + w / 2)} ${n(top)}z`;

const mast = (cx: number, top: number, h: number) =>
	rect(cx - 9, top - h * 0.35, 18, h * 0.35) + rect(cx - 3, top - h, 6, h * 0.65);

/** Tribune Tower style crown: a ring of thin pinnacles. */
const pinnacles = (cx: number, top: number, w: number, count: number, h: number) => {
	let d = '';
	for (let i = 0; i < count; i++) {
		const x = cx - w / 2 + (w * (i + 0.5)) / count;
		d += spire(x, top, 9, h * (i === 0 || i === count - 1 ? 0.7 : 1));
	}
	return d;
};

/** Hipped pyramid roof with a small lantern, after Detroit's Fisher Building. */
const pyramidRoof = (cx: number, top: number, w: number, h: number) =>
	`M${n(cx - w / 2)} ${n(top)}L${n(cx - w * 0.12)} ${n(top - h)}L${n(cx + w * 0.12)} ${n(top - h)}L${n(cx + w / 2)} ${n(top)}z`
	+ rect(cx - 6, top - h - 22, 12, 22) + spire(cx, top - h - 22, 12, 26);

/** Lit windows scattered on a grid inside a tier face. */
const windows = (
	rand: () => number,
	x: number,
	y: number,
	w: number,
	h: number,
	{ p, min, max }: { p: number; min: number; max: number },
) => {
	let out = '';
	const cols = Math.floor((w - 12) / 14);
	const rows = Math.floor((h - 12) / 19);
	const left = x + (w - cols * 14) / 2 + 4.5;
	for (let r = 0; r < rows; r++) {
		for (let c = 0; c < cols; c++) {
			if (rand() > p) {
				continue;
			}
			const a = min + rand() * (max - min);
			const fill = rand() < 0.25 ? GOLD_LIGHT : GOLD;
			out += `<rect x="${n(left + c * 14)}" y="${n(y + 8 + r * 19)}" width="5" height="8" fill="${fill}" fill-opacity="${a.toFixed(2)}"/>`;
		}
	}
	return out;
};

/** Vertical piers in hairline gold, the linework of a deco facade. */
const piers = (x: number, y: number, w: number, h: number, every: number, opacity: number) => {
	let d = '';
	for (let px = x + every / 2; px < x + w - 4; px += every) {
		d += `M${n(px)} ${n(y + 6)}V${n(y + h)}`;
	}
	return `<path d="${d}" stroke="${GOLD}" stroke-opacity="${opacity}" stroke-width="1.4" fill="none"/>`;
};

const wrap = (height: number, body: string) =>
	`<svg xmlns="http://www.w3.org/2000/svg" width="${ART_W}" height="${height}" viewBox="0 0 ${ART_W} ${height}">${body}</svg>`;

/** Far layer: hazy skyline, with two searchlights crossing above the hero tower. */
const farLayer = (): LayerArt => {
	const H = 1350;
	const ground = H - GROUND;
	const rand = random(1927);
	const hero = ART_W * HERO_U;

	const beam = (ox: number, angleDeg: number, length: number, id: string) => {
		const a = (angleDeg * Math.PI) / 180;
		const ex = ox + Math.sin(a) * length;
		const ey = ground - Math.cos(a) * length;
		const nx = Math.cos(a);
		const ny = Math.sin(a);
		const pts = [
			[ox - nx * 7, ground - ny * 7],
			[ox + nx * 7, ground + ny * 7],
			[ex + nx * 120, ey + ny * 120],
			[ex - nx * 120, ey - ny * 120],
		].map(([px, py]) => `${n(px)},${n(py)}`).join(' ');
		return `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${n(ox)}" y1="${ground}" x2="${n(ex)}" y2="${n(ey)}">`
			+ `<stop offset="0" stop-color="${GOLD_LIGHT}" stop-opacity="0.16"/>`
			+ `<stop offset="0.55" stop-color="${GOLD_LIGHT}" stop-opacity="0.06"/>`
			+ `<stop offset="1" stop-color="${GOLD_LIGHT}" stop-opacity="0"/></linearGradient>`
			+ `<polygon points="${pts}" fill="url(#${id})"/>`;
	};

	let d = rect(0, ground, ART_W, GROUND);
	let lights = '';
	for (let x = -30; x < ART_W + 30; ) {
		const w = 40 + rand() * 110;
		const h = 110 + rand() ** 1.6 * 320;
		const tower = setbacks(x + w / 2, ground, rand() < 0.45
			? [{ w, h: h * 0.7 }, { w: w * 0.7, h: h * 0.3 }]
			: [{ w, h }]);
		d += tower.d;
		if (rand() < 0.16) {
			d += spire(x + w / 2, tower.top, tower.topW * 0.4, 40 + rand() * 60);
		}
		lights += windows(rand, x, ground - h, w, h, { p: 0.025, min: 0.18, max: 0.35 });
		x += w * (0.55 + rand() * 0.5);
	}

	const body = beam(hero - 260, 15, 1300, 'beam-a') + beam(hero + 250, -19, 1300, 'beam-b')
		+ `<path d="${d}" fill="#20253a"/>${lights}`;
	return { width: ART_W, height: H, svg: wrap(H, body) };
};

/** Mid layer: the landmark silhouettes. */
const midLayer = (): LayerArt => {
	const H = 800;
	const ground = H - GROUND;
	const rand = random(1931);

	// Landmarks, left to right; random towers fill the gaps between them.
	const landmarks = [
		{ x: 560, half: 120 },  // pyramid roof tower (Detroit)
		{ x: 1260, half: 95 },  // setback tower with a mast (New York)
		{ x: 2110, half: 85 },  // gothic pinnacle crown (Chicago)
	];

	let d = rect(0, ground, ART_W, GROUND);
	let lights = '';

	for (let x = -30; x < ART_W + 30; ) {
		const w = 60 + rand() * 90;
		const h = x < 1050 ? 120 + rand() * 150 : 140 + rand() ** 1.4 * 240;
		const clash = landmarks.some((l) => x + w > l.x - l.half && x < l.x + l.half);
		if (!clash) {
			const tower = setbacks(x + w / 2, ground, rand() < 0.5
				? [{ w, h: h * 0.62 }, { w: w * 0.74, h: h * 0.24 }, { w: w * 0.48, h: h * 0.14 }]
				: [{ w, h }]);
			d += tower.d;
			lights += windows(rand, x, ground - h * 0.62, w, h * 0.62, { p: 0.06, min: 0.3, max: 0.6 });
		}
		x += w * (0.6 + rand() * 0.45);
	}

	// Pyramid roof tower rising from a broad base
	const fisher = setbacks(560, ground, [{ w: 230, h: 200 }, { w: 104, h: 230 }]);
	d += fisher.d + pyramidRoof(560, fisher.top, 104, 70);
	lights += windows(rand, 445, ground - 200, 230, 200, { p: 0.08, min: 0.35, max: 0.65 });
	lights += windows(rand, 508, ground - 430, 104, 230, { p: 0.07, min: 0.35, max: 0.65 });

	// Setback tower with a mast
	const empire = setbacks(1260, ground, [{ w: 180, h: 300 }, { w: 132, h: 150 }, { w: 92, h: 70 }, { w: 54, h: 40 }]);
	d += empire.d + mast(1260, empire.top, 90);
	lights += windows(rand, 1170, ground - 300, 180, 300, { p: 0.07, min: 0.35, max: 0.7 });

	// Gothic crown with pinnacles
	const tribune = setbacks(2110, ground, [{ w: 150, h: 370 }, { w: 110, h: 70 }]);
	d += tribune.d + pinnacles(2110, tribune.top, 110, 6, 46);
	lights += windows(rand, 2035, ground - 370, 150, 370, { p: 0.06, min: 0.35, max: 0.65 });

	return { width: ART_W, height: H, svg: wrap(H, `<path d="${d}" fill="#1a1e2a"/>${lights}`) };
};

/** Near layer: low blocks under the copy on the left, the gold-crowned hero tower on the right. */
const nearLayer = (): LayerArt => {
	const H = 1120; // extra headroom keeps the crown glow inside the layer
	const ground = H - GROUND;
	const rand = random(1929);
	const hero = ART_W * HERO_U;

	let d = rect(0, ground, ART_W, GROUND);
	let lights = '';
	let lines = '';

	// Low blocks on the left, kept short so they never crowd the hero copy
	for (let x = -30; x < hero - 380; ) {
		const w = 70 + rand() * 110;
		const h = 70 + rand() * 150;
		const stepped = rand() < 0.4;
		const tower = setbacks(x + w / 2, ground, stepped
			? [{ w, h: h * 0.75 }, { w: w * 0.6, h: h * 0.25 }]
			: [{ w, h }]);
		d += tower.d;
		lights += windows(rand, x, ground - h, w, h, { p: 0.05, min: 0.3, max: 0.6 });
		x += w * (0.7 + rand() * 0.4);
	}

	// Flanking towers around the hero
	const flank = (cx: number, tiers: Tier[], top: 'stepped' | 'spire' | 'flat') => {
		const tower = setbacks(cx, ground, tiers);
		d += tower.d;
		if (top === 'stepped') {
			d += setbacks(cx, tower.top, [{ w: tower.topW * 0.7, h: 22 }, { w: tower.topW * 0.4, h: 18 }]).d;
		} else if (top === 'spire') {
			d += spire(cx, tower.top, tower.topW * 0.3, 120);
		}
		let y = ground;
		for (const t of tiers) {
			lines += piers(cx - t.w / 2, y - t.h, t.w, t.h, 22, 0.11);
			lights += windows(rand, cx - t.w / 2, y - t.h, t.w, t.h, { p: 0.06, min: 0.35, max: 0.7 });
			y -= t.h;
		}
	};
	flank(hero - 330, [{ w: 170, h: 300 }], 'flat');
	flank(hero - 190, [{ w: 150, h: 380 }, { w: 112, h: 90 }], 'stepped');
	flank(hero + 230, [{ w: 160, h: 420 }, { w: 120, h: 80 }, { w: 76, h: 40 }], 'spire');
	flank(hero + 420, [{ w: 190, h: 260 }], 'stepped');
	flank(hero + 610, [{ w: 150, h: 330 }, { w: 100, h: 60 }], 'flat');

	// Hero tower: slender dark shaft, gold piers, stepped gold crown and spire
	const shaft: Tier[] = [{ w: 190, h: 430 }, { w: 150, h: 120 }, { w: 116, h: 70 }];
	const tower = setbacks(hero, ground, shaft);
	d += tower.d;
	let y = ground;
	for (const t of shaft) {
		lines += piers(hero - t.w / 2, y - t.h, t.w, t.h, 19, 0.3);
		lights += windows(rand, hero - t.w / 2, y - t.h, t.w, t.h, { p: 0.09, min: 0.45, max: 0.85 });
		y -= t.h;
	}
	const crown = setbacks(hero, tower.top, [{ w: 96, h: 40 }, { w: 70, h: 36 }, { w: 44, h: 30 }]);
	const crownD = crown.d + spire(hero, crown.top, 20, 96);
	let fins = '';
	for (const t of [{ w: 96, y: tower.top - 40, h: 40 }, { w: 70, y: tower.top - 76, h: 36 }]) {
		for (let fx = hero - t.w / 2 + 8; fx < hero + t.w / 2 - 4; fx += 9) {
			fins += `M${n(fx)} ${n(t.y + 4)}V${n(t.y + t.h)}`;
		}
	}
	const glow = `<radialGradient id="crown-glow" cx="${hero}" cy="${n(tower.top - 40)}" r="230" gradientUnits="userSpaceOnUse">`
		+ `<stop offset="0" stop-color="${GOLD}" stop-opacity="0.2"/><stop offset="1" stop-color="${GOLD}" stop-opacity="0"/></radialGradient>`
		+ `<circle cx="${hero}" cy="${n(tower.top - 40)}" r="230" fill="url(#crown-glow)"/>`;

	const body = glow
		+ `<path d="${d}" fill="#14171f"/>${lines}${lights}`
		+ `<path d="${crownD}" fill="${GOLD}"/>`
		+ `<path d="${fins}" stroke="#14171f" stroke-opacity="0.45" stroke-width="2" fill="none"/>`;
	return { width: ART_W, height: H, svg: wrap(H, body) };
};

/** Back to front. */
export const buildLayers = (): LayerArt[] => [farLayer(), midLayer(), nearLayer()];

export const GROUND_UNITS = GROUND;
