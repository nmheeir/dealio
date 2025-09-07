import type {
  Row,
} from '@tanstack/react-table';

import {
  useSortable,
} from '@dnd-kit/sortable';

import { CSS } from '@dnd-kit/utilities';
import { flexRender } from '@tanstack/react-table';

import * as React from 'react';
import { Icons } from '@/components/icons';
import {
  TableCell,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/libs/utils';

type WithId = {
  id: string | number;
};

type DraggableRowProps<TData extends WithId> = {
  row: Row<TData>;
  showHandle?: boolean;
};

export function DraggableRow<TData extends WithId>({ row, showHandle = true }: DraggableRowProps<TData>) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  });

  return (
    <TableRow
      ref={setNodeRef}
      data-state={row.getIsSelected() && 'selected'}
      data-dragging={isDragging}
      className={cn(
        'relative z-0',
        'data-[dragging=true]:z-10 data-[dragging=true]:opacity-80',
      )}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      {row.getVisibleCells().map((cell, index) => (
        <TableCell
          key={cell.id}
          className={cn(index === 0 && showHandle && 'cursor-grab')}
        >
          {index === 0 && showHandle
            ? (
                <div className="flex items-center gap-2">
                  <Icons.gripVertical className="h-4 w-4 text-muted-foreground" />
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </div>
              )
            : (
                flexRender(cell.column.columnDef.cell, cell.getContext())
              )}
        </TableCell>
      ))}
    </TableRow>
  );
}
