import { ProjectCard } from '../../components/project-card/project-card';
import { Section } from '../../components/section/section';
import { SiteDetails } from '../../components/case-study/site-details';
import { REPO_URL } from '../../data/links';

export const About = () => (
    <Section id='about' title='About This Site'>
        <ProjectCard
            link={{ href: REPO_URL, label: 'View Source' }}
            tech='React | TypeScript | Vite | Cloudflare'
            title='How This Site Was Built'
            summary='Built by hand, extended with Claude Code, and shipped through automated CI/CD.  The decisions, the trade-offs, and how I worked with AI to build it.'
            stats={[
                { value: '75 KB', label: 'Initial JavaScript, gzipped' },
            ]}
        >
            <SiteDetails />
        </ProjectCard>
    </Section>
);
