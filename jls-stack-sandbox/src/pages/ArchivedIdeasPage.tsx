import { useEffect, useMemo, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"

import type { ProductIdea } from "../types/productIdeas"
import {
  fetchIdeasPage,
  restoreProductIdea,
  type IdeaListFilters,
} from "../lib/firestore/productIdeas"

import { PageHeader } from "../components/common/PageHeader"
import { SectionCard } from "../components/common/SectionCard"
import { EmptyState } from "../components/common/EmptyState"
import { BadgePill } from "../components/common/BadgePill"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"

const PAGE_SIZE = 10

type LoadState = "loading" | "success" | "error"

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

function getParam(sp: URLSearchParams, key: string, fallback = "") {
  const v = sp.get(key)
  return v ?? fallback
}

export default function ArchivedIdeasPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const filters: IdeaListFilters = useMemo(() => {
    const q = getParam(searchParams, "q", "")
    return {
      q,
      archived: true,
    }
  }, [searchParams])

  const [state, setState] = useState<LoadState>("loading")
  const [ideas, setIdeas] = useState<ProductIdea[]>([])
  const [errorMessage, setErrorMessage] = useState("")
  const [restoringId, setRestoringId] = useState<string | null>(null)

  const [cursor, setCursor] = useState<any>(null)
  const [loadingMore, setLoadingMore] = useState(false)

  const hasMore = cursor != null

  // Local input state for search typing (debounced into URL)
  const [qInput, setQInput] = useState(filters.q ?? "")

  useEffect(() => {
    setQInput(filters.q ?? "")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.q])

  useEffect(() => {
    const t = setTimeout(() => {
      const next = new URLSearchParams(searchParams)
      const trimmed = qInput.trim()

      if (trimmed) next.set("q", trimmed)
      else next.delete("q")

      setSearchParams(next, { replace: true })
    }, 300)

    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qInput])

  async function loadFirstPage() {
    try {
      setState("loading")
      setErrorMessage("")
      setCursor(null)

      const res = await fetchIdeasPage({
        filters,
        pageSize: PAGE_SIZE,
        cursor: null,
      })

      setIdeas(res.items)
      setCursor(res.nextCursor)
      setState("success")
    } catch (err) {
      console.error(err)
      setErrorMessage(
        "Error fetching archived ideas. If Firestore asks for an index, create it and retry."
      )
      setState("error")
    }
  }

  async function onLoadMore() {
    if (!cursor) return

    setLoadingMore(true)
    setErrorMessage("")

    try {
      const res = await fetchIdeasPage({
        filters,
        pageSize: PAGE_SIZE,
        cursor,
      })

      setIdeas((prev) => [...prev, ...res.items])
      setCursor(res.nextCursor)
    } catch (err) {
      console.error(err)
      setErrorMessage("Failed to load more archived ideas.")
      setState("error")
    } finally {
      setLoadingMore(false)
    }
  }

  async function handleRestore(ideaId: string) {
    try {
      setRestoringId(ideaId)
      await restoreProductIdea(ideaId)
      await loadFirstPage()
    } catch (err) {
      console.error(err)
      alert("Restore failed. Check console for details.")
    } finally {
      setRestoringId(null)
    }
  }

  useEffect(() => {
    loadFirstPage()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.q])

  if (state === "loading") {
    return (
      <div className="space-y-6">
        <PageHeader title="Archived Ideas" subtitle="Loading archived ideas…" />
        <SectionCard title="Loading">
          <div className="h-4 w-1/2 rounded bg-muted" />
        </SectionCard>
      </div>
    )
  }

  if (state === "error") {
    return (
      <div className="space-y-6">
        <PageHeader title="Archived Ideas" subtitle="Error loading archived ideas" />
        <SectionCard title="Error">
          <pre className="text-xs">{errorMessage}</pre>
        </SectionCard>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to="/ideas">Back to Ideas</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Archived Ideas"
        subtitle="Search and restore archived items."
      />

      <div className="flex items-center gap-2">
        <Button asChild variant="outline" size="sm">
          <Link to="/ideas">Back to Ideas</Link>
        </Button>
      </div>

      <SectionCard title="Search">
        <Input
          value={qInput}
          onChange={(e) => setQInput(e.target.value)}
          placeholder="Search title (prefix search)"
        />
      </SectionCard>

      {ideas.length === 0 ? (
        <EmptyState
          title="No archived ideas match"
          description="Try clearing search, or archive an idea to see it here."
        />
      ) : (
        <div className="space-y-4">
          {ideas.map((idea) => (
            <SectionCard key={idea.id} title={idea.title}>
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <BadgePill label={idea.status} />
                  <BadgePill label={idea.priority} />
                  <BadgePill label="Archived" />
                </div>

                <div className="flex flex-wrap gap-2">
                  {idea.tags?.map((t) => (
                    <BadgePill key={t} label={t} />
                  ))}
                </div>

                <div className="text-xs text-muted-foreground">
                  Archived: {formatDate((idea as any).archivedAt)}
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleRestore(idea.id)}
                    disabled={restoringId === idea.id}
                  >
                    {restoringId === idea.id ? "Restoring…" : "Restore"}
                  </Button>

                  <Button asChild size="sm" variant="outline">
                    <Link to={`/ideas/${idea.id}`}>Open</Link>
                  </Button>
                </div>
              </div>
            </SectionCard>
          ))}

          <div className="flex justify-center pt-2">
            <Button
              variant="outline"
              onClick={onLoadMore}
              disabled={!hasMore || loadingMore}
            >
              {loadingMore ? "Loading…" : hasMore ? "Load more" : "No more results"}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
