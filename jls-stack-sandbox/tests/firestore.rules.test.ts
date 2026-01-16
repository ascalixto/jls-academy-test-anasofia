import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  RulesTestEnvironment,
} from "@firebase/rules-unit-testing"
import { setLogLevel } from "@firebase/logger"
import { readFileSync } from "fs"
import { beforeAll, afterAll, beforeEach, describe, test } from "vitest"


let testEnv: RulesTestEnvironment

const rules = readFileSync("firestore.rules", "utf8")
setLogLevel("silent")


function createTestIdea(ownerId: string, overrides: Record<string, unknown> = {}) {
  return {
    title: "Test Idea",
    summary: "A test product idea",
    status: "draft",
    ownerId,
    tags: ["test"],
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }
}

function createTestNote(authorId: string, overrides: Record<string, unknown> = {}) {
  return {
    body: "Test note content",
    authorId,
    createdAt: new Date(),
    ...overrides,
  }
}

async function setupTestData(callback: (db: any) => Promise<void>) {
  await testEnv.withSecurityRulesDisabled(async (context) => {
    const adminDb = context.firestore()
    await callback(adminDb)
  })
}

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: "test-project",
    firestore: {
      rules,
      host: "127.0.0.1",
      port: 8080,
    },
  })
})

afterAll(async () => {
  if (testEnv) await testEnv.cleanup()
})

beforeEach(async () => {
  await testEnv.clearFirestore()
})

describe("productIdeas read rules", () => {
  test("unauthenticated users cannot read ideas", async () => {
    await setupTestData(async (db) => {
      await db.collection("productIdeas").doc("idea-1").set(createTestIdea("user-1"))
    })

    const db = testEnv.unauthenticatedContext().firestore()
    await assertFails(db.collection("productIdeas").doc("idea-1").get())
  })

  test("authenticated users can read any idea", async () => {
    await setupTestData(async (db) => {
      await db.collection("productIdeas").doc("idea-1").set(createTestIdea("other-user"))
    })

    const db = testEnv.authenticatedContext("user-1").firestore()
    await assertSucceeds(db.collection("productIdeas").doc("idea-1").get())
  })

  test("authenticated users can list all ideas", async () => {
    await setupTestData(async (db) => {
      await db.collection("productIdeas").doc("idea-1").set(createTestIdea("user-1"))
      await db.collection("productIdeas").doc("idea-2").set(createTestIdea("user-2"))
    })

    const db = testEnv.authenticatedContext("user-1").firestore()
    await assertSucceeds(db.collection("productIdeas").get())
  })
})

describe("productIdeas create rules", () => {
  test("unauthenticated users cannot create ideas", async () => {
    const db = testEnv.unauthenticatedContext().firestore()
    await assertFails(db.collection("productIdeas").add(createTestIdea("anyone")))
  })

  test("users can create ideas they own", async () => {
    const db = testEnv.authenticatedContext("user-1").firestore()
    await assertSucceeds(db.collection("productIdeas").add(createTestIdea("user-1")))
  })

  test("users cannot create ideas owned by others", async () => {
    const db = testEnv.authenticatedContext("user-1").firestore()
    await assertFails(db.collection("productIdeas").add(createTestIdea("user-2")))
  })

  test("create fails with invalid status", async () => {
    const db = testEnv.authenticatedContext("user-1").firestore()
    await assertFails(
      db.collection("productIdeas").add(createTestIdea("user-1", { status: "invalid-status" }))
    )
  })

  test("create fails with empty title", async () => {
    const db = testEnv.authenticatedContext("user-1").firestore()
    await assertFails(db.collection("productIdeas").add(createTestIdea("user-1", { title: "" })))
  })
})

