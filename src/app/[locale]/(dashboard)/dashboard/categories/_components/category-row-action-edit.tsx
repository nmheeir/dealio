import type { Category } from '@/api/schemas/category/category.schema';
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/libs/utils';
import { EditCategoryForm } from './edit-category-form';

export function RowActionEdit({ item }: { item: Category }) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <DropdownMenuItem
        onClick={(e) => {
          e.preventDefault();
          setOpen(true);
        }}
      >
        Edit
      </DropdownMenuItem>
      <RowActionEditContent
        category={item}
        open={open}
        onOpenChangeAction={setOpen}
      />
    </>
  );
}

type RowActionEditContentProps = {
  category: Category;
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
};

function RowActionEditContent({ category, open, onOpenChangeAction }: RowActionEditContentProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChangeAction}>
        <DrawerContent className={cn(
          'sm:max-w-lg',
          'flex h-[80vh] flex-col',
        )}
        >
          <DrawerHeader>
            <DrawerTitle>Edit brand</DrawerTitle>
          </DrawerHeader>
          <ScrollArea className="flex-1 px-6">
            <EditCategoryForm item={category} categories={[]} onOpenChangeAction={onOpenChangeAction} />
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cập nhật địa chỉ</DialogTitle>
          <DialogDescription>Chỉnh sửa thông tin địa chỉ giao hàng.</DialogDescription>
        </DialogHeader>
        <EditCategoryForm item={category} categories={[]} onOpenChangeAction={onOpenChangeAction} />
      </DialogContent>
    </Dialog>
  );
}
