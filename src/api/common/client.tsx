import axios from 'axios';
import { Env } from '@/libs/Env';

export const client = axios.create({
  baseURL: Env.NEXT_PUBLIC_API_URL,
});
