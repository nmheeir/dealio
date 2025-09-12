import type { ProductVariant } from '@/api/schemas/product/product-variant.schema';
import {
  Building2,
  DollarSign,
  FileText,
  Hash,
  Image as ImageIcon,
  Layers,
  Minus,
  Package,
  Palette,
  Star,
  Tag,
  TrendingDown,
  TrendingUp,
  Warehouse,
} from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/libs/utils';
import { DigitalKeyTable } from '../digital-key/digital-key-table';

type ProductVariantDialogProps = {
  variant: ProductVariant;
  trigger?: React.ReactNode;
};

export function ProductVariantDialog({ variant, trigger }: ProductVariantDialogProps) {
  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(Number.parseFloat(amount));
  };

  const isDigitalProduct = variant.product.product_type === 'CARD_DIGITAL_KEY';

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
  };

  const getStockStatus = (quantity: number, reserved: number) => {
    const available = quantity - reserved;
    if (available <= 0) {
      return { status: 'out-of-stock', color: 'destructive', icon: Minus };
    }
    if (available < 10) {
      return { status: 'low-stock', color: 'destructive', icon: TrendingDown };
    }
    if (available < 50) {
      return { status: 'medium-stock', color: 'secondary', icon: Minus };
    }
    return { status: 'in-stock', color: 'default', icon: TrendingUp };
  };

  const getDiscountPercent = () => {
    const price = Number.parseFloat(variant.price);
    const discount = Number.parseFloat(variant.discount);
    return price > 0 ? Math.round((discount / price) * 100) : 0;
  };

  const mainImage = variant.images.find(img => img.is_main) || variant.images[0];
  const stockInfo = variant.stock ? getStockStatus(variant.stock.quantity, variant.stock.reserved) : null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <div>
            Details
          </div>
        )}
      </DialogTrigger>
      <DialogContent className="flex h-[90vh] flex-col lg:min-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="flex-shrink-0">
              <Avatar className="h-12 w-12 rounded-lg">
                <AvatarImage src={mainImage?.product_url} alt={variant.variant_name} />
                <AvatarFallback className="rounded-lg bg-primary/10">
                  <Package className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-lg leading-tight font-semibold">{variant.variant_name}</div>
              <div className="text-sm font-normal text-muted-foreground">
                SKU:
                {' '}
                {variant.sku}
              </div>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="font-medium">
                {variant.product.status}
              </Badge>
              {variant.stock && (
                <Badge
                  variant={stockInfo?.color as any}
                  className="flex items-center gap-1"
                >
                  <stockInfo.icon className="h-3 w-3" />
                  {variant.stock.quantity - variant.stock.reserved}
                  {' '}
                  có sẵn
                </Badge>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 overflow-y-auto pr-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className={cn(
              'mb-6 grid w-full',
              isDigitalProduct ? 'grid-cols-5' : 'grid-cols-4',
            )}
            >
              <TabsTrigger value="overview">Tổng quan</TabsTrigger>
              <TabsTrigger value="product">Sản phẩm</TabsTrigger>
              <TabsTrigger value="images">Hình ảnh</TabsTrigger>
              <TabsTrigger value="attributes">Thuộc tính</TabsTrigger>
              {isDigitalProduct
                && <TabsTrigger value="digital-key">Digital Keys</TabsTrigger>}
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Price & Discount Section */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Card className="relative overflow-hidden">
                  <CardHeader className="">
                    <CardTitle className="flex items-center gap-2 text-sm font-medium">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      Price
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(variant.price)}
                    </div>
                    {variant.cost_price && (
                      <div className="mt-1 text-sm text-muted-foreground">
                        Cost price:
                        {' '}
                        {formatCurrency(variant.cost_price)}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden">
                  <CardHeader className="">
                    <CardTitle className="flex items-center gap-2 text-sm font-medium">
                      <Tag className="h-4 w-4 text-orange-600" />
                      Discount
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600">
                      {formatCurrency(variant.discount)}
                    </div>
                    {getDiscountPercent() > 0 && (
                      <Badge variant="secondary" className="mt-2">
                        -
                        {getDiscountPercent()}
                        %
                      </Badge>
                    )}
                  </CardContent>
                </Card>

                {variant.stock && (
                  <Card className="relative overflow-hidden">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-sm font-medium">
                        <Warehouse className="h-4 w-4 text-blue-600" />
                        Tồn kho
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-600">
                        {variant.stock.quantity - variant.stock.reserved}
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        Tổng:
                        {' '}
                        {variant.stock.quantity}
                        {' '}
                        | Đã đặt:
                        {' '}
                        {variant.stock.reserved}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Basic Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Hash className="h-5 w-5" />
                    Thông tin cơ bản
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">ID:</span>
                        <span className="font-mono text-sm text-muted-foreground">{variant.id}</span>
                      </div>
                      <div className="flex">
                        <span className="text-sm font-medium">Slug:</span>
                        <span className="text-sm text-muted-foreground">{variant.slug}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">SKU:</span>
                        <span className="font-mono text-sm text-muted-foreground">{variant.sku}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Màu sắc:</span>
                        <div className="flex items-center gap-2">
                          <div
                            className="h-4 w-4 rounded-full border-2 border-gray-200"
                            style={{ backgroundColor: variant.color.toLowerCase() }}
                          />
                          <span className="text-sm text-muted-foreground capitalize">{variant.color}</span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Tạo lúc:</span>
                        <span className="text-sm text-muted-foreground">{formatDate(variant.createdAt)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Cập nhật:</span>
                        <span className="text-sm text-muted-foreground">{formatDate(variant.updatedAt)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="product" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Thông tin sản phẩm
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="mb-2 text-lg font-semibold">{variant.product.name}</h3>
                    <p className="mb-4 text-muted-foreground">{variant.product.description}</p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Layers className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium">Danh mục:</span>
                        {/* <Badge variant="secondary">Category Name</Badge> */}
                      </div>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-purple-500" />
                        <span className="text-sm font-medium">Thương hiệu:</span>
                        {/* <Badge variant="outline">{variant.product.brand.name}</Badge> */}
                      </div>
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium">Loại:</span>
                        {/* <Badge variant="secondary">{variant.product.product_type}</Badge> */}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium">SEO Title:</span>
                        {/* <p className="mt-1 text-sm text-muted-foreground">{variant.product.seo_title}</p> */}
                      </div>
                      <div>
                        <span className="text-sm font-medium">SEO Description:</span>
                        {/* <p className="mt-1 text-sm text-muted-foreground">{variant.product.seo_description}</p> */}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">Product ID:</span>
                      <span className="font-mono text-muted-foreground">{variant.product.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Slug:</span>
                      <span className="text-muted-foreground">{variant.product.slug}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="images" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    Hình ảnh sản phẩm (
                    {variant.images.length}
                    )
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {variant.images.map((image, index) => (
                      <div key={image.id} className="group relative">
                        <div className="aspect-square overflow-hidden rounded-lg border-2 border-border">
                          <Image
                            src={image.product_url}
                            alt={`Product ${index + 1}`}
                            width={64}
                            height={64}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                        {image.is_main && (
                          <Badge className="absolute -top-2 -right-2 flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            Main
                          </Badge>
                        )}
                        <div className="absolute right-2 bottom-2 left-2 rounded bg-black/80 px-2 py-1 opacity-0 transition-opacity group-hover:opacity-100">
                          <p className="truncate text-xs text-white">
                            ID:
                            {image.id}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {variant.images.length === 0 && (
                    <div className="py-12 text-center text-muted-foreground">
                      <ImageIcon className="mx-auto mb-4 h-12 w-12 opacity-50" />
                      <p>Chưa có hình ảnh nào</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="attributes" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Thuộc tính khác
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {Object.entries(variant.other_attributes).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                        <span className="font-medium capitalize">
                          {key.replace('_', ' ')}
                          :
                        </span>
                        <Badge variant="outline" className="ml-2">
                          {value}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  {Object.keys(variant.other_attributes).length === 0 && (
                    <div className="py-8 text-center text-muted-foreground">
                      <FileText className="mx-auto mb-2 h-8 w-8 opacity-50" />
                      <p>Không có thuộc tính bổ sung</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {variant.stock && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Warehouse className="h-5 w-5" />
                      Thông tin kho hàng
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <div className="rounded-lg bg-blue-50 p-4 text-center dark:bg-blue-950/20">
                        <div className="text-2xl font-bold text-blue-600">{variant.stock.quantity}</div>
                        <div className="text-sm text-muted-foreground">Tổng số lượng</div>
                      </div>
                      <div className="rounded-lg bg-orange-50 p-4 text-center dark:bg-orange-950/20">
                        <div className="text-2xl font-bold text-orange-600">{variant.stock.reserved}</div>
                        <div className="text-sm text-muted-foreground">Đã đặt trước</div>
                      </div>
                      <div className="rounded-lg bg-green-50 p-4 text-center dark:bg-green-950/20">
                        <div className="text-2xl font-bold text-green-600">
                          {variant.stock.quantity - variant.stock.reserved}
                        </div>
                        <div className="text-sm text-muted-foreground">Có sẵn</div>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">Stock ID:</span>
                        <span className="font-mono text-muted-foreground">{variant.stock.id}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">Cập nhật:</span>
                        <span className="text-muted-foreground">{formatDate(variant.stock.updatedAt)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {isDigitalProduct
              && (
                <TabsContent value="digital-key" className="space-y-6">
                  <DigitalKeyTable variantId={variant.id} />
                </TabsContent>
              )}
          </Tabs>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
