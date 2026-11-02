import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MetricCardProps {
  label: string;
  value: string;
  unit?: string;
  icon: LucideIcon;
  trend?: { direction: "up" | "down" | "flat"; label: string };
  tone?: "primary" | "secondary" | "intelligence" | "success" | "warning" | "critical" | "neutral";
  detail?: string;
  onClick?: () => void;
}

const toneMap: Record<string, { icon: string; ring: string }> = {
  primary: { icon: "text-primary", ring: "bg-primary/10 border-primary/20" },
  secondary: { icon: "text-secondary", ring: "bg-secondary/10 border-secondary/20" },
  intelligence: { icon: "text-intelligence", ring: "bg-intelligence/10 border-intelligence/20" },
  success: { icon: "text-success", ring: "bg-success/10 border-success/20" },
  warning: { icon: "text-warning", ring: "bg-warning/10 border-warning/20" },
  critical: { icon: "text-critical", ring: "bg-critical/10 border-critical/20" },
  neutral: { icon: "text-muted-foreground", ring: "bg-muted/50 border-border" },
};

/** Dashboard metric card with restrained security styling. */
export function MetricCard({
  label,
  value,
  unit,
  icon: Icon,
  trend,
  tone = "primary",
  detail,
  onClick,
}: MetricCardProps) {
  const t = toneMap[tone] ?? toneMap.primary;
  const Wrapper = onClick ? "button" : "div";
  return (
    <Wrapper
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={cn(
        "panel group relative overflow-hidden p-4 text-left transition-colors",
        onClick && "hover:border-border-strong focus-visible:outline-ring",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <span className={cn("flex size-8 items-center justify-center rounded-md border", t.ring)}>
          <Icon className={cn("size-4", t.icon)} aria-hidden />
        </span>
      </div>
      <div className="mt-2 flex items-baseline gap-1">
        <span className="tabular text-2xl font-bold tracking-tight text-foreground">{value}</span>
        {unit && <span className="text-xs font-medium text-muted-foreground">{unit}</span>}
      </div>
      <div className="mt-1 flex items-center gap-2">
        {trend && (
          <span
            className={cn(
              "text-[11px] font-medium",
              trend.direction === "up"
                ? "text-success"
                : trend.direction === "down"
                  ? "text-critical"
                  : "text-muted-foreground",
            )}
          >
            {trend.direction === "up" ? "▲" : trend.direction === "down" ? "▼" : "—"} {trend.label}
          </span>
        )}
        {detail && <span className="truncate text-[11px] text-muted-foreground">{detail}</span>}
      </div>
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-60"
      />
    </Wrapper>
  );
}
