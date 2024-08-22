import {UserRegister} from '@/apis/UserService';
import {EyeClose, EyeOpen} from '@/assets/icons/Svg';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue} from '@/components/ui/select';
import {ResponseWallet} from '@/interfaces/Wallet';
import {COUNTRIES} from '@/tools/countries';
import {Toast} from '@/tools/Toast';
import {LoaderApi} from '@/assets/icons/Svg';
import {useState} from 'react';
import {useTranslation} from 'react-i18next';

export default function SignUp() {
	const {t, i18n} = useTranslation();

	i18n.changeLanguage();
	const currentYear = new Date().getFullYear();
	const years = Array.from({length: currentYear - 1960 - 15 + 1}, (_, i) => 1960 + i);
	const months = Array.from({length: 12}, (_, i) => i + 1);
	const days = Array.from({length: 31}, (_, i) => i + 1);
	const [showPassword, setShowPassword] = useState(false);
	const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
	const [statusCode, setStatusCode] = useState<ResponseWallet | undefined>(null);
	const [loader, setLoader] = useState(false);
	const [visibilytToast, setVisibilityToast] = useState(false);
	const [date, setDate] = useState({
		year: '',
		month: '',
		day: '',
	});
	const [data, setData] = useState({
		name: '',
		lastName: '',
		password: '',
		confirmPassword: '',
		email: '',
		age: null,
		nacionality: '',
	});

	function handleChange(e) {
		const {name, value} = e.target;
		setData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	}
	function handleDateChange(value, field) {
		setDate((prevDate) => ({
			...prevDate,
			[field]: value,
		}));
	}
	const handeleNacionality = (value) => {
		setData((preData) => ({
			...preData,
			nacionality: value,
		}));
	};

	async function handleSubmit(event) {
		setLoader(true);

		const fecha = `${date.month}/${date.day}/${date.year}`;

		const values = {
			...data,
			age: new Date(fecha),
		};
		event.preventDefault();

		try {
			const infoRegister = await UserRegister(values);
			setStatusCode(infoRegister);
			if (infoRegister?.status === 201) {
				setVisibilityToast(true);
				setLoader(true);
				setTimeout(() => {
					return (window.location.href = '/auth');
				}, 1000);
			}
		} catch (error) {
			console.error(error);
		} finally {
			setVisibilityToast(false);
			setLoader(false);
		}
	}

	return (
		<>
			{visibilytToast ? (
				<Toast
					visibility={visibilytToast}
					message={statusCode?.status === 409 ? 'Usuario ya existente' : 'Registro exitoso'}
					severity={statusCode?.status === 409 ? 'warning' : 'success'}
				/>
			) : (
				''
			)}

			<form className='my-10 grid gap-8 p-8 bg-zinc-300 dark:bg-zinc-900 rounded-2xl' onSubmit={handleSubmit}>
				<h1 className='text-4xl mb-6 font-semibold'>{t('form.field.signUp')}</h1>
				<div className='md:flex gap-5'>
					<div className='w-full'>
						<label htmlFor='' className='text-lg'>
							{t('form.field.name')} <span className='text-red-500'>*</span>
						</label>
						<Input
							type='text'
							className='bg-white'
							placeholder={t('form.field.name')}
							onChange={handleChange}
							value={data.name}
							name='name'
						/>
					</div>
					<div className='w-full'>
						<label htmlFor='' className='text-lg'>
							{t('form.field.lastName')} <span className='text-red-500'>*</span>
						</label>
						<Input
							type='text'
							className='bg-white'
							placeholder={t('form.field.lastName')}
							onChange={handleChange}
							value={data.lastName}
							name='lastName'
						/>
					</div>
				</div>
				<div>
					<label htmlFor='' className='text-lg'>
						{t('form.field.email')} <span className='text-red-500'>*</span>
					</label>
					<Input
						autoComplete='email'
						type='email'
						className='bg-white'
						placeholder={t('form.field.email')}
						onChange={handleChange}
						value={data.email}
						name='email'
					/>
				</div>
				<div className='flex flex-col w-full'>
					<label htmlFor='' className='text-lg'>
						{t('form.field.nacionality')} <span className='text-red-500'>*</span>
					</label>
					<Select onValueChange={(value) => handeleNacionality(value)} value={data.nacionality}>
						<SelectTrigger className='w-full bg-white text-zinc-400'>
							<SelectValue placeholder={t('form.field.nacionality')} />
						</SelectTrigger>
						<SelectContent className='dark:bg-zinc-900'>
							<SelectGroup>
								<SelectLabel>{t('form.label.countries')}</SelectLabel>
								{COUNTRIES.map((e) => (
									<SelectItem className='cursor-pointer' key={e.id} value={e.name}>
										{e.name}
									</SelectItem>
								))}
							</SelectGroup>
						</SelectContent>
					</Select>
				</div>
				<div className='flex flex-col'>
					<label htmlFor='' className='text-lg'>
						{t('form.field.bth')}
					</label>
					<div className='flex gap-8'>
						<Select onValueChange={(value) => handleDateChange(value, 'year')} value={date.year}>
							<SelectTrigger className='w-full bg-white text-zinc-400'>
								<SelectValue placeholder={t('form.field.year')} />
							</SelectTrigger>
							<SelectContent className='dark:bg-zinc-900'>
								<SelectGroup>
									<SelectLabel className='text-lg '>{t('form.field.year')}</SelectLabel>
									{years.map((e, i) => (
										<SelectItem key={i} value={e.toString()}>
											{e}
										</SelectItem>
									))}
								</SelectGroup>
							</SelectContent>
						</Select>

						<Select onValueChange={(value) => handleDateChange(value, 'month')} value={date.month}>
							<SelectTrigger className='w-full bg-white text-zinc-400'>
								<SelectValue placeholder={t('form.field.month')} />
							</SelectTrigger>
							<SelectContent className='dark:bg-zinc-900'>
								<SelectGroup>
									<SelectLabel className='text-lg'>{t('form.field.month')}</SelectLabel>
									{months.map((e, i) => (
										<SelectItem key={i} value={e.toString()}>
											{e}
										</SelectItem>
									))}
								</SelectGroup>
							</SelectContent>
						</Select>
						<Select onValueChange={(value) => handleDateChange(value, 'day')} value={date.day}>
							<SelectTrigger className='w-full bg-white text-zinc-400'>
								<SelectValue placeholder={t('form.field.day')} />
							</SelectTrigger>
							<SelectContent className='dark:bg-zinc-900'>
								<SelectGroup>
									<SelectLabel className='text-lg'>{t('form.field.day')}</SelectLabel>
									{days.map((e, i) => (
										<SelectItem key={i} value={e.toString()}>
											{e}
										</SelectItem>
									))}
								</SelectGroup>
							</SelectContent>
						</Select>
					</div>
				</div>

				<div className='flex justify-between flex-col lg:flex-row gap-5'>
					<div className='relative w-full'>
						<label htmlFor='' className='text-lg'>
							{t('form.field.password')} <span className='text-red-500'>*</span>
						</label>
						<Input
							autoComplete='new-password'
							type={showPassword ? 'text' : 'password'}
							className='bg-white'
							placeholder={t('form.field.password')}
							onChange={handleChange}
							value={data.password}
							name='password'
						/>
						<button
							className='absolute right-2 top-8'
							onClick={(e) => {
								e.preventDefault(), setShowPassword((prev) => !prev);
							}}>
							{showPassword ? <EyeOpen className='text-slate-700' /> : <EyeClose className='text-slate-700' />}
						</button>
					</div>
					<div className='relative w-full'>
						<label htmlFor='' className='text-lg'>
							{t('form.field.confirmPassword')} <span className='text-red-500'>*</span>
						</label>
						<Input
							autoComplete='new-password'
							type={showPasswordConfirm ? 'text' : 'password'}
							onChange={handleChange}
							className='bg-white'
							value={data.confirmPassword}
							name='confirmPassword'
						/>
						<button
							className='absolute right-2 top-8'
							onClick={(e) => {
								e.preventDefault(), setShowPasswordConfirm((prev) => !prev);
							}}>
							{showPasswordConfirm ? <EyeOpen className='text-slate-700' /> : <EyeClose className='text-slate-700' />}
						</button>
					</div>
				</div>
				{data.password == data.confirmPassword ? '' : <p className='text-center text-red-500 text-lg'>Las contraseñas no coinciden</p>}
				<Button
					type='submit'
					className='text-lg text-white bg-zinc-950 flex justify-center items-center '
					disabled={
						data.name == '' ||
						data.lastName == '' ||
						date == null ||
						data.password == '' ||
						data.confirmPassword == '' ||
						data.password != data.confirmPassword
					}>
					{loader || statusCode?.status === 201 ? <LoaderApi color='white' /> : t('form.field.signUp')}
				</Button>
			</form>
		</>
	);
}
