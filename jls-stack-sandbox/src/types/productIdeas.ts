// src/types/productIdeas.ts
import type { Timestamp } from "firebase/firestore";

export type ProductIdeaStatus = "draft" | "active" | "paused" | "shipped";

/**
 * Extension field: priority
 * Helps rank what to tackle first on the main dashboard.
 */
export type ProductIdeaPriority = "low" | "medium" | "high";

/**
 * Official, fixed tags (ENXUTO)
 */
export type ProductIdeaTag =
  | "copywriting"
  | "NPD"
  | "marketing"
  | "design"
  | "automation"
  | "tools"
  | "general";

export type ProductIdea = {
  id: string;
  title: string;
  summary: string;
  status: ProductIdeaStatus;

  // Extension field (new)
  priority: ProductIdeaPriority;

  tags: ProductIdeaTag[];
  ownerId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type ProductIdeaCreateInput = {
  title: string;
  summary: string;
  status: ProductIdeaStatus;

  // Extension field (new)
  priority: ProductIdeaPriority;

  tags: ProductIdeaTag[];
  ownerId: string;
};

export type ProductIdeaUpdateInput = Partial<
  Pick<ProductIdea, "title" | "summary" | "status" | "priority" | "tags">
>;

export type ProductIdeaNote = {
  id: string;
  ideaId: string;
  body: string;
  authorId: string;
  createdAt: Timestamp;
};

export type ProductIdeaNoteCreateInput = {
  body: string;
  authorId: string;
};
