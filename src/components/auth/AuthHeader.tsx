import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AuthHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
}

export const AuthHeader = ({ title, subtitle, icon }: AuthHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
      className="mb-6 text-center"
    >
      {icon && (
        <div className="mb-5">
          {icon}
        </div>
      )}
      <h1 className="font-serif text-2xl font-semibold text-balance text-foreground sm:text-3xl">
        {title}
      </h1>
      {subtitle && (
        <p className="mx-auto mt-2 max-w-sm break-words text-sm leading-relaxed text-muted-foreground">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
};
