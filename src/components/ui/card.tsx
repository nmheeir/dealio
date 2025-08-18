import * as React from 'react';

import { cn } from '@/libs/utils';

const Card = ({ ref, className, as: Comp = 'div', ...props }: React.HTMLAttributes<HTMLDivElement> & {
  as?: 'div' | 'section' | 'article';
} & { ref?: React.RefObject<HTMLDivElement | null> }) => (
  <Comp
    ref={ref}
    className={cn(
      'rounded-xl border bg-card text-card-foreground shadow',
      className,
    )}
    {...props}
  />
);
Card.displayName = 'Card';

const CardHeader = ({ ref, className, ...props }: React.HTMLAttributes<HTMLDivElement> & { ref?: React.RefObject<HTMLDivElement | null> }) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
);
CardHeader.displayName = 'CardHeader';

const CardTitle = ({ ref, className, as: Comp = 'h3', ...props }: React.HTMLAttributes<HTMLHeadingElement> & { as?: 'h1' | 'h2' | 'h3' | 'h4' } & { ref?: React.RefObject<HTMLParagraphElement | null> }) => (
  <Comp
    ref={ref}
    className={cn('font-semibold leading-tight tracking-tight', className)}
    {...props}
  />
);
CardTitle.displayName = 'CardTitle';

const CardDescription = ({ ref, className, ...props }: React.HTMLAttributes<HTMLParagraphElement> & { ref?: React.RefObject<HTMLParagraphElement | null> }) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
);
CardDescription.displayName = 'CardDescription';

const CardContent = ({ ref, className, ...props }: React.HTMLAttributes<HTMLDivElement> & { ref?: React.RefObject<HTMLDivElement | null> }) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
);
CardContent.displayName = 'CardContent';

const CardFooter = ({ ref, className, ...props }: React.HTMLAttributes<HTMLDivElement> & { ref?: React.RefObject<HTMLDivElement | null> }) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
);
CardFooter.displayName = 'CardFooter';

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
