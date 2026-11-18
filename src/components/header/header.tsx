import { FiGithub } from 'react-icons/fi';
import { GITHUB_URL, RESUME_PATH } from '../../data/links';
import { useActiveSection } from '../../hooks/useActiveSection';
import './header.css';

const SECTIONS = [
    { id: 'work', label: 'Work' },
    { id: 'experience', label: 'Experience' },
    { id: 'skills', label: 'Skills' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
];
// 'top' is the profile: while it's in view no section link is current
const ids = [ 'top', ...SECTIONS.map((s) => s.id) ];

export const Header = () => {
    const active = useActiveSection(ids);

    return (
        <header className='header'>
            <div className='header-inner'>
                <a href='#top' className='header-mark' aria-label='Christian Kovacs, back to top'>CK</a>

                <nav className='header-nav' aria-label='Sections'>
                    {SECTIONS.map(({ id, label }) => (
                        <a
                            key={id}
                            href={`#${id}`}
                            className='header-link'
                            aria-current={active === id ? 'location' : undefined}
                        >
                            {label}
                        </a>
                    ))}
                </nav>

                <div className='header-actions'>
                    <a className='header-icon' href={GITHUB_URL} target='_blank' rel='noopener noreferrer' aria-label='GitHub'>
                        <FiGithub aria-hidden='true' />
                    </a>
                    <a className='chip-button' href={RESUME_PATH} target='_blank' rel='noopener noreferrer'>
                        Resume
                    </a>
                </div>
            </div>
        </header>
    );
};
