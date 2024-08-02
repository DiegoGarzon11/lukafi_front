import { GetFixedExpenses } from '@/apis/ExpenseService';
import { GetWalletUser } from '@/apis/WalletService';
import { Update, Warning } from '@/assets/icons/Svg';
import { Chart, ChartDonut } from '@/components/core/Chart';
import { AddDebt } from '@/components/core/Debts/AddDebt';
import { SeeDebt } from '@/components/core/Debts/SeeDebt';
import { AddExpense } from '@/components/core/Expenses/AddExpense';
import { SeeExpenses } from '@/components/core/Expenses/SeeExpenses';
import { Carrusel } from '@/components/others/Carrousel';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Expenses, ResponseWallet } from '@/interfaces/Wallet';
import '@/styles/Dashboard.css';
import { useEffect, useState } from 'react';

export const Dashboard = () => {
	const [userData, setDataUser] = useState<ResponseWallet | undefined>(undefined);
	const [fixedExpenses, setFixedExpenses] = useState<Array<Expenses> | undefined>(undefined);
	const [animateFixed, setAnimateFixed] = useState(false);
	const user = JSON.parse(localStorage.getItem('userMain'));
	const showFixedExpenses = async () => {
		setAnimateFixed(true);
		await GetFixedExpenses(userData?.wallet?.wallet_id).then((e) => {
			setFixedExpenses(e?.expenses);
			setAnimateFixed(false);
		});
	};
	useEffect(() => {
		GetWalletUser(user?.user_id).then((r) => {
			setDataUser(r);
			GetFixedExpenses(r?.wallet?.wallet_id).then((e) => {
				setFixedExpenses(e?.expenses);
			});
		});
	}, []);

	return (
		<main>
			{userData && userData?.status === 404 ? (
				<div className='flex justify-center items-center  '>
					<Carrusel />
				</div>
			) : (
				<div className='flex flex-col md:grid md:grid-cols-3 md:5 h-screen pt-20 p-8  gap-8 bg-slate-950  '>
					<section className='flex   md:col-span-3 md:row-span-5 flex-wrap md:flex-nowrap  gap-8  -order-1'>
						<article className=' w-[48%] md:w-full h-24  md:h-full shadow-sm border-none  bg-slate-900 rounded-xl  p-3'>
							<div>
								<p>Tu salario:</p>
								<p className='text-green-500'>{userData?.wallet.salary.toLocaleString()}</p>
							</div>
						</article>
						<article className=' w-[48%] md:w-full h-24 md:h-full shadow-sm border-none  bg-slate-900 rounded-xl  p-3'>
							<div>
								<p>Ahorrado:</p>
								<p className='text-green-500'>{userData?.wallet.saving.toLocaleString()}</p>
							</div>
						</article>
						<article className='w-full h-24  md:h-full shadow-sm border-none  bg-slate-900 rounded-xl  p-3'>
							<div>
								<p>Meta ahorras</p>
								<p className='text-green-500'>{userData?.wallet.saving.toLocaleString()}</p>
							</div>
						</article>
					</section>
					<section className=' shadow-sm md:col-span-3 md:row-span-6  rounded-xl    gap-8'>
						<div className=' shadow-sm  h-full   rounded-xl bg-slate-900 flex flex-col  gap-3 p-5 '>
							<article className='flex  gap-3 '>
								<AddExpense apiData={userData?.wallet} />
								<AddDebt apiData={userData?.wallet} />
							</article>
							<span className=' '>Mas informaciòn sobre:</span>
							<article className='flex gap-3'>
								<SeeExpenses apiData={userData?.wallet} />
								<SeeDebt apiData={userData?.wallet} />
							</article>
						</div>
					</section>
					<section className=' shadow-sm md:col-span-3 md:row-span-6  rounded-xl    flex justify-around gap-8'>
						<div className='w-5/6 bg-slate-900/50  shadow-sm rounded-xl p-5 flex justify-around '>
							<div className='flex flex-col w-full h-full'>
								<div className='flex items-center justify-between'>
									<p className='text-lg'>
										Obervar <span className='font-semibold'>gastos</span>
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
							<div className='flex items-center text-xl font-semibold text-pretty'>
								<p className='absolute left-[500px] flex gap-2 items-center'>
									<Warning /> En proceso.
								</p>
							</div>
						</div>
						<div className='w-full bg-slate-900  shadow-sm rounded-xl p-5'>
							<div className='flex justify-between items-center mb-10'>
								<p className=''>Dashboard</p>
								<div className='flex gap-5'>
									<Button className=''>Dias</Button>
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
							<Chart />
						</div>
					</section>
					<section className=' shadow-sm md:col-span-3 md:row-span-2  rounded-xl  bg-slate-900  pt-4  '>
						<div className='  h-4/5 w-full rounded-xl  bg-slate-900 flex flex-col justify gap-3 p-5 order-3 '>
							<div className='flex gap- items-center'>
								<h5 className='text-2xl'>Gastos fijos</h5>
								<button
									className={`${animateFixed ? 'animate-spin' : ''}  `}
									onClick={showFixedExpenses}>
									<Update />
								</button>
							</div>

							<div className='w-full'>
								<section className='w-full '>
									<article className=' flex text-lg font-semibold py-4 text-slate-500 border-b border-slate-500 mb-3'>
										<p className='w-40 text-center ubnder¿'>nombre</p>
										<p className='w-40 text-center'>valor</p>
										<p className='w-40 text-center'>fecha limite</p>
									</article>
								</section>

								<div className='w-full h-52 overflow-auto overflow-x-hidden scrollbar-custom'>
									<Table className='w-full'>
										<TableBody>
											{fixedExpenses?.map((f) => (
												<TableRow key={f.expense_id}>
													<TableCell className='text-lg text-center w-40'>{f.name}</TableCell>
													<TableCell className='text-lg text-center w-40'>{f.value.toLocaleString()}</TableCell>
													<TableCell className='w-40 text-lg text-center'>
														{f.dead_line ? new Date(f.dead_line).toLocaleDateString() : ''}
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</div>
							</div>
						</div>
					</section>
				</div>
			)}
		</main>
	);
};
