import { Button } from '@/components/ui/button';
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { useTranslation } from 'react-i18next';
import dog from '@/assets/avatar/dog.webp';

export function SheetSide() {
	const { t, i18n } = useTranslation();
	i18n.changeLanguage();

	function closeSession() {
		localStorage.removeItem('token');
		localStorage.removeItem('userMain');
		window.location.href = '/';
	}

	return (
		<div className='flex items-center'>
			<Sheet >
				<SheetTrigger asChild>
					<Button
						className=' border-none m-0 p-0 shadow flex justify-center w-11'
						variant='black_outline'>
						<img
							className='w-8  rounded-full'
							src={dog}
							alt=''
						/>
					</Button>
				</SheetTrigger>
				<SheetContent
				className='bg-slate-900'
					aria-describedby={undefined}
					side='right'>
					<SheetTitle className='hidden' />
					<div className='w-full mt-10 flex flex-col gap-3'>
					<Button
							className='w-full py-6  bg-slate-700 text-white'
							onClick={() => {
								closeSession();
							}}>
							Billetera
						</Button>
						<Button
							className='w-full py-6  bg-slate-700 text-white'
							onClick={() => {
								closeSession();
							}}>
							Perfil
						</Button>
						
						<Button
							className='w-full py-6  bg-slate-700 text-white'
							onClick={() => {
								closeSession();
							}}>
							{t('sheet.button.signOut')}
						</Button>
					</div>
					<SheetFooter>
						<SheetClose
							className='w-full my-5'
							type='submit'
							asChild></SheetClose>
					</SheetFooter>
				</SheetContent>
			</Sheet>
		</div>
	);
}
