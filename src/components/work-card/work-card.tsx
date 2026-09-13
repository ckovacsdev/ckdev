import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import './work-card.css';

type WorkCardProps = {
	tech: string;
	title: string;
	blurb: string;
	children?: ReactNode;
};

export default function WorkCard({ tech, title, blurb, children }: WorkCardProps) {
	const [ open, setOpen ] = useState(false);
	const cardRef = useRef<HTMLElement>(null);
	const fromRect = useRef<DOMRect | null>(null);

	const toggle = () => {
		fromRect.current = cardRef.current?.getBoundingClientRect() ?? null;
		setOpen((o) => !o);
	};

	useLayoutEffect(() => {
		const el = cardRef.current;
		const from = fromRect.current;
		fromRect.current = null;
		if (!el || !from) {
            return;
        }

		const to = el.getBoundingClientRect();
		el.animate(
			[
				{
					transformOrigin: 'top left',
					transform: `translate(${from.left - to.left}px, ${from.top - to.top}px)
					            scale(${from.width / to.width}, ${from.height / to.height})`,
				},
				{ transformOrigin: 'top left', transform: 'none' },
			],
			{
				duration: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 350,
				easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
			}
		);
	}, [open]);

	useEffect(() => {
		if (!open) return;
		const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
		document.addEventListener('keydown', onKey);
		return () => document.removeEventListener('keydown', onKey);
	}, [open]);

	return (
		<>
			<div className='work-backdrop' data-open={open || undefined} onClick={() => setOpen(false)} />

			<div className='work-card-slot'>
				<article ref={cardRef} className='work-card' data-open={open || undefined}>
					<div className='work-card-body'>
						<p className='work-card-tech'>{tech}</p>
						<h3 className='work-card-title'>{title}</h3>
						<p className='work-card-blurb'>{blurb}</p>
						{open && <div className='work-card-detail'>{children}</div>}
					</div>

					<button type='button' className='work-card-toggle' onClick={toggle} aria-expanded={open}>
					</button>
				</article>
			</div>
		</>
	);
}