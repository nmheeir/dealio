/* eslint-disable no-console */
'use client';

import type { ProductVariant } from '@/api/schemas/product/product-variant.schema';
import { IconDotsVertical } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { useDeleteProductVariant } from '@/api/product-variant/use-delete';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type RowActionsProps = {
  item: ProductVariant;
};

export function RowActions({ item }: RowActionsProps) {
  const handleEdit = () => {
    console.log('Edit', item);
  };

  const handleCopy = () => {
    console.log('Copy', item);
  };

  const handleFavorite = () => {
    console.log('Favorite', item);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex size-8 text-muted-foreground data-[state=open]:bg-muted"
          size="icon"
        >
          <IconDotsVertical />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-32">
        <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopy}>Make a copy</DropdownMenuItem>
        <DropdownMenuItem onClick={handleFavorite}>Favorite</DropdownMenuItem>
        <DropdownMenuSeparator />
        <RowActionDelete item={item} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function RowActionDelete({ item }: { item: ProductVariant }) {
  const [open, setOpen] = React.useState(false);
  const queryClient = useQueryClient();

  const deleteMutation = useDeleteProductVariant({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productVariants'] });
      setOpen(false);
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate({ id: item.id });
  };

  return (
    <>
      {/* <DropdownMenuSeparator /> */}
      <DropdownMenuItem
        className="text-red-600 focus:text-red-600"
        onClick={(e) => {
          e.preventDefault();
          setOpen(true);
        }}
      >
        Delete
      </DropdownMenuItem>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. The product variant
              {' '}
              <span className="font-semibold">{item.variant_name}</span>
              {' '}
              will be
              permanently deleted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
