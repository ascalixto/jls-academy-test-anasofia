import { PageHeader } from "@/components/common/PageHeader"
import { StatsRow } from "@/components/dashboard/StatsRow"

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Adopt a Task"
        subtitle="A collaborative sandbox to share and adopt tasks across teams."
      />

      <StatsRow />
    </div>
  )
}
