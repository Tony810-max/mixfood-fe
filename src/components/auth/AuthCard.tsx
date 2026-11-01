import { cn } from '@/lib/utils';
import { MotionConfig } from 'framer-motion';
import { ReactNode } from 'react';

interface AuthCardProps {
  children: ReactNode;
  className?: string;
}

/**
 * Page shell for every auth screen: ivory paper, content centred under the
 * fixed site header. MotionConfig makes all framer-motion children honour the
 * visitor's reduced-motion preference.
 */
export const AuthCard = ({ children, className }: AuthCardProps) => {
  return (
    <MotionConfig reducedMotion="user">
      <div className={cn("min-h-screen bg-background", className)}>
        <main className="flex min-h-screen items-center justify-center px-4 pb-12 pt-24 sm:pt-28">
          <div className="w-full max-w-md">
            {children}
          </div>
        </main>
      </div>
    </MotionConfig>
  );
};
