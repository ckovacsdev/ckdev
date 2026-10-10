import { useActiveSection } from '../../hooks/useActiveSection';
import './navi.css';

const SECTIONS = [
    { id: 'home', label: 'Home' },
    { id: 'work', label: 'Experience' },
]
const ids = SECTIONS.map((s) => s.id);

export const Navigation = () => {
    const active = useActiveSection(ids);

    return(
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
    )
}