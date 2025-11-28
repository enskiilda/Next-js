'use client';

import React from 'react';
import { useAppStore } from '@/lib/stores';

const AccountPending: React.FC = () => {
	const { config } = useAppStore();

	return (
		<div className="w-full h-full flex items-center justify-center">
			<div className="text-center max-w-md px-4">
				<div className="mb-4">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="w-16 h-16 mx-auto text-yellow-500"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
						/>
					</svg>
				</div>
				<h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
					{config?.ui?.pending_user_overlay_title || 'Account Pending'}
				</h2>
				<p className="text-gray-600 dark:text-gray-400">
					{config?.ui?.pending_user_overlay_description ||
						'Your account is pending approval. Please contact an administrator for access.'}
				</p>
			</div>
		</div>
	);
};

export default AccountPending;
