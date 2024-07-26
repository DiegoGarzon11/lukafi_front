import { GetWalletUser } from '@/apis/WalletService';
import { Chart } from '@/components/core/Chart';
import { AddDebt } from '@/components/core/Debts/AddDebt';
import { SeeDebt } from '@/components/core/Debts/SeeDebt';
import { AddExpense } from '@/components/core/Expenses/AddExpense';
import { Carrusel } from '@/components/others/Carrousel';
import { Wallet } from '@/interfaces/Wallet';
import '@/styles/Dashboard.css';
import { useEffect, useState } from 'react';

export const Dashboard = () => {
	const [userData, setDataUser] = useState<Wallet | undefined>(undefined);
	const user = JSON.parse(localStorage.getItem('userMain'));
	useEffect(() => {
		GetWalletUser(user?.User_id).then((r) => {
			setDataUser(r);
		});
	}, []);

	return (
		<main>
			{userData && userData?.status === 404 ? (
				<div className='flex justify-center items-center  '>
					<Carrusel />
				</div>
			) : (
				<div className='md:grid grid-cols-4 grid-rows-10 h-screen pt-20 p-10 gap-5 bg-slate-950'>
					<section className='flex gap-10  col-span-3 row-span-2 '>
						<article className='w-full shadow-sm border-none  bg-slate-800 rounded-xl  p-3'>
							<div>
								<p>Tu salario:</p>
								<p className='text-green-500'>{parseInt(userData?.wallet?.Salary).toLocaleString()}</p>
							</div>
						</article>
						<article className='w-full shadow-sm border-none  bg-slate-800 rounded-xl  p-3'>
							<div>
								<p>Ahorrado:</p>
								<p className='text-green-500'>{parseInt(userData?.wallet?.Salary).toLocaleString()}</p>
							</div>
						</article>
						<article className='w-full shadow-sm border-none  bg-slate-800 rounded-xl  p-3'>
							<div>
								<p>Meta ahorras</p>
								<p className='text-green-500'>{parseInt(userData?.wallet?.Saving).toLocaleString()}</p>
							</div>
						</article>
					</section>
					<section className=' flex flex-col row-span-10 gap-5  '>
						<div className=' shadow-sm  h-full w-full rounded-xl bg-slate-800 flex flex-col  gap-3 p-5 '>
							<AddExpense apiData={userData?.wallet} />
							<AddDebt apiData={userData?.wallet} />
						</div>

						<div className='shadow-sm  h-full w-full rounded-xl  bg-slate-800 flex flex-col justify gap-3 p-5 '>
							<SeeDebt apiData={userData?.wallet} />
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
