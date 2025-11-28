'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/stores';
import Sidebar from './Sidebar';
import SettingsModal from '@/lib/components/chat/SettingsModal';
import ChangelogModal from '@/lib/components/ChangelogModal';
import AccountPending from './Overlay/AccountPending';
import Spinner from '@/lib/components/common/Spinner';

interface AppLayoutProps {
	children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
	const [loaded, setLoaded] = useState(false);
	const { user, showSettings, setShowSettings, showChangelog, setShowChangelog, showSidebar } = useAppStore();

	useEffect(() => {
		if (user === undefined || user === null) {
			return;
		}
		if (!['user', 'admin'].includes(user?.role)) {
			return;
		}
		setLoaded(true);
	}, [user]);

	if (!user) {
		return null;
	}

	return (
		<>
			<SettingsModal show={showSettings} onClose={() => setShowSettings(false)} />
			<ChangelogModal show={showChangelog} onClose={() => setShowChangelog(false)} />

			<div className="app relative">
				<div className="text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-900 h-screen max-h-[100dvh] overflow-auto flex flex-row justify-end">
					{!['user', 'admin'].includes(user?.role) ? (
						<AccountPending />
					) : (
						<>
							<Sidebar />

							{loaded ? (
								children
							) : (
								<div
									className={`w-full flex-1 h-full flex items-center justify-center ${
										showSidebar ? 'md:max-w-[calc(100%-260px)]' : ''
									}`}
								>
									<Spinner className="size-5" />
								</div>
							)}
						</>
					)}
				</div>
			</div>

			<style jsx>{`
				.loading {
					display: inline-block;
					clip-path: inset(0 1ch 0 0);
					animation: l 1s steps(3) infinite;
					letter-spacing: -0.5px;
				}

				@keyframes l {
					to {
						clip-path: inset(0 -1ch 0 0);
					}
				}

				pre[class*='language-'] {
					position: relative;
					overflow: auto;
					margin: 5px 0;
					padding: 1.75rem 0 1.75rem 1rem;
					border-radius: 10px;
				}

				pre[class*='language-'] button {
					position: absolute;
					top: 5px;
					right: 5px;
					font-size: 0.9rem;
					padding: 0.15rem;
					background-color: #828282;
					border: ridge 1px #7b7b7c;
					border-radius: 5px;
					text-shadow: #c4c4c4 0 0 2px;
				}

				pre[class*='language-'] button:hover {
					cursor: pointer;
					background-color: #bcbabb;
				}
			`}</style>
		</>
	);
};

export default AppLayout;
