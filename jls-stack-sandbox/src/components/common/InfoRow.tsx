type InfoRowProps = {
  label: string
  value: string
  hint?: string
}

export function InfoRow({ label, value, hint }: InfoRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-border bg-card/60 px-3 py-2">
      <div className="space-y-0.5">
        <div className="text-xs uppercase tracking-wide text-muted-foreground">
          {label}
        </div>
        {hint ? (
          <div className="text-xs text-muted-foreground/80">{hint}</div>
        ) : null}
      </div>

      <div className="text-sm font-medium text-foreground">{value}</div>
    </div>
  )
}
