import { PageHeader } from "@/components/common/PageHeader"
import { EmptyState } from "@/components/common/EmptyState"

export function QualityCheckPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Quality Check"
        subtitle="A quick self-audit page for UI polish, consistency, and basic accessibility checks."
      />

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-card/70 p-4 space-y-2">
          <h2 className="text-sm font-semibold text-foreground">Consistency</h2>
          <ul className="text-xs space-y-1 text-muted-foreground">
            <li>• Headings follow the same scale (pageTitle / sectionTitle)</li>
            <li>• Cards use the same padding + radius</li>
            <li>• Primary actions look consistent</li>
          </ul>
        </div>

        <div className="rounded-xl border border-border bg-card/70 p-4 space-y-2">
          <h2 className="text-sm font-semibold text-foreground">
            Accessibility
          </h2>
          <ul className="text-xs space-y-1 text-muted-foreground">
            <li>• Focus states visible on links and buttons</li>
            <li>• Text contrast readable on background</li>
            <li>• No layout breaks on small screens</li>
          </ul>
        </div>
      </section>

      <EmptyState
        title="No issues logged yet"
        description="In a real tool, this could show saved QA notes, accessibility checks, or follow-ups."
        actionLabel="Add first issue (later)"
        onAction={() => {}}
      />
    </div>
  )
}
