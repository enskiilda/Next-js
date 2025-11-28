'use client';

import React, { forwardRef, useState, useRef } from 'react';
import { useAppStore } from '@/lib/stores';

interface MessageInputProps {
	history: any;
	selectedModels: string[];
	files: any[];
	setFiles: (files: any[]) => void;
	prompt: string;
	setPrompt: (prompt: string) => void;
	autoScroll: boolean;
	generating: boolean;
	onSubmit: (text: string) => void;
}

const MessageInput = forwardRef<any, MessageInputProps>(
	({ history, selectedModels, files, setFiles, prompt, setPrompt, autoScroll, generating, onSubmit }, ref) => {
		const textareaRef = useRef<HTMLTextAreaElement>(null);
		const { config, user, settings, models, mobile } = useAppStore();

		const handleKeyDown = (e: React.KeyboardEvent) => {
			if (e.key === 'Enter' && !e.shiftKey) {
				e.preventDefault();
				onSubmit(prompt);
			}
		};

		const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
			setPrompt(e.target.value);
			// Auto-resize textarea
			if (textareaRef.current) {
				textareaRef.current.style.height = 'auto';
				textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
			}
		};

		return (
			<div className="w-full relative">
				<div className="mx-auto max-w-4xl px-2.5 lg:px-0">
					<div className="relative flex flex-col w-full rounded-3xl bg-gray-50 dark:bg-gray-850 border border-gray-100 dark:border-gray-800">
						{files.length > 0 && (
							<div className="px-3 pt-3 flex flex-wrap gap-2">
								{files.map((file, idx) => (
									<div key={idx} className="relative group">
										<div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800">
											<span className="text-sm truncate max-w-32">{file.name}</span>
											<button
												className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
												onClick={() => setFiles(files.filter((_, i) => i !== idx))}
											>
												<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
												</svg>
											</button>
										</div>
									</div>
								))}
							</div>
						)}

						<div className="flex items-end w-full">
							<div className="flex-1 flex items-center">
								<textarea
									ref={textareaRef}
									id="chat-input"
									className="w-full py-3 px-4 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 outline-none resize-none max-h-48 scrollbar-hidden"
									placeholder="Send a message"
									value={prompt}
									onChange={handleInput}
									onKeyDown={handleKeyDown}
									rows={1}
									disabled={generating}
								/>
							</div>

							<div className="flex items-center px-2 pb-2 gap-1">
								<button
									className={`p-2 rounded-full transition-colors ${
										prompt.trim() || files.length > 0
											? 'bg-black dark:bg-white text-white dark:text-black hover:opacity-80'
											: 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
									}`}
									onClick={() => onSubmit(prompt)}
									disabled={!prompt.trim() && files.length === 0}
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
											d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
										/>
									</svg>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
);

MessageInput.displayName = 'MessageInput';

export default MessageInput;
