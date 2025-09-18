'use client';

import type { UserRole } from '@/api/schemas/user/role';
import type { User } from '@/api/schemas/user/user.schema';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
import { useChangeRoleUser } from '@/api/users/use-change-role';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function ChangeRoleDialog({ user }: { user: User }) {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<UserRole>(user.role);
  const [isPending, setIsPending] = useState(false);
  const { mutateAsync: changeRole } = useChangeRoleUser();
  const queryClient = useQueryClient();

  async function handleSubmit() {
    if (role && role !== user.role) {
      setIsPending(true);
      await changeRole(
        {
          userId: user.id,
          role,
        },
        {
          onSuccess: () => {
            setIsPending(false);
            toast.success(`User role has been updated to ${role}.`);
            queryClient.invalidateQueries({ queryKey: ['users/admin'] });
            setOpen(false);
          },
          onError: (error: any) => {
            console.error('Error updating role:', error);
            setIsPending(false);
            const errorMessage
      = error?.response?.data?.message
        ?? 'Unable to update user role. Please try again later.';
            toast.error(errorMessage);
          },
          onSettled: () => {
            setIsPending(false);
            queryClient.invalidateQueries({ queryKey: ['users/admin'] });
            console.log('User role update mutation finished');
          },
        },
      );
    } else {
      toast.info('Please select a different role to update');
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="">
          Change role
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upgrade user role</DialogTitle>
          <DialogDescription>
            Change the role of this account. Current role:
            {' '}
            <span className="font-semibold">{user.role}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Select value={role} onValueChange={(value: UserRole) => setRole(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CUSTOMER">Customer</SelectItem>
              <SelectItem value="MANAGER">Manager</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? 'Updating...' : 'Confirm'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
