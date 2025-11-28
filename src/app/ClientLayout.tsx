'use client';

import { useEffect, useState } from 'react';
import { Toaster } from 'sonner';
import dynamic from 'next/dynamic';
import '@/tailwind.css';
import '@/app.css';

const AppContent = dynamic(() => import('./AppContent'), { ssr: false });

export default function ClientLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return (
			<div className="h-screen w-screen flex items-center justify-center bg-white dark:bg-gray-900">
				<div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
			</div>
		);
	}

	return (
		<>
			<AppContent>{children}</AppContent>
			<Toaster richColors position="top-center" />
		</>
	);
}
