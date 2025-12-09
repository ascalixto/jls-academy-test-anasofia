export function LayoutSandbox() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 py-10">
      <div className="max-w-5xl mx-auto space-y-10 px-4">
        {/* Section 1: Page Title */}
        <section className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Tailwind Layout Sandbox
          </h1>
          <p className="text-sm text-slate-300">
            Week 2 – Day 1a: Practicing spacing, flex, grid, and responsive utilities.
          </p>
        </section>

        {/* Section 2: Vertical Stack */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Vertical stack (space-y)</h2>
          <div className="bg-slate-900/60 rounded-xl p-6 space-y-3">
            <div className="bg-slate-800 rounded-lg p-3">Item 1</div>
            <div className="bg-slate-800 rounded-lg p-3">Item 2</div>
            <div className="bg-slate-800 rounded-lg p-3">Item 3</div>
          </div>
        </section>

        {/* Section 3: Responsive Flex Row */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Responsive row (flex)</h2>
          <p className="text-sm text-slate-300">
            Stacks on small screens, side-by-side on medium+ screens.
          </p>
          <div className="bg-slate-900/60 rounded-xl p-6 flex flex-col md:flex-row gap-4">
            <div className="flex-1 bg-slate-800 rounded-lg p-4">
              Left panel
            </div>
            <div className="flex-1 bg-slate-800 rounded-lg p-4">
              Right panel
            </div>
          </div>
        </section>

        {/* Section 4: Responsive Grid */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Responsive grid</h2>
          <p className="text-sm text-slate-300">
            1 column on mobile, 3 columns on medium+ screens.
          </p>
          <div className="bg-slate-900/60 rounded-xl p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-800 rounded-lg p-4">Card A</div>
            <div className="bg-slate-800 rounded-lg p-4">Card B</div>
            <div className="bg-slate-800 rounded-lg p-4">Card C</div>
          </div>
        </section>
      </div>
    </div>
  )
}
