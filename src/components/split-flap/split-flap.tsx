import { flapChars } from './flap-engine';
import './split-flap.css';

type SplitFlapProps = {
	text: string;
	cells: number;
	group: string;
	className?: string;
};

/**
 * A row of split-flap cells showing text. It renders static markup only, tagged with `group` so
 * flap-engine.ts can find and animate it. Hidden from assistive tech, so pair it with real text.
 */
export const SplitFlap = ({ text, cells, group, className }: SplitFlapProps) => (
	<span className={className ? `flaps ${className}` : 'flaps'} data-flaps={group} aria-hidden='true'>
		{flapChars(text, cells).map((char, i) => (
			<span key={i} className='flap'>
				<span className='flap-half flap-top'><span>{char}</span></span>
				<span className='flap-half flap-bottom'><span>{char}</span></span>
				<span className='flap-half flap-top flap-leaf'><span>{char}</span></span>
				<span className='flap-half flap-bottom flap-leaf'><span>{char}</span></span>
			</span>
		))}
	</span>
);
