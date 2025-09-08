// components/data-table/DragHandle.tsx
import { useSortable } from '@dnd-kit/sortable';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';

type DragHandleProps = {
  id: string;
};

export function DragHandle({ id }: DragHandleProps) {
  const { attributes, listeners } = useSortable({
    id,
  });

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="size-7 text-muted-foreground hover:cursor-grab hover:bg-transparent"
    >
      <Icons.gripVertical className="size-4 text-muted-foreground" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  );
}
