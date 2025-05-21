import { GetExpenses } from '@/apis/ExpenseService';
import { GetWalletUser } from '@/apis/WalletService';
import { Chart, ChartDonut, ChartExampleTwo } from '@/components/core/Charts';
import { AddDebt } from '@/components/core/Debts/AddDebt';
import { AddExpense } from '@/components/core/Expenses/AddExpense';
import { AddIncome } from '@/components/core/Income/AddIncome';
import { LoaderComponent } from '@/components/others/Loader';
import { Button } from '@/components/ui/button';
import { Expenses, Incomes, ResponseWallet } from '@/interfaces/Wallet';
import { format } from 'date-fns';
import { AlertTriangle, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { GetAllIncomes } from '@/apis/Income.service';
import { LoaderApi } from '@/assets/icons/Svg';
export const Dashboard = () => {
	const [userData, setDataUser] = useState<ResponseWallet | undefined>(undefined);
	const [expenses, setExpenses] = useState<Array<Expenses> | undefined>([]);
	const [incomes, setIncomes] = useState<Array<Incomes> | undefined>([]);
	const [trigger, setTrigger] = useState(0);
	const [fetching, setFetching] = useState(true);
	const [filter, setFilter] = useState('day');
	const [changeFilter, setChangeFilter] = useState(false);
	localStorage.setItem('filterChartBalance', filter);
	const user = JSON.parse(localStorage.getItem('userMain'));

	const { t, i18n } = useTranslation();
	i18n.changeLanguage();

	const getExpenses = async (walletId) => {
		const expenses = await GetExpenses(walletId);
		setExpenses(expenses?.expenses);
	};
	const getIncomes = async (walletId) => {
		const incomes = await GetAllIncomes(walletId);
		setIncomes(incomes?.incomes);
	};

	useEffect(() => {
		const fetchData = async () => {
			const dataUser = await GetWalletUser(user?.user_id);
			setDataUser(dataUser);
			setFetching(false);
		};

		fetchData();
	}, [trigger]);

	const recibeResponseChild = async (e: string) => {
		console.log(e);

		if (e) return setTrigger((prev) => prev + 1);
	};

	useEffect(() => {
		if (userData?.wallet?.wallet_id) {
			const fetchExpensesAndDebts = async () => {
				getExpenses(userData.wallet);
				getIncomes(userData.wallet);
			};

			fetchExpensesAndDebts();
		}
	}, [userData, trigger]);

	const handleFilterChartBalance = (e) => {
		localStorage.setItem('filterChartBalance', e);
		setFilter(e);
		setChangeFilter(true);
		setTimeout(() => {
			setChangeFilter(false);
		}, 2000);
	};

	if (fetching) {
		return <LoaderComponent />;
	}
	return (
		<main className='h-screen'>
			<div className='flex flex-col md:grid md:grid-cols-3 h-full pt-20 pl-3 pr-1 gap-3 dark:bg-dark_background bg-light_background'>
				{userData.wallet.available <= 0 && (
					<Dialog defaultOpen>
						<DialogContent
							aria-describedby='modal'
							className='w-[380px] md:w-[600px] rounded-md dark:bg-dark_primary_color bg-light_primary_color dark:text-white text-black '>
							<DialogHeader>
								<DialogTitle className='text-xl   text-main_color'>¡Importante!</DialogTitle>
								<DialogDescription className='text-lg  dark:text-white text-black text-start  '>
									<p>No olvides agregar los ingresos, deudas, gastos fijos o gastos no fijos que tengas actualmente.</p>
									<p>
										Ya que <span className='font-bold'>lukafi</span> te ayudara a gestionarlos de mejor manera
									</p>
								</DialogDescription>
							</DialogHeader>
						</DialogContent>
					</Dialog>
				)}

				<section className='flex gap-3 flex-wrap md:flex-nowrap md:col-span-3'>
					<AddIncome
						sendData={(e) => recibeResponseChild(e)}
						className='w-full cursor-pointer'
						apiData={userData?.wallet}
					/>
					<AddExpense
						className='w-full cursor-pointer'
						sendData={(e) => recibeResponseChild(e)}
						apiData={userData?.wallet}
					/>
					<AddDebt
						sendData={(e) => recibeResponseChild(e)}
						className='w-full cursor-pointer'
						apiData={userData?.wallet}
					/>
				</section>
				<section className='flex md:col-span-3 md:row-span-3 flex-wrap md:flex-nowrap  gap-3 md:h-full'>
					<div className='flex flex-col dark:bg-dark_primary_color rounded-md bg-light_primary_color w-full'>
						<div className='flex md:flex-row flex-col justify-between p-3 items-center dark:text-white text-black'>
							<p className='dark:text-white text-black text-center md:text-start text-2xl font-semibold '>
								{t('dashboard.viewBalanceExpenses')}
								{localStorage.getItem('filterChartBalance') === 'day' ? (
									<span className='mx-2'>
										en el mes de
										<span className='text-main_color font-semibold ml-2'>{<span>{format(new Date(), 'MMMM')}</span>}</span>
									</span>
								) : (
									''
								)}
							</p>

							<div className='flex justify-between md:mt-0 mt-3'>
								<Button
									disabled={filter === 'day'}
									variant='ghost'
									onClick={(_) => handleFilterChartBalance('day')}
									className={`${
										filter === 'day' ? 'border border-alternative_color ' : ' opacity-50 '
									} dark:text-white text-black cursor-pointer disabled:opacity-100 text-lg`}>
									{t('dashboard.day')}
								</Button>
								<Button
									disabled={filter === 'month'}
									variant='ghost'
									onClick={(_) => handleFilterChartBalance('month')}
									className={`${
										filter === 'month' ? 'border border-alternative_color ' : 'opacity-50  '
									} dark:text-white text-black cursor-pointer  disabled:opacity-100 text-lg`}>
									{t('dashboard.month')}
								</Button>
								<Button
									variant='ghost'
									disabled
									onClick={(_) => handleFilterChartBalance('year')}
									className={`${
										filter === 'year' ? 'border border-alternative_color ' : 'opacity-50 '
									} dark:text-white text-black cursor-pointer  text-lg `}>
									{t('dashboard.year')}
								</Button>
							</div>
						</div>

						<div className='px-5 py-3 flex justify-center items-center'>
							<p className='font-semibold dark:text-white text-black   opacity-60'>
								Moneda en: <span className='uppercase'>{userData?.wallet?.currency_type}</span>
							</p>
						</div>
						{expenses?.length > 0 || incomes?.length > 0 ? (
							<>
								<div
									className={` md:absolute bottom-52 left-0 right-20 flex justify-center items-center     ${
										changeFilter ? '' : 'hidden'
									}`}>
									<LoaderApi color='white' />
								</div>

								<div className={changeFilter ? 'invisible' : ''}>
									<Chart
										trigger={trigger}
										filter={filter}
									/>
									<div className='flex gap-3 items-center justify-center'>
										<span className='flex items-center text-main_color'>
											<Star
												size={16}
												strokeWidth={3}
											/>
											{t('sheetside.wallet.incomes')}
										</span>
										<span className='flex items-center text-alternative_color'>
											<Star
												size={16}
												strokeWidth={3}
											/>
											{t('sheetside.wallet.expenses')}
										</span>
									</div>
								</div>
							</>
						) : (
							<div className=' flex justify-center h-full items-center gap-3'>
								<AlertTriangle className='text-yellow-500' />
								<p className='text-lg font-semibold dark:text-white'> {t('dashboard.noExpenses')}</p>
							</div>
						)}
					</div>

					<article className=' dark:text-white text-black flex flex-col justify-between dark:bg-dark_primary_color bg-light_primary_color w-full md:w-2/5 rounded-md p-5 '>
						<div className='flex flex-col items-center justify-center'>
							{userData.wallet?.available <= 0 ? (
								<p className='text-3xl font-bold text-main_color'>0%</p>
							) : (
								<p className='text-3xl font-bold text-main_color'>
									+
									{(
										(Number(userData?.wallet?.available) /
											(Number(userData?.wallet?.incomes) +
												Number(userData?.wallet?.variable_expenses) +
												Number(userData?.wallet?.fixed_expenses) +
												Number(userData?.wallet?.debts))) *
										100
									).toFixed(2)}
									%
								</p>
							)}
							<p>De tu dinero esta libre</p>
							<div className='mt-20 w-full'>
								<div className='flex justify-between items-center gap-3 border-b py-3 border-gray-500/50'>
									<p className='opacity-70'>Dinero libre</p>
									<p className='font-bold'>{Number(userData?.wallet?.available).toLocaleString()}$</p>
								</div>
								<div className='flex justify-between items-center gap-3 border-b py-3 border-gray-500/50'>
									<p className='opacity-70'>Ingresos</p>
									<p className='font-bold'>{Number(userData?.wallet?.incomes).toLocaleString()}$</p>
								</div>
								<div className='flex justify-between items-center gap-3 border-b py-3 border-gray-500/50'>
									<p className='opacity-70'>Gastos</p>
									<p className='font-bold'>{Number(userData?.wallet?.variable_expenses).toLocaleString()}$</p>
								</div>
								<div className='flex justify-between items-center gap-3 border-b py-3 border-gray-500/50'>
									<p className='opacity-70'>Gastos fijos</p>
									<p className='font-bold'>{Number(userData?.wallet?.fixed_expenses).toLocaleString()}$</p>
								</div>
								<div className='flex justify-between items-center gap-3 border-b py-3 border-gray-500/50'>
									<p className='opacity-70'>Deudas</p>
									<p className='font-bold'>{Number(userData?.wallet?.debts).toLocaleString()}$</p>
								</div>
							</div>
						</div>
						<p className='text-center mt-5 opacity-50'>
							Ultima actualizacion:
							<span className='font-bold'> {userData.wallet.modify_in && format(userData?.wallet?.modify_in, 'PP - HH:mm')}</span>
						</p>
					</article>
				</section>

				<section className='md:col-span-3 flex flex-col-reverse md:flex-row justify-end items-end gap-3 w-full '>
					<div className=' flex flex-col dark:bg-dark_primary_color bg-light_primary_color w-full md:w-3/6 pt-3 pb-10 rounded-md  text-center md:text-start md:px-5 h-full'>
						<p className='pb-5 dark:text-white text-black text-center md:text-start text-2xl font-semibold '>Observa tus metas mensuales</p>
						{userData?.wallet?.saving ? (
							<>
								<h2 className='dark:text-white text-black text-lg '>
									Estas a
									<span className='font-semibold text-main_color mx-1'>
										{Number(userData?.wallet?.saving - userData?.wallet?.available).toLocaleString()}$
									</span>
									de alcanzar tu meta! animo🫡
								</h2>
								<div className='flex justify-center items-center mt-8 flex-col'>
									<ChartExampleTwo />
									<div className='flex gap-3 items-center justify-center'>
										<span className='flex items-center text-alternative_color'>
											<Star
												size={16}
												strokeWidth={3}
											/>
												{t('home.section2.chartSaving')}

										</span>
										<span className='flex items-center text-main_color'>
											<Star
												size={16}
												strokeWidth={3}
											/>
											{t('sheetside.wallet.available')}
										

										</span>
									</div>
								</div>
							</>
						) : (
							<div className=' flex justify-center items-center pt-5 gap-3'>
								<AlertTriangle className='text-yellow-500' />
								<p className='text-lg font-semibold dark:text-white'> {t('dashboard.noExpenses')}</p>
							</div>
						)}
					</div>
					<div className='flex flex-col dark:bg-dark_primary_color bg-light_primary_color rounded-md w-full  md:w-3/4 h-full pt-3 pb-10 md:px-5'>
						<div className='flex flex-col md:flex-row items-center justify-between gap-2'>
							<p className=' pb-5 dark:text-white text-black text-2xl font-semibold '>{t('dashboard.viewExpensesCategory')}</p>
							<div className='flex gap-3 justify-end'>
								<Button
									variant='ghost'
									className='shadow-inner border border-alternative_color dark:text-white text-black  text-lg'>
									{t('dashboard.day')}
								</Button>
								<Button
									disabled
									variant='ghost'
									className=' dark:text-white text-black opacity-50 text-lg'>
									{t('dashboard.month')}
								</Button>
								<Button
									variant='ghost'
									disabled
									className=' dark:text-white text-black opacity-50  text-lg'>
									{t('dashboard.year')}
								</Button>
							</div>
						</div>
						{expenses?.length > 0 ? (
							<ChartDonut trigger={trigger} />
						) : (
							<div className=' flex justify-center items-center gap-3 pt-5 h-full'>
								<AlertTriangle className='text-yellow-500' />
								<p className='text-lg font-semibold dark:text-white'> {t('dashboard.noExpenses')} </p>
							</div>
						)}
					</div>
				</section>
			</div>
		</main>
	);
};
