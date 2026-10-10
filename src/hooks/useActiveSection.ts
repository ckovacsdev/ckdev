import { useEffect, useState } from 'react';

const ACTIVE_LINE = 0.5;

export const useActiveSection = (ids: string[]) => {
    const [ active, setActive ] = useState(ids[0]);

    useEffect(() => {
        let frame = 0;

        const update = () => {
            frame = 0;
            const root = document.documentElement;
            const atBottom = window.innerHeight + window.scrollY >= root.scrollHeight - 2;
            if (atBottom) {
                setActive(ids[ids.length - 1]);
                return;
            }

            const line = window.innerHeight * ACTIVE_LINE;
            let current = ids[0];
            ids.forEach((id) => {
                const element = document.getElementById(id);
                if (element && element.getBoundingClientRect().top <= line) {
                    current = id;
                }
            });
            setActive(current);
        };

        const onScroll = () => {
            if (frame) {
                return;
            }
            frame = requestAnimationFrame(update);
        };

        update();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);

        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
            if (frame) {
                cancelAnimationFrame(frame);
            }
        };
    }, [ids]);

    return active;
}
