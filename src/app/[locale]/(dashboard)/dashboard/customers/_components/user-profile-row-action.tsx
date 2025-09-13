'use client';

import type { UserProfile } from '@/api/schemas/user/user-profile.schema';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function UserProfileRowAction({ user }: { user: UserProfile }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <Icons.ellipsisVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" side="left">
        <DropdownMenuItem
          onClick={() => {
            console.log('Xem đơn hàng của:', user.id);
          }}
        >
          Xem đơn hàng
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
