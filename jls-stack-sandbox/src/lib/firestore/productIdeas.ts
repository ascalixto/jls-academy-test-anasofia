import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  limit,
  startAfter,
  startAt,
  endAt,
  Timestamp,
  type DocumentSnapshot,
  type Unsubscribe,
  type DocumentData,
  type QueryDocumentSnapshot,
} from "firebase/firestore";

import type {
  ProductIdea,
  ProductIdeaNote,
  ProductIdeaStatus,
  ProductIdeaPriority,
  ProductIdeaTag,
} from "@/types/productIdeas";

/* ---------------------------------------
   Lesson 4.3 helpers (search + tag cleanup)
---------------------------------------- */

function normalizeTitleLower(title: string) {
  return title.trim().toLowerCase();
}

/**
 * Tags normalization for YOUR project:
 * - trims
 * - removes empty
 * - de-dupes while preserving order
 *
 * NOTE: we do NOT lowercase because ProductIdeaTag includes "NPD" (uppercase).
 */
function normalizeTags(tags: ProductIdeaTag[]) {
  const cleaned = (tags ?? [])
    .map((t) => String(t).trim())
    .filter(Boolean) as ProductIdeaTag[];

  return Array.from(new Set(cleaned)) as ProductIdeaTag[];
}

/* ---------------------------------------
   Collection + doc reference helpers
---------------------------------------- */

export function productIdeasCol() {
  return collection(db, "productIdeas");
}

export function productIdeaDoc(ideaId: string) {
  return doc(db, "productIdeas", ideaId);
}

export function productIdeaNotesCol(ideaId: string) {
  return collection(db, "productIdeas", ideaId, "notes");
}

export function productIdeaNoteDoc(ideaId: string, noteId: string) {
  return doc(db, "productIdeas", ideaId, "notes", noteId);
}

function isNotArchived(idea: ProductIdea) {
  const archivedAt = (idea as any).archivedAt;
  return archivedAt == null;
}

/**
 * Normalizer for list/query results used by Lesson 4.3 pagination/search.
 * Keeps compatibility with your current ProductIdea type (even if titleLower is not typed yet).
 */
function normalizeIdeaFromSnap(id: string, data: any): ProductIdea {
  const title = (data?.title ?? "") as string;

  const normalized = {
    id,
    ...(data as Omit<ProductIdea, "id">),
  } as ProductIdea;

  // ensure these are present/consistent
  (normalized as any).title = title;
  (normalized as any).titleLower =
    data?.titleLower ?? normalizeTitleLower(title);

  if (Array.isArray(data?.tags)) {
    (normalized as any).tags = normalizeTags(data.tags as ProductIdeaTag[]);
  } else {
    (normalized as any).tags = normalizeTags([] as ProductIdeaTag[]);
  }

  return normalized;
}

/* ---------------------------------------
   Create operations
---------------------------------------- */

export async function createProductIdea(input: {
  title: string;
  summary: string;
  status: ProductIdeaStatus;
  priority: ProductIdeaPriority;
  tags: ProductIdeaTag[];
  ownerId: string;
}) {
  const titleLower = normalizeTitleLower(input.title);
  const tags = normalizeTags(input.tags);

  const docRef = await addDoc(productIdeasCol(), {
    title: input.title,
    titleLower,
    summary: input.summary,
    status: input.status,
    priority: input.priority,
    tags,
    ownerId: input.ownerId,
    archivedAt: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
}

export async function createProductIdeaNote(
  ideaId: string,
  input: {
    body: string;
    authorId: string;
  }
) {
  const docRef = await addDoc(productIdeaNotesCol(ideaId), {
    body: input.body,
    authorId: input.authorId,
    createdAt: serverTimestamp(),
  });

  return docRef.id;
}

/* ---------------------------------------
   Read operations (get-once)
---------------------------------------- */

export async function getProductIdea(
  ideaId: string
): Promise<ProductIdea | null> {
  const docSnap = await getDoc(productIdeaDoc(ideaId));

  if (!docSnap.exists()) return null;

  return {
    id: docSnap.id,
    ...(docSnap.data() as Omit<ProductIdea, "id">),
  };
}

export async function getAllProductIdeas(): Promise<ProductIdea[]> {
  const q = query(productIdeasCol(), orderBy("updatedAt", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<ProductIdea, "id">),
  }));
}

