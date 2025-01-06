import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function TooltipComponent({ message, content, className }: { message: string; content: string; className?: string }) {
	return (
		<TooltipProvider delayDuration={200}>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						
						className='p-0  hover:bg-transparent'
						variant='ghost'>
						<span className={` ${className} `}>{message}</span>
					</Button>
				</TooltipTrigger>
				<TooltipContent
					className='bg-slate-700 px-2 py-1 rounded-md'
					side='bottom'>
					<p className=''>{content}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
