import { BrowserRouter, useLocation } from 'react-router-dom';
import Header from './layout/Header';
import RoutesManager from './routes';
import '@/styles/App.css';
import { useEffect, useState } from 'react';

function App() {
	const [loaded, setLoaded] = useState(false);
	const [isSideOpen, setIsSideOpen] = useState(true);
	const [url, setUrl] = useState(null);
	useEffect(() => {
		const time = setTimeout(() => {
			setLoaded(true);
		}, 1000);

		return () => clearTimeout(time);
	}, []);
	const handleSideValue = (value) => {
		setIsSideOpen(value);
	};

	const Layout = ({ children }) => {
		const location = useLocation();
		setUrl(location.pathname);
		useEffect(() => {}, [location.pathname]);

		return <>{children}</>;
	};

	return (
		<div className={`app${loaded ? 'loaded' : ''}`}>
			<BrowserRouter>
				<Layout>
					<Header
						valueSide={handleSideValue}
						valueUrl={url}
					/>

					<div className={`${isSideOpen && localStorage.token ? 'md:ml-64' : ' '}  transition-all duration-500 ease-in-out`}>
						<RoutesManager />
					</div>
				</Layout>
			</BrowserRouter>
		</div>
	);
}

export default App;
