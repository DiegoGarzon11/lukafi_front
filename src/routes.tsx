import { Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { PageNotFound } from './pages/Page404';
import Auth from './auth/Auth';
import { WalletComponent } from './pages/WalletConfig';
const isAuthenticated = localStorage.token;
const RoutesManager = () => (
	<Routes>
		<Route
			path='/'
			element={isAuthenticated ? <Navigate to='/dashboard' /> : <Home />}
		/>
		<Route
			path='auth'
			element={isAuthenticated ? <Navigate to='/dashboard' /> : <Auth />}
		/>
		<Route
			path='dashboard'
			element={isAuthenticated ? <Dashboard /> : <Navigate to='/auth' />}
		/>
		<Route
			path='/wallet'
			element={isAuthenticated ? <WalletComponent /> : <Navigate to='/auth' />}
		/>
		<Route
			path='*'
			element={<PageNotFound />}
		/>
	</Routes>
);

export default RoutesManager;
