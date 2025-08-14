import { toast } from 'sonner';
import * as z from 'zod';

import { unknownError } from '@/libs/constants';
import { logger } from './Logger';

export function getErrorMessage(err: unknown) {
  if (err instanceof z.ZodError) {
    return err.issues[0]?.message ?? unknownError;
  } else if (err instanceof Error) {
    return err.message;
  } else {
    return unknownError;
  }
}

export function showErrorToast(err: unknown) {
  const errorMessage = getErrorMessage(err);
  logger.info({ errorMessage });

  return toast.error(errorMessage);
}
