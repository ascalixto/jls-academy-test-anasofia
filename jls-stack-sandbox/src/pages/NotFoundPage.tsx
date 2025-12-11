import { Link } from "react-router-dom"

export function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4 text-center">
      <h1 className="text-3xl font-bold tracking-tight">Page Not Found</h1>
      <p className="max-w-md text-sm text-slate-300">
        The route you tried to open does not exist in this sandbox yet. 
        It might be a typo, or maybe it&apos;s a page you&apos;ll build in a future lesson.
      </p>
      <Link
        to="/"
        className="inline-flex items-center rounded-lg border border-sky-500 bg-sky-500/10 px-4 py-2 text-sm font-medium text-sky-100 hover:bg-sky-500/20"
      >
        Go back to dashboard
      </Link>
    </div>
  )
}
