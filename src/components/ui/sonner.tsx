import type { CSSProperties } from "react";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

/**
 * Sonner reads its palette from css variables, so the brand tokens are mapped here
 * (richColors stays enabled by the caller). Tints use the semantic status tokens.
 */
const toasterStyle = {
  "--normal-bg": "hsl(var(--card))",
  "--normal-text": "hsl(var(--foreground))",
  "--normal-border": "hsl(var(--border))",
  "--success-bg": "hsl(var(--success) / 0.1)",
  "--success-text": "hsl(var(--success))",
  "--success-border": "hsl(var(--success) / 0.35)",
  "--error-bg": "hsl(var(--destructive) / 0.08)",
  "--error-text": "hsl(var(--destructive))",
  "--error-border": "hsl(var(--destructive) / 0.35)",
  "--warning-bg": "hsl(var(--warning) / 0.14)",
  "--warning-text": "hsl(var(--warning-foreground))",
  "--warning-border": "hsl(var(--warning) / 0.5)",
  "--info-bg": "hsl(var(--info) / 0.1)",
  "--info-text": "hsl(var(--info))",
  "--info-border": "hsl(var(--info) / 0.35)",
} as CSSProperties;

const Toaster = ({ style, ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      position="top-center"
      style={{ ...toasterStyle, ...style }}
      toastOptions={{
        classNames: {
          toast:
            "group toast min-w-0 group-[.toaster]:rounded-xl group-[.toaster]:font-body group-[.toaster]:shadow-layered-hover",
          title: "break-words [overflow-wrap:anywhere]",
          description: "break-words [overflow-wrap:anywhere] group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export { toast, Toaster };
