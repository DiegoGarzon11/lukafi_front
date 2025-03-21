import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

export function Toast({ visibility, severity, message }: { visibility: boolean; severity: string; message: string }) {
	const btn = useRef(null);
	const { toast,  } = useToast();
	const severityToVariant = {
		information: 'information',
		warning: 'warning',
		error: 'error',
		success: 'success',
	};
	useEffect(() => {
		if (visibility) {
			btn.current.click();
		}
	}, [visibility]);

	return (
		<Button
			ref={btn}
			className='hidden '
			variant='outline'
			onClick={() => {
				toast({
					title: message,
					duration: 2000,
					variant: severityToVariant[severity],
				});
			}}>
			{message}
		</Button>
	);
}
