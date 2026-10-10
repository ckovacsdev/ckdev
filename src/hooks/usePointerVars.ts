import { useEffect, type RefObject } from 'react';

const EASE = 0.07;
const SPOT_EASE = 0.05;
const SETTLED = 0.05;

export const usePointerVars = (ref: RefObject<HTMLElement | null>) => {
	useEffect(() => {
		const el = ref.current;
		const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
		if (!el || motion.matches) {
			return;
		}

		const target = { x: window.innerWidth / 2, y: window.innerHeight / 2, spot: 0 };
		const current = { ...target };
		let frame = 0;
		let seen = false;

		const write = () => {
			el.style.setProperty('--mx', `${current.x.toFixed(1)}px`);
			el.style.setProperty('--my', `${current.y.toFixed(1)}px`);
			el.style.setProperty('--spot', current.spot.toFixed(3));
		};

		const loop = () => {
			frame = 0;
			current.x += (target.x - current.x) * EASE;
			current.y += (target.y - current.y) * EASE;
			current.spot += (target.spot - current.spot) * SPOT_EASE;
			write();
			const moving = Math.abs(target.x - current.x) > SETTLED
				|| Math.abs(target.y - current.y) > SETTLED
				|| Math.abs(target.spot - current.spot) > 0.001;
			if (moving) {
				frame = requestAnimationFrame(loop);
			}
		};

		const kick = () => {
			if (!frame) {
				frame = requestAnimationFrame(loop);
			}
		};

		const onMove = (e: PointerEvent) => {
			if (e.pointerType === 'touch') {
				return;
			}
			target.x = e.clientX;
			target.y = e.clientY;
			target.spot = 1;
			if (!seen) {
				current.x = target.x;
				current.y = target.y;
				seen = true;
			}
			kick();
		};

		const onLeave = () => {
			target.spot = 0;
			kick();
		};

		write();
		window.addEventListener('pointermove', onMove, { passive: true });
		document.documentElement.addEventListener('pointerleave', onLeave);
		window.addEventListener('blur', onLeave);

		return () => {
			if (frame) {
				cancelAnimationFrame(frame);
			}
			window.removeEventListener('pointermove', onMove);
			document.documentElement.removeEventListener('pointerleave', onLeave);
			window.removeEventListener('blur', onLeave);
		};
	}, [ref]);
};
