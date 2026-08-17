import Link from 'next/link';
import ClientAuth from './client-auth';

export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-border">
      <div className="flex items-center gap-8">
        <Link href="/" className="font-bold text-lg tracking-tight">
          Smart Otter
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/search" className="text-muted-foreground hover:text-foreground transition-colors">
            Search
          </Link>
          <ClientAuth />
        </nav>
      </div>

      <ClientAuth />
    </header>
  );
}
