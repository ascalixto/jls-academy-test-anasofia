import { Link } from "react-router-dom"

const cardBase =
  "group block rounded-xl border p-4 transition-colors"

const cardSky =
  "border-sky-500/40 bg-sky-500/10 hover:bg-sky-500/15"

export function DashboardPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Adopt a Task</h1>
        <p className="text-sm text-slate-200">
          A collaborative tool where people can adopt tasks from other departments
          to speed up workflows, especially in teams where everyone is a bit of a generalist.
        </p>
        <p className="text-xs text-slate-400">
          Right now this is a UI/UX sandbox: routing, layout patterns, and consistent styling.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Pages</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <Link to="/layout-sandbox" className={[cardBase, cardSky].join(" ")}>
            <div className="space-y-2">
              <h3 className="text-base font-semibold text-sky-100">
                Layout Sandbox
              </h3>
              <p className="text-sm text-slate-200">
                Layout patterns and page structure experiments.
              </p>
              <p className="text-xs text-slate-400">
                Open → see work areas, weekly overview, and stats sections.
              </p>
            </div>
            <div className="mt-3 text-xs text-sky-200/90 group-hover:text-sky-100">
              Go to Layout Sandbox →
            </div>
          </Link>

          <Link to="/components" className={[cardBase, cardSky].join(" ")}>
            <div className="space-y-2">
              <h3 className="text-base font-semibold text-sky-100">
                Components
              </h3>
              <p className="text-sm text-slate-200">
                Small reusable UI patterns (cards, tags, simple modules).
              </p>
              <p className="text-xs text-slate-400">
                Open → keep styles consistent across the app.
              </p>
            </div>
            <div className="mt-3 text-xs text-sky-200/90 group-hover:text-sky-100">
              Go to Components →
            </div>
          </Link>
        </div>
      </section>
    </div>
  )
}
