import { useEffect, useMemo, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"

import type { ProductIdea, ProductIdeaStatus, ProductIdeaTag } from "../types/productIdeas"
import {
  fetchIdeasPage,
  type IdeaListFilters,
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

const PAGE_SIZE = 10

type LoadState = "loading" | "success" | "error"
type StatusFilter = ProductIdeaStatus | "all"

const ALL_TAGS: ProductIdeaTag[] = [
  "copywriting",
  "NPD",
  "marketing",
  "design",
  "automation",
  "tools",
  "general",
]

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

export default function IdeasPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const filters: IdeaListFilters = useMemo(() => {
    const q = getParam(searchParams, "q", "")
    const status = getParam(searchParams, "status", "all") as StatusFilter
    const tag = getParam(searchParams, "tag", "")
    const archived = getParam(searchParams, "archived", "false") === "true"

    return {
      q,
      status,
      tag: (tag ? (tag as ProductIdeaTag) : "") as any,
      archived,
    }
  }, [searchParams])

  const [state, setState] = useState<LoadState>("loading")
  const [errorMessage, setErrorMessage] = useState("")
  const [ideas, setIdeas] = useState<ProductIdea[]>([])

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

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(searchParams)
    if (!value || value === "all") next.delete(key)
    else next.set(key, value)
    setSearchParams(next, { replace: true })
  }

  function toggleArchived() {
    const next = new URLSearchParams(searchParams)
    const current = getParam(next, "archived", "false") === "true"
    next.set("archived", (!current).toString())
    setSearchParams(next, { replace: true })
  }

  function resetList() {
    setSearchParams(new URLSearchParams(), { replace: true })
  }

  // Load first page whenever URL-backed filters change
  useEffect(() => {
    let alive = true

    async function run() {
      setState("loading")
      setErrorMessage("")
      setCursor(null)

      try {
        const res = await fetchIdeasPage({
          filters,
          pageSize: PAGE_SIZE,
          cursor: null,
        })

        if (!alive) return
        setIdeas(res.items)
        setCursor(res.nextCursor)
        setState("success")
      } catch (err) {
        console.error(err)
        if (!alive) return
        setErrorMessage(
          "Failed to load ideas. If Firestore asks for an index, create it and retry."
        )
        setState("error")
      }
    }

    run()

    return () => {
      alive = false
    }
  }, [filters.archived, filters.status, filters.tag, filters.q])

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
      setErrorMessage("Failed to load more ideas.")
      setState("error")
    } finally {
      setLoadingMore(false)
    }
  }

  const activeFiltersText = useMemo(() => {
    const parts: string[] = []
    parts.push(filters.archived ? "Archived" : "Active")
    if (filters.status && filters.status !== "all") parts.push(`Status: ${filters.status}`)
    if (filters.tag) parts.push(`Tag: ${filters.tag}`)
    if (filters.q && filters.q.trim()) parts.push(`Search: ${filters.q.trim()}`)
    return parts.join(" • ")
  }, [filters.archived, filters.status, filters.tag, filters.q])

  // Pagination UX: "Showing X…" (total unknown)
  const progressText = useMemo(() => {
    if (state !== "success") return ""
    if (ideas.length === 0) return ""
    return hasMore ? `Showing ${ideas.length}+` : `Showing ${ideas.length}`
  }, [state, ideas.length, hasMore])

  return (
    <div className="space-y-6">
      <PageHeader title="Ideas" subtitle="Filter, search, and paginate." />

      <div className="flex flex-wrap items-center gap-2">
        <Button asChild size="sm">
          <Link to="/ideas/new">New Idea</Link>
        </Button>

        <Button asChild variant="outline" size="sm">
          <Link to="/ideas/archived">Archived Ideas</Link>
        </Button>
      </div>

      <SectionCard title="Filters + Search">
        <div className="grid gap-4 md:grid-cols-4">
          <div className="md:col-span-2 space-y-2">
            <Input
              value={qInput}
              onChange={(e) => setQInput(e.target.value)}
              placeholder="Search title (starts with…)"
            />
            <div className="text-xs text-muted-foreground">
              Search is prefix-only (starts-with). It doesn’t do full-text.
            </div>
          </div>

          <Select
            value={(filters.status ?? "all") as string}
            onValueChange={(v) => setParam("status", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.tag ? String(filters.tag) : "all"}
            onValueChange={(v) => setParam("tag", v === "all" ? "" : v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All tags</SelectItem>
              {ALL_TAGS.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" variant="outline" onClick={toggleArchived}>
              {filters.archived
                ? "Showing: Archived (click for Active)"
                : "Showing: Active (click for Archived)"}
            </Button>

            <Button size="sm" variant="outline" onClick={resetList}>
              Reset list
            </Button>
          </div>

          <div className="text-sm text-muted-foreground">
            {activeFiltersText}
            {progressText ? ` • ${progressText}` : ""}
          </div>
        </div>
      </SectionCard>

      {state === "loading" ? (
        <SectionCard title="Loading">
          <div className="h-4 w-1/2 rounded bg-muted" />
        </SectionCard>
      ) : state === "error" ? (
        <SectionCard title="Error">
          <pre className="text-xs">{errorMessage}</pre>
        </SectionCard>
      ) : ideas.length === 0 ? (
        <EmptyState
          title="No ideas match these filters"
          description="Try clearing search, changing status/tag, or toggling Active/Archived."
        />
      ) : (
        <div className="space-y-4">
          {ideas.map((idea) => (
            <SectionCard key={idea.id} title={idea.title}>
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <BadgePill label={idea.status} />
                  <BadgePill label={idea.priority} />
                  {(idea as any).archivedAt ? <BadgePill label="Archived" /> : null}
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
                  <Button asChild size="sm" variant="outline">
                    <Link to={`/ideas/${idea.id}`}>Open</Link>
                  </Button>
                </div>
              </div>
            </SectionCard>
          ))}

          <div className="flex flex-col items-center gap-2 pt-2">
            <div className="text-xs text-muted-foreground">
              {hasMore ? `Showing ${ideas.length}+ (load more to continue)` : `Showing ${ideas.length} (end of list)`}
            </div>

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
