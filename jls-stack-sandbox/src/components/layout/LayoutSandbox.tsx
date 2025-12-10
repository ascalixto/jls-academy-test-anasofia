import React from "react"

export function LayoutSandbox() {
  return (
    <main className="min-h-screen bg-sky-950 text-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-10 space-y-10">
        {/* Page header */}
        <header className="space-y-2 rounded-xl bg-sky-900 px-6 py-5 shadow-sm">
          <h1 className="text-2xl font-bold">Adopt a Task</h1>
          <p className="text-sm text-sky-100/80">
            Metrics showing how many activities and projects improved after someone adopted a task from another department.
          </p>
        </header>

        {/* Section 1 – Work Areas (Vertical Stack) */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Work Areas</h2>
          <p className="text-sm text-sky-100/80">
            The main company areas where tasks and support time are tracked.
          </p>

          <div className="space-y-3">
            <div className="rounded-lg border border-sky-300/40 bg-sky-500/20 p-4">
              <h3 className="text-base font-semibold">New Product Development</h3>
              <p className="text-sm text-sky-100/90">
                Tracks new ideas, prototypes, tests, and launch work. Helps you see
                which product projects are getting the most attention this cycle.
              </p>
            </div>

            <div className="rounded-lg border border-sky-300/40 bg-sky-500/20 p-4">
              <h3 className="text-base font-semibold">Automation</h3>
              <p className="text-sm text-sky-100/90">
                Measures time spent building tools and systems that reduce manual work.
                Shows where automation is saving hours for the team.
              </p>
            </div>

            <div className="rounded-lg border border-sky-300/40 bg-sky-500/20 p-4">
              <h3 className="text-base font-semibold">PPC Farm</h3>
              <p className="text-sm text-sky-100/90">
                Follows the work around ads, campaigns, and daily PPC operations so
                you can understand where support is most needed.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2 – Weekly Overview (Responsive Flex Row) */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Weekly Overview</h2>
          <p className="text-sm text-sky-100/80">
            A simple overview of how many hours are planned for each project this week.
          </p>

          <div className="flex flex-col gap-4 md:flex-row md:items-stretch">
            {/* Sidebar */}
            <aside className="rounded-lg border border-sky-300/45 bg-sky-500/35 p-4 md:basis-1/3">
              <h3 className="mb-3 text-base font-semibold">Planning options</h3>

              <div className="space-y-3 text-sm text-sky-50">
                <div className="space-y-1">
                  <p className="font-medium text-sky-100">Time range</p>
                  <div className="flex gap-2 overflow-x-auto whitespace-nowrap text-xs">
                    <button className="rounded-full border border-sky-300/50 bg-sky-900/40 px-3 py-1">
                      Today
                    </button>
                    <button className="rounded-full border border-sky-100 bg-sky-50/10 px-3 py-1 font-semibold">
                      This week
                    </button>
                    <button className="rounded-full border border-sky-300/50 bg-sky-900/40 px-3 py-1">
                      This month
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="font-medium text-sky-100">Projects included</p>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="h-3 w-3" defaultChecked />
                    <span>New Product Development</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="h-3 w-3" defaultChecked />
                    <span>Automation</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="h-3 w-3" defaultChecked />
                    <span>PPC Farm</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="h-3 w-3" />
                    <span>Support & misc</span>
                  </label>
                </div>
              </div>
            </aside>

            {/* Main content */}
            <section className="rounded-lg border border-sky-300/45 bg-sky-500/35 p-4 md:basis-2/3">
              <h3 className="mb-3 text-base font-semibold">This Week&apos;s Snapshot</h3>
              <p className="mb-4 text-sm text-sky-100/85">
                These are the planned hours for each project area this week.
              </p>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-md border border-sky-300/50 bg-sky-900/40 p-3">
                  <p className="text-xs text-sky-200/90">New Product Development</p>
                  <p className="text-2xl font-semibold">18h</p>
                  <p className="text-xs text-sky-100/80">Research, specs, and testing</p>
                </div>

                <div className="rounded-md border border-sky-300/50 bg-sky-900/40 p-3">
                  <p className="text-xs text-sky-200/90">Automation</p>
                  <p className="text-2xl font-semibold">10h</p>
                  <p className="text-xs text-sky-100/80">Scripts, tools, and clean-up</p>
                </div>

                <div className="rounded-md border border-sky-300/50 bg-sky-900/40 p-3">
                  <p className="text-xs text-sky-200/90">PPC Farm</p>
                  <p className="text-2xl font-semibold">14h</p>
                  <p className="text-xs text-sky-100/80">Campaigns and daily checks</p>
                </div>
              </div>
            </section>
          </div>
        </section>

       {/* Section 3 – Tasks Adopted (Responsive Grid) */}
<section className="space-y-4">
  <h2 className="text-xl font-semibold">Tasks Adopted</h2>
  <p className="text-sm text-sky-100/80">
    Simple stats about what improved since people adopted certain tasks.
  </p>

  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
    {/* Card 1 */}
    <div className="rounded-lg border border-sky-300/60 bg-sky-500/60 p-4">
      <h3 className="text-sm font-semibold">Total saved hours</h3>
      <p className="mt-1 text-3xl font-bold">28h</p>
      <p className="mt-1 text-xs text-sky-100/90">Time reduced by new habits</p>
    </div>

    {/* Card 2 */}
    <div className="rounded-lg border border-sky-300/60 bg-sky-500/60 p-4">
      <h3 className="text-sm font-semibold">Active projects</h3>
      <p className="mt-1 text-3xl font-bold text-emerald-200">4</p>
      <p className="mt-1 text-xs text-sky-100/90">Projects using new tasks</p>
    </div>

    {/* Card 3 */}
    <div className="rounded-lg border border-sky-300/60 bg-sky-500/60 p-4">
      <h3 className="text-sm font-semibold">Tasks adopted</h3>
      <p className="mt-1 text-3xl font-bold text-sky-50">12</p>
      <p className="mt-1 text-xs text-sky-100/90">New helpful tasks in use</p>
    </div>

    {/* Card 4 */}
    <div className="rounded-lg border border-sky-300/60 bg-sky-500/60 p-4">
      <h3 className="text-sm font-semibold">Time efficiency increase</h3>
      <p className="mt-1 text-3xl font-bold text-indigo-200">18%</p>
      <p className="mt-1 text-xs text-sky-100/90">Estimated improvement</p>
    </div>
  </div>
</section>

      </div>
    </main>
  )
}
