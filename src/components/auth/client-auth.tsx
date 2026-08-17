'use client';

import { Show, SignInButton, UserButton } from '@clerk/nextjs';
import Link from 'next/link';

export default function ClientAuth() {
  return (
    <>
      <Show when={session => !!session}>
        <Link href="/favorites" className="text-muted-foreground hover:text-foreground transition-colors">
          Favorites
        </Link>
      </Show>
      <div className="flex items-center gap-4">
        <SignInButton mode="modal">Sign In</SignInButton>
        <Show when={session => !!session}>
          <UserButton appearance={{ elements: { avatarBox: 'w-8 h-8' } }} />
        </Show>
      </div>
    </>
  );
}
