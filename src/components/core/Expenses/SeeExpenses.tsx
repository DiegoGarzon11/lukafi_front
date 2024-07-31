import { GetExpenses } from '@/apis/ExpenseService';
// import { Edit, Trash } from '@/assets/icons/Svg';
import { TooltipComponent } from '@/components/others/Tooltip';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Expenses } from '@/interfaces/Wallet';
// import { Toast } from '@/tools/Toast';
import { useState } from 'react';

export const SeeExpenses = ({ apiData }) => {
	// const [visibilytToast, setVisibilityToast] = useState(false);
	const [expenses, setExpenses] = useState<Array<Expenses> | undefined>([]);
	// const [responseDebt, setresponseDebt] = useState<ResponseWallet | undefined>(null);

	async function getExpenses() {
		const params = {
			wallet_id: apiData?.wallet_id,
		};
		const response = await GetExpenses(params);

		setExpenses(response?.expenses);
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					onClick={() => getExpenses()}
					className='w-full py-6 bg-slate-950/50 text-white'>
					Tus gastos
				</Button>
			</DialogTrigger>
			<DialogContent
				className='w-auto'
				aria-describedby={undefined}>
				<DialogHeader>
					<DialogTitle>Tus gastos</DialogTitle>
				</DialogHeader>
				{expenses !== null ? (
					<Table className=''>
						<TableCaption>A list of your recent invoices.</TableCaption>
						<TableHeader>
							<TableRow className=' text-base  py-4 '>
								<TableHead className='w-40'>Creado en</TableHead>
								<TableHead className='w-40'>Nombre</TableHead>
								<TableHead className='w-40'>Valor</TableHead>
								<TableHead className='w-40 text-pretty'>Fecha limite de pago</TableHead>
								<TableHead className='w-40'>Estado</TableHead>
								{/* <TableHead className='w-40' /> */}
							</TableRow>
						</TableHeader>

						<TableBody className=' h-[400px] overflow-auto  overflow-x-hidden   scrollbar-custom'>
							{expenses?.map((e) => (
								<TableRow key={e?.expense_id}>
									<TableCell className='font-medium flex gap-10 items-center w-40'>
										<p>{new Date(JSON.parse(e?.created_in)).toLocaleDateString()}</p>
									</TableCell>
									<TableCell className='font-medium w-40'>
										{e?.name.length >= 10 ? (
											<TooltipComponent
												message={`${e?.name.slice(0, 10)}...`}
												content={e?.name}
											/>
										) : (
											<p>{e?.name}</p>
										)}
									</TableCell>

									<TableCell className='font-medium w-40'>
										<p>{e?.value.toLocaleString()}</p>
									</TableCell>
									<TableCell className='font-medium w-40'>
										<p>{new Date(e?.dead_line).toLocaleDateString()}</p>
									</TableCell>
									<TableCell className='font-medium w-40'>
										{e?.is_fixed ? (
											<p className={`${e.paid_in == null}`}>
												{e.paid_in == null ? 'No ha sido pagada' : new Date(JSON.parse(e?.paid_in)).toLocaleDateString()}
											</p>
										) : (
											<p>No es gasto fijo</p>
										)}
									</TableCell>
									{/* <TableCell className='font-medium flex  w-40'>
										<Button
											onClick={() => deleteDebt(d)}
											variant='ghost'
											className='w-full'>
											<Trash className={'w-6'} />
										</Button>
										<Button
											variant='ghost'
											className='w-full'>
											<Edit className={'w-6'} />
										</Button>
									</TableCell> */}
								</TableRow>
							))}
						</TableBody>
					</Table>
				) : (
					<p> No se encontraron deudas pendientes</p>
				)}
			</DialogContent>
			{/* {visibilytToast && (
				<Toast
					visibility={visibilytToast}
					severity={responseDebt?.success == true ? 'success' : 'error'}
					message={responseDebt?.message}
				/>
			)} */}
		</Dialog>
	);
};
