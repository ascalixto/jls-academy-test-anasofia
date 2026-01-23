import { useCallback, useEffect, useState } from "react"
import type { IdeasFilterState } from "./useIdeasFilters"
import type { ProductIdea } from "@/lib/firestore/productIdeas"
import { fetchIdeasPage } from "@/lib/firestore/productIdeasPaging"

type Result = {
  items: ProductIdea[]
  nextCursor: any | null
}

export function useIdeasList(filters: IdeasFilterState, pageSize = 10) {
  const [items, setItems] = useState<ProductIdea[]>([])
  const [cursor, setCursor] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadFirstPage = useCallback(async () => {
    setLoading(true)
    setError(null)
    setCursor(null)

    try {
      const res: Result = await fetchIdeasPage({
        filters,
        pageSize,
        cursor: null,
      })
      setItems(res.items)
      setCursor(res.nextCursor)
    } catch (e) {
      console.error(e)
      setError("Failed to load ideas.")
      setItems([])
      setCursor(null)
    } finally {
      setLoading(false)
    }
  }, [filters, pageSize])

  const loadMore = useCallback(async () => {
    if (!cursor) return
    setLoadingMore(true)
    setError(null)

    try {
      const res: Result = await fetchIdeasPage({
        filters,
        pageSize,
        cursor,
      })
      setItems((prev) => [...prev, ...res.items])
      setCursor(res.nextCursor)
    } catch (e) {
      console.error(e)
      setError("Failed to load more ideas.")
    } finally {
      setLoadingMore(false)
    }
  }, [cursor, filters, pageSize])

  // When filters change, reset back to page 1.
  useEffect(() => {
    loadFirstPage()
  }, [loadFirstPage])

  return {
    items,
    cursor,
    loading,
    loadingMore,
    error,
    reload: loadFirstPage,
    loadMore,
    hasMore: Boolean(cursor),
  }
}
