import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Clock, Lock, LogOut, Shield, User, type LucideIcon } from 'lucide-react';

type Section = 'info' | 'password' | 'reservations';

interface ProfileSidebarProps {
  activeSection: Section;
  onSectionChange: (section: Section) => void;
  onLogout: () => void;
  labels: {
    accountSettings: string;
    profileUpdateInfo: string;
    profileChangePassword: string;
    reservationsTitle: string;
    headerLogout: string;
  };
}

const itemClass =
  'inline-flex min-h-11 shrink-0 items-center gap-2.5 whitespace-nowrap rounded-xl px-3.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-card lg:w-full lg:justify-start';

/**
 * Account navigation. Below `lg` it is a horizontally scrollable segmented
 * control; from `lg` it becomes a vertical list in a sticky card.
 */
export const ProfileSidebar = ({
  activeSection,
  onSectionChange,
  onLogout,
  labels,
}: ProfileSidebarProps) => {
  const items: { id: Section; label: string; icon: LucideIcon }[] = [
    { id: 'info', label: labels.profileUpdateInfo, icon: User },
    { id: 'password', label: labels.profileChangePassword, icon: Lock },
    { id: 'reservations', label: labels.reservationsTitle, icon: Clock },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
      className="w-full shrink-0 lg:w-64"
    >
      <div className="rounded-2xl border border-border/80 bg-card p-1.5 shadow-layered lg:sticky lg:top-28 lg:p-4">
        <h2 className="mb-3 hidden items-center gap-2 px-1 font-serif text-lg font-semibold text-foreground lg:flex">
          <Shield className="h-5 w-5 text-brass-strong" aria-hidden="true" />
          {labels.accountSettings}
        </h2>
        <nav aria-label={labels.accountSettings} className="no-scrollbar flex gap-1 overflow-x-auto p-1 lg:flex-col lg:gap-1.5 lg:overflow-visible lg:p-0">
          {items.map(({ id, label, icon: Icon }) => {
            const active = activeSection === id;
            return (
              <button
                key={id}
                type="button"
                aria-current={active ? 'page' : undefined}
                onClick={() => onSectionChange(id)}
                className={cn(
                  itemClass,
                  active
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-foreground hover:bg-accent',
                )}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{label}</span>
              </button>
            );
          })}
          <span aria-hidden="true" className="mx-1 my-2 hidden h-px bg-border lg:block" />
          <button
            type="button"
            onClick={onLogout}
            className={cn(itemClass, 'text-destructive hover:bg-destructive/10')}
          >
            <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{labels.headerLogout}</span>
          </button>
        </nav>
      </div>
    </motion.div>
  );
};
