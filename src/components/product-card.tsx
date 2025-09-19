import type { Product } from '@/api/schemas/product/product.schema';
import Image from 'next/image';
import Link from 'next/link';
import { ProductType } from '@/api/schemas/product/product.schema';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  // Hàm cắt ngắn description
  const truncateDescription = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) {
      return text;
    }
    return `${text.slice(0, maxLength)}...`;
  };

  return (
    <Card className="mx-auto flex h-full w-full max-w-sm flex-col py-0 pb-6 transition-shadow hover:shadow-lg">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          {product.image
            ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="rounded-t-lg object-cover"
                  sizes="(max-width: 768px) 100vw, 300px"
                />
              )
            : (
                <div className="flex h-full w-full items-center justify-center rounded-t-lg bg-gray-200">
                  <span className="text-gray-500">No Image</span>
                </div>
              )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-grow flex-col px-4">
        <CardTitle className="line-clamp-2 text-lg font-semibold">{product.name}</CardTitle>
        <p className="mt-2 line-clamp-3 min-h-[60px] text-sm text-gray-600">
          {truncateDescription(product.description)}
        </p>
        <div className="mt-2">
          <Badge
            variant={getProductTypeStyle(product.product_type).variant}
            className={getProductTypeStyle(product.product_type).className}
          >
            {product.product_type}
          </Badge>
        </div>
        <p className="mt-2 text-lg font-bold text-gray-900">
          {product.price ? `$${product.price.toFixed(2)}` : 'Price not available'}
        </p>
      </CardContent>
      <CardFooter className="pt-0">
        <Link href={`/product/${product.slug}`} className="w-full">
          <Button variant="outline" className="w-full">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
// Map màu cho từng loại product
const productTypeStyles: Record<ProductType, { variant?: 'default' | 'secondary' | 'destructive' | 'outline'; className?: string }> = {
  [ProductType.CARD_PHYSICAL]: { variant: 'secondary', className: 'bg-blue-100 text-blue-800' },
  [ProductType.CARD_DIGITAL_KEY]: { variant: 'secondary', className: 'bg-green-100 text-green-800' },
  [ProductType.DEVICE]: { variant: 'secondary', className: 'bg-purple-100 text-purple-800' },
};

// Hàm tiện dụng
function getProductTypeStyle(type: ProductType) {
  return productTypeStyles[type] || { variant: 'secondary' };
}
