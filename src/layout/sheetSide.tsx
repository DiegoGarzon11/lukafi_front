import { Button } from '@/components/ui/button';

import { useTranslation } from 'react-i18next';
import dog from '@/assets/avatar/dog.webp';
import logo from '/images/logo.png';
import {
	ChevronDown,
	DollarSign,
	HandCoins,
	LogOut,
	LucideHelpCircle,
	LucideLineChart,
	LucidePencil,
	PiggyBank,
	User,
	Wallet,
	UserCog,
	UserRoundPen,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuSub } from '@/components/ui/sidebar';

import '@/styles/Dashboard.css';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu';
import { DropdownMenuShortcut } from '@/components/ui/dropdown-menu';
export function SheetSide() {
	const { t, i18n } = useTranslation();
	i18n.changeLanguage();

	const [btnSelected, setBtnSelected] = useState('dashboard');

	const infoUser = localStorage.userMain ? JSON.parse(localStorage?.userMain) : '';

	function closeSession() {
		localStorage.removeItem('token');
		localStorage.removeItem('userMain');
		window.location.href = '/';
	}
	const pages = [
		{
			name: 'Dashboard',
			icon: <LucideLineChart />,
			path: '/dashboard',
			children: [
				{
					name: 'Dashboard',
					icon: <LucideLineChart />,
					path: '/dashboard',
				},
			],
		},
		{
			name: t('sheetside.wallet') as string,
			icon: <Wallet />,
			path: '/wallet',
			children: [
				{
					name: t('sheetside.wallet.expenses') as string,
					icon: <DollarSign />,
					path: '/wallet/expenses',
				},
				{
					name: t('sheetside.wallet.debts') as string,
					icon: <HandCoins />,
					path: '/wallet/debts',
				},
				{
					name: t('sheetside.wallet.incomes') as string,
					icon: <PiggyBank />,
					path: '/wallet/incomes',
				},
				{
					name: t('sheetside.wallet.editWallet') as string,
					icon: <LucidePencil />,
					path: '/wallet',
				},
			],
		},

		{
			name: t('sheetside.suport') as string,
			icon: <User />,
			path: '/support/help',
			children: [
				{
					name: t('sheetside.suport.help') as string,
					icon: <LucideHelpCircle />,
					path: '/help',
				},
			],
		},
	];
	return (
		<Sidebar
			variant='sidebar'
			className={`z-50  bg-zinc-200  min-w-28 `}>
			<SidebarContent className='dark:bg-dark_primary_color bg-zinc-200 border border-border'>
				<div className=' w-full flex justify-end mt-3'>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant='ghost'>
								<UserCog />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className='p-2 w-36  dark:bg-dark_primary_color border border-border rounded-md  '>
							<DropdownMenuLabel className='flex items-center font-bold h-9 border-b-2 border-zinc-500 '>My Account</DropdownMenuLabel>
							<DropdownMenuGroup>
								<DropdownMenuItem className='flex w-full   rounded-sm pl-2 my-1 items-center h-9  hover:dark:bg-zinc-900 cursor-pointer'>
									<UserRoundPen className='mr-2' />
									Profile
								</DropdownMenuItem>
							</DropdownMenuGroup>
							<DropdownMenuItem
								onClick={() => closeSession()}
								className=' flex w-full   rounded-sm pl-2 my-1 items-center h-9  hover:dark:bg-zinc-900 cursor-pointer'>
								<LogOut className='mr-2' />
								Log out
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

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
					<SidebarMenu className='w-full px-2 flex flex-col gap-2 scrollbar-custom  h-[400px] '>
						{pages.map((page, i) => (
							<Collapsible className='group/collapsible'>
								<SidebarGroup>
									<SidebarGroupLabel asChild>
										<CollapsibleTrigger>
											<div className='flex items-center gap-5 '>
												<p className='text-sm font-semibold'>{page.icon}</p>
												<p className='text-sm font-semibold'>{page.name}</p>
											</div>
											<ChevronDown className='ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180' />
										</CollapsibleTrigger>
									</SidebarGroupLabel>
									<CollapsibleContent
										key={i}
										className='flex flex-col gap-2 pl-5 mt-3'>
										<SidebarMenuSub>
											{page.children.map((child) => (
												<Link
													key={child.path}
													className='visited:dark:bg-red-500'
													to={child.path}>
													<Button
														onClick={() => setBtnSelected(child.path)}
														className={`w-full gap-4 justify-start py-6 bg-zinc-200 hover:bg-white dark:hover:bg-hover_primary_color text-black dark:text-white ${
															btnSelected === child.path
																? 'bg-white bg-gradient-to-b dark:from-[#0e1a12] dark:to-[#146c21]'
																: 'bg-transparent'
														}`}>
														{child.icon}
														{child.name}
													</Button>
												</Link>
											))}
										</SidebarMenuSub>
									</CollapsibleContent>
								</SidebarGroup>
							</Collapsible>
						))}
					</SidebarMenu>
					<div className='flex items-start justify-center w-full   absolute -bottom-4'>
						<img
							className='w-28 md:h-auto h-28  '
							src={logo}
							alt=''
						/>
					</div>
				</div>
			</SidebarContent>
		</Sidebar>
	);
}
