import { type WorkCardProps } from '../../components/work-card/work-card';
import { WorkDeck } from '../../components/work-deck/work-deck';
import TCWLogo from '../../assets/tcw.svg';
import NYULogo from '../../assets/NYU-Logo.png';
import { AiDocDetails } from '../../components/work-card/ai-doc-details';
import { PlatformDetails } from '../../components/work-card/platform-details';
import './work.css';

const WORK_CARDS: WorkCardProps[] = [
    {
        tech: 'React | TypeScript',
        title: 'Document Analysis Platform',
        subtitle: "Configurable LLM document analysis platform.  Users define rule sets, evaluate uploaded PDFs against them, and review results in a PDF viewer that matches and highlights the exact source passage behind each pass or fail.",
        stats: [
            { value: '96–98%', label: 'Source text match coverage, up from ~10%' },
            { value: '600+', label: 'Page documents analyzed in under a minute' },
            { value: '400', label: 'Documents analyzed weekly' },
        ],
        children: <AiDocDetails />
    },
    {
        tech: 'React | TypeScript | Go | GraphQL',
        title: 'Internal Developer Platform',
        subtitle: "TCW's central developer automation platform.  Provisioned templated GitLab repositories across 10 tech stacks with standardized CI/CD, along with automated Snowflake, Okta, Key Vault, and RabbitMQ resource requests.",
        stats: [
            { value: '20 sec', label: 'To a production-ready repo, down from 35 min' },
            { value: '10', label: 'Templated tech stacks, up from 2' },
            { value: '50', label: 'Manual tickets eliminated monthly' },
        ],
        children: <PlatformDetails />
    }
]

type HistoryEntry = {
    org: string;
    logo: string;
    roles: {
        title: string;
        dates: string;
        highlights?: string[];
    }[];
};

const HISTORY: HistoryEntry[] = [
    {
        org: 'TCW Group',
        logo: TCWLogo,
        roles: [
            {
                title: 'Software Engineer, Platform Engineering',
                dates: 'Jan. 2023 – Present',
                highlights: [
                    'Built the frontend for an AI document analysis platform that evaluates 600+ page PDFs in under a minute.',
                    'Scaled the self-service developer platform from 2 to 10 tech stacks, making it the standard provisioning path for new services org-wide.',
                    'Automated Key Vault, AMQP, Snowflake, and Okta provisioning with the security team, eliminating 50 manual tickets a month.',
                ],
            },
            {
                title: 'Platform Engineering Intern',
                dates: 'Jun. 2022 – Dec. 2022',
                highlights: [
                    'Founding engineer on the internal developer platform, building the React and TypeScript application from scratch.',
                    'Delivered self-service repository provisioning, giving developers production-ready repositories in under 20 seconds.',
                    'Raised unit test coverage on the GitLab-integrated .NET service to 80% before launch.',
                ],
            },
        ],
    },
    {
        org: 'New York University',
        logo: NYULogo,
        roles: [
            {
                title: 'BA, Computer Science',
                dates: 'Dec. 2022',
                highlights: [
                    'Core coursework in Data Structures, Algorithms, Operating Systems, and Computer Systems Organization.',
                    'Applied coursework in Software Engineering, Applied Internet Technology, and Natural Language Processing.',
                    'Fenced saber for the NYU fencing team.',
                ],
            },
        ],
    },
];

export const Work = () => {
    return (
        <div className='work-container'>
            <h2 className='section-title'>  Professional Projects </h2>
            <WorkDeck items={WORK_CARDS} label='Professional projects' />

            <div className='work-history-container'>
                <h2 className='section-title'>  Experience & Education </h2>
                {HISTORY.map(({ org, logo, roles }) => (
                    <div key={org} className='work-history-item'>
                        <img src={logo} alt='' className='work-history-item-logo' />
                        <div className='work-history-item-text'>
                            <div className='work-history-item-head'>
                                <h3 className='work-history-item-company'>{org}</h3>
                            </div>
                            <ol className='work-history-roles'>
                                {roles.map(({ title, dates, highlights }) => (
                                    <li key={title} className='work-history-role'>
                                        <div className='work-history-role-head'>
                                            <h4 className='work-history-item-position'>{title}</h4>
                                            <p className='work-history-role-dates'>{dates}</p>
                                        </div>
                                        {highlights && (
                                            <ul className='work-history-highlights'>
                                                {highlights.map((h) => <li key={h}>{h}</li>)}
                                            </ul>
                                        )}
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
