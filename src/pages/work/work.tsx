import WorkCard, { type WorkCardProps } from '../../components/work-card/work-card';
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
            <div className='work-titles'>
                <h2 className='work-title'>  Professional Experience </h2>
            </div>

            <div className='work-projects'>
                {WORK_CARDS.map(c => (
                    <WorkCard tech={c.tech} title={c.title} subtitle={c.subtitle} />
                ))}
            </div>
        </div>
    )
}