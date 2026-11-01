import { type LucideIcon } from 'lucide-react';
import { type ReactNode } from 'react';

interface ProfileSectionProps {
  icon: LucideIcon;
  title: string;
  /** Unique id used to label the section landmark. */
  id: string;
  children: ReactNode;
}

/** Card wrapper shared by the account forms: icon, serif title, brass hairline, body. */
export const ProfileSection = ({ icon: Icon, title, id, children }: ProfileSectionProps) => (
  <section aria-labelledby={id} className="rounded-2xl border border-border/80 bg-card p-5 shadow-layered sm:p-7">
    <div className="mb-6 flex items-center gap-3">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <h2 id={id} className="font-serif text-xl font-semibold text-foreground">{title}</h2>
        <span aria-hidden="true" className="mt-1.5 block h-px w-10 bg-brass" />
      </div>
    </div>
    {children}
  </section>
);
