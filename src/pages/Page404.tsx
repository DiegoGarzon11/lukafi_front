import {useRef} from 'react';
import {Link} from 'react-router-dom';

export const PageNotFound = () => {
	const audioRef = useRef(new Audio('/audio/pig.mp3'));

	const handleMouseEnter = () => {
		audioRef.current.play();
	};

	const handleMouseLeave = () => {
		audioRef.current.currentTime = 0;
	};

	return (
		<main className='flex flex-col items-center justify-center bg-slate-300 dark:bg-slate-950 h-screen'>
			<div className='flex flex-col xl:flex-row relative justify-between items-center w-3/4 '>
				<div
					onMouseEnter={handleMouseEnter}
					onMouseLeave={handleMouseLeave}
					onTouchStart={handleMouseEnter}
					onTouchEnd={handleMouseLeave}
					className='relative group text-center cursor-pointer'>
					<span className='flex items-center  font-semibold text-[170px] gap-20 md:gap-40 md:text-[300px] dark:text-white group-hover:scale-105 transition-all'>
						4
						<span className='absolute md:left-40 md:top-32 left-[80px] top-[70px] inline-block'>
							<img
								src='/images/img_not_found.webp'
								alt='Imagen no encontrada'
								className='md:w-64 md:h-64 w-36 h-36 row-span-2 scale-100 transform transition-transform duration-500 hover:rotate-3 z-20 group-hover:scale-110'
							/>
						</span>
						4
					</span>
				</div>

				<div className='flex flex-col xl:items-end items-center'>
					<p className='text-end font-semibold dark:text-white md:text-9xl text-7xl'>Oops!</p>
					<p className='dark:text-white text-2xl text-balance my-10 text-center xl:text-end'>
						Parece que te desviaste mientras intentabas ahorrar. Volvamos y cuidemos mejor tu dinero.
					</p>
					<Link to='/auth'>
						<button className='bg-slate-950 text-white border border-slate-900 dark:border-white p-3 rounded-xl hover:scale-110 ease-in duration-150'>
							Volver al inicio
						</button>
					</Link>
				</div>
			</div>
		</main>
	);
};
