import { RestoreAccount } from '@/apis/UserService';
import { Button } from '@/components/ui/button';
import { ApiResponse } from '@/interfaces/Api';
import { Toast } from '@/hooks/Toast';
import { BadgeCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
const RestoreAccountPage = () => {
	const { t, i18n } = useTranslation();
	const [visibilytToast, setVisibilityToast] = useState(false);
	const [responseApi, setResponseApi] = useState<ApiResponse | undefined>(null);
	const [dialog, setDialog] = useState(false);
	const [numero, setNumero] = useState(5);
	i18n.changeLanguage();
	const userDeleted = JSON.parse(localStorage.getItem('userMain'));
	const difference = new Date().getTime() - new Date(userDeleted?.deleted_in).getTime();
	const diasRestantes = Math.abs(Math.ceil(difference / (1000 * 60 * 60 * 24)) - 21);

	const handleSubmit = async (event) => {
		event.preventDefault();
		setVisibilityToast(false);

		try {
			const response = await RestoreAccount();
			if (response) {
				setResponseApi(response);
				setVisibilityToast(true);
				userDeleted.deleted_in = null;
				setDialog(true);
				setTimeout(() => {
					window.location.href = '/';
					localStorage.removeItem('userMain');
					localStorage.removeItem('token');
					localStorage.removeItem('route_name');
				}, 5000);
			}
		} catch (error) {
			console.error(error);
		} finally {
			setVisibilityToast(true);
		}
	};
	useEffect(() => {
		if (dialog && responseApi.success == true) {
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
	}, [dialog]);

	const handleCancel = async (event) => {
		event.preventDefault();
		window.location.href = '/';
		localStorage.removeItem('userMain');
		localStorage.removeItem('token');
		localStorage.removeItem('route_name');
		return;
	};

	return (
		<section className='flex flex-col items-center justify-center h-screen pt-20 p-5 gap-5 dark:bg-dark_primary_color bg-white font-thin'>
			<div className='p-5 w-11/12 md:w-[500px] rounded-md flex flex-col justify-center'>
				<div className='flex justify-center flex-col items-center gap-5 mt-3'>
					<img
						src='/images/removing_account.webp'
						alt='Forgot password'
						className='w-56 h-56  rounded-full '
					/>
					<p className={`font-bold text-xl text-black dark:text-white text-center ${dialog ? 'hidden' : 'block'}`}>
						Tu cuenta completara su eliminación en <span className='text-main_color'>{diasRestantes}</span> dias
					</p>
					<p className={`font-semibold text-md text-main_color   text-center  ${dialog ? 'hidden' : 'block'}`}>¿Te gustaria reactivarla?</p>
				</div>
				<div className={` ${dialog ? 'hidden' : 'flex'} justify-center gap-5 mt-5 flex-col items-center `}>
					<Button
						onClick={handleSubmit}
						className=' w-full font-semibold  text-white text-lg flex justify-center items-center py-5 cursor-pointer bg-alternative_color '>
						Restaurar cuenta
					</Button>
					<Button
						className='dark:text-white text-black cursor-pointer'
						onClick={handleCancel}>
						Cancelar
					</Button>
				</div>
				<div
					className={` ${
						dialog ? 'flex' : 'hidden'
					} shadow-sm shadow-alternative_color  rounded-md  p-5 flex-col justify-center gap-3 items-center`}>
					<h3 className='font-semibold text-xl my-3 flex items-center gap-2 text-main_color'>
						Cuenta restaurada <BadgeCheck className='text-alternative_color' />
					</h3>
					<p className='text-lg dark:text-white text-black'>Serás redirigido en {numero} segundos para que Inicie sesión</p>
				</div>
			</div>
			{visibilytToast && (
				<Toast
					visibility={visibilytToast}
					severity={responseApi.success == true ? 'success' : 'error'}
					message={responseApi.message}
				/>
			)}
		</section>
	);
};

export default RestoreAccountPage;
