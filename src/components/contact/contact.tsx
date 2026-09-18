import { FiGithub } from 'react-icons/fi';
import { TiSocialLinkedin } from 'react-icons/ti';
import { MdMailOutline } from 'react-icons/md';
import './contact.css';

const LINKS = [
    { href: 'https://github.com/ckovacsdev', label: 'Github', Icon: FiGithub },
    { href: 'mailto:ckovacsdev@gmail.com', label: 'Email', Icon: MdMailOutline },
    { href: 'https://www.linkedin.com/in/ckovacsdev/', label: 'LinkedIn', Icon: TiSocialLinkedin }
]
export const Contact = () => {
    return (
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
    )
}