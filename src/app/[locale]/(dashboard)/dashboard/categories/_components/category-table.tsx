/* eslint-disable react-refresh/only-export-components */
'use client';

import type { Category } from '@/api/schemas/category/category.schema';
import React from 'react';
import { useCategories } from '@/api/category/use-categories';
import { DataTable } from '@/components/dashboard/data-table/data-table';
import { DataTableLoading } from '@/components/dashboard/data-table/data-table-loading';
import { categoryColumn } from './category-columns';

export function CategoryTable() {
  const { data, isLoading, error } = useCategories();

  if (isLoading) {
    return <DataTableLoading />;
  }

  if (error) {
    return (
      <div>
        Error:
        {error.message}
      </div>
    );
  }

  const categories = flattenCategories(data?.data.data ? data.data.data : []);

  return (
    <div className="mt-8 px-8">
      <DataTable
        data={categories}
        columns={categoryColumn}
      />
    </div>
  );
}

// Flatten categories recursively
export function flattenCategories(categories: Category[]): Category[] {
  const result: Category[] = [];

  function traverse(categoryList: Category[]) {
    for (const category of categoryList) {
      result.push(category); // thêm category hiện tại
      if (category.children && category.children.length > 0) {
        traverse(category.children); // duyệt con
      }
    }
  }

  traverse(categories);

  return result;
}
