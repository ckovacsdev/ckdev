import './deco-pattern.css';

export const DecoPattern = () => {
    return(
        <div 
            className='deco-pattern' 
            id='deco' 
            aria-hidden='true'
        >
            <i className='wide'></i>
            <i className='narrow'></i>
            <i className='stem-a'></i>
            <i className='stem-b'></i>
        </div>
    )
}