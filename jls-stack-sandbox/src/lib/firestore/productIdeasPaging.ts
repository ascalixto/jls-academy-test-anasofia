import { fetchIdeasPage as fetchIdeasPageCore } from "./productIdeas"
import type { IdeasFilterState } from "@/features/ideas/hooks/useIdeasFilters"
import type { IdeaListFilters } from "./productIdeas"

export async function fetchIdeasPage(input: {
  filters: IdeasFilterState
  pageSize: number
  cursor: any | null
}) {
  const filtersForCore: IdeaListFilters = {
    q: input.filters.q,
    status: input.filters.status as any,
    tag: input.filters.tag === "all" ? "" : (input.filters.tag as any),
    archived: input.filters.archived,
  }

  return fetchIdeasPageCore({
    filters: filtersForCore,
    pageSize: input.pageSize,
    cursor: input.cursor,
  })
}
