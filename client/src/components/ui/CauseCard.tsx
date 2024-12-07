import * as React from "react";
import { cn } from "@/lib/utils";

const CauseCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "h-52 p-4 rounded-lg border bg-zinc-900 text-card-foreground shadow-sm",
      className
    )}
    {...props}
  >
    {children}
  </div>
));
CauseCard.displayName = "CauseCard";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("mt-8 text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

export const CauseCardWithDescription: React.FC<{ title: string; description: string }> = ({ title, description }) => (
  <CauseCard>
    <h3 className="text-2xl font-semibold leading-none tracking-tight">{title}</h3>
    <CardDescription>{description}</CardDescription>
  </CauseCard>
);

export { CauseCard };