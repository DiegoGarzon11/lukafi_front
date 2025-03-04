import { RestoreAccount } from '@/apis/UserService';
import { useTranslation } from 'react-i18next';
const RestoreAccountPage = () => {
	const { t, i18n } = useTranslation();

	i18n.changeLanguage();

	const handleSubmit = async (event) => {
		event.preventDefault();

		try {
			const response = await RestoreAccount();
			if (response) {
				window.location.href = '/auth';
			}
		} catch (error) {
			console.error(error);
		}
	};
	const handleCancel = async (event) => {
		event.preventDefault();
		window.location.href = '/auth';
	};

	return (
		<section className='flex flex-col items-center justify-center h-screen pt-20 p-5 gap-5 dark:bg-dark_primary_color bg-white font-thin -ml-64'>
			<p>Binvenido de vuelta</p>
			<button onClick={handleSubmit}>
				<p>Restablecer cuenta</p>
			</button>
			<button onClick={handleCancel}>
				<p>Cancelar</p>
			</button>
		</section>
	);
};

export default RestoreAccountPage;
