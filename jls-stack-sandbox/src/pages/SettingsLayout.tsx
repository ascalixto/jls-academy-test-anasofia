import { NavLink, Outlet } from "react-router-dom"

export function SettingsLayout() {
  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-slate-300">
          Adjust basic preferences for your sandbox, like profile info and notifications.
        </p>
      </header>

      {/* Secondary nav / tabs */}
      <nav className="flex gap-2 text-sm">
        <NavLink
          to="."
          end
          className={({ isActive }: { isActive: boolean }) =>
            [
              "px-3 py-1.5 rounded-lg border transition-colors",
              isActive
                ? "border-sky-500 bg-sky-500/20 text-sky-100"
                : "border-slate-700 bg-slate-900/40 text-slate-300 hover:border-sky-500/70 hover:text-sky-100",
            ].join(" ")
          }
        >
          Profile
        </NavLink>

        <NavLink
          to="notifications"
          className={({ isActive }: { isActive: boolean }) =>
            [
              "px-3 py-1.5 rounded-lg border transition-colors",
              isActive
                ? "border-sky-500 bg-sky-500/20 text-sky-100"
                : "border-slate-700 bg-slate-900/40 text-slate-300 hover:border-sky-500/70 hover:text-sky-100",
            ].join(" ")
          }
        >
          Notifications
        </NavLink>
      </nav>

      {/* Nested content */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <Outlet />
      </div>
    </div>
  )
}
