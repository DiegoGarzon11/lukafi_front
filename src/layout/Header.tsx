import {Col, Usa, Moon, Sun} from '@/assets/icons/Svg';
import {useTranslation} from 'react-i18next';
import {useEffect, useState} from 'react';
import {Link, Outlet} from 'react-router-dom';
import {Button} from '@/components/ui/button';
import {SheetSide} from '@/components/ui/sheetSide';

export default function Header() {
	const [isOpen, setIsOpen] = useState(false);
	const [theme, setTheme] = useState(() => {
		const savedTheme = localStorage.getItem('theme');
		return savedTheme || 'light';
	});

	const {t, i18n} = useTranslation();
	const onChangeLanguage = (e) => {
		i18n.changeLanguage(e);
		if (e === 'es') {
			localStorage.setItem('lang', 'es');
		} else {
			localStorage.setItem('lang', 'en');
		}

		document.documentElement.lang = e;
	};
	const handleTheme = () => {
		setTheme((prevTheme) => {
			const newTheme = prevTheme === 'dark' ? 'light' : 'dark';
			localStorage.setItem('theme', newTheme);

			if (newTheme === 'dark') {
				document.documentElement.classList.add('dark');
				document.documentElement.classList.remove('light');
			} else {
				document.documentElement.classList.remove('dark');
				document.documentElement.classList.add('light');
			}

			return newTheme;
		});
	};
	useEffect(() => {
		const storedTheme = localStorage.getItem('theme') || 'light';
		setTheme(storedTheme);

		if (storedTheme === 'dark') {
			document.documentElement.classList.add('dark');
			document.documentElement.classList.remove('light');
		} else {
			document.documentElement.classList.remove('dark');
			document.documentElement.classList.add('light');
		}
	}, []);

	return (
		<>
			<header className='  dark:bg-slate-950 dark:text-white z-50 absolute  flex w-full justify-center gap-5  '>
				<div className=' w-[98%] fixed flex justify-between shadow-sm shadow-slate-700 rounded-full p-3 z-10 bg-gradient-to-b dark:from-slate-900 dark:to-slate-950 bg-white'>
					<div className='flex justify-start gap-3 items-center'>
						<p className='text-lg pl-5'>Lukafi</p>
					</div>

					<div className='flex items-center gap-5'>
						{!localStorage.token && (
							<div>
								<Link to='/auth'>
									<Button variant='black_outline'>
										{t('header.signIn')} / {t('form.field.signUp')}
									</Button>
								</Link>
							</div>
						)}

						<button onClick={() => setIsOpen(!isOpen)} className=''>
							{localStorage.lang == 'en' ? <Usa /> : <Col />}
						</button>
						{isOpen && (
							<div className='absolute dark:text-white dark:bg-slate-900 bg-white  rounded-lg shadow w-36 right-20 top-12 '>
								<div className='p-2 flex flex-col gap-3'>
									<button
										className='hover:scale-105'
										onClick={() => {
											onChangeLanguage('es');
											setIsOpen(false);
										}}>
										<p className='flex items-center gap-3'>
											<Col /> <span>{t('header.languages.es')}</span>
										</p>
									</button>
									<button
										className='hover:scale-105'
										onClick={() => {
											onChangeLanguage('en');
											setIsOpen(false);
										}}>
										<p className='flex items-center gap-3'>
											<Usa />
											<span>{t('header.languages.en')}</span>
										</p>
									</button>
								</div>
							</div>
						)}
						{theme === 'dark' ? (
							<button className='dark:bg-transparent dark:hover:bg-transparent p-0' onClick={handleTheme}>
								<Moon />
							</button>
						) : (
							<button className='bg-transparent hover:bg-transparent p-0' onClick={handleTheme}>
								<Sun />
							</button>
						)}
						{localStorage.token && <SheetSide />}
					</div>
				</div>
			</header>
			<Outlet />
		</>
	);
}
