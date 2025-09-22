import Link from 'next/link';
import { Icons } from '../icons';
import WebLogo from './logo';
import { ModeToggle } from './mode-toggle';

export function SiteFooter() {
  const linkSections = [
    {
      title: 'WEBSITE?',
      links: [
        { text: 'Home', path: '/' },
        { text: 'Privacy Policy', path: '/' },
      ],
    },
    {
      title: 'CONTACT',
      links: [
        { text: '+1-212-456-7890', path: '/' },
        { text: 'gch-console-shop@mail.com', path: '/' },
        { text: '123 Sine Pt, 94102', path: '/' },
      ],
    },
  ];

  const socialLinks = [
    { href: 'https://www.facebook.com', icon: Icons.facebook },
    { href: 'https://www.instagram.com', icon: Icons.google }, // tạm dùng google nếu chưa có instagram
    { href: 'https://twitter.com', icon: Icons.gitHub }, // tạm dùng github nếu chưa có twitter
    { href: 'https://www.linkedin.com', icon: Icons.google }, // tạm dùng google nếu chưa có linkedin
  ];

  return (
    <footer className="bg-white dark:bg-black">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-start justify-between gap-10 border-b border-slate-200 py-10
                        text-slate-600 md:flex-row dark:border-zinc-800 dark:text-zinc-400"
        >
          <div>
            <WebLogo />
            <p className="mt-6 max-w-[410px] text-sm text-slate-600 dark:text-zinc-400">
              Welcome to
              {' '}
              <span className="font-semibold">GCH Console Shop</span>
              ,
              a trusted system for gaming devices and accessories. From the latest consoles
              to essential gea`r and peripherals, we provide everything you need to enhance
              your gaming experience — all in one place.
            </p>

            <div className="mt-5 flex items-center gap-3">
              {socialLinks.map((link, i) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={i}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-slate-100
                               text-slate-700 transition hover:scale-105 hover:border-green-500 hover:text-green-600
                               dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:text-green-500"
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="flex w-full flex-wrap justify-between gap-5 text-sm md:w-[45%] ">
            {linkSections.map((section, index) => (
              <div key={index}>
                <h3 className="mb-3 font-medium text-slate-800 md:mb-5 dark:text-zinc-200">
                  {section.title}
                </h3>
                <ul className="space-y-2.5">
                  {section.links.map((link, i) => (
                    <li key={i}>
                      <Link
                        href={link.path}
                        className="text-slate-600 transition hover:underline dark:text-zinc-400 dark:hover:text-zinc-200"
                      >
                        {link.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between py-4">
          <p className="text-sm text-slate-500 dark:text-zinc-600">
            Copyright 2025 © gocart All Right Reserved.
          </p>
          <ModeToggle />
        </div>

      </div>
    </footer>
  );
}
