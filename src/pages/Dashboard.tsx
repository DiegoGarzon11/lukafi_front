import { GetExpenses } from '@/apis/ExpenseService';
import { GetWalletUser } from '@/apis/WalletService';
import { Chart, ChartDonut, ChartExampleTwo, ChartIncomes } from '@/components/core/Charts';
import { AddDebt } from '@/components/core/Debts/AddDebt';
import { AddExpense } from '@/components/core/Expenses/AddExpense';
import { AddIncome } from '@/components/core/Income/AddIncome';
import { LoaderComponent } from '@/components/others/Loader';
import { Button } from '@/components/ui/button';
import { Expenses, Incomes, ResponseWallet } from '@/interfaces/Wallet';
import { format } from 'date-fns';
import { AlertTriangle, ArrowDown, ArrowUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { GetAllIncomes } from '@/apis/Income.service';
import { LoaderApi } from '@/assets/icons/Svg';
import { Link } from 'react-router-dom';
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
		return (
			<div className='h-screen flex justify-center pt-20 flex-col items-center gap-3 dark:bg-dark_primary_color bg-zinc-200'>
				<LoaderComponent />
			</div>
		);
	}
	return (
		<main>
			<div className='flex flex-col md:grid md:grid-cols-3  h-full pt-20 p-3 gap-3 dark:bg-black bg-white'>
				{userData.wallet.available <= 0 && (
					<Dialog defaultOpen>
						<DialogContent className='md:w-1/3'>
							<DialogHeader>
								<DialogTitle className='text-lg font-semibold leading-none -tracking-tighter text-red-500'>¡Importante!</DialogTitle>
								<span className='text-yellow-00'>Agrega tu saldo disponible</span>
								<DialogDescription className='text-xl leading-7 tracking-wide dark:text-white text-black   opacity-70 text-balance'>
									Ten en cuenta que cuando empiezas a usar <span className='text-green-500'>Lukafi</span>, tu saldo disponible será cero
									<br />
									<span>Te recomendamos que como tu primer ingreso</span>
									<span className='text-green-500'> agregues todo el dinero que tengas disponible en general</span>
									<br />
									<span>Esto puedes hacerlo en la sección de </span>{' '}
									<span className='text-green-500 underline cursor-pointer'>
										{' '}
										<Link to='/wallet/incomes'>ingresos</Link>
									</span>
								</DialogDescription>
							</DialogHeader>
						</DialogContent>
					</Dialog>
				)}

				<section className='md:flex grid grid-cols-2 grid-rows-2 md:flex-nowrap w-full gap-3 md:col-span-3'>
					<div className='col-span-2 w-full'>
						<AddIncome
							sendData={(e) => recibeResponseChild(e)}
							className='w-full cursor-pointer'
							apiData={userData?.wallet}
						/>
					</div>
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
					<div className='flex flex-col dark:bg-dark_primary_color rounded-md  bg-zinc-200 w-full h-full '>
						<div className='flex flex-col md:flex-row justify-between items-center  p-5   gap-3'>
							<div className='flex gap-1.5 items-center w-full flex-col md:flex-row '>
								<p className='text-xl font-semibold pb-5 md:pb-0 flex  gap-10 items-center dark:text-white text-black'>
									{t('dashboard.viewBalanceExpenses')}
								</p>
								{localStorage.getItem('filterChartBalance') === 'day' ? (
									<p className='text-xl font-semibold pb-5 md:pb-0  flex  gap-2 items-center dark:text-white text-black '>
										en el mes de
										<span className='text-lime-500 font-semibold text-xl'>{<span>{format(new Date(), 'MMMM')}</span>}</span>
									</p>
								) : (
									''
								)}
							</div>

							<div className='flex gap-3'>
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
									className={` md:absolute bottom-52 left-0 right-0 flex justify-center items-center mt-10    ${
										changeFilter ? '' : 'hidden'
									}`}>
									<LoaderApi color='white' />
								</div>

								<div className={changeFilter ? 'invisible' : ''}>
									<Chart
										trigger={trigger}
										filter={filter}
									/>
								</div>
							</>
						) : (
							<div className=' flex justify-center items-center gap-3   '>
								<AlertTriangle className='text-yellow-500' />
								<p className='text-lg font-semibold'> {t('dashboard.noExpenses')}</p>
							</div>
						)}
					</div>

					<article className=' text-white flex flex-col justify-between dark:bg-dark_primary_color bg-zinc-200 w-full md:w-2/5 rounded-md p-5 shadow-xl '>
						<div className='flex flex-col items-center justify-center'>
							<p className='text-3xl font-bold text-lime-500'>
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
							<p>de tu dinero esta libre</p>
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
							Ultima actualizacion: <span className='font-bold'>{format(userData?.wallet?.modify_in, 'PP - HH:mm')}</span>
						</p>
					</article>
				</section>

				<section className='  md:col-span-3   flex flex-col-reverse md:flex-row justify-end items-end gap-3 w-full '>
					<div className='dark:bg-dark_primary_color  w-full md:w-3/6 pt-10 rounded-md  text-center md:text-start md:px-5  h-full'>
						<p className='   pb-5 dark:text-white text-black text-center md:text-start text-2xl font-semibold '>Oberva tus metas mensuales</p>
						<p className='dark:text-white text-black text-lg '>
							Estas a{' '}
							<span className='font-semibold text-lime-500'>
								{Number(userData?.wallet?.saving - userData?.wallet?.available).toLocaleString()}$
							</span>{' '}
							de alcanzar tu meta! animo🫡
						</p>
						<div className='flex justify-center items-center mt-8 '>
							<ChartExampleTwo />
						</div>
					</div>
					<div className='flex flex-col dark:bg-dark_primary_color rounded-md w-full  md:w-3/4 h-full py-10 md:px-5 '>
						<div className='flex flex-col md:flex-row items-center justify-between  gap-2'>
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
							<div className=' flex justify-center items-center gap-3  h-full'>
								<AlertTriangle className='text-yellow-500' />
								<p className='text-lg font-semibold'> {t('dashboard.noExpenses')} </p>
							</div>
						)}
					</div>
				</section>
			</div>
		</main>
	);
};
{
	/* <article className=' w-full h-full  shadow-xs border-none  text-black  dark:text-white  md:grid md:grid-cols-3 gap-3 flex flex-col '>
						<div className='border border-border dark:bg-dark_primary_color bg-zinc-200 p-3 rounded-md flex justify-center flex-col items-center h-48 md:h-full'>
							<p className='h-1/2 text-lg'>Reporte meta de ahorros mensual</p>

							<div className='flex gap-3 items-end h-full flex-col'>
								<p className='flex items-start gap-2 '>
									<span>Meta:</span>
									<span className='text-green-500'>{Number(userData?.wallet?.saving).toLocaleString()} $</span>
								</p>

								<p className='flex items-center gap-2'>
									{Number(userData?.wallet?.incomes) - Number(userData?.wallet?.variable_expenses) <= Number(userData?.wallet?.saving) ? (
										<ArrowDown className='text-red-500' />
									) : (
										<ArrowUp className='text-green-500' />
									)}
									<span>Ahora:</span>
									<span
										className={`text-${
											Number(userData?.wallet?.incomes) - Number(userData?.wallet?.variable_expenses) <= Number(userData?.wallet?.saving)
												? 'red'
												: 'green'
										}-500 flex items-center gap-2`}>
										{(Number(userData?.wallet?.incomes) - Number(userData?.wallet?.variable_expenses)).toLocaleString()} $
									</span>
								</p>
							</div>
						</div>
						<div className='border border-border dark:bg-dark_primary_color bg-zinc-200  p-3 rounded-md flex justify-center flex-col items-center h-48 md:h-full'>
							<ChartIncomes trigger={trigger} />
						</div>
						<div className='border border-border dark:bg-dark_primary_color bg-zinc-200  p-3 rounded-md flex justify-center flex-col items-center h-48 md:h-full'>
							<p className='h-1/2 text-lg'>Saldo disponible contando gastos fijos</p>
							<p className='text-xl text-green-500'>
								{(Number(userData?.wallet?.available) - Number(userData?.wallet?.fixed_expenses)).toLocaleString()} $
							</p>
						</div>
					</article> */
}
