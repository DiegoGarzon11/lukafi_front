import {NewExpense} from '@/apis/ExpenseService';
import {LoaderApi} from '@/assets/icons/Svg';
import {Button} from '@/components/ui/button';
import {DatePicker} from '@/components/ui/datapicker';
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger} from '@/components/ui/dialog';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group';
import {ApiResponse} from '@/interfaces/Api';
import {Toast} from '@/tools/Toast';
import {BadgePlus} from 'lucide-react';
import {useState} from 'react';

export const AddExpense = ({apiData, sendData}) => {
	const [deadLine, setDeadLine] = useState(null);
	const [name, setName] = useState('');
	const [value, setValue] = useState('0');
	const [isFixed, setIsFixed] = useState('false');
	const [responseApiNewExpense, setResponseApiNewExpense] = useState<ApiResponse | undefined>(undefined);
	const [visibilytToast, setVisibilityToast] = useState(false);
	const [loader, setLoader] = useState(false);

	const handleDate = (e) => {
		setDeadLine(e);
	};
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
			setIsFixed(e);
		}
	};

	const submitExpense = async () => {
		setLoader(true);
		const sendIsFixed: boolean = isFixed === 'true';

		const params = {
			wallet_id: apiData.wallet_id,
			user_id: apiData.user_id,
			name,
			is_paid: !sendIsFixed,
			paid_in: new Date(),
			value,
			deadLine,
			isFixed: sendIsFixed,
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
					variant='ghost'
					className='w-full py-6 dark:hover:bg-zinc-900  dark:bg-zinc-900/50  bg-zinc-300 text-black  dark:text-white flex items-center gap-3'>
					Agregar gasto <BadgePlus />
				</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-[425px] '>
				<DialogHeader>
					<DialogTitle>Nuevo gasto</DialogTitle>
					<DialogDescription>Completa los campos correspondientes al gasto</DialogDescription>
				</DialogHeader>

				<div className='flex gap-5 items-center'>
					<div>
						<label htmlFor='value_name' className='mb-2'>
							Nombre del gasto <span className='text-red-500'>*</span>
							<Input value={name} onChange={(e) => handleValues(e, 'name')} id='value_name' type='text' />
						</label>
					</div>
					<div>
						<label htmlFor='value_value' className='mb-2'>
							Valor $ <span className='text-red-500'>*</span>
							<Input value={value} onChange={(e) => handleValues(e, 'value')} id='value_value' type='text' />
						</label>
					</div>
				</div>
				<div className='flex flex-col items-center'>
					<label htmlFor='value_value' className='self-start mb-2'>
						Fecha limite de pago $ <span className='text-gray-400'>(opcional)</span>
					</label>
					<DatePicker sendDate={handleDate} />
				</div>

				<div className='flex justify-center items-center gap-5 flex-col  '>
					<label>
						¿Es un gasto Fijo? <span className='text-red-500'>*</span>
					</label>
					<RadioGroup className='flex items-center' defaultValue={isFixed} onValueChange={(e) => handleValues(e, 'isFixed')}>
						<div className='flex items-center space-x-2'>
							<RadioGroupItem value='true' id='true' />
							<Label htmlFor='r1'>Si</Label>
						</div>

						<div className='flex items-center space-x-2'>
							<RadioGroupItem value='false' id='false' />
							<Label htmlFor='r2'>No</Label>
						</div>
					</RadioGroup>
				</div>
				<Button
					disabled={name === '' || value === '0' || (isFixed && deadLine === null)}
					onClick={submitExpense}
					className={` py-2 rounded-md text-slate-300 flex justify-center`}>
					{loader ? <LoaderApi color='white' /> : 'Confirmar'}
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
