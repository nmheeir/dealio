// components/data-table/OutlineTabContent.tsx
import type { DragEndEvent, UniqueIdentifier } from '@dnd-kit/core';
import type { ColumnDef, Table } from '@tanstack/react-table';
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  flexRender,
} from '@tanstack/react-table';
import * as React from 'react';
import { Icons } from '@/components/icons';
import {
  TableBody,
  TableCell,
  Table as TableComponent,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/libs/utils';
import { DraggableRow } from './draggable-row';
import { DataTablePagination } from './table-pagination';

// Generic interface cho bất kỳ data type nào có id
type DataWithId = {
  id: string | number;
  [key: string]: any;
};

// Generic props interface
type SortableTableProps<TData extends DataWithId> = {
  table: Table<TData>;
  data: TData[];
  setData: React.Dispatch<React.SetStateAction<TData[]>>;
  dataIds: UniqueIdentifier[];
  columns?: ColumnDef<TData>[]; // Optional, fallback to table columns
  enableDragDrop?: boolean; // Tuỳ chọn bật/tắt drag & drop
  enablePagination?: boolean; // Tuỳ chọn bật/tắt pagination
  emptyMessage?: string; // Custom empty message
  className?: string; // Custom styling
};

export function SortableTable<TData extends DataWithId>({
  table,
  data: _data,
  setData,
  dataIds,
  columns,
  enableDragDrop = true,
  enablePagination = true,
  emptyMessage = 'No results.',
  className,
}: SortableTableProps<TData>) {
  const sortableId = React.useId();
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {}),
  );

  // Sử dụng columns từ props hoặc fallback đến table columns
  const tableColumns = React.useMemo(() => {
    return columns || table.getAllColumns().map(col => col.columnDef);
  }, [columns, table]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id);
        const newIndex = dataIds.indexOf(over.id);
        return arrayMove(data, oldIndex, newIndex);
      });
    }
  }

  const tableContent = (
    <TableComponent>
      <TableHeader className="sticky top-0 z-10 bg-muted">
        {table.getHeaderGroups().map(headerGroup => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead key={header.id} colSpan={header.colSpan}>
                  {
                    header.isPlaceholder
                      ? null
                      : header.column.getCanSort()
                        ? (
                            <div
                              role="button"
                              className={cn(
                                header.column.getCanSort()
                                && 'flex h-full cursor-pointer select-none items-center gap-2',
                              )}
                              onClick={header.column.getToggleSortingHandler()}
                              onKeyDown={(e) => {
                                // Enhanced keyboard handling for sorting
                                if (
                                  header.column.getCanSort()
                                  && (e.key === 'Enter' || e.key === ' ')
                                ) {
                                  e.preventDefault();
                                  header.column.getToggleSortingHandler()?.(e);
                                }
                              }}
                              tabIndex={header.column.getCanSort() ? 0 : undefined}
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                              {{
                                asc: (
                                  <Icons.chevronUp
                                    className="shrink-0 opacity-60"
                                    size={16}
                                    aria-hidden="true"
                                  />
                                ),
                                desc: (
                                  <Icons.chevronDown
                                    className="shrink-0 opacity-60"
                                    size={16}
                                    aria-hidden="true"
                                  />
                                ),
                              }[header.column.getIsSorted() as string] ?? null}
                            </div>
                          )
                        : (
                            flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )
                          )
                  }
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody className="**:data-[slot=table-cell]:first:w-8">
        {table.getRowModel().rows?.length
          ? (
              enableDragDrop
                ? (
                    <SortableContext
                      items={dataIds}
                      strategy={verticalListSortingStrategy}
                    >
                      {table.getRowModel().rows.map(row => (
                        <DraggableRow key={row.id} row={row} />
                      ))}
                    </SortableContext>
                  )
                : (
                    <>
                      {table.getRowModel().rows.map(row => (
                        <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                          {row.getVisibleCells().map(cell => (
                            <TableCell key={cell.id}>
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext(),
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </>
                  )
            )
          : (
              <TableRow>
                <TableCell
                  colSpan={tableColumns.length}
                  className="h-24 text-center"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
      </TableBody>
    </TableComponent>
  );

  return (
    <div className={cn('relative flex flex-col gap-4 overflow-auto px-4 lg:px-6', className)}>
      <div className="overflow-hidden rounded-lg border">
        {enableDragDrop
          ? (
              <DndContext
                collisionDetection={closestCenter}
                modifiers={[restrictToVerticalAxis]}
                onDragEnd={handleDragEnd}
                sensors={sensors}
                id={sortableId}
              >
                {tableContent}
              </DndContext>
            )
          : (
              tableContent
            )}
      </div>
      {enablePagination && <DataTablePagination table={table} />}
    </div>
  );
}
