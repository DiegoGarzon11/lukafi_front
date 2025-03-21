import { GetAllCategories } from '@/apis/CategoryService';
import { NewExpense } from '@/apis/ExpenseService';
import { LoaderApi } from '@/assets/icons/Svg';
import { Combobox } from '@/components/others/Combobox';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ApiResponse } from '@/interfaces/Api';
import { Category } from '@/interfaces/Category';
import { Toast } from '@/hooks/Toast';
import { DollarSign } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const AddExpense = ({ apiData, sendData, className }) => {
	const [deadLine, setDeadLine] = useState(0);
	const [name, setName] = useState('');
	const [value, setValue] = useState('0');
	const [isFixed, setIsFixed] = useState('true');
	const [responseApiNewExpense, setResponseApiNewExpense] = useState<ApiResponse | undefined>(undefined);
	const [visibilytToast, setVisibilityToast] = useState(false);
	const [loader, setLoader] = useState(false);
	const [categories, setCategories] = useState<Array<Category> | undefined>([]);
	const [selectedCategory, setSelectedCategory] = useState<Category | undefined>(null);
	const days = Array.from({ length: 31 }, (_, i) => i + 1);

	const { t, i18n } = useTranslation();
	i18n.changeLanguage();

	const handleValues = (e, type) => {
		if (type === 'value') {
			let value = e.target.value.replace(/[^0-9.]/g, '');
			if (value === '') {
				value = 0;
			}
			const floatValue = parseFloat(value);
			const formattedValue = floatValue.toLocaleString();

			setValue(formattedValue);
		} else if (type === 'name') {
			setName(e.target.value);
		}
	};
	const handleDateFixedCost = (e) => {
		setDeadLine(e);
	};

	async function fetchCategories() {
		const getAllCategories = await GetAllCategories();
		setCategories(getAllCategories);
	}
	const handleCategory = (e) => {
		setSelectedCategory(e);
	};
	const submitExpense = async () => {
		setLoader(true);
		const sendIsFixed: boolean = isFixed === 'true';

		const params = {
			wallet_id: apiData.wallet_id,
			user_id: apiData.user_id,
			name,
			is_paid: isFixed === 'true' ? false : true,
			paid_in: sendIsFixed ? null : new Date(),
			pay_each: deadLine,
			value,
			deadLine,
			isFixed: sendIsFixed,
			category_id: selectedCategory?.category_id,
			category_name: selectedCategory?.category_name,
		};

		const response = await NewExpense(params);

		if (!response) {
			return;
		}

		setResponseApiNewExpense(response);
		setVisibilityToast(true);
		setLoader(false);
		setValue('0');
		setName('');
		if (sendIsFixed) {
			sendData('expenseFixed');
		} else {
			sendData('expense');
		}
		setTimeout(() => {
			setVisibilityToast(false);
			setResponseApiNewExpense(null);
		}, 1000);
	};

	return (
		<Dialog>
			<DialogTrigger
				asChild
				className=''>
				<Button
					onClick={() => {
						setDeadLine(0);
						fetchCategories();
						setSelectedCategory(null);
					}}
					variant='ghost'
					className={`${className} py-6 dark:hover:bg-dark_secondary_color hover:bg-light_secondary_color  dark:bg-dark_primary_color bg-light_primary_color  text-black  dark:text-white flex items-center gap-3`}>
					{t('addExpense.addExpense')} <DollarSign />
				</Button>
			</DialogTrigger>
			<DialogContent className=' w-full md:w-[500px] rounded-md dark:bg-dark_primary_color bg-light_primary_color dark:text-white text-black '>
				<DialogHeader>
					<DialogTitle>{t('addExpense.newExpense')}</DialogTitle>
					<DialogDescription className='opacity-50'> {t('addExpense.completeFields')} </DialogDescription>
				</DialogHeader>

				<div className='flex gap-3 items-center justify-center'>
					<div className='w-full'>
						<label
							htmlFor='value_name'
							className='mb-2'>
							{t('addExpense.nameExpense')} <span className='text-red-500'>*</span>
							<Input
								className='border-b dark:bg-dark_secondary_color bg-light_secondary_color border-none text-lg dark:text-white text-black placeholder:text-gray-300 w-full mt-2 dark:placeholder:opacity-30'
								value={name}
								onChange={(e) => handleValues(e, 'name')}
								id='value_name'
								placeholder='Ej Gimnasio'
								type='text'
							/>
						</label>
					</div>
					<div className='w-full'>
						<label
							htmlFor='value_value'
							className='mb-2'>
							{t('addExpense.amount')} $ <span className='text-red-500'>*</span>
							<Input
								className='border-b dark:bg-dark_secondary_color bg-light_secondary_color border-none text-lg dark:text-white text-black placeholder:text-gray-300 w-full mt-2 placeholder:opacity-30'
								value={value}
								onChange={(e) => handleValues(e, 'value')}
								id='value_value'
								type='text'
							/>
						</label>
					</div>
				</div>
				<div className='flex w-full gap-3'>
					<div className='flex justify-center items-center gap-2 flex-col w-full '>
						<label>
							{t('addExpense.fixedExpense')} <span className='text-red-500'>*</span>
						</label>
						<div className='flex justify-center items-center gap-5  w-full'>
							<Button
								onClick={() => {
									setIsFixed('true');
								}}
								variant='ghost'
								className={`${className} ${isFixed == 'true' ? 'dark:bg-dark_foreground bg-light_foreground ' : ''}  `}>
								{t('addExpense.yes')}
							</Button>
							<Button
								onClick={() => {
									setIsFixed('false');
								}}
								variant='ghost'
								className={`${className}  ${isFixed == 'false' ? 'dark:bg-dark_foreground  bg-light_foreground' : ''}    `}>
								No
							</Button>
						</div>
					</div>

					<div className='w-full'>
						<label htmlFor=''> {t('addExpense.typeExpense')} </label> <span className='text-red-500'>*</span>
						<Combobox
							data={categories}
							selected={(e) => handleCategory(e)}
						/>
					</div>
				</div>

				{isFixed === 'true' && (
					<div className='flex flex-col w-full bg-zinc-100 dark:bg-dark_primary_color rounded-md p-3'>
						<div className=' flex flex-wrap gap-x-3 items-center'>
							<p className=''>{t('addExpense.paymentDayP')} </p>
							<Select onValueChange={(e) => handleDateFixedCost(e)}>
								<SelectTrigger className=' w-32 bg-zinc-200 dark:bg-dark_secondary_color dark:text-white text-black border border-alternative_color'>
									<SelectValue placeholder={`${t('dashboard.day')}`} />
								</SelectTrigger>
								<SelectContent className='dark:bg-dark_primary_color bg-light_primary_color dark:text-white text-black'>
									<SelectGroup>
										<SelectLabel className='text-lg'>{t('dashboard.day')}</SelectLabel>

										{days.map((e, i) => (
											<SelectItem
												className='dark:focus:bg-dark_secondary_color focus:bg-light_secondary_color cursor-pointer'
												key={i}
												value={e.toString()}>
												{e}
											</SelectItem>
										))}
									</SelectGroup>
								</SelectContent>
							</Select>
							<p> {t('dashboard.ofEachMonth')} </p>
							<span className='text-red-500'>*</span>
						</div>
					</div>
				)}
				<Button
					disabled={loader || name === '' || value === '0' || selectedCategory === null || (isFixed === 'true' && !deadLine)}
					onClick={submitExpense}
					className=' w-full font-semibold  text-white text-lg flex justify-center items-center py-5 cursor-pointer bg-alternative_color '>
					{loader ? <LoaderApi color='black' /> : 'Confirmar'}
				</Button>
			</DialogContent>
			{visibilytToast && (
				<Toast
					visibility={visibilytToast}
					severity={responseApiNewExpense?.success == true ? 'success' : 'error'}
					message={responseApiNewExpense?.message}
				/>
			)}
		</Dialog>
	);
};
