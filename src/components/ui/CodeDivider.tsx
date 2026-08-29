import { cn } from "@/lib/utils";

interface CodeDividerProps {
  label: string;
  className?: string;
}

export function CodeDivider({ label, className }: CodeDividerProps) {
  return (
    <div className={cn("flex items-center gap-4 py-8", className)}>
      <span className="font-mono text-sm text-primary">//</span>
      <span className="font-mono text-sm text-muted-foreground">{label}</span>
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}
