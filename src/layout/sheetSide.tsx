import { Button } from '@/components/ui/button';
import { Sheet, SheetClose, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { useTranslation } from 'react-i18next';
import dog from '@/assets/avatar/dog.webp';
import logo from '/images/logo.png';
import { DollarSign, HandCoins, Headset, LogOut, LucideLineChart, Menu, Pencil, PiggyBank, User, Wallet, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

import '@/styles/Dashboard.css';
export function SheetSide() {
	const { t, i18n } = useTranslation();
	i18n.changeLanguage();
	const [sheetOpen, setSheetOpen] = useState(false);
	const [btnSelected, setBtnSelected] = useState('dashboard');

	const infoUser = localStorage.userMain ? JSON.parse(localStorage?.userMain) : '';

	function closeSession() {
		localStorage.removeItem('token');
		localStorage.removeItem('userMain');
		window.location.href = '/';
	}
	return (
		<Sheet open={sheetOpen}>
			<SheetTrigger asChild>
				<Button
					onClick={() => setSheetOpen(true)}
					className='border-none m-0 p-0 flex justify-center w-11 '
					variant='black_outline'>
					<Menu className='w-full h-9' />
				</Button>
			</SheetTrigger>
			<SheetContent
				className='dark:bg-dark_primary_color bg-zinc-200 w-60 md:w-72'
				aria-describedby={undefined}
				side='right'>
				<div className=' w-ful flex justify-between'>
					<Button
						variant='ghost'
						onClick={() => {
							closeSession();
						}}>
						<LogOut />
					</Button>
					<SheetClose
						className='mr-3'
						onClick={() => setSheetOpen(false)}>
						<X />
					</SheetClose>
				</div>
				<SheetTitle className='hidden' />
				<div className='mt-10 flex flex-col h-full gap-3'>
					<div className=' flex flex-col items-center mb-5 border-b pb-3 border-green-500 w-full'>
						<div className='bg-white p-5 rounded-full flex justify-center items-center'>
							<img
								className=''
								src={dog}
								width={50}
								alt=''
							/>
						</div>

						<p className='capitalize text-lg font-semibold'>{infoUser.full_name}</p>
						<p className='dark:text-white/55 text-black/60'>{infoUser.email}</p>
					</div>

					<Accordion
						defaultValue={btnSelected}
						type='single'
						collapsible
						className='w-full px-2 flex flex-col gap-2 scrollbar-custom md:h-[375px] h-80'>
						<AccordionItem value='dashboard'>
							<AccordionTrigger>
								<div className='flex items-center gap-5'>
									<LucideLineChart className='rotation-180' />
									Dashboard
								</div>
							</AccordionTrigger>
							<AccordionContent className='flex flex-col gap-2 pl-5 mt-3'>
								<Link
									className='visited:dark:bg-red-500'
									onClick={() => setSheetOpen(false)}
									to='dashboard'>
									<Button
										onClick={() => setBtnSelected('dashboard')}
										className={`w-full gap-4 justify-start py-6 bg-zinc-200 hover:bg-white dark:hover:bg-hover_primary_color text-black dark:text-white ${
											btnSelected === 'dashboard' ? 'bg-white bg-gradient-to-b dark:from-[#0e1a12] dark:to-[#146c21]' : 'bg-transparent'
										}`}>
										<LucideLineChart className='rotation-180' />
										Dashboard
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

							<AccordionContent className='flex flex-col gap-2 pl-5 mt-3'>
								<Link
									onClick={() => setSheetOpen(false)}
									to='wallet/expenses'>
									<Button
										onClick={() => setBtnSelected('expenses')}
										className={`w-full gap-4 justify-start py-6 bg-zinc-200 hover:bg-white dark:hover:bg-hover_primary_color text-black dark:text-white ${
											btnSelected === 'expenses' ? 'bg-white bg-gradient-to-b dark:from-[#0e1a12] dark:to-[#1a862a]' : 'bg-transparent'
										}`}>
										<DollarSign />
										{t('sheetside.wallet.expenses')}
									</Button>
								</Link>
							</AccordionContent>
							<AccordionContent className='flex flex-col gap-2 pl-5'>
								<Link
									onClick={() => setSheetOpen(false)}
									to='wallet/debts'>
									<Button
										onClick={() => setBtnSelected('debts')}
										className={`w-full gap-4 justify-start py-6 bg-zinc-200 hover:bg-white dark:hover:bg-hover_primary_color text-black dark:text-white ${
											btnSelected === 'debts' ? 'bg-white bg-gradient-to-b dark:from-[#0e1a12] dark:to-[#1a862a]' : 'bg-transparent'
										}`}>
										<HandCoins />
										{t('sheetside.wallet.debts')}
									</Button>
								</Link>
							</AccordionContent>
							<AccordionContent className='flex flex-col gap-2 pl-5'>
								<Link
									onClick={() => setSheetOpen(false)}
									to='wallet/incomes'>
									<Button
										onClick={() => setBtnSelected('incomes')}
										className={`w-full gap-4 justify-start py-6 bg-zinc-200 hover:bg-white dark:hover:bg-hover_primary_color text-black dark:text-white ${
											btnSelected === 'incomes' ? 'bg-white bg-gradient-to-b dark:from-[#0e1a12] dark:to-[#1a862a]' : 'bg-transparent'
										}`}>
										<PiggyBank />
										{t('sheetside.wallet.incomes')}
									</Button>
								</Link>
							</AccordionContent>
							<AccordionContent className='flex flex-col gap-2 pl-5'>
								<Link
									onClick={() => setSheetOpen(false)}
									to='wallet'>
									<Button
										onClick={() => setBtnSelected('wallet')}
										className={`w-full gap-4 justify-start py-6 bg-zinc-200 hover:bg-white dark:hover:bg-hover_primary_color text-black dark:text-white ${
											btnSelected === 'wallet' ? 'bg-white bg-gradient-to-b dark:from-[#0e1a12] dark:to-[#1a862a]' : 'bg-transparent'
										}`}>
										<Pencil />
										{t('sheetside.wallet.editWallet')}
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
							<AccordionContent className='flex flex-col gap-2 pl-5 mt-3'>
								<Link
									to='/profile'
									onClick={() => setSheetOpen(false)}>
									<Button
										onClick={() => setBtnSelected('profile')}
										className={`w-full gap-4 justify-start py-6 bg-zinc-200 hover:bg-white dark:hover:bg-hover_primary_color text-black dark:text-white ${
											btnSelected === 'profile' ? 'bg-white bg-gradient-to-b dark:from-[#0e1a12] dark:to-[#1a862a]' : 'bg-transparent'
										}`}>
										<User />
										{t('sheetside.account.profile')}
									</Button>
								</Link>
							</AccordionContent>
						</AccordionItem>
						
						<AccordionItem value='help'>
							<AccordionTrigger>
								<div className='flex items-center gap-5 '>
									<User />
									{t('sheetside.suport')}
								</div>
							</AccordionTrigger>
							<AccordionContent className='flex flex-col gap-2  pl-5 mt-3'>
								<Link
									to='/support/help'
									onClick={() => setSheetOpen(false)}>
									<Button
										className={`w-full gap-4 justify-start py-6 bg-zinc-200 hover:bg-white dark:hover:bg-hover_primary_color text-black dark:text-white ${
											btnSelected === 'help' ? 'bg-white bg-gradient-to-b dark:from-[#0e1a12] dark:to-[#1a862a]' : 'bg-transparent'
										}`}>
										<Headset />
										{t('sheetside.suport.help')}
									</Button>
								</Link>
							</AccordionContent>
						</AccordionItem>
					</Accordion>
					<div className='flex items-start justify-center w-full   absolute -bottom-4'>
						<img
							className='w-28 md:h-auto h-28  '
							src={logo}
							alt=''
						/>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}
