/* eslint-disable no-console */
'use client';

import { useRouter } from 'next/navigation';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

export function OauthSigninButton() {
  const router = useRouter();
  const isMobile = useIsMobile();

  const handleGoogleLogin = () => {
    const googleAuthUrl = 'http://localhost:3000/api/auth/google';

    if (isMobile) {
      window.location.href = googleAuthUrl;
      return;
    }

    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open(
      googleAuthUrl,
      'google-oauth',
      `width=${width},height=${height},top=${top},left=${left},status=no,toolbar=no,menubar=no`,
    );

    const listener = (event: MessageEvent) => {
      console.log('Got message:', event);
      // TODO: not equal (fix later)
      if (event.origin === window.location.origin) {
        console.info('Event origin:', event.origin);
        console.info('Window location origin:', window.location.origin);
        return;
      }

      if (event.data.type === 'OAUTH_SUCCESS') {
        router.replace('/');
        window.removeEventListener('message', listener);
        if (popup && !popup.closed) {
          popup.close();
        }
      }
    };

    window.addEventListener('message', listener);
  };

  return (
    <Button
      variant="outline"
      type="button"
      className="w-full"
      onClick={handleGoogleLogin}
    >
      <Icons.google />
      <span className="sr-only">Login with Google</span>
    </Button>
  );
}
