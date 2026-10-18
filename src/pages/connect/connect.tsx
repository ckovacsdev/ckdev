import { useLayoutEffect, useRef, type CSSProperties } from 'react';
import { FiArrowUpRight, FiCopy } from 'react-icons/fi';
import { CofferWall } from '../../components/coffer-wall/coffer-wall';
import { SplitFlap } from '../../components/split-flap/split-flap';
import { bindCells, flapChars, flipTo, isBusy, setChar, stop, type FlapCell } from '../../components/split-flap/flap-engine';
import { GITHUB_URL, LINKEDIN_URL, RESUME_PATH } from '../../data/links';
import { useCopyEmail } from '../../hooks/useCopyEmail';
import './connect.css';

const MARQUEE = 'Departures';
const CLOCK_CELLS = 8;

// The email address never appears on the page; its row copies it to the clipboard instead
type Route = { destination: string; via: string } & ({ href: string } | { copiesEmail: true });

const ROUTES: Route[] = [
    { destination: 'Email', via: 'Click to Copy', copiesEmail: true },
    { destination: 'LinkedIn', via: 'in/ckovacsdev', href: LINKEDIN_URL },
    { destination: 'GitHub', via: 'ckovacsdev', href: GITHUB_URL },
    { destination: 'Resume', via: 'Click to View PDF', href: RESUME_PATH },
];

// Columns are only as wide as their longest text, so the board stays two-column on narrower screens
const DEST_CELLS = Math.max(...ROUTES.map((route) => route.destination.length));
const VIA_CELLS = Math.max(...ROUTES.map((route) => route.via.length));
const VIA_TILES = 72; // rendered per row so the via column can fill a wide board; CSS clips to whole tiles

// The board clock shows my local time
const CLOCK = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', hour: 'numeric', minute: '2-digit' });
const clockText = () => CLOCK.format(new Date()).replace(/\s/g, ' ').padStart(CLOCK_CELLS);
const untilNextMinute = () => 60_000 - (Date.now() % 60_000) + 50;

const randomSteps = () => 6 + Math.floor(Math.random() * 9);

export const Connect = () => {
    const boardRef = useRef<HTMLDivElement>(null);
    const destCells = useRef<FlapCell[][]>([]);
    const settled = useRef(false);
    const { copyEmail, toast } = useCopyEmail();

    useLayoutEffect(() => {
        const board = boardRef.current;
        if (!board) {
            return;
        }
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const group = (name: string) => bindCells(board.querySelector(`[data-flaps="${name}"]`) ?? board);

        // Each group of cells and the text it settles on
        const marquee = { cells: group('marquee'), chars: flapChars(MARQUEE, MARQUEE.length) };
        const clock = group('clock');
        const rows = ROUTES.map(({ destination, via }, i) => ({
            dest: { cells: group(`dest-${i}`), chars: flapChars(destination, DEST_CELLS) },
            via: { cells: group(`via-${i}`), chars: flapChars(via, VIA_TILES) },
        }));
        destCells.current = rows.map((row) => row.dest.cells);
        const all = [ marquee.cells, clock, ...rows.flatMap((row) => [ row.dest.cells, row.via.cells ]) ].flat();

        let clockTimer = 0;
        const showTime = (animate: boolean, delay = 0) => {
            flapChars(clockText(), CLOCK_CELLS).forEach((char, i) => {
                if (animate) {
                    flipTo(clock[i], char, { delay: delay + i * 40 });
                } else {
                    setChar(clock[i], char);
                }
            });
        };
        const tick = () => {
            showTime(!reducedMotion);
            clockTimer = window.setTimeout(tick, untilNextMinute());
        };

        if (reducedMotion) {
            tick();
            return () => window.clearTimeout(clockTimer);
        }

        // Start blank, before the first paint, then flip everything in once the board is in view:
        // the marquee left to right, the clock, then each row in turn down the board.
        for (const cell of all) {
            setChar(cell, ' ');
        }
        const flipIn = ({ cells, chars }: { cells: FlapCell[]; chars: string[] }, start: number, step: number) => {
            cells.forEach((cell, i) => flipTo(cell, chars[i], { delay: start + i * step, steps: randomSteps() }));
        };
        const reveal = () => {
            // On a narrow board the via flaps are blank filler, so they settle without flipping
            const viaShown = getComputedStyle(board.querySelector('.board-label--via') ?? board).display !== 'none';
            flipIn(marquee, 0, 45);
            showTime(true, 350);
            rows.forEach((row, r) => {
                flipIn(row.dest, 500 + r * 160, 30);
                if (viaShown) {
                    flipIn(row.via, 620 + r * 160, 22);
                } else {
                    row.via.cells.forEach((cell, i) => setChar(cell, row.via.chars[i]));
                }
            });
            clockTimer = window.setTimeout(tick, untilNextMinute());
            settled.current = true;
        };

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                observer.disconnect();
                reveal();
            }
        }, { threshold: 0.35 });
        observer.observe(board);

        return () => {
            observer.disconnect();
            window.clearTimeout(clockTimer);
            all.forEach(stop);
            settled.current = false;
        };
    }, []);

    // Hovering a row gives its destination a quick turn of the flaps
    const spin = (row: number) => {
        if (!settled.current) {
            return;
        }
        destCells.current[row]?.forEach((cell, i) => {
            if (cell.char !== ' ' && !isBusy(cell)) {
                flipTo(cell, cell.char, { delay: i * 25, spin: 3 });
            }
        });
    };

    return (
        <div className='connect-container'>
            <h2 className='section-title'> Let's Connect </h2>
            <CofferWall className='board-wall'>
                <div
                    className='board'
                    ref={boardRef}
                    style={{ '--dest-cells': DEST_CELLS, '--via-cells': VIA_CELLS } as CSSProperties}
                >
                    <div className='board-header' aria-hidden='true'>
                        <SplitFlap group='marquee' text={MARQUEE} cells={MARQUEE.length} className='board-marquee' />
                        <div className='board-clock'>
                            <span className='board-label'>Hoboken, NJ</span>
                            <SplitFlap group='clock' text='' cells={CLOCK_CELLS} />
                        </div>
                    </div>

                    <div className='board-columns' aria-hidden='true'>
                        <span className='board-label board-label--dest'>Destination</span>
                        <span className='board-label board-label--via'>Via</span>
                    </div>

                    <ul className='board-list'>
                        {ROUTES.map((route, i) => {
                            const { destination, via } = route;
                            const content = (
                                <>
                                    <span className='board-sr'>{destination}: {via}</span>
                                    <SplitFlap group={`dest-${i}`} text={destination} cells={DEST_CELLS} className='board-dest' />
                                    <SplitFlap group={`via-${i}`} text={via} cells={VIA_TILES} className='board-via' />
                                </>
                            );
                            return (
                                <li key={destination}>
                                    {'copiesEmail' in route ? (
                                        <button
                                            type='button'
                                            className='board-row'
                                            onPointerEnter={() => spin(i)}
                                            onClick={copyEmail}
                                        >
                                            {content}
                                            <FiCopy className='board-arrow board-copy' aria-hidden='true' />
                                        </button>
                                    ) : (
                                        <a
                                            className='board-row'
                                            href={route.href}
                                            target='_blank'
                                            rel='noopener noreferrer'
                                            onPointerEnter={() => spin(i)}
                                        >
                                            {content}
                                            <FiArrowUpRight className='board-arrow' aria-hidden='true' />
                                        </a>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </CofferWall>

            {toast}
        </div>
    )
}
