import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Loader2, Save, User } from 'lucide-react';
import { ProfileSection } from './ProfileSection';

interface UpdateProfileFormProps {
  formData: {
    name: string;
    email: string;
    phone: string;
  };
  errors: Record<string, string>;
  isLoading: boolean;
  onInputChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  labels: {
    title: string;
    fullName: string;
    email: string;
    phone: string;
    fullNamePlaceholder: string;
    emailPlaceholder: string;
    phonePlaceholder: string;
    emailNote: string;
    save: string;
    saving: string;
  };
}

export const UpdateProfileForm = ({
  formData,
  errors,
  isLoading,
  onInputChange,
  onSubmit,
  labels,
}: UpdateProfileFormProps) => {
  return (
    <ProfileSection id="profile-info-title" icon={User} title={labels.title}>
      <form onSubmit={onSubmit} className="space-y-5" aria-busy={isLoading}>
        <div className="space-y-1.5">
          <Label htmlFor="name">{labels.fullName}</Label>
          <Input
            id="name"
            autoComplete="name"
            value={formData.name}
            onChange={(e) => onInputChange('name', e.target.value)}
            placeholder={labels.fullNamePlaceholder}
            aria-invalid={errors.general ? true : undefined}
            aria-describedby={errors.general ? 'profile-general-error' : undefined}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">{labels.email}</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            readOnly
            aria-describedby="profile-email-note"
            placeholder={labels.emailPlaceholder}
            className="cursor-not-allowed bg-muted/60 text-muted-foreground"
          />
          <p id="profile-email-note" className="text-xs text-muted-foreground">{labels.emailNote}</p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="phone">{labels.phone}</Label>
          <Input
            id="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            value={formData.phone}
            onChange={(e) => onInputChange('phone', e.target.value)}
            placeholder={labels.phonePlaceholder}
          />
        </div>

        {errors.general && (
          <div
            id="profile-general-error"
            role="alert"
            className="flex min-w-0 items-start gap-2.5 break-words [overflow-wrap:anywhere] rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            {errors.general}
          </div>
        )}

        <Button
          type="submit"
          size="lg"
          className="w-full active:scale-[0.98] sm:w-auto"
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="animate-spin" aria-hidden="true" /> : <Save aria-hidden="true" />}
          {isLoading ? labels.saving : labels.save}
        </Button>
      </form>
    </ProfileSection>
  );
};
