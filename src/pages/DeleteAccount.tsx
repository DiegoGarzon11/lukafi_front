import {useTranslation} from 'react-i18next';

const DeleteAccount = () => {
	const {t, i18n} = useTranslation();
	i18n.changeLanguage();

	return (
		<section className='flex flex-col items-center justify-center h-screen pt-20 p-5 gap-5 dark:bg-dark_primary_color bg-white font-thin -ml-64'>
			<div className='shadow dark:shadow-zinc-700   p-5 w-11/12 md:w-[500px] rounded-md'>
				<div className='flex justify-center flex-col items-center gap-5 mt-3'>
					<img
						src='/images/dontgo.webp'
						alt='Forgot password'
						className='w-56 h-56 object-cover rounded-full dark:bg-zinc-700/20 bg-zinc-100 self-center'
					/>
					<p className='font-bold'>{t('delete.account.confirmPassword')}</p>
					<p className='font-semibold opacity-30 text-sm text-center'>{t('delete.account.text')}</p>
					<form className='flex flex-col gap-3 w-full'>
						<input
							value=''
							type='password'
							placeholder={t('delete.account.password')}
							className='w-full rounded-md p-2 border-gray-600/50 dark:border-zinc-700 border-solid border outline-none text-black'
						/>
						<button
							type='submit'
							className='w-full rounded-md p-2 bg-zinc-300 dark:bg-zinc-700 text-white font-semibold flex justify-center'>
							{t('delete.account.confirm')}
						</button>
					</form>
				</div>
			</div>
		</section>
	);
};

export default DeleteAccount;
