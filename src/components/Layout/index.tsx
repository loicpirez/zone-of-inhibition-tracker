/**
 * @file index.tsx
 * This file defines the `Layout` component, which provides a consistent structure for the application.
 * It includes a `Navbar`, a main content area, and a `ToastProvider` for notifications.
 */

import React, { ReactNode } from 'react';
import Navbar from '../Navbar';
import { ToastProvider } from './ToastProvider';

interface LayoutProps {
	/** The child components to be rendered inside the layout. */
	children: ReactNode;
}

/**
 * The `Layout` component provides a consistent structure for the application.
 * It includes a `Navbar`, a main content area, and a `ToastProvider` for notifications.
 *
 * @component
 * @param {LayoutProps} props - The props for the `Layout` component.
 * @returns {JSX.Element} - The rendered `Layout` component.
 *
 * @example
 * ```tsx
 * import React from 'react';
 * import Layout from './Layout';
 *
 * const App = () => (
 *   <Layout>
 *     <div>Content goes here</div>
 *   </Layout>
 * );
 * export default App;
 * ```
 */
const Layout: React.FC<LayoutProps> = ({ children }) => {
	return (
		<div className="flex flex-col min-h-screen bg-gray-100">
			<Navbar />
			<main className="flex flex-col flex-grow">{children}</main>
			<ToastProvider />
		</div>
	);
};

export default Layout;
