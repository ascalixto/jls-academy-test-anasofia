// src/pages/IdeasPage.tsx
import { useEffect, useMemo, useState } from "react"
import type { ProductIdea, ProductIdeaStatus } from "../types/productIdeas"
import {
  getAllProductIdeas,
  getFilteredProductIdeas,
} from "../lib/firestore/productIdeas"

import { PageHeader } from "../components/common/PageHeader"
import { SectionCard } from "../components/common/SectionCard"
import { EmptyState } from "../components/common/EmptyState"
import { BadgePill } from "../components/common/BadgePill"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select"

type LoadState = "idle" | "loading" | "success" | "error"
type StatusFilter = ProductIdeaStatus | "all"

export default function IdeasPage() {
  const [state, setState] = useState<LoadState>("idle")
  const [ideas, setIdeas] = useState<ProductIdea[]>([])
  const [errorMessage, setErrorMessage] = useState<string>("")

  // Filters (Lesson 3.3)
  const [status, setStatus] = useState<StatusFilter>("all")
  const [tag, setTag] = useState<string>("")

  const filters = useMemo(() => {
    const cleanTag = tag.trim()
    return {
      status: status === "all" ? undefined : status,
      tag: cleanTag.length > 0 ? cleanTag : undefined,
    }
  }, [status, tag])

  async function loadIdeas(input?: { status?: ProductIdeaStatus; tag?: string }) {
    console.log("[IdeasPage] start fetch")

    try {
      setState("loading")
      setErrorMessage("")

      const timeoutMs = 8000

      const data = await Promise.race([
        input ? getFilteredProductIdeas(input) : getAllProductIdeas(),
        new Promise<ProductIdea[]>((_, reject) =>
          setTimeout(
            () =>
              reject(
                new Error(
                  "Timed out fetching ideas. Check Firebase config / Firestore rules / network."
                )
              ),
            timeoutMs
          )
        ),
      ])

      console.log("[IdeasPage] fetch success. count:", data.length)

      setIdeas(data)
      setState("success")
    } catch (err) {
      console.log("[IdeasPage] fetch error:", err)

      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong while fetching ideas."

      const indexHint =
        "If Firestore asks for an index in the console error, click the link, create the index, wait a minute, then try again."

      setErrorMessage(`${message}\n\n${indexHint}`)
      setState("error")
    }
  }

  useEffect(() => {
    // Initial load: show all ideas
    loadIdeas()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleApply() {
    loadIdeas(filters)
  }

  function handleClear() {
    setStatus("all")
    setTag("")
    loadIdeas()
  }

  if (state === "loading") {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Ideas"
          subtitle="Filter product ideas by status and tag using Firestore queries."
        />

        <SectionCard title="Loading">
          <div className="space-y-3">
            <div className="h-4 w-2/3 rounded bg-muted" />
            <div className="h-4 w-1/2 rounded bg-muted" />
            <div className="h-4 w-3/4 rounded bg-muted" />
          </div>
        </SectionCard>
      </div>
    )
  }

  if (state === "error") {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Ideas"
          subtitle="Filter product ideas by status and tag using Firestore queries."
        />

        <SectionCard title="Error">
          <div className="space-y-2">
            <p className="text-sm font-medium">Couldn’t load ideas</p>
            <p className="text-sm text-muted-foreground">
              There was an error fetching data. Please try again.
            </p>

            {errorMessage ? (
              <pre className="whitespace-pre-wrap rounded-md bg-muted p-3 text-xs">
                {errorMessage}
              </pre>
            ) : null}

            <div className="flex gap-2 pt-2">
              <Button size="sm" variant="outline" onClick={handleApply}>
                Retry with filters
              </Button>
              <Button size="sm" variant="outline" onClick={handleClear}>
                Clear filters
              </Button>
            </div>
          </div>
        </SectionCard>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ideas"
        subtitle="Filter product ideas by status and tag using Firestore queries."
      />

      {/* Filters UI (Lesson 3.3) */}
      <SectionCard title="Filters">
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
              Uses Firestore <span className="font-medium">array-contains</span> on{" "}
              <span className="font-medium">tags</span>.
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-4">
          <Button size="sm" variant="outline" onClick={handleApply}>
            Apply filters
          </Button>
          <Button size="sm" variant="outline" onClick={handleClear}>
            Clear
          </Button>
        </div>
      </SectionCard>

      {ideas.length === 0 ? (
        <EmptyState
          title="No ideas found"
          description="Try a different status or tag."
        />
      ) : (
        <div className="space-y-4">
          {ideas.map((idea) => (
            <SectionCard key={idea.id} title={idea.title}>
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <BadgePill label={idea.status} />
                </div>

                <div className="flex flex-wrap gap-2">
                  {idea.tags && idea.tags.length > 0 ? (
                    idea.tags.map((t) => (
                      <BadgePill key={`${idea.id}-${t}`} label={t} />
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">No tags</span>
                  )}
                </div>
              </div>
            </SectionCard>
          ))}
        </div>
      )}
    </div>
  )
}
