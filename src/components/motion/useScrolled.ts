import { useEffect, useState } from "react";

/** True once the window scrolled past `threshold` px. Passive listener, reads the initial position. */
export function useScrolled(threshold = 12): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > threshold);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [threshold]);

  return scrolled;
}
