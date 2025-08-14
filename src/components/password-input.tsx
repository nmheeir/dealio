'use client';

import { EyeIcon, EyeOffIcon } from 'lucide-react';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { cn } from '@/libs/utils';

const PasswordInput = ({ ref, className, ...props }: React.ComponentProps<'input'>) => {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="relative">
      <Input
        type={showPassword ? 'text' : 'password'}
        className={cn('pr-10', className)}
        ref={ref}
        {...props}
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="absolute top-0 right-0 h-full px-3 py-1 hover:bg-transparent"
        onClick={() => setShowPassword(prev => !prev)}
        disabled={props.value === '' || props.disabled}
      >
        {showPassword
          ? (
              <EyeIcon className="size-4" aria-hidden="true" />
            )
          : (
              <EyeOffIcon className="size-4" aria-hidden="true" />
            )}
        <span className="sr-only">
          {showPassword ? 'Hide password' : 'Show password'}
        </span>
      </Button>
    </div>
  );
};
PasswordInput.displayName = 'PasswordInput';

export { PasswordInput };
