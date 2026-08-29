import { cn } from "@/lib/utils";

interface CodeLabelProps {
  children: string;
  className?: string;
}

export function CodeLabel({ children, className }: CodeLabelProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-mono text-xs text-primary",
        className
      )}
    >
      <span className="text-muted-foreground">/*</span>
      <span className="mx-2">{children}</span>
      <span className="text-muted-foreground">*/</span>
    </span>
  );
}