describe("productIdeas update rules", () => {
  beforeEach(async () => {
    await setupTestData(async (db) => {
      await db.collection("productIdeas").doc("idea-1").set(createTestIdea("user-1"))
    })
  })

  test("owners can update their ideas", async () => {
    const db = testEnv.authenticatedContext("user-1").firestore()
    await assertSucceeds(
      db.collection("productIdeas").doc("idea-1").set(
        {
          title: "Updated Title",
          summary: "Updated summary",
          status: "active",
          ownerId: "user-1",
          tags: ["updated"],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        { merge: true }
      )
    )
  })

  test("non-owners cannot update ideas", async () => {
    const db = testEnv.authenticatedContext("user-2").firestore()
    await assertFails(db.collection("productIdeas").doc("idea-1").update({ title: "Hacked Title" }))
  })

  test("owners cannot change ownerId", async () => {
    const db = testEnv.authenticatedContext("user-1").firestore()
    await assertFails(
      db.collection("productIdeas").doc("idea-1").set(
        {
          title: "Updated Title",
          summary: "Updated summary",
          status: "active",
          ownerId: "user-2",
          tags: ["updated"],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        { merge: true }
      )
    )
  })

  test("admins can update any idea", async () => {
    const db = testEnv.authenticatedContext("admin-user", { admin: true }).firestore()
    await assertSucceeds(
      db.collection("productIdeas").doc("idea-1").set(
        {
          title: "Admin Updated",
          summary: "Updated by admin",
          status: "active",
          ownerId: "user-1",
          tags: ["admin-edited"],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        { merge: true }
      )
    )
  })
})

describe("productIdeas delete rules", () => {
  beforeEach(async () => {
    await setupTestData(async (db) => {
      await db.collection("productIdeas").doc("idea-1").set(createTestIdea("user-1"))
    })
  })

  test("owners can delete their ideas", async () => {
    const db = testEnv.authenticatedContext("user-1").firestore()
    await assertSucceeds(db.collection("productIdeas").doc("idea-1").delete())
  })

  test("non-owners cannot delete ideas", async () => {
    const db = testEnv.authenticatedContext("user-2").firestore()
    await assertFails(db.collection("productIdeas").doc("idea-1").delete())
  })

  test("admins cannot delete other users ideas", async () => {
    const db = testEnv.authenticatedContext("admin-user", { admin: true }).firestore()
    await assertFails(db.collection("productIdeas").doc("idea-1").delete())
  })
})

describe("notes subcollection rules", () => {
  beforeEach(async () => {
    await setupTestData(async (db) => {
      await db.collection("productIdeas").doc("idea-1").set(createTestIdea("user-1"))
      await db
        .collection("productIdeas")
        .doc("idea-1")
        .collection("notes")
        .doc("note-1")
        .set(createTestNote("user-1"))
    })
  })

  test("authenticated users can read notes", async () => {
    const db = testEnv.authenticatedContext("user-2").firestore()
    await assertSucceeds(
      db.collection("productIdeas").doc("idea-1").collection("notes").doc("note-1").get()
    )
  })

  test("unauthenticated users cannot read notes", async () => {
    const db = testEnv.unauthenticatedContext().firestore()
    await assertFails(
      db.collection("productIdeas").doc("idea-1").collection("notes").doc("note-1").get()
    )
  })

  test("users can create notes they author", async () => {
    const db = testEnv.authenticatedContext("user-2").firestore()
    await assertSucceeds(
      db.collection("productIdeas").doc("idea-1").collection("notes").add(createTestNote("user-2"))
    )
  })

  test("users cannot create notes authored by others", async () => {
    const db = testEnv.authenticatedContext("user-2").firestore()
    await assertFails(
      db.collection("productIdeas").doc("idea-1").collection("notes").add(createTestNote("user-1"))
    )
  })

  test("note authors can delete their notes", async () => {
    const db = testEnv.authenticatedContext("user-1").firestore()
    await assertSucceeds(
      db.collection("productIdeas").doc("idea-1").collection("notes").doc("note-1").delete()
    )
  })

  test("non-authors cannot delete notes", async () => {
    const db = testEnv.authenticatedContext("user-2").firestore()
    await assertFails(
      db.collection("productIdeas").doc("idea-1").collection("notes").doc("note-1").delete()
    )
  })
})
