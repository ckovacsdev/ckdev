import { useEffect, useState } from 'react';
import './navi.css';

export const SECTIONS = [
    { id: 'home', label: 'Home' },
    { id: 'work', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'about', label: 'About Me'}
]
const ids = SECTIONS.map((s) => s.id);

export const useActiveSection = (ids: string[]) => {
    const [ active, setActive ] = useState(ids[0]);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            const hit = entries.find((e) => e.isIntersecting);
            if(hit) {
                setActive(hit.target.id);
            }
        }, { rootMargin: '-45% 0px -50% 0px' });

        ids.forEach((id) => {
            const element = document.getElementById(id);
            if (element) {
                observer.observe(element);
            }
        });

        return () => observer.disconnect();
    }, [ids]);

    return active;
}

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