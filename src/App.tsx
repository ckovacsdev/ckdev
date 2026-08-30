import { Home } from './pages/home'
import { Navigation } from './components/navigation/navi'
import './App.css'

function App() {
	return (
		<div className='app-container'>
			<Navigation />
			<Home />
		</div>
	)
}

export default App
