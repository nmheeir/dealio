/* eslint-disable no-console */
'use client';

import type { ProductVariant } from '@/api/schemas/product/product-variant.schema';
import { useQueryClient } from '@tanstack/react-query';
import { notFound } from 'next/navigation';
import { useQueryState } from 'nuqs';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useAddresses } from '@/api/address/use-addressed';
import { useAddVariantToCart } from '@/api/cart/use-add-variant';
import { useDigitalBuyNow } from '@/api/order/digital/use-digital-buy-now';
import { useBuyNowPhysical } from '@/api/order/physical/use-physical-buy-now';
import { usePaymentGetLinkByOrderId } from '@/api/payment/use-payment-get-link';
import { useFindVariantsByProductSlug } from '@/api/product-variant/use-find-variant-by-product-slug';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Icons } from '@/components/icons';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import ProductDetailLoading from '../loading/product-detail-loading';
import { ProductDetailImages } from './product-images';
import ProductTitle from './product-title';

type ProductDetailProps = {
  slug: string;
};

function makeBreadcrumbs(variant: ProductVariant) {
  return [
    { name: 'Home', href: '/' },
    { name: variant.product.name, href: `/product/${variant.product.slug}` },
    { name: variant.variant_name, href: '' },
  ];
}

function getAvailableStock(variant: ProductVariant): number {
  if (!variant.stock) {
    return 0;
  }
  return Math.max(0, variant.stock.quantity - variant.stock.reserved);
}

