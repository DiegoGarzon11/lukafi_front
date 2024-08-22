import { CreateWallet } from '@/apis/WalletService';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Input } from '@/components/ui/input';
import { LoaderApi } from '@/assets/icons/Svg';
import { useRef, useState } from 'react';
import { Toast } from '@/tools/Toast';
import { ResponseWallet } from '@/interfaces/Wallet';
import { CURRENCIES } from '@/tools/currencies';
import { TriangleAlert } from 'lucide-react';
import { LoaderComponent } from './Loader';

export const Carrusel = () => {
	const btnNext = useRef(null);
	const btnBack = useRef(null);
	const [salario, setSalario] = useState('0');
	const [ahorro, setAhorro] = useState('0');
	const [currency, setCurrency] = useState('cop');
	const [apiResponse, setApiResponse] = useState<ResponseWallet | undefined>(null);
	const [visibility, setVisibilityToast] = useState(false);
	const [isMajor, setIsMajor] = useState(false);
	const [loader, setLoader] = useState(false);
	const user = JSON.parse(localStorage.getItem('userMain'));

	function handleValuesMoney(e, item: string) {
		let value = e.target.value.replace(/[^0-9.]/g, '');

		if (value === '') {
			value = '0';
		}
		if (!isNaN(value)) {
			const floatValue = parseFloat(value);
			if (item === 'salario') {
				const formattedValue = floatValue.toLocaleString();
				const savingValue = parseInt(ahorro.replace(/[^0-9.]/g, ''));
				if (savingValue >= value) {
					setIsMajor(true);
				} else {
					setIsMajor(false);
				}
				setSalario(formattedValue);
			} else if (item === 'ahorro') {
				const formattedValue = floatValue.toLocaleString();
				const savingValidate = parseInt(salario.replace(/[^0-9.]/g, ''));

				if (savingValidate <= value) {
					setIsMajor(true);
				} else {
					setIsMajor(false);
				}

				setAhorro(formattedValue);
			} else if (item === 'currency') {
				setCurrency(e.target.value);
			}
		}
	}

	function handleNextCarousel(e) {
		e.preventDefault();

		btnNext.current.click();
	}
	function handleBackCarousel(e) {
		e.preventDefault();
		btnBack.current.click();
	}

	async function submitInfoWallet() {
		setLoader(true);

		const params = {
			currency_type: currency,
			salary: salario.replace(/,/g, ''),
			saving: ahorro.replace(/,/g, ''),
			user_id: user?.user_id,
		};

		const response = await CreateWallet(params);

		if (response) {
			setLoader(false);
			setVisibilityToast(true);
			setTimeout(() => {
				setVisibilityToast(false);
			}, 1000);
			setApiResponse(response);
			if (response.status === 201) {
				window.location.href = '/dashboard';
			}
		}
	}


	return (
		<section className='flex justify-center items-center h-screen '>
			<Carousel className=' md:max-w-3xl max-w-sm h-screen fixed  flex justify-center items-center mt-16 '>
				<CarouselContent>
					<CarouselItem className='flex  justify-center'>
						<div className='p-1 flex items-center justify-center '>
							<Card className='h-full  w-full '>
								<CardContent className='flex h-full  items-center justify-center gap-10 md:gap-32 p-6 flex-col  text-center text-wrap'>
									<h1 className='text-4xl'>
										Bienvenido <span className='capitalize text-green-500'>{user?.full_name}</span>
									</h1>

									<div className='flex flex-col gap-10'>
										<p className='text-2xl'>Una correcta billetera requiere la siguiente información</p>
										<p className='text-lg'>No te preocupes esta información solo esta a tu alcancé</p>
									</div>

									<button
										onClick={(e) => handleNextCarousel(e)}
										className=' hover:bg-zinc-500   bg-zinc-700 w-full h-8 mt-6 rounded-md dark:hover:bg-zinc-900 text-white'>
										Siguiente
									</button>
									<p className='flex gap-2 m-0 absolute bottom-5'>
										<span className='dark:bg-slate-100 bg-slate-700 h-3 w-3 rounded-full'></span>
										<span className='dark:bg-slate-700 bg-slate-300 h-3 w-3 rounded-full'></span>
										<span className='dark:bg-gray-700  bg-slate-300 h-3 w-3 rounded-full'></span>
									</p>
								</CardContent>
							</Card>
						</div>
					</CarouselItem>

					<CarouselItem className='flex justify-center '>
						<div className='p-1 flex items-center justify-center w-[580px] h-[600px] '>
							<Card className='h-full w-full '>
								<CardContent className='flex h-full w-full items-center justify-center p-6 gap-8 flex-col'>
									<p className='mb-10 text-2xl '>
										Salario y Ahorro <span className='text-red-500'>*</span>
									</p>

									<form action=''>
										<div className=''>
											<h2>
												Selecciona tipo de moneda: <span className='text-red-500'>*</span>
											</h2>
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
																onChange={(e) => handleValuesMoney(e, 'currency')}
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
										</div>
										<div className='w-full mb-5'>
											<p className='mb-2'>
												¿Cual es tu salario mensual promedio? <span className='text-red-500'>*</span>
											</p>
											<div className=' flex  justify-center items-center gap-2'>
												<Input
													type='text'
													className='appearance-none  dark:border-white border-zinc-900'
													value={salario}
													onChange={(e) => handleValuesMoney(e, 'salario')}
												/>
											</div>
										</div>

										<div className='w-full'>
											<p className='mb-2'>
												¿Cual es la cantidad que esperas ahorrar mensualmente? <span className='text-red-500'>*</span>
											</p>
											<div className='flex  justify-center items-center gap-2'>
												<Input
													type='text'
													className='appearance-none border dark:border-white border-zinc-900'
													value={ahorro}
													onChange={(e) => handleValuesMoney(e, 'ahorro')}
												/>
											</div>
											{isMajor ? (
												<div className='flex items-center mt-2 gap-2'>
													<TriangleAlert className='text-yellow-600' />
													<p className=''>Lo que esperas ahorrar no puede ser mayor o igual a tus ingresos</p>
												</div>
											) : (
												''
											)}

											<div className='flex items-center gap-3'>
												<button
													onClick={(e) => handleBackCarousel(e)}
													className='hover:bg-zinc-500  text-white  bg-zinc-700 w-full h-8 mt-6 rounded-md dark:hover:bg-zinc-900'>
													Atras
												</button>

												<button
													onClick={(e) => handleNextCarousel(e)}
													disabled={salario === '0' || ahorro === '0' || isMajor}
													className='hover:bg-zinc-500   bg-zinc-700 text-white w-full h-8 mt-6 rounded-md disabled:dark:hover:bg-zinc-700 hover:dark:bg-zinc-900'>
													Confirmar
												</button>
											</div>
										</div>
									</form>
									<p className='flex gap-2 m-0 absolute bottom-5'>
										<span className='dark:bg-slate-700 bg-slate-300  h-3 w-3 rounded-full'></span>
										<span className='dark:bg-slate-100 bg-slate-700  h-3 w-3 rounded-full'></span>
										<span className='dark:bg-gray-700 bg-slate-300  h-3 w-3 rounded-full'></span>
									</p>
								</CardContent>
							</Card>
						</div>
					</CarouselItem>

					<CarouselItem className='flex justify-center'>
						<div className='p-1 flex items-center justify-b w-[580px] h-[600px]'>
							<Card className='h-full w-full'>
								{salario === '' || salario === '0' || ahorro === '0' || ahorro === '' || isMajor ? (
									<div className='flex justify-center items-center h-full flex-col'>
										<TriangleAlert className='text-yellow-500 ' />
										<p className='text-2xl w-5/6 text-center'>
											Los campos de salario y ahorro son <span className='text-red-500'>obligatorios </span>
										</p>
										<p className='text-2xl w-5/6 text-center mt-3'>
											lo que esperas ahorrar
											<span className='text-yellow-600'> no puede ser mayor o igual a tus ingresos</span>
										</p>
										<button
											onClick={(e) => handleBackCarousel(e)}
											className=' hover:bg-zinc-500   text-white bg-zinc-700 w-5/6 h-8 mt-6 rounded-md dark:hover:bg-zinc-900'>
											Volver
										</button>
										<p className='flex gap-2 m-0 absolute bottom-5'>
											<span className='dark:bg-slate-700  bg-slate-300 h-3 w-3 rounded-full'></span>
											<span className='dark:bg-slate-700  bg-slate-300 h-3 w-3 rounded-full'></span>
											<span className='dark:bg-gray-100  bg-slate-700 h-3 w-3 rounded-full'></span>
										</p>
									</div>
								) : (
									<CardContent className='flex-grow flex h-full w-full items-center justify-center p-6 gap-8 flex-col'>
										<p className='text-3xl mb-20 '>Tu billetera luce asi</p>

										<div className='flex flex-col justify-center items-start gap-10'>
											<div className='flex flex-col gap-10 justify-center  items-start '>
												<p className='font-medium text-lg  flex flex-col md:flex-row'>
													Tu tipo de moneda es:
													<span className='font-normal text-lg mx-2 text-green-500'>
														{currency === 'cop' ? (
															<>
																<span className='capitalize'>peso colombiano </span> <span className='uppercase '>({currency})</span>
															</>
														) : (
															<>
																<span className='capitalize'>Dolar Americano </span> <span className='uppercase'>({currency})</span>
															</>
														)}
													</span>
												</p>
												<p className='font-medium text-lg flex flex-col md:flex-row'>
													Tu salario es: <span className='font-normal text-lg mx-2 text-green-500'>{salario}</span>
												</p>

												<p className='font-medium text-lg flex flex-col md:flex-row '>
													Tu ahorro es: <span className='font-normal text-lg mx-2 text-green-500'>{ahorro}</span>
												</p>
											</div>
										</div>

										<div className='flex  w-full gap-3'>
											<button
												onClick={(e) => handleBackCarousel(e)}
												className=' hover:bg-zinc-500  text-white bg-zinc-700 h-8 w-full mt-6 rounded-md dark:hover:bg-zinc-900'>
												Atras
											</button>
											<button
												disabled={loader}
												onClick={submitInfoWallet}
												className='hover:bg-zinc-500 text-white bg-zinc-700 h-8 w-full mt-6 rounded-md dark:hover:bg-zinc-900 flex justify-center items-center'>
												{loader ? <LoaderApi color='white' /> : 'Crear billetera'}
											</button>
										</div>

										{visibility ? (
											<Toast
												message={apiResponse?.message}
												severity={apiResponse.status === 201 ? 'success' : 'error'}
												visibility={visibility}
											/>
										) : (
											''
										)}
										<p className='flex gap-2 m-0 absolute bottom-5'>
											<span className='dark:bg-slate-700  bg-slate-300 h-3 w-3 rounded-full'></span>
											<span className='dark:bg-slate-700  bg-slate-300  h-3 w-3 rounded-full'></span>
											<span className='dark:bg-gray-100  bg-slate-700 h-3 w-3 rounded-full'></span>
										</p>
									</CardContent>
								)}
							</Card>
						</div>
					</CarouselItem>
				</CarouselContent>
				<CarouselPrevious
					className='hidden md:flex hover:bg-zinc-600'
					ref={btnBack}
				/>
				<CarouselNext
					className='hidden md:flex hover:bg-zinc-600'
					ref={btnNext}
				/>
			</Carousel>
		</section>
	);
};
