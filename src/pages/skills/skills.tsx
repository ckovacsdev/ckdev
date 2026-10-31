import type { IconType } from 'react-icons';
import {
    TbArrowsExchange,
    TbBolt,
    TbBrandCSharp,
    TbBrandFigma,
    TbBrandGit,
    TbBrandGitlab,
    TbBrandGolang,
    TbBrandGraphql,
    TbBrandHtml5,
    TbBrandJavascript,
    TbBrandReact,
    TbBrandSnowflake,
    TbBrandTypescript,
    TbBroadcast,
    TbChartDonut,
    TbComponents,
    TbFileTypePdf,
    TbFingerprint,
    TbIdBadge2,
    TbKey,
    TbLayoutDashboard,
    TbSquareLetterN,
    TbTestPipe,
} from 'react-icons/tb';
import { useScrollSequence } from '../../hooks/useScrollSequence';
import './skills.css';

type Skill = {
    name: string;
    icon: IconType;
};

type SkillGroup = {
    title: string;
    summary: string;
    skills: Skill[];
};

const SKILL_GROUPS: SkillGroup[] = [
    {
        title: 'Languages',
        summary: 'TypeScript on the frontend, Go and C# for the services behind it.',
        skills: [
            { name: 'TypeScript', icon: TbBrandTypescript },
            { name: 'JavaScript', icon: TbBrandJavascript },
            { name: 'Go', icon: TbBrandGolang },
            { name: 'C#', icon: TbBrandCSharp },
            { name: 'HTML/CSS', icon: TbBrandHtml5 },
        ],
    },
    {
        title: 'Frontend',
        summary: 'Feature-dense React apps with PDF viewers, charts, and live updates.',
        skills: [
            { name: 'React', icon: TbBrandReact },
            { name: 'Material UI', icon: TbComponents },
            { name: 'Ant Design', icon: TbLayoutDashboard },
            { name: 'react-pdf', icon: TbFileTypePdf },
            { name: 'react-chartjs-2', icon: TbChartDonut },
            { name: 'Server-Sent Events', icon: TbBroadcast },
        ],
    },
    {
        title: 'Backend & Tooling',
        summary: 'Services, GraphQL APIs, and the pipelines that test and ship them.',
        skills: [
            { name: 'Go (Fiber)', icon: TbBrandGolang },
            { name: '.NET', icon: TbSquareLetterN },
            { name: 'Apollo GraphQL', icon: TbBrandGraphql },
            { name: 'GitLab CI/CD', icon: TbBrandGitlab },
            { name: 'Git', icon: TbBrandGit },
            { name: 'Vitest', icon: TbTestPipe },
            { name: 'Figma', icon: TbBrandFigma },
        ],
    },
    {
        title: 'Platform Integrations',
        summary: 'Self-service provisioning for identity, secrets, messaging, and data.',
        skills: [
            { name: 'Okta', icon: TbFingerprint },
            { name: 'Azure Key Vault', icon: TbKey },
            { name: 'Azure Workload Identities', icon: TbIdBadge2 },
            { name: 'Azure Functions', icon: TbBolt },
            { name: 'RabbitMQ', icon: TbArrowsExchange },
            { name: 'Snowflake', icon: TbBrandSnowflake },
        ],
    },
]

export const Skills = () => {
    const trackRef = useScrollSequence();

    return (
        <div className='skills-track' ref={trackRef}>
            <div className='skills-stage'>
                <div className='skills-container'>
                    <h2 className='section-title'> Technical Skills </h2>
                    <div className='skills-grid'>
                        {SKILL_GROUPS.map(({ title, summary, skills }, i) => (
                            <div key={title} className='skills-card' data-step={i}>
                                <h3 className='skills-card-title'>{title}</h3>
                                <p className='skills-card-summary'>{summary}</p>
                                <ul className='skills-list'>
                                    {skills.map(({ name, icon: Icon }) => (
                                        <li key={name} className='skills-item'>
                                            <Icon className='skills-item-icon' aria-hidden='true' />
                                            {name}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
