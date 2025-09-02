'use client';

import { SearchIcon, ShoppingCartIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useSearchProductVariant } from '@/api/product-variant/use-search';
import { useDebounce } from '@/hooks/use-debounce';
import { isMacOs } from '@/libs/utils';
import { Icons } from './icons';
import { Kbd } from './kbs';
import { Button } from './ui/button';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';
import { Skeleton } from './ui/skeleton';

export function ProductsCombobox() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const debouncedQuery = useDebounce(query, 500);

  React.useEffect(() => {
    if (debouncedQuery.length <= 0) {
      // setData(null);
    }
  }, [debouncedQuery]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(open => !open);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const onSelect = React.useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <>
      <Button
        variant="outline"
        className="relative size-9 p-0 xl:h-10 xl:w-60 xl:justify-start xl:px-3 xl:py-2"
        onClick={() => setOpen(true)}
      >
        <SearchIcon className="size-4 xl:mr-2" aria-hidden="true" />
        <span className="hidden xl:inline-flex">Search products...</span>
        <span className="sr-only">Search products</span>
        <Kbd
          title={isMacOs() ? 'Command' : 'Control'}
          className="pointer-events-none absolute top-1.5 right-1.5 hidden xl:block"
        >
          {isMacOs() ? '⌘' : 'Ctrl'}
          {' '}
          K
        </Kbd>
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={(open) => {
          setOpen(open);
          if (!open) {
            setQuery('');
          }
        }}
      >
        <CommandInput
          placeholder="Search products..."
          value={query}
          onValueChange={setQuery}
        />
        {/* Search Response Data */}
        <ProductSearchResponse
          query={debouncedQuery}
          onSelectAction={onSelect}
        />
      </CommandDialog>
    </>
  );
}

type ProductSearchResponseProps = {
  query: string;
  onSelectAction?: () => void;
};

function ProductSearchResponse({
  query,
  onSelectAction,
}: ProductSearchResponseProps) {
  const router = useRouter();

  const { data, isLoading, error } = useSearchProductVariant({
    variables: { query },
    enabled: !!query && query.trim().length > 0,
    placeholderData: prev => prev,
  });

  if (!query || query.trim().length === 0) {
    return (
      <div className="py-6 text-center text-sm text-gray-500">
        Please enter a keyword to search.
      </div>
    );
  }

  if (isLoading) {
    return (
      <CommandList>
        <div className="space-y-2 px-2 py-3">
          <Skeleton className="h-4 w-1/3 rounded" />
          <Skeleton className="h-8 rounded-sm" />
          <Skeleton className="h-8 rounded-sm" />
          <Skeleton className="h-8 rounded-sm" />
        </div>
      </CommandList>
    );
  }

  if (error || !data) {
    return (
      <CommandEmpty className="py-6 text-center text-sm">
        Something went wrong
      </CommandEmpty>
    );
  }

  const searchResponse = data.data;

  if (searchResponse.products.length === 0 && searchResponse.variants.length === 0) {
    return (
      <CommandEmpty className="py-6 text-center text-sm">
        No data found
      </CommandEmpty>
    );
  }

  return (
    <CommandList>
      {searchResponse.products?.length > 0 && (
        <CommandGroup heading="Products">
          {searchResponse.products.map(product => (
            <CommandItem
              key={product.id}
              className="h-9"
              value={product.name}
            >
              <a
                href={`/product/${product.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  onSelectAction?.();
                  router.push(`/product/${product.id}`);
                }}
                className="flex h-full w-full items-center"
              >
                <ShoppingCartIcon
                  className="mr-2.5 size-3 text-muted-foreground"
                  aria-hidden="true"
                />
                <span className="truncate">
                  {product.name}
                </span>
              </a>
            </CommandItem>
          ))}

          {/* Option "All products" */}
          <CommandItem
            value="all-products"
            onSelect={() => {
              onSelectAction?.();
              router.push(`/search?q=${encodeURIComponent(query)}`);
            }}
          >
            <a
              href={`/search?q=${encodeURIComponent(query)}`}
              className="truncate text-blue-600"
              onClick={(e) => {
                e.preventDefault();
                onSelectAction?.();
                router.push(`/search?q=${encodeURIComponent(query)}`);
              }}
            >
              View all products matching "
              {query}
              "
            </a>
          </CommandItem>
        </CommandGroup>
      )}

      {searchResponse.variants?.length > 0 && (
        <CommandGroup heading="Refine by">
          {searchResponse.variants.map(variant => (
            <CommandItem asChild key={variant.id} value={variant.variant_name}>
              <a
                href={`/product/${variant.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  onSelectAction?.();
                  router.push(`/product/${variant.id}`);
                }}
                className="flex h-9 items-center"
              >
                <Icons.tag
                  className="mr-2.5 size-3 text-muted-foreground"
                  aria-hidden="true"
                />
                <span className="truncate">
                  {variant.variant_name}
                </span>
              </a>
            </CommandItem>
          ))}

          {/* TODO: fix lỗi không hiển thị tùy theo query */}
          {/* Option "All variants" */}
          <CommandItem
            asChild
            value="all-variants"
          >
            <a
              href={`/search/q=${encodeURIComponent(query)}`}
              className="truncate text-blue-600"
              onClick={(e) => {
                e.preventDefault();
                onSelectAction?.();
                router.push(`/search?q=${encodeURIComponent(query)}`);
              }}
            >
              View all variants matching "
              {query}
              "
            </a>
          </CommandItem>
        </CommandGroup>
      )}
    </CommandList>
  );
}
