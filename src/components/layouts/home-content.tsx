/* eslint-disable react/no-array-index-key */
'use client';

import { useProductFilter } from '@/api/products/use-product-filter';
import { useProductFindAll } from '@/api/products/use-product-find-all';
import { AlertCard } from '../alert-card';
import { ErrorCard } from '../error-card';
import { ProductCard } from '../product-card';
import { ProductCardSkeleton } from '../product-card-skeleton';
import { Title } from '../title';

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  brand: string;
};

const featuredProducts: Product[] = [
  { id: 1, name: 'PlayStation 5', price: 499.99, image: '/images/ps5.jpg', category: 'Console', brand: 'Sony' },
  { id: 2, name: 'Nintendo Switch OLED', price: 349.99, image: '/images/switch.jpg', category: 'Console', brand: 'Nintendo' },
  { id: 3, name: 'Razer DeathAdder V3', price: 69.99, image: '/images/mouse.jpg', category: 'Accessories', brand: 'Razer' },
];

const productsByCategory: { [key: string]: Product[] } = {
  Console: [
    { id: 1, name: 'PlayStation 5', price: 499.99, image: '/images/ps5.jpg', category: 'Console', brand: 'Sony' },
    { id: 2, name: 'Xbox Series X', price: 499.99, image: '/images/xbox.jpg', category: 'Console', brand: 'Microsoft' },
  ],
  Accessories: [
    { id: 3, name: 'Razer DeathAdder V3', price: 69.99, image: '/images/mouse.jpg', category: 'Accessories', brand: 'Razer' },
    { id: 4, name: 'SteelSeries Arctis 7', price: 149.99, image: '/images/headset.jpg', category: 'Accessories', brand: 'SteelSeries' },
  ],
};

const productsByBrand: { [key: string]: Product[] } = {
  Sony: [
    { id: 1, name: 'PlayStation 5', price: 499.99, image: '/images/ps5.jpg', category: 'Console', brand: 'Sony' },
    { id: 5, name: 'DualSense Controller', price: 69.99, image: '/images/controller.jpg', category: 'Accessories', brand: 'Sony' },
  ],
  Razer: [
    { id: 3, name: 'Razer DeathAdder V3', price: 69.99, image: '/images/mouse.jpg', category: 'Accessories', brand: 'Razer' },
    { id: 6, name: 'Razer BlackWidow V4', price: 169.99, image: '/images/keyboard.jpg', category: 'Accessories', brand: 'Razer' },
  ],
};

export function HomeContent() {
  return (
    <main className="min-h-screen bg-gray-100 text-gray-900">

      {/* Feature Product */}
      <FeatureProductSection />

      {/* Products by Category Section */}
      <CategoryProductSection />

      {/* Products by Brand Section */}
      <BrandProductSection />
    </main>
  );
}

function FeatureProductSection() {
  const { data, isLoading, error } = useProductFindAll(
    { variables: {
      request: { limit: 3 },
    } },
  );

  if (isLoading) {
    return (
      <section className="space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <Title title="Feature Product" description="" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <Title title="Feature Product" description="" />
        <ErrorCard
          title={error.name}
          description={error.message}
        />
      </section>
    );
  }

  const featuredProducts = data?.data.data ?? [];

  return (
    <section className="space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <Title title="Feature Product" description="" href="search" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featuredProducts.map(product => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </section>
  );
}

function CategoryProductSection() {
  const categories = [
    {
      slug: 'kids',
      title: 'Kids',
    },
    {
      slug: 'luxurious_hat',
      title: 'Luxurious Hat',
    },
  ];

  const {
    data: cat1Data,
    isLoading: cat1Loading,
    error: cat1Error,
  } = useProductFilter({
    variables: {
      categorySlug: categories[0]?.slug,
      request: { limit: 3 },
    },
  });

  const {
    data: cat2Data,
    isLoading: cat2Loading,
    error: cat2Error,
  } = useProductFilter({
    variables: {
      categorySlug: categories[1]?.slug,
      request: { limit: 3 },
    },
  });

  if (cat1Loading || cat2Loading) {
    return (
      <section className="space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <Title title="Shop by Category" description="" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </section>
    );
  }

  if (cat1Error || cat2Error) {
    return (
      <section className="space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <Title title="Shop by Category" description="" />
        <ErrorCard
          title="Error loading products"
          description={cat1Error?.message || cat2Error?.message}
        />
      </section>
    );
  }

  const cat1Products = cat1Data?.data.data ?? [];
  const cat2Products = cat2Data?.data.data ?? [];

  if (cat1Products.length === 0 && cat2Products.length === 0) {
    return (
      <section className="space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <Title title="Shop by Category" description="" />
        <AlertCard
          title="No products found"
          description="Try adjusting your filters or check back later."
          className="border-none"
        />
      </section>
    );
  }

  return (
    <section className="space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <Title title="Shop by Category" description="" href="/search" />

      {/* Category 1 */}
      {cat1Products.length > 0 && (
        <div>
          <h2 className="mb-4 text-xl font-semibold">{categories[0]?.title}</h2>
          <div className="grid grid-cols-3 gap-6">
            {cat1Products.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}

      {/* Category 2 */}
      {cat2Products.length > 0 && (
        <div>
          <h2 className="mb-4 text-xl font-semibold">{categories[1]?.title}</h2>
          <div className="grid grid-cols-3 gap-6">
            {cat2Products.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function BrandProductSection() {
  const brands = [
    {
      slug: 'nicolas_christiansen_and_mitchell',
      title: 'Nicolas Christiansen and Mitchell',
    },
    {
      slug: 'miller_altenwerth_and_abernathy',
      title: 'Miller Altenwerth and Abernathy',
    },
  ];

  const {
    data: brand1Data,
    isLoading: brand1Loading,
    error: brand1Error,
  } = useProductFilter({
    variables: {
      brandSlug: brands[0]?.slug,
      request: { limit: 3 },
    },
  });

  const {
    data: brand2Data,
    isLoading: brand2Loading,
    error: brand2Error,
  } = useProductFilter({
    variables: {
      brandSlug: brands[1]?.slug,
      request: { limit: 3 },
    },
  });

  // Loading state
  if (brand1Loading || brand2Loading) {
    return (
      <section className="space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <Title title="Shop by Brand" description="" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </section>
    );
  }

  // Error state
  if (brand1Error || brand2Error) {
    return (
      <section className="space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <Title title="Shop by Brand" description="" />
        <ErrorCard
          title="Error loading products"
          description={brand1Error?.message || brand2Error?.message}
        />
      </section>
    );
  }

  const brand1Products = brand1Data?.data.data ?? [];
  const brand2Products = brand2Data?.data.data ?? [];

  // Empty state
  if (brand1Products.length === 0 && brand2Products.length === 0) {
    return (
      <section className="space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <Title title="Shop by Brand" description="" />
        <AlertCard
          title="No products found"
          description="Try adjusting your filters or check back later."
          className="border-none"
        />
      </section>
    );
  }

  // Success state
  return (
    <section className="space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <Title title="Shop by Brand" description="" />

      {/* Brand 1 */}
      {brand1Products.length > 0 && (
        <div>
          <h2 className="mb-4 text-xl font-semibold">{brands[0]?.title}</h2>
          <div className="grid grid-cols-3 gap-6">
            {brand1Products.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}

      {/* Brand 2 */}
      {brand2Products.length > 0 && (
        <div>
          <h2 className="mb-4 text-xl font-semibold">{brands[1]?.title}</h2>
          <div className="grid grid-cols-3 gap-6">
            {brand2Products.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
