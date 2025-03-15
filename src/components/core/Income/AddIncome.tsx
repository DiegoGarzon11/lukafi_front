import { AddNewIncome } from '@/apis/Income.service';
import { LoaderApi } from '@/assets/icons/Svg';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ApiResponse } from '@/interfaces/Api';
import { Toast } from '@/tools/Toast';
import { PiggyBank } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const AddIncome = ({ apiData, className, sendData }) => {
	const [name, setName] = useState('');
	const [value, setValue] = useState('0');
	const [loader, setLoader] = useState(false);
	const [visibilytToast, setVisibilityToast] = useState(false);
	const [responseIncome, setResponseIncome] = useState<ApiResponse | undefined>(null);

	const { t, i18n } = useTranslation();
	i18n.changeLanguage();

	const handleValues = (e) => {
		let value = e.target.value.replace(/[^0-9.]/g, '');
		const floatValue = parseFloat(value);
		const formattedValue = floatValue.toLocaleString();

		setValue(formattedValue === 'NaN' ? '0' : formattedValue);
	};

	const submitIncome = async () => {
		setLoader(true);

		const params = {
			user_id: apiData?.user_id,
			wallet_id: apiData?.wallet_id,
			name,
			value: value.replace(/,/g, ''),
		};

		const response = await AddNewIncome(params);

		if (response) {
			sendData('income');
			setResponseIncome(response);
			setVisibilityToast(true);
			setValue('');

			setLoader(false);
		}

		setTimeout(() => {
			setVisibilityToast(false);
			setResponseIncome(null);
		}, 1000);
	};
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					variant='ghost'
					className={` ${className} py-6 dark:hover:bg-zinc-900 dark:bg-dark_primary_color bg-zinc-300 text-black dark:text-white hover:bg-zinc-400 flex items-center gap-3`}>
					{t('addIncome.newIncome')} <PiggyBank />
				</Button>
			</DialogTrigger>
			<DialogContent className=' w-full md:w-[500px] rounded-md dark:bg-dark_primary_color dark:text-white text-black '>
				<DialogHeader>
					<DialogTitle>{t('addIncome.newIncome')}</DialogTitle>
					<DialogDescription className='opacity-50'>{t('addIncome.instructions')}</DialogDescription>
				</DialogHeader>

				<div className='flex gap-5 items-center '>
					<div>
						<label htmlFor=''>
							{t('addIncome.name')} <span className='text-red-500'>*</span>
						</label>
						<Input
							onChange={(e) => setName(e.target.value)}
							value={name}
							className='border-b dark:bg-dark_secondary_color border-none text-lg dark:text-white text-black placeholder:text-gray-300 w-full mt-2 placeholder:opacity-30'
							placeholder='Ej Salario'
						/>
					</div>
					<div>
						<label htmlFor=''>
							{t('addIncome.amount')} <span className='text-red-500'>*</span>
						</label>
						<Input
							id='value_income'
							onChange={(e) => handleValues(e)}
							value={value}
							className='border-b dark:bg-dark_secondary_color border-none text-lg dark:text-white text-black placeholder:text-gray-300 w-full mt-2 placeholder:opacity-30'
							type='text'
						/>
					</div>
				</div>

				<Button
					disabled={loader || name === '' || value === '0'}
					onClick={submitIncome}
					className=' w-full font-semibold  text-white text-lg flex justify-center items-center py-5 cursor-pointer bg-alternative_color '>
					{loader ? <LoaderApi color='black' /> : `${t('dashboard.confirm')}`}
				</Button>
			</DialogContent>
			{visibilytToast && (
				<Toast
					visibility={visibilytToast}
					severity={responseIncome?.success == true ? 'success' : 'error'}
					message={responseIncome?.message}
				/>
			)}
		</Dialog>
	);
};
