'use client';

import { useRouter } from 'next/navigation';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { useClickOutside } from '@/hooks/use-click-outside';
import { cn } from '@/libs/utils';
import { Icons } from './icons';

type DialogShellProps = {} & React.HTMLAttributes<HTMLDivElement>;

export function DialogShell({
  children,
  className,
  ...props
}: DialogShellProps) {
  const router = useRouter();
  const shellRef = React.useRef<HTMLDivElement>(null);

  // Close the dialog when the user presses the escape key
  React.useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        router.back();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [router]);

  // Close the dialog when the user clicks outside of it
  useClickOutside({
    ref: shellRef,
    handler: () => router.back(),
  });

  return (
    <div ref={shellRef} className={cn(className)} {...props}>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 size-auto shrink-0 rounded-sm opacity-70 ring-offset-background transition-opacity hover:bg-transparent hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        onClick={() => router.back()}
      >
        <Icons.cross className="size-4" aria-hidden="true" />
        <span className="sr-only">Close</span>
      </Button>
      {children}
    </div>
  );
}
