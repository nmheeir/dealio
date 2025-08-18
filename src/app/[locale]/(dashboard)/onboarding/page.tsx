import type { Metadata } from 'next';
import React from 'react';
import { GridPattern } from '@/components/grid-pattern';
import { Shell } from '@/components/shell';
import { Skeleton } from '@/components/ui/skeleton';
import Onboarding from './_components/onboarding';

export const metadata: Metadata = {
  title: 'Onboarding',
  description: 'Get started with your new store',
};

export default function OnboardingPage() {
  const userId = '1';

  return (
    <Shell className="h-[calc(100vh-4rem)] max-w-screen-sm">
      <GridPattern
        width={30}
        height={30}
        x={-1}
        y={-1}
        strokeDasharray="4 2"
        className="[mask-image:radial-gradient(300px_circle_at_left_top,white,transparent)]"
      />
      <React.Suspense fallback={<Skeleton className="size-full" />}>
        <Onboarding userId={userId} />
      </React.Suspense>
    </Shell>
  );
}
