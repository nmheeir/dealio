'use client';

import { parseAsInteger, useQueryState } from 'nuqs';
import { Accordion } from '@/components/ui/accordion';
import { cn } from '@/libs/utils';
import { Button } from '../ui/button';
import { BrandFacet } from './brand-facet';
import CategoryFacet from './category-facet';

type FacetsContentProps = {
  className?: string;
};

// TODO: Fetch data from api

export default function FacetsContent({ className }: FacetsContentProps) {
  const [_page, setPage] = useQueryState('page', {
    ...parseAsInteger,
    defaultValue: 1,
    shallow: true,
    history: 'push',
    clearOnDefault: true,
  });

  const [brand, setBrand] = useQueryState('brand', {
    defaultValue: '',
    clearOnDefault: true,
    shallow: true,
    history: 'push',
  });

  const [category, setCategory] = useQueryState('category', {
    defaultValue: '',
    clearOnDefault: true,
    shallow: true,
    history: 'push',
  });

  function resetAllFilters() {
    setPage(1);
    setBrand('');
    setCategory('');
  }

  return (
    <div className={cn(
      className,
      'space-y-2',
    )}
    >
      <Button
        size="sm"
        variant="outline"
        onClick={() => resetAllFilters()}
      >
        Clear filter
      </Button>
      <div className="mt-[-24px]">
        <Accordion
          type="multiple"
          className="w-full"
          defaultValue={['Brand', 'Category']}
        >
          {/* Brand */}
          <BrandFacet
            id="Brand"
            className="border-b border-gray-200 py-4"
            isCheckedAction={b => brand === b}
            onCheckedChangeAction={(b) => {
              if (brand === b) {
                setBrand('');
              } else {
                setBrand(b);
              }
            }}
          />
          {/* Category */}
          <CategoryFacet
            id="Category"
            className="border-b border-gray-200 py-4"
            isCheckedAction={c => category === c}
            onCheckedChangeAction={(c) => {
              if (brand === c) {
                setCategory('');
              } else {
                setCategory(c);
              }
            }}
          />
        </Accordion>
      </div>
    </div>
  );
}
