import { SignedIn, SignedOut, SignIn, UserButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

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
          <SignedIn>
            <Link href="/favorites" className="text-muted-foreground hover:text-foreground transition-colors">
              Favorites
            </Link>
          </SignedIn>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <SignedOut>
          <SignIn />
        </SignedOut>
        <SignedIn>
          <UserButton appearance={{ elements: { avatarBox: 'w-8 h-8' } }} />
        </SignedIn>
      </div>
    </header>
  );
}
