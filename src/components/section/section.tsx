import type { ReactNode } from 'react';
import './section.css';

type SectionProps = {
    id: string;
    title: string;
    meta?: ReactNode;
    className?: string;
    children: ReactNode;
};

export const Section = ({ id, title, meta, className, children }: SectionProps) => (
    <section id={id} className={className ? `section ${className}` : 'section'} aria-labelledby={`${id}-title`}>
        <div className='section-head'>
            <h2 id={`${id}-title`} className='section-title'>{title}</h2>
            {meta && <p className='section-meta'>{meta}</p>}
        </div>
        {children}
    </section>
);
