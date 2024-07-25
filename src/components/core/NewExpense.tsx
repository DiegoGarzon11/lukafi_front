import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DialogHeader } from "@/components/ui/dialog";
import { Button } from  "@/components/ui/button";

export const NewExpense = () => {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button className='w-full py-6  bg-slate-700 text-white'>Agregar ingreso</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>Nuevo ingreso</DialogTitle>
					<DialogDescription>Make changes to your profile here. Click save when you're done.</DialogDescription>
				</DialogHeader>
				<div className='grid gap-4 py-4'>
					<div className='grid grid-cols-4 items-center gap-4'></div>
					<div className='grid grid-cols-4 items-center gap-4'></div>
				</div>
			</DialogContent>
		</Dialog>
	);
};
