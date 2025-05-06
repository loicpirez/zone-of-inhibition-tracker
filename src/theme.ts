/**
 * @file theme.ts
 * This file defines a custom theme configuration for the `flowbite-react` library.
 * It customizes the appearance of components such as buttons and the navbar.
 */

import type { CustomFlowbiteTheme } from 'flowbite-react';

/**
 * Custom theme configuration for `flowbite-react`.
 *
 * @constant
 * @type {CustomFlowbiteTheme}
 * @property {Object} button - Custom styles for buttons.
 * @property {Object} navbar - Custom styles for the navbar.
 */
const theme: CustomFlowbiteTheme = {
	button: {
		color: {
			primary: 'text-white bg-blue-800 hover:bg-blue-900',
		},
	},
	navbar: {
		link: {
			active: {
				on: 'text-white underline',
				off: 'text-blue-100',
			},
		},
	},
};

export default theme;