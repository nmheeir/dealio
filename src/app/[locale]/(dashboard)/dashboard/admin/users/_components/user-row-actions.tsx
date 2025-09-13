'use client';

import type { User } from '@/api/schemas/user/user.schema';
import { useProfile } from '@/api/profile/use-profile';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ActivateUserDialog } from './dialogs/activate-user-dialog';

export function UserRowAction({ user }: { user: User }) {
  const { data } = useProfile();
  const currentUser = data?.data ?? null;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <Icons.ellipsisVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {currentUser?.user_id !== user.id && (
          <DropdownMenuItem asChild>
            <ActivateUserDialog user={user} />
          </DropdownMenuItem>
        )}
        {/* <DropdownMenuItem asChild>
          <UserDetailDialog user={user} />
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <ResetPasswordDialog user={user} />
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <UpgradeRoleDialog user={user} />
        </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
