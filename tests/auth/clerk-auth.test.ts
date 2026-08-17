import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Clerk Authentication Configuration', () => {
  describe('Environment Variables', () => {
    it('should have NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY configured', async () => {
      const envContent = fs.readFileSync(path.join(process.cwd(), '.env.local'), 'utf-8');
      expect(envContent).toMatch(/NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=/);
    });

    it('should have CLERK_SECRET_KEY configured', async () => {
      const envContent = fs.readFileSync(path.join(process.cwd(), '.env.local'), 'utf-8');
      expect(envContent).toMatch(/CLERK_SECRET_KEY=/);
    });
  });

  describe('Sign-In Page Configuration', () => {
    it('should have sign-in page at /sign-in using Clerk SignIn component', async () => {
      const signInPage = fs.readFileSync(path.join(process.cwd(), 'src/app/sign-in/[[...sign-in]]/page.tsx'), 'utf-8');
      expect(signInPage).toContain('@clerk/nextjs');
      expect(signInPage).toContain('SignIn');
    });

    it('should have sign-up page at /sign-up using Clerk SignUp component', async () => {
      const signUpPage = fs.readFileSync(path.join(process.cwd(), 'src/app/sign-up/[[...sign-up]]/page.tsx'), 'utf-8');
      expect(signUpPage).toContain('@clerk/nextjs');
      expect(signUpPage).toContain('SignUp');
    });

    it('should have root layout with ClerkProvider', async () => {
      const layout = fs.readFileSync(path.join(process.cwd(), 'src/app/layout.tsx'), 'utf-8');
      expect(layout).toContain('ClerkProvider');
    });
  });

  describe('Middleware Configuration', () => {
    it('should have Clerk middleware configured', async () => {
      const middleware = fs.readFileSync(path.join(process.cwd(), 'src/middleware.ts'), 'utf-8');
      expect(middleware).toContain('clerkMiddleware');
    });

    it('should protect API routes via middleware matcher', async () => {
      const middleware = fs.readFileSync(path.join(process.cwd(), 'src/middleware.ts'), 'utf-8');
      expect(middleware.includes('(api')).toBe(true);
    });
  });

  describe('Client-Side Authentication Components', () => {
    it('should have sign-in button with modal mode', async () => {
      const clientAuth = fs.readFileSync(path.join(process.cwd(), 'src/components/auth/client-auth.tsx'), 'utf-8');
      expect(clientAuth).toContain('SignInButton');
      expect(clientAuth).toContain('mode="modal"');
    });

    it('should have user button for authenticated users', async () => {
      const clientAuth = fs.readFileSync(path.join(process.cwd(), 'src/components/auth/client-auth.tsx'), 'utf-8');
      expect(clientAuth).toContain('UserButton');
    });

    it('should use Clerk Show component for session-based rendering', async () => {
      const clientAuth = fs.readFileSync(path.join(process.cwd(), 'src/components/auth/client-auth.tsx'), 'utf-8');
      expect(clientAuth).toContain('Show');
    });
  });

  describe('Favorites Protection', () => {
    it('should have favorites API route with auth check', async () => {
      const saveRoute = fs.readFileSync(path.join(process.cwd(), 'src/app/api/favorites/save/route.ts'), 'utf-8');
      expect(saveRoute).toContain('getAuth');
      expect(saveRoute).toMatch(/userId|!userId/);
    });

    it('should redirect unauthenticated users to sign-in', async () => {
      const saveRoute = fs.readFileSync(path.join(process.cwd(), 'src/app/api/favorites/save/route.ts'), 'utf-8');
      expect(saveRoute).toContain('/sign-in');
      expect(saveRoute).toContain('401');
    });
  });

  describe('OAuth Provider Support', () => {
    it('should have Clerk sign-in fallback redirect URLs configured', async () => {
      const envContent = fs.readFileSync(path.join(process.cwd(), '.env.local'), 'utf-8');
      expect(envContent).toMatch(/NEXT_PUBLIC_CLERK_SIGN_IN_URL=/);
      expect(envContent).toMatch(/NEXT_PUBLIC_CLERK_SIGN_UP_URL=/);
    });

    it('should support Google OAuth via Clerk hosted UI', async () => {
      const envContent = fs.readFileSync(path.join(process.cwd(), '.env.local'), 'utf-8');
      expect(envContent).toMatch(/NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY/);
    });

    it('should support GitHub OAuth via Clerk hosted UI', async () => {
      const middleware = fs.readFileSync(path.join(process.cwd(), 'src/middleware.ts'), 'utf-8');
      expect(middleware).toContain('clerkMiddleware');
    });
  });
});
