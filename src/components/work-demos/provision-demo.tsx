import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { TbCircle, TbCircleCheck, TbCircleDot } from 'react-icons/tb';
import './work-demos.css';

// Who does each step: the requester, the security team, or the platform on its own
type Actor = 'you' | 'security' | 'platform';

const ACTOR_LABEL: Record<Actor, string> = {
    you: 'You',
    security: 'Security team',
    platform: 'Automated',
};

// seconds: how long the step adds to the clock. wait: the run pauses here, clock stopped,
// until someone else acts, since a real wait isn't time the platform spends working
type Step = { text: string; by: Actor; seconds?: number; wait?: string };

type Resource = {
    name: string;
    noun: string; // names the button and the result, so "Create X" ends in "X created"
    steps: Step[];
    // Measured before-and-after times, only where the platform has them
    timing?: { platformSeconds: number; manualMinutes: number };
    byHand?: string;
    withPlatform?: string;
};

// Snowflake requests still need a security sign-off, but approving is the team's only step:
// the platform creates the account and closes the request itself
const RESOURCES: Resource[] = [
    {
        name: 'Repository',
        noun: 'repository',
        steps: [
            { text: 'Create the GitLab repository', by: 'platform', seconds: 4 },
            { text: 'Apply the project template', by: 'platform', seconds: 4 },
            { text: 'Configure the CI/CD pipeline', by: 'platform', seconds: 4 },
            { text: 'Add the deployment config', by: 'platform', seconds: 4 },
            { text: 'Push the first commit', by: 'platform', seconds: 4 },
        ],
        timing: { platformSeconds: 20, manualMinutes: 35 },
    },
    {
        name: 'Snowflake service account',
        noun: 'service account',
        steps: [
            { text: 'Request a Snowflake service account', by: 'you', seconds: 3 },
            { text: 'Press Approve', by: 'security', wait: 'Waiting for approval' },
            { text: 'Create it in Snowflake', by: 'platform', seconds: 5 },
            { text: 'Update the status page', by: 'platform', seconds: 2 },
            { text: 'Notify the requester', by: 'platform', seconds: 2 },
        ],
        byHand: 'Security runs scripts and configures it',
        withPlatform: 'Security presses Approve',
    },
    {
        name: 'Okta application',
        noun: 'Okta application',
        steps: [
            { text: 'Enter the application details', by: 'you' },
            { text: 'Submit the request', by: 'you' },
            { text: 'Register the application in Okta', by: 'platform' },
            { text: 'Open it in the Okta dashboard', by: 'you' },
        ],
        byHand: 'Ticket to the security team',
        withPlatform: 'Self-service request',
    },
];

// Playback speed: clock seconds run fast, waits hold long enough to read, untimed steps share one pace
const MS_PER_SECOND = 130;
const WAIT_MS = 1800;
const UNTIMED_STEP_MS = 520;
const MOST_STEPS = Math.max(...RESOURCES.map(({ steps }) => steps.length));

const stepMs = ({ seconds, wait }: Step) =>
    wait ? WAIT_MS : seconds !== undefined ? seconds * MS_PER_SECOND : UNTIMED_STEP_MS;

// A resource shows a clock when every step either adds time or waits on someone
const isTimed = (steps: Step[]) => steps.every(({ seconds, wait }) => seconds !== undefined || wait);

