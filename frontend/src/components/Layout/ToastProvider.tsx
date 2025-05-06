/**
 * @file ToastProvider.tsx
 * This file defines the `ToastProvider` component, which provides a container for displaying toast notifications.
 * It uses `react-toastify` for managing notifications with a sliding transition.
 */

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Slide } from 'react-toastify';

/**
 * The `ToastProvider` component provides a container for displaying toast notifications.
 * It uses a sliding transition for showing and hiding notifications.
 *
 * @component
 * @returns {JSX.Element} - The rendered `ToastProvider` component.
 *
 * @example
 * ```tsx
 * import React from 'react';
 * import { ToastProvider } from './ToastProvider';
 *
 * const App = () => (
 *   <>
 *     <ToastProvider />
 *     <div>Content goes here</div>
 *   </>
 * );
 * export default App;
 * ```
 */
export const ToastProvider = () => <ToastContainer transition={Slide} />;
