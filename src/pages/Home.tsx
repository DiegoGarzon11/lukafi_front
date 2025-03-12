import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/others/Card';
// import {Click} from '@/assets/icons/Svg';
import { CornerDownRight, MousePointerClick } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ChartExample } from '@/components/core/Charts';

export const Home = () => {
	const { t, i18n } = useTranslation();
	i18n.changeLanguage();
	return (
		<div className='dark:bg-black h-full '>
			<main className='flex flex-col items-center mx-5  pt-18'>
				<section className='dark:bg-dark_primary_color bg-light_primary_color w-full flex justify-between rounded-4xl '>
					<div className='flex flex-col items-center gap-3 w-5/12 ml-40 mt-20'>
						<p className='text-4xl mb-8 w-80 dark:text-white text-black text-balance text-center font-semibold'>
							{t('home.phrase1.text1')} Lukafi {t('home.phrase1.text2')}
						</p>
						<h2 className='text-black dark:text-white'>{t('home.phrase2.text1')}</h2>
						<div className='my-3 relative '>
							<Button className='border  dark:text-white text-black px-20'>
								{t('home.button1')}
								<span className='absolute right-48 '>
									<MousePointerClick />
								</span>
							</Button>
						</div>
						<p className='text-balance text-center dark:text-white text-black opacity-50 w-8/12'>{t('home.phrase3.text1')}</p>
					</div>

					<div className='dark:bg-dark_secondary_color bg-light_secondary_color mt-10  rounded-br-4xl rounded-tl-4xl p-3 '>
						<div className='flex justify-between items-center'>
							<p className='ml-5 text-3xl font-extrabold dark:text-white text-black'>1M.</p>
							<div className='flex gap-3 items-center'>
								<button className='dark:bg-dark_foreground rounded-4xl px-3 dark:text-white text-black py-1'>Expenses</button>
								<button className='dark:bg-dark_foreground rounded-4xl px-3 dark:text-white text-black py-1'>Incomes</button>
							</div>
						</div>
						<div className='mt-10  '>
							<ChartExample />
						</div>
					</div>
				</section>
				<section className='flex justify-between w-full mt-5'>
					<div className='flex justify-center flex-col items-end w-2/6'>
						<p className='text-center text-2xl font-semibold dark:text-white text-black'>{t('home.phrase4.text1')}</p>
						<CornerDownRight className='text-lime-500 w-20 h-20 brightness-150  ' />
					</div>
					<div className='flex justify-end flex-col items-end w-2/4 gap-3'>
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
					</div>
				</section>
			</main>
		</div>
	);
};
