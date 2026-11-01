import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUiText } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { Eye, EyeOff, type LucideIcon } from 'lucide-react';
import { type ComponentProps } from 'react';

interface PasswordToggle {
  visible: boolean;
  onToggle: () => void;
  /** Overrides the default "Show/Hide password" accessible names. */
  showLabel?: string;
  hideLabel?: string;
}

interface AuthFieldProps extends Omit<ComponentProps<typeof Input>, 'id'> {
  id: string;
  label: string;
  icon?: LucideIcon;
  error?: string;
  hint?: string;
  /** Marks the control invalid (red border) without showing a field message. */
  invalid?: boolean;
  passwordToggle?: PasswordToggle;
}

/**
 * Labelled auth input with leading icon, inline error and optional password
 * visibility toggle. Wires aria-invalid / aria-describedby so errors and hints
 * are announced with the control.
 */
export const AuthField = ({
  id,
  label,
  icon: Icon,
  error,
  hint,
  invalid,
  passwordToggle,
  className,
  ...inputProps
}: AuthFieldProps) => {
  const ui = useUiText();
  const hasError = Boolean(error) || Boolean(invalid);
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy = [error ? errorId : null, hint && !error ? hintId : null].filter(Boolean).join(' ') || undefined;

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </Label>
      <div className="relative">
        {Icon && (
          <Icon aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        )}
        <Input
          id={id}
          aria-invalid={hasError ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            Icon && 'pl-10',
            passwordToggle && 'pr-12',
            hasError && 'border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20',
            className,
          )}
          {...inputProps}
        />
        {passwordToggle && (
          <button
            type="button"
            onClick={passwordToggle.onToggle}
            className="absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={
              passwordToggle.visible
                ? passwordToggle.hideLabel ?? ui('Hide password')
                : passwordToggle.showLabel ?? ui('Show password')
            }
            aria-pressed={passwordToggle.visible}
          >
            {passwordToggle.visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      {hint && !error && (
        <p id={hintId} className="text-xs text-muted-foreground">{hint}</p>
      )}
      {error && (
        <p id={errorId} role="alert" className="text-sm font-medium text-destructive">{error}</p>
      )}
    </div>
  );
};
