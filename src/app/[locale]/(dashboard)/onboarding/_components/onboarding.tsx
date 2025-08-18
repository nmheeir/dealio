'use client';

import { AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import CreateStore from './create-store';
import { Intro } from './intro';

type OnboardingProps = {
  userId: string;
};

export default function Onboarding({ userId }: OnboardingProps) {
  const search = useSearchParams();
  const step = search.get('step');

  return (
    <AnimatePresence mode="wait">
      {!step && <Intro key="intro" />}
      {step === 'create' && <CreateStore userId={userId} />}
    </AnimatePresence>
  );
}
