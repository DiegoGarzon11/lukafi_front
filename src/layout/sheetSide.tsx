import {Button} from '@/components/ui/button';
import {Sheet, SheetClose, SheetContent, SheetFooter, SheetTrigger, SheetTitle} from '@/components/ui/sheet';
import {useTranslation} from 'react-i18next';
import dog from '@/assets/avatar/dog.webp';
import {Headset, LogOut, LucideLineChart, Menu, User, Wallet, X} from 'lucide-react';
import {Link} from 'react-router-dom';
import {useState} from 'react';

export function SheetSide() {
	const {t, i18n} = useTranslation();
	i18n.changeLanguage();
	const [sheetOpen, setSheetOpen] = useState(false);
	const [btnSelected, setBtnSelected] = useState(null);

	const infoUser = localStorage.userMain ? JSON.parse(localStorage?.userMain) : '';

	function closeSession() {
		localStorage.removeItem('token');
		localStorage.removeItem('userMain');
		window.location.href = '/';
	}
	

	return (
		<div className='flex items-center'>
			<Sheet open={sheetOpen}>
				<SheetTrigger asChild>
					<Button onClick={() => setSheetOpen(true)} className='border-none m-0 p-0 flex justify-center w-11 ' variant='black_outline'>
						<Menu className='w-full h-9' />
					</Button>
				</SheetTrigger>
				<SheetContent className='dark:bg-zinc-900 bg-zinc-200 w-60 md:w-72' aria-describedby={undefined} side='right'>
					<div className='w-ful flex justify-end'>
						<SheetClose className='mr-3' onClick={() => setSheetOpen(false)}>
							<X />
						</SheetClose>
					</div>
					<SheetTitle className='hidden' />
					<div className=' mt-10 flex flex-col h-full gap-3'>
						<div className=' flex flex-col items-center mb-5 border-b pb-3 border-blue-500 w-full'>
							<div className='bg-white p-5 rounded-full flex justify-center items-center'>
								<img className='' src={dog} width={50} alt='' />
							</div>

							<p className='capitalize text-lg font-semibold'>{infoUser.full_name}</p>
							<p className='dark:text-white/55 text-black/60'>{infoUser.email}</p>
						</div>
						<h6 className='text-sm pl-2 text-blue-500'>Dashboard</h6>
						<Link className='visited:dark:bg-red-500' onClick={() => setSheetOpen(false)} to='dashboard'>
							<Button
								onClick={() => setBtnSelected(0)}
								className={`w-full gap-4 justify-start py-6 bg-zinc-200 hover:bg-white dark:hover:bg-zinc-800 text-black dark:text-white ${
									btnSelected === 0 ? 'bg-white dark:bg-zinc-800' : 'bg-transparent'
								}`}>
								<LucideLineChart />
								Dashboard
							</Button>
						</Link>
						<h6 className='text-sm pl-2 text-blue-500'>Cuenta</h6>
						<Button
							className='w-full gap-4 justify-start py-6 bg-trasparent  hover:bg-white dark:hover:bg-zinc-800 text-black dark:text-white'
							disabled>
							<User /> Perfil
						</Button>
						<h6 className='text-sm pl-2 text-blue-500'>Billetera</h6>
						<Link onClick={() => setSheetOpen(false)} to='wallet'>
							<Button
								onClick={() => setBtnSelected(1)}
								className={`w-full gap-4 justify-start py-6 bg-zinc-200 hover:bg-white dark:hover:bg-zinc-800 text-black dark:text-white ${
									btnSelected === 1 ? 'bg-white dark:bg-zinc-800' : 'bg-transparent'
								}`}>
								<Wallet />
								Billetera
							</Button>
						</Link>

						<Button
							className='absolute bottom-16 w-full gap-4 justify-start py-6 bg-transparent hover:bg-white dark:hover:bg-zinc-800 text-black dark:text-white'
							onClick={() => {
								closeSession();
							}}>
							<LogOut />
							{t('sheet.button.signOut')}
						</Button>

						<Button
							className='absolute gap-2 bottom-0 w-full py-6 bg-transparent hover:bg-white dark:hover:bg-zinc-800 text-black dark:text-white'
							disabled>
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
