import { MdMailOutline } from 'react-icons/md';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { DecoButton } from '../../components/deco-button/deco-button';
import { DecoPattern } from '../../components/deco-pattern/deco-pattern'
import { DecoRule } from '../../components/deco-rule/deco-rule';
import './home.css';

const LINKS = [
    { href: 'https://github.com/ckovacsdev', label: 'Github', Icon: FaGithub, color: '#000000'},
    { href: 'mailto:ckovacsdev@gmail.com', label: 'Email', Icon: MdMailOutline, color: '#ffffff'},
    { href: 'https://www.linkedin.com/in/ckovacsdev/', label: 'LinkedIn', Icon: FaLinkedin, color: '#0077B5'}
]

export const Home = () => {
    return (
        <div className='home-container'>
            <div className='home-content'>
                <div className='home-text'>
                    <h1 className='home-title'> Christian Kovacs </h1>
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
                        <DecoButton type='secondary' title='Download Resume' onClick={() => console.log('resume')} />
                    </div>
                </div>

                <div className='home-contact-container'>
                    <div className='home-contact'>
                        {LINKS.map(({ href, label, Icon, color }) => (
                            <a
                                key={label}
                                href={href}
                                className='home-contact-link'
                                aria-label={label}
                                target={href.startsWith('mailto:') ? undefined : '_blank'}
                                rel='noreffer'
                            >
                                <Icon aria-hidden='true' color={color} />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
            <div className='deco-pattern'>
                <DecoPattern />
            </div>
        </div>
    )
}