import { DeleteDebt, GetDebts } from '@/apis/DebtService';
import { GetDailyExpenses, GetExpenses, GetFixedExpenses, PayFixedExpense } from '@/apis/ExpenseService';
import { GetWalletUser } from '@/apis/WalletService';
import { Edit, Trash } from '@/assets/icons/Svg';
import { Chart, ChartDonut } from '@/components/core/Charts';
import { AddDebt } from '@/components/core/Debts/AddDebt';
import { AddExpense } from '@/components/core/Expenses/AddExpense';
import { Carrusel } from '@/components/others/Carrousel';
import { TooltipComponent } from '@/components/others/Tooltip';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Debt, Expenses, ResponseWallet } from '@/interfaces/Wallet';
import '@/styles/Dashboard.css';
import { Toast } from '@/tools/Toast';
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogHeader, DialogDescription } from '@/components/ui/dialog';
import { useEffect, useState } from 'react';
import { ArrowDown, ArrowUp, Eye } from 'lucide-react';

export const Dashboard = () => {
	const [userData, setDataUser] = useState<ResponseWallet | undefined>(undefined);
	const [fixedExpenses, setFixedExpenses] = useState<Array<Expenses> | undefined>(undefined);
	const [debts, setDebts] = useState<Array<Debt> | undefined>([]);
	const [responseDebt, setresponseDebt] = useState<ResponseWallet | undefined>(null);
	const [expenses, setExpenses] = useState<Array<Expenses> | undefined>([]);
	const [visibilytToast, setVisibilityToast] = useState(false);
	const [restExpenses, setRestExpenses] = useState<Expenses | number>(0);
	const [trigger, setTrigger] = useState(0);
	const user = JSON.parse(localStorage.getItem('userMain'));

	const getDebts = async (walletId) => {
		const debts = await GetDebts(walletId);
		setDebts(debts?.debts);
	};

	const getExpenses = async (walletId) => {
		const expenses = await GetExpenses(walletId);
		setExpenses(expenses?.expenses);
	};

	useEffect(() => {
		const fetchData = async () => {
			const dataUser = await GetWalletUser(user?.user_id);
			const dailyExpenses = await GetDailyExpenses(dataUser?.wallet?.wallet_id);
			setDataUser(dataUser);
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
		const responseFixedExpenses = await GetFixedExpenses(userData.wallet.wallet_id);

		setFixedExpenses(responseFixedExpenses?.expenses);
	};

	useEffect(() => {
		if (userData?.wallet?.wallet_id) {
			const fetchExpensesAndDebts = async () => {
				const fixedExpenses = await GetFixedExpenses(userData.wallet.wallet_id);
				setFixedExpenses(fixedExpenses?.expenses);
				getDebts(userData.wallet);
				getExpenses(userData.wallet);
			};

			fetchExpensesAndDebts();
		}
	}, [userData, trigger]);

	const deleteDebt = async (e) => {
		const params = {
			debt_id: e?.debt_id,
			wallet_id: e?.wallet_id,
		};
		const responseDeleteDebt = await DeleteDebt(params);
		if (responseDeleteDebt) {
			setresponseDebt(responseDeleteDebt);
			getDebts(params);
			getExpenses(params);
			setVisibilityToast(true);
		}

		setTimeout(() => {
			setVisibilityToast(false);
		}, 1000);
	};
	const payExpense = async (expense) => {
		const params = {
			wallet_id: expense.wallet_id,
			expense_id: expense.expense_id,
		};
		const response = await PayFixedExpense(params);
		setTrigger((prev) => prev + 1);
		getExpenses(userData.wallet);
		console.log(response);
	};

	return (
		<main>
			{userData && userData?.status === 404 ? (
				<div className='flex justify-center items-center  '>
					<Carrusel />
				</div>
			) : (
				<div className='flex flex-col md:grid md:grid-cols-3 h-full pt-20 p-5 gap-5 dark:bg-slate-900/30 bg-slate-200  '>
					<section className='md:flex grid grid-cols-2 grid-rows-2 md:flex-nowrap w-full gap-3 md:col-span-3  '>
						<AddExpense
							sendData={(e) => recibeResponseChild(e)}
							apiData={userData?.wallet}
						/>
						<AddDebt
							sendData={(e) => recibeResponseChild(e)}
							apiData={userData?.wallet}
						/>
						<a
							className='w-full h-full dark:bg-slate-900 bg-white text-black  dark:text-white rounded-md flex justify-center items-center '
							href='#seeDebt'>
							<Button
								variant='ghost'
								className='flex items-center gap-3 h-full w-full'>
								Ver gastos <Eye />
							</Button>
						</a>
						<a
							className='w-full h-full dark:bg-slate-900 bg-white text-black  dark:text-white rounded-md flex justify-center items-center '
							href='#seeExpenses'>
							<Button
								variant='ghost'
								className='flex items-center gap-3 h-full w-full'>
								Ver deudas <Eye />
							</Button>
						</a>
					</section>
					<section className='flex md:col-span-3 md:row-span-8 flex-wrap md:flex-nowrap  gap-8  '>
						<article className=' w-full h-full  shadow-sm border-none dark:bg-slate-900 bg-white text-black  dark:text-white rounded-xl  p-3'>
							<div>
								<p>Tu salario mensual actualmente:</p>
								<p className='text-green-500'>{userData?.wallet?.salary.toLocaleString()}</p>
							</div>
						</article>
						<article className=' w-full h-full  shadow-sm border-none dark:bg-slate-900 bg-white text-black  dark:text-white rounded-xl  p-3'>
							<div>
								<p className='text-lg font-semibold'>Tus ahorros actualmente:</p>
								<p className='font-semibold my-3'>
									Antes:
									<span className='text-green-500 ml-3'>{userData?.wallet?.salary.toLocaleString()}</span>
								</p>
								<p className='font-semibold'>
									Ahora:
									<span className={`${Number(restExpenses) < userData?.wallet?.saving ? 'text-green-500' : 'text-red-500'}  ml-3`}>
										{(userData?.wallet?.salary - Number(restExpenses)).toLocaleString()}
									</span>
								</p>
								<p className='flex text-lg items-center gap-3 mt-3'>
									{Number(restExpenses) < userData?.wallet?.saving ? <ArrowUp color='green' /> : <ArrowDown color='red' />}

									{Number(restExpenses) - userData?.wallet?.salary < userData?.wallet?.saving
										? 'Perdiste la meta este mes, el otro mes sera el bueno'
										: 'Te encuentras en tu rango de ahorro'}
								</p>
							</div>
						</article>
						<article className='w-full  md:h-full shadow-sm border-none  dark:bg-slate-900 bg-white text-black  dark:text-white rounded-xl  p-3'>
							<div>
								<p>Tu meta de ahorro mensual actual</p>
								<p className='text-green-500'>{userData?.wallet?.saving.toLocaleString()}</p>
							</div>
						</article>
					</section>

					<section className=' shadow-sm md:col-span-3 md:row-span-6  rounded-xl    flex flex-col md:flex-row justify-around gap-5'>
						<div className='md:w-5/6 w-full bg-slate-900  shadow-sm rounded-xl  flex justify-around '>
							<div className='flex flex-col dark:bg-slate-900 bg-white w-full h-full'>
								<div className='flex flex-col md:flex-row items-center justify-between px-5 py-3 gap-2'>
									<p className='text-lg '>
										Obervar <span className='font-semibold'>gastos por categoria</span>
									</p>
									<div className='flex gap-5 justify-end'>
										<Button className=''>Dia</Button>
										<Button
											disabled
											className=''>
											Mes
										</Button>
										<Button
											disabled
											className=''>
											Año
										</Button>
									</div>
								</div>

								<ChartDonut />
							</div>
						</div>
						<div className='w-full bg-white dark:bg-slate-900  shadow-sm rounded-xl '>
							<div className='flex flex-col md:flex-row justify-between items-center mb-10 px-5 pt-3 gap-3'>
								<p className='text-lg'>
									Obersevar <span className='font-semibold'>balance de gastos</span>
								</p>
								<div className='flex gap-5'>
									<Button className=''>Dia</Button>
									<Button
										disabled
										className=''>
										Mes
									</Button>
									<Button
										disabled
										className=''>
										Año
									</Button>
								</div>
							</div>
							<Chart trigger={trigger} />
						</div>
					</section>
					<section
						id='seeExpenses'
						className=' shadow-sm  md:col-span-3 md:row-span-2     '>
						<div className=' w-full  flex flex-col md:flex-row justify-between gap-5 order-3 '>
							<div className='dark:bg-slate-900 bg-white p-5 w-full md:w-2/5 rounded-xl'>
								<div className='flex gap- items-center'>
									<h5 className='text-2xl'>Todos tus gastos </h5>
								</div>

								<div className='w-full'>
									<section className='w-full '>
										<article className=' flex text-base font-semibold py-4 text-slate-500 border-b border-slate-500 mb-3'>
											<p className='w-full text-start '>Fecha</p>
											<p className='w-full text-start'>Nombre</p>
											<p className='w-full text-start'>Valor</p>
										</article>
									</section>

									<div className='w-full h-52 overflow-auto overflow-x-hidden scrollbar-custom'>
										<Table className='w-full'>
											<TableBody className='  overflow-auto  overflow-x-hidden   scrollbar-custom'>
												{expenses?.map((e) => (
													<TableRow key={e?.expense_id}>
														<TableCell className='font-medium  w-full'>
															<p>{new Date(e?.created_in).toLocaleDateString()}</p>
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
															<p>{e?.value.toLocaleString()}</p>
														</TableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>
									</div>
								</div>
							</div>
							<div className='dark:bg-slate-900 bg-white p-5 w-full md:w-2/3 rounded-xl'>
								<div className='flex gap- items-center'>
									<h5 className='text-2xl'>Tus gastos fijos mensuales</h5>
								</div>

								<div className='w-full'>
									<section className='w-full '>
										<article className=' flex text-base font-semibold py-4 text-slate-500 border-b border-slate-500 mb-3'>
											<p className='w-full text-start'>Nombre</p>
											<p className='w-full text-start'>Valor</p>
											<p className='w-full text-start'>Pagar Cada</p>
											<p className='w-full text-start '> </p>
											<p className='w-full text-start hidden md:block'> </p>
										</article>
									</section>

									<div className='w-full h-52 overflow-auto overflow-x-hidden scrollbar-custom'>
										<Table className='w-full'>
											<TableBody>
												{fixedExpenses?.map((f) => (
													<TableRow key={f.expense_id}>
														<TableCell className='font-medium w-full'>{f.name}</TableCell>
														<TableCell className='font-medium w-full'>{f.value.toLocaleString()}</TableCell>
														<TableCell className='font-medium w-full '>
															<span className='font-bold'>{new Date(f.dead_line).getDay() + 1} </span> de cada mes
														</TableCell>
														<TableCell className='font-medium w-full '>
															<Dialog>
																<DialogTrigger
																	className={`${
																		f.is_paid ? 'bg-transparent text-blue-500' : '  bg-green-600'
																	} rounded-md p-1 w-full`}>
																	{f.is_paid ? 'Ya esta pago' : 'Pagar'}
																</DialogTrigger>
																<DialogContent className='w-[400px] h-32'>
																	<DialogHeader>
																		<DialogTitle>
																			¿Confirmas el <span className='underline'>pago</span> del gasto mensual
																			<span className='text-blue-500 font-semibold'> {f.name}</span>?
																		</DialogTitle>
																		<DialogDescription className='flex justify-end items-end gap-5 h-full '>
																			<Button>Cancelar</Button>
																			<Button onClick={() => payExpense(f)}>Confirmar</Button>
																		</DialogDescription>
																	</DialogHeader>
																</DialogContent>
															</Dialog>
														</TableCell>

														<TableCell className='font-medium   w-full hidden md:flex'>
															<Button
																variant='ghost'
																className='w-full'>
																<Trash className={'w-6'} />
															</Button>
															<Button
																variant='ghost'
																className='w-full'>
																<Edit className={'w-6'} />
															</Button>
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
					<section
						id='seeDebt'
						className=' shadow-sm md:col-span-3 h-full row-span-9'>
						<div className='  w-full  flex  justify-between gap-5 order-3'>
							<div className='dark:bg-slate-900 bg-white p-5 w-full rounded-xl'>
								<div className='flex gap- items-center'>
									<h5 className='text-2xl'>Todas tus deudas</h5>
								</div>

								<div className='w-full'>
									<section className='w-full  '>
										<article className=' flex text-base font-semibold py-4 text-slate-500 border-b border-slate-500 mb-3'>
											<p className='md:w-full hidden md:block text-start pl-2'>Fecha</p>
											<p className='md:w-full w-20 text-start pl-2'>Persona</p>
											<p className='md:w-full w-20 text-start pl-2'>Razon</p>
											<p className='md:w-full w-20 text-start pl-2'>Valor</p>
											<p className='md:w-full w-20 text-start pl-2'>Estado</p>
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
																<TooltipComponent
																	message={`${d?.person.slice(0, 10)}...`}
																	content={d?.person}
																/>
															) : (
																<p>{d?.person}</p>
															)}
														</TableCell>

														<TableCell className='font-medium md:w-full w-16 block md:hidden align-middle'>
															{d?.person.length >= 10 ? (
																<TooltipComponent
																	message={`${d?.person.slice(0, 10)}...`}
																	content={d?.person}
																/>
															) : (
																<p>{d?.person}</p>
															)}
														</TableCell>

														<TableCell className='font-medium md:w-full hidden md:block align-middle'>
															{d?.reason.length >= 20 ? (
																<TooltipComponent
																	message={`${d?.reason.slice(0, 20)}`}
																	content={d?.reason}
																/>
															) : (
																<p>{d?.reason}</p>
															)}
														</TableCell>

														<TableCell className='font-medium md:w-full block md:hidden w-20 align-middle'>
															{d?.reason.length >= 10 ? (
																<TooltipComponent
																	message={`${d?.reason.slice(0, 8)}...`}
																	content={d?.reason}
																/>
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
															<Button
																onClick={() => deleteDebt(d)}
																variant='ghost'
																className='w-full  '>
																<Trash className={'w-6'} />
															</Button>
															<Button
																variant='ghost'
																className='w-full '>
																<Edit className={'w-6'} />
															</Button>
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
			{visibilytToast && (
				<Toast
					visibility={visibilytToast}
					severity={responseDebt?.success == true ? 'success' : 'error'}
					message={responseDebt?.message}
				/>
			)}
		</main>
	);
};
