import { ProjectCard, type ProjectCardProps } from '../../components/project-card/project-card';
import { Section } from '../../components/section/section';
import { AiDocDetails } from '../../components/case-study/ai-doc-details';
import { PlatformDetails } from '../../components/case-study/platform-details';
import { MatchDemo } from '../../components/work-demos/match-demo';
import { ProvisionDemo } from '../../components/work-demos/provision-demo';
import './projects.css';

const PROJECTS: ProjectCardProps[] = [
    {
        tech: 'React | TypeScript',
        title: 'Document Analysis Platform',
        summary: "Configurable LLM document analysis platform.  Users define rule sets, evaluate uploaded PDFs against them, and review results in a PDF viewer that matches and highlights the exact source passage behind each pass or fail.",
        stats: [
            { value: '96–98%', label: 'Source text match coverage, up from ~10%' },
            { value: '600+', label: 'Page documents analyzed in under a minute' },
            { value: '400', label: 'Documents analyzed weekly' },
        ],
        demo: <MatchDemo />,
        children: <AiDocDetails />,
    },
    {
        tech: 'React | TypeScript | Go | GraphQL',
        title: 'Internal Developer Platform',
        summary: "TCW's central developer automation platform.  Provisioned templated GitLab repositories across 10 tech stacks with standardized CI/CD, along with automated Snowflake, Okta, Key Vault, and RabbitMQ resource requests.",
        stats: [
            { value: '20 sec', label: 'To a production-ready repo, down from 35 min' },
            { value: '10', label: 'Templated tech stacks, up from 2' },
            { value: '50', label: 'Manual tickets eliminated monthly' },
        ],
        demo: <ProvisionDemo />,
        children: <PlatformDetails />,
    },
];

export const Projects = () => (
    <Section id='work' title='Professional Projects'>
        <div className='projects-list'>
            {PROJECTS.map((project) => <ProjectCard key={project.title} {...project} />)}
        </div>
    </Section>
);
