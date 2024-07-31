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
			<div className='md:flex justify-between items-center w-3/4 '>
				<div
					onMouseEnter={handleMouseEnter}
					onMouseLeave={handleMouseLeave}
					onTouchStart={handleMouseEnter}
					onTouchEnd={handleMouseLeave}
					className='md:relative group text-center cursor-pointer'>
					<span className='md:absolute font-semibold md:text-[400px] text-[150px]  md:-left-32 md:-top-28 dark:text-white group-hover:scale-105 transition-all'>
						4<span className='invisible'>0</span>4
					</span>
					<img
						src='/images/img_not_found.webp'
						alt='Imagen no encontrada'
						className='md:ml-14 md:mt-3 md:w-[400px] md:relative md:left-0 md:top-0 absolute left-40 top-52 w-[150px] row-span-2 pt-10 scale-100 transform transition-transform duration-500 hover:rotate-3 z-20 group-hover:scale-110'
					/>
				</div>

				<div className='flex flex-col md:items-end items-center'>
					<p className='text-end font-semibold dark:text-white text-9xl'>Oops!</p>
					<p className='dark:text-white text-2xl text-balance my-10 text-center md:text-end'>
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
