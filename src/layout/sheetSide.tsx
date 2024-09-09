import {Button} from '@/components/ui/button';
import {Sheet, SheetClose, SheetContent, SheetTrigger, SheetTitle} from '@/components/ui/sheet';
import {useTranslation} from 'react-i18next';
import dog from '@/assets/avatar/dog.webp';
import {Headset, LogOut, LucideLineChart, Menu, User, Wallet, X} from 'lucide-react';
import {Link} from 'react-router-dom';
import {useState} from 'react';
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from '@/components/ui/accordion';

import '@/styles/Dashboard.css';
export function SheetSide() {
	const {t, i18n} = useTranslation();
	i18n.changeLanguage();
	const [sheetOpen, setSheetOpen] = useState(false);
	const [btnSelected, setBtnSelected] = useState('');

	const infoUser = localStorage.userMain ? JSON.parse(localStorage?.userMain) : '';

	function closeSession() {
		localStorage.removeItem('token');
		localStorage.removeItem('userMain');
		window.location.href = '/';
	}
	return (
		<Sheet open={sheetOpen}>
			<SheetTrigger asChild>
				<Button onClick={() => setSheetOpen(true)} className='border-none m-0 p-0 flex justify-center w-11 ' variant='black_outline'>
					<Menu className='w-full h-9' />
				</Button>
			</SheetTrigger>
			<SheetContent className='dark:bg-zinc-900 bg-zinc-200 w-60 md:w-72' aria-describedby={undefined} side='right'>
				<div className=' w-ful flex justify-end'>
					<SheetClose className='mr-3' onClick={() => setSheetOpen(false)}>
						<X />
					</SheetClose>
				</div>
				<SheetTitle className='hidden' />
				<div className='mt-10 flex flex-col h-full gap-3'>
					<div className=' flex flex-col items-center mb-5 border-b pb-3 border-blue-500 w-full'>
						<div className='bg-white p-5 rounded-full flex justify-center items-center'>
							<img className='' src={dog} width={50} alt='' />
						</div>

						<p className='capitalize text-lg font-semibold'>{infoUser.full_name}</p>
						<p className='dark:text-white/55 text-black/60'>{infoUser.email}</p>
					</div>

					<div className='overflow-y-auto scrollbar-custom'>
						<Accordion defaultValue={btnSelected} type='single' collapsible className='w-full px-2 flex flex-col gap-2'>
							<AccordionItem value='dashboard'>
								<AccordionTrigger>
									<div className='flex items-center gap-5'>
										<LucideLineChart className='rotation-180' />
										Dashboard
									</div>
								</AccordionTrigger>
								<AccordionContent className='flex flex-col gap-2 mt-3'>
									<Link className='visited:dark:bg-red-500' onClick={() => setSheetOpen(false)} to='dashboard'>
										<Button
											onClick={() => setBtnSelected('dashboard')}
											className={`w-full gap-4 justify-start py-6 bg-zinc-200 hover:bg-white dark:hover:bg-zinc-800 text-black dark:text-white ${
												btnSelected === 'dashboard' ? 'bg-white dark:bg-zinc-800' : 'bg-transparent'
											}`}>
											Dashboard
										</Button>
									</Link>
								</AccordionContent>
							</AccordionItem>
							<AccordionItem value='profile'>
								<AccordionTrigger>
									<div className='flex items-center gap-5'>
										<User />

										{t('sheetside.account')}
									</div>
								</AccordionTrigger>
								<AccordionContent className='flex flex-col gap-2 mt-3'>
									<Link to='/profile' onClick={() => setSheetOpen(false)}>
										<Button
											onClick={() => setBtnSelected('profile')}
											className={`w-full gap-4 justify-start py-6 bg-zinc-200 hover:bg-white dark:hover:bg-zinc-800 text-black dark:text-white ${
												btnSelected === 'profile' ? 'bg-white dark:bg-zinc-800' : 'bg-transparent'
											}`}>
											{t('sheetside.profile')}
										</Button>
									</Link>
								</AccordionContent>
							</AccordionItem>
							<AccordionItem value='wallet'>
								<AccordionTrigger>
									<div className='flex items-center gap-5'>
										<Wallet />
										{t('sheetside.wallet')}
									</div>
								</AccordionTrigger>
								<AccordionContent className='flex flex-col gap-2 mt-3'>
									<Link onClick={() => setSheetOpen(false)} to='wallet'>
										<Button
											onClick={() => setBtnSelected('wallet')}
											className={`w-full gap-4 justify-start py-6 bg-zinc-200 hover:bg-white dark:hover:bg-zinc-800 text-black dark:text-white ${
												btnSelected === 'wallet' ? 'bg-white dark:bg-zinc-800' : 'bg-transparent'
											}`}>
											{t('sheetside.wallet')}
										</Button>
									</Link>
								</AccordionContent>
							</AccordionItem>
						</Accordion>

						<div className='absolute bottom-0 w-full'>
							<Button
								className='w-full gap-4 justify-start py-6 bg-transparent hover:bg-white dark:hover:bg-zinc-800 text-black dark:text-white'
								onClick={() => {
									closeSession();
								}}>
								<LogOut />
								{t('sheet.button.signOut')}
							</Button>
							<Button className='gap-2 w-full py-6 bg-transparent hover:bg-white dark:hover:bg-zinc-800 text-black dark:text-white'>
								<Headset />
								{t('sheetside.help')}
							</Button>
						</div>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}
