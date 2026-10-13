import { useEffect, useRef, useState } from 'react';
import './skyline.css';

export const Skyline = () => {
	const ref = useRef<HTMLDivElement>(null);
	const [ ready, setReady ] = useState(false);

	useEffect(() => {
		const el = ref.current;
		if (!el) {
			return;
		}
		let cancelled = false;
		let dispose: (() => void) | undefined;

		import('./skyline-scene').then(({ mountSkyline, supportsWebGL }) => {
			if (cancelled || !supportsWebGL()) {
				return;
			}
			dispose = mountSkyline(el, () => setReady(true));
		}).catch(() => {});

		return () => {
			cancelled = true;
			dispose?.();
		};
	}, []);

	return <div ref={ref} className='skyline' data-ready={ready || undefined} aria-hidden='true' />;
};
