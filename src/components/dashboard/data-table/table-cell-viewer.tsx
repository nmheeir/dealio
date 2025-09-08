'use client';

import type { ProductImage } from '@/api/schemas/product/product-image.schema';
import type { ProductVariant } from '@/api/schemas/product/product-variant.schema';

import Image from 'next/image';
import React, { useState } from 'react';
import { Icons } from '@/components/icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/libs/utils';

export function TableCellViewer({ item }: { item: ProductVariant }) {
  const isMobile = useIsMobile();
  const [editPrice, setEditPrice] = useState(false);
  const [price, setPrice] = useState(item.price?.toString() || '');
  const [editQuantity, setEditQuantity] = useState(false);
  const [quantity, setQuantity] = useState(item.stock?.quantity?.toString() || '');

  return (
    <Drawer direction={isMobile ? 'bottom' : 'right'}>
      <DrawerTrigger asChild>
        <div className="flex items-center gap-2 space-x-0.5">
          <Avatar className="size-8 rounded-sm">
            <AvatarImage src={item.images[0]?.product_url} alt={item.variant_name ?? ''} />
            <AvatarFallback className="size-8 rounded-sm">{item.variant_name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium hover:underline">{item.variant_name}</span>
        </div>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>{item.variant_name}</DrawerTitle>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          {!isMobile && (
            <TableCellImages images={item.images} />
          )}
          <Separator />
          <TableCellHeader header="Product Overview" canEdit={false}>
            This section contains a brief overview of the project, including
          </TableCellHeader>

          <TableCellHeader header="Product Details" canEdit={false}>
            <div className="flex flex-col gap-4">
              {/* Brand and Category */}
              <div className="grid grid-cols-2 gap-4 ">
                <div className="flex flex-col gap-3 ">
                  <Label htmlFor="status">Brand</Label>
                  <div className="text-primary">{item.product.brand.name}</div>
                </div>
                <div className="flex flex-col gap-3">
                  <Label htmlFor="header">Category</Label>
                  <div className="text-primary">{item.product.category.name}</div>
                </div>
              </div>
            </div>

          </TableCellHeader>

          <TableCellHeader header="Other Attributes" canEdit={false}>
            <div className="grid grid-cols-2 gap-x-6 gap-y-8">
              {Object.entries(item.other_attributes).map(([key, value]) => (
                <React.Fragment key={key}>
                  <div className="font-serif font-semibold tracking-wider">{key.charAt(0).toUpperCase() + key.slice(1)}</div>
                  <div>{value}</div>
                </React.Fragment>
              ))}
            </div>
          </TableCellHeader>
        </div>
        {/* <DrawerFooter>
          <Button>Submit</Button>
          <DrawerClose asChild>
            <Button variant="outline">Done</Button>
          </DrawerClose>
        </DrawerFooter> */}
      </DrawerContent>
    </Drawer>
  );
}

export function TableCellImages({ images }: { images: ProductImage[] }) {
  const hasOnlyOneImage = images.length <= 1;
  return (
    <div className={cn('flex flex-col rounded-t-lg')}>
      <div className="md:sticky md:top-[100px]">
        <Carousel className="[&>div]:rounded-lg">
          <CarouselContent className={cn('rounded-lg', hasOnlyOneImage ? 'ml-0' : '')}>
            {images.map((image, index) => (
              <CarouselItem
                className={cn(
                  'relative aspect-square rounded-lg',
                  hasOnlyOneImage && 'pl-0',
                  'hover:scale-110 transition duration-300',
                )}
                key={image.product_url}
              >
                <Image
                  alt={image.id || `Product image ${index + 1}`}
                  src={image.product_url || '/default-product-image.svg'}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 75px) 75px, 120px"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          {!hasOnlyOneImage && (
            <div className="mt-8 flex justify-center gap-10">
              <CarouselPrevious className="relative" />
              <CarouselNext className="relative" />
            </div>
          )}
        </Carousel>
      </div>
    </div>
  );
}

type TableCellHeaderProps = {
  header: string;
  canEdit?: boolean;
  onEdit?: () => void;
  children: React.ReactNode;
};

export function TableCellHeader({ header, onEdit, canEdit = true, children }: TableCellHeaderProps) {
  const [_isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
    onEdit?.();
  };

  return (
    <>
      <div className="grid gap-2 space-y-2">
        <div className="flex items-center justify-between gap-2 leading-none font-medium">
          {header}
          {canEdit && <Icons.pencil className="size-4" onClick={handleEditClick} />}
        </div>
        <div className="text-muted-foreground">
          {children}
        </div>
      </div>
      <Separator />
    </>
  );
}
