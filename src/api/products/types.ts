import type { BaseTimeStamp } from '../types';

export type Product = {
  id: string;
  name: string;
  description: string;
  product_type: string;
  status: string;
  slug: string;
  seo_title: string;
  seo_description: string;
  category_id: string;
  brand_id: string;
};

export type ProductImage = {
  id: string;
  product_url: string;
  is_main: boolean;
} & BaseTimeStamp;
