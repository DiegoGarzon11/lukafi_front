import {Routes, Route, Navigate} from 'react-router-dom';
import {Home} from './pages/Home';
import {Dashboard} from './pages/Dashboard';
import {PageNotFound} from './pages/Page404';
import Auth from './auth/Auth';
import {WalletComponent} from './pages/Wallet';
import Profile from './pages/Profile';
import {ForgetPassword} from './pages/RestorePassword';
import {SeeExpenses} from './components/core/Expenses/SeeExpenses';
import {SeeDebts} from './components/core/Debts/SeeDebts';
import {SeeIncomes} from './components/core/Income/SeeIncomes';
import DeleteAccount from './pages/DeleteAccount';
import RestoreAccountPage from './pages/RestoreAccount';

const isAuthenticated = localStorage.token;

const RoutesManager = () => (
	<Routes>
		<Route path='/' element={isAuthenticated ? <Navigate to='/dashboard' /> : <Home />} />
		<Route path='auth' element={isAuthenticated ? <Navigate to='/dashboard' /> : <Auth />} />
		<Route path='dashboard' element={isAuthenticated ? <Dashboard /> : <Navigate to='/auth' />} />
		<Route path='/wallet' element={isAuthenticated ? <WalletComponent /> : <Navigate to='/auth' />} />
		<Route path='/wallet/expenses' element={isAuthenticated ? <SeeExpenses /> : <Navigate to='/auth' />} />
		<Route path='/wallet/debts' element={isAuthenticated ? <SeeDebts /> : <Navigate to='/auth' />} />
		<Route path='/wallet/incomes' element={isAuthenticated ? <SeeIncomes /> : <Navigate to='/auth' />} />
		<Route path='/profile' element={isAuthenticated ? <Profile /> : <Navigate to='/auth' />} />
		<Route path='/profile/delete-account' element={isAuthenticated ? <DeleteAccount /> : <Navigate to='/auth' />} />
		<Route path='/restore-account' element={isAuthenticated ? <RestoreAccountPage /> : <Navigate to='/auth' />} />
		<Route path='/auth/restore-password' element={isAuthenticated ? <Dashboard /> : <ForgetPassword />} />
		<Route path='*' element={<PageNotFound />} />
	</Routes>
);

export default RoutesManager;
