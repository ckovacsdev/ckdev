import { lazy, Suspense, useEffect, useState } from 'react';
import './side-bends.css';

// Three.js comes with this component, so it loads on its own after the page, never up front
const ColorBends = lazy(() => import('../color-bends/ColorBends'));

// The banner's Borealis colors, so the margins read as the aurora spilling outward
const BOREALIS = [ '#1effa0', '#14c8b4', '#3a7bff' ];

// Only on screens wide enough to have margins beside the column, and never with reduced motion
const QUERY = '(min-width: 1000px) and (prefers-reduced-motion: no-preference)';

/**
 * A very faint ColorBends background, fixed behind the page. The column has a solid
 * background, so it only shows in the margins, fading out toward the content.
 */
export const SideBends = () => {
    const [ enabled, setEnabled ] = useState(() => window.matchMedia(QUERY).matches);

    useEffect(() => {
        const query = window.matchMedia(QUERY);
        const update = () => setEnabled(query.matches);
        query.addEventListener('change', update);
        return () => query.removeEventListener('change', update);
    }, []);

    if (!enabled) {
        return null;
    }

    return (
        <div className='side-bends' aria-hidden='true'>
            <Suspense fallback={null}>
                <ColorBends
                    className='side-bends-canvas'
                    colors={BOREALIS}
                    speed={0.12}
                    mouseInfluence={0}
                    parallax={0}
                    noise={0}
                />
            </Suspense>
        </div>
    );
};
