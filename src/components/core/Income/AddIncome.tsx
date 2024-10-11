import { AddNewIncome } from '@/apis/Income.service';
import {  LoaderApi } from '@/assets/icons/Svg';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ApiResponse } from '@/interfaces/Api';
import { Toast } from '@/tools/Toast';
import { BadgePlus } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const AddIncome = ({ apiData, sendData }) => {
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

		setValue(formattedValue);
	};

	const submitIncome = async () => {
		console.log(name);
		console.log(value);

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
					className='w-full py-6 dark:hover:bg-zinc-900 dark:bg-zinc-900/50 bg-zinc-300 text-black dark:text-white hover:bg-zinc-400 flex items-center gap-3'>
					{t('addIncome.newIncome')} <BadgePlus />
				</Button>
			</DialogTrigger>
			<DialogContent className=' w-11/12 md:w-[500px] rounded-md '>
				<DialogHeader>
					<DialogTitle>{t('addIncome.newIncome')}</DialogTitle>
					<DialogDescription>{t('addIncome.instructions')}</DialogDescription>
				</DialogHeader>

				<div className='flex gap-5 items-center'>
					<div>
						<label htmlFor=''>
							{t('addIncome.name')} <span className='text-red-500'>*</span>
						</label>
						<Input
							onChange={(e) => setName(e.target.value)}
							value={name}
							className='border dark:border-zinc-400 dark:bg-zinc-800/30'
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
							className='border dark:border-zinc-400 dark:bg-zinc-800/30'
							type='text'
						/>
					</div>
				</div>

				<Button
					disabled={loader || name === '' || value === '0'}
					onClick={submitIncome}
					className={` py-2 rounded-md text-zinc-100 flex justify-center ${
						name === null || value === '' || value === '0'
							? 'bg-gray-300 '
							: ' bg-zinc-700 hover:bg-zinc-500 hover:dark:bg-zinc-600 dark:bg-zinc-500'
					}`}>
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
