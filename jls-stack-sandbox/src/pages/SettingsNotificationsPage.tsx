export function SettingsNotificationsPage() {
  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <h2 className="text-xl font-semibold">Notification preferences</h2>
        <p className="text-sm text-slate-200">
          Control how often this sandbox should “ping” you about activity or changes.
        </p>
        <p className="text-xs text-slate-400">
          This is static for now — just a layout practice page.
        </p>
      </header>

      <div className="space-y-3">
        <label className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <input type="checkbox" className="mt-1 h-4 w-4" defaultChecked />
          <div className="space-y-1">
            <p className="text-base font-semibold">Weekly activity summary</p>
            <p className="text-xs text-slate-400">
              Brief recap of time spent, tasks adopted, and layout experiments.
            </p>
          </div>
        </label>

        <label className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <input type="checkbox" className="mt-1 h-4 w-4" />
          <div className="space-y-1">
            <p className="text-base font-semibold">New component suggestions</p>
            <p className="text-xs text-slate-400">
              Get ideas when new components are added to your gallery.
            </p>
          </div>
        </label>
      </div>
    </div>
  )
}
