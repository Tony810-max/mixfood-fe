import { AuthCard, AuthField, AuthFormLayout, AuthHeader, AuthLogo, CountdownTimer, OTPInput, StepProgress } from "@/components/auth";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useLanguage, useUiText } from "@/contexts/LanguageContext";
import { useForgotPassword } from "@/hooks/useForgotPassword";
import { ROUTES } from "@/utils/const";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Key, Loader2, Lock, Mail, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPasswordPage = () => {
  const { t } = useLanguage();
  const ui = useUiText();
  const navigate = useNavigate();
  const {
    step,
    email,
    otp,
    newPassword,
    confirmPassword,
    isLoading,
    error,
    errors,
    setEmail,
    setOtp,
    setNewPassword,
    setConfirmPassword,
    setStep,
    handleSendOTP,
    handleVerifyOTP,
    handleResetPassword,
    handleResendOTP,
    reset,
  } = useForgotPassword({
    sendSuccess: t.fpSendSuccess,
    sendError: t.fpSendError,
    resendSuccess: t.fpResendSuccess,
    resendError: t.fpResendError,
    otpLengthError: t.fpOtpLengthError,
    otpVerifySuccess: t.fpOtpVerifySuccess,
    otpVerifyError: t.fpOtpVerifyError,
    resetSuccess: t.fpResetSuccess,
    resetError: t.fpResetError,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const steps = [
    { id: 1, label: t.fpStepEmail, icon: <Mail className="w-6 h-6" /> },
    { id: 2, label: t.fpStepOtp, icon: <Key className="w-6 h-6" /> },
    { id: 3, label: t.fpStepNewPassword, icon: <Lock className="w-6 h-6" /> },
  ];

  const getStepNumber = () => {
    switch (step) {
      case 'email': return 1;
      case 'otp': return 2;
      case 'newPassword': return 3;
      case 'success': return 3;
      default: return 1;
    }
  };

  const handleBack = () => {
    if (step === 'otp') {
      reset();
    } else if (step === 'newPassword') {
      setStep('email');
      setOtp('');
    } else {
      navigate(ROUTES.AUTH.LOGIN);
    }
  };

  const stepMotion = {
    initial: { opacity: 0, x: 16 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -16 },
    transition: { duration: 0.3, ease: [0.2, 0.8, 0.2, 1] as [number, number, number, number] },
  };

  const renderEmailStep = () => (
    <motion.div key="email" {...stepMotion} className="space-y-6">
      <AuthLogo icon={<Mail className="h-full w-full p-4 text-primary" aria-hidden="true" />} />
      <AuthHeader
        title={t.forgotPasswordTitle}
        subtitle={t.forgotPasswordSubtitle}
      />
      <div className="space-y-4">
        <AuthField
          id="email"
          type="email"
          autoComplete="email"
          label={t.loginEmailAddress}
          icon={Mail}
          placeholder={t.loginEmailPlaceholderAddress}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          error={error ? ui(error) : undefined}
        />
        <Button
          className="w-full active:scale-[0.98]"
          size="lg"
          onClick={handleSendOTP}
          disabled={isLoading || !email}
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" aria-hidden="true" />
              {t.forgotPasswordSending}
            </>
          ) : (
            <>
              <Key aria-hidden="true" />
              {t.forgotPasswordButton}
            </>
          )}
        </Button>
        <Button
          variant="ghost"
          className="w-full text-muted-foreground hover:text-foreground"
          onClick={() => navigate(ROUTES.AUTH.LOGIN)}
        >
          <ArrowLeft aria-hidden="true" />
          {t.forgotPasswordBackToLogin}
        </Button>
      </div>
    </motion.div>
  );

  const renderOTPStep = () => (
    <motion.div key="otp" {...stepMotion} className="space-y-6">
      <AuthLogo icon={<ShieldCheck className="h-full w-full p-4 text-primary" aria-hidden="true" />} />
      <AuthHeader
        title={t.fpStepOtp}
        subtitle={`${t.fpOtpSubtitle} ${email}`}
      />
      <div className="space-y-4">
        <div className="rounded-xl border border-brass/40 bg-secondary/60 p-3.5">
          <p className="text-sm text-foreground">
            {t.fpOtpNote}
          </p>
        </div>
        <div className="space-y-2">
          <Label id="fp-otp-label" className="block text-center text-sm font-medium">{t.fpOtpLabel}</Label>
          <OTPInput
            length={6}
            value={otp}
            onChange={setOtp}
            disabled={isLoading}
            error={ui(error)}
            labelledBy="fp-otp-label"
          />
        </div>
        <CountdownTimer
          initialSeconds={60}
          onResend={handleResendOTP}
          isResending={isLoading}
        />
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleBack}
            disabled={isLoading}
          >
            <ArrowLeft aria-hidden="true" />
            {t.registerBack}
          </Button>
          <Button
            className="flex-1 active:scale-[0.98]"
            size="lg"
            onClick={handleVerifyOTP}
            disabled={isLoading || otp.length !== 6}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" aria-hidden="true" />
                {t.fpVerifying}
              </>
            ) : (
              <>
                <CheckCircle2 aria-hidden="true" />
                {t.fpVerifyButton}
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );

  const renderNewPasswordStep = () => (
    <motion.div key="newPassword" {...stepMotion} className="space-y-6">
      <AuthLogo icon={<Lock className="h-full w-full p-4 text-primary" aria-hidden="true" />} />
      <AuthHeader
        title={t.fpNewPasswordTitle}
        subtitle={t.fpNewPasswordSubtitle}
      />
      <div className="space-y-4">
        <AuthField
          id="newPassword"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          label={t.fpNewPasswordLabel}
          icon={Lock}
          placeholder="••••••••"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          disabled={isLoading}
          error={errors.newPassword ? ui(errors.newPassword) : undefined}
          invalid={Boolean(error)}
          passwordToggle={{ visible: showPassword, onToggle: () => setShowPassword(!showPassword) }}
        />
        <AuthField
          id="confirmPassword"
          type={showConfirmPassword ? "text" : "password"}
          autoComplete="new-password"
          label={t.fpConfirmNewPasswordLabel}
          icon={Lock}
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={isLoading}
          error={errors.confirmPassword ? ui(errors.confirmPassword) : undefined}
          invalid={Boolean(error)}
          passwordToggle={{ visible: showConfirmPassword, onToggle: () => setShowConfirmPassword(!showConfirmPassword) }}
        />
        {error && !errors.newPassword && !errors.confirmPassword && (
          <p role="alert" className="text-sm font-medium text-destructive">{ui(error)}</p>
        )}
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleBack}
            disabled={isLoading}
          >
            <ArrowLeft aria-hidden="true" />
            {t.registerBack}
          </Button>
          <Button
            className="flex-1 active:scale-[0.98]"
            size="lg"
            onClick={handleResetPassword}
            disabled={isLoading || !newPassword || !confirmPassword}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" aria-hidden="true" />
                {t.fpResetting}
              </>
            ) : (
              <>
                <CheckCircle2 aria-hidden="true" />
                {t.fpResetButton}
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );

  const renderSuccessStep = () => (
    <motion.div
      key="success"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
      className="space-y-6 text-center"
    >
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-success/10 ring-1 ring-success/30">
        <CheckCircle2 className="h-10 w-10 text-success" aria-hidden="true" />
      </div>
      <AuthHeader
        title={t.fpSuccessTitle}
        subtitle={t.fpSuccessSubtitle}
      />
      <div className="space-y-4">
        <div role="status" className="rounded-xl border border-success/30 bg-success/10 p-4">
          <p className="text-sm font-medium text-foreground">
            {t.fpSuccessMessage}
          </p>
        </div>
        <Button
          className="w-full active:scale-[0.98]"
          size="lg"
          onClick={() => navigate(ROUTES.AUTH.LOGIN)}
        >
          <ArrowLeft aria-hidden="true" />
          {t.fpLoginNow}
        </Button>
      </div>
    </motion.div>
  );

  return (
    <AuthCard>
      <Header />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <AuthFormLayout>
          {step !== 'success' && (
            <StepProgress currentStep={getStepNumber()} steps={steps} />
          )}
          <AnimatePresence mode="wait">
            {step === 'email' && renderEmailStep()}
            {step === 'otp' && renderOTPStep()}
            {step === 'newPassword' && renderNewPasswordStep()}
            {step === 'success' && renderSuccessStep()}
          </AnimatePresence>
        </AuthFormLayout>
      </motion.div>
    </AuthCard>
  );
};

export default ForgotPasswordPage;
