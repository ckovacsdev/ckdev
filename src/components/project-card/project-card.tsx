import type { ReactNode } from 'react';
import { FiArrowUpRight } from 'react-icons/fi';
import { Disclosure } from '../disclosure/disclosure';
import './project-card.css';

export type ProjectStat = {
    value: string;
    label: string;
};

export type ProjectCardProps = {
    title: string;
    tech: string;
    summary: string;
    stats: ProjectStat[];
    link?: { href: string; label: string };
    // The full write-up, revealed in place by "Read more"
    children?: ReactNode;
};

export const ProjectCard = ({ title, tech, summary, stats, link, children }: ProjectCardProps) => {
    return (
        <article className='project-card'>
            <div className='project-card-head'>
                <div>
                    <h3 className='project-card-title'>{title}</h3>
                    <p className='project-card-tech'>{tech}</p>
                </div>
                {link && (
                    <a className='chip-button' href={link.href} target='_blank' rel='noopener noreferrer'>
                        {link.label}
                        <FiArrowUpRight aria-hidden='true' />
                    </a>
                )}
            </div>

            <p className='project-card-summary'>{summary}</p>

            <dl className='project-card-stats'>
                {stats.map(({ value, label }) => (
                    <div key={label} className='project-card-stat'>
                        <dt className='project-card-stat-label'>{label}</dt>
                        <dd className='project-card-stat-value'>{value}</dd>
                    </div>
                ))}
            </dl>

            {children && (
                <Disclosure
                    className='project-card-more'
                    summary={
                        <span className='project-card-more-label'>
                            <span className='project-card-more-closed'>Read more</span>
                            <span className='project-card-more-open'>Show less</span>
                        </span>
                    }
                >
                    <div className='project-card-details'>{children}</div>
                </Disclosure>
            )}
        </article>
    );
};
