import { GetWalletUser } from '@/apis/WalletService';
import { Expense, Income } from '@/assets/icons/Svg';
import { Carrusel } from '@/components/Carrousel';
import { Chart } from '@/components/Chart';
// import LineChartUsageExampleWithClickEvent from '@/components/Chart';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Wallet, Debt } from '@/interfaces/Wallet';

import { useEffect, useState } from 'react';

// import Chip from '@mui/material/Chip';

export const Dashboard = () => {
	const [userId, setUserId] = useState<Wallet | undefined>(undefined);
	const [debtFrom, getDebtFrom] = useState<Array<Debt> | undefined>([]);
	const [debtTo, getDebtTo] = useState<Array<Debt> | undefined>([]);
	const [debt, setDebt] = useState(1);
	const [seeDebt, setSeeDebt] = useState(1);
	const [value, setValue] = useState('');
	const [name, setName] = useState('');
	const [reason, setReason] = useState('');

	useEffect(() => {
		const user = JSON.parse(localStorage.getItem('userMain'));

		GetWalletUser(user?.User_Id).then((r) => {
			setUserId(r);
			getDebtFrom(JSON.parse(r?.wallet?.DebtsFrom));
			getDebtTo(JSON.parse(r?.wallet?.DebtsTo));
		});
	}, []);

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
			setName(e.target.value);
		} else if (type === 'reason') {
			setReason(e.target.value);
		}
	};

	const submitDebt = async () => {
		const params = {
			name,
			value,
			reason,
		};
	

		console.log(params);
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
												onClick={() => setDebt(1)}
												className={`border  p-5 rounded-xl w-40 cursor-pointer ${
													debt === 1 ? 'border-green-300' : 'border-gray-200/50'
												}`}>
												<div className='flex justify-center flex-col items-center gap-2 '>
													<Income color={`${debt === 1 ? 'green' : 'gray'}`} />

													<label
														className={`${debt === 1 ? 'text-green-500' : 'opacity-15'} cursor-pointer`}
														htmlFor=''>
														Te debe...
													</label>
												</div>
											</div>
											<div
												onClick={() => setDebt(2)}
												className={`border  p-5 rounded-xl w-40 cursor-pointer ${debt === 2 ? 'border-red-300' : 'border-gray-200/50'}`}>
												<div className='flex justify-center flex-col items-center gap-2'>
													<Expense color={`${debt === 2 ? 'red' : 'gray'}`} />
													<label
														className={`${debt === 2 ? 'text-red-500' : 'opacity-15'} cursor-pointer`}
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
													value={name}
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
											disabled={debt === 0 || name === '' || reason === '' || value === '' || value === '0'}
											onClick={submitDebt}
											className={` py-2 rounded-md text-white ${
												debt === 0 || name === '' || reason === '' || value === '' || value === '0' ? 'bg-gray-200 ' : ' bg-slate-800'
											}`}>
											Confirmar
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
										<Button className='w-full py-6  bg-slate-700 text-white'>Ver tus deudas</Button>
									</DialogTrigger>
									<DialogContent className='sm:max-w-[425px]'>
										<DialogHeader>
											<DialogTitle>Tus deudas</DialogTitle>
											<DialogDescription>Selecciona que tipo de deuda deseas ver</DialogDescription>
										</DialogHeader>
										<div className='p-2'>
											<div className='flex justify-evenly gap-5'>
												<div
													onClick={() => setSeeDebt(1)}
													className={`border  p-5 rounded-xl w-40 cursor-pointer ${
														seeDebt === 1 ? 'border-green-300' : 'border-gray-200/50'
													}`}>
													<div className='flex justify-center flex-col items-center gap-2 '>
														<Income color={`${seeDebt === 1 ? 'green' : 'gray'}`} />

														<label
															className={`${seeDebt === 1 ? 'text-green-500' : 'opacity-15'} cursor-pointer`}
															htmlFor=''>
															Te debe...
														</label>
													</div>
												</div>
												<div
													onClick={() => setSeeDebt(2)}
													className={`border  p-5 rounded-xl w-40 cursor-pointer ${
														debt === 2 ? 'border-red-300' : 'border-gray-200/50'
													}`}>
													<div className='flex justify-center flex-col items-center gap-2'>
														<Expense color={`${seeDebt === 2 ? 'red' : 'gray'}`} />
														<label
															className={`${seeDebt === 2 ? 'text-red-500' : 'opacity-15'} cursor-pointer`}
															htmlFor=''>
															Debes a ...
														</label>
													</div>
												</div>
											</div>

											{seeDebt == 1 &&
												debtFrom?.map((e) => (
													<div
														className='p-5 bg-slate-800 rounded-lg mt-5 h-32 overflow-auto'
														key={e.id}>
														<p className='text-lg text-balance tracking-wide'>
															<span className='font-bold'>{e?.fromPerson}</span> te debe:
															<span className='text-green-500'>{e?.value}</span>, el motivo es:
															<span className='font-bold'> {e?.reason}</span>
														</p>
													</div>
												))}
											{seeDebt == 1 && debtFrom == null ? (
												<p className='text-lg text-center  text-pretty p-5 bg-slate-800 rounded-lg mt-5 h-32'>
													No tienen deudas pendientes contigo
												</p>
											) : (
												''
											)}

											{seeDebt == 2 &&
												debtTo?.map((e) => (
													<div
														className='p-5 bg-slate-800 rounded-lg mt-5 h-32 overflow-auto'
														key={e.id}>
														<span className='font-bold'>{e?.toPerson}</span> te debe: <span className='text-green-500'>{e?.value}</span>
														, el motivo es: <span className='font-bold'> {e?.reason}</span>
													</div>
												))}
											{seeDebt == 2 && debtTo == null ? (
												<p className='text-lg text-center  text-pretty p-5 bg-slate-800 rounded-lg mt-5 h-32'>
													😄 Felicitaciones, no tienes deudas pendientes con otra/s persona
												</p>
											) : (
												''
											)}
										</div>
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
		</main>
	);
};
