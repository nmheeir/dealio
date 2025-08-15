import type { ButtonProps } from '@/components/ui/button';
import Link from 'next/link';

import * as React from 'react';
import { Icons } from '@/components/icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { getStoreByUserId } from '@/libs/queries/store';
import { cn } from '@/libs/utils';

type AuthDropdownProps = {
  user: string | null;
} & React.ComponentPropsWithRef<typeof DropdownMenuTrigger> & ButtonProps;

export async function AuthDropdown({
  user,
  className,
  ...props
}: AuthDropdownProps) {
  if (!user) {
    return (
      <Button size="sm" className={cn(className)} {...props} asChild>
        <Link href="/signin">
          Sign In
          <span className="sr-only">Sign In</span>
        </Link>
      </Button>
    );
  }

  const initials = `${user?.charAt(0) ?? ''} ${
    user?.charAt(0) ?? ''
  }`;

  const storePromise = getStoreByUserId({ userId: user });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          className={cn('size-8 rounded-full', className)}
          {...props}
        >
          <Avatar className="size-8">
            <AvatarImage src={user} alt={user ?? ''} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm leading-none font-medium">
              John
              {' '}
              Doe
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              test@test.com
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <React.Suspense
          fallback={(
            <div className="flex flex-col space-y-1.5 p-1">
              {Array.from({ length: 3 }).map((_, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <Skeleton key={i} className="h-6 w-full rounded-sm" />
              ))}
            </div>
          )}
        >
          <AuthDropdownGroup storePromise={storePromise} />
        </React.Suspense>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/signout">
            <Icons.logout className="mr-2 size-4" aria-hidden="true" />
            Log out
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

type AuthDropdownGroupProps = {
  storePromise: ReturnType<typeof getStoreByUserId>;
};

async function AuthDropdownGroup({ storePromise }: AuthDropdownGroupProps) {
  const store = await storePromise;

  return (
    <DropdownMenuGroup>
      <DropdownMenuItem asChild>
        <Link href={store ? `/store/${store.id}` : '/onboarding'}>
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
