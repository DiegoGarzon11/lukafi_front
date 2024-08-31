'use client';

import {CalendarIcon} from '@radix-ui/react-icons';
import {format} from 'date-fns';

import {cn} from '@/lib/utils';
import {Button} from '@/components/ui/button';
import {Calendar} from '@/components/ui/calendar';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {useState} from 'react';

export function DatePicker({sendDate}) {
	const [date, setDate] = useState<Date>();
	const [openCalendar, setOpenCalendar] = useState(false);

	const handleDateSelect = (selectedDate) => {
		setDate(selectedDate);
		sendDate(selectedDate);
		setOpenCalendar(false);
	};

	return (
		<Popover open={openCalendar}>
			<PopoverTrigger asChild>
				<Button
					onClick={() => setOpenCalendar(true)}
					variant={'black_outline'}
					className={cn(
						'w-full  justify-center text-center font-normal h-10 text-base bgs border border-zinc-200 dark:border-zinc-400 	',
						!date && 'text-muted-foreground'
					)}>
					<CalendarIcon className='mr-2 h-4 w-4' />
					{date ? format(date, 'PPPP') : <span>Selecciona la fecha limite</span>}
				</Button>
			</PopoverTrigger>
			<PopoverContent className='w-auto dark:bg-zinc-800 dark:text-white bg-zinc-100 text-black'>
				<Calendar mode='single' selected={date} onSelect={handleDateSelect} initialFocus disableNavigation={false} />
			</PopoverContent>
		</Popover>
	);
}
