'use client';

import { AnimatePresence } from 'framer-motion';
import ProductDetailSection from './product-detail-section';

export function AnimatedProductSection({ slug }: { slug: string }) {
  return (
    <div className="mx-4">
      <AnimatePresence mode="wait">
        {!slug && <NoProductChoose />}
        {slug && <ProductDetailSection slug={slug} />}
      </AnimatePresence>
    </div>
  );
}

function NoProductChoose() {
  return (
    <span>
      No Product Choose
    </span>
  );
}
