import { DecoButton } from '../../components/deco-button/deco-button';
import { DecoRule } from '../../components/deco-rule/deco-rule';
import { EMAIL, LINKEDIN_URL } from '../../data/links';
import './connect.css';

export const Connect = () => {
    return (
        <div className='connect-container'>
            <h2 className='connect-title'> Let's Connect </h2>
            <div className='connect-separator'>
                <DecoRule />
            </div>
            <div className='connect-buttons'>
                <DecoButton type='primary' title='Email Me' href={`mailto:${EMAIL}`} />
                <DecoButton type='secondary' title='LinkedIn' href={LINKEDIN_URL} />
            </div>
        </div>
    )
}
