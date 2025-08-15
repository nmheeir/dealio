'use client';

import type { ButtonProps } from '@/components/ui/button';
import { Button } from '@/components/ui/button';
import { cn } from '@/libs/utils';

type ClientButtonProps = {} & ButtonProps;

export function ClientButton({ className, ...props }: ClientButtonProps) {
  return <Button className={cn(className)} {...props}></Button>;
}
