import { Home } from './pages/home/home';
import { Navigation } from './components/navigation/navi';
import { Work } from './pages/work/work';
import { Skills } from './pages/skills/skills';
import { Connect } from './pages/connect/connect';
import { DecoPattern } from './components/deco-pattern/deco-pattern';
import { Footer } from './components/footer/footer';
import './App.css';

function App() {
	return (
		<div className='app-container'>
			<div className='app-main'>
				<Navigation />
				<section id='home'>
					<Home /> 
				</section>
				<section id='work'> 
					<Work /> 
				</section>
				<section id='skills'>
					<Skills />
				</section>
				<section id='contact'>
					<Connect />
				</section>
			</div>
			<div className='deco-rail'>
				<DecoPattern />
			</div>
			
			<div id='footer'>
				<Footer />
			</div>
		</div>					
	)
}

export default App;
