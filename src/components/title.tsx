'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { Button } from './ui/button';

type TitleProps = {
  title: string;
  description: string;
  visibleButton?: boolean;
  href?: string;
};

export function Title({
  title,
  description,
  visibleButton = true,
  href = '',
}: TitleProps) {
  return (
    <div className="flex items-center justify-center gap-6 text-center">
      <div>
        <h2 className="text-2xl font-semibold text-slate-800">{title}</h2>
        <p className="text-sm text-slate-600">{description}</p>
      </div>
      {visibleButton && (
        <Link href={href}>
          <Button
            variant="ghost"
            className="flex items-center gap-1 border-green-600 text-green-600 hover:bg-green-50"
          >
            View more
            <ArrowRight size={14} />
          </Button>
        </Link>
      )}
    </div>
  );
}
