import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { Contributions } from './components/contributions/contributions';
import { Profile } from './sections/profile/profile';
import { Projects } from './sections/projects/projects';
import { Experience } from './sections/experience/experience';
import { Skills } from './sections/skills/skills';
import { About } from './sections/about/about';
import { Contact } from './sections/contact/contact';
import { SideBends } from './components/side-bends/side-bends';
import './App.css';

function App() {
	return (
		<div className='page'>
			<SideBends />
			<Header />
			<main className='column'>
				<Profile />
				<Contributions />
				<Projects />
				<Experience />
				<Skills />
				<About />
				<Contact />
			</main>
			<Footer />
		</div>
	)
}

export default App;
