type InfoRowProps = {
  label: string
  value: string
  hint?: string
}

export function InfoRow({ label, value, hint }: InfoRowProps) {
  return (
    <dl className="grid grid-cols-[1fr_auto] items-start gap-4 rounded-lg border border-border bg-card/60 px-3 py-2">
      <dt className="space-y-0.5">
        <div className="text-xs uppercase tracking-wide text-muted-foreground">
          {label}
        </div>
        {hint ? (
          <div className="text-xs text-muted-foreground">{hint}</div>
        ) : null}
      </dt>

      <dd className="text-sm font-medium text-foreground">{value}</dd>
    </dl>
  )
}
