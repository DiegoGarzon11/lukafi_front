import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function TooltipComponent({ message, content }: { message: string; content: string }) {
	return (
		<TooltipProvider delayDuration={200}>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						className='p-0  hover:bg-transparent'
						variant='ghost'>
						{message}
					</Button>
				</TooltipTrigger>
				<TooltipContent
					className='bg-slate-700 px-2 py-1 rounded-md'
					side='bottom'>
					<p>{content}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
