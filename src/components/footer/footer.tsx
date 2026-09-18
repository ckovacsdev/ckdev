import './footer.css';

const BUILD_YEAR = 2026;
const LAST_UPDATED = 'Sept 2026';
const REPO_URL = 'https://github.com/ckovacsdev/ckdev';

export const Footer = () => {
    return (
        <footer className='footer-container'>
            <div className='footer-group'>
                <span className='footer-item'>&copy; Christian Kovacs {BUILD_YEAR}</span>
                <span className='footer-item'>Last Updated: {LAST_UPDATED}</span>
            </div>

            <div className='footer-group right'>
                <a
                    className='footer-item footer-link'
                    href={REPO_URL}
                    target='_blank'
                    rel='noreferrer'
                >
                    Project Repository
                </a>
                <span className='footer-item'>Built with React and TypeScript</span>
            </div>
        </footer>
    );
};