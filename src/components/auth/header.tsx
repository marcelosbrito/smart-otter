'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ClientAuth from './client-auth';
import ThemeToggle from '@/components/ui/theme-toggle';
import DevDrawer from '@/components/dev-drawer/DevDrawer';

const OtterIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 40 40"
    fill="none"
    className="size-5 text-current"
    aria-hidden="true"
  >
    <rect x="1" y="1" width="38" height="38" rx="6" stroke="currentColor" strokeWidth="2.5" />
    <ellipse cx="20" cy="20" rx="14" ry="13" fill="none" stroke="currentColor" strokeWidth="2" />
    <circle cx="14" cy="17" r="2" fill="currentColor" />
    <circle cx="26" cy="17" r="2" fill="currentColor" />
    <ellipse cx="20" cy="23" rx="5" ry="3.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <line x1="18" y1="24" x2="18" y2="26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="22" y1="24" x2="22" y2="26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 border-b transition-all duration-200 ${
        scrolled
          ? 'bg-white/70 dark:bg-[#061826]/80 backdrop-blur-md shadow-sm'
          : 'bg-background'
      }`}
    >
      <div className="flex items-center gap-8">
        <Link href="/" className="font-bold text-lg tracking-tight flex items-center gap-2">
          <OtterIcon />
          Smart Otter
        </Link>
        <nav className="flex items-center gap-2 text-sm">
          <Link href="/search" className="text-muted-foreground hover:text-foreground transition-colors">
            Search
          </Link>
        </nav>
      </div>

      <div className="flex items-center gap-2">
        {process.env.NODE_ENV === 'development' && (
          <DevDrawer />
        )}
        <ThemeToggle />
        <ClientAuth />
      </div>
    </header>
  );
}
