/**
 * A circuit-board cover: traces routed on a square grid (straight runs with 45° bends, like PCB
 * routing), square pads at each end, and colored pulses travelling along them. The board is laid
 * out once per size on an offscreen canvas; each frame only draws the pulses on top.
 */

type Node = { x: number; y: number };

type Trace = {
    points: { x: number; y: number }[]; // pixel vertices
    lengths: number[]; // cumulative length at each vertex
    total: number;
    color: string;
    speed: number; // px per second
    cycle: number; // px travelled per loop: the trace, its tail, then a gap
    offset: number;
};

const PITCH = 16; // grid spacing in CSS px
const TAIL = 44; // pulse tail length in px
const PAD = 5; // pad size in px
const COLORS = [ '222 184 120', '236 112 84', '152 104 232', '66 194 184' ]; // gold, ember, violet, teal

// Eight directions, clockwise from east; y grows downward
const DIRS: [number, number][] = [ [ 1, 0 ], [ 1, 1 ], [ 0, 1 ], [ -1, 1 ], [ -1, 0 ], [ -1, -1 ], [ 0, -1 ], [ 1, -1 ] ];

// A small seeded random source, so the board looks the same on every visit at a given size
const seeded = (seed: number) => () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

/** Routes traces on a cols × rows grid without overlaps or crossings */
const route = (cols: number, rows: number, rand: () => number): Node[][] => {
    const taken = new Uint8Array(cols * rows);
    const diagonals = new Map<string, number>(); // cell → which diagonal(s) pass through it
    const inside = (x: number, y: number) => x >= 0 && y >= 0 && x < cols && y < rows;
    const free = (x: number, y: number, extra: Set<number>) => inside(x, y) && !taken[y * cols + x] && !extra.has(y * cols + x);
    const diagKey = (x: number, y: number, dx: number, dy: number) => `${Math.min(x, x + dx)},${Math.min(y, y + dy)}`;
    const diagBit = (dx: number, dy: number) => (dx * dy > 0 ? 1 : 2);

    const commit = (path: Node[]) => {
        path.forEach(({ x, y }, i) => {
            taken[y * cols + x] = 1;
            const next = path[i + 1];
            if (next && next.x !== x && next.y !== y) {
                const key = diagKey(x, y, next.x - x, next.y - y);
                diagonals.set(key, (diagonals.get(key) ?? 0) | diagBit(next.x - x, next.y - y));
            }
        });
    };

    const fits = (path: Node[]) => {
        const seen = new Set<number>();
        for (let i = 0; i < path.length; i++) {
            const { x, y } = path[i];
            if (!free(x, y, seen)) {
                return false;
            }
            seen.add(y * cols + x);
            const next = path[i + 1];
            if (next && next.x !== x && next.y !== y) {
                const used = diagonals.get(diagKey(x, y, next.x - x, next.y - y)) ?? 0;
                if (used) {
                    return false; // a diagonal already crosses this cell
                }
            }
        }
        return true;
    };

    // Walk from a start node: mostly straight, with short 45° jogs and the odd 90° turn made of two 45° steps
    const walk = (start: Node, base: number): Node[] => {
        const path = [ start ];
        const seen = new Set([ start.y * cols + start.x ]);
        let dir = base;
        let jog = 0;
        const maxLength = 6 + Math.floor(rand() * 26);

        for (let step = 0; step < maxLength; step++) {
            if (jog > 0) {
                jog--;
                if (jog === 0) {
                    dir = base;
                }
            } else if (rand() < 0.14) {
                const side = rand() < 0.5 ? 1 : -1;
                if (rand() < 0.35) {
                    base = (base + 2 * side + 8) % 8; // a corner: one diagonal step, then the new heading
                    dir = (dir + side + 8) % 8;
                    jog = 1;
                } else {
                    dir = (base + side + 8) % 8; // a jog: a few diagonal steps, then back
                    jog = 1 + Math.floor(rand() * 3);
                }
            }

            const last = path[path.length - 1];
            const [ dx, dy ] = DIRS[dir];
            const next = { x: last.x + dx, y: last.y + dy };
            if (!free(next.x, next.y, seen)) {
                break;
            }
            if (dx && dy && (diagonals.get(diagKey(last.x, last.y, dx, dy)) ?? 0)) {
                break;
            }
            path.push(next);
            seen.add(next.y * cols + next.x);
        }
        return path;
    };

    const traces: Node[][] = [];
    const attempts = Math.round((cols * rows) / 6);
    for (let i = 0; i < attempts; i++) {
        const start = { x: Math.floor(rand() * cols), y: Math.floor(rand() * rows) };
        if (!free(start.x, start.y, new Set())) {
            continue;
        }
        // Buses run mostly sideways across the banner
        const base = rand() < 0.72 ? (rand() < 0.5 ? 0 : 4) : (rand() < 0.5 ? 2 : 6);
        const path = walk(start, base);
        if (path.length < 5 || !fits(path)) {
            continue;
        }
        commit(path);
        traces.push(path);

        // Sometimes run one or two parallel copies beside it, like a data bus
        if (rand() < 0.45) {
            const horizontal = base === 0 || base === 4;
            const copies = 1 + Math.floor(rand() * 2);
            for (let c = 1; c <= copies; c++) {
                const shift = 2 * c;
                const copy = path.map(({ x, y }) => (horizontal ? { x, y: y + shift } : { x: x + shift, y }));
                if (!fits(copy)) {
                    break;
                }
                commit(copy);
                traces.push(copy);
            }
        }
    }
    return traces;
};

