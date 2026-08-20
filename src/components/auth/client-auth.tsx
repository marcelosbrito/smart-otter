'use client';

import { useAuth, Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import Link from 'next/link';

export default function ClientAuth() {
  const { isSignedIn } = useAuth();

  return (
    <>
      <Show when={session => !!session}>
        <Link href="/favorites" className="text-muted-foreground hover:text-foreground transition-colors">
          Favorites
        </Link>
      </Show>
      <div className="flex items-center gap-4">
        {!isSignedIn && (
          <>
            <SignInButton mode="modal">Sign In</SignInButton>
            <SignUpButton mode="modal">Sign Up</SignUpButton>
          </>
        )}
        {isSignedIn && <UserButton appearance={{ elements: { avatarBox: 'w-8 h-8' } }} />}
      </div>
    </>
  );
}
