import './platform-details.css';

export const PlatformDetails = () => {
    return (
        <div className='platform-details'>
            <div className='platform-detail'>
                <h4 className='platform-details-heading'> The Product </h4>
                <p className='platform-details-intro'>
                    At TCW, the Platform Engineering team's mandate is to give engineers a standardized development environment to build upon.
                    Before building the internal platform, starting a project would take 30 to 40 minutes of manual configuration before a single line of business logic was written.
                    From creating the repository and wiring up CI/CD pipelines to configuring the deployments, writing the boilerplate code, provisioning secrets, Snowflake data stores, RabbitMQ messaging, and SSO connection,
                    engineering teams had to manually set up each project.  Not only was this a slow process, but it allowed for variations in configuration, leading to higher rates of mistakes and making support difficult.
                </p>
                <p className='platform-details-intro'>
                    The internal developer platform replaced the that process with automated provisioning tools.  A production ready repository with pipelines, deployment configuration and boilerplate code is generated in seconds,
                    and the infrastructure a project depends on is requested through the same interface.  Engineers start writing business logic immediately, on configuration that is identical across every project of the same type.
                </p>
                <p className='platform-details-intro'>
                    I owned the platform end to end.  If something broke, it was my responsibility to fix it, or route it to whoever could.  I wrote the React TypeScript frontend, 
                    the Apollo GraphQL middle tier, and the Go Fiber microservices behind the Snowflake account requests, Okta application management, and Workload Identity provisioning, along
                    with supporting services for profile and admin functionality.  Other services on the platform were written by my teammates, but the operational responsibility of the platform sat with me.
                </p>
            </div>

            <div className='platform-detail'>
                <h4 className='platform-details-heading'> Supported Tech Stack </h4>
                <p className='platform-details-intro'></p>
                <dl className='platform-details-stack'>
                    <div className='platform-details-stack-row'>
                        <dt className='platform-details-stack-term'> Platform Templates</dt>
                        <dd className='platform-details-stack-value'> React | TypeScript | Go Fiber & Echo | .NET Core, Minimal & Standard | Python Flask | Apollo GraphQL | TypeScript NPM Library</dd>
                    </div>
                    <div className='platform-details-stack-row'>
                        <dt className='platform-details-stack-term'> Infrastructure Requests </dt>
                        <dd className='platform-details-stack-value'> Azure Functions | Okta Applications | Azure Workload Identities | RabbitMQ messaging | Snowflake Account Registration </dd>
                    </div>
                </dl>
            </div>

            <div className='platform-detail'>
                <h4 className='platform-details-heading'> Design Decisions </h4>
                <p className='platform-details-intro'> 
                    This project was a multi-year long endeavor to both standardize and optimize the developer experience at TCW. 
                    I learned a lot along the way, and had to make many changes to both my approach to the product, and the product itself.
                </p>

                <ul className='platform-details-challenge-list'>
                    <li className='platform-details-challenge'>
                        <h5 className='platform-details-challenge-title'> Feature Independence </h5>
                        <p className='platform-details-intro'>
                            Rather than treating a new project as one orchestrated request that provisions everything at once, each resource type is requested independently.
                            Two key factors drove this decision.  First, teams rarely know everything that they are going to need up front, when a developer discovers they need a resource mid-build they can generate only what they need, when they need it.  
                            
                        </p>
                        <p className='platform-details-intro'> 
                            Second, we wanted each feature to be isolated.  GitLab, Okta and Azure were all hard dependencies.  By separating each feature out into its own microservice and request flow, an outage with one never blocked another.
                            This made both notifying users of outages and maintaining the features significantly easier.
                        </p>
                        
                    </li>

                    <li className='platform-details-challenge'>
                        <h5 className='platform-details-challenge-title'> Getting Adoption </h5>

                        <p className='platform-details-intro'>
                            Each team had a different way of engineering their projects, with preferences on the implementation of the templates.
                        </p>
                        <p className='platform-details-intro'>
                            We worked with each team to figure out where the pain points were and how they could be addressed. 
                            We then incorporated feedback from each team and made variations of the templates to accommodate their preferences while still retaining best practices and solution quality.
                            After implementing the changes, the GitLab templates became adopted org-wide with each team having their custom solution, making the platform the primary path for resource provisioning.
                        </p>
                    </li>

                    <li className='platform-details-challenge'>
                        <h5 className='platform-details-challenge-title'> Cross Team Collaboration </h5>
                        <p className='platform-details-intro'>
                            Our goal was to automate and simplify any manual task that took time and attention away from solving core problems, not only for the users of the product,
                            but also the teams that supported them.  We invested a considerable amount of time working with the Security team developing automation solutions for the many requests they had to fulfill manually each week.
                        </p>
                        <p className='platform-details-intro'>  
                            To help in the seemingly endless amount of tickets coming from engineering users, we built end-to-end requests for security infrastructure so that the security engineers did not need to spend as much time manually running scripts and configuring resources for the developers.
                            These requests included authorizations, with a full approval workflow where users requested access to resources, security could approve or reject from within the platform, the task would be automated, and the user would be notified on completion, with a dedicated 
                            status page where users could view all of their requests, and admins could see all requests, both active and complete.
                        </p>
                    </li>
                </ul>
            </div>
        </div>
    )
}