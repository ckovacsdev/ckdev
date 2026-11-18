import { useEffect, useRef } from 'react';
import { startCircuit } from './circuit';
import './circuit-cover.css';

/** An animated circuit board, used as the profile banner */
export const CircuitCover = () => {
    const ref = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = ref.current;
        return canvas ? startCircuit(canvas) : undefined;
    }, []);

    return <canvas ref={ref} className='circuit-cover' aria-hidden='true' />;
};
