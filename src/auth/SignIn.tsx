import { UserDefault, UserSignIn } from '@/apis/UserService';
import { EyeClose, EyeOpen } from '@/assets/icons/Svg';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Toast } from '@/tools/Toast';
import { Loader } from '@/assets/icons/Svg';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ApiResponse } from '@/interfaces/Wallet';

export default function SignIn() {
	const { t, i18n } = useTranslation();
	i18n.changeLanguage();

	const [loader, setLoader] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const [statusCode, setStatusCode] = useState<ApiResponse | undefined>(null);

	const [visibilytToast, setVisibilityToast] = useState(false);

	const [data, setData] = useState({
		password: '',
		email: '',
	});

	function handleChange(e) {
		const { name, value } = e.target;
		setData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	}

	function handleClick() {
		setIsOpen((prevIcon) => !prevIcon);
	}

	async function handleSubmit(event) {
		event.preventDefault();
		setLoader(true);
		setVisibilityToast(false);
		try {
			const dataUserSignIn = await UserSignIn(data);
			setStatusCode(dataUserSignIn);
			setVisibilityToast(true);

			console.log(statusCode);

			if (dataUserSignIn.token) {
				localStorage.setItem('token', dataUserSignIn?.token);
				const userDefault = await UserDefault();
				localStorage.setItem('userMain', JSON.stringify(userDefault?.userInfo));
				return (window.location.href = '/dashboard');
			}
			console.warn('user not found');
		} catch (error) {
			console.error(error);
		} finally {
			setLoader(false);
			setVisibilityToast(true);
		}
	}

	const icon = isOpen ? <EyeOpen className='text-slate-700' /> : <EyeClose className='text-slate-700' />;

	return (
		<>
			{visibilytToast ? (
				<Toast
					visibility={visibilytToast}
					message={statusCode?.status === 401 ? 'Credenciales invalidas' : 'Incio de sesion correcto'}
					severity={statusCode?.status === 401 ? 'error' : 'success'}
				/>
			) : (
				''
			)}

			<form
				className='mt-10 grid gap-8 p-8 shadow-sm shadow-slate-300 dark:shadow-slate-800/60   rounded-2xl  '
				onSubmit={handleSubmit}>
				<h1 className='text-3xl mb-6'>{t('form.field.signIn')}</h1>
				<div>
					<label
						htmlFor=''
						className='text-lg'>
						{t('form.field.email')}
					</label>
					<Input
						className='bg-white  text-black'
						autoComplete='email'
						type='text'
						placeholder={t('form.field.email')}
						onChange={handleChange}
						value={data.email}
						name='email'
						required
					/>
				</div>
				<div className='relative'>
					<label
						htmlFor=''
						className='text-lg'>
						{t('form.field.password')}
					</label>
					<Input
						className='bg-white text-black'
						autoComplete='current-password'
						type={isOpen ? 'text' : 'password'}
						placeholder={t('form.field.password')}
						onChange={handleChange}
						value={data.password}
						name='password'
						required
					/>
					<div
						className='absolute right-2 top-7'
						onClick={handleClick}>
						{icon}
					</div>
				</div>
				<div className='flex justify-center w-full items-center '>
					<Button
						disabled={!data.email || !data.password}
						className='w-full disabled:bg-slate-200    font-semibold bg-slate-700 text-white text-lg flex justify-center items-center'
						type='submit'>
						{loader || statusCode?.status === 200 ? <Loader /> : t('form.field.signIn')}
					</Button>
				</div>

				<Link
					to=''
					className='text-lg'>
					{t('form.password.forgotten')}
				</Link>
			</form>
		</>
	);
}
