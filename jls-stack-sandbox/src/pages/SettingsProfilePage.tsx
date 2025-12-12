export function SettingsProfilePage() {
  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <h2 className="text-xl font-semibold">Profile basics</h2>
        <p className="text-sm text-slate-200">
          Simple information about the person using this sandbox. In a real app, this might sync with Auth.
        </p>
        <p className="text-xs text-slate-400">
          For now, we focus on structure and consistent styles.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 space-y-2">
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Display name
          </p>
          <p className="rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-slate-200">
            Sandbox user
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 space-y-2">
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Role
          </p>
          <p className="rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-slate-200">
            Product engineer in training
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-sky-500/40 bg-sky-500/10 p-4">
        <p className="text-xs text-slate-400">Note</p>
        <p className="text-sm text-sky-100">
          Later, this page can connect to Firebase Auth to show real user info.
        </p>
      </div>
    </div>
  )
}
