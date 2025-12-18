import { PageHeader } from "@/components/common/PageHeader"
import { EmptyState } from "@/components/common/EmptyState"
import { InfoRow } from "@/components/common/InfoRow"
import { ChecklistCard } from "@/components/common/ChecklistCard"

export function HelpPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Help & Documentation"
        subtitle="Quick references for this sandbox, plus where to ask for help."
      />

      <section className="grid gap-4 sm:grid-cols-2">
        <InfoRow label="Repo" value="GitHub sandbox" hint="Same repo all week" />
        <InfoRow
          label="Routing"
          value="React Router"
          hint="Layout route + Outlet pattern"
        />
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <ChecklistCard
          title="How to use this sandbox"
          description="Small rules that keep the UI consistent across pages."
          items={[
            "Prefer shared components before custom one-offs",
            "Keep the same spacing rhythm (space-y-6 on pages)",
            "Make states obvious: loading, success, error, empty",
          ]}
        />

        <ChecklistCard
          title="Accessibility quick checks"
          description="Baseline checks before you ship internal UI."
          items={[
            "Tab through the sidebar (focus ring visible)",
            "Forms: label is linked to the input",
            "Errors show close to fields + are readable",
          ]}
        />
      </section>

      <EmptyState
        title="No saved links yet"
        description="Add links you keep using (docs, tickets, channels) so future-you wastes less time."
        actionLabel="Add first link (later)"
        onAction={() => {}}
      />
    </div>
  )
}
