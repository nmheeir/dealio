'use client';

import type { User } from '@/api/schemas/user/user.schema';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
import { useActivateUser } from '@/api/users/use-activate-user';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export function ActivateUserDialog({ user }: { user: User }) {
  const [open, setOpen] = useState(false);
  const activateType = user.is_active ? 'inactive' : 'active';
  const { mutateAsync: activateUser } = useActivateUser();
  const queryClient = useQueryClient();

  async function handleToggle() {
    console.log('Toggle active for:', user.id);
    await activateUser(
      { type: activateType, userId: user.id },
      {
        onSuccess: () => {
          toast.success(
            user.is_active ? 'Tài khoản đã bị vô hiệu hóa' : 'Tài khoản đã được kích hoạt',
          );
          setOpen(false);
        },
        onError: (error: any) => {
          console.error('Error toggling user:', error);
          const errorMessage = error.response.data.message ?? 'Không thể cập nhật trạng thái tài khoản. Vui lòng thử lại.';
          toast.error(errorMessage);
        },
        onSettled: () => {
        // Có thể refetch lại danh sách user
          queryClient.invalidateQueries({ queryKey: ['users/admin'] });
          console.log('Mutation finished');
        },
      },
    );

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start">
          {user.is_active ? 'Deactivate' : 'Activate'}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {user.is_active ? 'Deactivate Account' : 'Activate Account'}
          </DialogTitle>
          <DialogDescription>
            Bạn có chắc muốn
            {' '}
            {user.is_active ? 'vô hiệu hóa' : 'kích hoạt'}
            {' '}
            tài khoản này?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant={user.is_active ? 'destructive' : 'default'} onClick={handleToggle}>
            {user.is_active ? 'Deactivate' : 'Activate'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
