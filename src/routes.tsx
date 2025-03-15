import { Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { PageNotFound } from './pages/Page404';
import { WalletComponent } from './pages/Wallet';
import Profile from './pages/Profile';
import { ForgetPassword } from './pages/auth/RestorePassword';
import { SeeExpenses } from './components/core/Expenses/SeeExpenses';
import { SeeDebts } from './components/core/Debts/SeeDebts';
import { SeeIncomes } from './components/core/Income/SeeIncomes';
import DeleteAccount from './pages/auth/DeleteAccount';
import RestoreAccountPage from './pages/auth/RestoreAccount';

const isAuthenticated = localStorage.token;

const RoutesManager = () => (
	<Routes>
		<Route
			path='/'
			element={isAuthenticated ? <Navigate to='/dashboard' /> : <Home />}
		/>
		<Route
			path='auth'
			element={isAuthenticated ? <Navigate to='/dashboard' /> : <Home />}
		/>
		<Route
			path='dashboard'
			element={isAuthenticated ? <Dashboard /> : <Navigate to='/' />}
		/>
		<Route
			path='/wallet'
			element={isAuthenticated ? <WalletComponent /> : <Navigate to='/' />}
		/>
		<Route
			path='/wallet/expenses'
			element={isAuthenticated ? <SeeExpenses /> : <Navigate to='/' />}
		/>
		<Route
			path='/wallet/debts'
			element={isAuthenticated ? <SeeDebts /> : <Navigate to='/' />}
		/>
		<Route
			path='/wallet/incomes'
			element={isAuthenticated ? <SeeIncomes /> : <Navigate to='/' />}
		/>
		<Route
			path='/profile'
			element={isAuthenticated ? <Profile /> : <Navigate to='/' />}
		/>
		<Route
			path='/auth/delete-account'
			element={isAuthenticated ? <DeleteAccount /> : <Navigate to='/' />}
		/>
		<Route
			path='/restore-account'
			element={isAuthenticated ? <RestoreAccountPage /> : <Navigate to='/' />}
		/>
		<Route
			path='/auth/restore-password'
			element={isAuthenticated ? <Dashboard /> : <ForgetPassword />}
		/>
		<Route
			path='/auth/change-password'
			element={isAuthenticated ? <ForgetPassword /> : <Navigate to='/' />}
		/>
		<Route
			path='*'
			element={<PageNotFound />}
		/>
	</Routes>
);

export default RoutesManager;
