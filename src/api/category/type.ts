import type { BaseTimeStamp } from '../types';

export type Category = {
  id: string;
  name: string;
  description: string;
  slug: string;
  seo_title: string;
  seo_description: string;
  children: Children[];
} & BaseTimeStamp;

export type Children = {
  id: string;
  name: string;
  description: string;
  slug: string;
  seo_title: string;
  seo_description: string;
} & BaseTimeStamp;
