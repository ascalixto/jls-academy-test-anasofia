import { PageHeader } from "@/components/common/PageHeader"
import { StatsRow } from "@/components/dashboard/StatsRow"
import { InlineAlert } from "@/components/common/InlineAlert"
import { InfoRow } from "@/components/common/InfoRow"
import { Button } from "@/components/ui/button"

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Adopt a Task"
        subtitle="A collaborative sandbox to share and adopt tasks across teams."
        actions={
          <Button className="bg-sky-500 text-slate-1050 hover:bg-sky-400">
            New task
          </Button>
        }
      />

      <InlineAlert
        title="Today’s focus"
        description="Keep the UI consistent: shared components first, page composition second."
        tone="default"
        right={
          <span className="rounded-full border border-sky-500/30 bg-sky-500/10 px-2 py-0.5 text-xs text-sky-100">
            Beta
          </span>
        }
      />

      <StatsRow />

      <div className="grid gap-3 sm:grid-cols-2">
        <InfoRow label="Owner" value="Ana Sofia" hint="Placeholder user" />
        <InfoRow label="Environment" value="Dev" hint="Local sandbox mode" />
      </div>
    </div>
  )
}
