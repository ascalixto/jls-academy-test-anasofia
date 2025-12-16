import { PageHeader } from "@/components/common/PageHeader"
import { EmptyState } from "@/components/common/EmptyState"
import { InfoRow } from "@/components/common/InfoRow"

export function HelpPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Help & Documentation"
        subtitle="Quick references for this sandbox, plus where to ask for help."
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <InfoRow label="Repo" value="GitHub sandbox" hint="Same repo all week" />
        <InfoRow
          label="Routing"
          value="React Router"
          hint="Layout route + Outlet pattern"
        />
      </div>

      <EmptyState
        title="No saved links yet"
        description="Add links you keep using (docs, tickets, channels) so future-you wastes less time."
        actionLabel="Add first link (later)"
        onAction={() => {}}
      />
    </div>
  )
}
