// src/pages/IdeasPage.tsx
import { useEffect, useState } from "react"
import { getAllProductIdeas } from "../lib/firestore/productIdeas"
import type { ProductIdea } from "../types/productIdeas"

import { PageHeader } from "../components/common/PageHeader"
import { SectionCard } from "../components/common/SectionCard"
import { EmptyState } from "../components/common/EmptyState"
import { BadgePill } from "../components/common/BadgePill"

type LoadState = "idle" | "loading" | "success" | "error"

export default function IdeasPage() {
  const [state, setState] = useState<LoadState>("idle")
  const [ideas, setIdeas] = useState<ProductIdea[]>([])
  const [errorMessage, setErrorMessage] = useState<string>("")

  useEffect(() => {
    async function loadIdeas() {
      console.log("[IdeasPage] start fetch")

      try {
        setState("loading")
        setErrorMessage("")

        const timeoutMs = 8000

        const data = await Promise.race([
          getAllProductIdeas(),
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

        setErrorMessage(message)
        setState("error")
      }
    }

    loadIdeas()
  }, [])

  if (state === "loading") {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Ideas"
          subtitle="This page proves the data layer works (no direct Firestore queries in the UI)."
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
          subtitle="This page proves the data layer works (no direct Firestore queries in the UI)."
        />

        <SectionCard title="Error">
          <div className="space-y-2">
            <p className="text-sm font-medium">Couldn’t load ideas</p>
            <p className="text-sm text-muted-foreground">
              There was an error fetching data. Please refresh and try again.
            </p>

            {errorMessage ? (
              <pre className="whitespace-pre-wrap rounded-md bg-muted p-3 text-xs">
                {errorMessage}
              </pre>
            ) : null}
          </div>
        </SectionCard>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ideas"
        subtitle="This page proves the data layer works (no direct Firestore queries in the UI)."
      />

      {ideas.length === 0 ? (
        <EmptyState
          title="No ideas found"
          description="Your database has no product ideas yet. Add a few documents and they will show up here."
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
                    idea.tags.map((tag) => (
                      <BadgePill key={`${idea.id}-${tag}`} label={tag} />
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
