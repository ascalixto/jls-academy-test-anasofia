import { useEffect, useMemo, useRef, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { onAuthStateChanged, type User } from "firebase/auth"
import { toast } from "sonner"

import { auth } from "@/lib/firebase"

import type {
  ProductIdea,
  ProductIdeaNote,
  ProductIdeaPriority,
  ProductIdeaStatus,
  ProductIdeaTag,
} from "../types/productIdeas"

import {
  subscribeIdeaById,
  subscribeIdeaNotes,
  updateProductIdea,
  archiveProductIdea,
  createProductIdeaNote,
} from "../lib/firestore/productIdeas"

import { PageHeader } from "../components/common/PageHeader"
import { SectionCard } from "../components/common/SectionCard"
import { BadgePill } from "../components/common/BadgePill"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Skeleton } from "../components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select"

// state components
import { EmptyState } from "../components/states/EmptyState"
import { ErrorState } from "../components/states/ErrorState"

const ALL_TAGS: ProductIdeaTag[] = [
  "copywriting",
  "NPD",
  "marketing",
  "design",
  "automation",
  "tools",
  "general",
]

type LoadState = "loading" | "success" | "error"

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

export default function IdeaDetailPage() {
  const { ideaId } = useParams()
  const navigate = useNavigate()

  // Live indicator for the main idea listener 
  const [liveStatus, setLiveStatus] = useState<"on" | "off">("off")

  const [state, setState] = useState<LoadState>("loading")
  const [errorMessage, setErrorMessage] = useState("")
  const [idea, setIdea] = useState<ProductIdea | null>(null)

  const [editMode, setEditMode] = useState(false)

  const [title, setTitle] = useState("")
  const [summary, setSummary] = useState("")
  const [status, setStatus] = useState<ProductIdeaStatus>("draft")
  const [priority, setPriority] = useState<ProductIdeaPriority>("medium")
  const [tags, setTags] = useState<ProductIdeaTag[]>(["general"])

  const [saving, setSaving] = useState(false)
  const [archiving, setArchiving] = useState(false)
  const [saveError, setSaveError] = useState("")
  const [saveSuccess, setSaveSuccess] = useState("")

  // Notes
  const [notes, setNotes] = useState<ProductIdeaNote[]>([])
  const [notesState, setNotesState] = useState<"loading" | "success" | "error">(
    "loading"
  )
  const [newNote, setNewNote] = useState("")
  const [addingNote, setAddingNote] = useState(false)
  const [noteError, setNoteError] = useState("")

  // next-action button can focus note input
  const noteBoxRef = useRef<HTMLTextAreaElement | null>(null)

  // Auth (for authorId on notes)
  const [authState, setAuthState] = useState<"loading" | "ready">("loading")
  const [user, setUser] = useState<User | null>(null)

  // debug counter
  const [activeListeners, setActiveListeners] = useState(0)

  const isArchived = useMemo(() => {
    return idea ? (idea as any).archivedAt != null : false
  }, [idea])

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setAuthState("ready")
    })
    return () => unsub()
  }, [])

  // Real-time idea doc
  useEffect(() => {
    if (!ideaId) {
      setState("error")
      setErrorMessage("Missing ideaId.")
      setLiveStatus("off")
      return
    }

    // Part C proof: attach log + counter
    console.log("[RT] idea listener attached", ideaId)
    setActiveListeners((n) => n + 1)

    setState("loading")
    setErrorMessage("")
    setLiveStatus("off")

    const unsub = subscribeIdeaById({
      ideaId,
      onData: (data) => {
        setIdea(data)
        setLiveStatus("on")
        setState("success")

        if (data) {
          setTitle(data.title ?? "")
          setSummary(data.summary ?? "")
          setStatus(data.status ?? "draft")
          setPriority(data.priority ?? "medium")
          setTags(
            (data.tags && data.tags.length ? data.tags : ["general"]) as ProductIdeaTag[]
          )
        }
      },
      onError: (err) => {
        console.error(err)
        setLiveStatus("off")
        setState("error")
        setErrorMessage("Error loading idea (real-time).")
        toast.error("Failed to load idea")
      },
    })

    return () => {
      // Part C proof: cleanup log + counter
      console.log("[RT] idea listener cleanup", ideaId)
      unsub()
      setLiveStatus("off")
      setActiveListeners((n) => Math.max(0, n - 1))
    }
  }, [ideaId])

  // Real-time notes list
  useEffect(() => {
    if (!ideaId) return

    // Part C proof: attach log + counter
    console.log("[RT] notes listener attached", ideaId)
    setActiveListeners((n) => n + 1)

    setNotesState("loading")
    setNoteError("")

    const unsub = subscribeIdeaNotes({
      ideaId,
      onData: (data) => {
        setNotes(data)
        setNotesState("success")
      },
      onError: (err) => {
        console.error(err)
        setNotesState("error")
        setNoteError("Failed to load notes (real-time).")
        toast.error("Failed to load notes")
      },
    })

    return () => {
      // Part C proof: cleanup log + counter
      console.log("[RT] notes listener cleanup", ideaId)
      unsub()
      setActiveListeners((n) => Math.max(0, n - 1))
    }
  }, [ideaId])

  function toggleTag(tag: ProductIdeaTag) {
    setTags((prev) => {
      const has = prev.includes(tag)
      const next = has ? prev.filter((t) => t !== tag) : [...prev, tag]
      return next.length ? next : ["general"]
    })
  }

  async function handleSave() {
    if (!ideaId) return

    setSaveError("")
    setSaveSuccess("")

    const cleanTitle = title.trim()
    const cleanSummary = summary.trim()

    if (!cleanTitle) {
      setSaveError("Title is required.")
      toast.error("Title is required")
      return
    }
    if (!cleanSummary) {
      setSaveError("Summary is required.")
      toast.error("Summary is required")
      return
    }

    try {
      setSaving(true)
      await updateProductIdea(ideaId, {
        title: cleanTitle,
        summary: cleanSummary,
        status,
        priority,
        tags,
      })
      setSaveSuccess("Saved.")
      toast.success("Changes saved")
      setEditMode(false)
    } catch (err) {
      console.error(err)
      setSaveError("Save failed. Check Firestore rules.")
      toast.error("Could not save changes")
    } finally {
      setSaving(false)
    }
  }

  async function handleArchive() {
    if (!ideaId) return

    const ok = window.confirm(
      "Archive this idea? You can restore it later from Archived Ideas."
    )
    if (!ok) return

    try {
      setArchiving(true)
      await archiveProductIdea(ideaId)
      toast.message("Idea archived")
      navigate("/ideas")
    } catch (err) {
      console.error(err)
      setSaveError("Archive failed. Check Firestore rules.")
      toast.error("Archive failed")
    } finally {
      setArchiving(false)
    }
  }

  async function handleAddNote() {
    if (!ideaId) return
    if (isArchived) return

    const body = newNote.trim()
    if (!body) return

    setNoteError("")

    if (authState !== "ready") {
      setNoteError("Signing in… try again in a moment.")
      toast.error("Auth not ready yet")
      return
    }

    if (!user) {
      setNoteError("You must be signed in to add a note.")
      toast.error("You must be signed in")
      return
    }

    try {
      setAddingNote(true)
      await createProductIdeaNote(ideaId, {
        body,
        authorId: user.uid,
      })
      toast.success("Note added")
      // IMPORTANT: no manual refetch here. Listener will update notes list.
      setNewNote("")
    } catch (err) {
      console.error(err)
      setNoteError("Could not add note. Check permissions or rules.")
      toast.error("Could not add note")
    } finally {
      setAddingNote(false)
    }
  }

  // ✅ UI State Contract: Loading → Error → Empty → Success
  if (state === "loading") {
    return (
      <div className="space-y-6">
        <PageHeader title="Idea Detail" subtitle="Loading…" liveStatus={liveStatus} />
        <SectionCard title="Loading">
          <div className="space-y-3">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        </SectionCard>
      </div>
    )
  }

  if (state === "error") {
    return (
      <div className="space-y-6">
        <PageHeader title="Idea Detail" subtitle="Error" liveStatus={liveStatus} />

        <ErrorState
          message={errorMessage || "Error loading idea."}
          onRetry={() => window.location.reload()}
        />

        <Button asChild variant="outline" size="sm">
          <Link to="/ideas">Back to Ideas</Link>
        </Button>
      </div>
    )
  }

  if (!idea) {
    return (
      <div className="space-y-6">
        <PageHeader title="Idea Detail" subtitle="Not found" liveStatus={liveStatus} />
        <EmptyState
          title="Idea not found"
          description="Check the URL or create a new idea."
          actionLabel="Create idea"
          onAction={() => {
            window.location.href = "/ideas/new"
          }}
          secondaryActionLabel="Back to Ideas"
          onSecondaryAction={() => {
            window.location.href = "/ideas"
          }}
        />
        <Button asChild variant="outline" size="sm">
          <Link to="/ideas">Back to Ideas</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Idea Detail"
        subtitle={editMode ? "Edit mode" : "View mode"}
        liveStatus={liveStatus}
        actions={
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link to="/ideas">Back</Link>
            </Button>

            <span className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
              Active listeners: {activeListeners}
            </span>
          </div>
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setEditMode((v) => !v)}
          disabled={saving || archiving}
        >
          {editMode ? "Cancel" : "Edit"}
        </Button>

        <Button
          size="sm"
          onClick={handleSave}
          disabled={!editMode || saving || archiving || isArchived}
        >
          {saving ? "Saving…" : "Save"}
        </Button>

        <Button
          size="sm"
          variant="destructive"
          onClick={handleArchive}
          disabled={archiving || saving || isArchived}
        >
          {archiving ? "Archiving…" : "Archive"}
        </Button>

        {isArchived && <BadgePill label="Archived" />}
      </div>

      <SectionCard title="Current">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <BadgePill label={idea.status} />
            <BadgePill label={idea.priority} />
            {isArchived ? (
              <span className="text-xs text-muted-foreground">
                Archived: {formatDate((idea as any).archivedAt)}
              </span>
            ) : null}
          </div>

          <div className="text-xs text-muted-foreground">
            Updated: {formatDate((idea as any).updatedAt)}
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Fields">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="text-sm font-medium">Title</div>
            {editMode ? (
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            ) : (
              <div className="text-sm text-muted-foreground">{idea.title}</div>
            )}
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium">Summary</div>
            {editMode ? (
              <Input value={summary} onChange={(e) => setSummary(e.target.value)} />
            ) : (
              <div className="text-sm text-muted-foreground">
                {idea.summary || "—"}
              </div>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="text-sm font-medium">Status</div>
              {editMode ? (
                <Select
                  value={status}
                  onValueChange={(v) => setStatus(v as ProductIdeaStatus)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">draft</SelectItem>
                    <SelectItem value="active">active</SelectItem>
                    <SelectItem value="paused">paused</SelectItem>
                    <SelectItem value="shipped">shipped</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="text-sm text-muted-foreground">{idea.status}</div>
              )}
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Priority</div>
              {editMode ? (
                <Select
                  value={priority}
                  onValueChange={(v) => setPriority(v as ProductIdeaPriority)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">low</SelectItem>
                    <SelectItem value="medium">medium</SelectItem>
                    <SelectItem value="high">high</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="text-sm text-muted-foreground">{idea.priority}</div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium">Tags</div>
            {editMode ? (
              <div className="flex flex-wrap gap-2">
                {ALL_TAGS.map((t) => {
                  const selected = tags.includes(t)
                  return (
                    <Button
                      key={t}
                      type="button"
                      size="sm"
                      variant={selected ? "default" : "outline"}
                      onClick={() => toggleTag(t)}
                    >
                      {t}
                    </Button>
                  )
                })}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {(idea.tags ?? []).map((t) => (
                  <BadgePill key={t} label={t} />
                ))}
              </div>
            )}
          </div>

          {saveError ? <div className="text-sm text-destructive">{saveError}</div> : null}
          {saveSuccess ? <div className="text-sm">{saveSuccess}</div> : null}
        </div>
      </SectionCard>

      <SectionCard title="Notes">
        <div className="space-y-3">
          {notesState === "loading" ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ) : null}

          {notesState === "error" ? (
            <p className="text-sm text-destructive">
              {noteError || "Failed to load notes."}
            </p>
          ) : null}

          {/* empty notes state must explain + next action */}
          {notesState === "success" && notes.length === 0 ? (
            <EmptyState
              title="No notes yet"
              description="This idea doesn’t have any notes yet. Add the first one to track progress or decisions."
              actionLabel="Write first note"
              onAction={() => {
                noteBoxRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
                noteBoxRef.current?.focus()
              }}
            />
          ) : null}

          {notesState === "success" && notes.length > 0 ? (
            <div className="space-y-2">
              {notes.map((n) => (
                <div key={n.id} className="rounded-md border p-2 text-sm">
                  {n.body}
                </div>
              ))}
            </div>
          ) : null}

          <div className="pt-2 space-y-2">
            <div className="text-sm font-medium">Add note</div>

            <textarea
              ref={noteBoxRef}
              className="flex min-h-[96px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder={
                isArchived
                  ? "Archived ideas can’t receive new notes."
                  : authState !== "ready"
                    ? "Signing in…"
                    : !user
                      ? "Sign in required"
                      : "Write a quick note…"
              }
              disabled={isArchived || authState !== "ready" || !user || addingNote}
            />

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={handleAddNote}
                disabled={
                  addingNote ||
                  isArchived ||
                  authState !== "ready" ||
                  !user ||
                  newNote.trim().length === 0
                }
              >
                {addingNote ? "Adding…" : "Add Note"}
              </Button>

              {isArchived ? (
                <span className="text-xs text-muted-foreground">
                  This idea is archived.
                </span>
              ) : null}
            </div>

            {noteError ? <p className="text-xs text-destructive">{noteError}</p> : null}
          </div>
        </div>
      </SectionCard>
    </div>
  )
}