const capitalize = (text: string) => text[0].toUpperCase() + text.slice(1);

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const ProvisionDemo = () => {
    const [ resource, setResource ] = useState(RESOURCES[0]);
    const [ elapsed, setElapsed ] = useState(0); // playback ms since the run started
    const [ running, setRunning ] = useState(false);
    const frameRef = useRef(0);

    useEffect(() => () => cancelAnimationFrame(frameRef.current), []);

    const { noun, steps, timing, byHand, withPlatform } = resource;
    const result = `${capitalize(noun)} created`;
    const timed = isTimed(steps);
    const total = steps.reduce((sum, step) => sum + stepMs(step), 0);
    const finished = elapsed >= total;

    // Walk the steps to find how many are done, how far into the current one the run is,
    // and what the clock reads: whole seconds of finished steps plus the current step's share
    let done = 0;
    let into = elapsed;
    let clock = 0;
    while (done < steps.length && into >= stepMs(steps[done])) {
        into -= stepMs(steps[done]);
        clock += steps[done].seconds ?? 0;
        done++;
    }
    const current = running ? steps[done] : undefined;
    if (current?.seconds) {
        clock += Math.floor((into / stepMs(current)) * current.seconds);
    }
    const waiting = current?.wait;
    const seconds = steps.reduce((sum, step) => sum + (step.seconds ?? 0), 0);

    const create = () => {
        cancelAnimationFrame(frameRef.current);
        if (prefersReducedMotion()) {
            setElapsed(total);
            return;
        }

        setRunning(true);
        setElapsed(0);
        const start = performance.now();
        const tick = (now: number) => {
            const next = Math.min(now - start, total);
            setElapsed(next);
            if (next < total) {
                frameRef.current = requestAnimationFrame(tick);
            } else {
                setRunning(false);
            }
        };
        frameRef.current = requestAnimationFrame(tick);
    };

    const pick = (next: Resource) => {
        cancelAnimationFrame(frameRef.current);
        setRunning(false);
        setElapsed(0);
        setResource(next);
    };

    return (
        <div className='work-demo'>
            <p className='work-demo-intro'>
                Pick a resource and request it the way engineers at TCW do.
            </p>

            <div className='work-demo-options' role='group' aria-label='Resource'>
                {RESOURCES.map((option) => (
                    <button
                        key={option.name}
                        type='button'
                        className='work-demo-option'
                        aria-pressed={resource === option}
                        onClick={() => pick(option)}
                    >
                        {option.name}
                    </button>
                ))}
            </div>

            <ol className='provision-demo-steps' style={{ '--rows': MOST_STEPS } as CSSProperties}>
                {steps.map(({ text, by }, i) => {
                    const state = i < done ? 'done' : running && i === done ? 'active' : undefined;
                    const Icon = state === 'done' ? TbCircleCheck : state === 'active' ? TbCircleDot : TbCircle;
                    return (
                        <li key={text} className='provision-demo-step' data-state={state}>
                            <Icon className='provision-demo-icon' aria-hidden='true' />
                            <span className='provision-demo-text'>{text}</span>
                            <span className='provision-demo-actor' data-actor={by}>{ACTOR_LABEL[by]}</span>
                        </li>
                    );
                })}
            </ol>

            <div className='work-demo-controls'>
                <button type='button' className='work-demo-action' onClick={create} disabled={running}>
                    Create {noun}
                </button>
                <p className='work-demo-readout' aria-hidden='true'>
                    {timed ? (
                        <span className='work-demo-value'>0:{String(clock).padStart(2, '0')}</span>
                    ) : (
                        <span className='work-demo-value'>{done}/{steps.length}</span>
                    )}
                    {finished
                        ? ` ${noun} created`
                        : waiting ? ` ${waiting.toLowerCase()}…` : timed ? ' elapsed' : ' steps'}
                </p>
            </div>
            <p className='work-demo-sr' aria-live='polite'>
                {finished ? (timing ? `${result} in ${seconds} seconds` : result) : waiting ?? ''}
            </p>

            <dl className='provision-demo-compare'>
                <div className='provision-demo-bar'>
                    <dt>By hand</dt>
                    {timing ? (
                        <dd>
                            <span className='provision-demo-track'>
                                <span className='provision-demo-fill' style={{ inlineSize: '100%' }} />
                            </span>
                            {timing.manualMinutes} min
                        </dd>
                    ) : (
                        <dd className='provision-demo-note'>{byHand}</dd>
                    )}
                </div>
                <div className='provision-demo-bar'>
                    <dt>With the platform</dt>
                    {timing ? (
                        <dd>
                            <span className='provision-demo-track'>
                                <span
                                    className='provision-demo-fill provision-demo-fill--platform'
                                    style={{ inlineSize: `${(100 * timing.platformSeconds) / (timing.manualMinutes * 60)}%` }}
                                />
                            </span>
                            {timing.platformSeconds} sec
                        </dd>
                    ) : (
                        <dd className='provision-demo-note provision-demo-note--platform'>{withPlatform}</dd>
                    )}
                </div>
            </dl>
        </div>
    );
};