// Cập nhật BuyNowButton để nhận quantity prop
function BuyNowButton({ variant, quantity }: { variant: ProductVariant; quantity: number }) {
  const productType = variant.product?.product_type;
  const isDigital = productType === 'CARD_DIGITAL_KEY';
  console.log(productType);

  const { data: addressesResponse, isLoading: isAddrLoading } = useAddresses();
  const { mutateAsync: digitalBuyNow } = useDigitalBuyNow();
  const { mutateAsync: physicalBuyNow } = useBuyNowPhysical();
  const { mutateAsync: paymentGetLink } = usePaymentGetLinkByOrderId();
  const queryClient = useQueryClient();

  const [openMethodDialog, setOpenMethodDialog] = useState(false);
  const [openAddressDialog, setOpenAddressDialog] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'COD' | 'MOMO_WALLET'>('COD');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const productActive = variant.product?.status === 'ACTIVE';
  const inStock = getAvailableStock(variant) > 0;
  const addresses = addressesResponse?.data.data ?? [];

  async function handleDigitalBuyNow() {
    if (!productActive) {
      toast.error('Sản phẩm hiện không hoạt động.');
      return;
    }
    if (!inStock) {
      toast.error('Sản phẩm đã hết hàng.');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      productVariantId: variant.id,
      quantity: 1, // Digital luôn chỉ 1
      paymentMethod: 'MOMO_PAYMENT',
    };

    await digitalBuyNow(payload, {
      onSuccess: (res) => {
        if (res?.statusCode === 201 && res?.data?.orderId) {
          const orderId = res.data.orderId;

          // Sau khi tạo order thành công → gọi API lấy link thanh toán
          paymentGetLink(
            { orderId },
            {
              onSuccess: (payRes) => {
                if (payRes?.data?.paymentUrl) {
                  window.open(payRes.data.paymentUrl, '_blank');
                  toast.success('Chuyển đến cổng thanh toán...');
                } else {
                  toast.error('Không lấy được link thanh toán.');
                }
                queryClient.invalidateQueries({ queryKey: ['orders'] });
              },
              onError: (err: any) => {
                const msg = (err.response?.data as any)?.message || 'Lấy link thanh toán thất bại.';
                toast.error(msg);
              },
              onSettled: () => setIsSubmitting(false),
            },
          );
        } else {
          toast.error(res?.message || 'Không thể tạo đơn cho sản phẩm digital.');
          setIsSubmitting(false);
        }
      },
      onError: (err: any) => {
        console.error('Digital buy now error', err);
        const msg = (err.response?.data as any)?.message || 'Đặt mua thất bại.';
        toast.error(msg);
        setIsSubmitting(false);
      },
    });
  }

  async function handlePhysicalFlowStart() {
    if (!productActive) {
      toast.error('Sản phẩm hiện không hoạt động.');
      return;
    }
    if (!inStock) {
      toast.error('Sản phẩm đã hết hàng.');
      return;
    }
    setOpenMethodDialog(true);
  }

  async function handleConfirmPhysicalBuyNow() {
    if (!selectedAddressId) {
      toast.error('Vui lòng chọn địa chỉ giao hàng.');
      return;
    }
    setIsSubmitting(true);
    const payload: any = {
      productVariantId: variant.id,
      quantity,
      addressId: selectedAddressId,
      paymentMethod: selectedPaymentMethod === 'COD' ? 'COD' : 'MOMO_WALLET',
    };
    await physicalBuyNow(payload, {
      onSuccess: (res) => {
        if (res?.statusCode === 201 && res?.data?.id) {
          const orderId = res.data.id;

          if (selectedPaymentMethod === 'MOMO_WALLET') {
          // Gọi thêm API để lấy link thanh toán
            paymentGetLink(
              { orderId },
              {
                onSuccess: (payRes) => {
                  if (payRes?.data?.payUrl) {
                    window.open(payRes.data.payUrl, '_blank');
                    toast.success('Chuyển đến cổng thanh toán...');
                  } else {
                    toast.error('Không lấy được link thanh toán.');
                  }
                },
                onError: (err) => {
                  const msg = (err.response?.data as any)?.message || 'Lấy link thanh toán thất bại.';
                  toast.error(msg);
                },
              },
            );
          } else {
            toast.success('Đơn hàng COD đã được tạo.');
          }
        } else {
          toast.error(res?.message || 'Không thể tạo đơn hàng.');
        }

        queryClient.invalidateQueries({ queryKey: ['orders'] });
        setOpenAddressDialog(false);
        setOpenMethodDialog(false);
      },
      onError: (err: any) => {
        const msg = (err.response?.data as any)?.message || 'Đặt mua thất bại.';
        toast.error(msg);
      },
    });
  }

  if (isDigital) {
    return (
      <Button
        className="rounded-full bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        onClick={handleDigitalBuyNow}
        disabled={!productActive || !inStock || isSubmitting}
        aria-label="Mua ngay"
      >
        Mua ngay
      </Button>
    );
  }

  return (
    <>
      <Button
        className="rounded-full bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        onClick={handlePhysicalFlowStart}
        disabled={!productActive || !inStock || isSubmitting}
        aria-label="Mua ngay"
      >
        Mua ngay
      </Button>

      <Dialog open={openMethodDialog} onOpenChange={setOpenMethodDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chọn phương thức thanh toán</DialogTitle>
          </DialogHeader>
          <div className="mt-2">
            <RadioGroup value={selectedPaymentMethod} onValueChange={v => setSelectedPaymentMethod(v as any)}>
              <div className="flex flex-col gap-2">
                <Label className="flex items-center gap-2">
                  <RadioGroupItem value="COD" id="cod" />
                  <Label htmlFor="cod">Thanh toán khi nhận hàng (COD)</Label>
                </Label>
                <Label className="flex items-center gap-2">
                  <RadioGroupItem value="MOMO_WALLET" id="online" />
                  <Label htmlFor="online">Thanh toán Online</Label>
                </Label>
              </div>
            </RadioGroup>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Để tiếp tục, vui lòng chọn địa chỉ giao hàng.
          </p>
          <div className="mt-4 flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setOpenMethodDialog(false)}>Hủy</Button>
            <Button
              onClick={() => {
                setOpenAddressDialog(true);
              }}
            >
              Chọn địa chỉ
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={openAddressDialog} onOpenChange={setOpenAddressDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chọn địa chỉ giao hàng</DialogTitle>
          </DialogHeader>
          {isAddrLoading
            ? (
                <p className="text-sm text-muted-foreground">Đang tải danh sách địa chỉ...</p>
              )
            : addresses && addresses.length > 0
              ? (
                  <div className="space-y-3">
                    <RadioGroup value={selectedAddressId || ''} onValueChange={setSelectedAddressId}>
                      {addresses.map((addr: any) => (
                        <div key={addr.id} className="flex items-start gap-2">
                          <RadioGroupItem value={addr.id} id={addr.id} />
                          <Label htmlFor={addr.id} className="text-sm">
                            <div className="font-medium">
                              {addr.full_name}
                              {' '}
                              —
                              {addr.phone}
                            </div>
                            <div className="text-muted-foreground">
                              {addr.detail}
                              ,
                              {addr.city}
                            </div>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                )
              : (
                  <p className="text-sm text-muted-foreground">
                    Bạn chưa có địa chỉ giao hàng nào. Vui lòng thêm địa chỉ mới trong Tài khoản.
                  </p>
                )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenAddressDialog(false)}>Hủy</Button>
            <Button
              onClick={handleConfirmPhysicalBuyNow}
              disabled={!addresses || addresses.length === 0 || !selectedAddressId || isSubmitting}
            >
              Xác nhận
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function ProductDetailSection({ slug }: ProductDetailProps) {
  const { data, isLoading, error } = useFindVariantsByProductSlug({ variables: { slug } });
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [_variantChoose, setVariantChoose] = useQueryState('variant', {
    defaultValue: '',
    clearOnDefault: true,
    shallow: true,
    history: 'push',
  });
  const [quantity, setQuantity] = useState(1);
  const { mutateAsync: addToCart } = useAddVariantToCart();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (data?.data) {
      const variant = data.data.find((p: ProductVariant) => p.slug === slug);
      setSelectedVariant(variant ?? data.data[0] ?? null);
    }
  }, [data, slug]);

  if (isLoading) {
    return <ProductDetailLoading />;
  }

  if (error || !data || !data.data || data.data.length === 0) {
    return notFound();
  }

  const productVariants = data.data;
  const variant = selectedVariant || productVariants[0];
  const productType = variant?.product?.product_type;
  const isDigital = productType === 'CARD_DIGITAL_KEY';

  if (!variant) {
    return <span>No data</span>;
  }

  const maxStock = getAvailableStock(variant);

  const handleVariantChange = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    setVariantChoose(variant.slug);
    setQuantity(1);
  };

  const handleDecrease = () => {
    setQuantity(prev => Math.max(1, prev - 1));
  };

  const handleIncrease = () => {
    setQuantity(prev => Math.min(maxStock, prev + 1));
  };

  const handleAddToCart = async () => {
    console.log(`Add ${quantity} sản phẩm ${variant.variant_name} vào giỏ hàng`);
    if (!variant) {
      toast.error('Please select one variant');
      return;
    }
    if (quantity <= 0) {
      toast.error('Số lượng phải lớn hơn 0.');
      return;
    }

    addToCart(
      {
        productVariantId: variant.id,
        quantity,
      },
      {
        onSuccess: (data) => {
          toast.success(`Đã thêm ${quantity} sản phẩm "${variant.variant_name}" vào giỏ hàng`);
          console.log('API response:', data);
          queryClient.invalidateQueries({ queryKey: ['carts'] });
        },
        onError: (error) => {
          const message
            = (error.response?.data as any)?.message || 'Không thể thêm sản phẩm vào giỏ hàng';
          toast.error(message);
          console.error('API error:', error);
        },
      },
    );
  };

  return (
    <main className="mx-auto space-y-2 px-4 pb-8 lg:px-16">
      <div className="relative flex w-full items-center justify-center gap-10 py-4 md:pt-12">
        <div className="mx-auto w-full max-w-[1024px]">
          <Breadcrumbs items={makeBreadcrumbs(variant)} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 pt-4 md:mx-auto md:max-w-screen-xl md:grid-cols-12 md:gap-8">
        <ProductTitle
          className="md:hidden"
          title={variant.variant_name}
          price={variant.price}
          currency="$"
        />
        <ProductDetailImages images={variant.images} />
        <div className="space-y-4 md:col-span-6 md:col-start-8 md:mt-0">
          <ProductTitle
            className="hidden md:col-span-4 md:col-start-9 md:block"
            title={variant.variant_name}
            price={variant.price}
            currency="$"
          />

          <div className="space-y-2">
            <h3 className="font-semibold">Chọn biến thể:</h3>
            <div className="flex flex-wrap gap-2">
              {productVariants.map((v) => {
                const stockQuantity = v.stock?.quantity ?? 0;
                return (
                  <Button
                    key={v.id}
                    variant={v.id === variant.id ? 'default' : 'outline'}
                    className="text-sm"
                    onClick={() => handleVariantChange(v)}
                    disabled={stockQuantity === 0}
                  >
                    {v.variant_name}
                  </Button>
                );
              })}
            </div>
            {maxStock === 0 && (
              <p className="text-sm text-red-500">Hết hàng</p>
            )}
          </div>

          <div className="flex items-center gap-3 py-8">
            {isDigital
              ? (
                  <div className="flex h-10 w-20 items-center justify-center rounded-lg border bg-muted">
                    <input
                      type="number"
                      value={1}
                      disabled
                      className="w-full [appearance:textfield] text-center text-sm font-medium focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />
                  </div>
                )
              : (
                  <div className="flex items-center justify-between rounded-lg border bg-background">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-l-lg"
                      onClick={handleDecrease}
                      disabled={maxStock <= 1}
                      aria-label="Giảm số lượng"
                    >
                      <Icons.minus className="h-4 w-4" />
                    </Button>

                    <div className="flex h-10 w-20 items-center justify-center rounded-lg border">
                      <input
                        type="number"
                        min={1}
                        max={maxStock}
                        value={quantity}
                        onChange={(e) => {
                          let val = Number(e.target.value);
                          if (Number.isNaN(val) || val < 1) {
                            val = 1;
                          }
                          if (val > maxStock) {
                            val = maxStock;
                          }
                          setQuantity(val);
                        }}
                        className="w-full [appearance:textfield] text-center text-sm font-medium focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      />
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-r-lg"
                      onClick={handleIncrease}
                      disabled={maxStock === 0}
                      aria-label="Tăng số lượng"
                    >
                      <Icons.plus className="h-4 w-4" />
                    </Button>
                  </div>
                )}

            <div className="flex gap-2">
              <Button
                className="rounded-full bg-green-500 px-6 py-3 font-medium text-white hover:bg-green-600"
                aria-label={`Thêm ${maxStock} sản phẩm vào giỏ hàng`}
                disabled={maxStock === 0}
                onClick={handleAddToCart}
              >
                <Icons.shoppingCart className="mr-2 h-4 w-4" />
                Thêm vào giỏ hàng
              </Button>
              <BuyNowButton variant={variant} quantity={quantity} />
            </div>
          </div>

          <Separator className="my-4" />

          <p className="py-4">{variant.product.description}</p>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="specs">
              <AccordionTrigger className="font-serif tracking-widest hover:no-underline">
                THÔNG SỐ KỸ THUẬT
              </AccordionTrigger>
              <AccordionContent className="mt-8">
                <div className="grid grid-cols-2 gap-x-6 gap-y-8">
                  {Object.entries(variant.other_attributes).map(([key, value]) => (
                    <React.Fragment key={key}>
                      <div className="font-serif font-semibold tracking-wider">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </div>
                      <div>{value}</div>
                    </React.Fragment>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </main>
  );
}
