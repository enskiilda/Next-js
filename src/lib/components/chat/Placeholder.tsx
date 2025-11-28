'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/stores';
import MessageInput from './MessageInput';

interface PlaceholderProps {
	history: any;
	selectedModels: string[];
	setSelectedModels: (models: string[]) => void;
	files: any[];
	setFiles: (files: any[]) => void;
	prompt: string;
	setPrompt: (prompt: string) => void;
	submitPrompt: (prompt: string) => void;
}

const Placeholder: React.FC<PlaceholderProps> = ({
	history,
	selectedModels,
	setSelectedModels,
	files,
	setFiles,
	prompt,
	setPrompt,
	submitPrompt
}) => {
	const { config, user, settings, models, WEBUI_NAME } = useAppStore();

	const suggestions = config?.default_prompt_suggestions || [
		{ content: 'Help me study', title: ['Help me study', 'vocabulary for a college entrance exam'] },
		{ content: 'Give me ideas', title: ['Give me ideas', 'for what to do with my kids art'] },
		{ content: 'Tell me a fun fact', title: ['Tell me a fun fact', 'about the Roman Empire'] },
		{ content: 'Show me a code snippet', title: ['Show me a code snippet', 'of a website sticky header'] }
	];

	const handleSuggestionClick = (suggestion: any) => {
		setPrompt(suggestion.content);
	};

	return (
		<div className="w-full h-full flex flex-col items-center justify-center px-4">
			<div className="max-w-3xl w-full">
				{/* Logo and welcome message */}
				<div className="text-center mb-8">
					<div className="mb-4 flex justify-center">
						<img
							src="/static/favicon.png"
							alt={WEBUI_NAME}
							className="w-16 h-16 rounded-full"
						/>
					</div>
					<h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
						{WEBUI_NAME}
					</h1>
					<p className="text-gray-500 dark:text-gray-400">
						How can I help you today?
					</p>
				</div>

				{/* Model selector */}
				<div className="flex justify-center mb-6">
					<select
						className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
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

				{/* Suggestions grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
					{suggestions.map((suggestion, idx) => (
						<button
							key={idx}
							className="text-left p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors"
							onClick={() => handleSuggestionClick(suggestion)}
						>
							<div className="text-sm font-medium text-gray-900 dark:text-white">
								{suggestion.title[0]}
							</div>
							<div className="text-xs text-gray-500 dark:text-gray-400">
								{suggestion.title[1]}
							</div>
						</button>
					))}
				</div>

				{/* Message input */}
				<MessageInput
					history={history}
					selectedModels={selectedModels}
					files={files}
					setFiles={setFiles}
					prompt={prompt}
					setPrompt={setPrompt}
					autoScroll={true}
					generating={false}
					onSubmit={(text) => {
						if (text || files.length > 0) {
							submitPrompt(text.replaceAll('\n\n', '\n'));
						}
					}}
				/>
			</div>
		</div>
	);
};

export default Placeholder;
