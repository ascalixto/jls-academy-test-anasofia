import { PageHeader } from "@/components/common/PageHeader"
import { EmptyState } from "@/components/common/EmptyState"
import { InlineAlert } from "@/components/common/InlineAlert"
import { InfoRow } from "@/components/common/InfoRow"
import { Button } from "@/components/ui/button"

export function ComponentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Component Gallery"
        subtitle="Mini internal style guide: reusable blocks used across the sandbox."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {/* InlineAlert */}
        <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="text-sm font-semibold">InlineAlert</div>
          <p className="text-sm text-slate-300">
            Inline message block for status, tips, and warnings. Supports variants via{" "}
            <span className="font-medium text-slate-100">tone</span>.
          </p>

          <div className="space-y-3">
            <InlineAlert
              tone="default"
              title="Default"
              description="Used for general callouts and product hints."
              right={
                <span className="rounded-full border border-sky-500/30 bg-sky-500/10 px-2 py-0.5 text-xs text-sky-100">
                  Beta
                </span>
              }
            />

            <InlineAlert
              tone="subtle"
              title="Subtle"
              description="Used for low-priority notes."
            />

            <InlineAlert
              tone="danger"
              title="Danger"
              description="Used for warnings or risky actions."
              right={
                <Button size="sm" variant="destructive">
                  Action
                </Button>
              }
            />
          </div>
        </div>

        {/* InfoRow */}
        <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="text-sm font-semibold">InfoRow</div>
          <p className="text-sm text-slate-300">
            Consistent label/value rows for settings, metadata, and quick facts.
          </p>

          <div className="space-y-2">
            <InfoRow label="Owner" value="Ana Sofia" hint="Placeholder user" />
            <InfoRow label="Environment" value="Dev" hint="Local sandbox mode" />
            <InfoRow label="Routes" value="Growing" />
          </div>
        </div>

        {/* EmptyState */}
        <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4 lg:col-span-2">
          <div className="text-sm font-semibold">EmptyState</div>
          <p className="text-sm text-slate-300">
            Standard empty-state panel for places where content will exist later.
          </p>

          <EmptyState
            title="No components pinned yet"
            description="In a real tool, this could show saved patterns, favorites, or recent blocks."
            actionLabel="Pin a component (later)"
            onAction={() => {}}
          />
        </div>
      </div>
    </div>
  )
}
