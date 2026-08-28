import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-border mt-auto">
      <div className="flex flex-col items-center justify-between gap-3 px-6 py-4 text-sm max-w-5xl mx-auto md:flex-row">
        <Link href="/" className="font-semibold tracking-tight">Smart Otter</Link>

        <nav className="flex items-center gap-4" aria-label="Footer navigation">
          <Link href="/changelog" className="text-muted-foreground hover:text-foreground transition-colors">
            Changelog
          </Link>
          <Link href="/faq" className="text-muted-foreground hover:text-foreground transition-colors">
            FAQ
          </Link>
          <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
            Privacy
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <span className="text-muted-foreground">
            Created by{' '}
            <a
              href="https://github.com/marcelosbrito"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors underline-offset-4 hover:underline"
            >
              Marcelo Brito
            </a>
          </span>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com/marcelosbrito/smart-otter"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub repository"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237.85 1.456 2.232 1.033 2.773-.635.07-.483.267-.916.485-1.13-1.699-.24-2.873-.798-3.575-2.054 0-1.116.479-1.979 1.09-2.436-.084-.533-.417-1.07-.948-1.31-3.308-.03-5.663 1.58-6.363 2.371-.553.394-.946.919-1.07 1.428-.004.012-.008.024-.011.036l-.001.003c-.001.003-.001.007-.002.01l-.001.005v.002c-.001.004-.001.008-.001.012 0 .003 0 .006.001.009 0 .003 0 .007.001.01l.001.003c.003.014.008.028.015.041.136.34.527.859 1.527 1.359 1.001.5 2.284.687 3.434.687 1.149 0 2.432-.187 3.433-.687 1-.5 1.39-1.019 1.526-1.359.007-.013.012-.027.015-.041l.001-.003c.001-.003.001-.007.001-.01 0-.003 0-.006-.001-.009v-.002c0-.003 0-.007-.001-.01l-.001-.005c-.003-.014-.008-.028-.015-.041z" />
              </svg>
            </a>
            <a
              href="https://x.com/_marcelo_brito"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (Twitter) profile"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.69l7.265-8.355L3.003 2.25h7.264l4.386 5.77Zm-2.07 14.625h2.335L6.59 4.25H4.138Z" />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/marcelosbrito/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.429-1.85 3.665 0 4.351 2.419 4.351 4.626v5.115ZM5.241 6.945C6.832 6.945 8.127 5.582 8.127 3.932c0-1.65-1.294-3.013-2.885-3.013S2.356 2.282 2.356 3.932c0 1.65 1.295 3.013 2.885 3.013Zm1.779 13.507h-3.558V9h3.558v11.452Z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
