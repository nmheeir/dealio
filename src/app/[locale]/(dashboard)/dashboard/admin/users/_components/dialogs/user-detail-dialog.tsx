'use client';

import type { User } from '@/api/schemas/user/user.schema';
import Image from 'next/image';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/libs/utils';

export function UserDetailDialog({ user }: { user: User }) {
  const [open, setOpen] = useState(false);

  const roleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-500 text-white';
      case 'MANAGER':
        return 'bg-blue-500 text-white';
      case 'CUSTOMER':
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="">
          View details
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>User details</DialogTitle>
          <DialogDescription>
            Full account information of this user
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            {user.profile?.avatar_url
              ? (
                  <Image
                    src={user.profile.avatar_url}
                    alt={user.profile.fullname ?? 'Avatar'}
                    width={64}
                    height={64}
                    className="rounded-full border"
                  />
                )
              : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border bg-gray-200 text-gray-500">
                    N/A
                  </div>
                )}
            <div>
              <p className="text-lg font-semibold">
                {user.profile?.fullname ?? 'No name'}
              </p>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>

          {/* Role & Status */}
          <div className="flex items-center gap-2">
            <Badge className={cn(roleColor(user.role))}>{user.role}</Badge>
            <Badge variant={user.is_active ? 'default' : 'secondary'}>
              {user.is_active ? 'ACTIVE' : 'INACTIVE'}
            </Badge>
          </div>

          {/* Dates */}
          <div className="space-y-1 text-sm">
            <p>
              <span className="font-medium">Created at:</span>
              {' '}
              {user.createdAt
                ? new Date(user.createdAt).toLocaleString()
                : '—'}
            </p>
            <p>
              <span className="font-medium">Last updated:</span>
              {' '}
              {user.updatedAt
                ? new Date(user.updatedAt).toLocaleString()
                : '—'}
            </p>
          </div>

          {/* Default address if CUSTOMER */}
          {user.role === 'CUSTOMER' && user.default_address && (
            <div className="text-sm">
              <span className="font-medium">Default address:</span>
              {' '}
              {user.default_address}
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
