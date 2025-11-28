'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';
import { useSearchParams } from 'next/navigation';
import Chat from '@/lib/components/chat/Chat';
import AppLayout from '@/lib/components/layout/AppLayout';

export default function HomePage() {
	const searchParams = useSearchParams();

	useEffect(() => {
		const error = searchParams.get('error');
		if (error) {
			toast.error(error || 'An unknown error occurred.');
		}
	}, [searchParams]);

	return (
		<AppLayout>
			<Chat />
		</AppLayout>
	);
}
