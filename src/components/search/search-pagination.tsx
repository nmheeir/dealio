/* eslint-disable react/no-array-index-key */
'use client';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { cn } from '@/libs/utils';

type SearchPaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChangeAction: (page: number) => void;
};

export default function SearchPagination({
  currentPage,
  totalPages,
  onPageChangeAction,
}: SearchPaginationProps) {
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, 'ellipsis', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          'ellipsis',
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        );
      } else {
        pages.push(
          1,
          'ellipsis',
          currentPage - 1,
          currentPage,
          currentPage + 1,
          'ellipsis',
          totalPages,
        );
      }
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <Pagination className="mt-8">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => {
              const targetPage = Math.max(1, currentPage - 1);
              onPageChangeAction(targetPage);
            }}
            aria-disabled={currentPage === 1}
          />
        </PaginationItem>

        {pages.map((page, index) =>
          page === 'ellipsis'
            ? (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              )
            : (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => {
                      onPageChangeAction(page);
                    }}
                    isActive={page === currentPage}
                    className={cn(page === currentPage && 'font-bold')}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ),
        )}

        <PaginationItem>
          <PaginationNext
            onClick={() => {
              const targetPage = Math.min(totalPages, currentPage + 1);
              onPageChangeAction(targetPage);
            }}
            aria-disabled={currentPage === totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
