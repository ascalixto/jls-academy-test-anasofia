import { PageHeader } from "@/components/common/PageHeader"
import { InlineAlert } from "@/components/common/InlineAlert"
import { LayoutSandbox } from "@/components/layout/LayoutSandbox"

export function LayoutSandboxPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Layout Sandbox"
        subtitle="A playground for practicing Tailwind layout patterns."
      />

      <InlineAlert
        tone="subtle"
        title="Tip"
        description="If you see repeated UI blocks, extract them into components/common."
      />

      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="overflow-hidden rounded-xl border border-slate-800">
          <LayoutSandbox />
        </div>
      </div>
    </div>
  )
}
