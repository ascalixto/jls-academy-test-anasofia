import { InlineAlert } from "@/components/common/InlineAlert"
import { InfoRow } from "@/components/common/InfoRow"
import { PageHeader } from "@/components/common/PageHeader"

export function SettingsNotificationsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Notification preferences"
        subtitle="Control how often this sandbox would “ping” you (placeholder)."
      />

      <InlineAlert
        tone="subtle"
        title="UI-only"
        description="These toggles are not wired to state yet. This page is for Module 2 layout + routing practice."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <InfoRow label="Weekly summary" value="Enabled" hint="Static example" />
        <InfoRow
          label="Component ideas"
          value="Disabled"
          hint="Static example"
        />
      </div>
    </div>
  )
}
