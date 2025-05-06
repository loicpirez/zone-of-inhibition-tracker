
import { Link, useLocation } from 'react-router';
import { Navbar as FlowbiteNavbar } from 'flowbite-react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../store/app';
import LanguageSwitcher from './LanguageSwitcher';

/**
 * The `Navbar` component provides a navigation bar for the application.
 * It includes links to different routes and a language switcher.
 *
 * @component
 * @returns {JSX.Element} - The rendered `Navbar` component.
 *
 * @example
 * ```tsx
 * import React from 'react';
 * import Navbar from './Navbar';
 *
 * const App = () => (
 *   <>
 *     <Navbar />
 *     <div>Content goes here</div>
 *   </>
 * );
 * export default App;
 * ```
 */
export default function Navbar() {
	const location = useLocation();
	const { t } = useTranslation();
	const { resetFileId } = useAppStore();


	/**
     * Resets the file ID in the application store when navigating to a new route.
     */
	const handleNavigation = () => {
		resetFileId();
	};

	const routes = [
		{ path: '/', label: t('navbar.home') },
		{ path: '/file-upload', label: t('navbar.file-upload') },
		{ path: '/file-list', label: t('navbar.file-list') },
	];

	return (
		<FlowbiteNavbar fluid className="bg-blue-900 text-white">
			<Link to="/" className="text-white" onClick={handleNavigation}>
				{t('app-name')}
			</Link>
			<FlowbiteNavbar.Toggle />
			<FlowbiteNavbar.Collapse>
				<div className="block py-2 pl-3 pr-4 md:p-0 text-blue-100">
					<LanguageSwitcher />
				</div>

				{routes.map((route) => (
					<FlowbiteNavbar.Link
						key={route.path}
						as={Link}
						to={route.path}
						active={location.pathname === route.path}
						className={`${location.pathname === route.path ? 'active' : ''}`}
						onClick={handleNavigation}
					>
						{route.label}
					</FlowbiteNavbar.Link>
				))}
			</FlowbiteNavbar.Collapse>
		</FlowbiteNavbar>
	);
}
