import { RestorePassword, GenerateNewPassword } from '@/apis/UserService';
import { useEffect, useState } from 'react';
import { Toast } from '@/tools/Toast';
import { EyeClose, EyeOpen, LoaderApi } from '@/assets/icons/Svg';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { BadgeCheck } from 'lucide-react';
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
		<section className='flex flex-col items-center justify-center h-screen pt-20 p-5 gap-5 dark:bg-zinc-800 bg-white font-thin'>
			{token ? (
				<>
					{isRedirect && response.success == true ? (
						<div className='shadow shadow-green-500  rounded-md  p-5 flex flex-col justify-center gap-3 items-center'>
							<h3 className='font-semibold text-xl my-3 flex items-center gap-2'>
								Contraseña actualizada <BadgeCheck className='text-green-500' />{' '}
							</h3>
							<p className='opacity-80'>Tu contraseña ha sido actualizada con éxito</p>
							<p className='text-lg'>Serás redirigido en {numero} segundos</p>
						</div>
					) : (
						''
					)}
					<div className='shadow dark:shadow-zinc-700  rounded-md  p-5 w-1/4'>
						<h3 className='font-semibold text-xl my-3'>Crear nueva contraseña</h3>
						<p className='opacity-50'>Por tu seguridad te pedimos que tu nueva contraseña sea distintas a las anteriores</p>
						<form
							onSubmit={newPassword}
							className='flex flex-col gap-3 w-full my-5'>
							<div className='flex items-center gap-3 '>
								<Input
									type='checkbox'
									className='w-4'
									checked={password.length >= 5}
									readOnly
								/>
								<p className='font-semibold'>
									Debe tener al menos 5 caracteres <span className='text-red-500'>*</span>
								</p>
							</div>
							<div className='relative'>
								<label
									htmlFor=''
									className='text-lg'>
									Nueva contraseña <span className='text-red-500'>*</span>
								</label>
								<Input
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className='dark:text-white border-zinc-300 dark:bg-zinc-800/30 text-black'
									autoComplete='current-password'
									type={showPassword ? 'text' : 'password'}
									name='password'
								/>
								<div
									className='absolute right-2 top-8 cursor-pointer'
									onClick={() => {
										setshowPassword((prevIcon) => !prevIcon);
									}}>
									{showPassword ? <EyeOpen className='text-zinc-700' /> : <EyeClose className='text-zinc-500' />}
								</div>
							</div>
							<div className='relative'>
								<label
									htmlFor=''
									className='text-lg'>
									Confirmar contraseña <span className='text-red-500'>*</span>
								</label>
								<Input
									className='dark:text-white border-zinc-300 dark:bg-zinc-800/30 text-black'
									autoComplete='current-password'
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
									type={showPasswordConfirm ? 'text' : 'password'}
									name='password'
								/>
								<div
									className='absolute right-2 top-8 cursor-pointer'
									onClick={() => {
										setshowPasswordConfirm((prevIcon) => !prevIcon);
									}}>
									{showPasswordConfirm ? <EyeOpen className='text-zinc-700' /> : <EyeClose className='text-zinc-500' />}
								</div>
							</div>

							{isRedirect ? (
								''
							) : (
								<button
									disabled={!email || loader || password.length <= 5 || password !== confirmPassword}
									type='submit'
									className='w-full rounded-md p-2 bg-zinc-300 dark:bg-zinc-700 text-white font-semibold flex justify-center'>
									{loader ? <LoaderApi color='white' /> : 'Enviar'}
								</button>
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
				<div className='shadow dark:shadow-zinc-700  rounded-md  p-5 w-1/4'>
					<div className='flex justify-center flex-col items-center gap-5 mt-3'>
						<img
							src='/images/forgot-password.webp'
							alt='Forgot password'
							className='w-56 h-56 object-cover rounded-full dark:bg-zinc-700/20 bg-zinc-100 self-center'
						/>
						<p className='font-bold'>¿Olvidaste tu contraseña?</p>
						<p className='font-semibold opacity-30 text-sm text-center'>
							Ingresa tu correo electrónico abajo para recibir instrucciones para recuperar tu contraseña.
						</p>
						<form
							onSubmit={submitEmail}
							className='flex flex-col gap-3 w-full'>
							<input
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								type='email'
								placeholder='Correo electrónico'
								className='w-full rounded-md p-2 border-zinc-300 dark:border-zinc-700 border-solid border outline-none text-black'
							/>
							<button
								disabled={!email || loader}
								type='submit'
								className='w-full rounded-md p-2 bg-zinc-300 dark:bg-zinc-700 text-white font-semibold flex justify-center'>
								{loader ? <LoaderApi color='white' /> : 'Enviar'}
							</button>
						</form>
						<p className='font-semibold'>
							¿Recordaste tu contraseña?
							<Link
								to='/auth'
								className='text-blue-500 underline mx-2'>
								Ingresa aquí
							</Link>
						</p>
					</div>
				</div>
			)}
			{visibilityToast && (
				<Toast
					visibility={visibilityToast}
					severity={response.success == true ? 'success' : 'error'}
					message={response.message}
				/>
			)}
		</section>
	);
};
