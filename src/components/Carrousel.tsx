import { CreateWallet } from '@/apis/WalletService';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader } from '@/assets/icons/Svg';
import { useRef, useState } from 'react';
import { Send, Trash, Warning } from '@/assets/icons/Svg';
import { Toast } from '@/tools/Toast';
export const Carrusel = () => {
	const btnNext = useRef(null);
	const [salario, setSalario] = useState('');
	const [ahorro, setAhorro] = useState('');
	const [fixedExpenses, setFixedExpenses] = useState([]);
	const [nameFixedExpenses, setnameFixedExpenses] = useState('');
	const [valueFixedExpenses, setvalueFixedExpenses] = useState('');
	const [fixedIncomes, setFixedIncomes] = useState([]);
	const [nameFixedIncomes, setnameFixedIncomes] = useState('');
	const [valueFixedIncomes, setvalueFixedIncomes] = useState('');
	const [apiResponse, setApiResponse] = useState(null);
	const inputFixedExpenses = useRef(null);
	const inputFixedIncomes = useRef(null);
	const [visibility, setVisibility] = useState(false);
	const [loader, setLoader] = useState(false);
	const user = JSON.parse(localStorage.getItem('userMain'));

	const selectChipsExpenses = (e) => {
		if (nameFixedExpenses.trim() === '' || valueFixedExpenses.trim() === '') {
			return;
		} else if (e.key === 'Enter' && e.target.id === 'value_expense') {
			inputFixedExpenses.current.focus();
		} else if (!(e.key === 'Enter' || e.type === 'click')) {
			return;
		}

		const newExpense = {
			id: Date.now(),
			name: nameFixedExpenses.trim(),
			value: valueFixedExpenses,
		};

		setFixedExpenses([...fixedExpenses, newExpense]);

		setnameFixedExpenses('');
		setvalueFixedExpenses('');
	};

	const selectChipsIncomes = (e) => {
		if (nameFixedIncomes.trim() === '' || valueFixedIncomes.trim() === '') {
			return;
		} else if (e.key === 'Enter' && e.target.id === 'value_income') {
			inputFixedIncomes.current.focus();
		} else if (!(e.key === 'Enter' || e.type === 'click')) {
			return;
		}

		const newFixedIncomes = {
			id: Date.now(),
			name: nameFixedIncomes.trim(),
			value: valueFixedIncomes,
		};

		setFixedIncomes([...fixedIncomes, newFixedIncomes]);

		setnameFixedIncomes('');
		setvalueFixedIncomes('');
	};

	const handleValuesMoney = (e, item: string) => {
		let value = e.target.value.replace(/[^0-9.]/g, '');
		if (value === '') {
			value = '0';
		}
		if (!isNaN(value)) {
			const floatValue = parseFloat(value);
			if (item === 'salario') {
				const formattedValue = floatValue.toLocaleString();
				setSalario(formattedValue);
			} else if (item === 'ahorro') {
				const formattedValue = floatValue.toLocaleString();
				setAhorro(formattedValue);
			} else if (item === 'valueExpense') {
				const formattedValue = floatValue.toLocaleString();
				setvalueFixedExpenses(formattedValue);
			} else if (item === 'valueIncome') {
				const formattedValue = floatValue.toLocaleString();
				setvalueFixedIncomes(formattedValue);
			}
		}
	};
	const deleteValue = (id, name) => {
		if (name === 'incomes') {
			const resetValue = fixedIncomes.filter((value) => {
				return value.id !== id;
			});
			setFixedIncomes(resetValue);
		} else if (name === 'expenses') {
			const resetValue = fixedExpenses.filter((value) => {
				return value.id !== id;
			});
			setFixedExpenses(resetValue);
		}
	};

	async function submitInfoWallet() {
		setLoader(true);
		const date = new Date();
		const params = {
			salary: salario,
			saving: ahorro,
			FixedCosts: fixedExpenses,
			FixedIncomes: fixedIncomes,
			month: date.getMonth(),
			year: date.getFullYear(),
			user_id: user?.User_id,
		};

		const response = await CreateWallet(params);
		if (response) {
			setLoader(false);
			setVisibility(true);
			setTimeout(() => {
				setVisibility(false);
			}, 1000);
			setApiResponse(response);
		} else {
			window.location.href = '/dashboard';
		}
	}

	return (
		<section className='flex justify-center items-center h-screen '>
			<Carousel className=' max-w-3xl  flex justify-center items-center '>
				<CarouselContent>
					<CarouselItem className='flex justify-center'>
						<div className='p-1 flex items-center justify-center w-[580px] h-[600px]'>
							<Card className='h-full w-full'>
								<CardContent className='flex h-full  items-center justify-center gap-32 p-6 flex-col  text-center text-wrap'>
									<h1 className='text-4xl'>
										Bienvenido <span className='capitalize text-green-500'>{user.FullName}</span>
									</h1>

									<div className='flex flex-col gap-10'>
										<p className='text-2xl'>Una correcta billetera requiere la siguiente información</p>
										<p className='text-lg'>No te preocupes esta información solo esta a tu alcancé</p>
									</div>
								</CardContent>
							</Card>
						</div>
					</CarouselItem>

					<CarouselItem className='flex justify-center'>
						<div className='p-1 flex items-center justify-center w-[580px] h-[600px]'>
							<Card className='h-full w-full'>
								<CardContent className='flex h-full w-full items-center justify-center p-6 gap-8 flex-col'>
									<p className='mb-10 text-2xl'>
										Salario y Ahorro <span className='text-red-500'>*</span>
									</p>
									<div className='w-full'>
										<p className='mb-2'>
											¿Cual es tu salario promedio? <span className='text-red-500'>*</span>
										</p>
										<div className=' flex  justify-center items-center gap-2'>
											<Input
												type='text'
												className='appearance-none'
												value={salario}
												onChange={(e) => handleValuesMoney(e, 'salario')}
											/>
											<div className='flex-grow flex flex-col justify-center'>
												<select
													name=''
													id=''>
													<option value='cop'>COP</option>
													<option value='usd'>USD</option>
												</select>
											</div>
										</div>
									</div>

									<div className='w-full'>
										<p className='mb-2'>
											¿Cual es la cantidad que esperas ahorrar? <span className='text-red-500'>*</span>
										</p>
										<div className='flex  justify-center items-center gap-2'>
											<Input
												type='text'
												className='appearance-none'
												value={ahorro}
												onChange={(e) => handleValuesMoney(e, 'ahorro')}
											/>
											<select
												name=''
												id=''>
												<option value='cop'>COP</option>
												<option value='usd'>USD</option>
											</select>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>
					</CarouselItem>
					<CarouselItem className='flex justify-center'>
						<div className='p-1 flex items-center  w-[580px] h-[600px]'>
							<Card className='h-full w-full'>
								<CardContent className='flex-grow flex h-full w-full items-center justify-center p-6 gap-8 flex-col'>
									<p className='text-2xl mdbl'>¿Cuales son tu principales ingresos?</p>
									<legend className='hidden md:block'>
										Confirma oprimiendo la tecla
										<span className='text-green-500 font-medium'> Enter</span>
									</legend>
									<div className='flex flex-col justify-center items-center'>
										<div className='flex gap-5'>
											<div>
												<label
													className='mb-2'
													htmlFor='name_income'>
													Nombre
												</label>
												<Input
													id='name_income'
													type='text'
													ref={inputFixedIncomes}
													value={nameFixedIncomes}
													onChange={(e) => setnameFixedIncomes(e.target.value)}
													onKeyDown={selectChipsIncomes}
												/>
											</div>
											<div>
												<label
													className='mb-2'
													htmlFor='value_income'>
													Valor $
												</label>
												<Input
													id='value_income'
													type='text'
													value={valueFixedIncomes}
													onChange={(e) => handleValuesMoney(e, 'valueIncome')}
													onKeyDown={selectChipsIncomes}
												/>
											</div>
											<button
												className='h-full flex items-end mb-2'
												onClick={selectChipsIncomes}>
												<Send />
											</button>
										</div>
									</div>

									{fixedIncomes.length >= 1 ? (
										<Table className=''>
											<TableHeader>
												<TableRow>
													<TableHead className='w-[100px]'>N°</TableHead>
													<TableHead>Nombre</TableHead>
													<TableHead>Value</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												{fixedIncomes.map((e, i) => (
													<TableRow key={e.id}>
														<TableCell className='font-medium text-base'>{i + 1}</TableCell>

														<TableCell className='font-medium text-base'>{e.name}</TableCell>
														<TableCell className='font-medium text-base'>{e.value}</TableCell>

														<TableCell className='font-medium'>
															<button
																className='hover:bg-slate-800 p-2 rounded-md'
																onClick={() => deleteValue(e.id, 'incomes')}>
																<Trash className={'w-7'} />
															</button>
														</TableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>
									) : (
										<p>No has agregado ingresos aun</p>
									)}
								</CardContent>
							</Card>
						</div>
					</CarouselItem>
					<CarouselItem className='flex justify-center'>
						<div className='p-1 flex items-center justify-b w-[580px] h-[600px]'>
							<Card className='h-full w-full'>
								<CardContent className='flex-grow flex h-full w-full items-center justify-center p-6 gap-8 flex-col'>
									<p className=' text-2xl'>¿Cuales son tu principales gastos?</p>
									<legend className='hidden md:block'>
										Confirma oprimiendo la tecla
										<span className='text-green-500 font-medium'> Enter</span>
									</legend>
									<div className='flex flex-col justify-center items-center'>
										<div className='flex gap-5 items-center justify-center'>
											<div>
												<label htmlFor='name_expense'>Nombre</label>
												<Input
													id='name_expense'
													type='text'
													ref={inputFixedExpenses}
													value={nameFixedExpenses}
													onKeyUp={(e) => (e.key === 'Enter' ? selectChipsExpenses : '')}
													onChange={(e) => setnameFixedExpenses(e.target.value)}
													onKeyDown={selectChipsExpenses}
												/>
											</div>
											<div>
												<label htmlFor='value_expense'>Valor $</label>
												<Input
													id='value_expense'
													type='text'
													value={valueFixedExpenses}
													onChange={(e) => handleValuesMoney(e, 'valueExpense')}
													onKeyDown={selectChipsExpenses}
												/>
											</div>
											<button
												className='h-full flex items-end '
												onClick={selectChipsExpenses}>
												<Send />
											</button>
										</div>
									</div>

									{fixedExpenses.length >= 1 ? (
										<Table className=''>
											<TableHeader>
												<TableRow>
													<TableHead className='w-[100px]'>N°</TableHead>
													<TableHead>Nombre</TableHead>
													<TableHead>Value</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												{fixedExpenses.map((e, i) => (
													<TableRow key={e.id}>
														<TableCell className='font-medium text-base'>{i + 1}</TableCell>

														<TableCell className='font-medium text-base'>{e.name}</TableCell>
														<TableCell className='font-medium text-base'>{e.value}</TableCell>

														<TableCell className='font-medium'>
															<button
																className='hover:bg-slate-800 p-2 rounded-md'
																onClick={() => deleteValue(e.id, 'expenses')}>
																<Trash className={'w-7'} />
															</button>
														</TableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>
									) : (
										<p>No has agregado ingresos aun</p>
									)}
								</CardContent>
							</Card>
						</div>
					</CarouselItem>

					<CarouselItem className='flex justify-center'>
						<div className='p-1 flex items-center justify-b w-[580px] h-[600px]'>
							<Card className='h-full w-full'>
								{salario === '' || salario === '0' || ahorro === '0' || ahorro === '' ? (
									<div className='flex justify-center items-center h-full flex-col'>
										<Warning />
										<p className='text-2xl w-5/6 text-center'>
											Los campos de salario y ahorro son <span className='text-red-500'>obligatorios</span>
										</p>
									</div>
								) : (
									<CardContent className='flex-grow flex h-full w-full items-center justify-center p-6 gap-8 flex-col'>
										<p className='text-3xl mb-20 '>Tu billetera luce asi</p>

										<div className='flex flex-col justify-center items-start gap-10'>
											<div className='flex gap-10 justify-center  items-center '>
												<p className='font-medium text-lg'>
													Tu salario es: <span className='font-normal text-lg mx-2'>{salario}</span>
												</p>

												<p className='font-medium text-lg '>
													Tu ahorro es: <span className='font-normal text-lg mx-2'>{ahorro}</span>
												</p>
											</div>
											<section>
												<p className='font-medium text-lg'>Tus ingresos son</p>
												<div className='flex flex-wrap gap-x-5 gap-y-1 '>
													{fixedIncomes.map((e) => (
														<p
															key={e.id}
															className='font-medium '>
															{e.name} : <span className='font-normal'> {e.value}</span> ;
														</p>
													))}
												</div>
											</section>
											<section>
												<p className='font-medium text-lg'>Tus gastos son:</p>
												<div className='flex flex-wrap gap-x-5 gap-y-1 '>
													{fixedExpenses.map((e) => (
														<p
															key={e.id}
															className='font-medium '>
															{e.name} : <span className='font-normal'> {e.value}</span> ;
														</p>
													))}
												</div>
											</section>
										</div>
										<button
											disabled={loader}
											onClick={submitInfoWallet}
											className='bg-neutral-200 w-full py-2 rounded-lg text-black font-normal hover:bg-blue-400 hover:text-white text-center flex justify-center disabled:bg-white'>
											{loader ? <Loader  /> : 'Confirmar'}
										</button>
										{apiResponse?.status === 409 ? (
											<Toast
												message={apiResponse?.message}
												severity='error'
												visibility={visibility}
											/>
										) : (
											''
										)}
									</CardContent>
								)}
							</Card>
						</div>
					</CarouselItem>
				</CarouselContent>
				<CarouselPrevious />
				<CarouselNext ref={btnNext} />
			</Carousel>
		</section>
	);
};
