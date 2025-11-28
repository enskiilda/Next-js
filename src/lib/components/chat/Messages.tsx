'use client';

import React from 'react';
import { useAppStore } from '@/lib/stores';

interface MessagesProps {
	messages: any[];
	history: any;
	setHistory: (history: any) => void;
	autoScroll: boolean;
	setAutoScroll: (autoScroll: boolean) => void;
	prompt: string;
	setPrompt: (prompt: string) => void;
	selectedModels: string[];
}

const Messages: React.FC<MessagesProps> = ({
	messages,
	history,
	setHistory,
	autoScroll,
	setAutoScroll,
	prompt,
	setPrompt,
	selectedModels
}) => {
	const { user, settings, models, config, WEBUI_NAME } = useAppStore();

	if (messages.length === 0) {
		return null;
	}

	return (
		<div className="flex flex-col gap-4 py-4 px-4 max-w-4xl mx-auto w-full">
			{messages.map((message, idx) => (
				<div
					key={message.id || idx}
					className={`flex gap-4 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
				>
					{/* Avatar */}
					<div className="flex-shrink-0">
						{message.role === 'user' ? (
							<div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
								{user?.name?.charAt(0)?.toUpperCase() || 'U'}
							</div>
						) : (
							<div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
								<img
									src="/static/favicon.png"
									alt="Assistant"
									className="w-6 h-6 rounded-full"
								/>
							</div>
						)}
					</div>

					{/* Message content */}
					<div
						className={`flex-1 max-w-[80%] ${
							message.role === 'user' ? 'text-right' : 'text-left'
						}`}
					>
						<div
							className={`inline-block px-4 py-2 rounded-2xl ${
								message.role === 'user'
									? 'bg-blue-500 text-white'
									: 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
							}`}
						>
							<div className="prose dark:prose-invert prose-sm max-w-none">
								{message.content}
							</div>
						</div>

						{/* Message metadata */}
						<div
							className={`text-xs text-gray-500 mt-1 ${
								message.role === 'user' ? 'text-right' : 'text-left'
							}`}
						>
							{message.role === 'assistant' && message.modelName && (
								<span className="mr-2">{message.modelName}</span>
							)}
							{message.timestamp && (
								<span>
									{new Date(message.timestamp * 1000).toLocaleTimeString([], {
										hour: '2-digit',
										minute: '2-digit'
									})}
								</span>
							)}
						</div>
					</div>
				</div>
			))}
		</div>
	);
};

export default Messages;
