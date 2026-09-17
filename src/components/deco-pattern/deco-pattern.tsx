import { useParallax } from '../../hooks/useParallax';
import './deco-pattern.css';

export const DecoPattern = () => {

    const ref = useParallax({
        rate: 0.2,
        property: '--scroll',
        wrap: '--title'
    });

    return(
        <div 
            className='deco-pattern' 
            ref={ref}
            aria-hidden='true'
        >
            <i className='wide'></i>
            <i className='narrow'></i>
            <i className='stem-a'></i>
            <i className='stem-b'></i>
        </div>
    )
}