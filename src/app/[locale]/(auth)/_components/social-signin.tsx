import React from 'react';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { OauthSigninButton } from './oauth-signin-button';

export function SocialSignin() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <OauthSigninButton />
      <Button variant="outline" type="button" className="w-full">
        <Icons.meta />
        <span className="sr-only">Login with Meta</span>
      </Button>
    </div>
  );
}
