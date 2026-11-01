import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';

interface CountdownTimerProps {
  initialSeconds?: number;
  onResend: () => void;
  isResending?: boolean;
  className?: string;
}

export const CountdownTimer = ({
  initialSeconds = 60,
  onResend,
  isResending = false,
  className,
}: CountdownTimerProps) => {
  const { t } = useLanguage();
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    setSeconds(initialSeconds);
    setIsExpired(false);
  }, [initialSeconds]);

  useEffect(() => {
    if (seconds > 0 && !isExpired) {
      const timer = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            setIsExpired(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [seconds, isExpired]);

  const handleResend = () => {
    onResend();
    setSeconds(initialSeconds);
    setIsExpired(false);
  };

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      {!isExpired ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          role="timer"
          className="text-sm text-muted-foreground"
        >
          {t.countdownResendIn}{' '}
          <span className="font-semibold tabular-nums text-primary">
            {formatTime(seconds)}
          </span>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleResend}
            disabled={isResending}
            className="text-primary hover:bg-primary/10 hover:text-primary"
          >
            {isResending ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                {t.countdownSending}
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                {t.countdownResend}
              </>
            )}
          </Button>
        </motion.div>
      )}
    </div>
  );
};
