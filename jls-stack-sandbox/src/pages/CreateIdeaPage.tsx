import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { onAuthStateChanged, type User } from "firebase/auth"

import { auth } from "@/lib/firebase"
import { createProductIdea } from "../lib/firestore/productIdeas"

import type {
  ProductIdeaPriority,
  ProductIdeaStatus,
  ProductIdeaTag,
} from "../types/productIdeas"

import { PageHeader } from "../components/common/PageHeader"
import { SectionCard } from "../components/common/SectionCard"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select"

const ALL_TAGS: ProductIdeaTag[] = [
  "copywriting",
  "NPD",
  "marketing",
  "design",
  "automation",
  "tools",
  "general",
]

export default function CreateIdeaPage() {
  const navigate = useNavigate()

  const [authState, setAuthState] = useState<"loading" | "ready">("loading")
  const [user, setUser] = useState<User | null>(null)

  const [title, setTitle] = useState("")
  const [summary, setSummary] = useState("")
  const [status, setStatus] = useState<ProductIdeaStatus>("draft")
  const [priority, setPriority] = useState<ProductIdeaPriority>("medium")
  const [tags, setTags] = useState<ProductIdeaTag[]>(["general"])

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setAuthState("ready")
    })
    return () => unsub()
  }, [])

  const canSubmit = useMemo(() => {
    return (
      authState === "ready" &&
      !!user &&
      title.trim().length > 0 &&
      summary.trim().length > 0 &&
      !submitting
    )
  }, [authState, user, title, summary, submitting])

  function toggleTag(tag: ProductIdeaTag) {
    setTags((prev) => {
      const has = prev.includes(tag)
      const next = has ? prev.filter((t) => t !== tag) : [...prev, tag]
      return next.length ? next : ["general"]
    })
  }

  async function handleSubmit() {
    setError("")
    setSuccess("")

    if (authState !== "ready") {
      setError("Signing in… try again in a moment.")
      return
    }

    if (!user) {
      setError("You must be signed in to create an idea.")
      return
    }

    const cleanTitle = title.trim()
    const cleanSummary = summary.trim()

    if (!cleanTitle) {
      setError("Title is required.")
      return
    }
    if (!cleanSummary) {
      setError("Summary is required.")
      return
    }

    const safeTags = tags.length ? tags : (["general"] as ProductIdeaTag[])

    try {
      setSubmitting(true)

      const newId = await createProductIdea({
        title: cleanTitle,
        summary: cleanSummary,
        status,
        priority,
        tags: safeTags,
        ownerId: user.uid,
      })

      setSuccess("Created! Redirecting…")
      navigate(`/ideas/${newId}`)
    } catch (err) {
      console.error(err)
      setError("Create failed. Check Firestore rules or emulator.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Idea"
        subtitle="Create a new idea and start tracking it."
      />

      <div className="flex items-center gap-2">
        <Button asChild variant="outline" size="sm">
          <Link to="/ideas">Back to Ideas</Link>
        </Button>
      </div>

      <SectionCard title="New Idea">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="text-sm font-medium">Title</div>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Short, clear title"
              disabled={submitting}
            />
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium">Summary</div>
            <Input
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="What is it? Why does it matter?"
              disabled={submitting}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="text-sm font-medium">Status</div>
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
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Priority</div>
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
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium">Tags</div>
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
                    disabled={submitting}
                  >
                    {t}
                  </Button>
                )
              })}
            </div>
            <div className="text-xs text-muted-foreground">
              Selected: {(tags.length ? tags : ["general"]).join(", ")}
            </div>
          </div>

          {authState === "loading" && (
            <div className="text-sm text-muted-foreground">
              Signing in to Auth Emulator…
            </div>
          )}

          {error && <div className="text-sm text-destructive">{error}</div>}
          {success && <div className="text-sm">{success}</div>}

          <div className="pt-2">
            <Button onClick={handleSubmit} disabled={!canSubmit}>
              {submitting ? "Creating…" : "Create Idea"}
            </Button>
          </div>
        </div>
      </SectionCard>
    </div>
  )
}