// Keep only the nodes where the direction changes
const corners = (path: Node[]) => path.filter((node, i) => {
    const prev = path[i - 1];
    const next = path[i + 1];
    if (!prev || !next) {
        return true;
    }
    return node.x - prev.x !== next.x - node.x || node.y - prev.y !== next.y - node.y;
});

const pointAt = (trace: Trace, distance: number) => {
    const d = Math.min(Math.max(distance, 0), trace.total);
    let i = 1;
    while (i < trace.lengths.length - 1 && trace.lengths[i] < d) {
        i++;
    }
    const a = trace.points[i - 1];
    const b = trace.points[i];
    const span = trace.lengths[i] - trace.lengths[i - 1] || 1;
    const f = (d - trace.lengths[i - 1]) / span;
    return { x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f };
};

/** Starts the cover on a canvas; returns a cleanup function */
export const startCircuit = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        return () => {};
    }
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const board = document.createElement('canvas');
    let traces: Trace[] = [];
    let width = 0;
    let height = 0;
    let dpr = 1;
    let frame = 0;
    let visible = true;
    const start = performance.now();

    const layout = () => {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = canvas.clientWidth;
        height = canvas.clientHeight;
        if (!width || !height) {
            return;
        }
        canvas.width = board.width = Math.round(width * dpr);
        canvas.height = board.height = Math.round(height * dpr);

        const cols = Math.floor(width / PITCH) + 1;
        const rows = Math.floor(height / PITCH) + 1;
        const ox = Math.round((width - (cols - 1) * PITCH) / 2) + 0.5;
        const oy = Math.round((height - (rows - 1) * PITCH) / 2) + 0.5;
        const rand = seeded(cols * 131 + rows);
        const toPx = ({ x, y }: Node) => ({ x: ox + x * PITCH, y: oy + y * PITCH });

        traces = route(cols, rows, rand).map((path, i) => {
            const points = corners(path).map(toPx);
            const lengths = [ 0 ];
            for (let p = 1; p < points.length; p++) {
                lengths.push(lengths[p - 1] + Math.hypot(points[p].x - points[p - 1].x, points[p].y - points[p - 1].y));
            }
            const total = lengths[lengths.length - 1];
            const speed = 38 + rand() * 46;
            return {
                points,
                lengths,
                total,
                color: COLORS[i % COLORS.length],
                speed,
                cycle: total + TAIL + 60 + rand() * 280,
                offset: rand() * 2000,
            };
        });

        // The static board: grid points, dim traces, and square pads at each end
        const b = board.getContext('2d');
        if (!b) {
            return;
        }
        b.setTransform(dpr, 0, 0, dpr, 0, 0);
        b.clearRect(0, 0, width, height);
        b.fillStyle = 'rgb(255 255 255 / 0.07)';
        for (let x = 0; x < cols; x++) {
            for (let y = 0; y < rows; y++) {
                b.fillRect(ox + x * PITCH - 0.5, oy + y * PITCH - 0.5, 1, 1);
            }
        }
        b.lineWidth = 1;
        b.lineJoin = 'miter';
        b.strokeStyle = 'rgb(255 255 255 / 0.11)';
        for (const { points } of traces) {
            b.beginPath();
            points.forEach(({ x, y }, i) => (i ? b.lineTo(x, y) : b.moveTo(x, y)));
            b.stroke();
        }
        b.strokeStyle = 'rgb(255 255 255 / 0.2)';
        b.fillStyle = '#0a0a0b';
        for (const { points } of traces) {
            for (const { x, y } of [ points[0], points[points.length - 1] ]) {
                b.fillRect(x - PAD / 2, y - PAD / 2, PAD, PAD);
                b.strokeRect(x - PAD / 2, y - PAD / 2, PAD, PAD);
            }
        }
    };

    const draw = (now: number) => {
        frame = 0;
        if (!width) {
            return;
        }
        const seconds = still ? 14 : (now - start) / 1000;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(board, 0, 0);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.lineWidth = 1.5;
        ctx.lineCap = 'square';

        for (const trace of traces) {
            const head = (seconds * trace.speed + trace.offset) % trace.cycle;

            // The pad at the far end lights up as the pulse arrives, then fades
            const since = head - trace.total;
            if (since >= 0 && since < TAIL + 60) {
                const end = trace.points[trace.points.length - 1];
                ctx.fillStyle = `rgb(${trace.color} / ${0.85 * (1 - since / (TAIL + 60))})`;
                ctx.fillRect(end.x - PAD / 2, end.y - PAD / 2, PAD, PAD);
            }

            if (head - TAIL > trace.total) {
                continue;
            }
            // Draw the tail as short pieces that fade toward the back
            const steps = 11;
            for (let s = 0; s < steps; s++) {
                const from = head - (s / steps) * TAIL;
                const to = head - ((s + 1) / steps) * TAIL;
                if (to > trace.total || from < 0) {
                    continue;
                }
                const a = pointAt(trace, from);
                const c = pointAt(trace, to);
                ctx.strokeStyle = `rgb(${trace.color} / ${Math.pow(1 - s / steps, 1.6)})`;
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(c.x, c.y);
                ctx.stroke();
            }
        }

        if (!still && visible) {
            frame = requestAnimationFrame(draw);
        }
    };

    const play = () => {
        if (!frame) {
            frame = requestAnimationFrame(draw);
        }
    };

    const resize = new ResizeObserver(() => {
        layout();
        play();
    });
    resize.observe(canvas);

    // Stop drawing while the banner is scrolled out of view
    const seen = new IntersectionObserver(([ entry ]) => {
        visible = entry.isIntersecting;
        if (visible) {
            play();
        }
    });
    seen.observe(canvas);

    return () => {
        resize.disconnect();
        seen.disconnect();
        cancelAnimationFrame(frame);
    };
};
