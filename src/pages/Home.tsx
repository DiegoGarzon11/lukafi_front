import { useTranslation } from 'react-i18next';
import { Card } from '@/components/others/Card';
// import {Click} from '@/assets/icons/Svg';
import { ArrowDown, CornerDownRight, Mail, MousePointerClick, Phone, Star } from 'lucide-react';
import { ChartExample, ChartExampleTwo } from '@/components/core/Charts';
import { Button } from '@/components/ui/button';

export const Home = () => {
	const { t, i18n } = useTranslation();
	i18n.changeLanguage();
	return (
		<div className='dark:bg-dark_background bg-light_background h-full '>
			<main className='flex flex-col items-center md:mx-5  pt-18'>
				<section className='dark:bg-dark_primary_color bg-light_primary_color w-full flex items-center md:items-start flex-col md:flex-row justify-between rounded-4xl '>
					<div className='flex flex-col  items-center  gap-3 w-full md:w-5/12  md:ml-30 md:mt-20 '>
						<p className='md:text-4xl text-2xl pt-3 md:pt-0 mb-8 w-80 dark:text-white text-black text-balance text-center font-semibold'>
							{t('home.phrase1.text1')} Lukafi {t('home.phrase1.text2')}
						</p>
						<h2 className='text-black text-center dark:text-white'>{t('home.phrase2.text1')}</h2>

						<div className='relative flex overflow-hidden rounded-md p-[1.3px]'>
							<span className='absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-white bg-[conic-gradient(from_90deg_at_50%_50%,#fe337c_0%,#971d4a_50%,#ff3361_100%)]'></span>
							<Button className=' dark:text-white text-black px-3 rounded-md py-4 cursor-pointer bg-white dark:bg-dark_foreground backdrop-blur flex items-center gap-5 hover:bg-alternative_color transition-colors duration-500 '>
								<MousePointerClick />
								{t('home.button1')}
							</Button>
						</div>

						<p className='text-balance text-center dark:text-white text-black opacity-50 md:w-8/12'>{t('home.phrase3.text1')}</p>
					</div>

					<div className='dark:bg-dark_secondary_color bg-light_secondary_color mt-10 rounded-br-4xl rounded-tl-4xl p-3 md:w-5/12  w-full'>
						<div className='flex justify-between items-center'>
							<p className='ml-5 text-3xl font-extrabold dark:text-white text-black'>1M.</p>
							<div className='flex gap-3 items-center'>
								<button className='dark:bg-dark_foreground rounded-4xl px-3 dark:text-white text-black py-1'>
									{t('sheetside.wallet.expenses')}
								</button>
								<button className='dark:bg-dark_foreground rounded-4xl px-3 dark:text-white text-black py-1'>
									{t('sheetside.wallet.incomes')}
								</button>
							</div>
						</div>
						<div className='mt-10 md:flex md:justify-center flex-col items-center'>
							<ChartExample />
							<div className='flex gap-3 items-center'>
								<span className='flex items-center text-main_color'>
									<Star
										size={16}
										strokeWidth={3}
									/>
									{t('sheetside.wallet.incomes')}
								</span>
								<span className='flex items-center text-alternative_color'>
									<Star
										size={16}
										strokeWidth={3}
									/>
									{t('sheetside.wallet.debts')}
								</span>
							</div>
						</div>
					</div>
				</section>
				<section className='flex md:flex-row flex-col justify-between w-full mt-5 md:gap-5'>
					<div className='flex justify-start flex-col-reverse md:flex-col items-center md:w-4/6  '>
						<div className=' w-full flex flex-col md:items-center items-center mt-8  '>
							<p className='text-2xl font-semibold dark:text-white text-black'>{t('home.phrase4.text1')}</p>
							<CornerDownRight className='text-main_color w-20 h-20  hidden md:block ' />
							<ArrowDown className='text-main_color w-20 h-20  my-3 block md:hidden' />
						</div>
						<div className='dark:bg-dark_primary_color bg-light_primary_color dark:text-white text-black rounded-2xl p-3 mt-10 w-full flex flex-col gap-3 items-center   '>
							<p className='dark:text-white text-black font-semibold text-4xl text-balance text-center '>{t('home.section2.title')} lukafi</p>
							<p className='text-center opacity-50'>{t('home.section2.p')} lukafi?</p>
							<div className='dark:bg-dark_secondary_color bg-light_secondary_color flex justify-center items-center flex-col py-8  md:px-20 rounded-4xl m-8 w-full '>
								<div className='flex justify-between items-center mx-10 mb-5  w-full px-10  '>
									<p className='md:text-3xl text-xl font-extrabold dark:text-white text-black'>{t('home.section2.chartTitle')}</p>
									<button className='dark:bg-dark_foreground rounded-4xl px-3 dark:text-white text-black py-1'>
										{t('home.section2.chartSubtitle')}
									</button>
								</div>
								<ChartExampleTwo />
								<div className='flex gap-3 items-center'>
									<span className='flex items-center text-main_color'>
										<Star
											size={16}
											strokeWidth={3}
										/>
										{t('home.section2.chartSubtitle')}
									</span>
									<span className='flex items-center text-alternative_color'>
										<Star
											size={16}
											strokeWidth={3}
										/>
										{t('sheetside.wallet.debts')}
									</span>
								</div>
							</div>
						</div>
					</div>
					<div className='md:flex justify-between md:flex-col md:items-end  md:w-2/4'>
						<Card
							img={'images/growUp.svg'}
							title={t('home.card1.title')}
							info={t('home.card1.text')}
						/>
						<Card
							img={'images/saving.svg'}
							title={t('home.card2.title')}
							info={t('home.card2.text')}
						/>
						<Card
							img={'images/loans.svg'}
							title={t('home.card3.title')}
							info={t('home.card3.text')}
						/>
						<Card
							img={'images/loans.svg'}
							title={t('home.card3.title')}
							info={t('home.card3.text')}
						/>
					</div>
				</section>
				<section className='flex md:flex-row flex-col justify-between w-full gap-5'>
					<div className='flex justify-center flex-col items-center md:w-4/6'>
						<ArrowDown className='text-main_color w-20 h-20  my-3' />

						<div className='dark:bg-dark_primary_color bg-light_primary_color dark:text-white text-black rounded-2xl p-3 w-full flex flex-col gap-3 items-center text-center text-balance'>
							<h3 className='font-semibold text-3xl'>{t('home.how.title')}</h3>
							<p className='text-lg'>{t('home.how.subtitle')}.</p>
							<p className='text-lg opacity-50 '>{t('home.how.text1')}.</p>
							<p className='text-lg'>
								{t('home.how.text2')} <span className='text-main_color font-semibold'>lukafi.</span>
							</p>
						</div>
					</div>
					<footer className='flex justify-between flex-col items-center md:w-2/4  dark:bg-dark_primary_color bg-light_primary_color rounded-br-4xl rounded-tl-4xl p-3 dark:text-white text-black mt-5 '>
						<Star className='self-start text-main_color size-11 ' />
						<h3 className='text-center text-3xl font-semibold mb-10'>LUKAFI</h3>
						<div className='md:flex  gap-10 '>
							<p>{t('home.footer.text1')}</p>
							<div className='flex gap-3'>
								<p>{t('home.footer.text2')}:</p>
								<Phone />
								<Mail />
							</div>
						</div>
						<p className='mt-5'>2022 © Lukafi</p>
						<Star className='self-end text-main_color size-11  ' />
					</footer>
				</section>
			</main>
		</div>
	);
};
