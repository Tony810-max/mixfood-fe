import { useUiText } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AuthLogoProps {
  icon?: ReactNode;
}

/**
 * Brand lockup shown at the top of each auth card: the existing round logo
 * (or a step icon) with a brass ring, above the Mix Food wordmark.
 */
export const AuthLogo = ({ icon }: AuthLogoProps) => {
  const ui = useUiText();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
      className="mb-5 flex flex-col items-center gap-2"
    >
      <div className="h-16 w-16 overflow-hidden rounded-full bg-secondary p-1 ring-1 ring-brass/60 ring-offset-2 ring-offset-card">
        {icon || (
          <img
            src="/favicon.jpg"
            alt={ui("Mix Food Logo")}
            className="h-full w-full rounded-full object-cover"
          />
        )}
      </div>
      <span className="font-serif text-sm font-semibold tracking-wide text-brass-strong">Mix Food</span>
    </motion.div>
  );
};
