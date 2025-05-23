import { Expenses, ResponseWallet } from '@/interfaces/Wallet';

import { TooltipComponent } from '@/components/others/Tooltip';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { Edit, EllipsisVertical, Search, Trash } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DeleteFixedExpense, EditFixedExpenses, GetExpenses, GetFixedExpenses, PayFixedExpense, ResetDeadLine } from '@/apis/ExpenseService';
import { GetWalletUser } from '@/apis/WalletService';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { ApiResponse } from '@/interfaces/Api';
import { LoaderApi } from '@/assets/icons/Svg';
import { Toast } from '@/hooks/Toast';
import { AddExpense } from './AddExpense';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { LoaderComponent } from '@/components/others/Loader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination';

export const SeeExpenses = () => {
	const [fixedExpenses, setFixedExpenses] = useState<Array<Expenses> | undefined>(undefined);
	const [fixedExpenseToEdit, setFixedExpenseToEdit] = useState<Expenses | undefined>(undefined);
	const [expenses, setExpenses] = useState<Array<Expenses> | undefined>([]);
	const [userData, setDataUser] = useState<ResponseWallet | undefined>(undefined);
	const [trigger, setTrigger] = useState(0);
	const [openModalEditFixedExpenses, setOpenModalEditFixedExpenses] = useState(false);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [amount, setAmount] = useState('');
	const [expenseToDelete, setExpenseToDelete] = useState<Expenses | undefined>(undefined);
	const [payEach, setPayEach] = useState(null);
	const [ApiResponse, setApiResponse] = useState<ApiResponse | undefined>(null);
	const [visibilityToast, setVisibilityToast] = useState(false);
	const [loader, setLoader] = useState(false);
	const [fetching, setFetching] = useState(true);
	const [tab, setTab] = useState('variable');
	const [search, setSearch] = useState('');
	const [searchFixed, setSearchFixed] = useState('');
	const days = Array.from({ length: 31 }, (_, i) => i + 1);

	const { t, i18n } = useTranslation();
	i18n.changeLanguage();
	const user = JSON.parse(localStorage.getItem('userMain'));

	useEffect(() => {
		const fetchData = async () => {
			const dataUser = await GetWalletUser(user?.user_id);
			setDataUser(dataUser);
			const fixedExpenses = await GetFixedExpenses(dataUser.wallet);
			setFixedExpenses(fixedExpenses?.expenses);
			setFetching(false);
		};

		fetchData();
	}, []);

	const getExpenses = async (walletId) => {
		const expenses = await GetExpenses(walletId);

		setExpenses(expenses?.expenses);
	};
	const newDeadLine = async (walletId, expenseId) => {
		const params = {
			wallet_id: walletId,
			expense_id: expenseId,
		};
		await ResetDeadLine(params);
		getExpenses(walletId.wallet_id);
	};
	const payExpense = async (expense) => {
		const params = {
			wallet_id: expense.wallet_id,
			expense_id: expense.expense_id,
		};
		const response = await PayFixedExpense(params);
		setTrigger((prev) => prev + 1);

		if (!response) {
			return;
		}
		setVisibilityToast(true);
		setApiResponse(response);
		getExpenses(userData.wallet);
		setTimeout(() => {
			setVisibilityToast(false);
			setApiResponse(null);
		}, 1000);
	};
	const handlePayEach = (e) => {
		setPayEach(e);
	};

	const getFixedExpenses = async (walletId) => {
		const fixedExpenses = await GetFixedExpenses(walletId);
		setFixedExpenses(fixedExpenses?.expenses);
	};
	const handleSearch = async (type: string) => {
		setLoader(true);

		let params = {
			wallet_id: userData.wallet.wallet_id,
			search,
		};
		if (type === 'variable') {
			params.search = search;
			const expensesFound = await GetExpenses(params);

			setExpenses(expensesFound?.expenses);
			setLoader(false);
		}
		params.search = searchFixed;
		const fixedExpensesFound = await GetFixedExpenses(params);

		setFixedExpenses(fixedExpensesFound?.expenses);
		setLoader(false);
	};
	const handleValues = (e) => {
		let value = e.target.value.replace(/[^0-9.]/g, '');
		if (value === '') {
			value = 0;
		}

		const floatValue = parseFloat(value);
		const formattedValue = floatValue.toLocaleString();

		setAmount(formattedValue);
		return;
	};
	const recibeResponseChild = async (e) => {
		if (e) {
			return setTrigger((prev) => prev + 1);
		}
	};
	useEffect(() => {
		if (userData?.wallet?.wallet_id) {
			const fetchExpensesAndDebts = async () => {
				const fixedExpenses = await GetFixedExpenses(userData.wallet);
				setFixedExpenses(fixedExpenses?.expenses);

				for (let i = 0; i < fixedExpenses?.expenses.length; i++) {
					const defaultDeadLine = new Date(fixedExpenses?.expenses[i].dead_line);

					const diferenceBetweenDates = difrenceBeetwenDate(defaultDeadLine);
					if (diferenceBetweenDates <= 30 && fixedExpenses?.expenses[i].is_paid === true) {
						newDeadLine(userData.wallet.wallet_id, fixedExpenses?.expenses[i].expense_id);
					}
				}

				getExpenses(userData.wallet);
			};

			fetchExpensesAndDebts();
		}
	}, [userData, trigger]);

	const deleteExpense = async (e) => {
		setLoader(true);
		setVisibilityToast(false);

		const params = {
			expense_id: e?.expense_id,
			wallet_id: e?.wallet_id,
		};
		try {
			const responseDeleteExpense = await DeleteFixedExpense(params);
			setApiResponse(responseDeleteExpense);
			getFixedExpenses(params);
		} catch (error) {
			console.error(error);
		} finally {
			setVisibilityToast(true);
			setLoader(false);
			setOpenDeleteDialog(false);
			setExpenseToDelete(null);
			setTimeout(() => {
				setVisibilityToast(false);
				setApiResponse(null);
			}, 1000);
		}
	};

	const submitEditFixedExpenses = async () => {
		const params = {
			wallet_id: fixedExpenseToEdit.wallet_id,
			expense_id: fixedExpenseToEdit.expense_id,
			value: amount.replace(/,/g, ''),
			pay_each: payEach === null ? fixedExpenseToEdit.pay_each : payEach,
			dead_line: fixedExpenseToEdit.dead_line,
		};
		const response = await EditFixedExpenses(params);
		if (response) {
			setApiResponse(response);
			getFixedExpenses(userData.wallet);
			setOpenModalEditFixedExpenses(false);
		}
		setTimeout(() => {
			setVisibilityToast(false);
			setApiResponse(null);
		}, 1000);
	};
	function difrenceBeetwenDate(deadline: Date) {
		const currentTime: Date = new Date();
		const differenceInTime: number = deadline.getTime() - currentTime.getTime();
		const differenceInDays: number = Math.ceil(differenceInTime / (1000 * 60 * 60 * 24));
		return differenceInDays;
	}
	const keyEnter = (e, type: string) => {
		if (e.key === 'Enter' && type === 'variable') {
			handleSearch('variable');
		} else if (e.key === 'Enter' && type === 'fixed') {
			handleSearch('fixed');
		}
	};
	if (fetching) {
		return <LoaderComponent />;
	}
	return (
		<main className='pt-20 px-3   '>
			<nav className='flex w-full justify-between items-center mb-5 dark:text-white '>
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink className='text-base'>Billetera</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage className='text-base'>Gastos</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>

				<AddExpense
					className='md:w-1/5 w-1/2 border border-border'
					sendData={(e) => recibeResponseChild(e)}
					apiData={userData?.wallet}
				/>
			</nav>
			<section className=' shadow-xs  md:col-span-3 md:row-span-2  '>
				<div className=' w-full  flex flex-col  justify-between gap-5 order-3 '>
					<Tabs
						defaultValue='variable'
						className='w-full'>
						<TabsList className='flex  dark:bg-dark_secondary_color bg-light_secondary_color  w-full mb-3'>
							<TabsTrigger
								onClick={() => {
									setTab('variable');
								}}
								value='variable'
								className={`${tab === 'variable' ? 'bg-alternative_color text-white' : ' '} dark:text-white  cursor-pointer`}>
								Gastos
							</TabsTrigger>
							<TabsTrigger
								onClick={() => {
									setTab('fixed');
								}}
								value='fixed'
								className={`${tab === 'fixed' ? 'bg-alternative_color text-white' : ' '} dark:text-white  cursor-pointer`}>
								Gastos Fijos
							</TabsTrigger>
						</TabsList>

						<TabsContent value='variable'>
							<div className='dark:bg-dark_primary_color bg-light_primary_color p-3 w-full  rounded-xl '>
								<div className='flex gap-3 flex-col  items-start'>
									<h5 className='text-2xl dark:text-white'> {t('dashboard.allExpenses')} </h5>
									<div className=' w-full my-3 flex flex-col md:flex-row items-end md:items-center gap-3 '>
										<div className='flex justify-between   rounded-md w-full  dark:bg-dark_foreground bg-light_foreground'>
											<Input
												onChange={(e) => {
													setSearch(e.target.value);
												}}
												onKeyDown={(e) => keyEnter(e, 'variable')}
												value={search}
												placeholder='Buscar nombre'
												className=' dark:text-white   '
											/>
											<Button
												onClick={() => handleSearch('variable')}
												className='text-white bg-alternative_color h-full w-1/4 md:sw-1/12 cursor-pointer '>
												<Search />
											</Button>
										</div>

										<Button
											disabled
											className='text-white bg-alternative_color h-full w-1/2 md:w-1/5 '>
											Filtros
										</Button>
									</div>
								</div>

								<div className='w-full'>
									<section className='w-full '>
										<article className=' flex text-base font-semibold py-4 dark:text-zinc-300 text-slate-500 border-b border-gray-600/50 mb-3'>
											<p className='w-full text-start'>{t('dashboard.date')}</p>
											<p className='w-full text-start'>{t('dashboard.name')}</p>
											<p className='w-full text-start'>{t('dashboard.value')}</p>
										</article>
									</section>

									<div className='w-full h-[calc(100dvh-460px)] max-h-screen overflow-auto scrollbar-custom'>
										<Table className='w-full dark:text-white'>
											{loader ? (
												<div className='flex justify-center items-center w-full h-full mt-20'> 
													<LoaderApi  />
												</div>
											) : (
												<TableBody>
													{expenses?.map((e) =>
														e.is_paid ? (
															<TableRow
																className='border-b pb-2 border-gray-600/20'
																key={e?.expense_id}>
																<TableCell className='font-medium  w-full'>
																	<p>{format(new Date(e?.created_in), 'PP')}</p>
																</TableCell>
																<TableCell className='font-medium w-full hidden md:block'>
																	{e?.name.length >= 20 ? (
																		<TooltipComponent
																			message={`${e?.name.slice(0, 20)}...`}
																			content={e?.name}
																		/>
																	) : (
																		<p>{e?.name}</p>
																	)}
																</TableCell>
																<TableCell className='font-medium w-full block md:hidden'>
																	{e?.name.length >= 8 ? (
																		<TooltipComponent
																			message={`${e?.name.slice(0, 8)}...`}
																			content={e?.name}
																		/>
																	) : (
																		<p>{e?.name}</p>
																	)}
																</TableCell>
																<TableCell className='font-medium w-full'>
																	<p>$ {e?.value.toLocaleString()}</p>
																</TableCell>
															</TableRow>
														) : (
															''
														)
													)}
												</TableBody>
											)}
										</Table>
									</div>
									<Pagination className='mt-5 dark:bg-dark_primary_color bg-light_primary_color dark:text-white'>
										<PaginationContent>
											<PaginationItem>
												<PaginationPrevious href='#' />
											</PaginationItem>
											<PaginationItem>
												<PaginationLink href='#'>1</PaginationLink>
											</PaginationItem>
											<PaginationItem>
												<PaginationEllipsis />
											</PaginationItem>
											<PaginationItem>
												<PaginationNext href='#' />
											</PaginationItem>
										</PaginationContent>
									</Pagination>
								</div>
							</div>
						</TabsContent>
						<TabsContent value='fixed'>
							<div className='dark:bg-dark_primary_color bg-light_primary_color p-3 w-full  rounded-xl'>
								<div className='flex gap-3 flex-col items-start '>
									<h5 className='text-2xl dark:text-white'> {t('dashboard.allFixedExpenses')} </h5>
									<div className=' w-full my-3 flex flex-col md:flex-row items-end md:items-center gap-3 '>
										<div className='flex justify-between   rounded-md w-full  dark:bg-dark_foreground bg-light_foreground'>
											<Input
												onChange={(e) => {
													setSearchFixed(e.target.value);
												}}
												value={searchFixed}
												onKeyDown={(e) => keyEnter(e, 'fixed')}
												placeholder='Buscar nombre'
												className=' dark:text-white   '
											/>
											<Button
												onClick={() => handleSearch('fixed')}
												className='text-white bg-alternative_color h-full w-1/4 md:sw-1/12 cursor-pointer '>
												<Search />
											</Button>
										</div>

										<Button
											disabled
											className='text-white bg-alternative_color h-full w-1/2 md:w-1/5 '>
											Filtros
										</Button>
									</div>
								</div>
								<div className='w-full '>
									<section className='w-full '>
										<article className=' flex text-base justify-center items-center font-semibold py-4 dark:text-zinc-300 text-slate-500 border-b border-gray-600/50 mb-3  gap-5 pl-3  '>
											<p className='w-full text-start   '>{t('dashboard.name')}</p>
											<p className='w-full text-start'>{t('dashboard.value')}</p>
											<p className='w-full text-start hidden md:block'>{t('dashboard.payEach')}</p>
											<p className='w-full text-start  text-nowrap '> {t('dashboard.nextPayment')} </p>
											<p className='w-full text-start ' />
											<p className='w-full text-start ' />
										</article>
									</section>

									<div className='w-full h-[calc(100dvh-460px)] max-h-screen overflow-auto scrollbar-custom'>
										<Table className='w-full'>
											{loader ? (
												<div className='flex justify-center items-center w-full h-full mt-20'> 
												<LoaderApi  />
												</div>
											) : (
												<TableBody>
													{fixedExpenses?.map((f) => (
														<TableRow
															key={f.expense_id}
															className='border-b pb-2 border-gray-600/20 dark:text-white'>
															<TableCell className='font-medium w-full '>{f.name}</TableCell>
															<TableCell className='font-medium w-full '>$ {f.value.toLocaleString()}</TableCell>
															<TableCell className='font-medium w-full hidden md:block '>
																<span className='font-bold'>{f.pay_each} </span> {t('dashboard.ofEachMonth')}
															</TableCell>
															<TableCell className='font-medium w-full flex flex-col  '>
																<span
																	className={`font-semibold hidden md:block ${
																		difrenceBeetwenDate(new Date(f?.dead_line)) <= 5 ? 'text-red-500' : 'text-black dark:text-white'
																	} `}>
																	{format(f?.dead_line, 'PP')}
																</span>
																<span
																	className={`font-semibold  ${
																		difrenceBeetwenDate(new Date(f?.dead_line)) <= 5 ? 'text-red-500' : 'text-black dark:text-white'
																	} `}>
																	<span className='opacity-70'>
																		({difrenceBeetwenDate(new Date(f?.dead_line))} {t('dashboard.day')}s)
																	</span>
																</span>
															</TableCell>
															<TableCell className='font-medium w-full  '>
																<Dialog>
																	<DialogTrigger
																		className={`${
																			f.is_paid ? 'bg-transparent text-blue-500' : '  bg-main_color cursor-pointer text-white'
																		} rounded-md p-1 w-full`}>
																		{f.is_paid ? `${t('dashboard.alreadyPaid')}` : `${t('dashboard.pay')}`}
																	</DialogTrigger>
																	{!f.is_paid && (
																		<DialogContent
																			aria-describedby='modal'
																			className=' w-[95%] md:w-[500px] flex justify-center rounded-md dark:bg-dark_secondary_color bg-light_secondary_color dark:text-white'>
																			<DialogHeader>
																				<DialogTitle className='text-start'>
																					{t('dashboard.confirm')} {t('dashboard.payment')} {t('dashboard.monthlyExpense')}
																					<span className='text-main_color font-semibold'> {f.name}</span>?
																				</DialogTitle>
																				<DialogDescription className='flex justify-center gap-5 h-full mt-5 '>
																					<DialogClose className='bg-red-500 text-white cursor-pointer rounded-md px-5'>
																						{t('dashboard.cancel')}
																					</DialogClose>
																					<Button
																						className='bg-alternative_color text-white cursor-pointer '
																						onClick={() => payExpense(f)}>
																						{t('dashboard.confirm')}
																					</Button>
																				</DialogDescription>
																			</DialogHeader>
																		</DialogContent>
																	)}
																</Dialog>
															</TableCell>

															<TableCell className='font-medium   w-auto md:w-full text-end md:text-center   '>
																<DropdownMenu>
																	<DropdownMenuTrigger className='cursor-pointer'>
																		<EllipsisVertical />
																	</DropdownMenuTrigger>
																	<DropdownMenuContent className='dark:bg-dark_secondary_color bg-light_secondary_color dark:text-white'>
																		<DropdownMenuSeparator />
																		<DropdownMenuItem
																			onClick={() => {
																				setOpenModalEditFixedExpenses(true);
																				setFixedExpenseToEdit(f);
																			}}
																			className='dark:hover:bg-zinc-700 cursor-pointer'>
																			<p>{t('dashboard.edit')}</p>
																			<Button
																				variant='ghost'
																				className='w-full flex justify-end cursor-pointer'>
																				<Edit className={'w-6 '} />
																			</Button>
																		</DropdownMenuItem>
																		<DropdownMenuItem
																			onClick={() => {
																				setOpenDeleteDialog(true);
																				setExpenseToDelete(f);
																			}}
																			className='dark:hover:bg-zinc-700 cursor-pointer'>
																			<p>{t('dashboard.delete')}</p>
																			<Button
																				variant='ghost'
																				className='w-full flex justify-end cursor-pointer'>
																				<Trash className={'w-6'} />
																			</Button>
																		</DropdownMenuItem>
																	</DropdownMenuContent>
																</DropdownMenu>
															</TableCell>
														</TableRow>
													))}
												</TableBody>
											)}
										</Table>
									</div>
									<Pagination className='mt-5 dark:bg-dark_primary_color bg-light_primary_color dark:text-white'>
										<PaginationContent>
											<PaginationItem>
												<PaginationPrevious href='#' />
											</PaginationItem>
											<PaginationItem>
												<PaginationLink href='#'>1</PaginationLink>
											</PaginationItem>
											<PaginationItem>
												<PaginationEllipsis />
											</PaginationItem>
											<PaginationItem>
												<PaginationNext href='#' />
											</PaginationItem>
										</PaginationContent>
									</Pagination>
								</div>
							</div>
						</TabsContent>
					</Tabs>
				</div>
			</section>
			{visibilityToast && (
				<Toast
					visibility={visibilityToast}
					severity={ApiResponse.success == true ? 'success' : 'error'}
					message={ApiResponse.message}
				/>
			)}
			<Dialog
				open={openDeleteDialog}
				onOpenChange={setOpenDeleteDialog}>
				<DialogContent
					aria-describedby={null}
					className=' w-full md:w-[500px] rounded-md dark:bg-dark_secondary_color bg-light_primary_color dark:text-white'>
					<DialogHeader>
						<DialogTitle className='my-3'>
							<p className='my-3 font-bold text-2xl'> {t('dashboard.confirmDelete')} </p>

							<p className='text-pretty text-lg'>
								{t('dashboard.removeExpense')} <span className='font-semibold text-main_color'>{expenseToDelete?.name}</span> ?
							</p>
						</DialogTitle>
						<DialogDescription className='flex justify-end items-end gap-5 h-full'>
							<Button
								className='w-full bg-red-500 text-white cursor-pointer'
								onClick={() => setOpenDeleteDialog(false)}>
								{t('dashboard.cancel')}
							</Button>

							<Button
								onClick={() => deleteExpense(expenseToDelete)}
								variant='ghost'
								className='w-full bg-alternative_color text-white cursor-pointer'>
								{loader ? <LoaderApi  /> : `${t('dashboard.delete')}`}
							</Button>
						</DialogDescription>
					</DialogHeader>
				</DialogContent>
			</Dialog>

			<Dialog
				open={openModalEditFixedExpenses}
				onOpenChange={setOpenModalEditFixedExpenses}>
				<DialogContent
					aria-describedby={null}
					className=' w-full md:w-[500px] rounded-md  dark:bg-dark_secondary_color bg-light_primary_color dark:text-white'>
					<DialogHeader>
						<DialogTitle className='my-3'>
							<p className='my-3 font-bold text-2xl text-center  py-3 dark:border-white border-black'>
								Modificar gasto fijo <span className='text-main_color'>{fixedExpenseToEdit?.name}</span>
							</p>
						</DialogTitle>
						<div className='flex flex-col justify-center gap-5 h-full '>
							<div>
								<label htmlFor=''>
									Valor a pagar <span className='text-red-500'>*</span>
								</label>
								<Input
									className=' dark:text-white'
									value={amount}
									onChange={handleValues}
								/>
							</div>
							<div className=' flex flex-wrap gap-x-3 items-center'>
								<p className=''>{t('addExpense.paymentDayP')} </p>
								<Select onValueChange={handlePayEach}>
									<SelectTrigger className=' w-32 bg-zinc-200 dark:bg-zinc-800 dark:text-white text-black border border-alternative_color'>
										<SelectValue placeholder={fixedExpenseToEdit?.pay_each} />
									</SelectTrigger>
									<SelectContent className='dark:bg-zinc-700'>
										<SelectGroup>
											<SelectLabel className='text-lg'>{t('dashboard.day')}</SelectLabel>
											{days.map((e, i) => (
												<SelectItem
													className='dark:focus:bg-zinc-800 focus:bg-zinc-200'
													key={i}
													value={e.toString()}>
													{e}
												</SelectItem>
											))}
										</SelectGroup>
									</SelectContent>
								</Select>
								<p> {t('dashboard.ofEachMonth')} </p>
							</div>

							<Button
								onClick={submitEditFixedExpenses}
								className='bg-alternative_color text-white cursor-pointer'>
								Confirmar
							</Button>
						</div>
					</DialogHeader>
				</DialogContent>
			</Dialog>
		</main>
	);
};
