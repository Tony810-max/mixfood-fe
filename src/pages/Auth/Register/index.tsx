
import { useUiText } from '@/contexts/LanguageContext';
import { AuthCard, AuthField, AuthFormLayout, AuthHeader, AuthLogo } from "@/components/auth";
import { OTPInput } from "@/components/auth/OTPInput";
import { StepProgress } from "@/components/auth/StepProgress";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRegister, useSendRegistrationCode } from "@/hooks/api/useAuth";
import {
  registerStep1Schema,
  registerStep2Schema,
  type RegisterFormData,
} from "@/lib/validation";
import { ROUTES } from "@/utils/const";
import { formatPhoneNumber } from "@/utils/formatters";
import { showErrorToast } from "@/utils/toastHelpers";
import { motion } from "framer-motion";
import { Info, Loader2, Lock, Mail, Phone, Shield, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const ui = useUiText();
  const { t } = useLanguage();
  const steps = [
    { id: 1, label: t.registerStep1Label, icon: <User className="w-5 h-5" /> },
    { id: 2, label: t.registerStep2Label, icon: <Shield className="w-5 h-5" /> },
  ];
  const navigate = useNavigate();
  const sendCodeMutation = useSendRegistrationCode();
  const registerMutation = useRegister();
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    verifyCode: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormData, string>>>({});
  const [countdown, setCountdown] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Auto-send the verification code once the user reaches step 2
  useEffect(() => {
    if (step === 2 && !codeSent && countdown === 0) {
      doSendCode(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const doSendCode = async (silent = false) => {
    if (countdown > 0) return;
    if (!silent) setIsLoading(true);
    try {
      await sendCodeMutation.mutateAsync(formData.email);
      setCountdown(60);
      setCodeSent(true);
    } catch {
      if (silent) showErrorToast(t.registerCodeError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    const result = registerStep1Schema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof RegisterFormData, string>> = {};
      result.error.errors.forEach((error) => {
        const field = error.path[0] as keyof RegisterFormData;
        fieldErrors[field] = error.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setStep(2);
  };

  const handleRegister = async () => {
    const result = registerStep2Schema.safeParse({
      email: formData.email,
      verifyCode: formData.verifyCode,
    });
    if (!result.success) {
      setErrors({ verifyCode: result.error.errors.find((e) => e.path[0] === "verifyCode")?.message ?? "" });
      return;
    }

    setIsLoading(true);
    try {
      await registerMutation.mutateAsync({
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        code: formData.verifyCode,
        password: formData.password,
      });
      navigate(ROUTES.AUTH.LOGIN);
    } catch {
      // Error is handled by the mutation
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof RegisterFormData, value: string) => {
    let formattedValue = value;
    if (field === "phone") {
      formattedValue = formatPhoneNumber(value);
    }
    setFormData((prev) => ({ ...prev, [field]: formattedValue }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const goBack = () => {
    setStep(1);
    setErrors({});
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
          <AuthHeader title={t.registerTitle} subtitle={t.registerSubtitle} />
          <StepProgress currentStep={step} steps={steps} className="mx-auto max-w-sm" />

          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <AuthField
                  id="fullName"
                  type="text"
                  autoComplete="name"
                  label={t.registerFullName}
                  icon={User}
                  placeholder={t.registerFullNamePlaceholder}
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  error={errors.fullName}
                />
                <AuthField
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  label={t.registerPhoneNumber}
                  icon={Phone}
                  placeholder={t.registerPhonePlaceholder}
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  error={errors.phone}
                />
              </div>
              <AuthField
                id="email"
                type="email"
                autoComplete="email"
                label={t.registerEmail}
                icon={Mail}
                placeholder={t.registerEmailPlaceholder}
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                error={errors.email}
              />
              <AuthField
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                label={t.registerPassword}
                icon={Lock}
                placeholder={t.registerPasswordPlaceholder}
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                error={errors.password}
                passwordToggle={{ visible: showPassword, onToggle: () => setShowPassword((visible) => !visible) }}
              />
              <AuthField
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                label={t.registerConfirmPassword}
                icon={Lock}
                placeholder={t.registerConfirmPasswordPlaceholder}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                error={errors.confirmPassword}
                passwordToggle={{
                  visible: showPassword,
                  onToggle: () => setShowPassword((visible) => !visible),
                  showLabel: ui("Show passwords"),
                  hideLabel: ui("Hide passwords"),
                }}
              />
              <Button
                className="w-full active:scale-[0.98]"
                size="lg"
                onClick={handleContinue}
                disabled={isLoading}
              >
                {t.registerContinue}
              </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
              className="space-y-4"
            >
              <p className="text-center text-sm text-muted-foreground">{t.registerVerifySubtitle}</p>

              {/* Registered email */}
              <AuthField
                id="verifyEmail"
                type="email"
                label={t.registerEmail}
                icon={Mail}
                className="bg-muted/50 text-muted-foreground"
                value={formData.email}
                readOnly
              />

              <div className="space-y-2">
                <Label id="verifyCode-label" className="block text-center text-sm font-medium">
                  {t.registerVerifyCode}
                </Label>
                <OTPInput
                  length={6}
                  value={formData.verifyCode}
                  onChange={(value) => handleInputChange("verifyCode", value)}
                  disabled={isLoading}
                  labelledBy="verifyCode-label"
                />
                {errors.verifyCode && (
                  <p role="alert" className="text-center text-sm font-medium text-destructive">{errors.verifyCode}</p>
                )}
              </div>

              <div className="flex items-center justify-center">
                <Button
                  type="button"
                  variant="outline"
                  className="whitespace-nowrap"
                  onClick={() => doSendCode(false)}
                  disabled={countdown > 0 || isLoading}
                  aria-live="polite"
                >
                  {isLoading && countdown === 0
                    ? t.registerSending
                    : countdown > 0
                      ? t.registerResendIn.replace("{seconds}", countdown.toString())
                      : t.registerResendCode}
                </Button>
              </div>

              <div className="flex items-start gap-2.5 rounded-xl border border-brass/40 bg-secondary/60 p-3 text-sm text-foreground">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-brass-strong" aria-hidden="true" />
                <span>{t.registerNoteSentToEmail}</span>
              </div>

              <div className="flex gap-3 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={goBack}
                  disabled={isLoading}
                >
                  {t.registerBack}
                </Button>
                <Button
                  className="flex-1 active:scale-[0.98]"
                  size="lg"
                  onClick={handleRegister}
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="animate-spin" aria-hidden="true" />}
                  {isLoading ? t.registerCreating : t.registerButton}
                </Button>
              </div>
            </motion.div>
          )}

          <div className="mt-6 border-t border-border/70 pt-5 text-center text-sm">
            <span className="text-muted-foreground">{t.registerHasAccount} </span>
            <Link
              to={ROUTES.AUTH.LOGIN}
              className="inline-flex min-h-11 items-center rounded-md font-semibold text-primary underline-offset-4 transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {t.registerLoginLink}
            </Link>
          </div>
        </AuthFormLayout>
      </motion.div>
    </AuthCard>
  );
};

export default RegisterPage;
