import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
	return (
		<DayPicker
			ISOWeek={true}
			showOutsideDays={showOutsideDays}
			className={cn('p-3', className)}
			classNames={{
				months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
				month: 'space-y-4',
				caption: 'flex justify-center pt-1 relative items-center',
				caption_label: 'text-sm font-medium',
				nav: 'space-x-1 flex items-center',
				nav_button: cn(buttonVariants({ variant: 'ghost' }), 'h-7 w-7 bg-transparent p-0 '),
				nav_button_previous: 'absolute left-1  cursor-pointer hover:bg-light_foreground dark:hover:bg-dark_foreground',
				nav_button_next: 'absolute right-1  cursor-pointer hover:bg-light_foreground dark:hover:bg-dark_foreground ',
				table: 'w-full border-collapse space-y-1',
				head_row: 'flex',
				head_cell: 'text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]',
				row: 'flex w-full mt-2',
				cell: 'h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
				day: cn(buttonVariants({ variant: 'ghost' }), 'h-9 w-9 p-0 font-normal aria-selected:opacity-100 cursor-pointer'),
				day_range_end: 'day-range-end',
				day_selected:
					'dark:bg-dark_primary_color bg-light_primary_color text-primary-foreground hover:bg-foreground hover:text-primary-foreground focus:bg-foreground focus:text-primary-foreground',
				day_today: 'dark:bg-dark_foreground bg-light_foreground ',
				day_outside:
					'day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30',
				day_disabled: '',
				day_range_middle: 'aria-selected:bg-accent aria-selected:text-accent-foreground',
				day_hidden: 'invisible',
				...classNames,
			}}
			components={{
				IconLeft: () => <ChevronLeft className='h-4 w-4' />,
				IconRight: () => <ChevronRight className='h-4 w-4' />,
			}}
			{...props}
		/>
	);
}
Calendar.displayName = 'Calendar';

export { Calendar };
