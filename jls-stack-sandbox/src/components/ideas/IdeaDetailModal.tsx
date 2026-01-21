import { useEffect, useMemo, useState } from "react"
import type { ProductIdea, ProductIdeaNote } from "../../types/productIdeas"
import {
  getProductIdeaNotes,
  createProductIdeaNote,
  archiveProductIdea,
} from "../../lib/firestore/productIdeas"

import { auth } from "@/lib/firebase"

import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { BadgePill } from "../common/BadgePill"
import { SectionCard } from "../common/SectionCard"

type Props = {
  idea: ProductIdea
  onClose: () => void
}

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

export function IdeaDetailModal({ idea, onClose }: Props) {
  const [notes, setNotes] = useState<ProductIdeaNote[]>([])
  const [notesState, setNotesState] = useState<"idle" | "loading" | "success" | "error">("idle")

  const [newNote, setNewNote] = useState("")
  const [addingNote, setAddingNote] = useState(false)
  const [archiving, setArchiving] = useState(false)
  const [error, setError] = useState<string>("")

  const isArchived = useMemo(() => {
    return (idea as any).archivedAt != null
  }, [idea])

  useEffect(() => {
    async function loadNotes() {
      try {
        setNotesState("loading")
        setError("")
        const data = await getProductIdeaNotes(idea.id)
        setNotes(data)
        setNotesState("success")
      } catch (err) {
        console.error(err)
        setError("Failed to load notes.")
        setNotesState("error")
      }
    }

    loadNotes()
  }, [idea.id])

  async function handleAddNote() {
    if (!newNote.trim()) return

    const uid = auth.currentUser?.uid
    if (!uid) {
      setError("You must be signed in to add a note.")
      return
    }

    try {
      setAddingNote(true)
      setError("")

      await createProductIdeaNote(idea.id, {
        body: newNote.trim(),
        authorId: uid,
      })

      const updated = await getProductIdeaNotes(idea.id)
      setNotes(updated)
      setNewNote("")
    } catch (err) {
      console.error(err)
      setError("Could not add note. Check permissions or rules.")
    } finally {
      setAddingNote(false)
    }
  }

  async function handleArchive() {
    try {
      setArchiving(true)
      setError("")
      await archiveProductIdea(idea.id)
      onClose()
    } catch (err) {
      console.error(err)
      setError("Could not archive. Check permissions or rules.")
    } finally {
      setArchiving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-2xl rounded-lg bg-background p-6 shadow-lg">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">{idea.title}</h2>

            {isArchived && (
              <div className="flex flex-wrap items-center gap-2">
                <BadgePill label="Archived" />
                <span className="text-xs text-muted-foreground">
                  Archived: {formatDate((idea as any).archivedAt)}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!isArchived && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleArchive}
                disabled={archiving}
              >
                {archiving ? "Archiving…" : "Archive"}
              </Button>
            )}

            <Button size="sm" variant="ghost" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>

        <div className="mt-4 space-y-4">
          <SectionCard title="Status">
            <div className="flex flex-wrap items-center gap-2">
              <BadgePill label={idea.status} />
              <BadgePill label={idea.priority} />
              {isArchived && <BadgePill label="Archived" />}
            </div>
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
                <span className="text-sm text-muted-foreground">No tags</span>
              )}
            </div>
          </SectionCard>

          <SectionCard title="Notes">
            <div className="space-y-3">
              {notesState === "loading" && (
                <div className="space-y-2">
                  <div className="h-4 w-2/3 rounded bg-muted" />
                  <div className="h-4 w-1/2 rounded bg-muted" />
                </div>
              )}

              {notesState === "error" && (
                <p className="text-sm text-destructive">
                  Failed to load notes. Try closing and reopening.
                </p>
              )}

              {notesState === "success" && notes.length === 0 && (
                <p className="text-sm text-muted-foreground">No notes yet.</p>
              )}

              {notesState === "success" &&
                notes.length > 0 &&
                notes.map((n) => (
                  <div key={n.id} className="rounded-md border p-2 text-sm">
                    {n.body}
                  </div>
                ))}
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex gap-2">
                <Input
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a note..."
                  disabled={isArchived}
                />
                <Button
                  size="sm"
                  onClick={handleAddNote}
                  disabled={addingNote || isArchived}
                >
                  {addingNote ? "Adding…" : "Add"}
                </Button>
              </div>

              {isArchived && (
                <p className="text-xs text-muted-foreground">
                  Notes are disabled while an idea is archived.
                </p>
              )}

              {error && <p className="text-xs text-destructive">{error}</p>}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  )
}
