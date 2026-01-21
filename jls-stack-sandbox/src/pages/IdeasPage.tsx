import { useEffect, useMemo, useState } from "react"
import type { ProductIdea, ProductIdeaStatus } from "../types/productIdeas"
import {
  getAllProductIdeas,
  getProductIdeasByStatus,
} from "../lib/firestore/productIdeas"

import { PageHeader } from "../components/common/PageHeader"
import { SectionCard } from "../components/common/SectionCard"
import { EmptyState } from "../components/common/EmptyState"
import { BadgePill } from "../components/common/BadgePill"
import { Button } from "../components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select"

import { IdeaDetailModal } from "../components/ideas/IdeaDetailModal"

type LoadState = "idle" | "loading" | "success" | "error"
type StatusFilter = ProductIdeaStatus | "all"

function formatDate(value: unknown) {
  const maybeTs = value as { toDate?: () => Date } | null
  if (maybeTs?.toDate) {
    return maybeTs.toDate().toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }
  return "—"
}

function isNotArchived(idea: ProductIdea) {
  const archivedAt = (idea as any).archivedAt
  return archivedAt == null
}

export default function IdeasPage() {
  const [state, setState] = useState<LoadState>("idle")
  const [ideas, setIdeas] = useState<ProductIdea[]>([])
  const [errorMessage, setErrorMessage] = useState("")
  const [selectedIdea, setSelectedIdea] = useState<ProductIdea | null>(null)

  const [status, setStatus] = useState<StatusFilter>("all")

  const activeFiltersText = useMemo(() => {
    return status === "all" ? "None" : `Status: ${status}`
  }, [status])

  async function loadIdeasByStatus(nextStatus: StatusFilter) {
    try {
      setState("loading")
      setErrorMessage("")

      const data =
        nextStatus === "all"
          ? await getAllProductIdeas()
          : await getProductIdeasByStatus(nextStatus)

      const visible = data.filter(isNotArchived)

      setIdeas(visible)
      setState("success")
    } catch (err) {
      console.error(err)
      setErrorMessage("Error fetching ideas.")
      setState("error")
    }
  }

  useEffect(() => {
    loadIdeasByStatus("all")
  }, [])

  useEffect(() => {
    loadIdeasByStatus(status)
  }, [status])

  if (state === "loading") {
    return (
      <div className="space-y-6">
        <PageHeader title="Ideas" subtitle="Loading ideas…" />
        <SectionCard title="Loading">
          <div className="h-4 w-1/2 rounded bg-muted" />
        </SectionCard>
      </div>
    )
  }

  if (state === "error") {
    return (
      <div className="space-y-6">
        <PageHeader title="Ideas" subtitle="Error loading ideas" />
        <SectionCard title="Error">
          <pre className="text-xs">{errorMessage}</pre>
        </SectionCard>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Ideas" subtitle="Filter ideas by status." />

      <SectionCard title="Status Filter">
        <div className="grid gap-4 md:grid-cols-2">
          <Select
            value={status}
            onValueChange={(v) => setStatus(v as StatusFilter)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center justify-start md:justify-end">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setStatus("all")}
              disabled={status === "all"}
            >
              Clear
            </Button>
          </div>
        </div>

        <div className="pt-3 text-sm text-muted-foreground">
          Active filters: {activeFiltersText}
        </div>
      </SectionCard>

      {ideas.length === 0 ? (
        <EmptyState title="No ideas found" description="Try a different status." />
      ) : (
        <div className="space-y-4">
          {ideas.map((idea) => (
            <SectionCard key={idea.id} title={idea.title}>
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <BadgePill label={idea.status} />
                  <BadgePill label={idea.priority} />
                </div>

                <div className="flex flex-wrap gap-2">
                  {idea.tags?.map((t) => (
                    <BadgePill key={t} label={t} />
                  ))}
                </div>

                <div className="text-xs text-muted-foreground">
                  Updated: {formatDate((idea as any).updatedAt)}
                </div>

                <div className="pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedIdea(idea)}
                  >
                    View details
                  </Button>
                </div>
              </div>
            </SectionCard>
          ))}
        </div>
      )}

      {selectedIdea && (
        <IdeaDetailModal
          idea={selectedIdea}
          onClose={() => setSelectedIdea(null)}
        />
      )}
    </div>
  )
}
