import {Info} from '@/assets/icons/Svg';
import {useTranslation} from 'react-i18next';
import {Link} from 'react-router-dom';

export const Card = ({title, info, img}) => {
	const {t, i18n} = useTranslation();
	i18n.changeLanguage();
	return (
		<div className='border border-black border-b-4  rounded-4xl p-4 dark:bg-dark_primary_color w-full'>
			<div className='flex  justify-between p-5 '>
				<div className='flex flex-col  gap-2 w-8/12'>
					<p className='font-bold dark:text-white text-black'>{title}</p>
					<div>
						<p className='text-sm mb-2 dark:text-white text-black'>{info}</p>
						<Link to='/signIn'>
							<button className='flex items-center gap-2 '>
								<Info />
								<span className='dark:text-white text-black'>{t('component.card.button')}</span>
							</button>
						</Link>
					</div>
				</div>
				<div className=''>
					<img className='w-36' src={img} alt='' />
				</div>
			</div>
		</div>
	);
};
