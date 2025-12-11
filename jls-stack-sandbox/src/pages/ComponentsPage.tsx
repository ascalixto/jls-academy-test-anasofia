export function ComponentsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">Component Gallery</h1>
      <p className="text-sm text-slate-300">
        A simple place to collect small UI patterns and components you might reuse later in JLS apps.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
          <h2 className="text-sm font-semibold">Stat Card</h2>
          <p className="text-xs text-slate-400">
            A small card for showing numbers, like tasks completed or open tickets.
          </p>
          <div className="rounded-lg bg-slate-950/60 p-3">
            <p className="text-xs text-slate-400">Completed tasks</p>
            <p className="text-2xl font-semibold">24</p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
          <h2 className="text-sm font-semibold">Tag List</h2>
          <p className="text-xs text-slate-400">
            A row of tags you can use to show filters, states, or categories.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-sky-500/70 bg-sky-500/10 px-3 py-1 text-xs">
              sandbox
            </span>
            <span className="rounded-full border border-emerald-500/70 bg-emerald-500/10 px-3 py-1 text-xs">
              stable
            </span>
            <span className="rounded-full border border-amber-500/70 bg-amber-500/10 px-3 py-1 text-xs">
              needs review
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
