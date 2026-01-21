// src/pages/ArchivedIdeasPage.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import type { ProductIdea } from "../types/productIdeas";
import {
  getArchivedProductIdeas,
  restoreProductIdea,
} from "../lib/firestore/productIdeas";

import { PageHeader } from "../components/common/PageHeader";
import { SectionCard } from "../components/common/SectionCard";
import { EmptyState } from "../components/common/EmptyState";
import { BadgePill } from "../components/common/BadgePill";
import { Button } from "../components/ui/button";

type LoadState = "idle" | "loading" | "success" | "error";

function formatDate(value: unknown) {
  const maybeTs = value as { toDate?: () => Date } | null;
  if (maybeTs?.toDate) {
    return maybeTs.toDate().toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  return "—";
}

export default function ArchivedIdeasPage() {
  const [state, setState] = useState<LoadState>("idle");
  const [ideas, setIdeas] = useState<ProductIdea[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [restoringId, setRestoringId] = useState<string | null>(null);

  async function loadArchivedIdeas() {
    try {
      setState("loading");
      setErrorMessage("");
      const data = await getArchivedProductIdeas();
      setIdeas(data);
      setState("success");
    } catch (err) {
      console.error(err);
      setErrorMessage("Error fetching archived ideas.");
      setState("error");
    }
  }

  async function handleRestore(ideaId: string) {
    try {
      setRestoringId(ideaId);
      await restoreProductIdea(ideaId);
      await loadArchivedIdeas();
    } catch (err) {
      console.error(err);
      alert("Restore failed. Check console for details.");
    } finally {
      setRestoringId(null);
    }
  }

  useEffect(() => {
    loadArchivedIdeas();
  }, []);

  if (state === "loading") {
    return (
      <div className="space-y-6">
        <PageHeader title="Archived Ideas" subtitle="Loading archived ideas…" />
        <SectionCard title="Loading">
          <div className="h-4 w-1/2 rounded bg-muted" />
        </SectionCard>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Archived Ideas"
          subtitle="Error loading archived ideas"
        />
        <SectionCard title="Error">
          <pre className="text-xs">{errorMessage}</pre>
        </SectionCard>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Archived Ideas"
        subtitle="These items are archived. You can restore them anytime."
      />

      <div className="flex items-center gap-2">
        <Button asChild variant="outline" size="sm">
          <Link to="/ideas">Back to Ideas</Link>
        </Button>
      </div>

      {ideas.length === 0 ? (
        <EmptyState
          title="No archived ideas"
          description="Archive an idea to see it here."
        />
      ) : (
        <div className="space-y-4">
          {ideas.map((idea) => (
            <SectionCard key={idea.id} title={idea.title}>
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <BadgePill label={idea.status} />
                  <BadgePill label={idea.priority} />
                  <BadgePill label="Archived" />
                </div>

                <div className="flex flex-wrap gap-2">
                  {idea.tags?.map((t) => (
                    <BadgePill key={t} label={t} />
                  ))}
                </div>

                <div className="text-xs text-muted-foreground">
                  Archived: {formatDate((idea as any).archivedAt)}
                </div>

                <div className="pt-2">
                  <Button
                    size="sm"
                    onClick={() => handleRestore(idea.id)}
                    disabled={restoringId === idea.id}
                  >
                    {restoringId === idea.id ? "Restoring…" : "Restore"}
                  </Button>
                </div>
              </div>
            </SectionCard>
          ))}
        </div>
      )}
    </div>
  );
}
