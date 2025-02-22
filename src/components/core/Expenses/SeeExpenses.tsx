import { Expenses, ResponseWallet } from '@/interfaces/Wallet';

import { TooltipComponent } from '@/components/others/Tooltip';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import '@/styles/Dashboard.css';
import { format } from 'date-fns';
import { Edit, EllipsisVertical, Trash } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DeleteFixedExpense, EditFixedExpenses, GetExpenses, GetFixedExpenses, PayFixedExpense, ResetDeadLine } from '@/apis/ExpenseService';
import { GetWalletUser } from '@/apis/WalletService';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { ApiResponse } from '@/interfaces/Api';
import { LoaderApi } from '@/assets/icons/Svg';
import { Toast } from '@/tools/Toast';
import { AddExpense } from './AddExpense';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { LoaderComponent } from '@/components/others/Loader';

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
	if (fetching) {
		return (
			<div className='h-screen flex justify-center pt-20 flex-col items-center gap-3 dark:bg-dark_primary_color bg-zinc-200'>
				<LoaderComponent />
			</div>
		);
	}
	return (
		<main className='pt-20 p-3  dark:bg-black bg-white'>
			<nav className='flex w-full justify-between items-center pb-3'>
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
			<section className=' shadow-sm  md:col-span-3 md:row-span-2 '>
				<div className=' w-full  flex flex-col  justify-between gap-5 order-3 '>
					<div className='dark:bg-dark_primary_color bg-zinc-200  p-3 w-full  rounded-xl border border-gray-600/50'>
						<div className='flex gap-3 flex-col items-start '>
							<h5 className='text-2xl'> {t('dashboard.allFixedExpenses')} </h5>

							<div className='w-9/12'>
								<Input
									disabled
									placeholder='Buscar'
									className='border dark:border-zinc-400 dark:bg-zinc-800/30 text-white '
								/>
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

							<div className='w-full  min-h-96   scrollbar-custom'>
								<Table className='w-full'>
									<TableBody>
										{fixedExpenses?.map((f) => (
											<TableRow key={f.expense_id}>
												<TableCell className='font-medium w-full '>{f.name}</TableCell>
												<TableCell className='font-medium w-full '>$ {f.value.toLocaleString()}</TableCell>
												<TableCell className='font-medium w-full hidden md:block '>
													<span className='font-bold'>{f.pay_each} </span> {t('dashboard.ofEachMonth')}
												</TableCell>
												<TableCell className='font-medium w-full flex flex-col  '>
													<span
														className={`font-bold hidden md:block ${
															difrenceBeetwenDate(new Date(f?.dead_line)) <= 5 ? 'text-red-500' : 'text-black dark:text-white'
														} `}>
														{format(f?.dead_line, 'PP')}
													</span>
													<span
														className={`font-bold  ${
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
															className={`${f.is_paid ? 'bg-transparent text-blue-500' : '  bg-green-600'} rounded-md p-1 w-full`}>
															{f.is_paid ? `${t('dashboard.alreadyPaid')}` : `${t('dashboard.pay')}`}
														</DialogTrigger>
														{!f.is_paid && (
															<DialogContent className=' w-[95%] md:w-[500px] rounded-md '>
																<DialogHeader>
																	<DialogTitle className='text-start'>
																		{t('dashboard.confirm')}
																		<span className='underline'> {t('dashboard.payment')} </span>
																		{t('dashboard.monthlyExpense')}
																		<span className='text-blue-500 font-semibold'> {f.name}</span>?
																	</DialogTitle>
																	<DialogDescription className='flex justify-end items-end gap-5 h-full '>
																		<Button className='bg-red-500'>{t('dashboard.cancel')}</Button>
																		<Button
																			className='bg-green-500'
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
														<DropdownMenuTrigger>
															<EllipsisVertical />
														</DropdownMenuTrigger>
														<DropdownMenuContent className='dark:bg-zinc-800'>
															<DropdownMenuSeparator />
															<DropdownMenuItem
																onClick={() => {
																	setOpenModalEditFixedExpenses(true);
																	setFixedExpenseToEdit(f);
																}}
																className='hover:dark:bg-zinc-700 cursor-pointer'>
																<p>{t('dashboard.edit')}</p>
																<Button
																	variant='ghost'
																	className='w-full flex justify-end'>
																	<Edit className={'w-6 '} />
																</Button>
															</DropdownMenuItem>
															<DropdownMenuItem
																onClick={() => {
																	setOpenDeleteDialog(true);
																	setExpenseToDelete(f);
																}}
																className='hover:dark:bg-zinc-700 cursor-pointer'>
																<p>{t('dashboard.delete')}</p>
																<Button
																	variant='ghost'
																	className='w-full flex justify-end'>
																	<Trash className={'w-6'} />
																</Button>
															</DropdownMenuItem>
														</DropdownMenuContent>
													</DropdownMenu>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
						</div>
					</div>
					<div className='dark:bg-dark_primary_color bg-zinc-200 p-3 w-full  rounded-xl border border-gray-600/50'>
						<div className='flex gap-3 flex-col  items-start'>
							<h5 className='text-2xl'> {t('dashboard.allExpenses')} </h5>

							<div className='w-9/12'>
								<Input
									disabled
									placeholder='Buscar'
									className='border dark:border-zinc-400 dark:bg-zinc-800/30 text-white '
								/>
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

							<div className='w-full  min-h-96   scrollbar-custom'>
								<Table className='w-full'>
									<TableBody className=' scrollbar-custom'>
										{expenses?.map((e) =>
											e.is_paid ? (
												<TableRow key={e?.expense_id}>
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
								</Table>
							</div>
						</div>
					</div>
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
					className=' w-full md:w-[500px] rounded-md '>
					<DialogHeader>
						<DialogTitle className='my-3'>
							<p className='my-3 font-bold text-2xl'> {t('dashboard.confirmDelete')} </p>

							<p className='text-pretty text-lg'>
								{t('dashboard.removeExpense')} <span className='font-semibold text-blue-500'>{expenseToDelete?.name}</span> ?
							</p>
						</DialogTitle>
						<DialogDescription className='flex justify-end items-end gap-5 h-full'>
							<Button
								className='w-full bg-red-500 text-white'
								onClick={() => setOpenDeleteDialog(false)}>
								{t('dashboard.cancel')}
							</Button>

							<Button
								onClick={() => deleteExpense(expenseToDelete)}
								variant='ghost'
								className='w-full bg-green-500 text-white'>
								{loader ? <LoaderApi color='white' /> : `${t('dashboard.delete')}`}
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
					className=' w-full md:w-[500px] rounded-md '>
					<DialogHeader>
						<DialogTitle className='my-3'>
							<p className='my-3 font-bold text-2xl text-center  py-3 dark:border-white border-black'>
								Modificar gasto fijo <span className='text-orange-500'>{fixedExpenseToEdit?.name}</span>
							</p>
						</DialogTitle>
						<div className='flex flex-col justify-center gap-5 h-full '>
							<div>
								<label htmlFor=''>
									Valor a pagar <span className='text-red-500'>*</span>
								</label>
								<Input
									className='border dark:border-zinc-400 dark:bg-zinc-800/30 text-white'
									value={amount}
									onChange={handleValues}
								/>
							</div>
							<div className=' flex flex-wrap gap-x-3 items-center'>
								<p className=''>{t('addExpense.paymentDayP')} </p>
								<Select onValueChange={handlePayEach}>
									<SelectTrigger className=' w-32 bg-zinc-200 dark:bg-zinc-800 dark:text-white text-black border border-green-500/50'>
										<SelectValue placeholder={fixedExpenseToEdit?.pay_each} />
									</SelectTrigger>
									<SelectContent className='dark:bg-zinc-700'>
										<SelectGroup>
											<SelectLabel className='text-lg'>{t('dashboard.day')}</SelectLabel>
											{days.map((e, i) => (
												<SelectItem
													className='focus:dark:bg-zinc-800 focus:bg-zinc-200'
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

							<Button onClick={submitEditFixedExpenses}>Confirmar</Button>
						</div>
					</DialogHeader>
				</DialogContent>
			</Dialog>
		</main>
	);
};
