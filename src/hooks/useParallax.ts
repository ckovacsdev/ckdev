import { useEffect, useRef } from 'react';

type ParallaxOptions = {
	rate?: number;
	property?: string;
	wrap?: number | string;
};

export const useParallax = <T extends HTMLElement = HTMLDivElement>({rate = 0.4, property = '--scroll', wrap}: ParallaxOptions = {}) => {
	const ref = useRef<T>(null);

	useEffect(() => {
		const el = ref.current;
		if (!el) {
            return;
        }

		const media = window.matchMedia('(prefers-reduced-motion: reduce)');

		const raw = typeof wrap === 'string'
            ? parseFloat(getComputedStyle(el).getPropertyValue(wrap))
            : wrap;
		const period = Number.isFinite(raw) && (raw as number) > 0 ? (raw as number) : 0;

		let frame = 0;

		const write = () => {
			frame = 0;
			let offset = window.scrollY * rate;
			if (period) offset %= period;
			el.style.setProperty(property, `${-offset}px`);
		};

		const onScroll = () => {
			if (frame) {
                return;
            }
			frame = requestAnimationFrame(write);
		};

		const stop = () => {
			window.removeEventListener('scroll', onScroll);
			if (frame) {
                cancelAnimationFrame(frame);
            }
			frame = 0;
		};

		const start = () => {
			if (media.matches) {
				el.style.setProperty(property, '0px');
				return;
			}
			write();
			window.addEventListener('scroll', onScroll, { passive: true });
		};

		const onPreferenceChange = () => {
			stop();
			start();
		};

		start();
		media.addEventListener('change', onPreferenceChange);

		return () => {
			stop();
			media.removeEventListener('change', onPreferenceChange);
		};
	}, [rate, property, wrap]);

	return ref;
};