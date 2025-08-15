'use client';

import { LoaderCircleIcon } from 'lucide-react';
import React from 'react';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { logger } from '@/libs/Logger';

const oauthProviders = [
  { name: 'Google', strategy: 'oauth_google', icon: 'google' },
  { name: 'Discord', strategy: 'oauth_discord', icon: 'discord' },
  { name: 'Facebook', strategy: 'oauth_facebook', icon: 'facebook' },
] satisfies {
  name: string;
  icon: keyof typeof Icons;
  strategy: string;
}[];

export function OAuthSignIn() {
  const [loading, setLoading] = React.useState<string | null>(null);

  // Fake OAuth sign-in
  async function oauthSignIn(providerStrategy: string) {
    try {
      setLoading(providerStrategy); // đánh dấu provider đang login

      // Giả lập network delay 500ms
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Fake login success
      logger.info(`Logged in with ${providerStrategy}`);

      // Ở đây bạn có thể redirect hoặc lưu session giả
      // window.location.href = '/'; // ví dụ redirect
    } catch (err) {
      logger.info(err as string);
    } finally {
      setLoading(null); // reset loading
    }
  }

  return (
    <div className="flex w-full flex-col items-center gap-2 sm:flex-row sm:gap-4">
      {oauthProviders.map((provider) => {
        const Icon = Icons[provider.icon];

        return (
          <Button
            key={provider.strategy}
            variant="outline"
            className="w-full bg-background sm:flex-1"
            onClick={() => void oauthSignIn(provider.strategy)}
            disabled={loading !== null}
          >
            {loading === provider.strategy
              ? (
                  <LoaderCircleIcon
                    className="mr-2 size-4 animate-spin"
                    aria-hidden="true"
                  />
                )
              : (
                  <Icon className="mr-2 size-4" aria-hidden="true" />
                )}
            {provider.name}
            <span className="sr-only">{provider.name}</span>
          </Button>
        );
      })}
    </div>

  );
}
