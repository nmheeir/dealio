// components/data-table/OutlineTabContent.tsx
import type { DragEndEvent, UniqueIdentifier } from '@dnd-kit/core';
import type { Table } from '@tanstack/react-table';
import type { ProductVariant } from '@/api/schemas/product/product-variant.schema';
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
import {
  TableBody,
  TableCell,
  Table as TableComponent,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TabsContent } from '@/components/ui/tabs';
import { columns } from './columns';
import { DraggableRow } from './draggable-row';
import { DataTablePagination } from './table-pagination';

type OutlineTabContentProps = {
  table: Table<ProductVariant>;
  data: ProductVariant[];
  setData: React.Dispatch<React.SetStateAction<ProductVariant[]>>;
  dataIds: UniqueIdentifier[];
};

export function OutlineTabContent({
  table,
  data: _data,
  setData,
  dataIds,
}: OutlineTabContentProps) {
  const sortableId = React.useId();
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {}),
  );

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

  return (
    <TabsContent
      value="outline"
      className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
    >
      <div className="overflow-hidden rounded-lg border">
        <DndContext
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={handleDragEnd}
          sensors={sensors}
          id={sortableId}
        >
          <TableComponent>
            <TableHeader className="sticky top-0 z-10 bg-muted">
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="**:data-[slot=table-cell]:first:w-8">
              {table.getRowModel().rows?.length
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
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
            </TableBody>
          </TableComponent>
        </DndContext>
      </div>
      <DataTablePagination table={table} />
    </TabsContent>
  );
}
