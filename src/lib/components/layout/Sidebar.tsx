'use client';

import React from 'react';
import { useAppStore } from '@/lib/stores';
import { WEBUI_BASE_URL } from '@/lib/constants';

const Sidebar: React.FC = () => {
	const { showSidebar, setShowSidebar, user, WEBUI_NAME, mobile, config } = useAppStore();

	if (!showSidebar && !mobile) {
		return (
			<div
				className="pt-[7px] pb-2 px-1.5 flex flex-col justify-between text-black dark:text-white hover:bg-gray-50/30 dark:hover:bg-gray-950/30 h-full z-10 transition-all border-e-[0.5px] border-gray-50 dark:border-gray-850"
				id="sidebar"
			>
				<button
					className="flex flex-col flex-1 cursor-pointer"
					onClick={() => setShowSidebar(!showSidebar)}
				>
					<div className="pb-1.5">
						<div
							className="flex rounded-xl hover:bg-gray-100 dark:hover:bg-gray-850 transition group"
							title={showSidebar ? 'Close Sidebar' : 'Open Sidebar'}
						>
							<div className="self-center flex items-center justify-center size-9">
								<img
									src={`${WEBUI_BASE_URL}/static/favicon.png`}
									className="sidebar-new-chat-icon size-6 rounded-full"
									alt=""
								/>
							</div>
						</div>
					</div>
				</button>

				<div>
					{user && (
						<div className="py-0.5">
							<div className="cursor-pointer flex rounded-xl hover:bg-gray-100 dark:hover:bg-gray-850 transition group">
								<div className="self-center flex items-center justify-center size-9">
									<img
										src={`/api/v1/users/${user?.id}/profile/image`}
										className="size-6 object-cover rounded-full"
										alt="User Profile"
									/>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		);
	}

	if (!showSidebar) {
		return null;
	}

	return (
		<>
			{mobile && (
				<div
					className="fixed md:hidden z-40 top-0 right-0 left-0 bottom-0 bg-black/60 w-full min-h-screen h-screen flex justify-center overflow-hidden overscroll-contain"
					onMouseDown={() => setShowSidebar(false)}
				/>
			)}

			<div
				id="sidebar"
				className={`h-screen max-h-[100dvh] min-h-screen select-none ${
					showSidebar
						? `${mobile ? 'bg-gray-50 dark:bg-gray-950' : 'bg-gray-50/70 dark:bg-gray-950/70'} z-50`
						: 'bg-transparent z-0'
				} transition-all duration-300 shrink-0 text-gray-900 dark:text-gray-200 text-sm fixed top-0 left-0 overflow-x-hidden`}
			>
				<div
					className={`my-auto flex flex-col justify-between h-screen max-h-[100dvh] w-[260px] overflow-x-hidden scrollbar-hidden z-50 ${
						showSidebar ? '' : 'invisible'
					}`}
				>
					<div className="sidebar px-2 pt-2 pb-1.5 flex justify-between space-x-1 text-gray-600 dark:text-gray-400 sticky top-0 z-10 -mb-3">
						<a
							className="flex items-center rounded-xl size-8.5 h-full justify-center hover:bg-gray-100/50 dark:hover:bg-gray-850/50 transition no-drag-region"
							href="/"
							draggable="false"
						>
							<img
								crossOrigin="anonymous"
								src={`${WEBUI_BASE_URL}/static/favicon.png`}
								className="sidebar-new-chat-icon size-6 rounded-full"
								alt=""
							/>
						</a>

						<a href="/" className="flex flex-1 px-1.5">
							<div
								id="sidebar-webui-name"
								className="self-center font-medium text-gray-850 dark:text-white font-primary"
							>
								{WEBUI_NAME}
							</div>
						</a>

						<button
							className="flex rounded-xl size-8.5 justify-center items-center hover:bg-gray-100/50 dark:hover:bg-gray-850/50 transition cursor-pointer"
							onClick={() => setShowSidebar(!showSidebar)}
							title={showSidebar ? 'Close Sidebar' : 'Open Sidebar'}
						>
							<div className="self-center p-1.5">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={1.5}
									stroke="currentColor"
									className="size-5"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
									/>
								</svg>
							</div>
						</button>
					</div>

					<div className="relative flex flex-col flex-1 overflow-y-auto scrollbar-hidden pt-3 pb-3">
						<div className="pb-1.5">
							<div className="px-1.5 flex justify-center text-gray-800 dark:text-gray-200">
								<a
									id="sidebar-new-chat-button"
									className="group grow flex items-center space-x-3 rounded-2xl px-2.5 py-2 hover:bg-gray-100 dark:hover:bg-gray-900 transition outline-none"
									href="/"
									draggable="false"
								>
									<div className="self-center">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth={2}
											stroke="currentColor"
											className="size-4.5"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
											/>
										</svg>
									</div>

									<div className="flex flex-1 self-center translate-y-[0.5px]">
										<div className="self-center text-sm font-primary">New Chat</div>
									</div>
								</a>
							</div>

							<div className="px-1.5 flex justify-center text-gray-800 dark:text-gray-200">
								<button
									id="sidebar-search-button"
									className="group grow flex items-center space-x-3 rounded-2xl px-2.5 py-2 hover:bg-gray-100 dark:hover:bg-gray-900 transition outline-none"
									draggable="false"
								>
									<div className="self-center">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth={2}
											stroke="currentColor"
											className="size-4.5"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
											/>
										</svg>
									</div>

									<div className="flex flex-1 self-center translate-y-[0.5px]">
										<div className="self-center text-sm font-primary">Search</div>
									</div>
								</button>
							</div>

							{user?.role === 'admin' && (
								<div className="px-1.5 flex justify-center text-gray-800 dark:text-gray-200">
									<a
										id="sidebar-workspace-button"
										className="grow flex items-center space-x-3 rounded-2xl px-2.5 py-2 hover:bg-gray-100 dark:hover:bg-gray-900 transition"
										href="/workspace"
										draggable="false"
									>
										<div className="self-center">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												strokeWidth={2}
												stroke="currentColor"
												className="size-4.5"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v2.25A2.25 2.25 0 0 0 6 10.5Zm0 9.75h2.25A2.25 2.25 0 0 0 10.5 18v-2.25a2.25 2.25 0 0 0-2.25-2.25H6a2.25 2.25 0 0 0-2.25 2.25V18A2.25 2.25 0 0 0 6 20.25Zm9.75-9.75H18a2.25 2.25 0 0 0 2.25-2.25V6A2.25 2.25 0 0 0 18 3.75h-2.25A2.25 2.25 0 0 0 13.5 6v2.25a2.25 2.25 0 0 0 2.25 2.25Z"
												/>
											</svg>
										</div>

										<div className="flex self-center translate-y-[0.5px]">
											<div className="self-center text-sm font-primary">Workspace</div>
										</div>
									</a>
								</div>
							)}
						</div>

						{/* Chats section */}
						<div className="flex-1 flex flex-col overflow-y-auto scrollbar-hidden">
							<div className="pt-1.5 px-2">
								<div className="text-xs text-gray-500 dark:text-gray-500 font-medium pb-1.5">
									Chats
								</div>
							</div>
						</div>
					</div>

					<div className="px-1.5 pt-1.5 pb-2 sticky bottom-0 z-10 -mt-3 sidebar">
						<div className="flex flex-col font-primary">
							{user && (
								<div className="flex items-center rounded-2xl py-2 px-1.5 w-full hover:bg-gray-100/50 dark:hover:bg-gray-900/50 transition">
									<div className="self-center mr-3">
										<img
											src={`/api/v1/users/${user?.id}/profile/image`}
											className="size-6 object-cover rounded-full"
											alt="User Profile"
										/>
									</div>
									<div className="self-center font-medium">{user?.name}</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Sidebar;
