import { useState } from 'react';
import { COVERAGE, FOUND_BY, PAGE, PASSES } from './match-cascade';
import './work-demos.css';

// Split on whitespace but keep it, so line and paragraph breaks render as written
const PIECES = PAGE.split(/(\s+)/);

const stateAt = (word: number, pass: number) => {
    const found = FOUND_BY[word] ?? -1;
    return found === -1 || found > pass ? undefined : found === pass ? 'new' : 'found';
};

export const MatchDemo = () => {
    const [ pass, setPass ] = useState(0);
    let word = -1;

    return (
        <div className='work-demo'>
            <p className='work-demo-intro'>
                The model quotes the PDF in cleaned-up text, so an exact search misses most of it.
                Each pass searches again with smaller pieces.
            </p>

            <p className='match-demo-page'>
                {PIECES.map((piece, i) => {
                    // A space joins a run when the words on both sides were found, so matches read as phrases
                    if (/^\s+$/.test(piece)) {
                        const before = stateAt(word, pass);
                        const after = stateAt(word + 1, pass);
                        if (piece.includes('\n') || !before || !after) {
                            return piece;
                        }
                        return (
                            <span key={i} className='match-demo-word' data-found={before === after ? before : 'found'}>
                                {piece}
                            </span>
                        );
                    }
                    word++;
                    return <span key={i} className='match-demo-word' data-found={stateAt(word, pass)}>{piece}</span>;
                })}
            </p>

            <div className='work-demo-controls'>
                <div className='work-demo-options' role='group' aria-label='Search pass'>
                    {PASSES.map(({ label }, i) => (
                        <button
                            key={label}
                            type='button'
                            className='work-demo-option'
                            aria-pressed={pass === i}
                            onClick={() => setPass(i)}
                        >
                            {label}
                        </button>
                    ))}
                </div>
                <p className='work-demo-readout' aria-live='polite'>
                    <span className='work-demo-value'>{COVERAGE[pass]}%</span> found
                </p>
            </div>
        </div>
    );
};
