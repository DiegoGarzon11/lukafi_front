// import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
// import { DialogHeader } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import { Label } from '@/components/ui/label';
// import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
// import { Expense, Income, Loader } from '@/assets/icons/Svg';
// import { Input } from '@/components/ui/input';
// import { useState } from 'react';
// import { ApiResponse } from '@/interfaces/Wallet';
// import { NewDebt } from '@/apis/DebtService';
// import { Toast } from '@/tools/Toast';

// export const AddExpense = ({ apiData }) => {
// 	return (
// 		<Dialog>
// 			<DialogTrigger asChild>
// 				<Button className='w-full py-6  bg-slate-700 text-white'>Agregar deuda</Button>
// 			</DialogTrigger>
// 			<DialogContent className='sm:max-w-[425px] '>
// 				<DialogHeader>
// 					<DialogTitle>Nueva deuda</DialogTitle>
// 					<DialogDescription>Selecciona la opción que deseas y escribe los datos de la persona relacionada a la deuda</DialogDescription>
// 				</DialogHeader>
// 				<div className='flex justify-evenly gap-5'>
// 					<RadioGroup defaultValue='0'>
// 						<div className='flex items-center space-x-2'>
// 							<RadioGroupItem
// 								value='1'
// 								id='1'
// 							/>
// 							<Label htmlFor='r1'>Si</Label>
// 						</div>
// 						<div className='flex items-center space-x-2'>
// 							<RadioGroupItem
// 								value='0'
// 								id='0'
// 							/>
// 							<Label htmlFor='r2'>No</Label>
// 						</div>
// 					</RadioGroup>
// 				</div>

// 				<div className='flex gap-5 items-center'>
// 					<div>
// 						<label htmlFor='name'>
// 							Nombre <span className='text-red-500'>*</span>
// 							<Input
// 								id='value_name'
// 								type='text'
// 							/>
// 						</label>
// 					</div>
// 					<div>
// 						<label htmlFor='value_value'>
// 							Valor $ <span className='text-red-500'>*</span>
// 							<Input
// 								id='value_value'
// 								type='text'
// 							/>
// 						</label>
// 					</div>
// 				</div>
// 				<div>
// 					<label htmlFor='value_reason'>
// 						Motivo <span className='text-red-500'>*</span>
// 						<Input
// 							id='value_reason'
// 							type='text'
// 						/>
// 					</label>
// 				</div>
// 			</DialogContent>
// 		</Dialog>
// 	);
// };
