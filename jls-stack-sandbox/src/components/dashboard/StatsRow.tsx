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
            className="rounded-lg border border-slate-800 bg-slate-950/60 p-4"
          >
            {/* Label */}
            <p className="text-xs text-slate-300">
              {s.label}
            </p>

            {/* Value — white */}
            <p className="text-lg font-semibold text-slate-100">
              {s.value}
            </p>

            {/* Hint */}
            {s.hint ? (
              <p className="mt-1 text-xs text-slate-400">
                {s.hint}
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </SectionCard>
  )
}
