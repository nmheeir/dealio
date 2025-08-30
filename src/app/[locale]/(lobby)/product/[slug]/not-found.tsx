import type { Metadata } from 'next';
import { ErrorCard } from '@/components/error-card';
import { Shell } from '@/components/shell';

export const metadata: Metadata = {
  title: 'Product Not Found',
  description: 'The product may have expired or you may have already updated your product',
};

export default function ProductNotFound() {
  return (
    <Shell variant="centered" className="max-w-md">
      <ErrorCard
        title="Product not found"
        description="The product may have expired or you may have already updated your product"
        retryLink="/"
        retryLinkText="Go to Home"
      />
    </Shell>
  );
}
