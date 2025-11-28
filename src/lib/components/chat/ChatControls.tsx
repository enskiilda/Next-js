'use client';

import React from 'react';

interface ChatControlsProps {
	history: any;
	chatId: string;
}

const ChatControls: React.FC<ChatControlsProps> = ({ history, chatId }) => {
	return (
		<div className="w-80 h-full bg-gray-50 dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 p-4">
			<h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Chat Controls</h3>
			<div className="text-sm text-gray-500">
				Controls panel for chat settings and options.
			</div>
		</div>
	);
};

export default ChatControls;
