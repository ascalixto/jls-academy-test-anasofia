import { LayoutSandbox } from "@/components/layout/LayoutSandbox"
import { PageHeader } from "@/components/common/PageHeader"
import { SectionCard } from "@/components/common/SectionCard"

export function LayoutSandboxPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Layout Sandbox"
        subtitle="A playground for testing Tailwind layout patterns."
      />

      <SectionCard
        title="Layout Experiments"
        description="Vertical stacks, grids, and responsive patterns"
      >
        <div className="rounded-xl border border-slate-800 overflow-hidden">
          <LayoutSandbox />
        </div>
      </SectionCard>
    </div>
  )
}
