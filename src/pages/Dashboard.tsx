import { GetExpenses } from '@/apis/ExpenseService';
import { GetWalletUser } from '@/apis/WalletService';
import { Chart, ChartDonut, ChartIncomes } from '@/components/core/Charts';
import { AddDebt } from '@/components/core/Debts/AddDebt';
import { AddExpense } from '@/components/core/Expenses/AddExpense';
import { AddIncome } from '@/components/core/Income/AddIncome';
import { Carrusel } from '@/components/others/Carrousel';
import { LoaderComponent } from '@/components/others/Loader';
import { Button } from '@/components/ui/button';
import { Expenses, ResponseWallet } from '@/interfaces/Wallet';
import '@/styles/Dashboard.css';
import { format } from 'date-fns';
import { AlertTriangle, ArrowDown, ArrowUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export const Dashboard = () => {
	const [userData, setDataUser] = useState<ResponseWallet | undefined>(undefined);
	const [expenses, setExpenses] = useState<Array<Expenses> | undefined>([]);
	const [trigger, setTrigger] = useState(0);
	const [fetching, setFetching] = useState(true);
	const user = JSON.parse(localStorage.getItem('userMain'));

	const { t, i18n } = useTranslation();
	i18n.changeLanguage();

	const getExpenses = async (walletId) => {
		const expenses = await GetExpenses(walletId);
		setExpenses(expenses?.expenses);
	};

	function generateRandomNumbers() {
		let result = '';
		result += Math.floor(Math.random() * 9) + 1;
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
			setDataUser(dataUser);
			setFetching(false);
		};

		fetchData();
	}, [trigger]);

	const recibeResponseChild = async (e: string) => {
		console.log(trigger);

		if (e) return setTrigger((prev) => prev + 1);
	};

	useEffect(() => {
		if (userData?.wallet?.wallet_id) {
			const fetchExpensesAndDebts = async () => {
				getExpenses(userData.wallet);
			};

			fetchExpensesAndDebts();
		}
	}, [userData, trigger]);

	if (fetching) {
		return (
			<div className='h-screen flex justify-center pt-20 flex-col items-center gap-3 bg-dark_primary_color'>
				<LoaderComponent />
			</div>
		);
	}
	return (
		<main>
			{userData && userData?.status === 404 ? (
				<div className='flex justify-center items-center bg-zinc-200 dark:bg-black'>
					<Carrusel />
				</div>
			) : (
				<div className='flex flex-col md:grid md:grid-cols-3 h-full pt-20 p-3 gap-3 dark:bg-black bg-white'>
					<section className='md:flex grid grid-cols-2 grid-rows-2 md:flex-nowrap w-full gap-3 md:col-span-3'>
						<AddExpense
							className='w-full'
							sendData={(e) => recibeResponseChild(e)}
							apiData={userData?.wallet}
						/>
						<AddDebt
							sendData={(e) => recibeResponseChild(e)}
							className='w-full '
							apiData={userData?.wallet}
						/>
						<div className='col-span-2 w-full'>
							<AddIncome
								sendData={(e) => recibeResponseChild(e)}
								className='w-full '
								apiData={userData?.wallet}
							/>
						</div>
					</section>
					<section className='flex md:col-span-3 md:row-span-8 flex-wrap md:flex-nowrap  gap-3 md:h-56'>
						<article className=' w-full h-full  shadow-sm border-none  text-black  dark:text-white  md:grid md:grid-cols-3 gap-3 flex flex-col '>
							<div className='border border-border dark:bg-dark_primary_color bg-zinc-200 p-3 rounded-md flex justify-center flex-col items-center h-48 md:h-full'>
								<p>Reporte meta de ahorros</p>
								
								<div className='flex gap-3 items-center h-full'>
								<p>
									Meta: <span className='text-green-500'>{Number(userData?.wallet?.saving).toLocaleString()}</span>
								</p>
									<p>
										Antes: <span className='text-green-500'>{Number(userData?.wallet?.salary).toLocaleString()}</span>
									</p>
									<p>
										Ahora:
										<span
											className={`text-${
												Number(userData?.wallet?.salary) - Number(userData?.wallet?.variable_expenses) <= Number(userData?.wallet?.saving)
													? 'red'
													: 'green'
											}-500 flex items-center gap-2`}>
											{(Number(userData?.wallet?.salary) - Number(userData?.wallet?.variable_expenses)).toLocaleString()}

											{Number(userData?.wallet?.salary) - Number(userData?.wallet?.variable_expenses) <=
											Number(userData?.wallet?.saving) ? (
												<ArrowDown className='text-red-500' />
											) : (
												<ArrowUp className='text-green-500' />
											)}
										</span>
									</p>
								</div>
							</div>
							<div className='border border-border dark:bg-dark_primary_color bg-zinc-200  p-3 rounded-md flex justify-center flex-col items-center h-48 md:h-full'>
								<ChartIncomes trigger={trigger} />
							</div>
							<div className='border border-border dark:bg-dark_primary_color bg-zinc-200  p-3 rounded-md flex justify-center flex-col items-center h-48 md:h-full'>
								<p>Saldo disponible contando gastos fijos</p>
								<p>{(Number(userData?.wallet?.salary) - Number(userData?.wallet?.fixed_expenses)).toLocaleString()}</p>
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
									{(Number(userData?.wallet?.salary) - Number(userData?.wallet?.variable_expenses)).toLocaleString()}
								</p>
							</div>
							<div className='flex justify-between '>
								<p className='font-semibold'>{generateRandomNumbers()}</p>
								<p>{format(userData.wallet.created_in, 'MM/yy')}</p>
							</div>
						</article>
					</section>

					<section className='  md:col-span-3 md:row-span-6  flex flex-col justify-around gap-3'>
						<div className='flex flex-col dark:bg-dark_primary_color rounded-md  bg-zinc-200 w-full h-auto py-10'>
							<div className='flex flex-col md:flex-row items-center justify-between p-5 gap-2'>
								<p className='text-lg pb-5'>{t('dashboard.viewExpensesCategory')}</p>
								<div className='flex gap-3 justify-end'>
									<Button className=''>{t('dashboard.day')}</Button>
									<Button
										disabled
										className=''>
										{t('dashboard.month')}
									</Button>
									<Button
										disabled
										className=''>
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

						<div className='flex flex-col dark:bg-dark_primary_color rounded-md  bg-zinc-200 w-full h-auto py-10'>
							<div className='flex flex-col md:flex-row justify-between items-center  p-5   gap-3'>
								<p className='text-lg pb-5'>{t('dashboard.viewBalanceExpenses')}</p>
								<div className='flex gap-3'>
									<Button className=''>{t('dashboard.day')}</Button>
									<Button
										disabled
										className=''>
										{t('dashboard.month')}
									</Button>
									<Button
										disabled
										className=''>
										{t('dashboard.year')}
									</Button>
								</div>
							</div>
							{expenses?.length > 0 ? (
								<Chart trigger={trigger} />
							) : (
								<div className=' flex justify-center items-center gap-3   '>
									<AlertTriangle className='text-yellow-500' />
									<p className='text-lg font-semibold'> {t('dashboard.noExpenses')}</p>
								</div>
							)}
						</div>
					</section>
				</div>
			)}
		</main>
	);
};
