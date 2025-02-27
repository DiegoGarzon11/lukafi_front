import {BrowserRouter, useLocation} from 'react-router-dom';
import Header from './layout/Header';
import RoutesManager from './routes';
import '@/styles/App.css';
import {useEffect, useState} from 'react';

function App() {
	const [loaded, setLoaded] = useState(false);
	const [isSideOpen, setIsSideOpen] = useState(true);

	useEffect(() => {
		const time = setTimeout(() => {
			setLoaded(true);
		}, 1000);

		return () => clearTimeout(time);
	}, []);
	const handleSideValue = (value) => {
		setIsSideOpen(value);
	};
	const RouteName = () => {
		const location = useLocation();
		localStorage.setItem('route_name', location.pathname);
		return null;
	};

	return (
		<div className={`app${loaded ? 'loaded' : ''}`}>
			<BrowserRouter>
				<RouteName />
				<Header valueSide={handleSideValue} />

				<div className={`${isSideOpen && localStorage.token ? 'md:ml-64' : ' '}  transition-all duration-500 ease-in-out`}>
					<RoutesManager />
				</div>
			</BrowserRouter>
		</div>
	);
}

export default App;
