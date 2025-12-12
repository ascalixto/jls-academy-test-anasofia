import { NavLink, Outlet } from "react-router-dom"

const baseLink =
  "px-3 py-1.5 rounded-lg transition-colors border border-transparent"

const activeLink =
  "bg-sky-500/10 text-sky-100 border-sky-500/40"

const inactiveLink =
  "text-slate-300 hover:bg-slate-800/40 hover:text-slate-50 hover:border-slate-700"

export function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Top bar */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            {/* Accent / mark */}
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-sky-600 text-xs font-bold text-sky-50">
              A
            </span>

            {/* Title + subtitle (Type Scale tokens) */}
            <div className="flex flex-col">
              <span className="text-2xl font-bold tracking-tight">
                Adopt-a-Task
              </span>
              <span className="text-xs text-slate-400">
                Organized • Collaborative • Creative
              </span>
            </div>
          </div>

          <nav className="flex items-center gap-2 text-sm">
            <NavLink
              to="/"
              end
              className={({ isActive }: { isActive: boolean }) =>
                [baseLink, isActive ? activeLink : inactiveLink].join(" ")
              }
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/layout-sandbox"
              className={({ isActive }: { isActive: boolean }) =>
                [baseLink, isActive ? activeLink : inactiveLink].join(" ")
              }
            >
              Layout Sandbox
            </NavLink>

            <NavLink
              to="/components"
              className={({ isActive }: { isActive: boolean }) =>
                [baseLink, isActive ? activeLink : inactiveLink].join(" ")
              }
            >
              Components
            </NavLink>

            <NavLink
              to="/settings"
              className={({ isActive }: { isActive: boolean }) =>
                [baseLink, isActive ? activeLink : inactiveLink].join(" ")
              }
            >
              Settings
            </NavLink>

            <NavLink
              to="/help"
              className={({ isActive }: { isActive: boolean }) =>
                [baseLink, isActive ? activeLink : inactiveLink].join(" ")
              }
            >
              Help
            </NavLink>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-5xl px-4 py-6">
        {/* Surface wrapper to make pages feel more “product-like” */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
