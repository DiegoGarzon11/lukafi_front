import { useEffect, useState } from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { AddIncome } from './AddIncome';
import { Incomes } from '@/interfaces/Wallet';
import { DeleteIncome, GetAllIncomes } from '@/apis/Income.service';
import { GetWalletUser } from '@/apis/WalletService';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { TooltipComponent } from '@/components/others/Tooltip';
import { EllipsisVertical, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoaderApi } from '@/assets/icons/Svg';
import { ApiResponse } from '@/interfaces/Api';
import { Toast } from '@/hooks/Toast';
import { LoaderComponent } from '@/components/others/Loader';
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination';

export const SeeIncomes = () => {
	const { t, i18n } = useTranslation();
	i18n.changeLanguage();
	const userData = JSON.parse(localStorage.getItem('userMain'));
	const [incomes, setIncomes] = useState<Array<Incomes> | undefined>([]);
	const [walletId, setWalletId] = useState<string | undefined>('');
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [incomeToDelete, setIncomeToDelete] = useState<Incomes | undefined>(undefined);
	const [trigger, setTrigger] = useState(0);
	const [ApiResponse, setApiResponse] = useState<ApiResponse | undefined>(null);
	const [visibilyToast, setVisibilityToast] = useState(false);
	const [loader, setLoader] = useState(false);
	const [fetching, setFetching] = useState(true);
	const getIncomes = async (walletId) => {
		const income = await GetAllIncomes(walletId);
		setIncomes(income?.incomes);
	};
	useEffect(() => {
		const fetchData = async () => {
			const wallet = await GetWalletUser(userData?.user_id);
			setWalletId(wallet.wallet.wallet_id);
			getIncomes(wallet.wallet);
			setFetching(false);
		};

		fetchData();
	}, [trigger]);
	const dataWallet = {
		user_id: userData?.user_id,
		wallet_id: walletId,
	};

	const recibeResponseChild = async (e) => {
		if (e) {
			return setTrigger((prev) => prev + 1);
		}
	};
	const deleteIncome = async (e) => {
		setLoader(true);
		setVisibilityToast(false);

		const params = {
			income_id: e?.income_id,
			wallet_id: e?.wallet_id,
		};

		try {
			const responseDeleteIncome = await DeleteIncome(params);
			setApiResponse(responseDeleteIncome);
			getIncomes(params);
		} catch (error) {
			console.error(error);
		} finally {
			setVisibilityToast(true);
			setLoader(false);
			setOpenDeleteDialog(false);
			setIncomeToDelete(null);
		}
	};
	if (fetching) {
		return <LoaderComponent />;
	}
	return (
		<main className='pt-20 px-3 '>
			<nav className='flex w-full justify-between items-center pb-5 dark:text-white'>
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink className='text-base'>Billetera</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage className='text-base'>ingresos</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>

				<AddIncome
					sendData={(e) => recibeResponseChild(e)}
					className='md:w-1/5 w-1/2 border border-border'
					apiData={dataWallet}
				/>
			</nav>

			<section className=' shadow-xs md:col-span-3 row-span-9   '>
				<div className='  w-full  flex  justify-between gap-5 order-3  '>
					<div className='dark:bg-dark_primary_color bg-light_primary_color p-3 w-full rounded-xl '>
						<div className='flex gap-3 flex-col items-start  '>
							<h5 className='text-2xl dark:text-white'> Todos tus ingresos </h5>
							<div className='w-9/12 my-3'> 
								<Input
									placeholder='Buscar'
									className='dark:text-white borderno'
								/>
							</div>
						</div>

						<div className='w-full h-3/4 '>
							<section className='w-full    '>
								<article className=' flex text-base font-semibold py-4 dark:text-zinc-300 text-slate-500 border-b border-slate-500/50 mb-3'>
									<p className='w-full   p'>{t('dashboard.date')}</p>
									<p className='w-full '>{t('dashboard.name')}</p>
									<p className='w-full '>{t('dashboard.value')}</p>
									<p className='md:w-full w-auto' />
								</article>
							</section>

						<div className="w-full h-[calc(100vh-410px)] max-h-screen overflow-auto scrollbar-custom">
								{incomes.length == 0 ? (
									<p className='text-center text-lg mt-5 text-blue-500'>Actualmente no tienes ningún ingreso registrado</p>
								) : (
									<Table className='w-full'>
										<TableBody className=' w-full scrollbar-custom '>
											{incomes?.map((i) => (
												<TableRow
													key={i?.income_id}
													className='border-b pb-2 border-gray-600/20 dark:text-white'>
													<TableCell className='font-medium  w-full '>
														<p>{new Date(i?.date).toLocaleDateString()}</p>
													</TableCell>
													<TableCell className='font-medium w-full  '>
														{i?.name.length >= 10 ? (
															<TooltipComponent
																message={`${i?.name.slice(0, 10)}...`}
																content={i?.name}
															/>
														) : (
															<p>{i?.name}</p>
														)}
													</TableCell>

													<TableCell className='font-medium w-full  '>
														<p>$ {Number(i?.value).toLocaleString()}</p>
													</TableCell>
													<TableCell className='font-medium  md:w-full w-auto text-end md:text-center cursor-pointer'>
														<DropdownMenu>
															<DropdownMenuTrigger className='cursor-pointer'>
																<EllipsisVertical />
															</DropdownMenuTrigger>
															<DropdownMenuContent className='dark:bg-dark_secondary_color bg-light_secondary_color w-44 dark:text-white dark:hover:bg-dark_foreground hover:bg-light_foreground  cursor-pointer '>
																<DropdownMenuItem
																	onClick={() => {
																		setIncomeToDelete(i);
																		setOpenDeleteDialog(true);
																	}}
																	className=' flex justify-between'>
																	<p className='dark:text-white font-semibold'>{t('dashboard.delete')}</p>

																	<Trash2 className='dark:text-white' />
																</DropdownMenuItem>
															</DropdownMenuContent>
														</DropdownMenu>
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								)}
							</div>
							<Pagination className='mt-5 dark:bg-dark_primary_color bg-light_primary_color dark:text-white'>
								<PaginationContent>
									<PaginationItem>
										<PaginationPrevious href='#' />
									</PaginationItem>
									<PaginationItem>
										<PaginationLink href='#'>1</PaginationLink>
									</PaginationItem>
									<PaginationItem>
										<PaginationEllipsis />
									</PaginationItem>
									<PaginationItem>
										<PaginationNext href='#' />
									</PaginationItem>
								</PaginationContent>
							</Pagination>
						</div>
					</div>
				</div>
			</section>
			{visibilyToast && (
				<Toast
					visibility={visibilyToast}
					severity={ApiResponse.success == true ? 'success' : 'error'}
					message={ApiResponse.message}
				/>
			)}
			<Dialog
				open={openDeleteDialog}
				onOpenChange={setOpenDeleteDialog}>
				<DialogContent
					aria-describedby={null}
					className=' w-full md:w-[500px] rounded-md dark:bg-dark_primary_color bg-light_primary_color dark:text-white'>
					<DialogHeader>
						<DialogTitle className='my-3'>
							<p className='my-3 font-bold text-2xl'> {t('dashboard.confirmDelete')} </p>

							<p className='text-balance   '>
								¿Estas seguro que deseas eliminar el ingreso <span className='font-semibold text-main_color '>{incomeToDelete?.name}</span> ?
							</p>
						</DialogTitle>
						<DialogDescription className='flex justify-end items-end gap-5 h-full'>
							<Button
								className='w-full bg-red-500 text-white'
								onClick={() => setOpenDeleteDialog(false)}>
								{t('dashboard.cancel')}
							</Button>

							<Button
								onClick={() => deleteIncome(incomeToDelete)}
								className='w-full bg-alternative_color text-white'>
								{loader ? <LoaderApi color='white' /> : `${t('dashboard.delete')}`}
							</Button>
						</DialogDescription>
					</DialogHeader>
				</DialogContent>
			</Dialog>
		</main>
	);
};
