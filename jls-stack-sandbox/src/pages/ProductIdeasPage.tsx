// src/pages/ProductIdeasPage.tsx
import { useEffect, useMemo, useState } from "react"
import { PageHeader } from "@/components/common/PageHeader"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { InlineAlert } from "@/components/common/InlineAlert"
import { EmptyState } from "@/components/common/EmptyState"

import type { ProductIdeaStatus, ProductIdea } from "@/types/productIdeas"
import {
  getFilteredProductIdeas,
  type ProductIdeaFilters,
} from "@/lib/firestore/productIdeas"

type StatusFilter = ProductIdeaStatus | "all"

export function ProductIdeasPage() {
  const [status, setStatus] = useState<StatusFilter>("all")
  const [tag, setTag] = useState("")

  const [ideas, setIdeas] = useState<ProductIdea[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const filters: ProductIdeaFilters = useMemo(() => {
    const cleanTag = tag.trim()
    return {
      status: status === "all" ? undefined : status,
      tag: cleanTag.length > 0 ? cleanTag : undefined,
    }
  }, [status, tag])

  async function loadIdeas(nextFilters: ProductIdeaFilters) {
    try {
      setError(null)
      setLoading(true)
      const result = await getFilteredProductIdeas(nextFilters)
      setIdeas(result)
    } catch (e) {
      console.error(e)
      setError(
        "Query failed. If Firestore asks for an index, create it in the console and try again."
      )
      setIdeas([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // initial load: show all ideas sorted
    loadIdeas({})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleApply() {
    loadIdeas(filters)
  }

  function handleClear() {
    setStatus("all")
    setTag("")
    loadIdeas({})
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Product Ideas"
        subtitle="Filter ideas by status and tag using Firestore queries."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={handleApply} disabled={loading}>
              {loading ? "Loading..." : "Apply filters"}
            </Button>
            <Button size="sm" variant="outline" onClick={handleClear} disabled={loading}>
              Clear
            </Button>
          </div>
        }
      />

      <Card className="p-6 space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <div className="text-sm font-medium text-foreground">Status</div>
            <Select value={status} onValueChange={(v) => setStatus(v as StatusFilter)}>
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
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium text-foreground">Tag</div>
            <Input
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder='Type a tag (example: "ops")'
            />
            <div className="text-xs text-muted-foreground">
              Uses <span className="font-medium">array-contains</span> on <span className="font-medium">tags</span>.
            </div>
          </div>
        </div>

        {error ? (
          <InlineAlert
            tone="danger"
            title="Query error"
            description={error}
          />
        ) : null}
      </Card>

      {loading ? (
        <InlineAlert title="Loading ideas..." description="Fetching data from Firestore." />
      ) : null}

      {!loading && ideas.length === 0 ? (
        <EmptyState
          title="No ideas found"
          description="Try a different status or tag."
          actionLabel="Clear filters"
          onAction={handleClear}
        />
      ) : null}

      {!loading && ideas.length > 0 ? (
        <div className="grid gap-4">
          {ideas.map((idea) => (
            <Card key={idea.id} className="p-4">
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-base font-semibold text-foreground">
                    {idea.title}
                  </div>
                  <span className="rounded-full border border-border bg-accent px-2 py-0.5 text-xs text-foreground">
                    {idea.status}
                  </span>
                </div>

                <div className="text-sm text-muted-foreground">
                  {idea.summary}
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {idea.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-border bg-card/60 px-2 py-0.5 text-xs text-muted-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : null}
    </div>
  )
}
