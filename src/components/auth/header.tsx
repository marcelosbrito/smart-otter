import Link from 'next/link';
import ClientAuth from './client-auth';
import ThemeToggle from '@/components/ui/theme-toggle';
import DevDrawer from '@/components/dev-drawer/DevDrawer';

export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-border">
      <div className="flex items-center gap-8">
        <Link href="/" className="font-bold text-lg tracking-tight">
          Smart Otter
        </Link>
        <nav className="flex items-center gap-2 text-sm">
          <Link href="/search" className="text-muted-foreground hover:text-foreground transition-colors">
            Search
          </Link>
          <ThemeToggle />
        </nav>
      </div>

      <div className="flex items-center gap-2">
        {process.env.NODE_ENV === 'development' && (
          <DevDrawer />
        )}
        <ClientAuth />
      </div>
    </header>
  );
}
