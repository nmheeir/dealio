import type { ProductVariant } from '@/api/schemas/product/product-variant.schema';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VariantActionButton } from './variant-action-button';

type VariantItemProps = {
  variant: ProductVariant;
};

// 📦 Responsive layout card giống hình
export function VariantItem({ variant }: VariantItemProps) {
  return (
    <Card className="w-full space-y-0.5">
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex flex-col space-y-2">
          {/* Tiêu đề chính */}
          <CardTitle className="flex items-center space-x-2">
            <span>{variant.variant_name}</span>
            <span className="text-muted-foreground">
              #
              {variant.slug}
            </span>
          </CardTitle>

          <div className="mt-1 flex gap-2">
            {/* Badge status */}
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
              {variant.product.status}
            </Badge>
            {/* Stock status */}
            {variant.stock?.quantity === 0
              ? <Badge variant="destructive">Out of stock</Badge>
              : <Badge variant="destructive">{variant.stock?.quantity}</Badge>}
          </div>
        </div>

        {/* Nút actions */}
        <div className="flex gap-2">
          <VariantActionButton item={variant} />
        </div>
      </CardHeader>

      {/* Nội dung */}
      <CardContent className="grid grid-cols-1 items-center gap-6 md:grid-cols-2">
        {/* Bên trái: Image */}
        <div className="flex justify-center md:justify-start">
          <Image
            className="size-32 shrink-0 rounded-sm object-cover"
            src={variant.images[0]?.product_url ?? '/images/auth-layout.webp'}
            width={128}
            height={128}
            alt={variant.variant_name}
          />
        </div>

        {/* Bên phải: 3 hàng thông tin */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Cost price:</span>
            <span className="font-semibold">{variant.cost_price ?? '0'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Price:</span>
            <span className="font-semibold">{variant.price}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Discount:</span>
            <span className="font-semibold">{variant.discount}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
