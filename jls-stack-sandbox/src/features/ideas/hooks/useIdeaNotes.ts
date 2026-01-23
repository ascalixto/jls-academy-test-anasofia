import { useEffect, useState } from "react"
import { subscribeIdeaNotes } from "@/lib/firestore/productIdeas"
import type { ProductIdeaNote } from "@/types/productIdeas"

export function useIdeaNotes(ideaId: string | undefined) {
  const [notes, setNotes] = useState<ProductIdeaNote[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!ideaId) {
      setNotes([])
      setLoading(false)
      setError("Missing ideaId.")
      return
    }

    setLoading(true)
    setError(null)

    const unsub = subscribeIdeaNotes({
      ideaId,
      onData: (data) => {
        setNotes(data)
        setLoading(false)
      },
      onError: (err) => {
        console.error(err)
        setError("Failed to load notes (real-time).")
        setLoading(false)
      },
    })

    return () => {
      unsub()
    }
  }, [ideaId])

  return { notes, loading, error }
}
