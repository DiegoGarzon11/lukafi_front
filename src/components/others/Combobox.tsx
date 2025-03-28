'use client';

import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useState } from 'react';

export function Combobox({ data, selected }) {
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState('');

	return (
		<Popover
			open={open}
			onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant='ghost'
					role='combobox'
					aria-expanded={open}
					className='border dark:border-zinc-400 dark:bg-dark_secondary_color bg-light_secondary_color w-full h-9'>
					{value ? JSON.parse(value).category_name : 'Select category...'}
					<CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
				</Button>
			</PopoverTrigger>
			<PopoverContent
				align='end'
				side='bottom'
				className='w-full p-0'>
				<Command className=' dark:bg-dark_secondary_color bg-light_secondary_color dark:text-white text-black   '>
					<CommandInput
						placeholder='Buscar categoria...'
						className='h-9 dark:text-white text-black'
					/>
					<CommandList className=' '>
						<CommandEmpty>Categoria no encontrada.</CommandEmpty>
						<CommandGroup className='  '>
							{data?.map((c) => (
								<CommandItem
									className='cursor-pointer hover:bg-zinc-300 dark:hover:bg-zinc-700'
									key={c.category_id}
									value={c}
									onSelect={() => {
										setValue(JSON.stringify(c));
										selected(c);
										setOpen(false);
									}}>
									{c.category_name}
									<CheckIcon className={cn('ml-auto h-4 w-4', value === c.category_name ? 'opacity-100' : 'opacity-0')} />
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
