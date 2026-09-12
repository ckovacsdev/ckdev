import { useEffect, useRef } from 'react';

export const useScrollValue = <T extends HTMLElement = HTMLDivElement>(
	property: string,
	map: (scrollY: number) => string,
	onWrite?: (el: T, scrollY: number) => void,
) => {
	const ref = useRef<T>(null);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;

		let frame = 0;
		const write = () => {
			frame = 0;
			el.style.setProperty(property, map(window.scrollY));
			onWrite?.(el, window.scrollY);
		};
		const onScroll = () => {
			if (frame) return;
			frame = requestAnimationFrame(write);
		};

		write();
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => {
			window.removeEventListener('scroll', onScroll);
			if (frame) cancelAnimationFrame(frame);
		};
	}, [property, map, onWrite]);

	return ref;
};