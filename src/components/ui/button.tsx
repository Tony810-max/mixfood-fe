import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-[cubic-bezier(0.2,0.8,0.2,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "btn-shine primary-action text-primary-foreground shadow-sm hover:shadow-md active:shadow-none",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-card text-foreground hover:border-brass hover:bg-accent/60",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/70",
        ghost: "text-foreground hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        /** Warm accent for highlights such as spicy or special offers. */
        spice: "btn-shine [--shine:var(--spice-foreground)] bg-spice text-spice-foreground shadow-sm hover:bg-spice/90 active:shadow-none",
        /** Solid ivory button for use on basil (primary) surfaces. */
        onDark: "btn-shine [--shine:var(--brass)] bg-primary-foreground text-primary shadow-sm hover:bg-primary-foreground/90 active:shadow-none",
        /** Outline button for use on basil (primary) surfaces. */
        outlineOnDark: "border border-primary-foreground/40 text-primary-foreground hover:border-brass hover:bg-primary-foreground/10",
      },
      size: {
        default: "btn-nudge min-h-11 px-5 py-2.5",
        sm: "btn-nudge min-h-10 px-4",
        lg: "btn-nudge min-h-12 px-7 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
