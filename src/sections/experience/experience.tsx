import TCWLogo from '../../assets/tcw.svg';
import NYULogo from '../../assets/NYU-Logo.png';
import { Disclosure } from '../../components/disclosure/disclosure';
import { Section } from '../../components/section/section';
import './experience.css';

type Role = {
    title: string;
    dates: string;
    highlights: string[];
};

type Entry = {
    org: string;
    logo: string;
    roles: Role[];
};

const HISTORY: Entry[] = [
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

export const Experience = () => (
    <Section id='experience' title='Experience & Education'>
        <div className='experience-list'>
            {HISTORY.map(({ org, logo, roles }) => (
                <div key={org} className='experience-org'>
                    <div className='experience-org-head'>
                        <img src={logo} alt='' className='experience-logo' width={32} height={32} />
                        <h3 className='experience-org-name'>{org}</h3>
                    </div>

                    <ol className='experience-roles'>
                        {roles.map(({ title, dates, highlights }) => (
                            <li key={title} className='experience-role'>
                                <Disclosure
                                    className='experience-role-disclosure'
                                    summary={
                                        <span className='experience-role-summary'>
                                            <span className='experience-role-title'>{title}</span>
                                            <span className='experience-role-dates'>{dates}</span>
                                        </span>
                                    }
                                >
                                    <ul className='experience-highlights'>
                                        {highlights.map((h) => <li key={h}>{h}</li>)}
                                    </ul>
                                </Disclosure>
                            </li>
                        ))}
                    </ol>
                </div>
            ))}
        </div>
    </Section>
);
