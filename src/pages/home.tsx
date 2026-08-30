import { DecoPattern } from "../components/deco-pattern/deco-pattern"
import { DecoRule } from "../components/deco-rule/deco-rule";
import './home.css';

export const Home = () => {
    return (
        <div className='home-container'>
            <div className='home-content'>
                <div className='home-text'>
                    <h1 className='home-title'> Christian Kovacs </h1>
                    <h2 className='home-subtitle'> Frontend Software Engineer based in Hoboken, NJ </h2>
                    <div className='home-separator'>  
                        <DecoRule />
                    </div>
                    <p className='home-details'> 
                        Testing more details etc.   
                    </p>
                </div>
            </div>
            <div className='deco-pattern'>
                <DecoPattern />
            </div>
        </div>
    )
}