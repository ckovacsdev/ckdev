import { useLayoutEffect, useRef } from 'react';

// Distances are shares of the viewport height
const RISE = 0.35;         // scroll between one item locking into its slot and the next
const SNAP = 0.3;          // share of RISE left at which an item snaps the rest of the way
const LINE = 0.9;          // unpinned, an item arrives once its top crosses this line
const COLUMN_STEP = 0.12;  // each later item in the same row waits this much further up
const STAGGER = 110;       // ms between unpinned items that arrive in the same frame

// pinned: the stage holds still under the nav while each item rises with the scroll and snaps into its slot
// flow: the stage is taller than the viewport, so each item rises in as it scrolls into view
// static: reduced motion, every item is in place
export type SequenceMode = 'pinned' | 'flow' | 'static';

const navOffset = () =>
    parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-offset')) || 0;

// The track's first child is the stage; items inside it are marked with data-step
export const useScrollSequence = <T extends HTMLElement = HTMLDivElement>() => {
    const ref = useRef<T>(null);

    useLayoutEffect(() => {
        const track = ref.current;
        const stage = track?.firstElementChild as HTMLElement | null;
        if (!track || !stage) {
            return;
        }

        const items = Array.from(track.querySelectorAll<HTMLElement>('[data-step]'));
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
        let mode: SequenceMode = 'static';
        let rise = 0;
        let shown = items.length;
        let frame = 0;

        // Item i starts i rises below its slot and climbs one-for-one with the scroll, so the
        // first is already in place and the next section arrives right under the last
        const pin = () => {
            const scrolled = navOffset() - track.getBoundingClientRect().top;
            items.forEach((item, i) => {
                const start = i * rise;
                const left = Math.min(Math.max(start - scrolled, 0), start);
                const snapped = left < rise * SNAP;
                item.style.setProperty('--rise', `${snapped ? 0 : left}px`);
                item.toggleAttribute('data-snapped', snapped);
            });
        };

        // Layout offsets, not rects, so an item's own entrance transform never moves its threshold
        const flow = () => {
            const parentTop = items[0]?.offsetParent?.getBoundingClientRect().top ?? 0;
            let column = 0;
            let next = 0;
            for (; next < items.length; next++) {
                column = next > 0 && items[next].offsetTop === items[next - 1].offsetTop ? column + 1 : 0;
                const line = window.innerHeight * (LINE - column * COLUMN_STEP);
                if (parentTop + items[next].offsetTop > line) {
                    break;
                }
            }

            // Items that arrive together still land one after another
            items.forEach((item, i) => {
                item.style.setProperty('--enter-delay', `${i >= shown && i < next ? (i - shown) * STAGGER : 0}ms`);
                item.toggleAttribute('data-hidden', i >= next);
            });
            shown = next;
        };

        const update = () => {
            frame = 0;
            if (mode === 'pinned') {
                pin();
            } else if (mode === 'flow') {
                flow();
            }
        };

        const onScroll = () => {
            if (frame) {
                return;
            }
            frame = requestAnimationFrame(update);
        };

        // A link to the section lands where the sequence ends, so every item is in place
        // and the scroll on the way there still plays each snap
        const sequenceEnd = () =>
            track.getBoundingClientRect().top + window.scrollY - navOffset() + (items.length - 1) * rise;

        const targetsTrack = (hash: string) =>
            hash.length > 1 && !!document.getElementById(decodeURIComponent(hash.slice(1)))?.contains(track);

        const onClick = (event: MouseEvent) => {
            if (mode !== 'pinned' || event.defaultPrevented || event.button !== 0
                || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
                return;
            }

            const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
            if (!link || !targetsTrack(link.hash)) {
                return;
            }

            event.preventDefault();
            if (window.location.hash !== link.hash) {
                history.pushState(null, '', link.hash);
            }
            window.scrollTo({ top: sequenceEnd() });
        };

        const measure = () => {
            items.forEach((item) => {
                item.style.removeProperty('--rise');
                item.removeAttribute('data-snapped');
                item.removeAttribute('data-hidden');
            });
            shown = items.length;

            const room = window.innerHeight - navOffset();
            mode = reduced.matches ? 'static' : stage.offsetHeight <= room ? 'pinned' : 'flow';
            rise = window.innerHeight * RISE;
            track.dataset.mode = mode;
            track.style.setProperty('--sequence-scroll', `${(items.length - 1) * rise}px`);
            update();
        };

        measure();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', measure);
        reduced.addEventListener('change', measure);
        document.addEventListener('click', onClick);

        // Opening the page at the section's hash lands at the end too, once the browser's own
        // jump to the hash on load is done
        let landing = 0;
        const land = () => {
            landing = requestAnimationFrame(() => window.scrollTo({ top: sequenceEnd(), behavior: 'instant' }));
        };
        if (track.dataset.mode === 'pinned' && targetsTrack(window.location.hash)) {
            if (document.readyState === 'complete') {
                land();
            } else {
                window.addEventListener('load', land, { once: true });
            }
        }

        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', measure);
            reduced.removeEventListener('change', measure);
            document.removeEventListener('click', onClick);
            window.removeEventListener('load', land);
            cancelAnimationFrame(landing);
            if (frame) {
                cancelAnimationFrame(frame);
            }
        };
    }, []);

    return ref;
};
