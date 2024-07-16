import { UserRegister } from '@/apis/UserService';
import { EyeClose, EyeOpen } from '@/assets/icons/Svg';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ResponseSignIn } from '@/interfaces/Wallet';
import { COUNTRIES } from '@/tools/countries';
import { Toast } from '@/tools/Toast';
import { ArrowBack } from '@/assets/icons/Svg';
import { Loader } from '@/assets/icons/Svg';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function SignUp() {
	const { t, i18n } = useTranslation();

	i18n.changeLanguage();
	const currentYear = new Date().getFullYear();
	const years = Array.from({ length: currentYear - 1960 - 15 + 1 }, (_, i) => 1960 + i);
	const months = Array.from({ length: 12 }, (_, i) => i + 1);
	const days = Array.from({ length: 31 }, (_, i) => i + 1);
	const [showPassword, setShowPassword] = useState(false);
	const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
	const [toast, showToast] = useState(false);
	const [statusCode, setStatusCode] = useState<ResponseSignIn | undefined>(null);
	const [loader, setLoader] = useState(false);

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
		const { name, value } = e.target;
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
		showToast(false);
		setLoader(true);
		const fecha = `${date.day}/${date.month}/${date.year}`;
		const values = {
			...data,
			age: fecha,
		};
		event.preventDefault();

		try {
			const infoRegister = await UserRegister(values);
			setStatusCode(infoRegister);
			if (infoRegister?.status === 201) {
				setLoader(true);
				setTimeout(() => {
					return (window.location.href = '/signIn');
				}, 1000);
			}
		} catch (error) {
			console.log(error);
		} finally {
			showToast(true);
			setLoader(false);
		}
	}

	return (
		<div className='flex justify-center px-6 relative top-24 mb-24'>
			{handleSubmit ? (
				<Toast
					visibility={true}
					message={statusCode?.status === 409 ? 'Usuario ya existente' : 'Registro exitoso'}
					severity={statusCode?.status === 409 ? 'warning' : 'success'}
				/>
			) : (
				''
			)}
			<section className='w-full md:w-1/3'>
				<header className='flex items-center justify-between px-8 '>
					<Link to='/'>
						<ArrowBack />
					</Link>

					<Link
						to='/signIn'
						className='text-xl text-gray-400'>
						{t('form.field.signIn')}
					</Link>
				</header>
				<form
					className='grid gap-8 my-10 p-8 bg-slate-900 rounded-md '
					onSubmit={handleSubmit}>
					<h1 className='text-3xl mb-6'>{t('form.field.signUp')}</h1>
					<div>
						<label htmlFor=''>{t('form.field.name')}*</label>
						<Input
							type='text'
							placeholder={t('form.field.name')}
							onChange={handleChange}
							value={data.name}
							name='name'
						/>
					</div>
					<div>
						<label htmlFor=''>{t('form.field.lastName')}*</label>
						<Input
							type='text'
							placeholder={t('form.field.lastName')}
							onChange={handleChange}
							value={data.lastName}
							name='lastName'
						/>
					</div>
					<div>
						<label htmlFor=''>{t('form.field.email')}*</label>
						<Input
							type='email'
							placeholder={t('form.field.email')}
							onChange={handleChange}
							value={data.email}
							name='email'
						/>
					</div>
					<div className='flex flex-col w-full'>
						<label htmlFor=''>{t('form.field.nacionality')}*</label>
						<Select
							onValueChange={(value) => handeleNacionality(value)}
							value={data.nacionality}>
							<SelectTrigger className='w-full'>
								<SelectValue placeholder={t('form.field.nacionality')} />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectLabel>{t('form.label.countries')}</SelectLabel>
									{COUNTRIES.map((e) => (
										<SelectItem
											className='cursor-pointer'
											key={e.id}
											value={e.name}>
											{e.name}
										</SelectItem>
									))}
								</SelectGroup>
							</SelectContent>
						</Select>
					</div>
					<div className='flex flex-col'>
						<label htmlFor=''>{t('form.field.bth')}</label>
						<div className='flex gap-8'>
							<Select
								onValueChange={(value) => handleDateChange(value, 'year')}
								value={date.year}>
								<SelectTrigger className='w-full'>
									<SelectValue placeholder={t('form.field.year')} />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectLabel>{t('form.field.year')}</SelectLabel>
										{years.map((e, i) => (
											<SelectItem
												key={i}
												value={e.toString()}>
												{e}
											</SelectItem>
										))}
									</SelectGroup>
								</SelectContent>
							</Select>

							<Select
								onValueChange={(value) => handleDateChange(value, 'month')}
								value={date.month}>
								<SelectTrigger className='w-full'>
									<SelectValue placeholder={t('form.field.month')} />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectLabel>{t('form.field.month')}</SelectLabel>
										{months.map((e, i) => (
											<SelectItem
												key={i}
												value={e.toString()}>
												{e}
											</SelectItem>
										))}
									</SelectGroup>
								</SelectContent>
							</Select>
							<Select
								onValueChange={(value) => handleDateChange(value, 'day')}
								value={date.day}>
								<SelectTrigger className='w-full'>
									<SelectValue placeholder={t('form.field.day')} />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectLabel>{t('form.field.day')}</SelectLabel>
										{days.map((e, i) => (
											<SelectItem
												key={i}
												value={e.toString()}>
												{e}
											</SelectItem>
										))}
									</SelectGroup>
								</SelectContent>
							</Select>
						</div>
					</div>
					<div className='relative'>
						<label htmlFor=''>{t('form.field.password')}*</label>
						<Input
							type={showPassword ? 'text' : 'password'}
							placeholder={t('form.field.password')}
							onChange={handleChange}
							value={data.password}
							name='password'
						/>
						<div
							className='absolute right-2 top-7'
							onClick={() => setShowPassword((prev) => !prev)}>
							{showPassword ? <EyeOpen /> : <EyeClose />}
						</div>
					</div>
					<div className='relative'>
						<label htmlFor=''>{t('form.field.confirmPassword')}*</label>
						<Input
							type={showPasswordConfirm ? 'text' : 'password'}
							onChange={handleChange}
							value={data.confirmPassword}
							name='confirmPassword'
						/>
						<div
							className='absolute right-2 top-7'
							onClick={() => setShowPasswordConfirm((prev) => !prev)}>
							{showPasswordConfirm ? <EyeOpen /> : <EyeClose />}
						</div>
					</div>

					{loader || statusCode?.status === 201 ? (
						<div className='flex justify-center'>
							<Loader />
						</div>
					) : (
						<Button
							disabled={
								data.name == '' ||
								data.lastName == '' ||
								date == null ||
								data.password == '' ||
								data.confirmPassword == '' ||
								data.password != data.confirmPassword
									? true
									: false
							}>
							{t('form.field.signUp')}
						</Button>
					)}
				</form>
			</section>
		</div>
	);
}
