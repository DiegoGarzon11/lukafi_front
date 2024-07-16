import {UserDefault, UserSignIn} from '@/apis/UserService';
import {EyeClose, EyeOpen} from '@/assets/icons/Svg';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Toast} from '@/tools/Toast';
import {Loader} from '@/assets/icons/Svg';
import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Link} from 'react-router-dom';
import {ResponseSignIn} from '@/interfaces/Wallet';
import {ArrowBack} from '@/assets/icons/Svg';

export default function SignIn() {
	const {t, i18n} = useTranslation();
	i18n.changeLanguage();

	const [loader, setLoader] = useState(false);
	const [toast, showToast] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const [statusCode, setStatusCode] = useState<ResponseSignIn | undefined>(null);
	const [data, setData] = useState({
		password: '',
		email: '',
	});

	function handleChange(e) {
		const {name, value} = e.target;
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
		showToast(false);
		try {
			const dataUserSignIn = await UserSignIn(data);
			setStatusCode(dataUserSignIn);
			console.log(statusCode);

			if (dataUserSignIn.token) {
				localStorage.setItem('token', dataUserSignIn?.token);
				const userDefault = await UserDefault();
				localStorage.setItem('userMain', JSON.stringify(userDefault?.userInfo));

				setTimeout(() => {
					return (window.location.href = '/dashboard');
				}, 1000);
			}
			console.warn('user not found');
		} catch (error) {
			console.error(error);
		} finally {
			setLoader(false);
			showToast(true);
		}
	}

	const icon = isOpen ? <EyeOpen /> : <EyeClose />;

	return (
		<main className='flex justify-center mx-6 relative top-24'>
			{toast ? (
				<Toast
					visibility={true}
					message={statusCode.status === 401 ? 'Credenciales invalidas' : 'Incio de sesion correcto'}
					severity={statusCode.status === 401 ? 'error' : 'success'}
				/>
			) : (
				''
			)}
			<section className='w-full md:w-1/3'>
				<header className='flex items-center justify-between px-8'>
					<Link to='/'>
						<ArrowBack />
					</Link>

					<Link to='/signUp'>
						<p className='text-xl text-gray-400'> {t('form.field.signUp')}</p>
					</Link>
				</header>
				<form className='mt-10 grid gap-8 p-8 bg-slate-900 rounded-md' onSubmit={handleSubmit}>
					<h1 className='text-3xl mb-6'>{t('form.field.signIn')}</h1>
					<div>
						<label htmlFor=''>{t('form.field.email')}</label>
						<Input type='text' placeholder={t('form.field.email')} onChange={handleChange} value={data.email} name='email' required />
					</div>
					<div className='relative'>
						<label htmlFor=''>{t('form.field.password')}</label>
						<Input
							type={isOpen ? 'text' : 'password'}
							placeholder={t('form.field.password')}
							onChange={handleChange}
							value={data.password}
							name='password'
							required
						/>
						<div className='absolute right-2 top-7' onClick={handleClick}>
							{icon}
						</div>
					</div>
					<div className='flex justify-center w-full items-center '>
						{loader ? (
							<Loader />
						) : (
							<Button className='w-full' type='submit'>
								{t('form.field.signIn')}
							</Button>
						)}
					</div>

					<Link to='' className=''>
						{t('form.password.forgotten')}
					</Link>
				</form>
			</section>
		</main>
	);
}
