import Link from 'next/link';

export default function WebLogo() {
  return (
    <Link href="/" className="relative text-xl font-semibold text-slate-700">
      <span className="text-green-600">GCH Console </span>
      Shop
      <span className="text-2xl leading-0 text-green-600">.</span>
    </Link>
  );
}
