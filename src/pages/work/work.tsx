import WorkCard from '../../components/work-card/work-card';
import './work.css';

export const Work = () => {
    return (
        <div className='work-container'>
            <div className='work-titles'>
                <h2 className='work-title'>  Professional Experience </h2>
            </div>

            <div className='work-projects'>
                <WorkCard tech='test' title='test' blurb='test'/>
                <WorkCard tech='test' title='test' blurb='test'/>

            </div>
        </div>
    )
}