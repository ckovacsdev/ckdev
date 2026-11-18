import { REPO_URL } from '../../data/links';
import './footer.css';

const BUILD_YEAR = 2026;
const LAST_UPDATED = 'November 2026';

export const Footer = () => {
    return (
        <footer className='footer'>
            <div className='footer-inner'>
                <div className='footer-group'>
                    <span>&copy; Christian Kovacs {BUILD_YEAR}</span>
                    <span>Last Updated: {LAST_UPDATED}</span>
                </div>
                <div className='footer-group footer-group--end'>
                    <a className='footer-link' href={REPO_URL} target='_blank' rel='noreferrer'>
                        Project Repository
                    </a>
                    <span>Built with React and TypeScript</span>
                </div>
            </div>
        </footer>
    );
};
