'use client';

import type { ButtonProps } from '@/components/ui/button';

import Link from 'next/link';
import * as React from 'react';
import { useAuth } from '@/api/auth/auth-context';
import { Icons } from '@/components/icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/libs/utils';

type AuthDropdownProps = {
  className?: string;
} & React.ComponentPropsWithRef<typeof DropdownMenuTrigger> & ButtonProps;

export function AuthDropdown({
  className,
  ...props
}: AuthDropdownProps) {
  const { user, loading, logout, isAuthenticated } = useAuth();

  if (loading) {
    return null;
  }

  if (!isAuthenticated || !user) {
    return (
      <Button size="sm" className={cn(className)} {...props} asChild>
        <Link href="/signin">
          Sign In
          <span className="sr-only">Sign In</span>
        </Link>
      </Button>
    );
  }

  const initials = `${user.fullname.charAt(0) ?? ''}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className={cn('flex cursor-pointer items-center gap-3 rounded p-2 hover:bg-accent', className)}>
          {/* Avatar */}
          <Avatar className="size-8 rounded-sm">
            <AvatarImage src={user.avatar_url} alt={user.avatar_url ?? ''} />
            <AvatarFallback className="size-8 rounded-sm">{initials}</AvatarFallback>
          </Avatar>

          {/* User info */}
          <div className="hidden flex-col space-y-1 sm:flex">
            <p className="text-sm leading-none font-medium">
              {user.fullname}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.role ?? 'conc cac'}
            </p>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <div className="block px-2 py-1.5 sm:hidden">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium">{user.fullname}</span>
            <span className="text-xs text-muted-foreground">{user.role ?? 'User'}</span>
          </div>
        </div>
        <AuthDropdownGroup />
        <DropdownMenuSeparator />
        {/* Logout button */}
        <DropdownMenuItem asChild>
          <Link
            href=""
            onClick={(e) => {
              e.preventDefault();
              logout();
            }}
          >
            <Icons.logout className="mr-2 size-4 shrink-0" aria-hidden="true" />
            <span className="flex-1 text-left">Logout</span>
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </Link>
        </DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// TODO: show billing, history, ....

function AuthDropdownGroup() {
  return (
    <DropdownMenuGroup>
      <DropdownMenuItem asChild>
        <Link href="/dashboard">
          <Icons.layoutDashboard className="mr-2 size-4" aria-hidden="true" />
          Dashboard
          <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link href="/dashboard/billing">
          <Icons.creditCard className="mr-2 size-4" aria-hidden="true" />
          Billing
          <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link href="/dashboard/settings">
          <Icons.settings className="mr-2 size-4" aria-hidden="true" />
          Settings
          <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
        </Link>
      </DropdownMenuItem>
    </DropdownMenuGroup>
  );
}
