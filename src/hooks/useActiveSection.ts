import { useEffect, useState } from 'react';

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
