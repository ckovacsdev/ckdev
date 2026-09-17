import './ai-doc-details.css';

export const AiDocDetails = () => {
    return (
        <div className='ai-doc-details'>
            <div className='ai-doc-detail'>
                <h4 className='ai-doc-details-heading'> The Product </h4>
                <p className='ai-doc-details-intro'>
                    This project is a configurable platform for evaluating PDF documents against a user defined rule set.
                    The users write reusable rule sets, upload a document, run it through the AI analysis engine, then can 
                    review the results in an interactive interface.  Compliance is displayed in charts to show a numeric
                    view, along with a custom PDF viewer with exact matching of LLM results and base document text, allowing
                    the user to see visually the rule compliance results of each section of text within the document. 
                </p>
                <p className='ai-doc-details-intro'>                                
                    I built the frontend for the project using React and TypeScript within our internal monorepo, including the rule set editor
                    virtualized PDF viewer with hightlighting and navigation, and real time job monitoring with Server Sent Events.
                </p>
            </div>

            <div className='ai-doc-detail'>
                <h4 className='ai-doc-details-heading'> Building the PDF viewer </h4>
                <p className='ai-doc-details-intro'>
                    Three problems, all in the interactive viewer that displays LLM results against the source document.
                </p>

                <ul className='ai-doc-details-challenge-list'>
                    <li className='ai-doc-details-challenge'>
                        <h5 className='ai-doc-details-challenge-title'> Rendering thousands of pages </h5>
                        <p>
                            Documents could be up to thousands of pages, far more than the DOM can hold performantly.
                            I virtualized the document to keep four pages mounted at a time, loading ahead as
                            the user scrolls or navigates to highlights.
                        </p>
                    </li>

                    <li className='ai-doc-details-challenge'>
                        <h5 className='ai-doc-details-challenge-title'> Matching model output to the text layer </h5>
                        <p>
                            The model returned 3,000 character chunks that had to be located in the PDF's raw
                            text layer. Direct matching of chunks was ineffective as the response was normalized and did 
                            not account for variations in special character encoding and new lines, leading to around a 10% initial coverage.
                        </p>
                        <p>
                            The fix was a progressive fallback. First attempt the full chunk, then paragraphs, then
                            sentences, then five word windows. Shorter strings were significantly easier to match, so each
                            check was able to find gaps in what the previous check missed.  Increasing from a baseline of around 10% match coverage 
                            to around 96-98% coverage depending on the complexity of the document.
                        </p>
                    </li>

                    <li className='ai-doc-details-challenge'>
                        <h5 className='ai-doc-details-challenge-title'> Highlighting without blocking the UI </h5>
                        <p>
                            With thousands of matches across hundreds of pages, rebuilding highlights on every
                            filter change was too expensive. I precompute and cache highlight geometry per chunk
                            on load, then update the rest as the user scrolls. Initial load costs slightly more, but
                            filter interaction load dropped by 50%.
                        </p>
                    </li>
                </ul>
            </div>
        </div>
    )
}