import { NavLink, Outlet } from "react-router-dom"

export function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Top bar */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500 text-xs font-bold">
              J
            </span>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">JLS Stack Sandbox</span>
              <span className="text-xs text-slate-400">Week 2 – UI/UX & Layout</span>
            </div>
          </div>

          <nav className="flex items-center gap-2 text-sm">
            <NavLink
              to="/"
              className={({ isActive }: { isActive: boolean }) =>
                [
                  "px-3 py-1.5 rounded-lg transition-colors",
                  isActive
                    ? "bg-slate-800 text-slate-50"
                    : "text-slate-300 hover:bg-slate-800/60 hover:text-slate-50",
                ].join(" ")
              }
              end
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/layout-sandbox"
              className={({ isActive }: { isActive: boolean }) =>
                [
                  "px-3 py-1.5 rounded-lg transition-colors",
                  isActive
                    ? "bg-slate-800 text-slate-50"
                    : "text-slate-300 hover:bg-slate-800/60 hover:text-slate-50",
                ].join(" ")
              }
            >
              Layout Sandbox
            </NavLink>

            <NavLink
              to="/components"
              className={({ isActive }: { isActive: boolean }) =>
                [
                  "px-3 py-1.5 rounded-lg transition-colors",
                  isActive
                    ? "bg-slate-800 text-slate-50"
                    : "text-slate-300 hover:bg-slate-800/60 hover:text-slate-50",
                ].join(" ")
              }
            >
              Components
            </NavLink>

            <NavLink
              to="/settings"
              className={({ isActive }: { isActive: boolean }) =>
                [
                  "px-3 py-1.5 rounded-lg transition-colors",
                  isActive
                    ? "bg-slate-800 text-slate-50"
                    : "text-slate-300 hover:bg-slate-800/60 hover:text-slate-50",
                ].join(" ")
              }
            >
              Settings
            </NavLink>

            <NavLink
              to="/help"
              className={({ isActive }: { isActive: boolean }) =>
                [
                  "px-3 py-1.5 rounded-lg transition-colors",
                  isActive
                    ? "bg-slate-800 text-slate-50"
                    : "text-slate-300 hover:bg-slate-800/60 hover:text-slate-50",
                ].join(" ")
              }
            >
              Help
            </NavLink>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
