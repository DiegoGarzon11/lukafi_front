import { NewDebt } from '@/apis/DebtService';
import { Expense, Income, Loader } from '@/assets/icons/Svg';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ApiResponse } from '@/interfaces/Wallet';
import { Toast } from '@/tools/Toast';
import { useState } from 'react';

export const AddDebt = ({ apiData }) => {
	const [person, setPerson] = useState('');
	const [value, setValue] = useState('');
	const [reason, setReason] = useState('');
	const [loader, setLoader] = useState(false);
	const [debtType, setDebtType] = useState(null);
	const [visibilytToast, setVisibilityToast] = useState(false);
	const [responseDebt, setResponseDebt] = useState<ApiResponse | undefined>(null);

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
		}else if(type === 'isFixed'){
			console.log(e.target.value);
			
		}
	};

	const submitDebt = async () => {
		setLoader(true);

		const params = {
			User_id: apiData?.wallet?.User_id,
			Wallet_id: apiData?.wallet?.Wallet_id,
			person,
			value: value.replace(/,/g, ''),
			reason,
			debtType,
		};

		const response = await NewDebt(params);

		if (response) {
			setResponseDebt(response);
			setVisibilityToast(true);
			setValue('');
			setPerson('');
			setReason('');
			setDebtType(null);
			setLoader(false);
		}

		setTimeout(() => {
			setVisibilityToast(false);
			setResponseDebt(null);
		}, 1000);
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button className='w-full py-6  bg-slate-700 text-white'>Agregar deuda</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-[425px] '>
				<DialogHeader>
					<DialogTitle>Nueva deuda</DialogTitle>
					<DialogDescription>Selecciona la opción que deseas y escribe los datos de la persona relacionada a la deuda</DialogDescription>
				</DialogHeader>
				<div className='flex justify-evenly gap-5'>
					<div
						onClick={() => setDebtType(1)}
						className={`border  p-5 rounded-xl w-40 cursor-pointer ${debtType === 1 ? 'border-green-300' : 'border-gray-200/50'}`}>
						<div className='flex justify-center flex-col items-center gap-2 '>
							<Income color={`${debtType === 1 ? 'green' : 'gray'}`} />

							<label
								className={`${debtType === 1 ? 'text-green-500' : 'opacity-15'} cursor-pointer`}
								htmlFor=''>
								Te debe...
							</label>
						</div>
					</div>
					<div
						onClick={() => setDebtType(0)}
						className={`border  p-5 rounded-xl w-40 cursor-pointer ${debtType === 2 ? 'border-red-300' : 'border-gray-200/50'}`}>
						<div className='flex justify-center flex-col items-center gap-2'>
							<Expense color={`${debtType === 0 ? 'red' : 'gray'}`} />
							<label
								className={`${debtType === 0 ? 'text-red-500' : 'opacity-15'} cursor-pointer`}
								htmlFor=''>
								Debes a ...
							</label>
						</div>
					</div>
				</div>
				<div className='flex gap-5 items-center'>
					<div>
						<label htmlFor=''>
							Nombre <span className='text-red-500'>*</span>
						</label>
						<Input
							value={person}
							onChange={(e) => handleValues(e, 'name')}
						/>
					</div>
					<div>
						<label htmlFor=''>
							Valor $ <span className='text-red-500'>*</span>
						</label>
						<Input
							id='value_income'
							type='text'
							value={value}
							onChange={(e) => handleValues(e, 'money')}
						/>
					</div>
				</div>
				<div>
					<label htmlFor=''>
						Motivo <span className='text-red-500'>*</span>{' '}
					</label>

					<Input
						id='value_income'
						type='text'
						value={reason}
						onChange={(e) => handleValues(e, 'reason')}
					/>
				</div>
				<Button
					disabled={debtType === null || person === '' || reason === '' || value === '' || value === '0'}
					onClick={submitDebt}
					className={` py-2 rounded-md text-white flex justify-center ${
						debtType === null || person === '' || reason === '' || value === '' || value === '0' ? 'bg-gray-200 ' : ' bg-slate-800'
					}`}>
					{loader ? <Loader /> : 'Confirmar'}
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
