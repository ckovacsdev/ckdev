import { useEffect, useState } from 'react';

// My local time, in Hoboken
const CLOCK = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', hour: 'numeric', minute: '2-digit' });
const now = () => CLOCK.format(new Date());
const untilNextMinute = () => 60_000 - (Date.now() % 60_000) + 50;

/** The current time in New York, e.g. "9:41 AM", updated on the minute */
export const useLocalTime = () => {
    const [ time, setTime ] = useState(now);

    useEffect(() => {
        let timer = 0;
        const tick = () => {
            setTime(now());
            timer = window.setTimeout(tick, untilNextMinute());
        };
        timer = window.setTimeout(tick, untilNextMinute());
        return () => window.clearTimeout(timer);
    }, []);

    return time;
};
