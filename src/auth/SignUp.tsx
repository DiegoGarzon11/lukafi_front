import { UserRegister } from '@/apis/UserService';
import { EyeClose, EyeOpen } from '@/assets/icons/Svg';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ResponseWallet } from '@/interfaces/Wallet';
import { Toast } from '@/tools/Toast';
import { LoaderApi } from '@/assets/icons/Svg';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CreateWallet } from '@/apis/WalletService';

export default function SignUp({ isRegisterOk }) {
	const { t, i18n } = useTranslation();

	i18n.changeLanguage();

	const [showPassword, setShowPassword] = useState(false);
	const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
	const [statusCode, setStatusCode] = useState<ResponseWallet | undefined>(null);
	const [loader, setLoader] = useState(false);
	const [visibilytToast, setVisibilityToast] = useState(false);

	const [data, setData] = useState({
		name: '',
		lastName: '',
		password: '',
		confirmPassword: '',
		email: '',
	});

	function handleChange(e) {
		const { name, value } = e.target;
		setData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	}

	async function handleSubmit(event) {
		event.preventDefault();
		setLoader(true);
		setVisibilityToast(false);

		const values = {
			...data,
		};

		try {
			const infoRegister = await UserRegister(values);
			const params = {
				currency_type: 'cop',
				salary: 0,
				saving: 0,
				user_id: infoRegister.users.user_id, 
			};
			;

			
			 await CreateWallet(params);
			
			
			setStatusCode(infoRegister);
			if (infoRegister?.status === 201) {
				setLoader(true);
				setTimeout(() => {
					isRegisterOk(true);
				}, 1000);
			}
		} catch (error) {
			console.error(error);
		} finally {
			setVisibilityToast(true);
			setLoader(false);
		}
	}

	return (
		<>
			{visibilytToast ? (
				<Toast
					visibility={visibilytToast}
					message={statusCode?.message}
					severity={statusCode?.status === 409 ? 'warning' : 'success'}
				/>
			) : (
				''
			)}

			<form
				className=' mt-5 md:mt-0  w-full grid gap-5 p-8 bg-zinc-100 dark:bg-dark_primary_color rounded-2xl  h-full '
				onSubmit={handleSubmit}>
				<h1 className='text-4xl mb-6 md:mt-10 font-semibold'>{t('form.field.signUp')}</h1>
				<div className='flex gap-3'>
					<div className='w-full'>
						<label
							htmlFor=''
							className='text-lg'>
							{t('form.field.name')} <span className='text-red-500'>*</span>
						</label>
						<Input
							type='text'
							className='border-gray-600/50 dark:bg-zinc-800/30'
							onChange={handleChange}
							value={data.name}
							name='name'
						/>
					</div>
					<div className='w-full'>
						<label
							htmlFor=''
							className='text-lg'>
							{t('form.field.lastName')} <span className='text-red-500'>*</span>
						</label>
						<Input
							type='text'
							className='border-gray-600/50 dark:bg-zinc-800/30'
							onChange={handleChange}
							value={data.lastName}
							name='lastName'
						/>
					</div>
				</div>
				<div>
					<label
						htmlFor=''
						className='text-lg'>
						{t('form.field.email')} <span className='text-red-500'>*</span>
					</label>
					<Input
						autoComplete='email'
						type='email'
						className='border-gray-600/50 dark:bg-zinc-800/30'
						onChange={handleChange}
						value={data.email}
						name='email'
					/>
				</div>

				<div className='flex justify-between flex-col lg:flex-row gap-5'>
					<div className='relative w-full'>
						<label
							htmlFor=''
							className='text-lg'>
							{t('form.field.password')} <span className='text-red-500'>*</span>
						</label>
						<Input
							autoComplete='new-password'
							type={showPassword ? 'text' : 'password'}
							className='border-gray-600/50 dark:bg-zinc-800/30'
							onChange={handleChange}
							value={data.password}
							name='password'
						/>
						<button
							className='absolute right-2 top-8'
							onClick={(e) => {
								e.preventDefault(), setShowPassword((prev) => !prev);
							}}>
							{showPassword ? <EyeOpen className='text-zinc-500' /> : <EyeClose className='text-zinc-500' />}
						</button>
					</div>
					<div className='relative w-full'>
						<label
							htmlFor=''
							className='text-lg'>
							{t('form.field.confirmPassword')} <span className='text-red-500'>*</span>
						</label>
						<Input
							autoComplete='new-password'
							type={showPasswordConfirm ? 'text' : 'password'}
							onChange={handleChange}
							className='border-gray-600/50 dark:bg-zinc-800/30'
							value={data.confirmPassword}
							name='confirmPassword'
						/>
						<button
							className='absolute right-2 top-8'
							onClick={(e) => {
								e.preventDefault(), setShowPasswordConfirm((prev) => !prev);
							}}>
							{showPasswordConfirm ? <EyeOpen className='text-zinc-700' /> : <EyeClose className='text-zinc-500' />}
						</button>
					</div>
				</div>
				{data.password == data.confirmPassword ? '' : <p className='text-center text-red-500 text-lg'>Las contraseñas no coinciden</p>}
				<Button
					type='submit'
					className='text-lg text-white bg-zinc-950 flex justify-center items-center  py-5 '
					disabled={
						data.name == '' || data.lastName == '' || data.password == '' || data.confirmPassword == '' || data.password != data.confirmPassword
					}>
					{loader || statusCode?.status === 201 ? <LoaderApi color='white' /> : t('form.field.signUp')}
				</Button>
			</form>
		</>
	);
}
