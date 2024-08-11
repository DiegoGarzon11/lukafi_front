import {Button} from '@/components/ui/button';
import {Sheet, SheetClose, SheetContent, SheetFooter, SheetTrigger, SheetTitle} from '@/components/ui/sheet';
import {useTranslation} from 'react-i18next';
import dog from '@/assets/avatar/dog.webp';
import {Headset, LogOut, Menu, User, Wallet} from 'lucide-react';

export function SheetSide() {
	const {t, i18n} = useTranslation();
	i18n.changeLanguage();

	const infoUser = JSON.parse(localStorage.userMain);

	function closeSession() {
		localStorage.removeItem('token');
		localStorage.removeItem('userMain');
		window.location.href = '/';
	}

	return (
		<div className='flex items-center'>
			<Sheet>
				<SheetTrigger asChild>
					<Button className='border-none m-0 p-0 flex justify-center w-11 ' variant='black_outline'>
						<Menu className='w-full h-9' />
					</Button>
				</SheetTrigger>
				<SheetContent className='dark:bg-slate-900 bg-slate-200 w-60 md:w-72' aria-describedby={undefined} side='right'>
					<SheetTitle className='hidden' />
					<div className=' mt-10 flex flex-col h-full gap-3'>
						<div className=' flex flex-col items-center mb-5 border-b pb-3 border-blue-500 w-full'>
							<div className='bg-white p-5 rounded-full flex justify-center items-center'>
								<img className='' src={dog} width={50} alt='' />
							</div>

							<p className='capitalize text-lg font-semibold'>{infoUser.full_name}</p>
							<p className=' dark:text-white/55 text-black/60'>{infoUser.email}</p>
						</div>
						<Button
							className='w-full gap-4 justify-start py-6 bg-trasparent hover:bg-white dark:hover:bg-slate-800 text-black dark:text-white'
							disabled
							onClick={() => {
								closeSession();
							}}>
							<Wallet /> Billetera
						</Button>
						<Button
							className='w-full gap-4 justify-start py-6 bg-trasparent hover:bg-white dark:hover:bg-slate-800 text-black dark:text-white'
							disabled
							onClick={() => {
								closeSession();
							}}>
							<User /> Perfil
						</Button>

						<Button
							className='w-full gap-4 justify-start py-6 bg-transparent hover:bg-white dark:hover:bg-slate-800 text-black dark:text-white'
							disabled
							onClick={() => {
								closeSession();
							}}>
							<LogOut />
							{t('sheet.button.signOut')}
						</Button>

						<Button
							className='absolute gap-2 bottom-0 w-full py-6 bg-transparent hover:bg-white dark:hover:bg-slate-800 text-black dark:text-white'
							disabled
							onClick={() => {
								closeSession();
							}}>
							<Headset />
							Ayuda
						</Button>
					</div>

					<SheetFooter>
						<SheetClose className='w-full my-5' type='submit' asChild></SheetClose>
					</SheetFooter>
				</SheetContent>
			</Sheet>
		</div>
	);
}
