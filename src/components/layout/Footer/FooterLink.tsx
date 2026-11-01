import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export function FooterLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link
      to={to}
      className="inline-flex min-h-11 items-center rounded-sm text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
    >
      {children}
    </Link>
  );
}
