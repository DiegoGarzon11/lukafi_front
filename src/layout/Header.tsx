import { Col, Usa, Moon, Sun, LoaderApi, EyeOpen, EyeClose } from '@/assets/icons/Svg';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SheetSide } from '@/layout/sheetSide';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ApiResponse } from '@/interfaces/Api';
import { UserDefault, UserRegister, UserSignIn } from '@/apis/UserService';
import { Toast } from '@/tools/Toast';
import { CreateWallet } from '@/apis/WalletService';
export default function Header({ valueSide }) {
	const location = useLocation();
	const [isOpen, setIsOpen] = useState(false);
	const [isSideOpen, setIsSideOpen] = useState(true);
	const [allowSidebar, setAllowSidebar] = useState(true);
	const [isAuthOpen, setIsAuthOpen] = useState(false);
	const [loader, setLoader] = useState(false);
	const [flipped, setFlipped] = useState(false);
	const [statusCode, setStatusCode] = useState<ApiResponse | undefined>(null);
	const [visibilytToast, setVisibilityToast] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [theme, setTheme] = useState(() => {
		const savedTheme = localStorage.getItem('theme');
		return savedTheme || 'light';
	});

	const { t, i18n } = useTranslation();
	const onChangeLanguage = (e) => {
		i18n.changeLanguage(e);
		if (e === 'es') {
			localStorage.setItem('lang', 'es');
		} else {
			localStorage.setItem('lang', 'en');
		}

		document.documentElement.lang = e;
	};

	const handleTheme = () => {
		setTheme((prevTheme) => {
			const newTheme = prevTheme === 'dark' ? 'light' : 'dark';
			localStorage.setItem('theme', newTheme);

			if (newTheme === 'dark') {
				document.documentElement.classList.add('dark');
				document.documentElement.classList.remove('light');
			} else {
				document.documentElement.classList.remove('dark');
				document.documentElement.classList.add('light');
			}

			return newTheme;
		});
	};
	useEffect(() => {
		const storedTheme = localStorage.getItem('theme') || 'light';
		setTheme(storedTheme);

		if (storedTheme === 'dark') {
			document.documentElement.classList.add('dark');
			document.documentElement.classList.remove('light');
		} else {
			document.documentElement.classList.remove('dark');
			document.documentElement.classList.add('light');
		}
	}, []);

	const handleSidebar = () => {
		setIsSideOpen(!isSideOpen);
		valueSide(!isSideOpen);
	};

	
	const userDeleted = localStorage.getItem('userMain') ? JSON.parse(localStorage.getItem('userMain'))?.deleted_in : null;
	const currentRoute = localStorage.route_name;
	console.log(currentRoute);

	useEffect(() => {
		if (userDeleted != null) {
			setAllowSidebar(false);
		} else {
			setAllowSidebar(true);
		}
	}, [currentRoute]);
	const handleAuth = () => {
		setIsAuthOpen(!isAuthOpen);
	};

	const [data, setData] = useState({
		newPassword: '',
		newEmail: '',
		newName: '',
		newLastName: '',
		email: '',
		password: '',
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

		try {
			const dataUserSignIn = await UserSignIn(data);
			setStatusCode(dataUserSignIn);

			if (dataUserSignIn.token) {
				localStorage.setItem('token', dataUserSignIn?.token);
				const userDefault = await UserDefault();

				localStorage.setItem('userMain', JSON.stringify(userDefault?.users));
				return userDefault?.users.deleted_in == null ? (window.location.href = '/dashboard') : (window.location.href = '/restore-account');
			}
			console.warn('user not found');
		} catch (error) {
			console.error(error);
		} finally {
			setLoader(false);
			setVisibilityToast(true);
		}
	}
	async function handleSubmitSignUp(event) {
		event.preventDefault();
		setLoader(true);

		setVisibilityToast(false);

		const values = {
			email: data.newEmail,
			password: data.newPassword,
			name: data.newName,
			last_name: data.newLastName,
		};

		try {
			const infoRegister = await UserRegister(values);
			if (infoRegister.status === 201) {
				const params = {
					currency_type: 'cop',
					salary: 0,
					saving: 0,
					user_id: infoRegister.users.user_id,
				};
				await CreateWallet(params);

				setStatusCode(infoRegister);
				setFlipped(false);
				setLoader(false);
			} else {
				setStatusCode(infoRegister);
				setVisibilityToast(true);
			}
		} catch (error) {
			console.error(error);
		} finally {
			setVisibilityToast(true);
			setTimeout(() => {
				setVisibilityToast(false);
			}, 2000);
			setLoader(false);
		}
	}

	return (
		<>
			<header className='z-50 absolute gap-5 w-0'>
				<div className={`flex justify-start gap-3 items-center `}>
					<SidebarProvider
						open={isSideOpen}
						onOpenChange={handleSidebar}>
						<section className={`${localStorage.token ? '' : 'hidden'}  transition-all duration-500 ease-in-out`}>
							{allowSidebar && <SheetSide />}
						</section>
						{localStorage.token && allowSidebar && (
							<SidebarTrigger className='z-50 mt-3 ml-3 sticky top-3 cursor-pointer dark:text-white text-black' />
						)}
						<Button
							variant='ghost'
							className='z-50 mt-3 ml-3 text-lg  sticky top-3 cursor-default dark:text-white text-black'>
							Lukafi
						</Button>
						<div className=' w-full fixed flex justify-end shadow-xs shadow-z-700 rounded-full p-3 z-10 bg-linear-to-b dark:from-zinc-950 dark:to-dark_primary_color from-zinc-100 to-zinc-300 border-b border-gray-600/50 '>
							<div className='flex items-center gap-5 dark:text-white text-black'>
								{!localStorage.token && location.pathname === '/' && (
									<Button
										onClick={handleAuth}
										variant='ghost'
										className='cursor-pointer rounded-4xl dark:bg-dark_foreground bg-light_primary_color px-3 py-1 border border-gray-800'>
										{t('header.signIn')} / {t('form.field.signUp')}
									</Button>
								)}

								<button
									onClick={() => setIsOpen(!isOpen)}
									className='cursor-pointer'>
									{localStorage.lang == 'en' ? <Usa /> : <Col />}
								</button>
								{isOpen && (
									<div className='absolute dark:text-white dark:bg-zinc-900 bg-white  rounded-lg shadow-sm w-36 right-20 top-12 '>
										<div className='p-2 flex flex-col gap-3'>
											<button
												className='hover:scale-105 cursor-pointer'
												onClick={() => {
													onChangeLanguage('es');
													setIsOpen(false);
												}}>
												<p className='flex items-center gap-3'>
													<Col /> <span>{t('header.languages.es')}</span>
												</p>
											</button>
											<button
												className='hover:scale-105 cursor-pointer'
												onClick={() => {
													onChangeLanguage('en');
													setIsOpen(false);
												}}>
												<p className='flex items-center gap-3'>
													<Usa />
													<span>{t('header.languages.en')}</span>
												</p>
											</button>
										</div>
									</div>
								)}
								{theme === 'dark' ? (
									<button
										className='dark:bg-transparent dark:hover:bg-transparent p-0 cursor-pointer'
										onClick={handleTheme}>
										<Moon />
									</button>
								) : (
									<button
										className='bg-transparent hover:bg-transparent p-0 cursor-pointer'
										onClick={handleTheme}>
										<Sun />
									</button>
								)}
							</div>
						</div>
					</SidebarProvider>
				</div>
			</header>
			<Outlet />
			<Dialog
				open={isAuthOpen}
				onOpenChange={setIsAuthOpen}>
				<DialogContent
					aria-describedby={null}
					className=' w-[95%] md:w-[400px] h-[500px] dark:bg-dark_primary_color bg-light_primary_color'>
					<div className='relative w-full h-full [perspective:1000px]'>
						<div
							className={`absolute w-full h-full transition-all duration-1000 [transform-style:preserve-3d] ${flipped ? 'rotate-y-180' : ''}`}>
							<div className='absolute w-full h-full flex flex-col justify-center items-center [backface-visibility:hidden] '>
								<DialogHeader className='flex flex-col justify-around w-full'>
									<DialogTitle className='my-3 dark:text-white text-black text-center absolute top-0 '>Bienvenido de vuelta</DialogTitle>
									<DialogDescription>
										<form className='flex flex-col gap-5 w-full'>
											<Input
												type='email'
												onChange={handleChange}
												value={data.email}
												placeholder='Email'
												name='email'
												className='border-b dark:bg-dark_secondary_color border-none text-lg dark:text-white text-black placeholder:text-gray-300 w-full'
											/>
											<div className='relative w-full'>
												<Input
													autoComplete='new-password'
													type={showPassword ? 'text' : 'password'}
													className='border-b dark:bg-dark_secondary_color border-none text-lg dark:text-white text-black placeholder:text-gray-300 w-full'
													placeholder='Password'
													onChange={handleChange}
													value={data.password}
													name='password'
												/>
												<button
													className='absolute right-2 top-1 cursor-pointer'
													onClick={(e) => {
														e.preventDefault(), setShowPassword((prev) => !prev);
													}}>
													{showPassword ? <EyeOpen className='text-zinc-500' /> : <EyeClose className='text-zinc-500' />}
												</button>
											</div>
											<p className='dark:text-white text-black text-center text-base'>
												¿Olvidaste tu contraseña?
												<Link
													onClick={() => setIsAuthOpen(false)}
													to='/auth/restore-password'
													className='text-lime-500 underline ml-2'>
													Recuperar
												</Link>
											</p>
											<Button
												disabled={!data.email || !data.password || loader}
												onClick={handleSubmit}
												className='w-full font-semibold bg-alternative_color text-white text-lg flex justify-center items-center py-5 cursor-pointer'
												type='submit'>
												{loader || statusCode?.status === 200 ? <LoaderApi color='white' /> : 'Iniciar sesión'}
											</Button>
											<p className='dark:text-white text-black text-center  text-lg absolute bottom-0 '>
												¿No tienes cuenta?
												<button
													onClick={(e) => {
														e.preventDefault();
														setFlipped(true);
													}}
													className='text-lime-500 underline ml-2 cursor-pointer'>
													Registrarse
												</button>
											</p>
										</form>
									</DialogDescription>
								</DialogHeader>
							</div>

							<div className='absolute w-full h-full flex flex-col justify-center items-center rotate-y-180 [backface-visibility:hidden]'>
								<DialogHeader className='flex flex-col justify-around w-full'>
									<DialogTitle className='my-3 dark:text-white text-black text-center absolute top-0 '>Crear Cuenta</DialogTitle>
									<p className='dark:text-white text-black text-center mb-10 self-start text-lg'>
										¿Ya tienes cuenta?
										<button
											onClick={(e) => {
												e.preventDefault();
												setFlipped(false);
											}}
											className='text-lime-500 underline ml-2 cursor-pointer'>
											Iniciar sesión
										</button>
									</p>
									<DialogDescription>
										<form
											className='flex flex-col gap-5 w-full'
											onSubmit={handleSubmitSignUp}>
											<div className='flex  gap-3'>
												<Input
													type='text'
													onChange={handleChange}
													value={data.newName}
													placeholder='Nombre'
													name='newName'
													className='border-b dark:bg-dark_secondary_color border-none text-lg dark:text-white text-black placeholder:text-gray-300 w-full'
												/>
												<Input
													type='text'
													onChange={handleChange}
													value={data.newLastName}
													placeholder='Last Name'
													name='newLastName'
													className='border-b dark:bg-dark_secondary_color border-none text-lg dark:text-white text-black placeholder:text-gray-300 w-full'
												/>
											</div>
											<Input
												type='email'
												onChange={handleChange}
												value={data.newEmail}
												placeholder='Email'
												name='newEmail'
												className='border-b dark:bg-dark_secondary_color border-none text-lg dark:text-white text-black placeholder:text-gray-300 w-full'
											/>
											<div className='relative w-full'>
												<Input
													autoComplete='new-password'
													type={showPassword ? 'text' : 'password'}
													className='border-b dark:bg-dark_secondary_color border-none text-lg dark:text-white text-black placeholder:text-gray-300 w-full'
													onChange={handleChange}
													placeholder='Password'
													value={data.newPassword}
													name='newPassword'
												/>
												<span className='text-alternative_color opacity-90'>Por favor verifique su contraseña</span>
												<button
													className='absolute right-2 top-1 cursor-pointer'
													onClick={(e) => {
														e.preventDefault(), setShowPassword((prev) => !prev);
													}}>
													{showPassword ? <EyeOpen className='text-zinc-500' /> : <EyeClose className='text-zinc-500' />}
												</button>
											</div>

											<Button
												type='submit'
												className='w-full font-semibold bg-alternative_color text-white text-lg flex justify-center items-center py-5 cursor-pointer'
												disabled={data.newName == '' || data.newLastName == '' || data.newPassword == ''}>
												{loader ? <LoaderApi color='white' /> : t('form.field.signUp')}
											</Button>
										</form>
									</DialogDescription>
								</DialogHeader>
							</div>
						</div>
					</div>
				</DialogContent>
			</Dialog>

			{visibilytToast ? (
				<Toast
					visibility={visibilytToast}
					message={statusCode.message}
					severity={statusCode?.status === 201 || statusCode?.status === 200 ? 'success' : 'error'}
				/>
			) : (
				''
			)}
		</>
	);
}
