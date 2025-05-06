/**
 * @file toast.ts
 * This file defines a utility function for displaying toast notifications using `react-toastify`.
 */

import { toast } from 'react-toastify';

/**
 * Displays a toast notification with the specified message, type, and position.
 *
 * @function showToast
 * @param {string} message - The message to display in the toast notification.
 * @param {'success' | 'error' | 'info' | 'warning'} [type='info'] - The type of the toast notification.
 * @param {'top-right' | 'top-center' | 'top-left' | 'bottom-right' | 'bottom-center' | 'bottom-left'} [position='bottom-left'] - The position of the toast notification on the screen.
 *
 * @example
 * ```typescript
 * import { showToast } from './toast';
 *
 * showToast('Operation successful', 'success', 'top-right');
 * ```
 */
export const showToast = (
	message: string,
	type: 'success' | 'error' | 'info' | 'warning' = 'info',
	position:
		| 'top-right'
		| 'top-center'
		| 'top-left'
		| 'bottom-right'
		| 'bottom-center'
		| 'bottom-left' = 'bottom-left'
) => {
	toast(message, {
		type,
		position,
		autoClose: 2000,
		className: 'text-sm font-serif',
	});
};
