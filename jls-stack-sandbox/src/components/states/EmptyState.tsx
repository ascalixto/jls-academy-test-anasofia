import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"

type Props = {
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  secondaryActionLabel?: string
  onSecondaryAction?: () => void
  icon?: ReactNode
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  icon,
}: Props) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-8 text-center">
      <div className="mx-auto flex max-w-md flex-col items-center gap-3">
        {icon ? <div className="text-slate-300">{icon}</div> : null}

        <h2 className="text-lg font-semibold">{title}</h2>

        {description ? (
          <p className="text-sm text-slate-400">{description}</p>
        ) : null}

        {actionLabel || secondaryActionLabel ? (
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            {actionLabel && onAction ? (
              <Button onClick={onAction}>{actionLabel}</Button>
            ) : null}

            {secondaryActionLabel && onSecondaryAction ? (
              <Button variant="outline" onClick={onSecondaryAction}>
                {secondaryActionLabel}
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  )
}