export async function getProductIdeaNotes(
  ideaId: string
): Promise<ProductIdeaNote[]> {
  const q = query(productIdeaNotesCol(ideaId), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((d) => ({
    id: d.id,
    ideaId,
    ...(d.data() as Omit<ProductIdeaNote, "id" | "ideaId">),
  }));
}

/**
 * Assignment 4.1 Part A
 * Show archived ideas (archivedAt != null)
 */
export async function getArchivedProductIdeas(): Promise<ProductIdea[]> {
  const q = query(
    productIdeasCol(),
    where("archivedAt", "!=", null),
    orderBy("archivedAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<ProductIdea, "id">),
  }));
}

/* ---------------------------------------
   Lesson 4.3 - Filters + Search + Pagination
---------------------------------------- */

export type IdeaListStatus = ProductIdeaStatus | "all";

export type IdeaListFilters = {
  status?: IdeaListStatus;
  tag?: ProductIdeaTag | "";
  q?: string;
  archived?: boolean;
};

export type IdeasPageResult = {
  items: ProductIdea[];
  nextCursor: QueryDocumentSnapshot<DocumentData> | null;
};

// Firestore Timestamp supports years 0001..9999. Use safe bounds.
const MIN_TS = Timestamp.fromDate(new Date("0001-01-01T00:00:00.000Z"));
const MAX_TS = Timestamp.fromDate(new Date("9999-12-31T23:59:59.999Z"));

export async function fetchIdeasPage(options: {
  filters: IdeaListFilters;
  pageSize: number;
  cursor: QueryDocumentSnapshot<DocumentData> | null;
}): Promise<IdeasPageResult> {
  const { filters, pageSize, cursor } = options;

  const clauses: any[] = [];

  // Archived filter
  if (filters.archived) {
    // inequality requires ordering by archivedAt in Firestore
    clauses.push(where("archivedAt", ">", MIN_TS));
  } else {
    clauses.push(where("archivedAt", "==", null));
  }

  // Status filter
  if (filters.status && filters.status !== "all") {
    clauses.push(where("status", "==", filters.status));
  }

  // Tag filter (single tag, exact match to your enum value)
  if (filters.tag && String(filters.tag).trim().length > 0) {
    clauses.push(where("tags", "array-contains", filters.tag));
  }

  const qRaw = (filters.q ?? "").trim().toLowerCase();
  const hasSearch = qRaw.length > 0;

  let qBuilt;

  if (filters.archived) {
    if (hasSearch) {
      qBuilt = query(
        productIdeasCol(),
        ...clauses,
        orderBy("archivedAt", "desc"),
        orderBy("titleLower", "asc")
      );

      // Bounds must match orderBy fields (archivedAt desc, titleLower asc)
      qBuilt = query(
        qBuilt,
        startAt(MAX_TS, qRaw),
        endAt(MIN_TS, qRaw + "\uf8ff")
      );
    } else {
      qBuilt = query(
        productIdeasCol(),
        ...clauses,
        orderBy("archivedAt", "desc")
      );
    }
  } else {
    if (hasSearch) {
      qBuilt = query(
        productIdeasCol(),
        ...clauses,
        orderBy("titleLower", "asc")
      );

      qBuilt = query(qBuilt, startAt(qRaw), endAt(qRaw + "\uf8ff"));
    } else {
      qBuilt = query(
        productIdeasCol(),
        ...clauses,
        orderBy("updatedAt", "desc")
      );
    }
  }

  // Pagination
  qBuilt = cursor
    ? query(qBuilt, startAfter(cursor), limit(pageSize))
    : query(qBuilt, limit(pageSize));

  const snap = await getDocs(qBuilt);
  const items = snap.docs.map((d) => normalizeIdeaFromSnap(d.id, d.data()));

  const nextCursor =
    snap.docs.length === pageSize ? snap.docs[snap.docs.length - 1] : null;

  return { items, nextCursor };
}

/* ---------------------------------------
   Real-time (Lesson 4.2)
---------------------------------------- */

