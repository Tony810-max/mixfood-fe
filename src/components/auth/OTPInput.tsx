import { Input } from '@/components/ui/input';
import { useUiText } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useEffect, useId, useRef, useState } from 'react';

interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
  className?: string;
  /** id of the visible element that labels the whole code (preferred). */
  labelledBy?: string;
}

export const OTPInput = ({
  length = 6,
  value,
  onChange,
  disabled = false,
  error,
  className,
  labelledBy,
}: OTPInputProps) => {
  const ui = useUiText();
  const errorId = useId();
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus the first empty input or the last input if all are filled
    const firstEmptyIndex = value.length;
    if (firstEmptyIndex < length) {
      inputRefs.current[firstEmptyIndex]?.focus();
    } else {
      inputRefs.current[length - 1]?.focus();
    }
  }, [length, value.length]);

  // Clear OTP and focus first input when error occurs
  useEffect(() => {
    if (error) {
      onChange('');
      inputRefs.current[0]?.focus();
    }
  }, [error, onChange]);

  const handleChange = (index: number, newValue: string) => {
    // Only allow numbers
    const numericValue = newValue.replace(/[^0-9]/g, '');

    if (numericValue.length > 1) {
      // Handle paste - take the last character
      const char = numericValue.slice(-1);
      const newValueArray = value.split('');
      newValueArray[index] = char;
      onChange(newValueArray.join(''));

      // Move to next input
      if (index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    } else if (numericValue.length === 1) {
      const newValueArray = value.split('');
      newValueArray[index] = numericValue;
      onChange(newValueArray.join(''));

      // Move to next input
      if (index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    } else {
      // Handle backspace
      const newValueArray = value.split('');
      newValueArray[index] = '';
      onChange(newValueArray.join(''));

      // Move to previous input
      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '');

    if (pastedData.length > 0) {
      const newValueArray = value.split('');
      for (let i = 0; i < Math.min(pastedData.length, length); i++) {
        newValueArray[i] = pastedData[i];
      }
      onChange(newValueArray.join(''));

      // Focus the next empty input or the last input
      const nextFocusIndex = Math.min(pastedData.length, length - 1);
      inputRefs.current[nextFocusIndex]?.focus();
    }
  };

  const handleFocus = (index: number) => {
    setFocusedIndex(index);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div
        role="group"
        aria-labelledby={labelledBy}
        aria-label={labelledBy ? undefined : ui('Verification code')}
        className="flex justify-center gap-1.5 sm:gap-2"
      >
        {Array.from({ length }).map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04, duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
            className="relative min-w-0 max-w-[3.25rem] flex-1"
          >
            <Input
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              autoComplete={index === 0 ? 'one-time-code' : 'off'}
              maxLength={1}
              value={value[index] || ''}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              onFocus={() => handleFocus(index)}
              disabled={disabled}
              aria-label={ui('Digit {number} of {total}', { number: index + 1, total: length })}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? errorId : undefined}
              className={cn(
                "h-12 w-full px-0 text-center font-serif text-2xl font-semibold tabular-nums sm:h-14 sm:text-3xl md:text-3xl",
                "transition-[border-color,box-shadow] duration-200",
                value[index] && "border-primary/50 bg-secondary/40",
                error && "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20",
                focusedIndex === index && !error && "border-primary ring-2 ring-primary/20",
                disabled && "cursor-not-allowed opacity-50",
              )}
            />
          </motion.div>
        ))}
      </div>
      {error && (
        <motion.p
          id={errorId}
          role="alert"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-sm font-medium text-destructive"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};
