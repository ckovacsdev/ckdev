import type { IconType } from 'react-icons';
import { FiArrowUpRight, FiCopy } from 'react-icons/fi';
import { TbBrandGithub, TbBrandLinkedin, TbFileText, TbMail } from 'react-icons/tb';
import { Section } from '../../components/section/section';
import { GITHUB_URL, LINKEDIN_URL, RESUME_PATH } from '../../data/links';
import { useCopyEmail } from '../../hooks/useCopyEmail';
import './contact.css';

// The email address never appears on the page; its tile copies it to the clipboard instead
type Route = { name: string; detail: string; icon: IconType } & ({ href: string } | { copiesEmail: true });

const ROUTES: Route[] = [
    { name: 'Email', detail: 'Click to copy', icon: TbMail, copiesEmail: true },
    { name: 'LinkedIn', detail: 'in/ckovacsdev', icon: TbBrandLinkedin, href: LINKEDIN_URL },
    { name: 'GitHub', detail: 'ckovacsdev', icon: TbBrandGithub, href: GITHUB_URL },
    { name: 'Resume', detail: 'View PDF', icon: TbFileText, href: RESUME_PATH },
];

export const Contact = () => {
    const { copyEmail, toast } = useCopyEmail();

    return (
        <Section id='contact' title="Let's Connect">
            <ul className='contact-grid'>
                {ROUTES.map((route) => {
                    const { name, detail, icon: Icon } = route;
                    const content = (
                        <>
                            <span className='contact-icon' aria-hidden='true'><Icon /></span>
                            <span className='contact-text'>
                                <span className='contact-name'>{name}</span>
                                <span className='contact-detail'>{detail}</span>
                            </span>
                        </>
                    );
                    return (
                        <li key={name}>
                            {'copiesEmail' in route ? (
                                <button type='button' className='contact-tile' onClick={copyEmail}>
                                    {content}
                                    <FiCopy className='contact-arrow contact-arrow--still'aria-hidden='true' />
                                </button>
                            ) : (
                                <a className='contact-tile' href={route.href} target='_blank' rel='noopener noreferrer'>
                                    {content}
                                    <FiArrowUpRight className='contact-arrow' aria-hidden='true' />
                                </a>
                            )}
                        </li>
                    );
                })}
            </ul>
            {toast}
        </Section>
    );
};
