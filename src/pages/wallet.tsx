const Wallet = () => {
	const infoUser = localStorage.userMain ? JSON.parse(localStorage?.userMain) : '';
	return (
		<section className='flex flex-col items-center h-full pt-20 p-5 gap-5 dark:bg-zinc-800 text-white bg-white font-thin'>
			<div className='card relative w-1/4 h-60 bg-zinc-900 rounded-lg '>
				<span className='text-8xl font-semibold absolute bottom-0 opacity-10 rotate-12'>Lu</span>
				<span className='text-8xl font-semibold absolute right-1 text-green-300/20 -rotate-12'>Fi</span>

				<h2 className='p-10 font-thin '>{infoUser.full_name}</h2>
				<p className='flex flex-col'>
					<span className='text-3xl self-center font-semibold'>
						<span> 1111</span>
						<span className='text-green-200'> 2222</span>
						<span className='text-green-300'> 2222</span>
						<span className='text-green-400'> 2222</span>
					</span>
					<span className='self-end mt-7 mr-8'>
						<span className='font-medium text-sm'>Cliente desde: </span>
						2/10/2024
					</span>
				</p>
			</div>
		</section>
	);
};

export default Wallet;
