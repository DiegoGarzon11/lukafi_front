import { ChartFinance } from "@/components/core/Charts";

export const WalletComponent = () => {
	return (
		<section className='flex flex-col md:flex-row  items-center justify-between h-full pt-20 p-5 gap-5 dark:bg-dark_primary_color bg-white font-thin'>
			
			<div className='flex flex-col justify-between h-full w-full md:w-2/3 rounded-3xl p-8 shadow-sm shadow-zinc-900/90'>
				<ChartFinance/>
			</div>
			<div>
				selecciona tu tarjeta
			</div>
		</section>
	);
};
