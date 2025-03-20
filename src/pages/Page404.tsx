import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export const PageNotFound = () => {
	return (
		<main className='flex flex-col items-center justify-center bg-light_secondary_color dark:bg-dark_secondary_color h-screen'>
			<img
				src='/images/404.webp'
				alt='Imagen no encontrada'
				className=' md:h-64 h-56 '
			/>
			<p className=' font-semibold text-main_color md:text-6xl text-4xl my-3'>Oops!</p>
			<p className='dark:text-white text-black'>Parece que lo que buscas no existe</p>
			<Link to='/'>
				<Button className='bg-alternative_color text-white my-3 cursor-pointer'>Volver a la página principal</Button>
			</Link>
		</main>
	);
};
