import {GetExpenses} from '@/apis/ExpenseService';
import {GetWalletUser} from '@/apis/WalletService';
import {Chart, ChartDonut, ChartIncomes} from '@/components/core/Charts';
import {AddDebt} from '@/components/core/Debts/AddDebt';
import {AddExpense} from '@/components/core/Expenses/AddExpense';
import {AddIncome} from '@/components/core/Income/AddIncome';
import {LoaderComponent} from '@/components/others/Loader';
import {Button} from '@/components/ui/button';
import {Expenses, Incomes, ResponseWallet} from '@/interfaces/Wallet';
import {format} from 'date-fns';
import {AlertTriangle, ArrowDown, ArrowUp} from 'lucide-react';
import {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from '@/components/ui/dialog';
import {GetAllIncomes} from '@/apis/Income.service';
import {LoaderApi} from '@/assets/icons/Svg';
import {Link} from 'react-router-dom';
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

	const {t, i18n} = useTranslation();
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
			<div className='flex flex-col md:grid md:grid-cols-3 h-full pt-20 p-3 gap-3 dark:bg-black bg-white'>
				{userData.wallet.available <= 0 && (
					<Dialog defaultOpen>
						<DialogContent className='md:w-1/3'>
							<DialogHeader>
								<DialogTitle className='text-lg font-semibold leading-none -tracking-tighter text-red-500'>
									¡Importante!
								</DialogTitle>
								<span className='text-yellow-00'>Agrega tu saldo disponible</span>
								<DialogDescription className='text-xl leading-7 tracking-wide dark:text-white text-black   opacity-70 text-balance'>
									Ten en cuenta que cuando empiezas a usar <span className='text-green-500'>Lukafi</span>, tu saldo disponible será
									cero
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
						<AddIncome sendData={(e) => recibeResponseChild(e)} className='w-full ' apiData={userData?.wallet} />
					</div>
					<AddExpense className='w-full' sendData={(e) => recibeResponseChild(e)} apiData={userData?.wallet} />
					<AddDebt sendData={(e) => recibeResponseChild(e)} className='w-full ' apiData={userData?.wallet} />
				</section>
				<section className='flex md:col-span-3 md:row-span-8 flex-wrap md:flex-nowrap  gap-3 md:h-56'>
					<article className=' w-full h-full  shadow-xs border-none  text-black  dark:text-white  md:grid md:grid-cols-3 gap-3 flex flex-col '>
						<div className='border border-border dark:bg-dark_primary_color bg-zinc-200 p-3 rounded-md flex justify-center flex-col items-center h-48 md:h-full'>
							<p className='h-1/2 text-lg'>Reporte meta de ahorros mensual</p>

							<div className='flex gap-3 items-end h-full flex-col'>
								<p className='flex items-start gap-2 '>
									<span>Meta:</span>
									<span className='text-green-500'>{Number(userData?.wallet?.saving).toLocaleString()} $</span>
								</p>

								<p className='flex items-center gap-2'>
									{Number(userData?.wallet?.incomes) - Number(userData?.wallet?.variable_expenses) <=
									Number(userData?.wallet?.saving) ? (
										<ArrowDown className='text-red-500' />
									) : (
										<ArrowUp className='text-green-500' />
									)}
									<span>Ahora:</span>
									<span
										className={`text-${
											Number(userData?.wallet?.incomes) - Number(userData?.wallet?.variable_expenses) <=
											Number(userData?.wallet?.saving)
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
								{' '}
								{(Number(userData?.wallet?.available) - Number(userData?.wallet?.fixed_expenses)).toLocaleString()} $
							</p>
						</div>
					</article>
					<article className=' text-white flex flex-col justify-between  bg-linear-to-r  to-green-400  from-gray-700 w-full md:w-2/5 rounded-3xl p-8 shadow-xl shadow-zinc-900/90'>
						<div className='flex justify-between'>
							<p className='text-xl font-bold'>{user.full_name}</p>
							<p className='text-5xl font-bold tracking-widest  '>LUFI</p>
						</div>
						<div className='flex flex-col'>
							<p className=' font-semibold'>{t('dashboard.availableBalance')}</p>
							<p className=' font-semibold text-3xl tracking-wider'>{Number(userData?.wallet?.available).toLocaleString()}</p>
						</div>
						<div className='flex justify-between '>
							<p className='font-semibold'>{generateRandomNumbers()}</p>
							<p>{format(userData.wallet.created_in, 'MM/yy')}</p>
						</div>
					</article>
				</section>

				<section className='  md:col-span-3 md:row-span-6  flex flex-col justify-around gap-3 h-screen'>
					<div className='flex flex-col dark:bg-dark_primary_color rounded-md  bg-zinc-200 w-full h-full py-10'>
						<div className='flex flex-col md:flex-row items-center justify-between p-5 gap-2'>
							<p className='text-lg pb-5'>{t('dashboard.viewExpensesCategory')}</p>
							<div className='flex gap-3 justify-end'>
								<Button variant='ghost' className='shadow-inner shadow-green-500 '>
									{t('dashboard.day')}
								</Button>
								<Button disabled variant='ghost' className=' border border-border'>
									{t('dashboard.month')}
								</Button>
								<Button variant='ghost' disabled className=' border border-border'>
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

					<div className='flex flex-col dark:bg-dark_primary_color rounded-md  bg-zinc-200 w-full h-full py-10'>
						<div className='flex flex-col md:flex-row justify-between items-center  p-5   gap-3'>
							<div className='flex gap-3 items-center w-full flex-col md:flex-row'>
								<p className='text-lg pb-5 flex  gap-10 items-center'>{t('dashboard.viewBalanceExpenses')}</p>
								{localStorage.getItem('filterChartBalance') === 'day' ? (
									<p className='text-lg pb-5 flex  gap-1 items-center'>
										en el mes de
										<span className='text-green-500'>{<span>{format(new Date(), 'MMMM')}</span>}</span>
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
									className={filter === 'day' ? 'shadow-inner shadow-green-500 disabled:opacity-100 ' : ' border border-border '}>
									{t('dashboard.day')}
								</Button>
								<Button
									disabled={filter === 'month'}
									variant='ghost'
									onClick={(_) => handleFilterChartBalance('month')}
									className={
										filter === 'month' ? 'shadow-inner shadow-green-500  disabled:opacity-100' : ' border border-border  '
									}>
									{t('dashboard.month')}
								</Button>
								<Button
									variant='ghost'
									disabled
									onClick={(_) => handleFilterChartBalance('year')}
									className={filter === 'year' ? 'shadow-inner shadow-green-500 ' : ' border border-border'}>
									{t('dashboard.year')}
								</Button>
							</div>
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
									<Chart trigger={trigger} filter={filter} />
								</div>
							</>
						) : (
							<div className=' flex justify-center items-center gap-3   '>
								<AlertTriangle className='text-yellow-500' />
								<p className='text-lg font-semibold'> {t('dashboard.noExpenses')}</p>
							</div>
						)}
					</div>
				</section>
			</div>
		</main>
	);
};
