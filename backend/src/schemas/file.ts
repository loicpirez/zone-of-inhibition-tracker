import { z } from 'zod';
import { ERROR_MESSAGES } from '../constants/error-messages';

export const fileIdSchema = z.string().uuid({ message: ERROR_MESSAGES.INVALID_UUID.message });