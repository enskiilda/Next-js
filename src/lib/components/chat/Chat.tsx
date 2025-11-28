'use client';

import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { useAppStore } from '@/lib/stores';
import { WEBUI_BASE_URL } from '@/lib/constants';
import MessageInput from './MessageInput';
import Messages from './Messages';
import Navbar from './Navbar';
import ChatControls from './ChatControls';
import Placeholder from './Placeholder';
import Spinner from '@/lib/components/common/Spinner';

interface ChatProps {
	chatIdProp?: string;
}

const Chat: React.FC<ChatProps> = ({ chatIdProp = '' }) => {
	const [loading, setLoading] = useState(true);
	const [autoScroll, setAutoScroll] = useState(true);
	const [processing, setProcessing] = useState('');
	const [prompt, setPrompt] = useState('');
	const [files, setFiles] = useState<any[]>([]);
	const [selectedModels, setSelectedModels] = useState<string[]>(['']);
	const [generating, setGenerating] = useState(false);
	const [history, setHistory] = useState<any>({
		messages: {},
		currentId: null
	});

	const messagesContainerRef = useRef<HTMLDivElement>(null);
	const messageInputRef = useRef<any>(null);

	const {
		chatId,
		setChatId,
		chatTitle,
		setChatTitle,
		showSidebar,
		WEBUI_NAME,
		config,
		models,
		settings,
		selectedFolder,
		temporaryChatEnabled,
		showControls
	} = useAppStore();

	useEffect(() => {
		setLoading(false);
	}, []);

	const scrollToBottom = (behavior: ScrollBehavior = 'auto') => {
		if (messagesContainerRef.current) {
			messagesContainerRef.current.scrollTo({
				top: messagesContainerRef.current.scrollHeight,
				behavior
			});
		}
	};

	const handleScroll = () => {
		if (messagesContainerRef.current) {
			const { scrollHeight, scrollTop, clientHeight } = messagesContainerRef.current;
			setAutoScroll(scrollHeight - scrollTop <= clientHeight + 5);
		}
	};

	const submitPrompt = async (userPrompt: string) => {
		if (userPrompt === '' && files.length === 0) {
			toast.error('Please enter a prompt');
			return;
		}
		if (selectedModels.includes('')) {
			toast.error('Model not selected');
			return;
		}

		const userMessageId = uuidv4();
		const userMessage = {
			id: userMessageId,
			parentId: history.currentId,
			childrenIds: [],
			role: 'user',
			content: userPrompt,
			files: files.length > 0 ? files : undefined,
			timestamp: Math.floor(Date.now() / 1000),
			models: selectedModels
		};

		const newHistory = { ...history };
		newHistory.messages[userMessageId] = userMessage;
		if (history.currentId) {
			newHistory.messages[history.currentId].childrenIds.push(userMessageId);
		}
		newHistory.currentId = userMessageId;

		setHistory(newHistory);
		setPrompt('');
		setFiles([]);

		// Create assistant response
		const responseMessageId = uuidv4();
		const model = models.find((m) => m.id === selectedModels[0]);
		const responseMessage = {
			id: responseMessageId,
			parentId: userMessageId,
			childrenIds: [],
			role: 'assistant',
			content: 'This is a demo response. The actual API integration would go here.',
			model: model?.id || selectedModels[0],
			modelName: model?.name || selectedModels[0],
			modelIdx: 0,
			timestamp: Math.floor(Date.now() / 1000),
			done: true
		};

		newHistory.messages[responseMessageId] = responseMessage;
		newHistory.messages[userMessageId].childrenIds.push(responseMessageId);
		newHistory.currentId = responseMessageId;

		setHistory({ ...newHistory });

		if (autoScroll) {
			setTimeout(() => scrollToBottom('smooth'), 100);
		}
	};

	const createMessagesList = (history: any, currentId: string | null): any[] => {
		const messages: any[] = [];
		let id = currentId;
		while (id && history.messages[id]) {
			messages.unshift(history.messages[id]);
			id = history.messages[id].parentId;
		}
		return messages;
	};

	const messages = createMessagesList(history, history.currentId);

	return (
		<>
			<title>
				{settings?.showChatTitleInTab !== false && chatTitle
					? `${chatTitle.length > 30 ? `${chatTitle.slice(0, 30)}...` : chatTitle} • ${WEBUI_NAME}`
					: `${WEBUI_NAME}`}
			</title>

			<audio id="audioElement" src="" style={{ display: 'none' }}></audio>

			<div
				className={`h-screen max-h-[100dvh] transition-width duration-200 ease-in-out ${
					showSidebar ? 'md:max-w-[calc(100%-260px)]' : ''
				} w-full max-w-full flex flex-col`}
				id="chat-container"
			>
				{!loading ? (
					<div className="w-full h-full flex flex-col">
						{selectedFolder?.meta?.background_image_url && (
							<>
								<div
									className="absolute top-0 left-0 w-full h-full bg-cover bg-center bg-no-repeat"
									style={{ backgroundImage: `url(${selectedFolder?.meta?.background_image_url})` }}
								/>
								<div className="absolute top-0 left-0 w-full h-full bg-linear-to-t from-white to-white/85 dark:from-gray-900 dark:to-gray-900/90 z-0" />
							</>
						)}

						{settings?.backgroundImageUrl && !selectedFolder?.meta?.background_image_url && (
							<>
								<div
									className="absolute top-0 left-0 w-full h-full bg-cover bg-center bg-no-repeat"
									style={{ backgroundImage: `url(${settings.backgroundImageUrl})` }}
								/>
								<div className="absolute top-0 left-0 w-full h-full bg-linear-to-t from-white to-white/85 dark:from-gray-900 dark:to-gray-900/90 z-0" />
							</>
						)}

						<div className="w-full h-full flex">
							<div className="h-full flex relative max-w-full flex-col flex-1">
								<Navbar
									title={chatTitle}
									selectedModels={selectedModels}
									setSelectedModels={setSelectedModels}
								/>

								<div className="flex flex-col flex-auto z-10 w-full overflow-auto">
									{(settings?.landingPageMode === 'chat' && !selectedFolder) || messages.length > 0 ? (
										<div
											className="pb-2.5 flex flex-col justify-between w-full flex-auto overflow-auto h-0 max-w-full z-10 scrollbar-hidden"
											id="messages-container"
											ref={messagesContainerRef}
											onScroll={handleScroll}
										>
											<div className="h-full w-full flex flex-col">
												<Messages
													messages={messages}
													history={history}
													setHistory={setHistory}
													autoScroll={autoScroll}
													setAutoScroll={setAutoScroll}
													prompt={prompt}
													setPrompt={setPrompt}
													selectedModels={selectedModels}
												/>
											</div>
										</div>
									) : (
										<div className="flex items-center h-full">
											<Placeholder
												history={history}
												selectedModels={selectedModels}
												setSelectedModels={setSelectedModels}
												files={files}
												setFiles={setFiles}
												prompt={prompt}
												setPrompt={setPrompt}
												submitPrompt={submitPrompt}
											/>
										</div>
									)}

									{messages.length > 0 && (
										<div className="pb-2 z-10">
											<MessageInput
												ref={messageInputRef}
												history={history}
												selectedModels={selectedModels}
												files={files}
												setFiles={setFiles}
												prompt={prompt}
												setPrompt={setPrompt}
												autoScroll={autoScroll}
												generating={generating}
												onSubmit={(text: string) => {
													if (text || files.length > 0) {
														submitPrompt(text.replaceAll('\n\n', '\n'));
													}
												}}
											/>

											<div className="absolute bottom-1 text-xs text-gray-500 text-center line-clamp-1 right-0 left-0">
												{/* LLMs can make mistakes. Verify important information. */}
											</div>
										</div>
									)}
								</div>
							</div>

							{showControls && (
								<ChatControls
									history={history}
									chatId={chatId}
								/>
							)}
						</div>
					</div>
				) : (
					<div className="flex items-center justify-center h-full w-full">
						<div className="m-auto">
							<Spinner className="size-5" />
						</div>
					</div>
				)}
			</div>

			<style jsx>{`
				::-webkit-scrollbar {
					height: 0.5rem;
					width: 0.5rem;
				}
			`}</style>
		</>
	);
};

export default Chat;
