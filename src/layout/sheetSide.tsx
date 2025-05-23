import { Button } from '@/components/ui/button';

import { useTranslation } from 'react-i18next';
import {
	ChevronDown,
	DollarSign,
	HandCoins,
	LogOut,
	LucideHelpCircle,
	LucideLineChart,
	PiggyBank,
	User,
	Wallet,
	UserCog,
	UserRoundPen,
} from 'lucide-react';
import { Link } from 'react-router-dom';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuSub, SidebarTrigger } from '@/components/ui/sidebar';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu';

export function SheetSide() {
	const { t, i18n } = useTranslation();
	i18n.changeLanguage();

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
			variant='floating'
			className={`z-50    `}>
			<SidebarContent className='dark:bg-dark_primary_color bg-light_primary_color  rounded-xl  '>
				<div className=' w-full flex justify-end mt-3'>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant='ghost'>
								<UserCog className='dark:text-white text-black cursor-pointer' />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className='p-2 w-36  dark:bg-dark_foreground  bg-light_foreground rounded-md dark:text-white text-black '>
							<DropdownMenuLabel className='flex items-center font-bold h-9 border-b-2 border-zinc-500 '>My Account</DropdownMenuLabel>
							<DropdownMenuGroup>
								<Link
									className=''
									to='/profile'>
									<DropdownMenuItem className='  flex w-full   rounded-sm pl-2 my-1 items-center h-9  hover:bg-light_secondary_color dark:hover:bg-dark_secondary_color cursor-pointer'>
										<SidebarTrigger className='md:hidden flex w-full  justify-start rounded-sm my-1 items-center h-9  dark:hover:bg-dark_secondary_color cursor-pointer hover:bg-light_secondary_color'>
											<UserRoundPen />
											Profile
										</SidebarTrigger>
										<UserRoundPen className='mr-2 hidden md:flex' />
										<span className=' hidden md:flex'>Profile</span>
									</DropdownMenuItem>
								</Link>
								<DropdownMenuItem
									onClick={() => closeSession()}
									className=' flex w-full   rounded-sm pl-2 my-1 items-center h-9  hover:bg-light_secondary_color dark:hover:bg-dark_secondary_color cursor-pointer'>
									<LogOut className='mr-2' />
									Log out
								</DropdownMenuItem>
							</DropdownMenuGroup>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				<div className='mt-10 flex flex-col h-full gap-3 overflow-hidden'>
					<div className=' flex flex-col items-center mb-5 border-b pb-3 border-lime-500 w-full'>
						<div className=' rounded-full flex justify-center items-center'>
							<img
								src={infoUser.icon ?? 'https://api.dicebear.com/9.x/thumbs/svg?radius=0&seed=custom-seed'}
								alt='avatar'
								className='w-28 h-28 rounded-full'
							/>
						</div>

						<p className='capitalize text-lg font-semibold dark:text-white text-black'>{infoUser.full_name}</p>
						<p className='dark:text-white/55 text-black/60'>{infoUser.email}</p>
					</div>
					<SidebarMenu className='w-full px-2 flex flex-col gap-2 scrollbar-custom  h-3/5  overflow-y-auto'>
						{pages.map((page, i) => (
							<Collapsible
								key={i}
								className='group/collapsible'
								defaultOpen={localStorage.route_name.includes(page.path)}>
								<SidebarGroup>
									<SidebarGroupLabel asChild>
										<CollapsibleTrigger className='cursor-pointer'>
											<div className='flex items-center gap-5  '>
												<p className='text-sm font-semibold dark:text-white text-black opacity-50'>{page.icon}</p>
												<p className='text-sm font-semibold dark:text-white text-black opacity-50'>{page.name}</p>
											</div>
											<ChevronDown className='ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180 dark:text-white text-black ' />
										</CollapsibleTrigger>
									</SidebarGroupLabel>
									<CollapsibleContent
										key={i}
										className='flex flex-col gap-2 mt-3'>
										<SidebarMenuSub>
											{page.children.map((child, i) => (
												<Link
													key={i}
													to={child.path}>
													<SidebarTrigger
														className={`md:hidden w-full gap-4 justify-start py-6 dark:text-white text-black cursor-pointer ${
															localStorage.route_name === child.path
																? 'bg-alternative_color text-white '
																: 'bg-transparent dark:hover:bg-dark_secondary_color hover:bg-light_secondary_color'
														}`}>
														<p className='ml-6'>{child.icon}</p>
														<p>{child.name}</p>
													</SidebarTrigger>

													<Button
														className={`hidden md:flex w-full gap-4 justify-start py-6 dark:text-white text-black cursor-pointer ${
															localStorage.route_name === child.path
																? 'bg-alternative_color text-white '
																: 'bg-transparent dark:hover:bg-dark_secondary_color hover:bg-light_secondary_color'
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
				</div>
			</SidebarContent>
		</Sidebar>
	);
}
