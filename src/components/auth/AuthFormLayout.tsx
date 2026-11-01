import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface AuthFormLayoutProps {
  children: ReactNode;
  className?: string;
}

export const AuthFormLayout = ({ children, className }: AuthFormLayoutProps) => {
  return (
    <div
      className={cn(
        "relative rounded-2xl border border-border/80 bg-card p-6 shadow-layered sm:p-8",
        className
      )}
    >
      {/* Brass hairline along the top edge of the card */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-x-8 top-0 h-px bg-brass/70" />
      {children}
    </div>
  );
};
