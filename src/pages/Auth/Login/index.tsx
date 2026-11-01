
import { AuthCard, AuthField, AuthFormLayout, AuthHeader, AuthLogo } from "@/components/auth";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { STORAGE_KEYS } from "@/constants";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { getLoginErrorMessage, useLogin } from "@/hooks/api/useAuth";
import { loginSchema, type LoginFormData } from "@/lib/validation";
import { ROUTES } from "@/utils/const";
import { authStorage } from "@/utils/storage";
import { motion } from "framer-motion";
import { AlertCircle, Loader2, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const loginMutation = useLogin();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({});
  const [rememberMe, setRememberMe] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear errors when user starts typing
    setErrors(prev => ({ ...prev, [field]: "" }));
    setLoginError(null);
  };

  const handleLogin = async (e?: React.FormEvent) => {
    // Prevent default form submission if event is provided
    if (e) {
      e.preventDefault();
    }

    console.log('[Login] handleLogin called');
    // Clear previous login error
    setLoginError(null);

    // Validate form using zod
    const result = loginSchema.safeParse(formData);

    if (!result.success) {
      console.log('[Login] Validation failed:', result.error);
      const fieldErrors: Partial<Record<keyof LoginFormData, string>> = {};
      result.error.errors.forEach((error) => {
        const field = error.path[0] as keyof LoginFormData;
        fieldErrors[field] = error.message;
      });
      setErrors(fieldErrors);
      return;
    }

    console.log('[Login] Validation passed, calling mutation');
    try {
      const response = await loginMutation.mutateAsync({ payload: { email: formData.email, password: formData.password }, remember: rememberMe });

      // Set user data from response
      const userData = response.user || {
        id: 1,
        email: formData.email,
        name: formData.email.split('@')[0],
        role: 'USER',
      };
      console.log('[Login] Setting user:', userData);
      console.log('[Login] Response tokens:', {
        accessToken: response.accessToken ? 'exists' : 'missing',
        refreshToken: response.refreshToken ? 'exists' : 'missing',
      });
      setUser(userData);

      // Save user data to storage (same location as tokens)
      const location: 'local' | 'session' = rememberMe ? 'local' : 'session';
      console.log('[Login] Saving user to storage, location:', location);
      authStorage.setUser(userData, location);
      console.log('[Login] User saved, checking storage:', authStorage.getUser());

      // Verify tokens are stored
      console.log('[Login] Checking stored tokens:', {
        accessToken_local: localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) ? 'exists' : 'missing',
        accessToken_session: sessionStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) ? 'exists' : 'missing',
        refreshToken_local: localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN) ? 'exists' : 'missing',
        refreshToken_session: sessionStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN) ? 'exists' : 'missing',
      });

      navigate(ROUTES.HOME);
    } catch (error) {
      console.error('[Login] Error caught in handleLogin:', error);
      // Set error state to display on form using the same error handling as toast
      const errorMessage = getLoginErrorMessage(error);
      setLoginError(errorMessage);
    }
  };

  return (
    <AuthCard>
      <Header />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <AuthFormLayout>
          <AuthLogo />
          <AuthHeader
            title={t.loginTitle}
            subtitle={t.loginSubtitle}
          />
          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <div
                role="alert"
                className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-destructive"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <p className="text-sm font-medium">{loginError}</p>
              </div>
            )}
            <AuthField
              id="email"
              type="email"
              autoComplete="email"
              label={t.loginEmailAddress}
              icon={Mail}
              placeholder={t.loginEmailPlaceholderAddress}
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              error={errors.email}
            />
            <AuthField
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              label={t.loginPassword}
              icon={Lock}
              placeholder={t.loginPasswordPlaceholder}
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              error={errors.password}
              passwordToggle={{ visible: showPassword, onToggle: () => setShowPassword((visible) => !visible) }}
            />
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
              <label
                htmlFor="remember"
                className="flex min-h-11 cursor-pointer items-center gap-2.5 text-sm font-medium text-foreground"
              >
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-input accent-primary"
                />
                {t.rememberMe}
              </label>
              <Link
                to={ROUTES.AUTH.FORGOT_PASSWORD}
                className="inline-flex min-h-11 items-center rounded-md text-sm font-semibold text-primary underline-offset-4 transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {t.forgotPassword}
              </Link>
            </div>
            <Button
              className="w-full active:scale-[0.98]"
              size="lg"
              type="submit"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending && <Loader2 className="animate-spin" aria-hidden="true" />}
              {loginMutation.isPending ? t.loginSigningIn : t.loginButton}
            </Button>
          </form>
          <div className="mt-6 border-t border-border/70 pt-5 text-center text-sm">
            <span className="text-muted-foreground">{t.noAccount} </span>
            <Link
              to={ROUTES.AUTH.REGISTER}
              className="inline-flex min-h-11 items-center rounded-md font-semibold text-primary underline-offset-4 transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {t.registerLink}
            </Link>
          </div>
        </AuthFormLayout>
      </motion.div>
    </AuthCard>
  );
};

export default LoginPage;
