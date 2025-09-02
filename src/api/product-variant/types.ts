import type { Product, ProductImage } from '../products/types';
import type { BaseTimeStamp } from '../types';

export type ProductVariant = {
  id: string;
  variant_name: string;
  slug: string;
  sku: string;
  price: string;
  discount: string;
  color: string;
  other_attributes: Record<string, string>;
  images: ProductImage[];
  product: Product;
  stock: Stock;
} & BaseTimeStamp;

export type OtherAttributes = {
  ram: string;
  color: string;
  storage: string;
};

export type Stock = {
  id: string;
  quantity: number;
  reserved: number;
} & BaseTimeStamp;

export type SearchProductResponse = {
  products: Product[];
  variants: ProductVariant[];
};
