import { useId, useRef, useState, type MouseEvent, type ReactNode, type SyntheticEvent } from 'react';
import { DecoPattern } from '../deco-pattern/deco-pattern';
import './work-card.css';
import { IoCloseOutline } from 'react-icons/io5';

export type WorkCardProps = {
	tech: string;
	title: string;
	subtitle: string;
	subtext: string;
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

export default function WorkCard({ tech, title, subtitle, subtext, children }: WorkCardProps) {
	const [ open, setOpen ] = useState(false);
	const cardRef = useRef<HTMLElement>(null);
	const dialogRef = useRef<HTMLDialogElement>(null);
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
		dialog.scrollTop = 0;
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

		let anim: Animation | undefined;
		const finish = () => {
			dialog.close();
			anim?.cancel();
		};

		if (!card || prefersReducedMotion()) {
			finish();
			return;
		}

		anim = flip(dialog, card.getBoundingClientRect(), 'out');
		anim.addEventListener('finish', finish, { once: true });
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
			<article ref={cardRef} className='work-card' data-open={open || undefined}>
				<div className='work-card-body'>
					<h3 className='work-card-title'>{title}</h3>
					<p className='work-card-tech'>{tech}</p>
					<p className='work-card-subtext'>{subtext}</p>
					<p className='work-card-subtitle'>{subtitle}</p>
					<p className='work-card-read-more' aria-hidden='true'>Read more +</p>
				</div>

				<div className='work-card-pattern' aria-hidden='true'>
					<DecoPattern />
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
				className='work-dialog'
				aria-labelledby={titleId}
				onCancel={handleCancel}
				onClose={handleClose}
				onClick={handleDialogClick}
			>
				<div className='work-dialog-layout'>
					<div className='work-dialog-body'>
						<div className='work-dialog-closebar'>
							<button type='button' className='work-dialog-close' onClick={closeDialog} aria-label='Close'>
								<span aria-hidden='true'><IoCloseOutline /></span>
							</button>
						</div>

						<header className='work-dialog-header'>
							<h2 id={titleId} className='work-dialog-title'>{title}</h2>
							<p className='work-dialog-tech'>{tech}</p>
							<p className='work-dialog-subtext'>{subtext}</p>
						</header>

						<div className='work-dialog-content'>{children}</div>
					</div>

					<div className='work-dialog-pattern' aria-hidden='true'>
						<DecoPattern />
					</div>
				</div>
			</dialog>
		</div>
	);
}