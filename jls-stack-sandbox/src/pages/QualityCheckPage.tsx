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
        <div className="rounded-xl border border-sky-500/40 bg-sky-500/10 p-4 space-y-2">
          <h2 className="text-sm font-semibold text-sky-100">Consistency</h2>
          <ul className="text-xs text-slate-200 space-y-1">
            <li>• Headings follow the same scale (pageTitle / sectionTitle)</li>
            <li>• Cards use the same padding + radius</li>
            <li>• Primary actions look consistent</li>
          </ul>
        </div>

        <div className="rounded-xl border border-sky-500/40 bg-sky-500/10 p-4 space-y-2">
          <h2 className="text-sm font-semibold text-sky-100">Accessibility</h2>
          <ul className="text-xs text-slate-200 space-y-1">
            <li>• Focus states visible on links and buttons</li>
            <li>• Text contrast readable on dark background</li>
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
