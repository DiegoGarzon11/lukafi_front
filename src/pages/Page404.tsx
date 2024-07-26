import {Link} from 'react-router-dom';

export const PageNotFound = () => {
	return (
		<main className='flex flex-col items-center justify-center bg-slate-200 dark:bg-slate-950 h-screen '>
			<div className='grid grid-cols-2 justify-items-center gap-y-8 items-center w-2/5 my-10'>
				<h1 className='text-9xl text-slate-800 dark:text-white font-light'>404</h1>
				<img src='images/img_pageNF.png' width={280} alt='' className='pl-10 row-span-2 pt-10' />
				<p className='text-xl font-mono text-center text-white  text-pretty' style={{textShadow: `1px 1px 3px green`}}>
					Oops! parece que te fuiste por el camino equivocada hacia una mejor financiación
				</p>
				<Link to='/auth'>
					<button className='bg-slate-950 text-white border border-slate-900 dark:border-white p-3 rounded-xl hover:scale-110 ease-in duration-150'>
						Volver al inicio
					</button>
				</Link>
			</div>
		</main>
	);
};
