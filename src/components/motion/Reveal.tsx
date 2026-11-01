import {
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import {
  createContext,
  createElement,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type Ref,
  type RefObject,
} from "react";

/** Brand easing, shared with the `--easing-mix` css token. */
export const EASE_MIX = [0.2, 0.8, 0.2, 1] as const;

type RevealTag = "div" | "section" | "article" | "header" | "figure" | "li" | "p" | "ul" | "span";

const MOTION_TAGS = {
  div: motion.div,
  section: motion.section,
  article: motion.article,
  header: motion.header,
  figure: motion.figure,
  li: motion.li,
  p: motion.p,
  ul: motion.ul,
  span: motion.span,
} as const;

interface BaseProps {
  as?: RevealTag;
  className?: string;
  children?: ReactNode;
  /** Animate when mounted instead of waiting for the viewport (hero entrances). */
  onMount?: boolean;
}

/**
 * True once `ref` has been at least `amount` visible. Without IntersectionObserver
 * (old browsers, jsdom) content is treated as visible so it can never stay hidden.
 */
function useInViewOnce(ref: RefObject<HTMLElement | null>, amount: number): boolean {
  const supported = typeof IntersectionObserver !== "undefined";
  const [seen, setSeen] = useState(!supported);

  useEffect(() => {
    const element = ref.current;
    if (seen || !element) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setSeen(true);
          observer.disconnect();
        }
      },
      { threshold: amount },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, amount, seen]);

  return seen;
}

/**
 * Decides when a reveal should play.
 * - reduced motion: never hidden.
 * - already inside the viewport on first paint: shown immediately, no hidden flash.
 * - otherwise: plays once when 15% of the element enters the viewport.
 */
function useRevealState(onMount: boolean) {
  const ref = useRef<HTMLElement | null>(null);
  const reduce = useReducedMotion();
  const [instant, setInstant] = useState(false);
  const inView = useInViewOnce(ref, 0.15);

  useLayoutEffect(() => {
    if (onMount) return;
    const element = ref.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) setInstant(true);
  }, [onMount]);

  const shown = onMount || instant || inView;
  return { ref, reduce: !!reduce, instant, shown };
}

interface RevealProps extends BaseProps {
  delay?: number;
  /** Vertical offset in px the element travels while fading in. */
  y?: number;
  duration?: number;
}

/** Once-only fade-up. Content stays visible without motion or when motion is reduced. */
export function Reveal({ as = "div", className, children, delay = 0, y = 16, duration = 0.55, onMount = false }: RevealProps) {
  const { ref, reduce, instant, shown } = useRevealState(onMount);

  if (reduce) return createElement(as, { className }, children);

  const Component = MOTION_TAGS[as] as typeof motion.div;
  return (
    <Component
      ref={ref as Ref<HTMLDivElement>}
      className={className}
      initial={{ opacity: 0, y }}
      animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={instant ? { duration: 0 } : { duration, delay, ease: EASE_MIX }}
    >
      {children}
    </Component>
  );
}

interface StaggerContextValue {
  y: number;
}
const StaggerContext = createContext<StaggerContextValue>({ y: 16 });

interface StaggerProps extends BaseProps {
  /** Seconds between children (budget: 0.04 - 0.09). */
  stagger?: number;
  delay?: number;
  y?: number;
}

/** Container that reveals its `StaggerItem` children one after another, once. */
export function Stagger({ as = "div", className, children, stagger = 0.07, delay = 0, y = 16, onMount = false }: StaggerProps) {
  const { ref, reduce, instant, shown } = useRevealState(onMount);

  if (reduce) return createElement(as, { className }, children);

  const Component = MOTION_TAGS[as] as typeof motion.div;
  const variants: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: instant ? 0 : stagger, delayChildren: instant ? 0 : delay } },
  };

  return (
    <StaggerContext.Provider value={{ y }}>
      <Component
        ref={ref as Ref<HTMLDivElement>}
        className={className}
        variants={variants}
        initial="hidden"
        animate={shown ? "show" : "hidden"}
      >
        {children}
      </Component>
    </StaggerContext.Provider>
  );
}

interface StaggerItemProps {
  as?: RevealTag;
  className?: string;
  children?: ReactNode;
}

/** Child of `Stagger`. Falls back to a plain element when motion is reduced. */
export function StaggerItem({ as = "div", className, children }: StaggerItemProps) {
  const reduce = useReducedMotion();
  const { y } = useContext(StaggerContext);

  if (reduce) return createElement(as, { className }, children);

  const Component = MOTION_TAGS[as] as typeof motion.div;
  const variants: Variants = {
    hidden: { opacity: 0, y },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_MIX } },
  };

  return (
    <Component className={className} variants={variants}>
      {children}
    </Component>
  );
}
