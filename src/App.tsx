import {BrowserRouter} from 'react-router-dom';
import Header from './layout/Header';
import RoutesManager from './routes';
import '@/styles/App.css';
import {useEffect, useState} from 'react';

function App() {
	const [loaded, setLoaded] = useState(false);
	useEffect(() => {
		const time = setTimeout(() => {
			setLoaded(true);
		}, 1000);

		return () => clearTimeout(time);
	}, []);
	return (
		<div className={`app${loaded ? 'loaded' : ''}`}>
			<BrowserRouter>
				<Header />
				<RoutesManager />
			</BrowserRouter>
		</div>
	);
}

export default App;
