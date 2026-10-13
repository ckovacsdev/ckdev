import WorkCard from '../../components/work-card/work-card';
import { SiteDetails } from '../../components/work-card/site-details';
import { REPO_URL } from '../../data/links';
import './about.css';

export const About = () => {
    return (
        <div className='about-container'>
            <h2 className='section-title'> About This Site </h2>
            <WorkCard
                compact
                link={{ href: REPO_URL, label: 'View Source' }}
                tech='React | TypeScript | Three.js | Vite | Cloudflare'
                title='How This Site Was Built'
                subtitle="An art deco inspired design system, built by hand and extended with Claude Code and shipped through automated CI/CD.  The decisions, the trade-offs, and how I worked with AI to build it."
                stats={[
                    { value: '100', label: 'Lighthouse accessibility, best practices & SEO' },
                    { value: '87–100', label: 'Lighthouse performance, desktop & mobile' },
                    { value: '72 KB', label: 'Initial JavaScript, gzipped' },
                ]}
            >
                <SiteDetails />
            </WorkCard>
        </div>
    )
}
