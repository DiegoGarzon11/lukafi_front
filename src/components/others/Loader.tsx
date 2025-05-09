import { LoaderPage } from '@/assets/icons/Svg';

export const LoaderComponent = () => {
	return (
		<div className='h-screen flex justify-center flex-col items-center dark:bg-dark_primary_color bg-light_primary_color md:ml-3'>
			<LoaderPage color='#ea487c' />
			<p className='text-6xl font-semibold tracking-wider font-mono'>
				<span className='dark:text-lime-500 text-lime-500'>L</span>
				<span className='dark:text-lime-400 text-lime-600'>U</span>
				<span className='dark:text-lime-300 text-lime-700'>K</span>
				<span className='dark:text-lime-200 text-lime-800'>A</span>
				<span className='dark:text-lime-100 text-lime-900'>F</span>
				<span className='dark:text-lime-100 text-lime-900'>I</span>
			</p>
		</div>
	);
};
