import {GetFixedExpenses} from '@/apis/ExpenseService';
import {GetWalletUser} from '@/apis/WalletService';
import {Update} from '@/assets/icons/Svg';
import {Chart} from '@/components/core/Chart';
import {AddDebt} from '@/components/core/Debts/AddDebt';
import {SeeDebt} from '@/components/core/Debts/SeeDebt';
import {AddExpense} from '@/components/core/Expenses/AddExpense';
import {SeeExpenses} from '@/components/core/Expenses/SeeExpenses';
import {Carrusel} from '@/components/others/Carrousel';
import {Table, TableBody, TableCell, TableRow} from '@/components/ui/table';
import {Expenses, ResponseWallet} from '@/interfaces/Wallet';
import '@/styles/Dashboard.css';
import {useEffect, useState} from 'react';

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
				<div className='flex justify-center items-center'>
					<Carrusel />
				</div>
			) : (
				<div className='md:grid grid-cols-5 grid-rows-10 h-screen pt-20 p-3 gap-3 bg-slate-950'>
					<section className='flex gap-10  col-span-3 row-span-2 '>
						<article className='w-full shadow-sm border-none bg-slate-900 rounded-xl p-3'>
							<div>
								<p>Tu salario:</p>
								<p className='text-green-500'>{userData?.wallet.salary.toLocaleString()}</p>
							</div>
						</article>
						<article className='w-full shadow-sm border-none bg-slate-900 rounded-xl p-3'>
							<div>
								<p>Ahorrado:</p>
								<p className='text-green-500'>{userData?.wallet.saving.toLocaleString()}</p>
							</div>
						</article>
						<article className='w-full shadow-sm border-none bg-slate-900 rounded-xl p-3'>
							<div>
								<p>Meta ahorras</p>
								<p className='text-green-500'>{userData?.wallet.saving.toLocaleString()}</p>
							</div>
						</article>
					</section>
					<div className=' flex flex-col row-span-10 col-span-2 gap-5'>
						<div className='shadow-sm h-4/5 w-full rounded-xl bg-slate-900 flex flex-col justify gap-3 p-5'>
							<div className='flex gap-10 items-center'>
								<h5 className='text-2xl'>Gastos fijos</h5>
								<button className={`${animateFixed ? 'animate-spin' : ''}`} onClick={showFixedExpenses}>
									<Update />
								</button>
							</div>

							<div className='w-full'>
								<section className='w-full '>
									<article className='flex text-lg font-semibold py-4 text-slate-500 border-b border-slate-500 mb-3'>
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
						<section className='shadow-sm h-2/6 w-full rounded-xl bg-slate-900 flex flex-col gap-6 p-5'>
							<article className='flex gap-3 '>
								<AddExpense apiData={userData?.wallet} />
								<AddDebt apiData={userData?.wallet} />
							</article>
							<span className=' '>Mas informaciòn sobre:</span>
							<article className='flex gap-3'>
								<SeeExpenses apiData={userData?.wallet} />
								<SeeDebt apiData={userData?.wallet} />
							</article>
						</section>
					</div>
					<section className='shadow-sm col-span-3 row-span-6 h-full rounded-xl bg-slate-900 p-5'>
						<Chart />
					</section>
					<section className='col-span-3 row-span-2 flex justify-between gap-5'>
						<div className='shadow-sm h-full w-full rounded-xl bg-slate-900'></div>
						<div className='shadow-sm h-full w-full rounded-xl bg-slate-900'></div>
					</section>
				</div>
			)}
		</main>
	);
};
