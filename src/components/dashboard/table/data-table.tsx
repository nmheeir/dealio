'use client';
import type { UniqueIdentifier } from '@dnd-kit/core';
import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table';
import {
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import * as React from 'react';
import { SortableTable } from './sortable-table';
import { DataTableToolbar } from './table-toolbar';

// Generic interface cho bất kỳ data type nào có id
type DataWithId = {
  id: string | number;
  [key: string]: any;
};

// Generic props interface
type DataTableProps<TData extends DataWithId> = {
  data: TData[];
  columns: ColumnDef<TData>[];
  // Tuỳ chọn các config khác
  enableRowSelection?: boolean;
  enableSorting?: boolean;
  enableFiltering?: boolean;
  enablePagination?: boolean;
  initialPageSize?: number;
  // Custom table content component (tuỳ chọn)
  TableContentComponent?: React.ComponentType<{
    table: any;
    data: TData[];
    setData: React.Dispatch<React.SetStateAction<TData[]>>;
    dataIds: UniqueIdentifier[];
  }>;
};

export function DataTable<TData extends DataWithId>({
  data: initialData,
  columns,
  enableRowSelection = true,
  enableSorting = true,
  enableFiltering = true,
  enablePagination = true,
  initialPageSize = 10,
  TableContentComponent = SortableTable,
}: DataTableProps<TData>) {
  const [data, setData] = React.useState(() => initialData);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
    setData(initialData);
  }, [initialData]);

  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: initialPageSize,
  });

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id }) => id) || [],
    [data],
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      ...(enableSorting && { sorting }),
      ...(enableFiltering && { columnFilters }),
      ...(enableRowSelection && { rowSelection }),
      columnVisibility,
      ...(enablePagination && { pagination }),
    },
    getRowId: row => String(row.id),
    enableRowSelection,
    enableSorting,
    enableColumnFilters: enableFiltering,
    ...(enableRowSelection && { onRowSelectionChange: setRowSelection }),
    ...(enableSorting && { onSortingChange: setSorting }),
    ...(enableFiltering && { onColumnFiltersChange: setColumnFilters }),
    onColumnVisibilityChange: setColumnVisibility,
    ...(enablePagination && { onPaginationChange: setPagination }),
    getCoreRowModel: getCoreRowModel(),
    ...(enableFiltering && { getFilteredRowModel: getFilteredRowModel() }),
    ...(enablePagination && { getPaginationRowModel: getPaginationRowModel() }),
    ...(enableSorting && { getSortedRowModel: getSortedRowModel() }),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <div className="flex flex-col space-y-4">
      <DataTableToolbar table={table} />
      <TableContentComponent
        table={table}
        data={data}
        setData={setData}
        dataIds={dataIds}
      />
    </div>
  );
}
