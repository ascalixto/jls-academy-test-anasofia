import { PageHeader } from "@/components/common/PageHeader"
import { SectionCard } from "@/components/common/SectionCard"

export function HelpPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Help & Documentation"
        subtitle="Quick references and guidance for your JLS sandbox."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <SectionCard title="Week 1 Docs" description="Setup and fundamentals">
          <p className="text-sm text-slate-300">
            Stack overview, environment setup, and first layout experiments.
          </p>
        </SectionCard>

        <SectionCard title="Week 2 UI/UX" description="Layout & shell">
          <p className="text-sm text-slate-300">
            Routing, app shell, brand kit, and reusable components.
          </p>
        </SectionCard>

        <SectionCard title="Asking for Help" description="When you feel stuck">
          <p className="text-sm text-slate-300">
            Use Slack, mentor hours, or tickets to unblock yourself early.
          </p>
        </SectionCard>
      </div>
    </div>
  )
}
