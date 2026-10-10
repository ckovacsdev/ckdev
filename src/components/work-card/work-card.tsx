import { useId, useRef, useState, type MouseEvent, type ReactNode, type SyntheticEvent } from 'react';
import './work-card.css';
import { IoCloseOutline } from 'react-icons/io5';

export type WorkStat = {
	value: string;
	label: string;
};

export type WorkCardProps = {
	tech: string;
	title: string;
	subtitle: string;
	stats: WorkStat[];
	children?: ReactNode;
};

const DURATION = 350;
const EASING = 'cubic-bezier(0.22, 1, 0.36, 1)';

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function flip(el: HTMLElement, from: DOMRect, direction: 'in' | 'out') {
	const to = el.getBoundingClientRect();
	const collapsed = {
		transform: `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${from.width / to.width}, ${from.height / to.height})`,
	};
	const expanded = { transform: 'none' };

	return el.animate(direction === 'in' ? [ collapsed, expanded ] : [ expanded, collapsed ], {
		duration: DURATION,
		easing: EASING,
		fill: direction === 'out' ? 'forwards' : 'none',
	});
}

const WorkStats = ({ stats, className }: { stats: WorkStat[]; className: string }) => (
	<dl className={`work-stats ${className}`}>
		{stats.map(({ value, label }) => (
			<div key={label} className='work-stat'>
				<dt className='work-stat-label'>{label}</dt>
				<dd className='work-stat-value'>{value}</dd>
			</div>
		))}
	</dl>
);

export default function WorkCard({ tech, title, subtitle, stats, children }: WorkCardProps) {
	const [ open, setOpen ] = useState(false);
	const cardRef = useRef<HTMLElement>(null);
	const dialogRef = useRef<HTMLDialogElement>(null);
	const layoutRef = useRef<HTMLDivElement>(null);
	const closingRef = useRef(false);
	const titleId = useId();

	const openDialog = () => {
		const card = cardRef.current;
		const dialog = dialogRef.current;
		if (!card || !dialog || dialog.open) {
			return;
		}

		const from = card.getBoundingClientRect();
		dialog.showModal();
		if (layoutRef.current) {
			layoutRef.current.scrollTop = 0;
		}
		setOpen(true);

		if (!prefersReducedMotion()) {
			flip(dialog, from, 'in');
		}
	};

	const closeDialog = () => {
		const card = cardRef.current;
		const dialog = dialogRef.current;
		if (!dialog?.open || closingRef.current) {
			return;
		}

		closingRef.current = true;
		dialog.dataset.closing = '';

		if (!card || prefersReducedMotion()) {
			dialog.close();
			return;
		}

		const anim = flip(dialog, card.getBoundingClientRect(), 'out');
		anim.addEventListener('finish', () => {
			dialog.close();
			anim.cancel();
		}, { once: true });
	};

	const handleClose = () => {
		closingRef.current = false;
		if (dialogRef.current) {
			delete dialogRef.current.dataset.closing;
		}
		setOpen(false);
	};

	const handleCancel = (e: SyntheticEvent<HTMLDialogElement>) => {
		e.preventDefault();
		closeDialog();
	};
	
	const handleDialogClick = (e: MouseEvent<HTMLDialogElement>) => {
		if (e.target !== e.currentTarget) {
			return;
		}
		const r = e.currentTarget.getBoundingClientRect();
		const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
		if (!inside) {
			closeDialog();
		}
	};

	return (
		<div className='work-card-slot'>
			<article ref={cardRef} className='work-card chamfer' data-open={open || undefined}>
				<div className='work-card-body'>
					<h3 className='work-card-title'>{title}</h3>
					<p className='work-card-tech'>{tech}</p>
					<WorkStats stats={stats} className='work-card-stats' />
					<p className='work-card-subtitle'>{subtitle}</p>
					<p className='work-card-read-more' aria-hidden='true'>Read more +</p>
				</div>

				<button
					type='button'
					className='work-card-toggle'
					onClick={openDialog}
					aria-haspopup='dialog'
					aria-expanded={open}
				>
					<span className='work-card-sr'>Read more about {title}</span>
				</button>
			</article>

			<dialog
				ref={dialogRef}
				className='work-dialog chamfer'
				aria-labelledby={titleId}
				onCancel={handleCancel}
				onClose={handleClose}
				onClick={handleDialogClick}
			>
				<div className='work-dialog-layout' ref={layoutRef}>
					<div className='work-dialog-body'>
						<div className='work-dialog-closebar'>
							<button type='button' className='work-dialog-close' onClick={closeDialog} aria-label='Close'>
								<span aria-hidden='true'><IoCloseOutline /></span>
							</button>
						</div>

						<header className='work-dialog-header'>
							<h2 id={titleId} className='work-dialog-title'>{title}</h2>
							<p className='work-dialog-tech'>{tech}</p>
							<WorkStats stats={stats} className='work-dialog-stats' />
						</header>

						<div className='work-dialog-content'>{children}</div>
					</div>
				</div>
			</dialog>
		</div>
	);
}