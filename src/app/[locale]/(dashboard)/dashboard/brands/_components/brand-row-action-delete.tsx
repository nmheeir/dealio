'use client';

import type { Brand } from '@/api/schemas/brand/brand.schema';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { toast } from 'sonner';
import { useDeleteBrand } from '@/api/brand/use-delete';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

export function RowActionDelete({ item }: { item: Brand }) {
  const [open, setOpen] = React.useState(false);
  const queryClient = useQueryClient();

  const deleteMutation = useDeleteBrand({
    // onMutate: async ({ id }) => {
    //   await queryClient.cancelQueries({ queryKey: ['brands'] });

    //   const previousData = queryClient.getQueryData<PaginationResponse<Brand>>(['brands']);

    //   queryClient.setQueryData<PaginationResponse<Brand>>(
    //     ['brands'],
    //     (oldData) => {
    //       if (!oldData) {
    //         return oldData;
    //       }

    //       const newData = {
    //         ...oldData,
    //         data: {
    //           ...oldData.data,
    //           data: oldData.data.data.filter(variant => variant.id !== id),
    //           total: oldData.data.total - 1,
    //         },
    //       };

    //       return newData;
    //     },
    //   );

    //   return { previousData };
    // },

    onError: (context) => {
      // if (context?.previousData) {
      //   queryClient.setQueryData(['brands'], context.previousData);
      // }
      toast.error(context.response?.data.message[0]);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
    },

    onSuccess: () => {
      setOpen(false);
      toast.success('Delete brand success');
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate({ id: item.id });
  };

  return (
    <>
      {/* <DropdownMenuSeparator /> */}
      {/* TODO: Check role */}
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
              <span className="font-semibold">{item.name}</span>
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
