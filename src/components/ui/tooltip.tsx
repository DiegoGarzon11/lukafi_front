import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

import {cn} from '@/lib/utils';

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
	React.ElementRef<typeof TooltipPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({className, sideOffset = 0, ...props}, ref) => (
	<TooltipPrimitive.Content ref={ref} sideOffset={sideOffset} className={cn('hover:bg-slate-600', className)} {...props} />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export {Tooltip, TooltipTrigger, TooltipContent, TooltipProvider};
