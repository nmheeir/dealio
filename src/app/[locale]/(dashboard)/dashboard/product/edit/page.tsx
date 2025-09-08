import type { ProductVariant } from '@/api/schemas/product/product-variant.schema';
import ProductForm from '@/components/dashboard/product/edit';
import { data } from '../../data';

export default function Page() {
  return (
    <ProductForm data={data[0] as ProductVariant} />
  );
}
