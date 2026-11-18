import { useEffect, useRef } from 'react';

/**
 * Tracks the pointer over an element and writes its position to the `--mx` and `--my` custom
 * properties (in px, relative to the element), plus a `data-pointer` attribute while the pointer
 * is inside. CSS decides what to draw with them. Touch input is ignored, and reduced motion skips it.
 */
export const usePointerGlow = <T extends HTMLElement>() => {
    const ref = useRef<T>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        let frame = 0;
        let x = 0;
        let y = 0;

        const paint = () => {
            frame = 0;
            el.style.setProperty('--mx', `${x}px`);
            el.style.setProperty('--my', `${y}px`);
        };

        const onMove = (e: PointerEvent) => {
            if (e.pointerType === 'touch') {
                return;
            }
            const rect = el.getBoundingClientRect();
            x = e.clientX - rect.left;
            y = e.clientY - rect.top;
            el.setAttribute('data-pointer', '');
            if (!frame) {
                frame = requestAnimationFrame(paint);
            }
        };
        const onLeave = () => el.removeAttribute('data-pointer');

        el.addEventListener('pointermove', onMove);
        el.addEventListener('pointerleave', onLeave);
        return () => {
            el.removeEventListener('pointermove', onMove);
            el.removeEventListener('pointerleave', onLeave);
            cancelAnimationFrame(frame);
        };
    }, []);

    return ref;
};
