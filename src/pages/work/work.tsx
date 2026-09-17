import WorkCard, { type WorkCardProps } from '../../components/work-card/work-card';
import TCWLogo from '../../assets/tcw.svg';
import NYULogo from '../../assets/NYU-Logo.png';
import { AiDocDetails } from '../../components/work-card/ai-doc-details';
import './work.css';

const WORK_CARDS: WorkCardProps[] = [
    { 
        tech: 'React | TypeScript', 
        title: 'Document Analysis Platform', 
        subtitle: "Configurable LLM document analysis platform.  Users define rule sets, evaluate uploaded PDFs against them, and review results in a PDF viewer that matches and highlights the exact source passage behind each pass or fail.",
        subtext: '400 Weekly Documents | <1 min Process Time | Real Time Monitoring',
        children: <AiDocDetails />
    },
    { 
        tech: 'React | TypeScript | Go | GraphQL', 
        title: 'Internal Developer Platform',
        subtext: '10 Tech Stacks | Resource Requistion | Automated CI/CD ', 
        subtitle: "TCW's central developer automation platform.  Provisioned templated GitLab repositories across 10 tech stacks with standardized CI/CD, along with automated Snowflake, Okta, Key Vault, and RabbitMQ resource requests."
    }
]

export const Work = () => {
    return (
        <div className='work-container'>
            <h2 className='work-title'>  Professional Projects </h2>
            <div className='work-projects'>
                {WORK_CARDS.map(c => (
                    <WorkCard
                        key={c.title}
                        tech={c.tech} 
                        title={c.title} 
                        subtext={c.subtext}
                        subtitle={c.subtitle}
                        children={c.children}
                    /> 
                ))}
            </div>

            <div className='work-history-container'>
                <h2 className='work-title'>  Experience & Education </h2>
                <div className='work-history-item'>
                    <img src={TCWLogo} alt='' className='work-history-item-logo' />
                    <div className='work-history-item-text'>
                        <h3 className='work-history-item-position'>Software Engineer, Platform Engineering</h3>
                        <p className='work-history-item-company'>TCW Group</p>
                    </div>
                    <p className='work-history-item-dates'> Jan. 2023 &#45; Present</p>
                </div>
                <div className='work-history-item'>
                    <img src={TCWLogo} alt='' className='work-history-item-logo' />
                    <div className='work-history-item-text'>
                        <h3 className='work-history-item-position'>Platform Engineering Intern, Platform Engineering</h3>
                        <p className='work-history-item-company'>TCW Group</p>
                    </div>
                    <p className='work-history-item-dates'>Jun. 2022 &#45; Dec. 2022 </p>
                </div>
                <div className='work-history-item'>
                    <img src={NYULogo} alt='NY University Logo' className='work-history-item-logo' />
                    <div className='work-history-item-text'>
                        <h3 className='work-history-item-position'> BA, Computer Science </h3>
                        <p className='work-history-item-company'> New York University </p>
                    </div>
                    <p className='work-history-item-dates'>Dec. 2022</p>
                </div>
            </div>
        </div>
    )
}