import { InlineAlert } from "@/components/common/InlineAlert"
import { InfoRow } from "@/components/common/InfoRow"

export function SettingsNotificationsPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">
        Notification preferences
      </h2>
      <p className="text-sm text-muted-foreground">
        Control how often this sandbox would “ping” you (placeholder).
      </p>

      <InlineAlert
        tone="danger"
        title="Heads up"
        description="These toggles are not wired to state yet, this is UI-only for Module 2."
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <InfoRow label="Weekly summary" value="Enabled" hint="Static example" />
        <InfoRow label="Component ideas" value="Disabled" hint="Static example" />
      </div>
    </div>
  )
}
