import { BrowserRouter, useLocation } from 'react-router-dom';
import Header from './layout/Header';
import RoutesManager from './routes';
import { useState } from 'react';

function App() {
	const [isSideOpen, setIsSideOpen] = useState(true);

	const handleSideValue = (value) => {
		setIsSideOpen(value);
	};
	const RouteName = () => {
		const location = useLocation();
		localStorage.setItem('route_name', location.pathname ?? localStorage.route_name);
		return null;
	};

	return (
		<BrowserRouter>
			<RouteName />
			<Header valueSide={handleSideValue} />

			<div className={`${isSideOpen && localStorage.token ? 'md:ml-64' : ' '}  transition-all duration-200 ease-in-out`}>
				<RoutesManager />
			</div>
		</BrowserRouter>
	);
}

export default App;
