import {RestorePassword, GenerateNewPassword} from '@/apis/UserService';
import {useEffect, useState} from 'react';
import {Toast} from '@/tools/Toast';
import {EyeClose, EyeOpen, LoaderApi} from '@/assets/icons/Svg';
import {Input} from '@/components/ui/input';
import {Link} from 'react-router-dom';
import {BadgeCheck} from 'lucide-react';
import {Button} from '@/components/ui/button';
export const ForgetPassword = () => {
	const [email, setEmail] = useState('');
	const [token, setToken] = useState(null);
	const [loader, setLoader] = useState(false);
	const [visibilityToast, setVisibilityToast] = useState(false);
	const [response, setResponse] = useState(null);
	const [showPassword, setshowPassword] = useState(false);
	const [showPasswordConfirm, setshowPasswordConfirm] = useState(false);
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [isRedirect, setIsRedirect] = useState(false);
	const [numero, setNumero] = useState(5);

	const submitEmail = async (e) => {
		e.preventDefault();
		setLoader(true);
		setVisibilityToast(false);
		try {
			const response = await RestorePassword(email);
			if (response) {
				setToken(response?.token);
				setLoader(true);
				setVisibilityToast(true);
				setResponse(response);
			}
		} catch (error) {
			console.error(error);
		} finally {
			setLoader(false);
		}
	};
	const newPassword = async (e) => {
		e.preventDefault();
		setLoader(true);
		setVisibilityToast(false);
		try {
			const response = await GenerateNewPassword(confirmPassword, token);
			if (response) {
				setIsRedirect(true);
				setVisibilityToast(true);
				setResponse(response);
				setLoader(true);
				if (response.success == true) {
					setTimeout(() => {
						window.location.href = '/auth';

						return;
					}, 5200);
				} else {
					setTimeout(() => {
						window.location.href = '/auth/restore-password';

						return;
					}, 2500);
				}
			}
		} catch (error) {
			console.error(error);
		} finally {
			setLoader(false);
			setVisibilityToast(true);
		}
	};
	useEffect(() => {
		if (isRedirect && response.success == true) {
			const interval = setInterval(() => {
				setNumero((prevContador) => {
					if (prevContador <= 0) {
						clearInterval(interval);
						return 0;
					}
					return prevContador - 1;
				});
			}, 1100);
		}
	}, [isRedirect]);

	return (
		<section className='flex flex-col items-center justify-center h-screen pt-20 p-5 gap-5 dark:bg-dark_primary_color bg-white font-thin'>
			{token ? (
				<>
					{isRedirect && response.success == true ? (
						<div className='shadow-sm shadow-lime-500  rounded-md  p-5 flex flex-col justify-center gap-3 items-center'>
							<h3 className='font-semibold text-xl my-3 flex items-center gap-2'>
								Contraseña actualizada <BadgeCheck className='text-lime-500' />
							</h3>
							<p className='opacity-80'>Tu contraseña ha sido actualizada con éxito</p>
							<p className='text-lg'>Serás redirigido en {numero} segundos</p>
						</div>
					) : (
						''
					)}
					<div className='  rounded-md  p-5  w-11/12 md:w-[500px]'>
						<div className='flex justify-center items-center'>
							<img
								src='/images/img.restore-pssw.webp'
								alt='Forgot password'
								className='w-56 h-56 object-cover rounded-full dark:bg-zinc-700/20 bg-zinc-100 self-center'
							/>
						</div>
						<p className='opacity-50 dark:text-white text-black text-xl font-semibold'>
							Por tu seguridad te pedimos que tu nueva contraseña sea distintas a las anteriores
						</p>
						<form onSubmit={newPassword} className='flex flex-col gap-3 w-full my-5'>
							<div className='flex items-center gap-3 '>
								<Input type='checkbox' className='w-4' checked={password.length >= 5} readOnly />
								<p className='font-semibold dark:text-white text-black text-lg'>
									Debe tener al menos 5 caracteres <span className='text-red-500'>*</span>
								</p>
							</div>
							<div className='relative'>
								<Input
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className='border-b dark:bg-dark_secondary_color border-none text-lg dark:text-white text-black placeholder:text-gray-300 w-full'
									autoComplete='new-password'
									placeholder='Nueva contraseña'
									type={showPassword ? 'text' : 'password'}
									name='password'
								/>
								<div
									className='absolute right-2 top-2 cursor-pointer'
									onClick={() => {
										setshowPassword((prevIcon) => !prevIcon);
									}}>
									{showPassword ? <EyeOpen className='text-zinc-700' /> : <EyeClose className='text-zinc-500' />}
								</div>
							</div>
							<div className='relative'>
								<Input
									className='border-b dark:bg-dark_secondary_color border-none text-lg dark:text-white text-black placeholder:text-gray-300 w-full'
									autoComplete='new-password'
									value={confirmPassword}
									placeholder='Confirmar contraseña '
									onChange={(e) => setConfirmPassword(e.target.value)}
									type={showPasswordConfirm ? 'text' : 'password'}
									name='password'
								/>
								<div
									className='absolute right-2 top-2 cursor-pointer'
									onClick={() => {
										setshowPasswordConfirm((prevIcon) => !prevIcon);
									}}>
									{showPasswordConfirm ? <EyeOpen className='text-zinc-700' /> : <EyeClose className='text-zinc-500' />}
								</div>
							</div>

							{isRedirect ? (
								''
							) : (
								<Button
									disabled={!email || loader || password.length <= 5 || password !== confirmPassword}
									type='submit'
									className='w-full font-semibold bg-alternative_color text-white text-lg flex justify-center items-center py-5 cursor-pointer'>
									{loader ? <LoaderApi color='white' /> : 'Enviar'}
								</Button>
							)}
						</form>
						{password == confirmPassword ? (
							<p className='text-center text-green-500 text-lg'>Las contraseñas coinciden</p>
						) : (
							<p className='text-center text-red-500 text-lg'>Las contraseñas no coinciden</p>
						)}
					</div>
				</>
			) : (
				<div className=' p-5 w-11/12 md:w-[500px] rounded-md '>
					<div className='flex justify-center flex-col items-center gap-5 mt-3'>
						<img
							src='/images/forgot-password.webp'
							alt='Forgot password'
							className='w-56 h-56 object-cover rounded-full dark:bg-zinc-700/20 bg-zinc-100 self-center'
						/>
						<p className='font-bold dark:text-white text-black text-xl'>¿Olvidaste tu contraseña?</p>
						<p className='font-semibold opacity-30 text-md text-center dark:text-white text-black'>
							Ingresa tu correo electrónico abajo para recibir instrucciones para recuperar tu contraseña.
						</p>
						<form onSubmit={submitEmail} className='flex flex-col gap-3 w-full'>
							<Input
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								type='email'
								placeholder='Email'
								className=' dark:bg-dark_secondary_color border-none text-lg dark:text-white text-black placeholder:text-gray-300 w-full'
							/>
							<Button
								disabled={!email || loader}
								type='submit'
								className='w-full font-semibold bg-alternative_color text-white text-lg flex justify-center items-center py-5 cursor-pointer'>
								{loader ? <LoaderApi color='white' /> : 'Enviar'}
							</Button>
						</form>
						<p className='font-semibold dark:text-white text-black text-lg'>
							¿Recordaste tu contraseña?
							<Link to='/' className='text-lime-500 underline mx-2'>
								Ingresa aquí
							</Link>
						</p>
					</div>
				</div>
			)}
			{visibilityToast && (
				<Toast visibility={visibilityToast} severity={response.success == true ? 'success' : 'error'} message={response.message} />
			)}
		</section>
	);
};
