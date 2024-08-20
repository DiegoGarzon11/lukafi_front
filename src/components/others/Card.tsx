import {Info} from '@/assets/icons/Svg';
import {useTranslation} from 'react-i18next';
import {Link} from 'react-router-dom';

export const Card = ({title, info, img}) => {
	const {t, i18n} = useTranslation();
	i18n.changeLanguage();
	return (
		<div className='border border-black border-b-4  rounded-xl p-4 dark:bg-zinc-900 '>
			<div className='flex  justify-between '>
				<div className='flex flex-col  gap-2 w-8/12'>
					<p className='font-bold'>{title}</p>
					<div>
						<p className='text-sm mb-2'>{info}</p>
						<Link to='/signIn'>
							<button className='flex items-center gap-2 '>
								<Info />
								<span>{t('component.card.button')}</span>
							</button>
						</Link>
					</div>
				</div>
				<div className=''>
					<img className='w-28' src={img} alt='' />
				</div>
			</div>
		</div>
	);
};
