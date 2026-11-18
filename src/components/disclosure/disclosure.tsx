import { useId, useState, type ReactNode } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import './disclosure.css';

type DisclosureProps = {
    // The always-visible row; it is the button that opens and closes the panel
    summary: ReactNode;
    children: ReactNode;
    defaultOpen?: boolean;
    className?: string;
};

/**
 * A row that expands in place to show more. The panel's height animates with a grid-row
 * transition, and a closed panel is inert so its links can't be tabbed to.
 */
export const Disclosure = ({ summary, children, defaultOpen = false, className }: DisclosureProps) => {
    const [ open, setOpen ] = useState(defaultOpen);
    const panelId = useId();

    return (
        <div className={className ? `disclosure ${className}` : 'disclosure'} data-open={open || undefined}>
            <button
                type='button'
                className='disclosure-summary'
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpen((value) => !value)}
            >
                <span className='disclosure-summary-content'>{summary}</span>
                <FiChevronDown className='disclosure-chevron' aria-hidden='true' />
            </button>
            <div id={panelId} className='disclosure-panel' inert={!open}>
                <div className='disclosure-panel-inner'>{children}</div>
            </div>
        </div>
    );
};
