import { ChartFinance } from '@/components/core/Charts';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { CURRENCIES } from '@/tools/currencies';

export const WalletComponent = () => {
	const [api, setApi] = useState<CarouselApi>();
	const [current, setCurrent] = useState(0);
	const [count, setCount] = useState(0);
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
	return (
		<main className='  h-screen pt-16 p-3 font-thin bg-black  gap-3'>
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
			<div className='flex gap-3'>
				<section className='w-6/12'>
					<div className=' '>
						<Card className='dark:bg-dark_primary_color p-10'>
							<CardContent className='flex flex-col gap-3 '>
								<p>Tu salario</p>

								<p className='text-5xl '>$ 10.000.000 cop</p>
								<p>Ultima actualización: 20/10/24</p>
							</CardContent>
						</Card>
						<div className='flex  flex-col  justify-center items-center gap-3 mt-10 h-full'>
							<div className='relative inline-block my-5'>
								<button className=' text-white font-medium py-2 px-6  rounded-full flex items-center space-x-2 shadow-inner shadow-green-600 hover:bg-green-600 transition-colors ease-in duration-300 '>
									<span className='font-semibold'>Editar billetera</span>
								</button>
								<div className='absolute left-1/2  -translate-x-1/2 -bottom-2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-green-600'></div>
							</div>
							<p className='font-semibold text-start w-1/2 underline'>Selecciona tipo de moneda</p>
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
							<div className='w-full flex justify-center items-center gap-3 px-10'>
								<div className='w-1/2'>
									<p className='font-semibold text-start underline'>Modificar salario</p>
									<Input className='' />
								</div>
								<div className='w-1/2'>
									<p className='font-semibold text-start underline'>Modificar meta a ahorrar</p>
									<Input className='' />
								</div>
							</div>

							<div className='w-full flex justify-center items-end gap-3 px-10'>
								<button className='bg-green-500 text-white w-1/2 rounded-md py-2 font-semibold '>Guardar</button>
								<button className='bg-red-500 text-white w-1/2 rounded-md py-2 font-semibold '>Eliminar billetera</button>
							</div>
						</div>
					</div>
				</section>
				<section className='flex flex-col gap-3 w-6/12'>
					<div className='flex flex-col justify-between  rounded-xl p-8 shadow-sm shadow-zinc-900/90 min-w-4/5 dark:bg-dark_primary_color '>
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
										<article className=' text-white flex flex-col justify-between  bg-gradient-to-r  to-green-400  from-gray-700  rounded-3xl p-8 shadow-xl shadow-zinc-900/90 min-w-80 '>
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
												<p>20/10/24</p>
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
		</main>
	);
};
