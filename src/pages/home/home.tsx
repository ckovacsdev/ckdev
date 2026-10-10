import { Contact } from '../../components/contact/contact';
import { DecoButton } from '../../components/deco-button/deco-button';
import { DecoRule } from '../../components/deco-rule/deco-rule';
import { RESUME_PATH } from '../../data/links';
import { usePointerVars } from '../../hooks/usePointerVars';
import { useScrollValue } from '../../hooks/useScrollValue';
import '../../styles/bg-pattern.css';
import './home.css';

const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

export const Home = () => {
    const cueRef = useScrollValue<HTMLButtonElement>(
        '--cue-fade',
        (y) => `${Math.max(1 - y / (window.innerHeight * 0.45), 0)}`,
        (el, y) => {
            el.style.pointerEvents = y >= window.innerHeight * 0.45 ? 'none' : '';
        },
    );
    const patternRef = useScrollValue<HTMLDivElement>(
        '--pattern-fade',
        (y) => `${Math.max(1 - y / (window.innerHeight * 0.85), 0)}`,
    );
    usePointerVars(patternRef);
    const contactRef = useScrollValue<HTMLDivElement>(
        '--cue-fade',
        (y) => `${Math.max(1 - y / (window.innerHeight * 0.45), 0)}`,
        (el, y) => {
            el.style.pointerEvents = y >= window.innerHeight * 0.45 ? 'none' : '';
        },
    );

    return (
        <div className='home-container bg-pattern pattern-spotlight' ref={patternRef}>
            <div className='home-content'>
                <div className='home-text'>
                    <h1 className='home-title'> Christian Kovacs</h1>
                    <h2 className='home-subtitle'> Software Engineer based in <span className='home-no-break'> Hoboken, NJ </span> </h2>
                    <div className='home-separator'>  
                        <DecoRule />
                    </div>
                    <p className='home-details'> 
                        Four years building feature-dense web applications in financial services.
                        Primarily focused on developer tools and automation, I turn complex systems into usable platforms.
                    </p>
                    <div className='home-buttons'>
                        <DecoButton type='primary' title='View My Work' onClick={() => scrollToSection('work')} />
                        <DecoButton type='secondary' title='View Resume' href={RESUME_PATH} />
                    </div>
                </div>

                <button 
                    type='button'
                    className='home-scroll'
                    ref={cueRef}
                    onClick={() => scrollToSection('work')}
                >
                    <span className='home-scroll-chevron' aria-hidden='true'></span>
                    <span className='home-scroll-label'>Scroll For More</span>
                </button>
                
                <div className='home-contact-fade' ref={contactRef}>
                    <Contact />
                </div>
            </div>
        </div>
    )
}