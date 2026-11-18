import type { ReactNode } from 'react';
import type { IconType } from 'react-icons';
import {
    TbBrandGithub,
    TbBrandLinkedin,
    TbBriefcase,
    TbCopy,
    TbFileText,
    TbSchool,
} from 'react-icons/tb';
import { GITHUB_URL, LINKEDIN_URL, RESUME_PATH } from '../../data/links';
import { CircuitCover } from '../../components/circuit-cover/circuit-cover';
import { useCopyEmail } from '../../hooks/useCopyEmail';
import './profile.css';

const Fact = ({ icon: Icon, children }: { icon: IconType; children: ReactNode }) => (
    <li className='profile-fact'>
        <span className='profile-fact-icon' aria-hidden='true'><Icon /></span>
        <span className='profile-fact-text'>{children}</span>
    </li>
);

export const Profile = () => {
    const { copyEmail, toast } = useCopyEmail();

    return (
        <section id='top' className='profile' aria-labelledby='profile-name'>
            <div className='profile-cover'>
                <CircuitCover />
            </div>

            <div className='profile-body'>
                <div className='profile-avatar' aria-hidden='true'>CK</div>
                <h1 id='profile-name' className='profile-name'>Christian Kovacs</h1>
                <p className='profile-role'>Software Engineer based in Hoboken, NJ</p>
                <p className='profile-bio'>
                    Four years building feature-dense web applications in financial services.
                    Primarily focused on developer tools and automation, I turn complex systems into usable platforms.
                </p>
            </div>

            <ul className='profile-facts'>
                <Fact icon={TbBriefcase}>
                    Software Engineer
                    <span className='profile-fact-muted profile-fact-sub'>@ TCW Group | Platform Engineering</span>
                </Fact>
                <Fact icon={TbSchool}>
                    BA, Computer Science
                    <span className='profile-fact-muted profile-fact-sub'>@ New York University</span>
                </Fact>                
                <Fact icon={TbBrandGithub}>
                    <a className='profile-fact-link' href={GITHUB_URL} target='_blank' rel='noopener noreferrer'>
                        ckovacsdev
                    </a>
                </Fact>
                <Fact icon={TbBrandLinkedin}>
                    <a className='profile-fact-link' href={LINKEDIN_URL} target='_blank' rel='noopener noreferrer'>
                        in/ckovacsdev
                    </a>
                </Fact>
                <Fact icon={TbCopy}>
                    <button type='button' className='profile-fact-link' onClick={copyEmail}>
                        Email
                    </button>
                </Fact>
                <Fact icon={TbFileText}>
                    <a className='profile-fact-link' href={RESUME_PATH} target='_blank' rel='noopener noreferrer'>
                        Resume <span className='profile-fact-muted'>(PDF)</span>
                    </a>
                </Fact>
            </ul>
            {toast}
        </section>
    );
};
