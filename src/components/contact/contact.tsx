import { FiGithub } from 'react-icons/fi';
import { TiSocialLinkedin } from 'react-icons/ti';
import { MdMailOutline } from 'react-icons/md';
import { EMAIL, GITHUB_URL, LINKEDIN_URL } from '../../data/links';
import './contact.css';

const LINKS = [
    { href: GITHUB_URL, label: 'Github', Icon: FiGithub },
    { href: `mailto:${EMAIL}`, label: 'Email', Icon: MdMailOutline },
    { href: LINKEDIN_URL, label: 'LinkedIn', Icon: TiSocialLinkedin }
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
                        rel='noopener noreferrer'
                    >
                        <Icon aria-hidden='true' />
                    </a>
                ))}
            </div>
        </div>
    )
}