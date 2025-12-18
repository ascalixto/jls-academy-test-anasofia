import { Link } from "react-router-dom"

export function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4 text-center">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">
        Page Not Found
      </h1>

      <p className="max-w-md text-sm text-muted-foreground">
        The route you tried to open does not exist in this sandbox yet.
      </p>
      <p className="max-w-md text-xs text-muted-foreground">
        It might be a typo, or maybe it&apos;s a page you&apos;ll build in a future lesson.
      </p>

      <Link
        to="/"
        className="inline-flex items-center rounded-xl border border-primary/25 bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-95"
      >
        Go back to dashboard
      </Link>
    </div>
  )
}
