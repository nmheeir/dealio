'use client';

import type { Product } from '@/api/products/types';
import { useProducts } from '@/api/products/use-products';

export default function ProductList() {
  const { data, isLoading, isError } = useProducts();

  if (isLoading) {
    return <div>Loading products...</div>;
  }

  if (isError) {
    return <div>Failed to load products.</div>;
  }

  if (!data || data.length === 0) {
    return <div>No products found.</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {data.map((product: Product) => (
        <div
          key={product.id}
          className="rounded-lg border p-4 shadow-sm transition hover:shadow-md"
        >
          <h2 className="text-lg font-semibold">{product.name}</h2>
          <p className="mb-2 text-sm text-gray-500">{product.description}</p>

          <div className="mt-2 flex flex-col text-xs text-gray-600">
            <span>
              Type:
              {product.product_type}
            </span>
            <span>
              Status:
              {product.status}
            </span>
            <span>
              Category:
              {product.category_id}
            </span>
            <span>
              Brand:
              {product.brand_id}
            </span>
          </div>

          <div className="mt-3 text-sm text-blue-600 underline">
            <a href={`/products/${product.slug}`}>View details</a>
          </div>
        </div>
      ))}
    </div>
  );
}
