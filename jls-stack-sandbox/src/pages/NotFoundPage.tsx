import { Link } from "react-router-dom"

export function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4 text-center">
      <h1 className="text-2xl font-bold tracking-tight">Page Not Found</h1>

      <p className="max-w-md text-sm text-slate-200">
        The route you tried to open does not exist in this sandbox yet.
      </p>
      <p className="max-w-md text-xs text-slate-400">
        It might be a typo, or maybe it&apos;s a page you&apos;ll build in a future lesson.
      </p>

      <Link
        to="/"
        className="inline-flex items-center rounded-xl border border-sky-500/40 bg-sky-600 px-4 py-2 text-sm font-medium text-sky-50 hover:bg-sky-500"
      >
        Go back to dashboard
      </Link>
    </div>
  )
}
