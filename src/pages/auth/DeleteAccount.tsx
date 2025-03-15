import {Input} from '@/components/ui/input';
import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {DeleteUser} from '@/apis/UserService';
import {Toast} from '@/tools/Toast';

const DeleteAccount = () => {
	const {t, i18n} = useTranslation();
	i18n.changeLanguage();

	const user = JSON.parse(localStorage.userMain);

	const [password, setPassword] = useState('');
	const [visibilityToast, setVisibilityToast] = useState(false);
	const [response, setResponse] = useState(null);
	const handlePassword = (e) => {
		e.preventDefault();
		setPassword(e.target.value);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setVisibilityToast(false);
		const data = {
			email: user.email,
			password,
		};
		try {
			const response = await DeleteUser(data);
			if (response) {
				setVisibilityToast(true);
				setResponse(response);
				if (response.status === 204) {
					localStorage.removeItem('token');
					localStorage.removeItem('userMain');
					localStorage.removeItem('route_name');
					setTimeout(() => {
						return (window.location.href = '/');
					}, 2000);
				}
			}
		} catch (error) {
			console.log(error);
		} finally {
			setVisibilityToast(true);
		}
	};

	return (
		<section className='flex flex-col items-center justify-center h-screen pt-20 p-5 gap-5 dark:bg-dark_primary_color bg-white font-thin -ml-64'>
			<div className='p-5 w-11/12 md:w-[500px] rounded-md'>
				<div className='flex justify-center flex-col items-center gap-5 mt-3'>
					<img
						src='/images/dontgo.webp'
						alt='Forgot password'
						className='w-56 h-56 object-cover rounded-full dark:bg-zinc-700/20 bg-zinc-1'
					/>
					<p className='font-bold text-xl text-black dark:text-white'>{t('delete.account.confirmPassword')}</p>
					<p className='font-semibold text-md text-black dark:text-white opacity-30  text-center'>
						Una vez confirma la contraseña tu cuenta se eliminará en 20 dias
					</p>
					<form className='flex flex-col gap-3 w-full'>
						<Input
							onChange={handlePassword}
							value={password}
							type='password'
							placeholder='Password'
							className=' dark:bg-dark_secondary_color border-none text-lg dark:text-white text-black placeholder:text-gray-300 w-full'
						/>
						<button
							onClick={handleSubmit}
							disabled={password === ''}
							className='w-full rounded-md p-2 bg-alternative_color text-white font-semibold flex justify-center'>
							{t('delete.account.confirm')}
						</button>
					</form>
				</div>
			</div>
			{visibilityToast && (
				<Toast visibility={visibilityToast} severity={response.success == true ? 'success' : 'error'} message={response.message} />
			)}
		</section>
	);
};

export default DeleteAccount;
