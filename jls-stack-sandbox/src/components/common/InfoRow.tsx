type InfoRowProps = {
  label: string
  value: string
  hint?: string
}

export function InfoRow({ label, value, hint }: InfoRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-slate-800 bg-slate-950/40 px-3 py-2">
      <div className="space-y-0.5">
        <div className="text-xs uppercase tracking-wide text-slate-400">
          {label}
        </div>
        {hint ? <div className="text-xs text-slate-500">{hint}</div> : null}
      </div>

      <div className="text-sm font-medium text-slate-100">{value}</div>
    </div>
  )
}
