import { NewDebt } from '@/apis/DebtService';
import { Expense, Income, LoaderApi } from '@/assets/icons/Svg';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/datapicker';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ApiResponse } from '@/interfaces/Api';
import { Toast } from '@/hooks/Toast';
import { HandCoins } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const AddDebt = ({ apiData, sendData, className }) => {
	const [person, setPerson] = useState('');
	const [value, setValue] = useState('');
	const [reason, setReason] = useState('');
	const [loader, setLoader] = useState(false);
	const [debtType, setDebtType] = useState(null);
	const [visibilytToast, setVisibilityToast] = useState(false);
	const [responseDebt, setResponseDebt] = useState<ApiResponse | undefined>(null);
	const [date, setDate] = useState('');

	const { t, i18n } = useTranslation();
	i18n.changeLanguage();

	const handleValues = (e, type) => {
		if (type === 'money') {
			let value = e.target.value.replace(/[^0-9.]/g, '');
			if (value === '') {
				value = 0;
			}
			const floatValue = parseFloat(value);
			const formattedValue = floatValue.toLocaleString();

			setValue(formattedValue);
			return;
		}
		if (type === 'name') {
			setPerson(e.target.value);
		} else if (type === 'reason') {
			setReason(e.target.value);
		}
	};
	const getDate = (date) => {
		setDate(date);
	};

	const submitDebt = async () => {
		setLoader(true);

		const params = {
			user_id: apiData?.user_id,
			wallet_id: apiData?.wallet_id,
			person,
			value: value.replace(/,/g, ''),
			reason,
			debtType,
			date,
		};

		const response = await NewDebt(params);

		if (response) {
			sendData('debt');
			setResponseDebt(response);
			setVisibilityToast(true);
			setValue('');
			setPerson('');
			setReason('');
			setDebtType(null);
			setLoader(false);
			setDate('');
		}

		setTimeout(() => {
			setVisibilityToast(false);
			setResponseDebt(null);
		}, 1000);
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					variant='ghost'
					className={` ${className} py-6 dark:hover:bg-dark_secondary_color hover:bg-light_secondary_color dark:bg-dark_primary_color bg-light_primary_color text-black dark:text-white  flex items-center gap-3`}>
					{t('addDebt.addDebt')} <HandCoins />
				</Button>
			</DialogTrigger>
			<DialogContent aria-describedby='modal-title' className=' w-full md:w-[500px] rounded-md dark:bg-dark_primary_color bg-light_primary_color dark:text-white text-black '>
				<DialogHeader>
					<DialogTitle>{t('addDebt.newDebt')}</DialogTitle>
					<DialogDescription className='opacity-50'>{t('addDebt.instructions')}</DialogDescription>
				</DialogHeader>
				<p>
					{t('addDebt.selectTypeDebt')} <span className='text-red-500'>*</span>
				</p>
				<div className='flex justify-evenly gap-5'>
					<div
						onClick={() => setDebtType(1)}
						className={`border  p-5 rounded-xl w-1/2 cursor-pointer ${debtType === 1 ? 'border-main_color' : 'border-gray-200/50'}`}>
						<div className='flex justify-center flex-col items-center gap-2 '>
							<Income color={`${debtType === 1 ? '#7fbd0c' : 'gray'}`} />

							<label
								className={`${debtType === 1 ? 'text-main_color border-main_color' : 'opacity-15'} cursor-pointer`}
								htmlFor=''>
								{t('addDebt.owesYou')}...
							</label>
						</div>
					</div>
					<div
						onClick={() => setDebtType(0)}
						className={`border  p-5 rounded-xl w-1/2 cursor-pointer ${debtType === 0 ? 'border-alternative_color' : 'border-gray-200/50'}`}>
						<div className='flex justify-center flex-col items-center gap-2'>
							<Expense color={`${debtType === 0 ? '#f53278' : 'gray'}`} />
							<label
								className={`${debtType === 0 ? 'text-alternative_color' : 'opacity-15'} cursor-pointer`}
								htmlFor=''>
								{t('addDebt.youOwe')} ...
							</label>
						</div>
					</div>
				</div>
				<div className='flex gap-5 items-center'>
					<div className='w-full'>
						<label htmlFor=''>
							{t('addDebt.relatedPerson')} <span className='text-red-500'>*</span>
						</label>
						<Input
							value={person}
							className='border-b dark:bg-dark_secondary_color bg-light_secondary_color border-none text-lg dark:text-white text-black placeholder:text-gray-300 w-full mt-2 placeholder:opacity-30'
							onChange={(e) => handleValues(e, 'name')}
						/>
					</div>
					<div className='w-full'>
						<label htmlFor=''>
							{t('addDebt.amount')} $ <span className='text-red-500'>*</span>
						</label>
						<Input
							id='value_income'
							className='border-b dark:bg-dark_secondary_color bg-light_secondary_color border-none text-lg dark:text-white text-black placeholder:text-gray-300 w-full mt-2 placeholder:opacity-30'
							type='text'
							value={value}
							onChange={(e) => handleValues(e, 'money')}
						/>
					</div>
				</div>
				<div>
					<label htmlFor=''>
						{t('addDebt.reasonDebt')} <span className='text-red-500'>*</span>
					</label>
					<Input
						id='value_income'
						type='text'
						className='border-b dark:bg-dark_secondary_color bg-light_secondary_color border-none text-lg dark:text-white text-black placeholder:text-gray-300 w-full mt-2 placeholder:opacity-30'
						value={reason}
						onChange={(e) => handleValues(e, 'reason')}
					/>
				</div>
				<div>
					<label htmlFor=''>
						{t('addDebt.paymenteDeadline')} <span className='text-zinc-500'>({t('addDebt.recomended')})</span>
					</label>
					<DatePicker sendDate={getDate} />
				</div>
				<Button
					disabled={debtType === null || person === '' || reason === '' || value === '' || value === '0'}
					onClick={submitDebt}
					className=' w-full font-semibold  text-white text-lg flex justify-center items-center py-5 cursor-pointer bg-alternative_color '>
					{loader ? <LoaderApi color='black' /> : `${t('dashboard.confirm')}`}
				</Button>
			</DialogContent>
			{visibilytToast && (
				<Toast
					visibility={visibilytToast}
					severity={responseDebt?.success == true ? 'success' : 'error'}
					message={responseDebt?.message}
				/>
			)}
		</Dialog>
	);
};
