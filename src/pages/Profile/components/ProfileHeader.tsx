import { motion } from 'framer-motion';
import { Calendar, Shield } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ProfileHeaderProps {
  user: {
    name?: string;
    email?: string;
    createdAt?: string;
  } | null;
}

export const ProfileHeader = ({ user }: ProfileHeaderProps) => {
  const { t } = useLanguage();

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).getFullYear()
    : new Date().getFullYear();

  const displayName = user?.name || t.headerUser;
  const initial = displayName.trim().charAt(0).toLocaleUpperCase() || 'M';

  return (
    <div className="relative border-b border-border/70 bg-secondary/50">
      <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-brass/40" />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
          className="flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:gap-6"
        >
          {/* Avatar: initial on basil, brass ring */}
          <div
            aria-hidden="true"
            className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-primary font-serif text-3xl font-semibold text-primary-foreground ring-1 ring-brass/70 ring-offset-4 ring-offset-secondary sm:h-24 sm:w-24 sm:text-4xl"
          >
            {initial}
          </div>

          <div className="w-full min-w-0 flex-1 text-center sm:w-auto sm:text-left">
            <h1 className="truncate font-serif text-3xl font-semibold text-foreground sm:text-4xl" title={displayName}>
              {displayName}
            </h1>
            <p className="mt-1 truncate text-base text-muted-foreground" title={user?.email}>{user?.email}</p>
            <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-foreground/80 sm:justify-start">
              <li className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 shrink-0 text-brass-strong" aria-hidden="true" />
                <span>{t.profileMemberSince} {memberSince}</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Shield className="h-4 w-4 shrink-0 text-brass-strong" aria-hidden="true" />
                <span>{t.profileVerifiedAccount}</span>
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
