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


export default function IdeasPage() {
  const { filters, setFilter, resetFilters } = useIdeasFilters()
  const { items, loading, error, reload, loadMore, hasMore, loadingMore } = useIdeasList(
    filters,
    PAGE_SIZE
  )

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

  // pass a derived filters object to the dumb UI component,
  // so the input reflects qInput (debounced) but everything else stays live.
  const uiFilters = useMemo(() => {
    return { ...filters, q: qInput }
  }, [filters, qInput])

  // Wrapper so IdeasFiltersBar can stay dumb:
  // - q updates go to local qInput (debounced)
  // - everything else updates URL immediately through setFilter
  function handleFiltersChange(patch: Partial<typeof filters>) {
    if (typeof patch.q === "string") {
      setQInput(patch.q)
      return
    }
    setFilter(patch as any)
  }

  // Match previous fresh account vs mismatch logic.
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
          <Link to="/ideas/new">New Idea</Link>
        </Button>

        <Button asChild variant="outline" size="sm">
          <Link to="/ideas/archived">Archived Ideas</Link>
        </Button>
      </div>

      <SectionCard title="Filters + Search">
        <IdeasFiltersBar
          filters={uiFilters}
          onChange={handleFiltersChange as any}
          onReset={() => {
            resetFilters()
            setQInput("")
          }}
        />
      </SectionCard>

      {/* UI state contract */}
      {loading ? <IdeasListSkeleton /> : null}

      {!loading && error ? <ErrorState message={error} onRetry={reload} /> : null}

      {!loading && !error && items.length === 0 ? (
        hasAnyFilterActive ? (
          <EmptyState
            title="No ideas match this view"
            description="Your filters or search didn’t return any results."
            actionLabel="Clear filters"
            onAction={() => {
              resetFilters()
              setQInput("")
            }}
            secondaryActionLabel="Create idea"
            onSecondaryAction={() => {
              window.location.href = "/ideas/new"
            }}
          />
        ) : (
          <EmptyState
            title="No ideas exist yet"
            description="Get started by creating your first product idea."
            actionLabel="Create idea"
            onAction={() => {
              window.location.href = "/ideas/new"
            }}
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
