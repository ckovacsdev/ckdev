import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type MouseEvent, type PointerEvent } from 'react';
import { PiCaretLeftLight, PiCaretRightLight } from 'react-icons/pi';
import WorkCard, { type WorkCardProps } from '../work-card/work-card';
import './work-deck.css';

type Motion = {
	index: number;
	to: 'back' | 'front';
	from: number;
};

const MOTION_MS = 600;
const SWIPE_DISTANCE = 50;

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const wrap = (i: number, n: number) => ((i % n) + n) % n;

const fromDialog = (target: EventTarget) => target instanceof Element && target.closest('dialog') !== null;

export const WorkDeck = ({ items, label }: { items: WorkCardProps[]; label: string }) => {
	const [ active, setActive ] = useState(0);
	const [ motion, setMotion ] = useState<Motion | null>(null);
	const busyRef = useRef(false);
	const swipeRef = useRef<{ x: number; y: number } | null>(null);
	const swipedRef = useRef(false);
	const stageRef = useRef<HTMLDivElement>(null);
	const refocusRef = useRef(false);
	const count = items.length;

	useEffect(() => {
		if (!refocusRef.current) {
			return;
		}
		refocusRef.current = false;
		stageRef.current?.querySelector<HTMLElement>('.work-deck-item:not([inert]) .work-card-toggle')?.focus();
	}, [active]);

	const go = (target: number, direction: 1 | -1) => {
		const next = wrap(target, count);
		if (busyRef.current || next === active) {
			return;
		}

		refocusRef.current = stageRef.current?.contains(document.activeElement) ?? false;

		if (!prefersReducedMotion()) {
			setMotion(direction === 1
				? { index: active, to: 'back', from: 0 }
				: { index: next, to: 'front', from: wrap(next - active, count) });
			busyRef.current = true;
			window.setTimeout(() => {
				busyRef.current = false;
				setMotion(null);
			}, MOTION_MS);
		}
		setActive(next);
	};

	const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
		if (fromDialog(e.target)) {
			return;
		}
		if (e.key === 'ArrowRight') {
			e.preventDefault();
			go(active + 1, 1);
		} else if (e.key === 'ArrowLeft') {
			e.preventDefault();
			go(active - 1, -1);
		}
	};

	const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
		if (e.button !== 0 || fromDialog(e.target)) {
			return;
		}
		swipeRef.current = { x: e.clientX, y: e.clientY };
		swipedRef.current = false;
	};

	const handlePointerUp = (e: PointerEvent<HTMLDivElement>) => {
		const start = swipeRef.current;
		swipeRef.current = null;
		if (!start) {
			return;
		}
		const dx = e.clientX - start.x;
		const dy = e.clientY - start.y;
		if (Math.abs(dx) < SWIPE_DISTANCE || Math.abs(dx) < Math.abs(dy)) {
			return;
		}
		swipedRef.current = true;
		if (dx < 0) {
			go(active + 1, 1);
		} else {
			go(active - 1, -1);
		}
	};

	const handleClickCapture = (e: MouseEvent<HTMLDivElement>) => {
		if (swipedRef.current && !fromDialog(e.target)) {
			e.preventDefault();
			e.stopPropagation();
		}
		swipedRef.current = false;
	};

	return (
		<div
			className='work-deck'
			role='region'
			aria-roledescription='carousel'
			aria-label={label}
			onKeyDown={handleKeyDown}
			style={{ '--count': count } as CSSProperties}
		>
			<button
				type='button'
				className='work-deck-button work-deck-button--prev'
				aria-label='Previous project'
				onClick={() => go(active - 1, -1)}
			>
				<PiCaretLeftLight aria-hidden='true' />
			</button>

			<div
				ref={stageRef}
				className='work-deck-stage'
				onPointerDown={handlePointerDown}
				onPointerUp={handlePointerUp}
				onPointerCancel={() => { swipeRef.current = null; }}
				onClickCapture={handleClickCapture}
			>
				{items.map((item, i) => {
					const depth = wrap(i - active, count);
					const moving = motion?.index === i ? motion : undefined;
					return (
						<div
							key={item.title}
							className='work-deck-item'
							role='group'
							aria-roledescription='slide'
							aria-label={`${i + 1} of ${count}`}
							inert={depth !== 0}
							data-motion={moving?.to}
							style={{ '--d': depth, '--from': moving?.from ?? 0 } as CSSProperties}
						>
							<WorkCard {...item} />
						</div>
					);
				})}
			</div>

			<button
				type='button'
				className='work-deck-button work-deck-button--next'
				aria-label='Next project'
				onClick={() => go(active + 1, 1)}
			>
				<PiCaretRightLight aria-hidden='true' />
			</button>

			<p className='work-deck-sr' aria-live='polite'>
				Project {active + 1} of {count}: {items[active].title}
			</p>
		</div>
	);
};