export function subscribeActiveIdeas(input: {
  onData: (ideas: ProductIdea[]) => void;
  onError?: (error: unknown) => void;
}): Unsubscribe {
  const q = query(productIdeasCol(), orderBy("updatedAt", "desc"));

  const unsub = onSnapshot(
    q,
    (snap) => {
      const ideas = snap.docs
        .map((d) => ({
          id: d.id,
          ...(d.data() as Omit<ProductIdea, "id">),
        }))
        .filter(isNotArchived);

      input.onData(ideas);
    },
    (err) => {
      if (input.onError) input.onError(err);
    }
  );

  return unsub;
}

export function subscribeActiveIdeasByStatus(input: {
  status: ProductIdeaStatus;
  onData: (ideas: ProductIdea[]) => void;
  onError?: (error: unknown) => void;
}): Unsubscribe {
  const q = query(
    productIdeasCol(),
    where("status", "==", input.status),
    orderBy("updatedAt", "desc")
  );

  const unsub = onSnapshot(
    q,
    (snap) => {
      const ideas = snap.docs
        .map((d) => ({
          id: d.id,
          ...(d.data() as Omit<ProductIdea, "id">),
        }))
        .filter(isNotArchived);

      input.onData(ideas);
    },
    (err) => {
      if (input.onError) input.onError(err);
    }
  );

  return unsub;
}

export function subscribeIdeaById(input: {
  ideaId: string;
  onData: (idea: ProductIdea | null) => void;
  onError?: (error: unknown) => void;
}): Unsubscribe {
  const ref = productIdeaDoc(input.ideaId);

  const unsub = onSnapshot(
    ref,
    (snap) => {
      if (!snap.exists()) {
        input.onData(null);
        return;
      }
      input.onData({
        id: snap.id,
        ...(snap.data() as Omit<ProductIdea, "id">),
      });
    },
    (err) => {
      if (input.onError) input.onError(err);
    }
  );

  return unsub;
}

export function subscribeIdeaNotes(input: {
  ideaId: string;
  onData: (notes: ProductIdeaNote[]) => void;
  onError?: (error: unknown) => void;
}): Unsubscribe {
  const q = query(
    productIdeaNotesCol(input.ideaId),
    orderBy("createdAt", "desc")
  );

  const unsub = onSnapshot(
    q,
    (snap) => {
      const notes = snap.docs.map((d) => ({
        id: d.id,
        ideaId: input.ideaId,
        ...(d.data() as Omit<ProductIdeaNote, "id" | "ideaId">),
      }));
      input.onData(notes);
    },
    (err) => {
      if (input.onError) input.onError(err);
    }
  );

  return unsub;
}

/* ---------------------------------------
   Lesson 4.2 - Course-style wrappers
---------------------------------------- */

export function subscribeToActiveIdeas(
  onNext: (ideas: ProductIdea[]) => void,
  onError?: (err: unknown) => void
): Unsubscribe {
  return subscribeActiveIdeas({
    onData: onNext,
    onError,
  });
}

export function subscribeToActiveIdeasByStatus(
  status: ProductIdeaStatus,
  onNext: (ideas: ProductIdea[]) => void,
  onError?: (err: unknown) => void
): Unsubscribe {
  return subscribeActiveIdeasByStatus({
    status,
    onData: onNext,
    onError,
  });
}

export function subscribeToIdeaById(
  ideaId: string,
  onNext: (idea: ProductIdea | null) => void,
  onError?: (err: unknown) => void
): Unsubscribe {
  return subscribeIdeaById({
    ideaId,
    onData: onNext,
    onError,
  });
}

export function subscribeToIdeaNotes(
  ideaId: string,
  onNext: (notes: ProductIdeaNote[]) => void,
  onError?: (err: unknown) => void
): Unsubscribe {
  return subscribeIdeaNotes({
    ideaId,
    onData: onNext,
    onError,
  });
}

export async function touchIdea(ideaId: string) {
  await updateDoc(productIdeaDoc(ideaId), {
    updatedAt: serverTimestamp(),
  });
}

/* ---------------------------------------
   Update operations
---------------------------------------- */

