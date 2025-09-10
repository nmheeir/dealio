import type React from 'react';
import { GalleryVerticalEnd } from 'lucide-react';
import { Geist, Geist_Mono } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import { Toaster } from 'sonner';

const geistSans = Geist({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist-sans',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist-mono',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body className="font-sans">
        <div className="grid h-svh lg:grid-cols-2">
          {/* Ảnh sang trái */}
          <div className="relative hidden bg-muted lg:block">
            <Image
              src="/images/auth-layout.webp"
              alt="Background"
              fill
              className="object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>

          {/* Form sang phải */}
          <div className="flex flex-col gap-4 p-6 md:p-10">
            <div className="flex justify-center gap-2 md:justify-start">
              <Link href="/" className="flex items-center gap-2 font-medium">
                <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                Dealio Inc.
              </Link>
            </div>
            <div className="flex flex-1 items-center justify-center">
              <div className="w-full max-w-xs">
                {children}
                <Toaster richColors />
              </div>
            </div>
          </div>
        </div>
      </body>

    </html>
  );
}
