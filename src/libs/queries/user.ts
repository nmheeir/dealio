import { cache } from 'react';

export const getCachedUser = cache(() => 'test_user');
