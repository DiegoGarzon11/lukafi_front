'use client';

import { CalendarIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export function DatePicker({ sendDate }) {
	const [date, setDate] = useState<Date>();
	const [openCalendar, setOpenCalendar] = useState(false);

	const { t, i18n } = useTranslation();
	i18n.changeLanguage();

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
						'w-full  justify-center text-center font-normal h-10 text-base bg-dark_secondary_color cursor-pointer  	',
						!date && 'text-muted-foreground '
					)}>
					<CalendarIcon className='mr-2 h-4 w-4' />
					{date ? format(date, 'PPPP') : <span> {t('dataPicker.selectDate')} </span>}
				</Button>
			</PopoverTrigger>
			<PopoverContent className='w-auto dark:bg-dark_secondary_color  bg-zinc-100 dark:text-white text-black'>
				<Calendar
					mode='single'
					selected={date}
					onSelect={handleDateSelect}
					initialFocus
					disableNavigation={false}
				/>
			</PopoverContent>
		</Popover>
	);
}
