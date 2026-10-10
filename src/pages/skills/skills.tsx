import './skills.css';

const SKILL_GROUPS = [
    {
        title: 'Languages',
        items: ['TypeScript', 'JavaScript', 'Go', 'C#', 'HTML/CSS'],
    },
    {
        title: 'Frontend',
        items: ['React', 'Material UI', 'Ant Design', 'react-pdf', 'react-chartjs-2', 'Server-Sent Events'],
    },
    {
        title: 'Backend & Tooling',
        items: ['Go (Fiber)', '.NET', 'Apollo GraphQL', 'GitLab CI/CD', 'Git', 'Vitest', 'Figma'],
    },
    {
        title: 'Platform Integrations',
        items: ['Okta', 'Azure Key Vault', 'Azure Workload Identities', 'Azure Functions', 'RabbitMQ', 'Snowflake'],
    },
]

export const Skills = () => {
    return (
        <div className='skills-container'>
            <h2 className='section-title'> Technical Skills </h2>
            <div className='skills-grid'>
                {SKILL_GROUPS.map(({ title, items }) => (
                    <div key={title} className='skills-group chamfer'>
                        <h3 className='skills-group-title'>{title}</h3>
                        <ul className='skills-list'>
                            {items.map((item) => (
                                <li key={item} className='skills-item'>{item}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    )
}
