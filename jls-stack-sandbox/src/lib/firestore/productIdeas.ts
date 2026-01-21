// src/lib/firestore/productIdeas.ts
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
  type DocumentSnapshot,
  type Unsubscribe,
} from "firebase/firestore";

import type {
  ProductIdea,
  ProductIdeaNote,
  ProductIdeaStatus,
  ProductIdeaPriority,
  ProductIdeaTag,
} from "@/types/productIdeas";

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
  const docRef = await addDoc(productIdeasCol(), {
    title: input.title,
    summary: input.summary,
    status: input.status,
    priority: input.priority,
    tags: input.tags,
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
   Read operations
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
   Real-time (Assignment 4.2)
---------------------------------------- */

/**
 * Real-time subscription for active ideas list.
 * We filter out archived items on the client to avoid edge cases with missing archivedAt.
 */
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

/**
 * Real-time subscription for a single idea doc by id.
 */
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

/**
 * Assignment 4.2 Part B
 * Real-time subscription for notes list under productIdeas/{ideaId}/notes
 */
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
   Update operations
---------------------------------------- */

export async function updateProductIdea(
  ideaId: string,
  updates: Partial<
    Pick<ProductIdea, "title" | "summary" | "status" | "priority" | "tags">
  >
) {
  await updateDoc(productIdeaDoc(ideaId), {
    ...updates,
    updatedAt: serverTimestamp(),
  });
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
   Lesson 3.3 - Query functions
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
