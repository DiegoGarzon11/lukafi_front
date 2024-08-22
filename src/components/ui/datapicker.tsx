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

	const handleDateSelect = (selectedDate) => {
		setDate(selectedDate);
		sendDate(selectedDate);
	};

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant={'outline'}
					className={cn('w-full  justify-center text-center font-normal h-10 text-base bgs ', !date && 'text-muted-foreground')}>
					<CalendarIcon className='mr-2 h-4 w-4' />
					{date ? format(date, 'PPPP') : <span>Selecciona la fecha limite</span>}
				</Button>
			</PopoverTrigger>
			<PopoverContent className='w-auto' align='center'>
				<Calendar mode='single' className='' selected={date} onSelect={handleDateSelect} initialFocus disableNavigation={false} />
			</PopoverContent>
		</Popover>
	);
}
