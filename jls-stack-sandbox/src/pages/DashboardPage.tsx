import { useEffect, useState } from "react"

import { PageHeader } from "@/components/common/PageHeader"
import { StatsRow } from "@/components/dashboard/StatsRow"
import { InlineAlert } from "@/components/common/InlineAlert"
import { InfoRow } from "@/components/common/InfoRow"
import { Button } from "@/components/ui/button"
import { ChecklistCard } from "@/components/common/ChecklistCard"

import { subscribeActiveIdeas } from "@/lib/firestore/productIdeas"

export function DashboardPage() {
  const [liveStatus, setLiveStatus] = useState<"on" | "off">("off")
  const [liveCount, setLiveCount] = useState<number>(0)

  useEffect(() => {
    setLiveStatus("off")

    const unsub = subscribeActiveIdeas({
      onData: (ideas) => {
        setLiveCount(ideas.length)
        setLiveStatus("on")
      },
      onError: (err) => {
        console.error(err)
        setLiveStatus("off")
      },
    })

    return () => {
      unsub()
      setLiveStatus("off")
    }
  }, [])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Adopt a Task"
        subtitle="A collaborative sandbox to share and adopt tasks across teams."
        liveStatus={liveStatus}
        actions={<Button size="sm">New task</Button>}
      />

      <InlineAlert
        title="Today’s focus"
        description="Keep the UI consistent: shared components first, page composition second."
        tone="default"
        right={
          <span className="rounded-full border border-primary/25 bg-primary/10 px-2 py-0.5 text-xs text-foreground">
            Beta
          </span>
        }
      />

      <StatsRow />

      <div className="grid gap-4 sm:grid-cols-2">
        <InfoRow label="Owner" value="Ana Sofia" hint="Placeholder user" />
        <InfoRow label="Environment" value="Dev" hint="Local sandbox mode" />
        <InfoRow
          label="Tasks live"
          value={`${liveCount}`}
          hint="Real-time count from Firestore listener"
        />
      </div>

      {/* Reuse: quality snapshot */}
      <ChecklistCard
        title="Quality snapshot"
        description="Quick reminder of UI + a11y rules applied across this sandbox."
        items={[
          "Shared components reused across pages",
          "Focus states visible on all interactive elements",
          "Forms have labels, errors, and feedback states",
        ]}
      />
    </div>
  )
}
