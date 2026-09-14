import WorkCard, { type WorkCardProps } from '../../components/work-card/work-card';
import TCWLogo from '../../assets/tcw.svg';
import NYULogo from '../../assets/NYU-Logo.png';
import './work.css';

const WORK_CARDS: WorkCardProps[] = [
    { 
        tech: 'React | TypeScript', 
        title: 'AI Document Analysis Platform', 
        subtitle: "Configurable LLM document analysis platform.  Users define rule sets, evaluate uploaded PDFs against them, and review results in a PDF viewer that matches and highlights the exact source passage behind each pass or fail."
    },
    { 
        tech: 'React | TypeScript | Go | GraphQL | .NET Core', 
        title: 'Internal Developer Platform', 
        subtitle: "TCW's central developer automation platform.  Provisioned templated GitLab repositories across 10 tech stacks with standardized CI/CD, along with automated Snowflake, Okta, Key Vault, and RabbitMQ resource requests."
    }
]

export const Work = () => {
    return (
        <div className='work-container'>
            <h2 className='work-title'>  Professional Projects </h2>
            <div className='work-projects'>
                {WORK_CARDS.map(c => (
                    <WorkCard tech={c.tech} title={c.title} subtitle={c.subtitle} />
                ))}
            </div>

            <div className='work-projects-minor'> 
                <WorkCard tech='test' title='test' subtitle=''/>
                <WorkCard tech='test' title='test' subtitle=''/>
                <WorkCard tech='test' title='test' subtitle=''/>
            </div>

            <div className='work-history-container'>
                <h2 className='work-title'>  Experience & Education </h2>
                <div className='work-history-item'>
                    <img src={TCWLogo} alt='' className='work-history-item-logo' />
                    <div className='work-history-item-text'>
                        <h3 className='work-history-item-position'>Software Engineer, Platform Engineering</h3>
                        <p className='work-history-item-company'>TCW Group</p>
                    </div>
                    <p className='work-history-item-dates'>2022 &#45; Present</p>
                </div>
                <div className='work-history-item'>
                    <img src={NYULogo} alt='NY University Logo' className='work-history-item-logo' />
                    <div className='work-history-item-text'>
                        <h3 className='work-history-item-position'> BA, Computer Science </h3>
                        <p className='work-history-item-company'> New York University </p>
                    </div>
                    <p className='work-history-item-dates'>Grad. 2022</p>
                </div>
            </div>
        </div>
    )
}