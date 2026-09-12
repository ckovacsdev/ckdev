import { MdMailOutline } from 'react-icons/md';
import { DecoButton } from '../../components/deco-button/deco-button';
import { DecoRule } from '../../components/deco-rule/deco-rule';
import { FiGithub } from 'react-icons/fi';
import { TiSocialLinkedin } from 'react-icons/ti';
import './home.css';
import { useScrollValue } from '../../hooks/useScrollValue';

const LINKS = [
    { href: 'https://github.com/ckovacsdev', label: 'Github', Icon: FiGithub },
    { href: 'mailto:ckovacsdev@gmail.com', label: 'Email', Icon: MdMailOutline },
    { href: 'https://www.linkedin.com/in/ckovacsdev/', label: 'LinkedIn', Icon: TiSocialLinkedin }
]

const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};


export const Home = () => {
    const cueRef = useScrollValue<HTMLButtonElement>(
        '--cue-fade',
        (y) => `${Math.max(1 - y / (window.innerHeight * 0.35), 0)}`,
        (el, y) => {
            el.style.pointerEvents = y >= window.innerHeight * 0.35 ? 'none' : '';
        },
    );


    return (
        <div className='home-container'>
            <div className='home-content'>
                <div className='home-text'>
                    <h1 className='home-title'> Christian Kovacs</h1>
                    <h2 className='home-subtitle'> Frontend Software Engineer based in <span className='home-no-break'> Hoboken, NJ </span> </h2>
                    <div className='home-separator'>  
                        <DecoRule />
                    </div>
                    <p className='home-details'> 
                        Four years building feature-dense front ends in the financial services industry.
                        Primarily focusing on internal developer tools, I take pride in building user experiences that make engineering seamless.
                    </p>
                    <div className='home-buttons'>
                        <DecoButton type='primary' title='View My Projects' onClick={() => console.log('projects')} />
                        <DecoButton type='secondary' title='Download Resume' href='/Christian_Kovacs_Resume.pdf' />
                    </div>
                </div>

                <div className='home-contact-container'>
                    <div className='home-contact'>
                        {LINKS.map(({ href, label, Icon }) => (
                            <a
                                key={label}
                                href={href}
                                className='home-contact-link'
                                aria-label={label}
                                target={href.startsWith('mailto:') ? undefined : '_blank'}
                                rel='noreffer'
                            >
                                <Icon aria-hidden='true' />
                            </a>
                        ))}
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
            </div>
        </div>
    )
}