import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { type ChangePasswordFormData } from '@/lib/validation';
import { Loader2, Lock } from 'lucide-react';
import { ProfileSection } from './ProfileSection';

interface ChangePasswordFormProps {
  formData: ChangePasswordFormData;
  errors: Partial<Record<keyof ChangePasswordFormData, string>>;
  isLoading: boolean;
  onInputChange: (field: keyof ChangePasswordFormData, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  labels: {
    title: string;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
    currentPasswordPlaceholder: string;
    newPasswordPlaceholder: string;
    confirmPasswordPlaceholder: string;
    save: string;
    saving: string;
  };
}

const invalidClass = 'border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20';

export const ChangePasswordForm = ({
  formData,
  errors,
  isLoading,
  onInputChange,
  onSubmit,
  labels,
}: ChangePasswordFormProps) => {
  return (
    <ProfileSection id="profile-password-title" icon={Lock} title={labels.title}>
      <form onSubmit={onSubmit} className="space-y-5" aria-busy={isLoading}>
        <div className="space-y-1.5">
          <Label htmlFor="currentPassword">{labels.currentPassword}</Label>
          <Input
            id="currentPassword"
            type="password"
            autoComplete="current-password"
            value={formData.currentPassword}
            onChange={(e) => onInputChange('currentPassword', e.target.value)}
            placeholder={labels.currentPasswordPlaceholder}
            aria-invalid={errors.currentPassword ? true : undefined}
            aria-describedby={errors.currentPassword ? 'currentPassword-error' : undefined}
            className={cn(errors.currentPassword && invalidClass)}
          />
          {errors.currentPassword && <p id="currentPassword-error" role="alert" className="text-sm font-medium text-destructive">{errors.currentPassword}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="newPassword">{labels.newPassword}</Label>
          <Input
            id="newPassword"
            type="password"
            autoComplete="new-password"
            value={formData.newPassword}
            onChange={(e) => onInputChange('newPassword', e.target.value)}
            placeholder={labels.newPasswordPlaceholder}
            aria-invalid={errors.newPassword ? true : undefined}
            aria-describedby={errors.newPassword ? 'newPassword-error' : undefined}
            className={cn(errors.newPassword && invalidClass)}
          />
          {errors.newPassword && <p id="newPassword-error" role="alert" className="text-sm font-medium text-destructive">{errors.newPassword}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword">{labels.confirmPassword}</Label>
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            value={formData.confirmPassword}
            onChange={(e) => onInputChange('confirmPassword', e.target.value)}
            placeholder={labels.confirmPasswordPlaceholder}
            aria-invalid={errors.confirmPassword ? true : undefined}
            aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
            className={cn(errors.confirmPassword && invalidClass)}
          />
          {errors.confirmPassword && <p id="confirmPassword-error" role="alert" className="text-sm font-medium text-destructive">{errors.confirmPassword}</p>}
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full active:scale-[0.98] sm:w-auto"
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="animate-spin" aria-hidden="true" /> : <Lock aria-hidden="true" />}
          {isLoading ? labels.saving : labels.save}
        </Button>
      </form>
    </ProfileSection>
  );
};
