import { useUiText } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface Step {
  id: number;
  label: string;
  icon: React.ReactNode;
}

interface StepProgressProps {
  currentStep: number;
  steps: Step[];
  className?: string;
}

export const StepProgress = ({ currentStep, steps, className }: StepProgressProps) => {
  const n = steps.length;
  // Half a column's width, as a percentage of the row — this is exactly
  // the horizontal offset from the row edge to the first/last circle's
  // center. Using a fixed rem inset here (the previous attempt) only
  // works if every column is exactly as wide as the circle; in practice
  // each column's width is set by its (wider) label text, so the circle
  // ends up centered somewhere past that fixed offset — which is exactly
  // why a stray bit of line kept poking out to the left of the first step.
  // A CSS grid with equal-width columns removes that assumption entirely:
  // column i is always centered at (i + 0.5) / n of the row, full stop.
  const halfColumn = `${50 / n}%`;

  const ui = useUiText();
  return (
    <div className={cn("mb-7 w-full", className)}>
      <ol
        className="relative grid items-start"
        style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}
      >
        {/* Progress line track — spans center-to-center between the first
            and last column, so it starts/ends exactly under those circles
            regardless of how wide each step's label text is. */}
        <div
          aria-hidden="true"
          className="absolute top-[22px] h-0.5 -translate-y-1/2"
          style={{ left: halfColumn, right: halfColumn }}
        >
          <div className="absolute inset-0 rounded-full bg-border" />
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full bg-primary"
            initial={{ width: '0%' }}
            animate={{ width: `${((currentStep - 1) / (n - 1)) * 100}%` }}
            transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
          />
        </div>

        {/* Steps */}
        {steps.map((step, index) => {
          const isCompleted = index + 1 < currentStep;
          const isCurrent = index + 1 === currentStep;
          const isPending = index + 1 > currentStep;

          return (
            <li
              key={step.id}
              aria-current={isCurrent ? 'step' : undefined}
              className="relative z-10 flex flex-col items-center"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.08, duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-full border-2 transition-colors duration-300",
                  isCompleted && "border-primary bg-primary text-primary-foreground",
                  isCurrent && "border-primary bg-card text-primary ring-4 ring-primary/10",
                  isPending && "border-border bg-card text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5" aria-hidden="true" />
                ) : (
                  step.icon
                )}
              </motion.div>
              <motion.span
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 + 0.15, duration: 0.3 }}
                className={cn(
                  "mt-2 text-center text-xs font-medium",
                  (isCurrent || isCompleted) && "text-primary",
                  isPending && "text-muted-foreground"
                )}
              >
                {ui(step.label)}
                {isCompleted && <span className="sr-only"> ✓</span>}
              </motion.span>
            </li>
          );
        })}
      </ol>
    </div>
  );
};
