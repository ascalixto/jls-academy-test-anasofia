import type { ReactNode } from "react"

type LiveStatus = "on" | "off"

type PageHeaderProps = {
  title: string
  subtitle?: string
  actions?: ReactNode

  // Assignment 4.2 - Part A
  liveStatus?: LiveStatus
  liveLabel?: string
}

function LiveIndicator({
  status,
  label,
}: {
  status: LiveStatus
  label: string
}) {
  const dotClass =
    status === "on" ? "bg-emerald-500" : "bg-muted-foreground"
  const text = status === "on" ? "On" : "Off"

  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground">
      <span className={`h-2 w-2 rounded-full ${dotClass}`} />
      <span className="text-muted-foreground">{label}:</span>
      <span>{text}</span>
    </span>
  )
}

export function PageHeader({
  title,
  subtitle,
  actions,
  liveStatus,
  liveLabel,
}: PageHeaderProps) {
  const label = liveLabel ?? "Live"

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
        {subtitle ? (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>

      {(actions || liveStatus) ? (
        <div className="flex items-center gap-2">
          {liveStatus ? <LiveIndicator status={liveStatus} label={label} /> : null}
          {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
        </div>
      ) : null}
    </div>
  )
}
