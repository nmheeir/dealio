import type { Brand } from '@/api/schemas/brand/brand.schema';
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/libs/utils';
import { EditBrandForm } from './edit-brand-form';

export function RowActionEdit({ item }: { item: Brand }) {
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
        brand={item}
        open={open}
        onOpenChangeAction={setOpen}
      />
    </>
  );
}

type RowActionEditContentProps = {
  brand: Brand;
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
};

function RowActionEditContent({ brand, open, onOpenChangeAction }: RowActionEditContentProps) {
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
            <EditBrandForm item={brand} onOpenChangeAction={onOpenChangeAction} />
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
        <EditBrandForm item={brand} onOpenChangeAction={onOpenChangeAction} />
      </DialogContent>
    </Dialog>
  );
}
