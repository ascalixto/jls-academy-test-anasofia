import { useEffect, useState } from "react"
import type { ProductIdea, ProductIdeaNote } from "../../types/productIdeas"
import {
  getProductIdeaNotes,
  createProductIdeaNote,
} from "../../lib/firestore/productIdeas"

import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { BadgePill } from "../common/BadgePill"
import { SectionCard } from "../common/SectionCard"

type Props = {
  idea: ProductIdea
  onClose: () => void
}

export function IdeaDetailModal({ idea, onClose }: Props) {
  const [notes, setNotes] = useState<ProductIdeaNote[]>([])
  const [newNote, setNewNote] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    async function loadNotes() {
      try {
        const data = await getProductIdeaNotes(idea.id)
        setNotes(data)
      } catch (err) {
        setError("Failed to load notes.")
      }
    }

    loadNotes()
  }, [idea.id])

  async function handleAddNote() {
    if (!newNote.trim()) return

    try {
      setLoading(true)
      setError("")

      await createProductIdeaNote(idea.id, {
        body: newNote.trim(),
      })

      const updated = await getProductIdeaNotes(idea.id)
      setNotes(updated)
      setNewNote("")
    } catch (err) {
      setError("Could not add note. Check permissions or rules.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-2xl rounded-lg bg-background p-6 shadow-lg">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-lg font-semibold">{idea.title}</h2>
          <Button size="sm" variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>

        <div className="mt-4 space-y-4">
          <SectionCard title="Status">
            <BadgePill label={idea.status} />
          </SectionCard>

          <SectionCard title="Summary">
            <p className="text-sm text-muted-foreground">
              {idea.summary || "No summary provided."}
            </p>
          </SectionCard>

          <SectionCard title="Tags">
            <div className="flex flex-wrap gap-2">
              {idea.tags && idea.tags.length > 0 ? (
                idea.tags.map((t) => <BadgePill key={t} label={t} />)
              ) : (
                <span className="text-sm text-muted-foreground">
                  No tags
                </span>
              )}
            </div>
          </SectionCard>

          <SectionCard title="Notes">
            <div className="space-y-3">
              {notes.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No notes yet.
                </p>
              ) : (
                notes.map((n) => (
                  <div
                    key={n.id}
                    className="rounded-md border p-2 text-sm"
                  >
                    {n.body}
                  </div>
                ))
              )}
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex gap-2">
                <Input
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a note..."
                />
                <Button
                  size="sm"
                  onClick={handleAddNote}
                  disabled={loading}
                >
                  Add
                </Button>
              </div>

              {error && (
                <p className="text-xs text-destructive">{error}</p>
              )}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  )
}
