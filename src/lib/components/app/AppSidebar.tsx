'use client';

import React from 'react';

const AppSidebar: React.FC = () => {
	return (
		<div className="w-18 bg-gray-900 h-full flex flex-col items-center py-4">
			<div className="mb-4">
				<img
					src="/static/favicon.png"
					alt="Logo"
					className="w-10 h-10 rounded-full"
				/>
			</div>
		</div>
	);
};

export default AppSidebar;
