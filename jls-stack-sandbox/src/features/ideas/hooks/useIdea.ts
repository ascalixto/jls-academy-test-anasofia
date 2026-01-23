import { useEffect, useState } from "react"
import { subscribeIdeaById } from "@/lib/firestore/productIdeas"
import type { ProductIdea } from "@/types/productIdeas"

export function useIdea(ideaId: string | undefined) {
  const [idea, setIdea] = useState<ProductIdea | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!ideaId) {
      setIdea(null)
      setLoading(false)
      setError("Missing ideaId.")
      return
    }

    setLoading(true)
    setError(null)

    const unsub = subscribeIdeaById({
      ideaId,
      onData: (data) => {
        setIdea(data)
        setLoading(false)
      },
      onError: (err) => {
        console.error(err)
        setError("Error loading idea (real-time).")
        setLoading(false)
      },
    })

    return () => {
      unsub()
    }
  }, [ideaId])

  return { idea, loading, error }
}
