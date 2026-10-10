import { useActiveSection } from '../../hooks/useActiveSection';
import { useScrollValue } from '../../hooks/useScrollValue';
import './navi.css';

const SECTIONS = [
    { id: 'home', label: 'Home' },
    { id: 'work', label: 'Work' },
    { id: 'skills', label: 'Skills' },
    { id: 'contact', label: 'Contact' },
]
const ids = SECTIONS.map((s) => s.id);

const SOLID_AFTER = 80;
const toSolid = (y: number) => `${Math.min(y / SOLID_AFTER, 1)}`;
const markScrolled = (el: HTMLElement, y: number) => {
    el.toggleAttribute('data-scrolled', y > SOLID_AFTER / 2);
};

export const Navigation = () => {
    const active = useActiveSection(ids);
    const barRef = useScrollValue<HTMLElement>('--nav-solid', toSolid, markScrolled);

    return(
        <header className='navigation-bar' ref={barRef}>
            <nav className='navigation-container'>
                {SECTIONS.map(({ id, label }) => (
                    <a
                        key={id}
                        href={`#${id}`}
                        className='nav-link'
                        aria-current={active === id ? 'location' : undefined}
                    >
                        {label}
                    </a>
                ))}
            </nav>
        </header>
    )
}
