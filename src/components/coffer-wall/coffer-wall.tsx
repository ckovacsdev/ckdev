import { useId, useLayoutEffect, useRef, type ReactNode } from 'react';
import './coffer-wall.css';

/*
 * A coffered wall, after the vaulted ceilings of the DC Metro, framing its content with one full
 * coffer above and below and half a coffer either side. The coffers are drawn as a single SVG
 * pattern tile in a 100 x 100 box: an 8-unit rib, then walls sloping 18 units in to a recessed face.
 * Like the hero skyline, the wall answers the mouse: the ribs stay put and each recessed face slides
 * away from the pointer, so the walls stretch as if seen from a slightly different angle.
 */
const RIB = 8;
const INSET = 26;
const MAX_SHIFT = 8;      // furthest the face slides, in tile units; under the 18-unit wall depth
const EASE = 0.065;       // same easing as the skyline
const SETTLED = 0.005;

// Target coffer size; the real size flexes so whole coffers fit
const cofferTarget = (wallWidth: number) => (wallWidth < 600 ? 44 : 72);

// The four sloped walls (top, right, bottom, left) for a face shifted by (x, y)
const wallPoints = (x: number, y: number) => {
    const o0 = RIB, o1 = 100 - RIB;
    const i0x = INSET + x, i1x = 100 - INSET + x;
    const i0y = INSET + y, i1y = 100 - INSET + y;
    return [
        `${o0},${o0} ${o1},${o0} ${i1x},${i0y} ${i0x},${i0y}`,
        `${o1},${o0} ${o1},${o1} ${i1x},${i1y} ${i1x},${i0y}`,
        `${o0},${o1} ${o1},${o1} ${i1x},${i1y} ${i0x},${i1y}`,
        `${o0},${o0} ${i0x},${i0y} ${i0x},${i1y} ${o0},${o1}`,
    ];
};
const WALL_CLASSES = [ 'coffer-lit', 'coffer-side', 'coffer-shade', 'coffer-side' ];
const RESTING = wallPoints(0, 0);

type CofferWallProps = {
    className?: string;
    children: ReactNode;
};

export const CofferWall = ({ className, children }: CofferWallProps) => {
    const id = useId();
    const wallRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const patternRef = useRef<SVGPatternElement>(null);
    const wallsRef = useRef<(SVGPolygonElement | null)[]>([]);
    const faceRef = useRef<SVGRectElement>(null);

    // Coffer width divides the wall evenly, so the sides show half a coffer each. Coffer height then
    // divides the content's height at that width, so a full coffer shows above and below. Width never
    // depends on height, so this settles in one pass.
    useLayoutEffect(() => {
        const wall = wallRef.current;
        const content = contentRef.current;
        const pattern = patternRef.current;
        if (!wall || !content || !pattern) {
            return;
        }
        const fit = () => {
            const width = wall.clientWidth;
            const cofferW = width / Math.max(2, Math.round(width / cofferTarget(width)));
            wall.style.setProperty('--coffer-w', `${cofferW}px`);
            const height = content.offsetHeight;
            const cofferH = height / Math.max(1, Math.round(height / cofferW));
            wall.style.setProperty('--coffer-h', `${cofferH}px`);
            pattern.setAttribute('x', `${-cofferW / 2}`);
            pattern.setAttribute('width', `${cofferW}`);
            pattern.setAttribute('height', `${cofferH}`);
        };
        fit();
        const observer = new ResizeObserver(fit);
        observer.observe(wall);
        observer.observe(content);
        return () => observer.disconnect();
    }, []);

    useLayoutEffect(() => {
        const wall = wallRef.current;
        if (!wall || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }
        let tX = 0, tY = 0, cX = 0, cY = 0;
        let frame = 0;
        let onScreen = false;

        const render = () => {
            frame = 0;
            cX += (tX - cX) * EASE;
            cY += (tY - cY) * EASE;
            wallPoints(cX, cY).forEach((points, i) => wallsRef.current[i]?.setAttribute('points', points));
            faceRef.current?.setAttribute('x', `${INSET + cX}`);
            faceRef.current?.setAttribute('y', `${INSET + cY}`);
            if (onScreen && (Math.abs(tX - cX) > SETTLED || Math.abs(tY - cY) > SETTLED)) {
                frame = requestAnimationFrame(render);
            }
        };
        const kick = () => {
            if (!frame && onScreen) {
                frame = requestAnimationFrame(render);
            }
        };

        // Only a mouse or trackpad moves the faces; on touch screens they rest centered
        const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
        const onPointerMove = (e: PointerEvent) => {
            if (e.pointerType !== 'mouse' || !finePointer.matches) {
                return;
            }
            tX = -(e.clientX / window.innerWidth - 0.5) * 2 * MAX_SHIFT;
            tY = -(e.clientY / window.innerHeight - 0.5) * 2 * MAX_SHIFT;
            kick();
        };
        const onPointerChange = () => {
            if (!finePointer.matches) {
                tX = 0;
                tY = 0;
                kick();
            }
        };
        const visibility = new IntersectionObserver(([entry]) => {
            onScreen = entry.isIntersecting;
            kick();
        });

        visibility.observe(wall);
        window.addEventListener('pointermove', onPointerMove, { passive: true });
        finePointer.addEventListener('change', onPointerChange);
        return () => {
            if (frame) {
                cancelAnimationFrame(frame);
            }
            visibility.disconnect();
            window.removeEventListener('pointermove', onPointerMove);
            finePointer.removeEventListener('change', onPointerChange);
        };
    }, []);

    return (
        <div className={`coffer-wall ${className ?? ''}`} ref={wallRef}>
            <svg className='coffer-wall-art' aria-hidden='true'>
                <defs>
                    <pattern
                        id={`${id}-coffer`}
                        ref={patternRef}
                        patternUnits='userSpaceOnUse'
                        viewBox='0 0 100 100'
                        preserveAspectRatio='none'
                        width='72'
                        height='72'
                    >
                        <rect className='coffer-rib' width='100' height='100' />
                        {RESTING.map((points, i) => (
                            <polygon
                                key={i}
                                ref={(el) => { wallsRef.current[i] = el; }}
                                className={WALL_CLASSES[i]}
                                points={points}
                            />
                        ))}
                        <rect className='coffer-face' ref={faceRef} x={INSET} y={INSET} width={100 - INSET * 2} height={100 - INSET * 2} />
                        <line className='coffer-edge' x1={RIB} y1={RIB - 0.5} x2={100 - RIB} y2={RIB - 0.5} />
                    </pattern>
                    {/* The lamps are at floor level, so the wall dims toward the top */}
                    <linearGradient id={`${id}-dim`} x1='0' y1='0' x2='0' y2='1'>
                        <stop offset='0' className='coffer-dim' stopOpacity='0.35' />
                        <stop offset='1' className='coffer-dim' stopOpacity='0' />
                    </linearGradient>
                </defs>
                <rect width='100%' height='100%' fill={`url(#${id}-coffer)`} />
                <rect width='100%' height='100%' fill={`url(#${id}-dim)`} />
            </svg>
            <div className='coffer-wall-content' ref={contentRef}>
                {children}
            </div>
        </div>
    );
};
