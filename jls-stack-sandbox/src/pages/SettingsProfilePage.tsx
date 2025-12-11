export function SettingsProfilePage() {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">Profile basics</h2>
      <p className="text-sm text-slate-300">
        Simple information about the person using this sandbox. In a real app, this might sync with Auth.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wide text-slate-400">Display name</p>
          <p className="rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm">
            Sandbox user
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wide text-slate-400">Role</p>
          <p className="rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm">
            Product engineer in training
          </p>
        </div>
      </div>
    </div>
  )
}
