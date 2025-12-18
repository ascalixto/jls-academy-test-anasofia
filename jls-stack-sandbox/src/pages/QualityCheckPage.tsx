import { PageHeader } from "@/components/common/PageHeader"
import { ChecklistCard } from "@/components/common/ChecklistCard"

export function QualityCheckPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Quality Check"
        subtitle="Internal checklist for polish + accessibility before Week 3."
      />

      {/* Brand kit direction */}
      <section className="rounded-xl border border-border bg-card/70 p-4">
        <h2 className="text-sm font-semibold text-foreground">
          Brand direction (Week 2)
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Light-first UI with a soft blue background, semi-transparent blue
          cards, and semantic tokens (bg-background, bg-card, text-foreground).
          The goal is high contrast, calm rhythm, and a UI you can use all day.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <ChecklistCard
          title="UI polish rules I followed"
          description="Consistency beats perfection. Same rhythm across pages."
          items={[
            "One spacing rhythm: page sections use the same vertical gaps",
            "Typography tiers stay stable: page title, section title, body, small/meta",
            "Cards use consistent padding + radius",
            "Interactive states exist: hover, focus-visible, disabled, loading when needed",
            "Forms keep predictable error placement + submit feedback",
          ]}
        />

        <ChecklistCard
          title="Accessibility checks I completed"
          description="Baseline a11y habits for modern product UI."
          items={[
            "Keyboard navigation works with visible focus styles",
            "Semantic landmarks exist (header / nav / main / aside)",
            "Labels are linked to inputs (htmlFor + id)",
            "Errors are clear and announced (InlineAlert role/aria-live)",
            "Contrast checked on sidebar + muted text + input borders",
          ]}
        />
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <ChecklistCard
          title="Axe DevTools scan (manual log)"
          description="Scan at least two pages and record results here."
          items={[
            "Scanned: Dashboard",
            "Scanned: Settings",
            "Result: (fill after running axe) — e.g. 0 critical, 0 serious, 2 minor",
            "Fixes applied for any issues found",
          ]}
        />

        <ChecklistCard
          title="Week 2 integrity check"
          description="Quick self-check before submission."
          items={[
            "All routes still work",
            "AppLayout still drives the shell",
            "No separate app folder created",
            "New work fits existing structure",
            "Sandbox feels more cohesive than yesterday",
          ]}
        />
      </section>
    </div>
  )
}

