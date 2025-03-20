import { ChartFinance } from '@/components/core/Charts';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { CURRENCIES } from '@/tools/currencies';
import { EditSavingGoal, GetWalletUser } from '@/apis/WalletService';
import { ResponseWallet } from '@/interfaces/Wallet';
import { Toast } from '@/tools/Toast';
import { ApiResponse } from '@/interfaces/Api';
import { LoaderComponent } from '@/components/others/Loader';

export const WalletComponent = () => {
	const [api, setApi] = useState<CarouselApi>();
	const [current, setCurrent] = useState(0);
	const [count, setCount] = useState(0);
	const [userData, setDataUser] = useState<ResponseWallet | undefined>(undefined);
	const [ApiResponse, setApiResponse] = useState<ApiResponse | undefined>(null);
	const [amount, setAmount] = useState('');
	const [visibilityToast, setVisibilityToast] = useState(false);
	const [fetching, setFetching] = useState(true);
	const user = JSON.parse(localStorage.getItem('userMain'));
	useEffect(() => {
		if (!api) {
			return;
		}

		setCount(api.scrollSnapList().length);
		setCurrent(api.selectedScrollSnap() + 1);

		api.on('select', () => {
			setCurrent(api.selectedScrollSnap() + 1);
		});
	}, [api]);
	const handleValues = (e) => {
		let value = e.target.value.replace(/[^0-9.]/g, '');
		if (value === '') {
			value = 0;
		}

		const floatValue = parseFloat(value);
		const formattedValue = floatValue.toLocaleString();

		setAmount(formattedValue);
		return;
	};
	useEffect(() => {
		const fetchData = async () => {
			const dataUser = await GetWalletUser(user?.user_id);
			setDataUser(dataUser);
			setFetching(false);
		};

		fetchData();
	}, []);

	const saveSavingGoal = async () => {
		const params = {
			wallet_id: userData?.wallet.wallet_id,
			user_id: userData?.wallet?.user_id,
			amount: amount == '' ? userData?.wallet?.saving : amount.replace(/,/g, ''),
		};

		const response = await EditSavingGoal(params);
		if (response) {
			setApiResponse(response);
			setVisibilityToast(true);
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
		<main className='  h-screen pt-16 p-3 font-thin dark:bg-dark_primary_color bg-zinc-200 gap-3'>
			<Breadcrumb className='flex w-full mb-3  '>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink className='text-base'>Billetera</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage className='text-base'>Editar billetera</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
			<div className='md:flex gap-3'>
				<section className='md:w-6/12'>
					<div className='flex flex-col gap-3 md:block '>
						<Card className='dark:bg-dark_primary_color md:p-10 p-5 order-2 my-3 md:my-0'>
							<CardContent className='flex flex-col gap-3 '>
								<p>Tu salario</p>

								<p className='md:text-5xl text-3xl '>$ 10.000.000 cop</p>
								<p className='md:text-2xl text-xl '>Ultima actualización: 20/10/24</p>
							</CardContent>
						</Card>
						<div className='flex  flex-col  justify-center items-center gap-3 mt-10 h-full '>
							<div className='relative inline-block my-5'>
								<button className=' text-white font-medium py-2 px-6  rounded-full flex items-center space-x-2 shadow-inner shadow-green-600 hover:bg-green-600 transition-colors ease-in duration-300 '>
									<span className='font-semibold'>Editar billetera</span>
								</button>
							</div>
							<p className='font-semibold text-start md:w-1/2 underline'>Selecciona tipo de moneda</p>
							<div className='flex justify-around mt-3 mb-6'>
								{CURRENCIES.map((c) => (
									<div
										key={c.symbol}
										className='flex'>
										<label
											htmlFor={c.symbol}
											className='pl-2 flex gap-3 items-center cursor-pointer'>
											<input
												defaultChecked={c.symbol === 'cop'}
												id={c.symbol}
												type='radio'
												value={c.symbol}
												className='size-4 cursor-pointer'
												name='typeCurrency'
											/>
											<div>
												<span className='capitalize'>{c.name}</span>
												<span className='uppercase'>({c.symbol})</span>
											</div>
										</label>
									</div>
								))}
							</div>
							<div className='w-full flex justify-center items-center gap-3 px-5 md:px-10'>
								<div className='w-full'>
									<p className='font-semibold text-start '> Meta a ahorrar</p>
									<Input
										className=''
										onChange={handleValues}
										value={amount || userData?.wallet?.saving.toLocaleString()}
									/>
								</div>
							</div>

							<div className='w-full flex justify-center items-end gap-3  px-5 md:px-10'>
								<button
									onClick={saveSavingGoal}
									disabled={amount === ''}
									className='bg-green-500 text-white w-1/2 rounded-md py-2 font-semibold  disabled:bg-zinc-500 disabled:text-white disabled:opacity-40'>
									Guardar
								</button>
								<button className='bg-red-500 text-white w-1/2 rounded-md py-2 font-semibold '>Eliminar billetera</button>
							</div>
						</div>
					</div>
				</section>
				<section className='flex flex-col gap-3 md:w-6/12 h-full'>
					<div className='flex flex-col justify-between  rounded-xl  shadow-xs shadow-zinc-900/90  h-full dark:bg-dark_primary_color '>
						<ChartFinance />
					</div>
					<div className='dark:bg-dark_primary_color rounded-xl flex flex-col items-center justify-center p-3 h-full  '>
						<Carousel
							setApi={setApi}
							className='w-full'>
							<div className='flex justify-evenly  items-start mb-5 w-4/5'>
								<p className=' w-full text-center '>selecciona tu tarjeta</p>

								<CarouselNext className='relative top-3 left-10' />
								<CarouselPrevious className='relative top-3  ' />
							</div>

							<CarouselContent>
								{Array.from({ length: 5 }).map((_, index) => (
									<CarouselItem
										className='flex justify-center'
										key={index}>
										<article className=' text-white flex flex-col justify-between  bg-linear-to-r  to-green-400  from-gray-700  rounded-3xl p-8 shadow-xl shadow-zinc-900/90 min-w-80 '>
											<div className='flex justify-between'>
												<p className='text-xl font-bold'>diego</p>
												<p className='text-5xl font-bold tracking-widest  '>LUFI</p>
											</div>
											<div className='flex flex-col'>
												<p className=' font-semibold'>Disponible</p>
												<p className=' font-semibold text-3xl tracking-wider'>10.000.000</p>
											</div>
											<div className='flex justify-between '>
												<p className='font-semibold'>123123-123-12312-122</p>
												<p>25/02/25</p>
											</div>
										</article>
									</CarouselItem>
								))}
							</CarouselContent>
						</Carousel>
						<div className='py-2 text-center text-sm text-muted-foreground'>
							tarjeta {current} de {count}
						</div>
					</div>
				</section>
			</div>
			{visibilityToast && (
				<Toast
					visibility={visibilityToast}
					severity={ApiResponse.success == true ? 'success' : 'error'}
					message={ApiResponse.message}
				/>
			)}
		</main>
	);
};