export async function updateProductIdea(
  ideaId: string,
  updates: Partial<
    Pick<ProductIdea, "title" | "summary" | "status" | "priority" | "tags">
  >
) {
  const next: any = {
    ...updates,
    updatedAt: serverTimestamp(),
  };

  if (typeof updates.title === "string") {
    next.titleLower = normalizeTitleLower(updates.title);
  }

  if (Array.isArray(updates.tags)) {
    next.tags = normalizeTags(updates.tags as ProductIdeaTag[]);
  }

  await updateDoc(productIdeaDoc(ideaId), next);
}

export async function archiveProductIdea(ideaId: string) {
  await updateDoc(productIdeaDoc(ideaId), {
    archivedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function restoreProductIdea(ideaId: string) {
  await updateDoc(productIdeaDoc(ideaId), {
    archivedAt: null,
    updatedAt: serverTimestamp(),
  });
}

/* ---------------------------------------
   Delete operations
---------------------------------------- */

export async function deleteProductIdea(ideaId: string) {
  await deleteDoc(productIdeaDoc(ideaId));
}

export async function deleteProductIdeaNote(ideaId: string, noteId: string) {
  await deleteDoc(productIdeaNoteDoc(ideaId, noteId));
}

/* ---------------------------------------
   Lesson 3.3 - Query functions (get-once)
---------------------------------------- */

export async function getProductIdeasByStatus(
  status: ProductIdeaStatus
): Promise<ProductIdea[]> {
  const q = query(
    productIdeasCol(),
    where("status", "==", status),
    orderBy("updatedAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<ProductIdea, "id">),
  }));
}

export async function getProductIdeasByTag(tag: string): Promise<ProductIdea[]> {
  const q = query(
    productIdeasCol(),
    where("tags", "array-contains", tag),
    orderBy("updatedAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<ProductIdea, "id">),
  }));
}

export type ProductIdeaFilters = {
  status?: ProductIdeaStatus;
  tag?: string;
};

export async function getFilteredProductIdeas(
  filters: ProductIdeaFilters = {}
): Promise<ProductIdea[]> {
  let q = query(productIdeasCol(), orderBy("updatedAt", "desc"));

  if (filters.status) {
    q = query(q, where("status", "==", filters.status));
  }

  if (filters.tag && filters.tag.trim().length > 0) {
    q = query(q, where("tags", "array-contains", filters.tag.trim()));
  }

  const snapshot = await getDocs(q);

  return snapshot.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<ProductIdea, "id">),
  }));
}

export async function getProductIdeasPage(input: {
  pageSize?: number;
  lastDoc?: DocumentSnapshot;
  filters?: ProductIdeaFilters;
}): Promise<{
  ideas: ProductIdea[];
  lastDoc: DocumentSnapshot | null;
  hasMore: boolean;
}> {
  const pageSize = input.pageSize ?? 10;
  const filters = input.filters ?? {};

  let q = query(productIdeasCol(), orderBy("updatedAt", "desc"), limit(pageSize));

  if (filters.status) {
    q = query(q, where("status", "==", filters.status));
  }

  if (filters.tag && filters.tag.trim().length > 0) {
    q = query(q, where("tags", "array-contains", filters.tag.trim()));
  }

  if (input.lastDoc) {
    q = query(q, startAfter(input.lastDoc));
  }

  const snapshot = await getDocs(q);

  const ideas = snapshot.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<ProductIdea, "id">),
  }));

  const lastDoc = snapshot.docs[snapshot.docs.length - 1] ?? null;

  return {
    ideas,
    lastDoc,
    hasMore: snapshot.docs.length === pageSize,
  };
}

export async function getProductIdeasByOwner(
  ownerId: string
): Promise<ProductIdea[]> {
  const q = query(
    productIdeasCol(),
    where("ownerId", "==", ownerId),
    orderBy("updatedAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<ProductIdea, "id">),
  }));
}

export async function getProductIdeasPaginated(
  pageSize: number,
  lastDoc?: DocumentSnapshot,
  filters?: ProductIdeaFilters
): Promise<{
  ideas: ProductIdea[];
  lastDoc: DocumentSnapshot | null;
  hasMore: boolean;
}> {
  const result = await getProductIdeasPage({
    pageSize,
    lastDoc,
    filters,
  });

  return result;
}

export async function getActiveIdeasByCreatedAt(): Promise<ProductIdea[]> {
  const q = query(
    productIdeasCol(),
    where("status", "==", "active"),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<ProductIdea, "id">),
  }));
}
