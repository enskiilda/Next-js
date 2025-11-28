'use client';

import React from 'react';
import { useAppStore } from '@/lib/stores';
import { WEBUI_BASE_URL } from '@/lib/constants';

interface NavbarProps {
	title: string;
	selectedModels: string[];
	setSelectedModels: (models: string[]) => void;
}

const Navbar: React.FC<NavbarProps> = ({ title, selectedModels, setSelectedModels }) => {
	const { showSidebar, setShowSidebar, models, user, WEBUI_NAME, temporaryChatEnabled, config } = useAppStore();

	return (
		<nav className="sticky top-0 z-30 w-full py-2.5 px-4 flex items-center justify-between bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-850">
			<div className="flex items-center gap-3">
				{!showSidebar && (
					<button
						className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-850 transition"
						onClick={() => setShowSidebar(true)}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="w-5 h-5"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
							/>
						</svg>
					</button>
				)}

				{/* Model selector */}
				<div className="flex items-center gap-2">
					<select
						className="bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
						value={selectedModels[0] || ''}
						onChange={(e) => setSelectedModels([e.target.value])}
					>
						<option value="">Select a model</option>
						{models.map((model) => (
							<option key={model.id} value={model.id}>
								{model.name}
							</option>
						))}
					</select>
				</div>

				{temporaryChatEnabled && (
					<span className="px-2 py-0.5 text-xs rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300">
						Temporary
					</span>
				)}
			</div>

			<div className="flex items-center gap-2">
				{title && (
					<h1 className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate max-w-xs">
						{title}
					</h1>
				)}
			</div>

			<div className="flex items-center gap-2">
				{/* New chat button */}
				<a
					href="/"
					className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-850 transition"
					title="New Chat"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="w-5 h-5"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
						/>
					</svg>
				</a>
			</div>
		</nav>
	);
};

export default Navbar;
