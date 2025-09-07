/* eslint-disable unused-imports/no-unused-vars */
import { Slot } from '@radix-ui/react-slot';
import Image from 'next/image';
import { UpdateCart } from '@/components/checkout/update-cart';
import { Icons } from '@/components/icons';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { formatPrice } from '@/libs/utils';

type CartLineItemsProps = {
  // items: ProductVariant[];
  isScrollable?: boolean;
  isEditable?: boolean;
  variant?: 'default' | 'minimal';
} & React.HTMLAttributes<HTMLDivElement>;

export function CartLineItems({
  isScrollable = true,
  isEditable = true,
  variant = 'default',
  className,
  ...props
}: CartLineItemsProps) {
  const Comp = isScrollable ? ScrollArea : Slot;

  return (
    <ScrollArea className="h-full">
      <div className="flex w-full flex-col gap-5 pr-6">
        {/* Item 1 */}
        <div className="space-y-3">
          <div className="flex flex-col items-start justify-between gap-4 xs:flex-row">
            <div className="flex items-center space-x-4">
              <div className="relative aspect-square size-16 min-w-fit overflow-hidden rounded">
                <Image
                  src="/images/product-placeholder.webp"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  fill
                  className="absolute object-cover"
                  loading="lazy"
                  alt="Sample product"
                />
              </div>
              <div className="flex flex-col space-y-1 self-start">
                <span className="line-clamp-1 text-sm font-medium">
                  Sample Product 1
                </span>
                <span className="line-clamp-1 text-xs text-muted-foreground">
                  {formatPrice(120000)}
                  {' '}
                  x 2 =
                  {formatPrice(240000)}
                </span>
                <span className="line-clamp-1 text-xs text-muted-foreground capitalize">
                  electronics / phone
                </span>
              </div>
            </div>
            <UpdateCart />
          </div>
          <Separator />
        </div>

        {/* Item 2 */}
        <div className="space-y-3">
          <div className="flex flex-col items-start justify-between gap-4 xs:flex-row">
            <div className="flex items-center space-x-4">
              <div className="relative aspect-square size-16 min-w-fit overflow-hidden rounded">
                <div className="flex h-full items-center justify-center bg-secondary">
                  <Icons.placeholder
                    className="size-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                </div>
              </div>
              <div className="flex flex-col space-y-1 self-start">
                <span className="line-clamp-1 text-sm font-medium">
                  Sample Product 2
                </span>
                <span className="line-clamp-1 text-xs text-muted-foreground">
                  {formatPrice(99000)}
                  {' '}
                  x 1 =
                  {formatPrice(99000)}
                </span>
                <span className="line-clamp-1 text-xs text-muted-foreground capitalize">
                  fashion / shoes
                </span>
              </div>
            </div>
            <UpdateCart />
          </div>
          <Separator />
        </div>
      </div>
    </ScrollArea>
  );
}
