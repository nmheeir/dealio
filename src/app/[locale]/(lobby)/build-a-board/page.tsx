import { cookies } from 'next/headers';
import Link from 'next/link';
import { BoardBuilder } from '@/components/board-builder';
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from '@/components/page-header';
import { Shell } from '@/components/shell';
import { productCategories } from '@/config/product';
import { getCartItems } from '@/libs/actions/cart';
import { getProducts } from '@/libs/queries/product';
import { cn } from '@/libs/utils';
import { productsSearchParamsSchema } from '@/libs/validations/params';

// TODO: Fix product filter

type BuildABoardPageProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export default async function BuildABoardPage({
  searchParams,
}: BuildABoardPageProps) {
  const { page, per_page, sort, subcategory, price_range, active }
    = productsSearchParamsSchema.parse(searchParams);

  // Products transaction
  const limit = typeof per_page === 'string' ? Number.parseInt(per_page) : 8;
  const offset = typeof page === 'string' ? (Number.parseInt(page) - 1) * limit : 0;
  const activeSubcategory
    = typeof subcategory === 'string' ? subcategory : 'decks';

  const { data, pageCount } = await getProducts({
    limit,
    offset,
    sort: typeof sort === 'string' ? sort : null,
    subcategories: activeSubcategory,
    price_range: typeof price_range === 'string' ? price_range : null,
    active,
  });

  // Get cart items
  const cookieStore = await cookies();
  const cartId = cookieStore.get('cartId')?.value;
  const cartItems = await getCartItems({ cartId });

  return (
    <Shell className="gap-4">
      <PageHeader
        id="build-a-board-header"
        aria-labelledby="build-a-board-header-heading"
      >
        <PageHeaderHeading size="sm">Build a Board</PageHeaderHeading>
        <PageHeaderDescription size="sm">
          Select the components for your board
        </PageHeaderDescription>
      </PageHeader>
      <section
        className="sticky top-14 z-30 w-full shrink-0 overflow-hidden bg-background/50 pt-6 pb-4 shadow-md sm:backdrop-blur"
      >
        <div className="grid place-items-center overflow-x-auto">
          <div className="inline-flex w-fit items-center rounded border bg-background p-1 text-muted-foreground shadow-2xl">
            {productCategories[0]?.subcategories.map(subcategory => (
              <Link
                aria-label={subcategory.title}
                key={subcategory.title}
                href={`/build-a-board?subcategory=${subcategory.slug}`}
                scroll={false}
              >
                <div
                  className={cn(
                    'inline-flex items-center justify-center whitespace-nowrap rounded border-b-2 border-transparent px-3 py-1.5 text-sm font-medium ring-offset-background transition-all hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                    subcategory.slug === activeSubcategory
                    && 'rounded-none border-primary text-foreground hover:rounded-t',
                  )}
                >
                  {/* {cartItems
                    ?.map(item => item.subcategory)
                    ?.includes(subcategory.slug)
                    ? (
                        <Icons.check className="mr-2 size-4" aria-hidden="true" />
                      )
                    : (
                        <Icons.circle className="mr-2 size-4" aria-hidden="true" />
                      )} */}
                  {subcategory.title}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <BoardBuilder
        products={data}
        pageCount={pageCount}
        subcategory={activeSubcategory}
        cartItems={cartItems ?? []}
      />
    </Shell>
  );
}
