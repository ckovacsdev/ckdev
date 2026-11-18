import { useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import { FiArrowUpRight } from 'react-icons/fi';
import { Section } from '../section/section';
import { GITHUB_URL } from '../../data/links';
import './contributions.css';

const USERNAME = 'ckovacsdev';
// A public, cached proxy of the GitHub contribution calendar for the last 12 months
const SOURCE = `https://github-contributions-api.jogruber.de/v4/${USERNAME}?y=last`;

type Day = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };
type Calendar = { total: number; weeks: (Day | null)[][] };
type State = { status: 'loading' } | { status: 'error' } | { status: 'ready'; calendar: Calendar };

const DAY_MS = 86_400_000;
const PLACEHOLDER_WEEKS = 53;
const MONTH = new Intl.DateTimeFormat('en-US', { month: 'short', timeZone: 'UTC' });
const LONG_DATE = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

const parseDate = (date: string) => new Date(`${date}T00:00:00Z`);

// Lay the days out in Sunday-first week columns, padding the first and last weeks
const toWeeks = (days: Day[]) => {
    const weeks: (Day | null)[][] = [];
    if (!days.length) {
        return weeks;
    }
    let week: (Day | null)[] = Array(parseDate(days[0].date).getUTCDay()).fill(null);
    for (const day of days) {
        week.push(day);
        if (week.length === 7) {
            weeks.push(week);
            week = [];
        }
    }
    if (week.length) {
        weeks.push([ ...week, ...Array(7 - week.length).fill(null) ]);
    }
    return weeks;
};

// A month label sits over the first week that starts in that month
const monthLabels = (weeks: (Day | null)[][]) => {
    const labels: { index: number; label: string }[] = [];
    let last = -1;
    weeks.forEach((week, index) => {
        const first = week.find(Boolean);
        if (!first) {
            return;
        }
        const month = parseDate(first.date).getUTCMonth();
        if (month !== last) {
            last = month;
            // Skip a label squeezed in at the very start, before a full month begins
            if (index > 0 || parseDate(first.date).getUTCDate() <= 7) {
                labels.push({ index, label: MONTH.format(parseDate(first.date)) });
            }
        }
    });
    // Drop a label that would collide with the next one
    return labels.filter((l, i) => !labels[i + 1] || labels[i + 1].index - l.index >= 3);
};

const describe = (day: Day) => {
    const when = LONG_DATE.format(parseDate(day.date));
    return day.count === 0
        ? `No contributions on ${when}`
        : `${day.count} contribution${day.count === 1 ? '' : 's'} on ${when}`;
};

const placeholder: (Day | null)[][] = Array.from({ length: PLACEHOLDER_WEEKS }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => ({ date: new Date(w * 7 * DAY_MS + d * DAY_MS).toISOString().slice(0, 10), count: 0, level: 0 as const })),
);

export const Contributions = () => {
    const [ state, setState ] = useState<State>({ status: 'loading' });
    const [ tip, setTip ] = useState<{ text: string; x: number; y: number } | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const controller = new AbortController();
        fetch(SOURCE, { signal: controller.signal })
            .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
            .then((data: { total: Record<string, number>; contributions: Day[] }) => {
                const days = data.contributions ?? [];
                const total = data.total?.lastYear ?? days.reduce((sum, d) => sum + d.count, 0);
                setState({ status: 'ready', calendar: { total, weeks: toWeeks(days) } });
            })
            .catch((error: unknown) => {
                if (!controller.signal.aborted) {
                    console.warn('Contribution calendar unavailable', error);
                    setState({ status: 'error' });
                }
            });
        return () => controller.abort();
    }, []);

    // On narrow screens the chart scrolls sideways; start at the most recent weeks
    useEffect(() => {
        const el = scrollRef.current;
        if (el && state.status === 'ready') {
            el.scrollLeft = el.scrollWidth;
        }
    }, [state.status]);

    const weeks = state.status === 'ready' ? state.calendar.weeks : placeholder;
    const labels = useMemo(() => (state.status === 'ready' ? monthLabels(weeks) : []), [state.status, weeks]);

    const showTip = (e: PointerEvent<HTMLDivElement>) => {
        const cell = (e.target as HTMLElement).closest<HTMLElement>('[data-tip]');
        const chart = chartRef.current;
        if (!cell || !chart) {
            setTip(null);
            return;
        }
        const c = cell.getBoundingClientRect();
        const box = chart.getBoundingClientRect();
        setTip({ text: cell.dataset.tip ?? '', x: c.left - box.left + c.width / 2, y: c.top - box.top });
    };

    const meta = state.status === 'ready'
        ? `${state.calendar.total.toLocaleString('en-US')} contributions in the last year`
        : state.status === 'loading' ? 'Loading…' : null;

    return (
        <Section id='activity' title='GitHub Contributions' meta={meta} className='contributions'>
            {state.status === 'error' ? (
                <p className='contributions-error'>
                    The contribution chart couldn&apos;t load right now.{' '}
                    <a href={GITHUB_URL} target='_blank' rel='noopener noreferrer'>
                        See it on GitHub <FiArrowUpRight aria-hidden='true' />
                    </a>
                </p>
            ) : (
                <div className='contributions-chart' ref={chartRef} onPointerLeave={() => setTip(null)}>
                    <div className='contributions-scroll' ref={scrollRef}>
                        <div
                            className='contributions-grid'
                            data-loading={state.status === 'loading' || undefined}
                            style={{ '--weeks': weeks.length } as CSSProperties}
                            role='img'
                            aria-label={meta ?? 'GitHub contributions'}
                            onPointerOver={showTip}
                        >
                            <div className='contributions-months' aria-hidden='true'>
                                {labels.map(({ index, label }) => (
                                    <span key={`${index}-${label}`} style={{ gridColumn: index + 1 }}>{label}</span>
                                ))}
                            </div>
                            {weeks.map((week, w) => (
                                <div key={w} className='contributions-week' aria-hidden='true'>
                                    {week.map((day, d) => day ? (
                                        <span
                                            key={day.date}
                                            className='contributions-day'
                                            data-level={day.level}
                                            data-tip={state.status === 'ready' ? describe(day) : undefined}
                                        />
                                    ) : (
                                        <span key={`empty-${d}`} className='contributions-day contributions-day--empty' />
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>

                    {tip && (
                        <div className='contributions-tip' style={{ left: tip.x, top: tip.y }} aria-hidden='true'>
                            {tip.text}
                        </div>
                    )}

                    <div className='contributions-foot'>
                        <a className='contributions-link' href={GITHUB_URL} target='_blank' rel='noopener noreferrer'>
                            @{USERNAME}
                        </a>
                        <div className='contributions-legend' aria-hidden='true'>
                            <span>Less</span>
                            {[ 0, 1, 2, 3, 4 ].map((level) => (
                                <span key={level} className='contributions-day' data-level={level} />
                            ))}
                            <span>More</span>
                        </div>
                    </div>
                </div>
            )}
        </Section>
    );
};
