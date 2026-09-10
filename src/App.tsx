import { Home } from './pages/home/home'
import { Navigation } from './components/navigation/navi'
import { Work } from './pages/work/work'
import { DecoPattern } from './components/deco-pattern/deco-pattern'
import './App.css'

function App() {
	return (
		<div className='app-container'>
			<div className='app-main'>
				<Navigation />
				<section id='home'> <Home /> </section>
				<section id='work'> <Work /> </section>
			</div>
			<div className='deco-rail'>
				<DecoPattern />
			</div>
		</div>
	)
}

export default App
