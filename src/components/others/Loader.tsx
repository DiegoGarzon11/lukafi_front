import { LoaderPage } from '@/assets/icons/Svg';

export const LoaderComponent = () => {
	return (
		<div className='h-screen flex justify-center flex-col items-center  '>
			<LoaderPage />
			<p className='text-6xl font-semibold tracking-wider font-mono'>
				<span className='dark:text-green-500 text-green-500'>L</span>
				<span className='dark:text-green-400 text-green-600'>U</span>
				<span className='dark:text-green-300 text-green-700'>K</span>
				<span className='dark:text-green-200 text-green-800'>A</span>
				<span className='dark:text-green-100 text-green-900'>F</span>
				<span className='dark:text-green-50 text-green-950'>I</span>
			</p>
		</div>
	);
};
