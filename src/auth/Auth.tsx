import { Link } from 'react-router-dom';
import SignUp from './SignUp';
import SignIn from './SignIn';
import { ArrowBack } from '@/assets/icons/Svg';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

export default function Auth() {
	const { t, i18n } = useTranslation();
	i18n.changeLanguage();
	const [view, setView] = useState(true);
	const changeAuth = () => {
		setView((prevView) => !prevView);
	};

	return (
		<>
			<img
				className='hidden  lg:block md:h-full   absolute  opacity-35 aspect-square lg:p-4 rounded-3xl md:w-2/4  lg:object-fill '
				src='/images/init.webp'
				alt=''
			/>
			<div className='grid grid-cols-1   lg:grid-cols-2 h-dvh justify-center lg:items-start '>
				<div className='mt-20  w-full  flex  items-center  flex-col md:flex-row    '>
					<div className='flex  w-full items-end z-10  md:mb-10  '>
						<Link to='/'>
							<button className='p-1 bg-slate-600 rounded-full mx-5 md:mx-20  '>
								<ArrowBack />
							</button>
						</Link>

						<div className=' w-full  flex items-center justify-end mx-5 md:mx-20 '>
							<button
								className={`${view ? 'bg-slate-600' : ''} border border-slate-200 rounded-tl-2xl p-3 md:w-40 `}
								onClick={changeAuth}>
								<p className='text-xl text-white'> {t('form.field.signIn')}</p>
							</button>
							<button
								className={`${view ? '' : 'bg-slate-600'} border border-slate-200 rounded-tr-2xl p-3 md:w-40`}
								onClick={changeAuth}>
								<p className='text-xl text-white'> {t('form.field.signUp')}</p>
							</button>
						</div>
					</div>
					<p
						style={{ textShadow: ' 1px 8px 2px black' }}
						className=' hidden lg:block     text-white md:text-2xl lg:text-4xl text-balance  text-center tracking-wider leading-none z-10 absolute bottom-20 w-[34rem] left-1   font-semibold'>
						Bienvenido/a a <span className='text-green-500'>Lukafi</span>, tu compañero/a en el camino hacia la libertad financiera.
					</p>
				</div>

				<div className=' flex justify-center items-start lg:items-center w-full h-full'>
					<section className='w-5/6   '>{view ? <SignIn /> : <SignUp />}</section>
				</div>
			</div>
		</>
	);
}
