import { ChartFinance } from '@/components/core/Charts';

export const WalletComponent = () => {
	return (
		<main className='  h-screen pt-20 p-3 ark:bg-dark_primary_color  font-thin bg-dark_primary_color grid grid-cols-2 '>
			<section>
				ahfgsdkjf
			</section>
			<section className='flex flex-col gap-5'>
				<div className='flex flex-col justify-between w-full rounded-3xl p-8 shadow-sm shadow-zinc-900/90'>
					<ChartFinance />
				</div>
				<div className='bg-black flex justify-center p-3'>
					selecciona tu tarjeta
					<article className=' text-white flex flex-col justify-between  bg-gradient-to-r  to-green-400  from-gray-700 w-full md:w-2/5 rounded-3xl p-8 shadow-xl shadow-zinc-900/90'>
						<div className='flex justify-between'>
							<p className='text-xl font-bold'>diego</p>
							<p className='text-5xl font-bold tracking-widest  '>LUFI</p>
						</div>
						<div className='flex flex-col'>
							<p className=' font-semibold'>12312873</p>
							<p className=' font-semibold text-3xl tracking-wider'>10.000.000</p>
						</div>
						<div className='flex justify-between '>
							<p className='font-semibold'>123123-123-12312-122</p>
							<p>20/10/24</p>
						</div>
					</article>
				</div>
			</section>
		</main>
	);
};
