/**
 * @file routes.tsx
 * This file defines the application's routing structure using React Router.
 * It maps different paths to their corresponding components.
 */

import React from 'react';
import { Route, Routes } from 'react-router';
import App from './components/App';
import File from './components/File';
import FileUpload from './components/FileUpload';
import FileList from './components/FileList';

/**
 * The `AppRoutes` component defines the routing structure for the application.
 * It maps paths to their respective components using React Router.
 *
 * @component
 * @returns {JSX.Element} - The rendered routing structure.
 *
 * @example
 * ```tsx
 * import React from 'react';
 * import AppRoutes from './routes';
 *
 * const App = () => <AppRoutes />;
 * export default App;
 * ```
 */
const AppRoutes: React.FC = () => (
	<Routes>
		<Route path="/" element={<App />} />
		<Route path="/file/:id" element={<File />} />
		<Route path="/file-upload" element={<FileUpload />} />
		<Route path="/file-list" element={<FileList />} />
	</Routes>
);

export default AppRoutes;