import { Col, Usa, Moon, Sun } from '@/assets/icons/Svg';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SheetSide } from '@/layout/sheetSide';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
export default function Header({valueSide}) {
	const location = useLocation();
	const [isOpen, setIsOpen] = useState(false);
	const [isSideOpen, setIsSideOpen] = useState(true);
	const [theme, setTheme] = useState(() => {
		const savedTheme = localStorage.getItem('theme');
		return savedTheme || 'light';
	});

	const { t, i18n } = useTranslation();
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

	const handleSidebar = () => {
		setIsSideOpen(!isSideOpen);
		valueSide(!isSideOpen);
	};

	return (
		<>
			<header className='   z-50 absolute   gap-5  '>
				<div className='flex justify-start gap-3 items-center'>
					<SidebarProvider
						open={isSideOpen}
						onOpenChange={handleSidebar}>
						<SheetSide />
						{localStorage.token && <SidebarTrigger className='z-50 mt-3 ml-3 sticky top-3' />}
						<Button
							variant='ghost'
							className='z-50 mt-3 ml-3 text-lg  sticky top-3 cursor-default'>
							Lukafi
						</Button>
						<div className=' w-full fixed flex justify-end shadow-sm shadow-z-700 rounded-full p-3 z-10 bg-gradient-to-b dark:from-zinc-950 dark:to-dark_primary_color from-zinc-100 to-zinc-300 border-b border-gray-600/50 '>
							<div className='flex items-center gap-5'>
								{!localStorage.token && location.pathname === '/' && (
									<div>
										<Link to='/auth'>
											<Button variant='black_outline'>
												{t('header.signIn')} / {t('form.field.signUp')}
											</Button>
										</Link>
									</div>
								)}

								<button
									onClick={() => setIsOpen(!isOpen)}
									className=''>
									{localStorage.lang == 'en' ? <Usa /> : <Col />}
								</button>
								{isOpen && (
									<div className='absolute dark:text-white dark:bg-zinc-900 bg-white  rounded-lg shadow w-36 right-20 top-12 '>
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
									<button
										className='dark:bg-transparent dark:hover:bg-transparent p-0'
										onClick={handleTheme}>
										<Moon />
									</button>
								) : (
									<button
										className='bg-transparent hover:bg-transparent p-0'
										onClick={handleTheme}>
										<Sun />
									</button>
								)}
							</div>
						</div>
					</SidebarProvider>
				</div>
			</header>
			<Outlet />
		</>
	);
}
