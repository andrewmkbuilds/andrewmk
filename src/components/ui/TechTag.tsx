import { cn } from "@/lib/utils";

interface TechTagProps {
  children: string;
  className?: string;
}

export function TechTag({ children, className }: TechTagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-1 font-mono text-xs text-muted-foreground bg-secondary rounded-sm border border-border",
        className
      )}
    >
      {children}
    </span>
  );
}
