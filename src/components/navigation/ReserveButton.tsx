import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/utils/const";
import { Link } from "react-router-dom";

interface ReserveButtonProps
  extends React.ComponentProps<typeof Button> {
    content: string;
  }

export default function ReserveButton({
  content,
  className,
  ...props
}: ReserveButtonProps) {
  return (
    <Button
        asChild
        className={cn("min-w-32", className)}
        {...props}
      >
        <Link to={ROUTES.BOOKING}>{content}</Link>
      </Button>
  );
}
