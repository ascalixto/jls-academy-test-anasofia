export function HelpPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Help & Documentation</h1>
        <p className="text-sm text-slate-200">
          A simple place to remember where to find docs and how to ask for help during JLS Academy.
        </p>
        <p className="text-xs text-slate-400">
          If something feels fuzzy, write it down here and keep moving.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Where to look</h2>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 space-y-2">
            <h3 className="text-base font-semibold">Week 1 docs</h3>
            <p className="text-xs text-slate-400">
              Setup, stack overview, and your first sandbox steps.
            </p>
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
              <p className="text-xs text-slate-400">Focus</p>
              <p className="text-sm text-slate-200">Environment + tools</p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 space-y-2">
            <h3 className="text-base font-semibold">Week 2 UI/UX</h3>
            <p className="text-xs text-slate-400">
              Layout patterns, Tailwind practice, and routing.
            </p>
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
              <p className="text-xs text-slate-400">Focus</p>
              <p className="text-sm text-slate-200">Consistency + patterns</p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 space-y-2">
            <h3 className="text-base font-semibold">Ask for help</h3>
            <p className="text-xs text-slate-400">
              Use Slack channels, mentor hours, and tickets when you feel stuck.
            </p>
            <div className="rounded-xl border border-sky-500/40 bg-sky-500/10 p-3">
              <p className="text-xs text-slate-400">Tip</p>
              <p className="text-sm text-sky-100">
                Share the error + the file path + what you tried.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
