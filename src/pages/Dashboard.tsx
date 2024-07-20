import { GetWalletUser } from '@/apis/WalletService';
import { DeleteDebt, GetDebts, NewDebt } from '@/apis/DebtService';
import { Edit, Expense, Income, Trash } from '@/assets/icons/Svg';
import { Carrusel } from '@/components/Carrousel';
import { Chart } from '@/components/Chart';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Wallet, Debt, ApiResponse } from '@/interfaces/Wallet';
import { Loader } from '@/assets/icons/Svg';
import { useEffect, useState } from 'react';
import '@/styles/Dashboard.css';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Toast } from '@/tools/Toast';
import { TooltipComponent } from '@/components/Tooltip';

export const Dashboard = () => {
	const [userId, setUserId] = useState<Wallet | undefined>(undefined);
	const [debts, setDebts] = useState<Array<Debt> | undefined>([]);
	const [debtType, setDebtType] = useState(null);
	const [value, setValue] = useState('');
	const [person, setPerson] = useState('');
	const [reason, setReason] = useState('');
	const [loader, setLoader] = useState(false);
	const [responseDebt, setresponseDebt] = useState<ApiResponse | undefined>(null);
	const [visibilytToast, setVisibilityToast] = useState(false);
	const user = JSON.parse(localStorage.getItem('userMain'));
	useEffect(() => {
		GetWalletUser(user?.User_id).then((r) => {
			setUserId(r);
		});
	}, []);

	async function getDebts() {
		const params = {
			Wallet_id: userId?.wallet?.Wallet_id,
		};

		const response = await GetDebts(params);

		setDebts(response?.response);
	}

	const handleValues = (e, type) => {
		if (type === 'money') {
			let value = e.target.value.replace(/[^0-9.]/g, '');
			if (value === '') {
				value = 0;
			}
			const floatValue = parseFloat(value);
			const formattedValue = floatValue.toLocaleString();

			setValue(formattedValue);
		} else if (type === 'name') {
			setPerson(e.target.value);
		} else if (type === 'reason') {
			setReason(e.target.value);
		}
	};

	const submitDebt = async () => {
		setLoader(true);

		const params = {
			User_id: userId?.wallet?.User_id,
			Wallet_id: userId?.wallet?.Wallet_id,
			person,
			value,
			reason,
			debtType,
		};

		const response = await NewDebt(params);

		if (response) {
			setresponseDebt(response);
			setVisibilityToast(true);
			setValue('');
			setPerson('');
			setReason('');
			setDebtType(null);
			setLoader(false);
		}

		setTimeout(() => {
			setVisibilityToast(false);
			setresponseDebt(null);
		}, 1000);
	};
	const deleteDebt = async (e) => {
		const params = {
			Debt_id: e?.Debt_id,
			Wallet_id: e?.Wallet_id,
		};
		const responseDeleteDebt = await DeleteDebt(params);
		if (responseDeleteDebt) {
			setresponseDebt(responseDeleteDebt);
			getDebts();
			setVisibilityToast(true);
		}

		setTimeout(() => {
			setVisibilityToast(false);
			setresponseDebt(null);
		}, 1000);
	};

	return (
		<main>
			{userId && userId?.status === 404 ? (
				<div className='flex justify-center items-center  '>
					<Carrusel />
				</div>
			) : (
				<div className='md:grid grid-cols-4 grid-rows-10 h-screen pt-20 p-10 gap-5 bg-slate-950'>
					<section className='flex gap-10  col-span-3 row-span-2 '>
						<Card className='w-full shadow-sm border-none  bg-slate-800'>
							<div>
								<p>Tu salario:</p>
								<p className='text-green-500'>{userId?.wallet?.Salary}</p>
							</div>
						</Card>
						<Card className='w-full shadow-sm border-none  bg-slate-800'>
							<div>
								<p>Ahorrado:</p>
								<p className='text-green-500'>{userId?.wallet?.Salary}</p>
							</div>
						</Card>
						<Card className='w-full shadow-sm border-none  bg-slate-800'>
							<div>
								<p>Meta ahorras</p>
								<p className='text-green-500'>{userId?.wallet?.Saving}</p>
							</div>
						</Card>
					</section>
					<section className=' flex flex-col row-span-10 gap-5  '>
						<div className=' shadow-sm  h-full w-full rounded-xl bg-slate-800 flex flex-col  gap-24 pt-5 px-5 '>
							<div className='w-full flex flex-col gap-3'>
								<Dialog>
									<DialogTrigger asChild>
										<Button className='w-full py-6  bg-slate-700 text-white'>Agregar deuda</Button>
									</DialogTrigger>
									<DialogContent className='sm:max-w-[425px] '>
										<DialogHeader>
											<DialogTitle>Nueva deuda</DialogTitle>
											<DialogDescription>
												Selecciona la opción que deseas y escribe los datos de la persona relacionada a la deuda
											</DialogDescription>
										</DialogHeader>
										<div className='flex justify-evenly gap-5'>
											<div
												onClick={() => setDebtType(1)}
												className={`border  p-5 rounded-xl w-40 cursor-pointer ${
													debtType === 1 ? 'border-green-300' : 'border-gray-200/50'
												}`}>
												<div className='flex justify-center flex-col items-center gap-2 '>
													<Income color={`${debtType === 1 ? 'green' : 'gray'}`} />

													<label
														className={`${debtType === 1 ? 'text-green-500' : 'opacity-15'} cursor-pointer`}
														htmlFor=''>
														Te debe...
													</label>
												</div>
											</div>
											<div
												onClick={() => setDebtType(0)}
												className={`border  p-5 rounded-xl w-40 cursor-pointer ${
													debtType === 2 ? 'border-red-300' : 'border-gray-200/50'
												}`}>
												<div className='flex justify-center flex-col items-center gap-2'>
													<Expense color={`${debtType === 0 ? 'red' : 'gray'}`} />
													<label
														className={`${debtType === 0 ? 'text-red-500' : 'opacity-15'} cursor-pointer`}
														htmlFor=''>
														Debes a ...
													</label>
												</div>
											</div>
										</div>
										<div className='flex gap-5 items-center'>
											<div>
												<label htmlFor=''>
													Nombre <span className='text-red-500'>*</span>
												</label>
												<Input
													value={person}
													onChange={(e) => handleValues(e, 'name')}
												/>
											</div>
											<div>
												<label htmlFor=''>
													Valor $ <span className='text-red-500'>*</span>
												</label>
												<Input
													id='value_income'
													type='text'
													value={value}
													onChange={(e) => handleValues(e, 'money')}
												/>
											</div>
										</div>
										<div>
											<label htmlFor=''>
												Motivo <span className='text-red-500'>*</span>{' '}
											</label>

											<Input
												id='value_income'
												type='text'
												value={reason}
												onChange={(e) => handleValues(e, 'reason')}
											/>
										</div>
										<button
											disabled={debtType === null || person === '' || reason === '' || value === '' || value === '0'}
											onClick={submitDebt}
											className={` py-2 rounded-md text-white flex justify-center ${
												debtType === null || person === '' || reason === '' || value === '' || value === '0'
													? 'bg-gray-200 '
													: ' bg-slate-800'
											}`}>
											{loader ? <Loader /> : 'Confirmar'}
										</button>
									</DialogContent>
								</Dialog>
								<Dialog>
									<DialogTrigger asChild>
										<Button className='w-full py-6  bg-slate-700 text-white'>Agregar ingreso</Button>
									</DialogTrigger>
									<DialogContent className='sm:max-w-[425px]'>
										<DialogHeader>
											<DialogTitle>Nuevo ingreso</DialogTitle>
											<DialogDescription>Make changes to your profile here. Click save when you're done.</DialogDescription>
										</DialogHeader>
										<div className='grid gap-4 py-4'>
											<div className='grid grid-cols-4 items-center gap-4'></div>
											<div className='grid grid-cols-4 items-center gap-4'></div>
										</div>
									</DialogContent>
								</Dialog>
								<Dialog>
									<DialogTrigger asChild>
										<Button className='w-full py-6  bg-slate-700 text-white'>Agregar gasto</Button>
									</DialogTrigger>
									<DialogContent className='sm:max-w-[425px]'>
										<DialogHeader>
											<DialogTitle>Nuevo gasto</DialogTitle>
											<DialogDescription>Make changes to your profile here. Click save when you're done.</DialogDescription>
										</DialogHeader>
										<div className='grid gap-4 py-4'>
											<div className='grid grid-cols-4 items-center gap-4'></div>
											<div className='grid grid-cols-4 items-center gap-4'></div>
										</div>
									</DialogContent>
								</Dialog>
							</div>
						</div>
						<div className='shadow-sm  h-full w-full rounded-xl  bg-slate-800 flex flex-col justify gap-24 pt-5 px-5 '>
							<Card className='w-full shadow-sm border-none  bg-slate-700'>
								<Dialog>
									<DialogTrigger asChild>
										<Button
											onClick={() => getDebts()}
											className='w-full py-6  bg-slate-700 text-white'>
											Ver tus deudas
										</Button>
									</DialogTrigger>
									<DialogContent
										className='w-auto'
										aria-describedby={undefined}>
										<DialogHeader>
											<DialogTitle>Tus deudas</DialogTitle>
										</DialogHeader>
										{debts !== null ? (
											<Table className=''>
												<TableCaption>A list of your recent invoices.</TableCaption>
												<TableHeader>
													<TableRow className=' text-base pt-4 '>
														<TableHead className='w-40'>Fecha</TableHead>
														<TableHead className='w-40'>Persona</TableHead>
														<TableHead className='w-40'>Razón</TableHead>
														<TableHead className='w-40'>Valor</TableHead>
														<TableHead className='w-40'>estado</TableHead>
														<TableHead className='w-40' />
													</TableRow>
												</TableHeader>

												<TableBody className=' h-[500px] overflow-auto  overflow-x-hidden   scrollbar-custom'>
													{debts.map((d) => (
														<TableRow key={d?.Debt_id}>
															<TableCell className='font-medium flex gap-10 items-center w-40'>
																<p>{new Date(JSON.parse(d?.CreatedOn)).toLocaleDateString()}</p>
															</TableCell>
															<TableCell className='font-medium w-40'>
																{d?.Person.length >= 10 ? (
																	<TooltipComponent
																		message={`${d?.Person.slice(0, 10)}...`}
																		content={d?.Person}
																	/>
																) : (
																	<p>{d?.Person}</p>
																)}
															</TableCell>
															<TableCell className='font-medium w-40'>
																<p>{d?.Reason}</p>
															</TableCell>
															<TableCell className='font-medium w-40'>
																<p>{d?.Value}</p>
															</TableCell>
															<TableCell className='font-medium w-40'>
																<p
																	className={` rounded-md px-2 py-1 text-start ${
																		d?.DebtType == 0 ? 'text-red-500' : 'text-green-500'
																	}`}>
																	{d?.DebtType == 0 ? 'Debes' : 'Te deben'}
																</p>
															</TableCell>
															<TableCell className='font-medium flex  w-40'>
																<Button
																	onClick={() => deleteDebt(d)}
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
										) : (
											<p> No se encontraron deudas pendientes</p>
										)}
									</DialogContent>
								</Dialog>
							</Card>
						</div>
					</section>
					<section className=' shadow-sm col-span-3 row-span-6 h-full rounded-xl  bg-slate-800 p-5'>
						<Chart />
					</section>
					<section className='  col-span-3 row-span-2  flex justify-between gap-5'>
						<div className='shadow-sm  h-full w-full rounded-xl  bg-slate-800 '></div>
						<div className='shadow-sm  h-full w-full rounded-xl  bg-slate-800'></div>
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
