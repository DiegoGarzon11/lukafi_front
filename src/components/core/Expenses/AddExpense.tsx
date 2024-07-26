import { NewExpense } from '@/apis/ExpenseService';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/datapicker';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useState } from 'react';

export const AddExpense = ({ apiData }) => {
	const [deadLine, setDeadLine] = useState(null);
	const [name, setName] = useState('');
	const [value, setValue] = useState('');
	const [isFixed, setIsFixed] = useState('0');
	// const [responseApiNewExpense, setResponseApiNewExpense] = useState('');

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
		const params = {
			Wallet_id: apiData.Wallet_id,
			User_id: apiData.User_id,
			name,
			value: parseInt(value.replace(/,/g, '')),
			deadLine: new Date(deadLine).toISOString(),
			isFixed: Boolean(isFixed),
		};
		 await NewExpense(params);
		
		// setResponseApiNewExpense(response);
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button className='w-full py-6  bg-slate-700 text-white'>Agregar ingreso</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-[425px] '>
				<DialogHeader>
					<DialogTitle>Nueva ingreso</DialogTitle>
					<DialogDescription>Completa los campos segun el gasto corresponda</DialogDescription>
				</DialogHeader>

				<div className='flex gap-5 items-center'>
					<div>
						<label
							htmlFor='value_name'
							className='mb-2'>
							Nombre <span className='text-red-500'>*</span>
							<Input
								onChange={(e) => handleValues(e, 'name')}
								id='value_name'
								type='text'
							/>
						</label>
					</div>
					<div>
						<label
							htmlFor='value_value'
							className='mb-2'>
							Valor $ <span className='text-red-500'>*</span>
							<Input
								value={value}
								onChange={(e) => handleValues(e, 'value')}
								id='value_value'
								type='text'
							/>
						</label>
					</div>
				</div>
				<div className='flex flex-col items-center'>
					<label
						htmlFor='value_value'
						className='self-start mb-2'>
						Fecha limite de pago $ <span className='text-gray-400'>(opcional)</span>
					</label>
					<DatePicker sendDate={handleDate} />
				</div>

				<div className='flex justify-center items-center gap-5 flex-col  '>
					<label>
						¿Es un gasto Fijo? <span className='text-red-500'>*</span>
					</label>
					<RadioGroup
						className='flex items-center'
						defaultValue={isFixed}
						onValueChange={(e) => handleValues(e, 'isFixed')}>
						<div className='flex items-center space-x-2'>
							<RadioGroupItem
								value='true'
								id='1'
							/>
							<Label htmlFor='r1'>Si</Label>
						</div>
						<div className='flex items-center space-x-2'>
							<RadioGroupItem
								value='false'
								id='0'
							/>
							<Label htmlFor='r2'>No</Label>
						</div>
					</RadioGroup>
				</div>
				<Button
					onClick={submitExpense}
					className={` py-2 rounded-md text-slate-300 flex justify-center`}>
					{'Confirmar'}
				</Button>
			</DialogContent>
		</Dialog>
	);
};
