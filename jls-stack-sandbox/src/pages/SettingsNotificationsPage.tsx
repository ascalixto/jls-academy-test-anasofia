export function SettingsNotificationsPage() {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">Notification preferences</h2>
      <p className="text-sm text-slate-300">
        Control how often this sandbox should “ping” you about activity or changes.
      </p>

      <div className="space-y-3">
        <label className="flex items-start gap-2">
          <input type="checkbox" className="mt-1 h-4 w-4" defaultChecked />
          <div>
            <p className="text-sm font-medium">Weekly activity summary</p>
            <p className="text-xs text-slate-400">
              Brief recap of time spent, tasks adopted, and layout experiments.
            </p>
          </div>
        </label>

        <label className="flex items-start gap-2">
          <input type="checkbox" className="mt-1 h-4 w-4" />
          <div>
            <p className="text-sm font-medium">New component suggestions</p>
            <p className="text-xs text-slate-400">
              Get ideas when new components are added to your gallery.
            </p>
          </div>
        </label>
      </div>
    </div>
  )
}
