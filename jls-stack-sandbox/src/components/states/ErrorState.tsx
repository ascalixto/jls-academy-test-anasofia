import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

type Props = {
  title?: string
  message: string
  onRetry?: () => void
}

export function ErrorState({ title = "Something went wrong", message, onRetry }: Props) {
  return (
    <Card className="p-5 border border-red-900/40">
      <div className="space-y-2">
        <div className="text-sm font-semibold">{title}</div>
        <div className="text-sm text-slate-400">{message}</div>

        {onRetry ? (
          <div className="pt-2">
            <Button variant="outline" onClick={onRetry}>
              Retry
            </Button>
          </div>
        ) : null}
      </div>
    </Card>
  )
}
