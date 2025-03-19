import { BrowserRouter, useLocation } from 'react-router-dom';
import Header from './layout/Header';
import RoutesManager from './routes';
import { useEffect, useState } from 'react';

function App() {
	const [isSideOpen, setIsSideOpen] = useState(true);
	const [allowSidebar, setAllowSidebar] = useState(true);
	const handleSideValue = (value) => {
		setIsSideOpen(value);
	};
	const RouteName = () => {
		const location = useLocation();
		localStorage.setItem('route_name', location.pathname ?? localStorage.route_name);
		return null;
	};
	const linksNotSidebar = ['/profile/delete-account', '/restore-account'];
	const userDeleted = localStorage.getItem('userMain') ? JSON.parse(localStorage.getItem('userMain'))?.deleted_in : null;
	const currentRoute = localStorage.route_name;
	useEffect(() => {
		if (linksNotSidebar.includes(currentRoute) || userDeleted != null) {
			setAllowSidebar(false);
		} else {
			setAllowSidebar(true);
		}
	}, [currentRoute]);
	return (
		<BrowserRouter>
			<RouteName />
			<Header valueSide={handleSideValue} />

			<div className={`${isSideOpen && allowSidebar && localStorage.token ? 'md:ml-64' : ' '}  transition-all duration-500 ease-in-out`}>
				<RoutesManager />
			</div>
		</BrowserRouter>
	);
}

export default App;
