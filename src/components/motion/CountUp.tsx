import { animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { EASE_MIX } from "./Reveal";

interface CountUpProps {
  /** Final value. Changing it tweens from whatever is currently shown. */
  value: number;
  /** When set, the number starts here and counts up once the element enters the viewport. */
  from?: number;
  /** Zero-pad to this many digits ("01"). */
  pad?: number;
  duration?: number;
  className?: string;
}

const format = (n: number, pad: number) => String(Math.round(n)).padStart(pad, "0");

/**
 * Animated number for figures that already exist in the UI (never invented statistics).
 * The text node is written imperatively (no re-renders). Assistive tech reads the final value;
 * reduced motion or a missing IntersectionObserver shows the final value immediately.
 */
export function CountUp({ value, from, pad = 0, duration = 0.8, className }: CountUpProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [initialText] = useState(() => format(from ?? value, pad));
  const shown = useRef(from ?? value);
  const canObserve = typeof IntersectionObserver !== "undefined";

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const write = (n: number) => {
      shown.current = n;
      node.textContent = format(n, pad);
    };

    if (reduce || (from !== undefined && !canObserve)) {
      write(value);
      return;
    }
    if (from !== undefined && !inView) return;

    const controls = animate(shown.current, value, { duration, ease: EASE_MIX, onUpdate: write });
    return () => controls.stop();
  }, [value, from, pad, duration, inView, reduce, canObserve]);

  return (
    <span className={className}>
      <span ref={ref} aria-hidden="true">
        {initialText}
      </span>
      <span className="sr-only">{format(value, pad)}</span>
    </span>
  );
}
