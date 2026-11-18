import type { ReactNode } from 'react';
import './section.css';

type SectionProps = {
    id: string;
    title: string;
    // A short line beside the title, such as a count
    meta?: ReactNode;
    className?: string;
    children: ReactNode;
};

/** Every section shares the same frame: a full-bleed top line, a title row, then its own body */
export const Section = ({ id, title, meta, className, children }: SectionProps) => (
    <section id={id} className={className ? `section ${className}` : 'section'} aria-labelledby={`${id}-title`}>
        <div className='section-head'>
            <h2 id={`${id}-title`} className='section-title'>{title}</h2>
            {meta && <p className='section-meta'>{meta}</p>}
        </div>
        {children}
    </section>
);
