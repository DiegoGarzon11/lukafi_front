import {DeleteDebt, GetDebts} from '@/apis/DebtService';
import {DeleteFixedExpense, GetDailyExpenses, GetExpenses, GetFixedExpenses, PayFixedExpense, ResetDeadLine} from '@/apis/ExpenseService';
import {GetWalletUser} from '@/apis/WalletService';
import {Edit, LoaderApi, Trash} from '@/assets/icons/Svg';
import {Chart, ChartDonut} from '@/components/core/Charts';
import {AddDebt} from '@/components/core/Debts/AddDebt';
import {AddExpense} from '@/components/core/Expenses/AddExpense';
import {Carrusel} from '@/components/others/Carrousel';
import {LoaderComponent} from '@/components/others/Loader';
import {TooltipComponent} from '@/components/others/Tooltip';
import {Button} from '@/components/ui/button';
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger} from '@/components/ui/dialog';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {Table, TableBody, TableCell, TableRow} from '@/components/ui/table';
import {ApiResponse} from '@/interfaces/Api';
import {Debt, Expenses, ResponseWallet} from '@/interfaces/Wallet';
import '@/styles/Dashboard.css';
import {Toast} from '@/tools/Toast';
import {format} from 'date-fns';
import {AlertTriangle, ArrowDown, ArrowUp, EllipsisVertical, Eye} from 'lucide-react';
import {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';

export const Dashboard = () => {
	const [userData, setDataUser] = useState<ResponseWallet | undefined>(undefined);
	const [fixedExpenses, setFixedExpenses] = useState<Array<Expenses> | undefined>(undefined);
	const [debts, setDebts] = useState<Array<Debt> | undefined>([]);
	const [ApiResponse, setApiResponse] = useState<ApiResponse | undefined>(null);
	const [expenses, setExpenses] = useState<Array<Expenses> | undefined>([]);
	const [restExpenses, setRestExpenses] = useState<Expenses | number>(0);
	const [trigger, setTrigger] = useState(0);
	const [loader, setLoader] = useState(false);
	const [openDialog, setOpenDialog] = useState(false);
	const [fetching, setFetching] = useState(true);
	const [visibilityToast, setVisibilityToast] = useState(false);
	const [debtToDelete, setDebtToDelete] = useState<Debt | undefined>(undefined);
	const [expenseToDelete, setExpenseToDelete] = useState<Expenses | undefined>(undefined);
	const user = JSON.parse(localStorage.getItem('userMain'));

	const {t, i18n} = useTranslation();
	i18n.changeLanguage();

	const getDebts = async (walletId) => {
		const debts = await GetDebts(walletId);
		setDebts(debts?.debts);
	};

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
	const getFixedExpenses = async (walletId) => {
		const fixedExpenses = await GetFixedExpenses(walletId);
		setFixedExpenses(fixedExpenses?.expenses);
	};
	function generateRandomNumbers() {
		let result = '';

		// El primer número debe ser entre 1 y 9
		result += Math.floor(Math.random() * 9) + 1;

		// Los siguientes números pueden ser entre 0 y 9
		for (let i = 1; i < 16; i++) {
			result += Math.floor(Math.random() * 10);
			if ((i + 1) % 4 === 0 && i !== 15) {
				result += '-';
			}
		}
		return result;
	}

	useEffect(() => {
		const fetchData = async () => {
			const dataUser = await GetWalletUser(user?.user_id);
			const dailyExpenses = await GetDailyExpenses(dataUser?.wallet?.wallet_id);
			setDataUser(dataUser);
			setFetching(false);
			const allToRest: number = dailyExpenses.expenses.reduce((a: number, c: Expenses) => {
				return a + c.total_value;
			}, 0);

			setRestExpenses(allToRest);
		};

		fetchData();
	}, [trigger]);

	const recibeResponseChild = async (e: string) => {
		if (e === 'debt') return getDebts(userData.wallet);
		if (e === 'expense') return setTrigger((prev) => prev + 1);

		getExpenses(userData.wallet);
		const responseFixedExpenses = await GetFixedExpenses(userData.wallet);

		setFixedExpenses(responseFixedExpenses?.expenses);
	};
	function difrenceBeetwenDate(deadline: Date) {
		const currentTime: Date = new Date();
		const differenceInTime: number = deadline.getTime() - currentTime.getTime();
		const differenceInDays: number = Math.ceil(differenceInTime / (1000 * 60 * 60 * 24));
		return differenceInDays;
	}

	useEffect(() => {
		if (userData?.wallet?.wallet_id) {
			const fetchExpensesAndDebts = async () => {
				const fixedExpenses = await GetFixedExpenses(userData.wallet);
				setFixedExpenses(fixedExpenses?.expenses);

				for (let i = 0; i < fixedExpenses?.expenses.length; i++) {
					const defaultDeadLine = new Date(fixedExpenses?.expenses[i].dead_line);

					const diferenceBetweenDates = difrenceBeetwenDate(defaultDeadLine);
					if (diferenceBetweenDates <= 5 && fixedExpenses?.expenses[i].is_paid === true) {
						newDeadLine(userData.wallet.wallet_id, fixedExpenses?.expenses[i].expense_id);
					}
				}

				getDebts(userData.wallet);
				getExpenses(userData.wallet);
			};

			fetchExpensesAndDebts();
		}
	}, [userData, trigger]);

	const deleteDebt = async (e) => {
		setLoader(true);
		setVisibilityToast(false);

		const params = {
			debt_id: e?.debt_id,
			wallet_id: e?.wallet_id,
		};

		try {
			const responseDeleteDebt = await DeleteDebt(params);
			setApiResponse(responseDeleteDebt);
			getDebts(params);
		} catch (error) {
			console.error(error);
		} finally {
			setVisibilityToast(true);
			setLoader(false);
			setOpenDialog(false);
			setDebtToDelete(null);
		}
	};
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
			setOpenDialog(false);
			setExpenseToDelete(null);
		}
	};

	const payExpense = async (expense) => {
		const params = {
			wallet_id: expense.wallet_id,
			expense_id: expense.expense_id,
		};
		const response = await PayFixedExpense(params);
		setTrigger((prev) => prev + 1);
		getExpenses(userData.wallet);

		//! TODO: show a toast with the message of the pay fixed expense
		console.log(response);
	};

	if (fetching) {
		return (
			<div className='h-screen flex justify-center pt-20 flex-col items-center gap-3'>
				<LoaderComponent />
			</div>
		);
	}
	return (
		<main>
			{userData && userData?.status === 404 ? (
				<div className='flex justify-center items-center bg-zinc-200 dark:bg-zinc-900/50'>
					<Carrusel />
				</div>
			) : (
				<div className='flex flex-col md:grid md:grid-cols-3 h-full pt-20 p-5 gap-5 dark:bg-zinc-800 bg-white'>
					<section className='md:flex grid grid-cols-2 grid-rows-2 md:flex-nowrap w-full gap-3 md:col-span-3  '>
						<AddExpense sendData={(e) => recibeResponseChild(e)} apiData={userData?.wallet} />
						<AddDebt sendData={(e) => recibeResponseChild(e)} apiData={userData?.wallet} />
						<a
							className='w-full h-full dark:hover:bg-zinc-900 dark:bg-zinc-900/50 bg-zinc-200 text-black  dark:text-white rounded-md flex justify-center items-center '
							href='#seeDebt'>
							<Button variant='ghost' className='flex items-center gap-3 h-full w-full'>
								{t('dashboard.seeExpenses')} <Eye />
							</Button>
						</a>
						<a
							className='w-full h-full dark:hover:bg-zinc-900 dark:bg-zinc-900/50 bg-zinc-200 text-black  dark:text-white rounded-md flex justify-center items-center '
							href='#seeExpenses'>
							<Button variant='ghost' className='flex items-center gap-3 h-full w-full'>
								{t('dashboard.seeDebts')} <Eye />
							</Button>
						</a>
					</section>
					<section className='flex md:col-span-3 md:row-span-8 flex-wrap md:flex-nowrap  gap-8 md:h-56'>
						<article className=' w-full h-full  shadow-sm border-none dark:bg-zinc-900/50 bg-zinc-200 text-black  dark:text-white rounded-xl  p-3'>
							<div>
								<p className='text-lg font-semibold'>{t('dashboard.savings')}:</p>
								<p className='font-semibold my-3'>
									{t('dashboard.before')}:<span className='text-green-500 ml-3'>{userData?.wallet?.salary.toLocaleString()}</span>
								</p>
								<p className='font-semibold'>
									{t('dashboard.now')}:
									<span
										className={`${
											Number(userData?.wallet?.salary) - Number(restExpenses) >= Number(userData?.wallet?.saving)
												? 'text-green-500'
												: 'text-red-500'
										}  ml-3`}>
										{(Number(userData?.wallet?.salary) - Number(restExpenses)).toLocaleString()}
									</span>
								</p>
								<p className='flex text-lg items-center gap-3 mt-3'>
									{Number(userData?.wallet?.salary) - Number(restExpenses) >= Number(userData?.wallet?.saving) ? (
										<ArrowUp color='green' />
									) : (
										<ArrowDown color='red' />
									)}

									{Number(userData?.wallet?.salary) - Number(restExpenses) >= Number(userData?.wallet?.saving)
										? `${t('dashboard.rangeSaving')}`
										: `${t('dashboard.goalSaving')}`}
								</p>
							</div>
						</article>
						<article className=' text-white flex flex-col justify-between  bg-gradient-to-r  to-green-400  from-gray-700 w-full md:w-2/5 rounded-3xl p-8 shadow-xl shadow-zinc-900/90'>
							<div className='flex justify-between'>
								<p className='text-xl font-bold'>{user.full_name}</p>
								<p className='text-5xl font-bold tracking-widest  '>LUFI</p>
							</div>
							<div className='flex flex-col'>
								<p className=' font-semibold'>{t('dashboard.availableBalance')}</p>
								<p className=' font-semibold text-3xl tracking-wider'>
									{Number(userData?.wallet?.salary) - Number(restExpenses) <= 0
										? 0
										: (Number(userData?.wallet?.salary) - Number(restExpenses)).toLocaleString()}
								</p>
							</div>
							<div className='flex justify-between '>
								<p className='font-semibold'>{generateRandomNumbers()}</p>
								<p>{format(userData.wallet.created_in, 'MM/yy')}</p>
							</div>
						</article>
					</section>

					<section className='  md:col-span-3 md:row-span-6    flex flex-col md:flex-row justify-around gap-5'>
						<div className='md:w-5/6 w-full   shadow-sm   flex justify-around '>
							<div className='flex flex-col dark:bg-zinc-900/50 rounded-xl  bg-zinc-200 w-full h-full'>
								<div className='flex flex-col md:flex-row items-center justify-between px-5 py-3 gap-2'>
									<p className='text-lg '>{t('dashboard.viewExpensesCategory')}</p>
									<div className='flex gap-5 justify-end'>
										<Button className=''>{t('dashboard.day')}</Button>
										<Button disabled className=''>
											{t('dashboard.month')}
										</Button>
										<Button disabled className=''>
											{t('dashboard.year')}
										</Button>
									</div>
								</div>
								{expenses?.length > 0 ? (
									<ChartDonut trigger={trigger} />
								) : (
									<div className=' flex justify-center items-center gap-3  h-full'>
										<AlertTriangle className='text-yellow-500' />
										<p className='text-lg font-semibold'> {t('dashboard.noExpenses')} </p>
									</div>
								)}
							</div>
						</div>
						<div className='w-full bg-zinc-200 dark:bg-zinc-900/50  shadow-sm rounded-xl '>
							<div className='flex flex-col md:flex-row justify-between items-center mb-10 px-5 pt-3 gap-3'>
								<p className='text-lg'>{t('dashboard.viewBalanceExpenses')}</p>
								<div className='flex gap-5'>
									<Button className=''>{t('dashboard.day')}</Button>
									<Button disabled className=''>
										{t('dashboard.month')}
									</Button>
									<Button disabled className=''>
										{t('dashboard.year')}
									</Button>
								</div>
							</div>
							{expenses?.length > 0 ? (
								<Chart trigger={trigger} />
							) : (
								<div className=' flex justify-center items-center gap-3  pb-7 '>
									<AlertTriangle className='text-yellow-500' />
									<p className='text-lg font-semibold'> {t('dashboard.noExpenses')}</p>
								</div>
							)}
						</div>
					</section>
					<section id='seeExpenses' className=' shadow-sm  md:col-span-3 md:row-span-2     '>
						<div className=' w-full  flex flex-col md:flex-row justify-between gap-5 order-3 '>
							<div className='dark:bg-zinc-900/50 bg-zinc-200 p-5 w-full md:w-2/5 rounded-xl'>
								<div className='flex gap- items-center'>
									<h5 className='text-2xl'> {t('dashboard.allExpenses')} </h5>
								</div>

								<div className='w-full'>
									<section className='w-full '>
										<article className=' flex text-base font-semibold py-4 dark:text-zinc-300 text-slate-500 border-b border-slate-500 mb-3'>
											<p className='w-full text-start'>{t('dashboard.date')}</p>
											<p className='w-full text-start'>{t('dashboard.name')}</p>
											<p className='w-full text-start'>{t('dashboard.value')}</p>
										</article>
									</section>

									<div className='w-full h-52 overflow-auto overflow-x-hidden scrollbar-custom'>
										<Table className='w-full'>
											<TableBody className='  overflow-auto  overflow-x-hidden   scrollbar-custom'>
												{expenses?.map((e) =>
													e.is_paid ? (
														<TableRow key={e?.expense_id}>
															<TableCell className='font-medium  w-full'>
																<p>{new Date(e?.created_in).toLocaleDateString()}</p>
															</TableCell>
															<TableCell className='font-medium w-full hidden md:block'>
																{e?.name.length >= 20 ? (
																	<TooltipComponent message={`${e?.name.slice(0, 20)}...`} content={e?.name} />
																) : (
																	<p>{e?.name}</p>
																)}
															</TableCell>
															<TableCell className='font-medium w-full block md:hidden'>
																{e?.name.length >= 8 ? (
																	<TooltipComponent message={`${e?.name.slice(0, 8)}...`} content={e?.name} />
																) : (
																	<p>{e?.name}</p>
																)}
															</TableCell>
															<TableCell className='font-medium w-full'>
																<p>{e?.value.toLocaleString()}</p>
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
							<div className='dark:bg-zinc-900/50 bg-zinc-200 p-5 w-full md:w-2/3 rounded-xl'>
								<div className='flex gap- items-center'>
									<h5 className='text-2xl'> {t('dashboard.allFixedExpenses')} </h5>
								</div>

								<div className='w-full'>
									<section className='w-full '>
										<article className=' flex text-base font-semibold py-4 dark:text-zinc-300 text-slate-500 border-b border-slate-500 mb-3'>
											<p className='w-full text-start'>{t('dashboard.name')}</p>
											<p className='w-full text-start'>{t('dashboard.value')}</p>
											<p className='w-full text-start hidden md:block'>{t('dashboard.payEach')}</p>
											<p className='w-full text-start '> {t('dashboard.nextPayment')} </p>
											<p className='w-full text-start ' />
											<p className='w-full text-start ' />
										</article>
									</section>

									<div className='w-full h-52 overflow-auto overflow-x-hidden scrollbar-custom'>
										<Table className='w-full'>
											<TableBody>
												{fixedExpenses?.map((f) => (
													<TableRow key={f.expense_id}>
														<TableCell className='font-medium w-full'>{f.name}</TableCell>
														<TableCell className='font-medium w-full'>{f.value.toLocaleString()}</TableCell>
														<TableCell className='font-medium w-full hidden md:block '>
															<span className='font-bold'>{f.pay_each} </span> {t('dashboard.ofEachMonth')}
														</TableCell>
														<TableCell className='font-medium w-full flex flex-col '>
															<span
																className={`font-bold  ${
																	difrenceBeetwenDate(new Date(f?.dead_line)) < 5
																		? 'text-red-500'
																		: 'text-black dark:text-white'
																} `}>
																{format(f?.dead_line, 'PP')}
															</span>
															<span
																className={`font-bold  ${
																	difrenceBeetwenDate(new Date(f?.dead_line)) < 5
																		? 'text-red-500'
																		: 'text-black dark:text-white'
																} `}>
																<span className='opacity-70'>
																	({difrenceBeetwenDate(new Date(f?.dead_line))} {t('dashboard.day')}s)
																</span>
															</span>
														</TableCell>
														<TableCell className='font-medium w-full '>
															<Dialog>
																<DialogTrigger
																	className={`${
																		f.is_paid ? 'bg-transparent text-blue-500' : '  bg-green-600'
																	} rounded-md p-1 w-full`}>
																	{f.is_paid ? `${t('dashboard.alreadyPaid')}` : `${t('dashboard.pay')}`}
																</DialogTrigger>
																{!f.is_paid && (
																	<DialogContent className='w-[400px] h-32'>
																		<DialogHeader>
																			<DialogTitle>
																				{t('dashboard.confirm')}
																				<span className='underline'> {t('dashboard.payment')} </span>{' '}
																				{t('dashboard.monthlyExpense')}
																				<span className='text-blue-500 font-semibold'> {f.name}</span>?
																			</DialogTitle>
																			<DialogDescription className='flex justify-end items-end gap-5 h-full '>
																				<Button>{t('dashboard.cancel')}</Button>
																				<Button onClick={() => payExpense(f)}>{t('dashboard.confirm')}</Button>
																			</DialogDescription>
																		</DialogHeader>
																	</DialogContent>
																)}
															</Dialog>
														</TableCell>

														<TableCell className='font-medium   w-full '>
															<DropdownMenu>
																<DropdownMenuTrigger>
																	<EllipsisVertical />
																</DropdownMenuTrigger>
																<DropdownMenuContent className='dark:bg-zinc-800'>
																	<DropdownMenuSeparator />
																	<DropdownMenuItem className='hover:dark:bg-zinc-700 cursor-pointer'>
																		<p>{t('dashboard.edit')}</p>
																		<Button variant='ghost' className='w-full flex justify-end'>
																			<Edit className={'w-6 '} />
																		</Button>
																	</DropdownMenuItem>
																	<DropdownMenuItem
																		onClick={() => {
																			setOpenDialog(true);
																			setExpenseToDelete(f);
																		}}
																		className='hover:dark:bg-zinc-700 cursor-pointer'>
																		<p>{t('dashboard.eliminate')}</p>
																		<Button variant='ghost' className='w-full flex justify-end'>
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
						</div>
					</section>
					<section id='seeDebt' className=' shadow-sm md:col-span-3 h-full row-span-9'>
						<div className='  w-full  flex  justify-between gap-5 order-3'>
							<div className='dark:bg-zinc-900/50 bg-zinc-200 p-5 w-full rounded-xl'>
								<div className='flex gap- items-center'>
									<h5 className='text-2xl'> {t('dashboard.allDebts')} </h5>
								</div>

								<div className='w-full'>
									<section className='w-full  '>
										<article className=' flex text-base font-semibold py-4 dark:text-zinc-300 text-slate-500 border-b border-slate-500 mb-3'>
											<p className='md:w-full hidden md:block text-start pl-2'>{t('dashboard.date')}</p>
											<p className='md:w-full w-20 text-start pl-2'>{t('dashboard.person')}</p>
											<p className='md:w-full w-20 text-start pl-2'>{t('dashboard.reason')}</p>
											<p className='md:w-full w-20 text-start pl-2'>{t('dashboard.value')}</p>
											<p className='md:w-full w-20 text-start pl-2'>{t('dashboard.state')}</p>
											<p className='md:w-full  text-start pl-2' />
										</article>
									</section>

									<div className='w-full h-60 overflow-auto overflow-x-hidden scrollbar-custom'>
										<Table className='w-full'>
											<TableBody className=' w-full overflow-auto  overflow-x-hidden   scrollbar-custom'>
												{debts?.map((d) => (
													<TableRow key={d?.debt_id}>
														<TableCell className='font-medium  md:w-full w-20 hidden md:block'>
															<p>{new Date(d?.created_in).toLocaleDateString()}</p>
														</TableCell>
														<TableCell className='font-medium md:w-full w-20 hidden md:block'>
															{d?.person.length >= 10 ? (
																<TooltipComponent message={`${d?.person.slice(0, 10)}...`} content={d?.person} />
															) : (
																<p>{d?.person}</p>
															)}
														</TableCell>

														<TableCell className='font-medium md:w-full w-16 block md:hidden align-middle'>
															{d?.person.length >= 10 ? (
																<TooltipComponent message={`${d?.person.slice(0, 10)}...`} content={d?.person} />
															) : (
																<p>{d?.person}</p>
															)}
														</TableCell>

														<TableCell className='font-medium md:w-full hidden md:block align-middle'>
															{d?.reason.length >= 20 ? (
																<TooltipComponent message={`${d?.reason.slice(0, 20)}`} content={d?.reason} />
															) : (
																<p>{d?.reason}</p>
															)}
														</TableCell>

														<TableCell className='font-medium md:w-full block md:hidden w-20 align-middle'>
															{d?.reason.length >= 10 ? (
																<TooltipComponent message={`${d?.reason.slice(0, 8)}...`} content={d?.reason} />
															) : (
																<p>{d?.reason}</p>
															)}
														</TableCell>
														<TableCell className='font-medium md:w-full w-20 align-middle'>
															<p>{d?.value.toLocaleString()}</p>
														</TableCell>
														<TableCell className='font-medium md:w-full w-20'>
															<p
																className={` rounded-md px-2 py-1 text-start ${
																	d?.debt_type == 0 ? 'text-red-500' : 'text-green-500'
																}`}>
																{d?.debt_type == 0 ? 'Debes' : 'Te deben'}
															</p>
														</TableCell>
														<TableCell className='font-medium  w-20 hidden md:flex md:w-full'>
															<DropdownMenu>
																<DropdownMenuTrigger>
																	<EllipsisVertical />
																</DropdownMenuTrigger>
																<DropdownMenuContent className='dark:bg-zinc-800'>
																	<DropdownMenuSeparator />
																	<DropdownMenuItem className='hover:dark:bg-zinc-700 cursor-pointer'>
																		<p> {t('dashboard.edit')} </p>
																		<Button variant='ghost' className='w-full flex justify-end'>
																			<Edit className={'w-6 '} />
																		</Button>
																	</DropdownMenuItem>
																	<DropdownMenuItem
																		onClick={() => {
																			setOpenDialog(true);
																			setDebtToDelete(d);
																		}}
																		className='hover:dark:bg-zinc-700 cursor-pointer flex justify-between'>
																		<p>{t('dashboard.eliminate')}</p>

																		<Trash className={'w-6'} />
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
						</div>
					</section>
				</div>
			)}
			{visibilityToast && (
				<Toast
					visibility={visibilityToast}
					severity={ApiResponse.success == true ? 'success' : 'error'}
					message={ApiResponse.message}
				/>
			)}
			<Dialog open={openDialog} onOpenChange={setOpenDialog}>
				<DialogContent aria-describedby={null} className='w-[400px] '>
					<DialogHeader>
						<DialogTitle className='my-3'>
							<p className='my-3 font-bold text-2xl'> {t('dashboard.confirmElimination"')} </p>
							{debtToDelete ? (
								<p className='text-balance'>
									{t('dashboard.eliminateDebt')} <span className='font-semibold text-blue-500'>{debtToDelete?.reason}</span> ?
								</p>
							) : (
								<p className='text-pretty text-lg'>
									{t('dashboard.eliminateExpense')} <span className='font-semibold text-blue-500'>{expenseToDelete?.name}</span> ?
								</p>
							)}
						</DialogTitle>
						<DialogDescription className='flex justify-end items-end gap-5 h-full'>
							<Button className='w-full bg-red-500 text-white' onClick={() => setOpenDialog(false)}>
								{t('dashboard.cancel')}
							</Button>
							{debtToDelete ? (
								<Button onClick={() => deleteDebt(debtToDelete)} variant='ghost' className='w-full bg-green-500 text-white'>
									{loader ? <LoaderApi color='white' /> : `${t('dashboard.eliminate')}`}
								</Button>
							) : (
								<Button onClick={() => deleteExpense(expenseToDelete)} variant='ghost' className='w-full bg-green-500 text-white'>
									{loader ? <LoaderApi color='white' /> : `${t('dashboard.eliminate')}`}
								</Button>
							)}
						</DialogDescription>
					</DialogHeader>
				</DialogContent>
			</Dialog>
		</main>
	);
};
