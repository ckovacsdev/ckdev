/*
 * Split-flap cells, like a station departure board. Each cell has two static halves and two
 * leaves. During a flip the static top already shows the next character and the static bottom
 * still shows the last one; the top leaf (last character) folds down out of the way, then the
 * bottom leaf (next character) falls into place. Characters advance through FLAP_CHARS in order,
 * the way a real drum of flaps turns.
 */

export const FLAP_CHARS = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789:.@/-'";

const FLIP_MS = 70;

/** The characters a row of `cells` flaps shows for text: upper case, padded with blank flaps. */
export const flapChars = (text: string, cells: number) => Array.from(text.toUpperCase().padEnd(cells).slice(0, cells));

export type FlapCell = {
	halves: HTMLElement[];  // static top, static bottom, top leaf, bottom leaf
	glyphs: HTMLElement[];  // the character inside each half
	char: string;
	queue: string[];
	timer: number;
	running: Animation[];
};

/** Binds the markup rendered by <SplitFlap> (one element per cell, four halves inside). */
export const bindCells = (root: Element): FlapCell[] =>
	Array.from(root.querySelectorAll<HTMLElement>('.flap'), (el) => {
		const halves = Array.from(el.children) as HTMLElement[];
		const glyphs = halves.map((half) => half.firstElementChild as HTMLElement);
		return { halves, glyphs, char: glyphs[0].textContent ?? ' ', queue: [], timer: 0, running: [] };
	});

export const isBusy = (cell: FlapCell) => cell.queue.length > 0 || cell.running.length > 0 || cell.timer !== 0;

/** Shows a character immediately, without a flip. */
export const setChar = (cell: FlapCell, char: string) => {
	for (const glyph of cell.glyphs) {
		glyph.textContent = char;
	}
	cell.char = char;
};

/** Cancels any flip in progress and settles the cell on its current character. */
export const stop = (cell: FlapCell) => {
	window.clearTimeout(cell.timer);
	cell.timer = 0;
	for (const anim of cell.running) {
		anim.cancel();
	}
	cell.running = [];
	cell.queue = [];
	setChar(cell, cell.char);
};

// The characters a cell shows on its way to target: the last `steps` before it on the drum
const approach = (target: string, steps: number) => {
	const n = FLAP_CHARS.length;
	const end = FLAP_CHARS.indexOf(target);
	if (end < 0) {
		return [target];
	}
	return Array.from({ length: steps }, (_, k) => FLAP_CHARS[(end - steps + 1 + k + n) % n]);
};

const distance = (from: string, to: string) => {
	const n = FLAP_CHARS.length;
	const a = FLAP_CHARS.indexOf(from);
	const b = FLAP_CHARS.indexOf(to);
	return a < 0 || b < 0 ? 1 : (b - a + n) % n;
};

const advance = (cell: FlapCell) => {
	cell.timer = 0;
	const next = cell.queue.shift();
	if (next === undefined) {
		return;
	}
	const [, , leafTop, leafBottom] = cell.halves;
	const [top, bottom, leafTopGlyph, leafBottomGlyph] = cell.glyphs;
	top.textContent = next;
	leafBottomGlyph.textContent = next;

	const half = FLIP_MS / 2;
	const fold = leafTop.animate(
		[{ transform: 'rotateX(0deg)', filter: 'brightness(1)' }, { transform: 'rotateX(-90deg)', filter: 'brightness(0.5)' }],
		{ duration: half, easing: 'ease-in', fill: 'forwards' },
	);
	const drop = leafBottom.animate(
		[{ transform: 'rotateX(90deg)', filter: 'brightness(1.5)' }, { transform: 'rotateX(0deg)', filter: 'brightness(1)' }],
		{ duration: half, delay: half, easing: 'ease-out', fill: 'backwards' },
	);
	cell.running = [fold, drop];

	fold.onfinish = () => {
		leafTopGlyph.textContent = next;
		fold.cancel();
	};
	drop.onfinish = () => {
		bottom.textContent = next;
		cell.char = next;
		cell.running = [];
		advance(cell);
	};
};

/**
 * Flips a cell to target after `delay` ms, turning through the drum in order. `steps` caps how
 * many flaps it turns (it starts that many characters before target); `spin` forces a full turn
 * of that many flaps even when the cell already shows target.
 */
export const flipTo = (cell: FlapCell, target: string, { delay = 0, steps = 14, spin = 0 } = {}) => {
	stop(cell);
	const count = spin || Math.min(distance(cell.char, target), steps);
	if (count === 0) {
		return;
	}
	cell.queue = approach(target, count);
	cell.timer = window.setTimeout(() => advance(cell), delay);
};
