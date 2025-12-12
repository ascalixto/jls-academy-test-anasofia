import { NavLink, Outlet } from "react-router-dom"

const tabBase =
  "px-3 py-1.5 rounded-lg border transition-colors text-sm"

const tabActive =
  "border-sky-500/40 bg-sky-500/10 text-sky-100"

const tabInactive =
  "border-slate-700 bg-slate-900/50 text-slate-300 hover:border-slate-600 hover:text-slate-50"

export function SettingsLayout() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-slate-200">
          Adjust basic preferences for your sandbox, like profile info and notifications.
        </p>
        <p className="text-xs text-slate-400">
          Keep it simple: consistent UI now makes it easier to scale later.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Preferences</h2>

        {/* Secondary nav / tabs */}
        <nav className="flex gap-2">
          <NavLink
            to="."
            end
            className={({ isActive }: { isActive: boolean }) =>
              [tabBase, isActive ? tabActive : tabInactive].join(" ")
            }
          >
            Profile
          </NavLink>

          <NavLink
            to="notifications"
            className={({ isActive }: { isActive: boolean }) =>
              [tabBase, isActive ? tabActive : tabInactive].join(" ")
            }
          >
            Notifications
          </NavLink>
        </nav>

        {/* Nested content */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <Outlet />
        </div>
      </section>
    </div>
  )
}
