import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"

import { PageHeader } from "../components/common/PageHeader"
import { SectionCard } from "../components/common/SectionCard"
import { BadgePill } from "../components/common/BadgePill"
import { Button } from "../components/ui/button"

import { IdeasListSkeleton } from "../components/states/IdeasListSkeleton"
import { ErrorState } from "../components/states/ErrorState"
import { EmptyState } from "../components/states/EmptyState"

import { useIdeasFilters } from "../features/ideas/hooks/useIdeasFilters"
import { useIdeasList } from "../features/ideas/hooks/useIdeasList"
import { IdeasFiltersBar } from "../features/ideas/components/IdeasFiltersBar"

const PAGE_SIZE = 10
const NEW_IDEA_PATH = "/ideas/new"

export default function IdeasPage() {
  const { filters, setFilter, resetFilters } = useIdeasFilters()
  const { items, loading, error, reload, loadMore, hasMore, loadingMore } = useIdeasList(
    filters,
    PAGE_SIZE
  )

  function goToNewIdea() {
    window.location.href = NEW_IDEA_PATH
  }

  function clearFilters() {
    resetFilters()
    setQInput("")
  }

  // keep original behavior: search typing is debounced before updating URL/filter state
  const [qInput, setQInput] = useState(filters.q ?? "")

  useEffect(() => {
    setQInput(filters.q ?? "")
  }, [filters.q])

  useEffect(() => {
    const t = setTimeout(() => {
      const trimmed = qInput.trim()
      setFilter({ q: trimmed })
    }, 300)

    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qInput])

  const uiFilters = useMemo(() => {
    return { ...filters, q: qInput }
  }, [filters, qInput])

  function handleFiltersChange(patch: Partial<typeof filters>) {
    if (typeof patch.q === "string") {
      setQInput(patch.q)
      return
    }
    setFilter(patch as any)
  }

  const hasAnyFilterActive = useMemo(() => {
    return (
      !!filters.q ||
      (filters.status && filters.status !== "all") ||
      (filters.tag && filters.tag !== "all") ||
      filters.archived === true
    )
  }, [filters])

  return (
    <div className="space-y-6">
      <PageHeader title="Ideas" subtitle="Filter, search, and paginate." />

      <div className="flex flex-wrap items-center gap-2">
        <Button asChild size="sm">
          <Link to={NEW_IDEA_PATH}>New Idea</Link>
        </Button>

        <Button asChild variant="outline" size="sm">
          <Link to="/ideas/archived">Archived Ideas</Link>
        </Button>
      </div>

      <SectionCard title="Filters + Search">
        <IdeasFiltersBar
          filters={uiFilters}
          onChange={handleFiltersChange as any}
          onReset={clearFilters}
        />
      </SectionCard>

      {loading ? <IdeasListSkeleton /> : null}

      {!loading && error ? <ErrorState message={error} onRetry={reload} /> : null}

      {!loading && !error && items.length === 0 ? (
        hasAnyFilterActive ? (
          <EmptyState
            title="No ideas found"
            description="Nothing matches your current filters. Try clearing them or create a new idea."
            actionLabel="Clear filters"
            onAction={clearFilters}
            secondaryActionLabel="Create new idea"
            onSecondaryAction={goToNewIdea}
          />
        ) : (
          <EmptyState
            title="No ideas yet"
            description="Create your first idea to start tracking it here."
            actionLabel="Create your first idea"
            onAction={goToNewIdea}
          />
        )
      ) : null}

      {!loading && !error && items.length > 0 ? (
        <div className="space-y-4">
          {items.map((idea: any) => (
            <SectionCard key={idea.id} title={idea.title}>
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <BadgePill label={idea.status} />
                  <BadgePill label={idea.priority} />
                  {(idea as any).archivedAt ? <BadgePill label="Archived" /> : null}
                </div>

                <div className="flex flex-wrap gap-2">
                  {idea.tags?.map((t: string) => (
                    <BadgePill key={t} label={t} />
                  ))}
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
              {hasMore
                ? `Showing ${items.length}+ (load more to continue)`
                : `Showing ${items.length} (end of list)`}
            </div>

            <Button
              variant="outline"
              onClick={loadMore}
              disabled={!hasMore || loadingMore}
            >
              {loadingMore ? "Loading..." : hasMore ? "Load more" : "No more results"}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
