import { FiGithub } from 'react-icons/fi';
import { TiSocialLinkedin } from 'react-icons/ti';
import { MdMailOutline } from 'react-icons/md';
import { GITHUB_URL, LINKEDIN_URL } from '../../data/links';
import { useCopyEmail } from '../../hooks/useCopyEmail';
import './contact.css';

// Email copies the address to the clipboard rather than linking to it, so it never appears on the page
const LINKS = [
    { href: GITHUB_URL, label: 'Github', Icon: FiGithub },
    { label: 'Copy email address', Icon: MdMailOutline },
    { href: LINKEDIN_URL, label: 'LinkedIn', Icon: TiSocialLinkedin }
]
export const Contact = () => {
    const { copyEmail, toast } = useCopyEmail();

    return (
        <div className='home-contact-container'>
            <div className='home-contact'>
                {LINKS.map(({ href, label, Icon }) => href ? (
                    <a
                        key={label}
                        href={href}
                        className='home-contact-link'
                        aria-label={label}
                        target='_blank'
                        rel='noopener noreferrer'
                    >
                        <Icon aria-hidden='true' />
                    </a>
                ) : (
                    <button
                        key={label}
                        type='button'
                        className='home-contact-link'
                        aria-label={label}
                        onClick={copyEmail}
                    >
                        <Icon aria-hidden='true' />
                    </button>
                ))}
            </div>
            {toast}
        </div>
    )
}
