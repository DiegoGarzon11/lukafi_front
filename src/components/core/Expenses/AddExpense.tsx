import {GetAllCategories} from '@/apis/CategoryService';
import {NewExpense} from '@/apis/ExpenseService';
import {LoaderApi} from '@/assets/icons/Svg';
import {Combobox} from '@/components/others/Combobox';
import {Button} from '@/components/ui/button';
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger} from '@/components/ui/dialog';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group';
import {Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from '@/components/ui/tooltip';
import {ApiResponse} from '@/interfaces/Api';
import {Category} from '@/interfaces/Category';
import {Toast} from '@/tools/Toast';
import {BadgePlus, Info} from 'lucide-react';
import {useState} from 'react';
import {useTranslation} from 'react-i18next';

export const AddExpense = ({apiData, sendData}) => {
	const [deadLine, setDeadLine] = useState(0);
	const [name, setName] = useState('');
	const [value, setValue] = useState('0');
	const [isFixed, setIsFixed] = useState('true');
	const [responseApiNewExpense, setResponseApiNewExpense] = useState<ApiResponse | undefined>(undefined);
	const [visibilytToast, setVisibilityToast] = useState(false);
	const [loader, setLoader] = useState(false);
	const [categories, setCategories] = useState<Array<Category> | undefined>([]);
	const [selectedCategory, setSelectedCategory] = useState<Category | undefined>(null);
	const days = Array.from({length: 31}, (_, i) => i + 1);

	const {t, i18n} = useTranslation();
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
		} else if (type === 'isFixed') {
			if (isFixed === 'true') {
				setDeadLine(0);
			}
			setIsFixed(e);
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
			is_paid: !sendIsFixed,
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
			<DialogTrigger asChild>
				<Button
					onClick={() => {
						setDeadLine(0);
						fetchCategories();
						setSelectedCategory(null);
					}}
					variant='ghost'
					className='w-full py-6 dark:hover:bg-zinc-900  dark:bg-zinc-900/50  bg-zinc-300 hover:bg-zinc-400 text-black  dark:text-white flex items-center gap-3'>
					{t('addExpense.addExpense')} <BadgePlus />
				</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-[550px]  '>
				<DialogHeader>
					<DialogTitle>{t('addExpense.newExpense')}</DialogTitle>
					<DialogDescription> {t('addExpense.completeFields')} </DialogDescription>
				</DialogHeader>

				<div className='flex gap-3 items-center justify-center'>
					<div className='w-full'>
						<label htmlFor='value_name' className='mb-2'>
							{t('addExpense.nameExpense')} <span className='text-red-500'>*</span>
							<Input
								className='border dark:border-zinc-400 dark:bg-zinc-800/30'
								value={name}
								onChange={(e) => handleValues(e, 'name')}
								id='value_name'
								type='text'
							/>
						</label>
					</div>
					<div className='w-full'>
						<label htmlFor='value_value' className='mb-2'>
							{t('addExpense.amount')} $ <span className='text-red-500'>*</span>
							<Input
								className='border dark:border-zinc-400 dark:bg-zinc-800/30'
								value={value}
								onChange={(e) => handleValues(e, 'value')}
								id='value_value'
								type='text'
							/>
						</label>
					</div>
				</div>
				<div className='flex w-full gap-3'>
					<div className='flex justify-center items-center gap-5 flex-col w-full'>
						<label>
							{t('addExpense.fixedExpense')} <span className='text-red-500'>*</span>
						</label>
						<RadioGroup className='flex items-center' defaultValue={isFixed} onValueChange={(e) => handleValues(e, 'isFixed')}>
							<div className='flex items-center space-x-2'>
								<RadioGroupItem value='true' id='true' />
								<Label htmlFor='r1'> {t('addExpense.yes')} </Label>
							</div>

							<div className='flex items-center space-x-2'>
								<RadioGroupItem value='false' id='false' />
								<Label htmlFor='r2'>No</Label>
							</div>
						</RadioGroup>
					</div>

					<div className='w-full'>
						<label htmlFor=''> {t('addExpense.typeExpense')} </label> <span className='text-red-500'>*</span>
						<Combobox data={categories} selected={(e) => handleCategory(e)} />
					</div>
				</div>

				{isFixed === 'true' && (
					<div className='flex flex-col w-full bg-zinc-100 dark:bg-zinc-800/50 rounded-md p-3'>
						<label htmlFor='value_value' className='self-start mb-2'>
							{t('addExpense.paymentDay')} <span className='text-red-500'>*</span>
						</label>

						<div className=' flex flex-wrap gap-x-3 items-center'>
							<p className=''>{t('addExpense.paymentDayP')} </p>
							<Select onValueChange={(e) => handleDateFixedCost(e)}>
								<SelectTrigger className=' w-32 bg-zinc-200 dark:bg-zinc-800 dark:text-white text-black border border-green-500/50'>
									<SelectValue placeholder={`${t('dashboard.day')}`} />
								</SelectTrigger>
								<SelectContent className='dark:bg-zinc-700'>
									<SelectGroup>
										<SelectLabel className='text-lg'>{t('dashboard.day')}</SelectLabel>

										{days.map((e, i) => (
											<SelectItem className='focus:dark:bg-zinc-800 focus:bg-zinc-200' key={i} value={e.toString()}>
												{e}
											</SelectItem>
										))}
									</SelectGroup>
								</SelectContent>
							</Select>
							<p> {t('dashboard.ofEachMonth')} </p>
						</div>

						{deadLine !== 0 && deadLine < new Date().getDate() ? (
							<div className='text-center mt-3 font-semibold flex justify-center '>
								<p className=' text-blue-400'> {t('addExpense.sentFixedExpense')} </p>
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger asChild>
											<Button variant='ghost' className='px-1'>
												<Info className='text-blue-400 ' />
											</Button>
										</TooltipTrigger>
										<TooltipContent side='bottom' className='  z-50   flex  justify-center hover:bg-transparent '>
											<div className='flex  dark:bg-zinc-900 bg-zinc-300  w-2/5 rounded-md'>
												<p className='text-balance tracking-wider font-semibold'>
													Se mostrara como ya pago, ya que la fecha a pagar es anterior a la fecha actual. Por lo cual la
													proxima fecha a pagar sera el mes siguienete al actual.
												</p>
											</div>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							</div>
						) : (
							' '
						)}
					</div>
				)}
				<Button
					disabled={loader || name === '' || value === '0' || selectedCategory === null || (isFixed === 'true' && !deadLine)}
					onClick={submitExpense}
					className={`disabled:text-zinc-200  bg-zinc-700 hover:bg-zinc-500 dark:bg-zinc-500 text-white rounded-md hover:dark:bg-zinc-600 flex justify-center`}>
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
