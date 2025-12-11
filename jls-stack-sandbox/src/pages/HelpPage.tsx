export function HelpPage() {
  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">Help & Documentation</h1>
      <p className="text-sm text-slate-300">
        This page is a simple place to remember where to find docs and how to ask for help during JLS Academy.
      </p>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-3">
          <h2 className="text-sm font-semibold">Week 1 docs</h2>
          <p className="text-xs text-slate-400">
            Setup, stack overview, and first sandbox steps.
          </p>
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-900 p-3">
          <h2 className="text-sm font-semibold">Week 2 UI/UX</h2>
          <p className="text-xs text-slate-400">
            Layout patterns, Tailwind practice, and routing.
          </p>
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-900 p-3">
          <h2 className="text-sm font-semibold">Ask for help</h2>
          <p className="text-xs text-slate-400">
            Use Slack channels, mentor hours, and tickets when you feel stuck.
          </p>
        </div>
      </div>
    </div>
  )
}
