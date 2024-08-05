import {Link} from 'react-router-dom';
import SignUp from './SignUp';
import SignIn from './SignIn';
import {ArrowBigLeft} from 'lucide-react';
import {useTranslation} from 'react-i18next';
import {useState} from 'react';

export default function Auth() {
	const {t, i18n} = useTranslation();
	i18n.changeLanguage();
	const [view, setView] = useState(true);
	const changeAuth = () => {
		setView((prevView) => !prevView);
	};

	return (
		<>
			<img
				className={`absolute transition-transform ease-in-out ${
					view ? 'translate-x-full ease-in-out' : ''
				} hidden lg:block md:h-full opacity-80 dark:opacity-35 aspect-square lg:p-3 rounded-3xl md:w-2/4 lg:object-fill`}
				src='/images/init.webp'
				alt=''
			/>
			<div className='grid lg:grid-cols-2 lg:h-dvh justify-center lg:items-start '>
				<div className='mt-20 lg:row-span-1 row-start-1 w-full flex justify-center'>
					<div className='flex mt-10 items-end z-10 md:mb-10'>
						<Link to='/'>
							<button className='p-1 bg-slate-200 dark:bg-slate-600 rounded-full mx-5 md:mx-20 flex items-center gap-1 px-3'>
								<ArrowBigLeft /> <span className='text-sm lg:text-lg'>{t('form.btn.back')}</span>
							</button>
						</Link>

						<div className='flex items-center justify-end md:mx-20'>
							<button
								disabled={view}
								className={`${
									view ? ' bg-slate-300/70 text-black lg:text-white dark:bg-slate-600/80' : 'text-black lg:text-white'
								} dark:text-white text-sm lg:text-xl border border-slate-200 rounded-tl-2xl p-2 lg:p-3  md:w-40 `}
								onClick={changeAuth}>
								{t('form.field.signIn')}
							</button>
							<button
								disabled={!view}
								className={`${
									view ? 'text-black lg:text-white' : 'bg-slate-300/70 text-black  lg:text-white  dark:bg-slate-600/80'
								} dark:text-white  text-sm lg:text-xl border border-slate-200 rounded-tr-2xl p-2 lg:p-3 md:w-40`}
								onClick={changeAuth}>
								{t('form.field.signUp')}
							</button>
						</div>
					</div>
					<p
						style={{textShadow: '1px 8px 2px black'}}
						className={`hidden absolute lg:block text-white md:text-2xl lg:text-4xl text-pretty tracking-wider leading-none z-10 bottom-20 w-3/12  font-semibold ${
							view ? 'translate-x-1/4' : 'left-24'
						}  `}>
						Bienvenido/a a <span className='text-green-500'>Lukafi</span>, tu compañero/a en el camino hacia la libertad financiera.
					</p>
				</div>

				<div className={` flex justify-center lg:items-center w-full h-full ${view ? '-order-1' : ''}`}>
					<section className='md:w-5/6 w-full'>{view ? <SignIn /> : <SignUp />}</section>
				</div>
			</div>
		</>
	);
}
