export function ComponentsPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Component Gallery</h1>
        <p className="text-sm text-slate-200">
          A simple place to collect small UI patterns and components you might reuse later in JLS apps.
        </p>
        <p className="text-xs text-slate-400">
          Keep it lightweight, consistent, and easy to scan.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Quick patterns</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Card 1 */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 space-y-2">
            <h3 className="text-base font-semibold">Stat Card</h3>
            <p className="text-xs text-slate-400">
              A small card for showing numbers, like tasks completed or open tickets.
            </p>

            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <p className="text-xs text-slate-400">Completed tasks</p>
              <p className="text-2xl font-bold tracking-tight text-sky-100">24</p>
              <p className="text-xs text-slate-400">Across teams this week</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 space-y-2">
            <h3 className="text-base font-semibold">Tag List</h3>
            <p className="text-xs text-slate-400">
              A row of tags you can use to show categories.
            </p>

            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-sky-500/40 bg-sky-500/10 px-3 py-1 text-xs text-sky-100">
                sandbox
              </span>
              <span className="rounded-full border border-slate-700 bg-slate-900/50 px-3 py-1 text-xs text-slate-200">
                stable
              </span>
              <span className="rounded-full border border-slate-700 bg-slate-900/50 px-3 py-1 text-xs text-slate-200">
                needs review
              </span>
            </div>

           
          </div>
        </div>
      </section>
    </div>
  )
}
