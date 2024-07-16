import {Link} from 'react-router-dom';

export const PageNotFound = () => {
	return (
		<main className='flex justify-center '>
			<div className='fixed bg-slate-400 mt-40 w-2/4 h-2/3 rounded-lg flex flex-col justify-center items-center border '>
				<h1 className='text-9xl'>404</h1>
				<p className='text-2xl'>Esta pagina no se encuentra</p>
				<Link to='/'>
					<button className='mt-20 border bg-slate-200 border-slate-900 p-3 rounded-xl hover:scale-105'>Volver al inicio</button>
				</Link>
			</div>
		</main>
	);
};
