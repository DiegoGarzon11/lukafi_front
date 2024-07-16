import { Routes, Route, Navigate } from 'react-router-dom';
import SignUp from './auth/SignUp';
import SignIn from './auth/SignIn';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { PageNotFound } from './pages/Page404';

const isAuthenticated = localStorage.token;
const RoutesManager = () => (
	<Routes>
		<Route
			path='/'
			element={isAuthenticated ? <Navigate to='/dashboard' /> : <Home />}
		/>
		<Route
			path='signUp'
			element={isAuthenticated ? <Navigate to='/dashboard' /> : <SignUp />}
		/>
		<Route
			path='signIn'
			element={isAuthenticated ? <Navigate to='/dashboard' /> : <SignIn />}
		/>
		<Route
			path='dashboard'
			element={isAuthenticated ? <Dashboard /> : <Navigate to='/signIn' />}
		/>
		
		<Route
			path='*'
			element={<PageNotFound />}
		/>
	</Routes>
);

export default RoutesManager;
