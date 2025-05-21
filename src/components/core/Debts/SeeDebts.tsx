import { addAmount, DeleteDebt, GetDebts, GetDebtToHistory } from '@/apis/DebtService';
import { GetWalletUser } from '@/apis/WalletService';
import { LoaderApi } from '@/assets/icons/Svg';
import { TooltipComponent } from '@/components/others/Tooltip';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ApiResponse } from '@/interfaces/Api';
import { Debt, DebtsHistory, ResponseWallet } from '@/interfaces/Wallet';

import { Toast } from '@/hooks/Toast';
import { format } from 'date-fns';
import { EllipsisVertical, NotebookPen, ScrollText, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AddDebt } from './AddDebt';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { LoaderComponent } from '@/components/others/Loader';
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination';

export const SeeDebts = () => {
	const [debts, setDebts] = useState<Array<Debt> | undefined>([]);
	const [debtToAddAmount, setDebtToAddAmount] = useState<Debt | undefined>(undefined);
	const [openAddAmountDialog, setOpenAddAmountDialog] = useState(false);
	const [amountToSee, setAmountToSee] = useState<Array<DebtsHistory> | undefined>([]);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [debtToDelete, setDebtToDelete] = useState<Debt | undefined>(undefined);
	const [openAmountDialog, setOpenAmountDialog] = useState(false);
	const [visibilityToast, setVisibilityToast] = useState(false);
	const [ApiResponse, setApiResponse] = useState<ApiResponse | undefined>(null);
	const [loader, setLoader] = useState(false);
	const [amount, setAmount] = useState('');
	const [trigger, setTrigger] = useState(0);
	const [userData, setDataUser] = useState<ResponseWallet | undefined>(undefined);
	const [fetching, setFetching] = useState(true);

	const { t, i18n } = useTranslation();
	i18n.changeLanguage();
	const user = JSON.parse(localStorage.getItem('userMain'));

	const getDebts = async (walletId) => {
		const debts = await GetDebts(walletId);
		setDebts(debts?.debts);
	};
	useEffect(() => {
		const fetchData = async () => {
			const dataUser = await GetWalletUser(user?.user_id);
			setDataUser(dataUser);
			getDebts(dataUser?.wallet);
			setFetching(false);
		};

		fetchData();
	}, [trigger]);

	const setDebtToHistory = async (debt) => {
		const getDebt = await GetDebtToHistory(debt);
		return setAmountToSee(getDebt?.debts);
	};
	const recibeResponseChild = async (e) => {
		if (e) {
			return setTrigger((prev) => prev + 1);
		}
	};

	const handleValues = (e) => {
		if (e.target.value.replace(/[^0-9.]/g, '') > Number(debtToAddAmount?.missing_payment)) {
			return;
		}
		let value = e.target.value.replace(/[^0-9.]/g, '');
		if (value === '') {
			value = 0;
		}

		const floatValue = parseFloat(value);
		const formattedValue = floatValue.toLocaleString();

		setAmount(formattedValue);
		return;
	};
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
			setOpenDeleteDialog(false);
			setDebtToDelete(null);
		}
	};
	const submitAmount = async () => {
		const params = {
			wallet_id: debtToAddAmount.wallet_id,
			debt_id: debtToAddAmount.debt_id,
			amount: amount.replace(/,/g, ''),
		};

		const response = await addAmount(params);
		setAmount('');
		setDebtToAddAmount(null);
		setOpenAddAmountDialog(false);
		if (response) {
			setApiResponse(response);
			setVisibilityToast(true);
			getDebts(userData.wallet);
		}
		setTimeout(() => {
			setVisibilityToast(false);
			setApiResponse(null);
		}, 1000);
	};
	if (fetching) {
		return <LoaderComponent />;
	}
	return (
		<main className='pt-20 px-3 '>
			<nav className='flex w-full justify-between items-center pb-3 dark:text-white'>
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink className='text-base'>Billetera</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage className='text-base'>Deudas</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>

				<AddDebt
					className='md:w-1/5 w-1/2 border border-border'
					sendData={(e) => recibeResponseChild(e)}
					apiData={userData?.wallet}
				/>
			</nav>
			<section className=' shadow-xs md:col-span-3 row-span-9 '>
				<div className='  w-full  flex  justify-between gap-5 order-3'>
					<div className='dark:bg-dark_primary_color bg-light_primary_color p-2.5 w-full rounded-xl '>
						<div className='flex gap-3 flex-col items-start '>
							<h5 className='text-2xl dark:text-white'> {t('dashboard.allDebts')} </h5>
							<div className='w-9/12 my-3'>
								<Input
									
									placeholder='Buscar'
									className='dark:text-white '
								/>
							</div>
							<div className='flex gap-3 items-center dark:text-white'>
								<p className='h-2 w-2 rounded-full bg-red-500'></p> <span>Debes</span>
								<p className='h-2 w-2 rounded-full bg-green-500 '></p>
								<span className=''>Te deben</span>
							</div>
						</div>

						<div className='w-full'>
							<section className='w-full  '>
								<article className=' flex text-base font-semibold py-4 dark:text-zinc-300 text-slate-500 border-b border-slate-500/50 mb-3'>
									<p className='w-full  hidden md:block pl-2'>{t('dashboard.date')}</p>
									<p className='w-full '>{t('dashboard.person')}</p>
									<p className='w-full  '>{t('dashboard.reason')}</p>
									<p className='w-full '>{t('dashboard.value')}</p>
									<p className='w-full hidden md:block'>{t('dashboard.state')}</p>
									<p className='w-full hidden md:block '>{t('dashboard.deadLine')}</p>
									<p className='w-20 md:w-full' />
								</article>
							</section>

							<div className="w-full h-[calc(100vh-478px)] max-h-screen overflow-auto scrollbar-custom">
								{debts.length == 0 ? (
									<p className='text-center text-lg mt-5 text-main_color'>Actualmente no tienes ningún deuda</p>
								) : (
									<Table className='w-full'>
										<TableBody className=' w-full scrollbar-custom'>
											{debts?.map((d) => (
												<TableRow
													key={d?.debt_id}
													className='border-b  border-gray-600/20 dark:text-white textsta'>
													<TableCell className='font-medium  w-full  hidden md:block'>
														<p>{new Date(d?.created_in).toLocaleDateString()}</p>
													</TableCell>
													<TableCell className='font-medium w-full  hidden md:block'>
														{d?.person.length >= 10 ? (
															<TooltipComponent
																message={`${d?.person.slice(0, 10)}...`}
																content={d?.person}
															/>
														) : (
															<p>{d?.person}</p>
														)}
													</TableCell>

													<TableCell className='font-medium w-full  block md:hidden align-middle'>
														{d?.person.length >= 10 ? (
															<TooltipComponent
																message={`${d?.person.slice(0, 10)}...`}
																content={d?.person}
															/>
														) : (
															<p>{d?.person}</p>
														)}
													</TableCell>

													<TableCell className='font-medium w-full   align-middle'>
														{d?.reason.length >= 10 ? (
															<TooltipComponent
																className={` rounded-md  py-1 text-start  ${
																	d?.debt_type == 0
																		? 'text-red-500  underline decoration-blue-500 decoration-2'
																		: 'text-green-500 underline decoration-blue-500 decoration-2'
																}`}
																message={`${d?.reason.slice(0, 8)}...`}
																content={d?.reason}
															/>
														) : (
															<p className={` rounded-md py-1 text-start  ${d?.debt_type == 0 ? 'text-red-500 ' : 'text-green-500 '}`}>
																{d?.reason}
															</p>
														)}
													</TableCell>
													<TableCell className='font-medium w-full  align-middle'>
														<p>$ {d?.missing_payment.toLocaleString()}</p>
														<p className='opacity-55 text-nowrap'>$ {d?.value.toLocaleString()}</p>
													</TableCell>
													<TableCell className='font-medium w-full hidden md:block '>
														{d?.missing_payment === 0 ? (
															<p className='text-blue-500'>Pagado</p>
														) : (
															<p className={` rounded-md py-1 text-start  ${d?.debt_type == 0 ? 'text-red-500' : 'text-green-500'}`}>
																{d?.debt_type == 0 ? 'Debes' : 'Te deben'}
															</p>
														)}
													</TableCell>
													<TableCell className='font-medium w-full hidden md:block '>
														<p>{d?.dead_line ? format(new Date(d?.dead_line), 'PP') : 'Sin fecha limite'}</p>
													</TableCell>
													<TableCell className='font-medium   w-auto md:w-full text-end md:text-center  '>
														<DropdownMenu>
															<DropdownMenuTrigger className='cursor-pointer'>
																<EllipsisVertical />
															</DropdownMenuTrigger>
															<DropdownMenuContent className='dark:text-white dark:bg-dark_secondary_color bg-light_secondary_color w-44 '>
																<DropdownMenuItem
																	disabled={d?.missing_payment === 0}
																	onClick={() => {
																		setDebtToAddAmount(d);
																		setOpenAddAmountDialog(true);
																	}}
																	className='dark:hover:bg-zinc-700 cursor-pointer flex justify-between'>
																	<p className='dark:text-slate-300text-slate-700 font-semibold'>{t('dashboard.debt.addAmount')}</p>

																	<NotebookPen className='dark:text-slate-300text-slate-700' />
																</DropdownMenuItem>
																<DropdownMenuItem
																	onClick={() => {
																		setDebtToHistory(d);

																		setOpenAmountDialog(true);
																	}}
																	className='dark:hover:bg-zinc-700 cursor-pointer flex justify-between'>
																	<p className='dark:text-slate-300text-slate-700 font-semibold'>{t('dashboard.debt.seeAmount')}</p>

																	<ScrollText className='dark:text-slate-300text-slate-700' />
																</DropdownMenuItem>

																<DropdownMenuItem
																	onClick={() => {
																		setDebtToDelete(d);
																		setOpenDeleteDialog(true);
																	}}
																	className='dark:hover:bg-zinc-700 cursor-pointer flex justify-between'>
																	<p className='dark:text-slate-300text-slate-700 font-semibold'>{t('dashboard.delete')}</p>

																	<Trash2 className='dark:text-slate-300text-slate-700' />
																</DropdownMenuItem>
															</DropdownMenuContent>
														</DropdownMenu>
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								)}
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
					className=' w-[95%] md:w-[500px] rounded-md bg-light_secondary_color dark:bg-dark_secondary_color dark:text-white '>
					<DialogHeader>
						<DialogTitle className='my-3'>
							<p className='my-3 font-bold text-2xl'> {t('dashboard.confirmDelete')} </p>

							<>
								<p className='mb-3 opacity-80'>
									
									Al eliminar la deuda se eliminará también el historial de montos correspondientes a la misma.
								</p>
								<p className='text-balance   '>
									{t('dashboard.removeDebt')} <span className='font-semibold text-main_color'>{debtToDelete?.reason}</span> ?
								</p>
							</>
						</DialogTitle>
						<DialogDescription className='flex justify-end items-end gap-5 h-full'>
							<Button
								className='w-full bg-red-500 text-white cursor-pointer'
								onClick={() => setOpenDeleteDialog(false)}>
								{t('dashboard.cancel')}
							</Button>

							<Button
								onClick={() => deleteDebt(debtToDelete)}
								variant='ghost'
								className='w-full bg-alternative_color text-white cursor-pointer'>
								{loader ? <LoaderApi color='white' /> : `${t('dashboard.delete')}`}
							</Button>
						</DialogDescription>
					</DialogHeader>
				</DialogContent>
			</Dialog>
			<Dialog
				open={openAmountDialog}
				onOpenChange={setOpenAmountDialog}>
				<DialogContent
					aria-describedby={null}
					className=' w-[95%] md:w-[500px] rounded-md dark:bg-dark_secondary_color bg-light_secondary_color dark:text-white '>
					<DialogHeader>
						<DialogTitle className='my-3'>
							<p className='my-3 font-bold text-2xl text-center border-y-4 border-dashed py-3 dark:border-white border-black'>
								Historial de pagos
							</p>
							{amountToSee?.length > 0 ? (
								<Table className='flex flex-col gap-3'>
									<TableHeader>
										<TableRow className='flex justify-between items-center  pt-5 '>
											<TableHead className='dark:text-white text-black'>N°</TableHead>
											<TableHead className='dark:text-white text-black'>Fecha/hora</TableHead>
											<TableHead className='dark:text-white text-black'>Monto</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody className=' pb-5 h-72 scrollbar-custom'>
										{amountToSee.map((amount, i) => (
											<TableRow
												className='flex justify-between px-5'
												key={amount.id}>
												<TableCell className='font-normal'>{i + 1}</TableCell>

												<TableCell className='font-normal'>{format(new Date(amount.date), 'MMM d, yy / HH:mm')}</TableCell>
												<TableCell className=' font-bold'>$ {amount.amount.toLocaleString()}</TableCell>
											</TableRow>
										))}
									</TableBody>
									<TableFooter>
										<TableRow className='flex justify-between px-5'>
											<TableCell colSpan={3}>Total</TableCell>
											<TableCell className='text-left'>
												$ {amountToSee.reduce((a: number, c: DebtsHistory) => a + c.amount, 0).toLocaleString()}
											</TableCell>
										</TableRow>
									</TableFooter>
									<TableCaption>Lista de pagos realizados</TableCaption>
								</Table>
							) : (
								<div className='flex justify-center items-center'>
									<p className='text-center text-lg mt-5 text-main_color'>Actualmente no tienes historial de ningun monto realizado</p>
								</div>
							)}
						</DialogTitle>
					</DialogHeader>
				</DialogContent>
			</Dialog>
			<Dialog
				open={openAddAmountDialog}
				onOpenChange={setOpenAddAmountDialog}>
				<DialogContent
					aria-describedby={null}
					className=' w-[95%] md:w-[500px] rounded-md '>
					<DialogHeader>
						<DialogTitle className='my-3'>
							<p className='my-3 font-bold text-2xl text-center  py-3 dark:border-white border-black'>Agrega el monto de la deuda</p>
						</DialogTitle>
						<div className='flex flex-col justify-center gap-5 h-full '>
							<p className='text-white font-semibold text-base text-pretty'>
								<span className='text-red-500 mx-2'>*</span>El monto a agregar no puede ser mayor a la deuda
							</p>
							<Input
								className='border dark:border-zinc-400 dark:bg-zinc-800/30 text-white'
								value={amount}
								onChange={handleValues}
							/>
							<div className='flex justify-evenly items-center gap-5'>
								<div className='text-center text-lg  text-red-500'>
									<p>Antes de agregar</p>
									<p className='font-semibold'>{debtToAddAmount?.missing_payment.toLocaleString()}</p>
								</div>
								<div className='text-center text-lg  text-green-500'>
									<p>Con el monto a agregar</p>
									<p className='font-semibold'>
										{(Number(debtToAddAmount?.missing_payment) - Number(amount.replace(/,/g, ''))).toLocaleString()}
									</p>
								</div>
							</div>

							<Button onClick={submitAmount}>Confirmar</Button>
						</div>
					</DialogHeader>
				</DialogContent>
			</Dialog>
		</main>
	);
};
