import { useMemo } from "react"
import { useSearchParams } from "react-router-dom"

export type IdeasFilterState = {
  q: string
  status: string
  tag: string
  archived: boolean
}

const DEFAULTS: IdeasFilterState = {
  q: "",
  status: "all",
  tag: "all",
  archived: false,
}

function readBool(value: string | null, fallback: boolean) {
  if (value === null) return fallback
  return value === "true"
}

export function useIdeasFilters() {
  const [params, setParams] = useSearchParams()

  const state: IdeasFilterState = useMemo(() => {
    return {
      q: params.get("q") ?? DEFAULTS.q,
      status: params.get("status") ?? DEFAULTS.status,
      tag: params.get("tag") ?? DEFAULTS.tag,
      archived: readBool(params.get("archived"), DEFAULTS.archived),
    }
  }, [params])

  function setFilter(patch: Partial<IdeasFilterState>) {
    const next = { ...state, ...patch }

    // keep URLs tidy: only store non-default values where possible
    const nextParams = new URLSearchParams()

    if (next.q) nextParams.set("q", next.q)
    if (next.status !== "all") nextParams.set("status", next.status)
    if (next.tag !== "all") nextParams.set("tag", next.tag)
    if (next.archived !== false) nextParams.set("archived", String(next.archived))

    setParams(nextParams, { replace: true })
  }

  function resetFilters() {
    setParams(new URLSearchParams(), { replace: true })
  }

  return { filters: state, setFilter, resetFilters }
}
