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
				className={` absolute    transition-transform ease-in-out ${
					view ? 'translate-x-full ease-in-out' : ''
				} hidden  lg:block md:h-full     opacity-80  dark:opacity-35 aspect-square lg:p-4 rounded-3xl md:w-2/4  lg:object-fill `}
				src='/images/init.webp'
				alt=''
			/>
			<div className='grid grid-cols-1   lg:grid-cols-2 h-dvh justify-center lg:items-start '>
				<div className='mt-20  w-full  flex  items-center  flex-col md:flex-row    '>
					<div className='flex  w-full items-end z-10  md:mb-10  '>
						<Link to='/'>
							<button className='p-1 bg-slate-200 dark:bg-slate-600 rounded-full mx-5 md:mx-20 flex items-center gap-1 px-3  '>
								<ArrowBack /> <span className='text-lg'>{t('form.btn.back')}</span>
							</button>
						</Link>

						<div className='  flex items-center justify-end mx-5 md:mx-20 '>
							<button
								className={`${
									view ? ' bg-slate-300/70 text-white font-bold  dark:bg-slate-600/80' : 'text-white'
								}  text-xl border border-slate-200 rounded-tl-2xl p-3 md:w-40 `}
								onClick={changeAuth}>
								{t('form.field.signIn')}
							</button>
							<button
								className={`${
									view ? 'text-white' : 'bg-slate-300/70 text-white font-bold  dark:bg-slate-600/80 '
								} text-xl border border-slate-200 rounded-tr-2xl p-3 md:w-40`}
								onClick={changeAuth}>
								{t('form.field.signUp')}
							</button>
						</div>
					</div>
					<p
						style={{ textShadow: ' 1px 8px 2px black' }}
						className={` hidden absolute lg:block     text-white md:text-2xl lg:text-4xl text-pretty textc  tracking-wider leading-none z-10  bottom-20 w-3/12  font-semibold    ${
							view ? 'translate-x-1/4   ' : 'left-24  '
						}  `}>
						Bienvenido/a a <span className='text-green-500'>Lukafi</span>, tu compañero/a en el camino hacia la libertad financiera.
					</p>
				</div>

				<div className={` flex justify-center items-start lg:items-center w-full h-full ${view ? '-order-1' : ''}  `}>
					<section className='w-5/6   '>{view ? <SignIn /> : <SignUp />}</section>
				</div>
			</div>
		</>
	);
}
