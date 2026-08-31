import { Home } from './pages/home/home'
import { Navigation } from './components/navigation/navi'
import { Work } from './pages/work/work'
import './App.css'

function App() {
	return (
		<div className='app-container'>
			<Navigation />
			<Home />
			<Work />
		</div>
	)
}

export default App
