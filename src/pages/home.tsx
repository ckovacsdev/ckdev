import { DecoPattern } from "../components/deco-pattern/deco-pattern"
import { DecoRule } from "../components/deco-rule/deco-rule";
import './home.css';

export const Home = () => {
    return (
        <div className='home-container'>
            <div className='home-content'>
                <h1> Christian Kovacs </h1>
                <div className='home-separator'>  
                    <DecoRule />
                </div>
                <h2> Test Subtitle </h2>
            </div>
            <div className='deco-pattern'>
                <DecoPattern />
            </div>
        </div>
    )
}