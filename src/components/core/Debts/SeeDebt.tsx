import {DeleteDebt, GetDebts} from '@/apis/DebtService';
import {Edit} from '@/assets/icons/Svg';
import {Trash} from 'lucide-react';
import {TooltipComponent} from '@/components/others/Tooltip';
import {Button} from '@/components/ui/button';
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from '@/components/ui/dialog';
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table';
import {ResponseWallet, Debt} from '@/interfaces/Wallet';
import {Toast} from '@/tools/Toast';
import {useState} from 'react';

export const SeeDebt = ({apiData}) => {
	const [visibilytToast, setVisibilityToast] = useState(false);
	const [debts, setDebts] = useState<Array<Debt> | undefined>([]);
	const [responseDebt, setresponseDebt] = useState<ResponseWallet | undefined>(null);

	async function getDebts() {
		const params = {
			wallet_id: apiData?.wallet_id,
		};
		const response = await GetDebts(params);

		setDebts(response?.debts);
	}

	const deleteDebt = async (e) => {
		const params = {
			debt_id: e?.debt_id,
			wallet_id: e?.wallet_id,
		};
		const responseDeleteDebt = await DeleteDebt(params);
		if (responseDeleteDebt) {
			setresponseDebt(responseDeleteDebt);
			getDebts();
			setVisibilityToast(true);
		}

		setTimeout(() => {
			setVisibilityToast(false);
		}, 1000);
	};
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button onClick={() => getDebts()} className='w-full py-6  bg-slate-950/50 text-white'>
					Tus deudas
				</Button>
			</DialogTrigger>
			<DialogContent className='w-auto' aria-describedby={undefined}>
				<DialogHeader>
					<DialogTitle>Tus deudas</DialogTitle>
				</DialogHeader>
				{debts !== null ? (
					<Table className=''>
						<TableCaption>A list of your recent invoices.</TableCaption>
						<TableHeader>
							<TableRow className=' text-base pt-4 '>
								<TableHead className='w-40'>Fecha</TableHead>
								<TableHead className='w-40'>Persona</TableHead>
								<TableHead className='w-40'>Razón</TableHead>
								<TableHead className='w-40'>Valor</TableHead>
								<TableHead className='w-40'>estado</TableHead>
								<TableHead className='w-40' />
							</TableRow>
						</TableHeader>

						<TableBody className=' h-[400px] overflow-auto  overflow-x-hidden   scrollbar-custom'>
							{debts?.map((d) => (
								<TableRow key={d?.debt_id}>
									<TableCell className='font-medium flex gap-10 items-center w-40'>
										<p>{new Date(JSON.parse(d?.created_in)).toLocaleDateString()}</p>
									</TableCell>
									<TableCell className='font-medium w-40'>
										{d?.person.length >= 10 ? (
											<TooltipComponent message={`${d?.person.slice(0, 10)}...`} content={d?.person} />
										) : (
											<p>{d?.person}</p>
										)}
									</TableCell>
									<TableCell className='font-medium w-40'>
										<p>{d?.reason}</p>
									</TableCell>
									<TableCell className='font-medium w-40'>
										<p>{d?.value.toLocaleString()}</p>
									</TableCell>
									<TableCell className='font-medium w-40'>
										<p className={` rounded-md px-2 py-1 text-start ${d?.debt_type == 0 ? 'text-red-500' : 'text-green-500'}`}>
											{d?.debt_type == 0 ? 'Debes' : 'Te deben'}
										</p>
									</TableCell>
									<TableCell className='font-medium flex  w-40'>
										<Button onClick={() => deleteDebt(d)} variant='ghost' className='w-full'>
											<Trash className={'w-6'} />
										</Button>
										<Button variant='ghost' className='w-full'>
											<Edit className={'w-6'} />
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				) : (
					<p> No se encontraron deudas pendientes</p>
				)}
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
