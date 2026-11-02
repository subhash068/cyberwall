import { cva, type VariantProps } from "class-variance-authority";
import { ShieldAlert, ShieldCheck, ShieldX } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Severity } from "@/types";

/* Severity badge — threat severity indicator */
export const severityVariants = cva(
  "inline-flex items-center gap-1 rounded-sm border px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
  {
    variants: {
      severity: {
        critical: "border-critical/40 bg-critical/15 text-critical",
        high: "border-critical/30 bg-critical/10 text-critical",
        medium: "border-warning/40 bg-warning/15 text-warning",
        low: "border-secondary/40 bg-secondary/10 text-secondary",
        informational: "border-border bg-muted text-muted-foreground",
      },
    },
    defaultVariants: { severity: "informational" },
  },
);

export function SeverityBadge({
  severity,
  className,
}: { severity: Severity; className?: string } & VariantProps<typeof severityVariants>) {
  return (
    <span className={cn(severityVariants({ severity }), className)}>
      <span
        aria-hidden
        className={cn(
          "size-1.5 rounded-full",
          severity === "critical" || severity === "high"
            ? "bg-critical"
            : severity === "medium"
              ? "bg-warning"
              : severity === "low"
                ? "bg-secondary"
                : "bg-muted-foreground",
        )}
      />
      {severity}
    </span>
  );
}

/* Firewall action badge */
export function ActionBadge({ action }: { action: string }) {
  const map: Record<string, { cls: string; icon: typeof ShieldCheck }> = {
    allow: { cls: "border-success/40 bg-success/10 text-success", icon: ShieldCheck },
    deny: { cls: "border-critical/40 bg-critical/10 text-critical", icon: ShieldX },
    reject: { cls: "border-warning/40 bg-warning/10 text-warning", icon: ShieldAlert },
    blocked: { cls: "border-critical/40 bg-critical/10 text-critical", icon: ShieldX },
    flagged: { cls: "border-warning/40 bg-warning/10 text-warning", icon: ShieldAlert },
  };
  const item = map[action] ?? map.allow;
  const Icon = item.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-sm border px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
        item.cls,
      )}
    >
      <Icon className="size-3" aria-hidden />
      {action}
    </span>
  );
}

/* Network / link status dot with optional label */
export function StatusDot({
  status,
  label,
}: {
  status: "up" | "down" | "degraded" | "healthy" | "warning" | "critical" | "offline" | "active" | "inactive" | "connected" | "disconnected" | "pending";
  label?: string;
}) {
  const map: Record<string, string> = {
    up: "bg-success",
    healthy: "bg-success",
    active: "bg-success",
    connected: "bg-success",
    degraded: "bg-warning",
    warning: "bg-warning",
    pending: "bg-warning",
    down: "bg-critical",
    critical: "bg-critical",
    offline: "bg-muted-foreground",
    inactive: "bg-muted-foreground",
    disconnected: "bg-muted-foreground",
  };
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={cn("size-2 rounded-full", map[status] ?? "bg-muted-foreground")} />
      {label && <span className="text-xs text-muted-foreground">{label}</span>}
    </span>
  );
}

/* IOC reputation badge */
export function ReputationBadge({ reputation }: { reputation: string }) {
  const map: Record<string, string> = {
    malicious: "border-critical/40 bg-critical/10 text-critical",
    suspicious: "border-warning/40 bg-warning/10 text-warning",
    benign: "border-success/40 bg-success/10 text-success",
    unrated: "border-border bg-muted text-muted-foreground",
  };
  return (
    <span
      className={cn(
        "inline-flex rounded-sm border px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
        map[reputation] ?? map.unrated,
      )}
    >
      {reputation}
    </span>
  );
}

/* Generic enabled/disabled pill */
export function EnabledBadge({ enabled }: { enabled: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-sm border px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
        enabled
          ? "border-success/40 bg-success/10 text-success"
          : "border-border bg-muted text-muted-foreground",
      )}
    >
      {enabled ? "enabled" : "disabled"}
    </span>
  );
}
