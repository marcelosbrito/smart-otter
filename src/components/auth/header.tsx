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
  {/* Background / Frame */}
  <rect
    x="1.5"
    y="1.5"
    width="37"
    height="37"
    rx="6"
    fill="currentColor"
  />

  {/* Otter head — negative space */}
  <path
    d="
      M10 15
      C10 10 14 7 20 7
      C26 7 30 10 30 15
      C32 16 33 18 33 21
      C33 28 27 33 20 33
      C13 33 7 28 7 21
      C7 18 8 16 10 15Z
    "
    fill="var(--background)"
  />

  {/* Eyes */}
  <circle
    cx="15"
    cy="18"
    r="1.7"
    fill="currentColor"
  />

  <circle
    cx="25"
    cy="18"
    r="1.7"
    fill="currentColor"
  />

  {/* Muzzle */}
  <ellipse
    cx="20"
    cy="24"
    rx="5"
    ry="3.5"
    fill="currentColor"
  />

  {/* Nose */}
  <ellipse
    cx="20"
    cy="23"
    rx="1.8"
    ry="1.2"
    fill="var(--background)"
  />

  {/* Mouth */}
  <path
    d="M20 24.2V26.5"
    stroke="var(--background)"
    strokeWidth="1.2"
    strokeLinecap="round"
  />

  <path
    d="M20 26.5C19 27.4 18.1 27.5 17.3 27"
    stroke="var(--background)"
    strokeWidth="1.2"
    strokeLinecap="round"
  />

  <path
    d="M20 26.5C21 27.4 21.9 27.5 22.7 27"
    stroke="var(--background)"
    strokeWidth="1.2"
    strokeLinecap="round"
  />
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
        <DevDrawer />
        <ThemeToggle />
        <ClientAuth />
      </div>
    </header>
  );
}
