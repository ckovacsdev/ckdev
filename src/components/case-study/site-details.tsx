import './case-study.css';

export const SiteDetails = () => {
    return (
        <div className='details'>
            <div className='details-section'>
                <h4 className='details-heading'> The Product </h4>
                <p className='details-intro'>
                    I built the first version of this site by hand to set the structure and visual design. The layout, color, type and all base visual elements were designed and implemented by me.
                    I then used Claude Code to extend it, refining the visual design and adding improved interactivity and animation, then reviewing each change and every line of code the LLM updated.
                </p>
            </div>

            <div className='details-section'>
                <h4 className='details-heading'> Tech Stack </h4>
                <dl className='details-stack'>
                    <div className='details-stack-row'>
                        <dt className='details-stack-term'> Application </dt>
                        <dd className='details-stack-value'> React | TypeScript | Vite | CSS </dd>
                    </div>
                    <div className='details-stack-row'>
                        <dt className='details-stack-term'> Delivery </dt>
                        <dd className='details-stack-value'> Cloudflare Workers static assets | GitHub Actions CI/CD </dd>
                    </div>
                </dl>
            </div>

            <div className='details-section'>
                <h4 className='details-heading'> Design Decisions </h4>

                <ul className='details-challenge-list'>
                    <li className='details-challenge'>
                        <h5 className='details-challenge-title'> No UI framework </h5>
                        <p>
                            A component library would have been faster to start with, but I wanted everything on the site to be custom.  Speed of delivery was not the primary goal of developing this website.
                            Instead, everything is plain CSS, responsive from a 4K monitor to a phone screen, and dependent only on React and an icon set.
                        </p>
                    </li>

                    <li className='details-challenge'>
                        <h5 className='details-challenge-title'> A single page </h5>
                        <p>
                            The site is one page with anchored sections rather than a routed app.  React Router added complexity that a site this simple did not benefit from.
                        </p>
                    </li>

                    <li className='details-challenge'>
                        <h5 className='details-challenge-title'> Automated deploys </h5>
                        <p>
                            For someone on a Platform Engineering team, automating deployments for this site was not even a technical decision.  Even though this is a small, simple website that only I work on,
                            and automation saves only a few seconds of typing commands, it had to be automated.
                        </p>
                    </li>
                </ul>
            </div>

            <div className='details-section'>
                <h4 className='details-heading'> Building with AI </h4>
                <p className='details-intro'>
                    Before using Claude Code to enhance the look and interaction of the site, I built out all of the components, the layout and placement, and set the design standard.
                    Once I was happy with the way things looked and felt, I used Claude to enhance the responsiveness of the site and the animations of the components.
                    Each line of code written by the LLM was hand-reviewed by me before committing and deploying.
                    I also used Claude to experiment with different design decisions to quickly see various animations and landing page designs before implementing and expanding upon them.
                </p>

                <ul className='details-challenge-list'>
                    <li className='details-challenge'>
                        <h5 className='details-challenge-title'> Catching mistakes </h5>
                        <p>
                            The output was not always right.  One CSS edit landed inside the wrong rule, which made the project cards grow when hovered.
                            I caught it in review because a card should only lift, never change size, and the rule was restored.
                        </p>
                        <p>
                            In another case, the borders of the cards would disappear at various screen widths.  The cause was that cards would clip other divs at smaller widths and cover their borders where they overlapped.
                            The fix was to adjust spacing that the LLM didn't pick up on, and manually verify the form and placement of each page at every screen size.
                        </p>
                    </li>

                    <li className='details-challenge'>
                        <h5 className='details-challenge-title'> Verifying the output </h5>
                        <p>
                            Every change was screenshotted at phone, tablet, and desktop widths, along with many sizes in between, and anything visual was checked in the browser before I accepted it.
                            Lint, type checks, and the build run on every pull request, so nothing reaches main without passing them.
                        </p>
                    </li>
                </ul>
            </div>

            <div className='details-section'>
                <h4 className='details-heading'> Results </h4>
                <p className='details-intro'>
                    The page loads about 79 KB of JavaScript up front. It respects reduced motion settings throughout.
                </p>
            </div>
        </div>
    )
}
