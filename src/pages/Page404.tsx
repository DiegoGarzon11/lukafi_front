import { useRef } from 'react';


export const PageNotFound = () => {
	const audioRef = useRef(new Audio('/audio/pig.mp3'));

	const handleMouseEnter = () => {
		audioRef.current.play();
	};

	const handleMouseLeave = () => {
		audioRef.current.currentTime = 0;
	};

	return (
		<main className='flex flex-col items-center justify-center bg-zinc-300 dark:bg-zinc-900 h-screen'>
			<div className='flex flex-col xl:flex-row relative justify-between items-center w-3/4 '>
				<div
					onMouseEnter={handleMouseEnter}
					onMouseLeave={handleMouseLeave}
					onTouchStart={handleMouseEnter}
					onTouchEnd={handleMouseLeave}
					className='relative group text-center cursor-pointer'>
					<p className='flex items-center  font-semibold text-[170px] gap-20 md:gap-40 md:text-[300px] dark:text-white group-hover:scale-105 transition-all'>
						<span className='mr-6 md:mr-8'>4</span>
						<span className='absolute md:left-40 md:top-32 left-20 top-16 inline-block'>
							<img
								src='/images/img_not_found.webp'
								alt='Imagen no encontrada'
								className=' md:h-64 w-full h-40 row-span-2 scale-100 transform transition-transform duration-500 hover:rotate-3 z-20 group-hover:scale-110 m'
							/>
						</span>
						<span className=' ml-8 md:ml-14'>4</span>
					</p>
				</div>

				<div className='flex flex-col xl:items-end items-center'>
					<p className='text-end font-semibold dark:text-white md:text-9xl text-7xl'>Oops!</p>
					<p className='dark:text-white text-2xl text-balance my-10 text-center xl:text-end'>
						Parece que te desviaste mientras intentabas ahorrar. Volvamos y cuidemos mejor tu dinero
					</p>
				</div>
			</div>
		</main>
	);
};
