import Link from 'next/link';

export default function WebLogo() {
  return (
    <Link
      href="/"
      className="relative text-xl font-semibold text-slate-700 dark:text-slate-200"
    >
      <span className="text-green-600 dark:text-green-500">GCH Console </span>
      Shop
      <span className="text-2xl leading-0 text-green-600 dark:text-green-500">
        .
      </span>
    </Link>
  );
}
