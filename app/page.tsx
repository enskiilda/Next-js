'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { useAppContext } from './providers';

function Spinner({ className }: { className?: string }) {
	return (
		<svg
			className={`animate-spin ${className || 'size-5'}`}
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
		>
			<circle
				className="opacity-25"
				cx="12"
				cy="12"
				r="10"
				stroke="currentColor"
				strokeWidth="4"
			></circle>
			<path
				className="opacity-75"
				fill="currentColor"
				d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
			></path>
		</svg>
	);
}

export default function Home() {
	const searchParams = useSearchParams();
	const { state } = useAppContext();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const error = searchParams.get('error');
		if (error) {
			toast.error(error || 'An unknown error occurred.');
		}
		setLoading(false);
	}, [searchParams]);

	if (loading || !state.loaded) {
		return (
			<div className="flex items-center justify-center h-screen w-full">
				<div className="m-auto">
					<Spinner className="size-5" />
				</div>
			</div>
		);
	}

	return (
		<div className="h-screen max-h-[100dvh] w-full max-w-full flex flex-col" id="chat-container">
			<div className="w-full h-full flex flex-col">
				<div className="flex flex-col flex-auto z-10 w-full overflow-auto">
					<div className="flex items-center h-full">
						<div className="w-full px-4 md:px-0 md:max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto">
							<div className="flex flex-col items-center justify-center h-full">
								<div className="mb-4">
									<img
										src="/static/favicon.png"
										alt="Open WebUI"
										className="w-16 h-16"
									/>
								</div>
								<h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
									{state.webuiName}
								</h1>
								<p className="text-gray-600 dark:text-gray-400 text-center mb-8">
									How can I help you today?
								</p>

								{state.config?.default_prompt_suggestions && (
									<div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
										{state.config.default_prompt_suggestions.map((suggestion: any, index: number) => (
											<button
												key={index}
												className="flex flex-col items-start p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
											>
												<span className="font-medium text-gray-800 dark:text-white">
													{suggestion.title[0]}
												</span>
												<span className="text-sm text-gray-500 dark:text-gray-400">
													{suggestion.title[1]}
												</span>
											</button>
										))}
									</div>
								)}

								<div className="w-full max-w-2xl mt-8">
									<div className="relative">
										<textarea
											id="chat-input"
											className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
											placeholder="Send a message..."
											rows={1}
										/>
										<button
											className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												strokeWidth={2}
												stroke="currentColor"
												className="w-5 h-5"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18"
												/>
											</svg>
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
