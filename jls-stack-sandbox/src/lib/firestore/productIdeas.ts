// src/lib/firestore/productIdeas.ts
import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import type { ProductIdea, ProductIdeaNote, ProductIdeaStatus } from "@/types/productIdeas";

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

/* ---------------------------------------
   Create operations
---------------------------------------- */

export async function createProductIdea(input: {
  title: string;
  summary: string;
  status: ProductIdeaStatus; // you chose: must choose
  tags: string[];
  ownerId: string;
}) {
  const docRef = await addDoc(productIdeasCol(), {
    title: input.title,
    summary: input.summary,
    status: input.status,
    tags: input.tags,
    ownerId: input.ownerId,
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

export async function getProductIdea(ideaId: string): Promise<ProductIdea | null> {
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

export async function getProductIdeaNotes(ideaId: string): Promise<ProductIdeaNote[]> {
  const q = query(productIdeaNotesCol(ideaId), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((d) => ({
    id: d.id,
    ideaId,
    ...(d.data() as Omit<ProductIdeaNote, "id" | "ideaId">),
  }));
}

/* ---------------------------------------
   Update operations
---------------------------------------- */

export async function updateProductIdea(
  ideaId: string,
  updates: Partial<Pick<ProductIdea, "title" | "summary" | "status" | "tags">>
) {
  await updateDoc(productIdeaDoc(ideaId), {
    ...updates,
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
   Extension query
---------------------------------------- */

/**
 * Extension task:
 * Get product ideas filtered by status
 */
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

/**
 * Important note (from the lesson):
 * Deleting a parent document does NOT automatically delete its subcollections.
 * If you delete productIdeas/{ideaId}, the notes under /notes will still exist.
 * For production, you’d delete notes first or use a Cloud Function for cascading deletes.
 */
