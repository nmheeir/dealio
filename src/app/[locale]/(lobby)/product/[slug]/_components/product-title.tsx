import { Badge } from '@/components/ui/badge';

type ProductTitleProps = {
  title: string;
  className?: string;
  currency?: string;
  price: string | null; // giá gốc
  discount?: number; // giảm giá theo giá trị số
};

export default function ProductTitle({ title, currency = '$', price, discount = 10, className }: ProductTitleProps) {
  if (!price) {
    return null;
  }

  const numericPrice = Number.parseFloat(price.toString());
  const discountedPrice = discount ? numericPrice - discount : numericPrice;
  const discountPercentage = discount ? Math.round((discount / numericPrice) * 100) : 0;

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-balance text-foreground lg:text-4xl">{title}</h1>

        <div className="h-1 w-32 rounded-full bg-primary" />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-baseline gap-2">
          {discount > 0
            ? (
                <>
                  <span className="text-2xl font-bold text-primary">
                    {currency}
                    {discountedPrice.toFixed(2)}
                  </span>
                  <span className="text-lg text-muted-foreground line-through">
                    {currency}
                    {numericPrice.toFixed(2)}
                  </span>
                </>
              )
            : (
                <span className="text-2xl font-bold text-primary">
                  {currency}
                  {numericPrice.toFixed(2)}
                </span>
              )}
        </div>

        {discount > 0 && (
          <Badge
            variant="secondary"
            className="animate-pulse bg-accent px-3 py-1 text-sm font-semibold text-accent-foreground"
          >
            Save
            {' '}
            {discountPercentage}
            %
          </Badge>
        )}
      </div>

      {discount > 0 && (
        <p className="text-sm text-muted-foreground">
          You save
          {' '}
          {currency}
          {discount.toFixed(2)}
        </p>
      )}
    </div>
  );
}
