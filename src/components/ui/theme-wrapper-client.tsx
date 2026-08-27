'use client';

import { ThemeProvider } from 'next-themes';

export default function ThemeWrapperClient({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      {children}
    </ThemeProvider>
  );
}
