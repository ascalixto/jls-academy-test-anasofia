import { SectionCard } from "@/components/common/SectionCard"

type Stat = {
  label: string
  value: string
  hint?: string
}

const defaultStats: Stat[] = [
  { label: "Routes", value: "6" },
  { label: "Shell", value: "Active" },
  { label: "UI System", value: "Growing" },
]

export function StatsRow({ stats = defaultStats }: { stats?: Stat[] }) {
  return (
    <SectionCard
      title="Sandbox Status"
      description="High-level snapshot of what this sandbox currently supports."
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {stats.map((s, idx) => (
          <div
            key={idx}
            className="rounded-lg border border-border bg-card/60 p-4"
          >
            <p className="text-xs text-muted-foreground">{s.label}</p>

            <p className="text-lg font-semibold text-foreground">{s.value}</p>

            {s.hint ? (
              <p className="mt-1 text-xs text-muted-foreground">{s.hint}</p>
            ) : null}
          </div>
        ))}
      </div>
    </SectionCard>
  )
}
