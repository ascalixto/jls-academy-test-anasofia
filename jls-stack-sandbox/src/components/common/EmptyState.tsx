import { Button } from "@/components/ui/button"

type EmptyStateProps = {
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-6 text-center">
      <h3 className="text-base font-semibold text-slate-50">{title}</h3>

      {description ? (
        <p className="mx-auto mt-2 max-w-xl text-sm text-slate-300">
          {description}
        </p>
      ) : null}

      {actionLabel ? (
        <div className="mt-4 flex justify-center">
          <Button type="button" variant="outline" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      ) : null}
    </div>
  )
}
