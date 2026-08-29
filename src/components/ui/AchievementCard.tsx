import { cn } from "@/lib/utils";

interface AchievementCardProps {
  place: string;
  detail?: string;
  event?: string;
  className?: string;
}

export function AchievementCard({ place, detail, event, className }: AchievementCardProps) {
  return (
    <article
      className={cn(
        "rounded-xl border border-border bg-card p-5 shadow-card transition-all duration-300 hover:border-primary/40 hover:-translate-y-0.5 motion-reduce:hover:translate-y-0",
        className,
      )}
    >
      <p className="font-mono text-sm text-primary">{place}</p>
      {detail && <h3 className="mt-2 text-lg font-semibold text-foreground">{detail}</h3>}
      {event && <p className="mt-1 text-sm text-muted-foreground">{event}</p>}
    </article>
  );
}
