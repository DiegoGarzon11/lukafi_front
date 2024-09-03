export const WalletComponent = () => {
	return (
		<section className='flex flex-col items-center h-full pt-20 p-5 gap-5 dark:bg-zinc-800 bg-white font-thin'>
			<div className='h-60 flex flex-col justify-between  bg-gradient-to-l  to-cyan-400  from-gray-900 w-96 rounded-3xl p-8 shadow-xl shadow-zinc-900/90'>
				<div className='flex justify-between'>
				
					<p className="text-xl font-bold">Diego Garzon</p>
					<p className="text-5xl font-bold tracking-widest ">LUFI</p>
				</div>
				<div className='flex flex-col'>
					<p className='text-white font-semibold'>Saldo disponible</p>
					<p className='text-white font-semibold text-3xl tracking-wider'>$1000</p>
				</div>
				<div className='flex justify-between '>
					<p className='font-semibold'>1111 2222 2222 2222</p>
					<p>09/23</p>
				</div>
			</div>
		</section>
	);
};
