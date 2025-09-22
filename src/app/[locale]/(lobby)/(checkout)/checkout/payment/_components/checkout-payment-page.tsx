import { Suspense } from 'react';

export default function CheckoutPaymentPageClient() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutPaymentPageClient />
    </Suspense>
  );
}
