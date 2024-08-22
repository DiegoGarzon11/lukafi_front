import {useTranslation} from 'react-i18next';
import {Button} from '@/components/ui/button';
import {Card} from '@/components/others/Card';
// import {Click} from '@/assets/icons/Svg';
import {MousePointerClick} from 'lucide-react';
import {Link} from 'react-router-dom';

export const Home = () => {
	const {t, i18n} = useTranslation();
	i18n.changeLanguage();
	return (
		<div className='dark:bg-zinc-900 h-full '>
			<main className='flex flex-col items-center mx-5 md:w-2/3 md:m-auto pt-20'>
				<section className='gap-3 md:grid md:grid-cols-2'>
					<div className='pt-12 '>
						<h1 className='text-3xl mb-8  dark:text-white text-black'>
							{t('home.phrase1.text1')} <b className='tracking-wider'>Lukafi</b> {t('home.phrase1.text2')}.
						</h1>
						<h2 className='text-black dark:text-white'>{t('home.phrase2.text1')}</h2>
						<div className='my-3 relative'>
							<Button className='w-full'>
								{t('home.button1')}
								<span className='absolute right-24 '>
									<MousePointerClick />
								</span>
							</Button>
						</div>
						<p>{t('home.phrase3.text1')}</p>
					</div>
					<div>
						<img src='/images/finance.svg' alt='' />
					</div>
				</section>
				<div className='w-full'>
					<div className='flex flex-col my-3 gap-2'>
						<Button variant='green' className='w-24'>
							{t('home.button2')}
						</Button>
						<p>{t('home.phrase4.text1')}</p>
					</div>
					<section className='flex flex-col gap-5 md:grid md:grid-cols-2'>
						<Card title={t('home.card1.title')} info={t('home.card1.text')} img='/images/growUp.svg' />
						<Card title={t('home.card2.title')} info={t('home.card2.text')} img='/images/saving.svg' />
						<Card title={t('home.card3.title')} info={t('home.card3.text')} img='/images/loans.svg' />
						<Card title='Ahorras tiempo' info='Sin preocupaciones, lo hacemos por ti' img='/images/time.svg' />
					</section>
				</div>
				<div className=' mt-10 mb-5 rounded-lg p-3'>
					<p className='font-semibold text-2xl text-center'>
						{t('home.card.text1')}
						<Link className='underline text-blue-500 mx-1' to='/signUp'>
							{t('home.card.text2')}
						</Link>
						{t('home.card.text3')}
					</p>
					<img src='/images/vault.svg' alt='' />
				</div>
			</main>
			<footer className='flex justify-around w-full dark:bg-zinc-950 '>
				<div>
					<p className='dark:text-white text-black text-4xl'>Lukafi</p>
				</div>
				<ul className='dark:text-white text-black flex gap-5'>
					<li>{t('home.footer.text1')}</li>
					<li>{t('home.footer.text2')}</li>
				</ul>
			</footer>
		</div>
	);
};
