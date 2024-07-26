// import { DeleteDebt, GetDebts } from '@/apis/DebtService';
// import { Edit, Trash } from '@/assets/icons/Svg';
// import { TooltipComponent } from '@/components/others/Tooltip';
// import { Button } from '@/components/ui/button';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
// import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { ApiResponse, Debt } from '@/interfaces/Wallet';
// import { Toast } from '@/tools/Toast';
// import { useState } from 'react';

// export const SeeDebt = ({ apiData }) => {
// 	const [visibilytToast, setVisibilityToast] = useState(false);
// 	const [debts, setDebts] = useState<Array<Debt> | undefined>([]);
// 	const [responseDebt, setresponseDebt] = useState<ApiResponse | undefined>(null);

// 	async function getDebts() {
// 		const params = {
// 			Wallet_id: apiData?.wallet?.Wallet_id,
// 		};
// 		const response = await GetDebts(params);

// 		setDebts(response?.response);
// 	}

// 	const deleteDebt = async (e) => {
// 		const params = {
// 			Debt_id: e?.Debt_id,
// 			Wallet_id: e?.Wallet_id,
// 		};
// 		const responseDeleteDebt = await DeleteDebt(params);
// 		if (responseDeleteDebt) {
// 			setresponseDebt(responseDeleteDebt);
// 			getDebts();
// 			setVisibilityToast(true);
// 		}

// 		setTimeout(() => {
// 			setVisibilityToast(false);
// 		}, 1000);
// 	};
// 	return (
// 		<Dialog>
// 			<DialogTrigger asChild>
// 				<Button
// 					onClick={() => getDebts()}
// 					className='w-full py-6  bg-slate-700 text-white'>
// 					Ver tus deudas
// 				</Button>
// 			</DialogTrigger>
// 			<DialogContent
// 				className='w-auto'
// 				aria-describedby={undefined}>
// 				<DialogHeader>
// 					<DialogTitle>Tus deudas</DialogTitle>
// 				</DialogHeader>
// 				{debts !== null ? (
// 					<Table className=''>
// 						<TableCaption>A list of your recent invoices.</TableCaption>
// 						<TableHeader>
// 							<TableRow className=' text-base pt-4 '>
// 								<TableHead className='w-40'>Fecha</TableHead>
// 								<TableHead className='w-40'>Persona</TableHead>
// 								<TableHead className='w-40'>Razón</TableHead>
// 								<TableHead className='w-40'>Valor</TableHead>
// 								<TableHead className='w-40'>estado</TableHead>
// 								<TableHead className='w-40' />
// 							</TableRow>
// 						</TableHeader>

// 						<TableBody className=' h-[500px] overflow-auto  overflow-x-hidden   scrollbar-custom'>
// 							{debts.map((d) => (
// 								<TableRow key={d?.Debt_id}>
// 									<TableCell className='font-medium flex gap-10 items-center w-40'>
// 										<p>{new Date(JSON.parse(d?.CreatedIn)).toLocaleDateString()}</p>
// 									</TableCell>
// 									<TableCell className='font-medium w-40'>
// 										{d?.Person.length >= 10 ? (
// 											<TooltipComponent
// 												message={`${d?.Person.slice(0, 10)}...`}
// 												content={d?.Person}
// 											/>
// 										) : (
// 											<p>{d?.Person}</p>
// 										)}
// 									</TableCell>
// 									<TableCell className='font-medium w-40'>
// 										<p>{d?.Reason}</p>
// 									</TableCell>
// 									<TableCell className='font-medium w-40'>
// 										<p>{parseInt(d?.Value).toLocaleString()}</p>
// 									</TableCell>
// 									<TableCell className='font-medium w-40'>
// 										<p className={` rounded-md px-2 py-1 text-start ${d?.DebtType == 0 ? 'text-red-500' : 'text-green-500'}`}>
// 											{d?.DebtType == 0 ? 'Debes' : 'Te deben'}
// 										</p>
// 									</TableCell>
// 									<TableCell className='font-medium flex  w-40'>
// 										<Button
// 											onClick={() => deleteDebt(d)}
// 											variant='ghost'
// 											className='w-full'>
// 											<Trash className={'w-6'} />
// 										</Button>
// 										<Button
// 											variant='ghost'
// 											className='w-full'>
// 											<Edit className={'w-6'} />
// 										</Button>
// 									</TableCell>
// 								</TableRow>
// 							))}
// 						</TableBody>
// 					</Table>
// 				) : (
// 					<p> No se encontraron deudas pendientes</p>
// 				)}
// 			</DialogContent>
// 			{visibilytToast && (
// 				<Toast
// 					visibility={visibilytToast}
// 					severity={responseDebt?.success == true ? 'success' : 'error'}
// 					message={responseDebt?.message}
// 				/>
// 			)}
// 		</Dialog>
// 	);
// };
