const { initializeApp } = require("firebase/app");
const {
  getAuth,
  connectAuthEmulator,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} = require("firebase/auth");
const {
  getFirestore,
  connectFirestoreEmulator,
  doc,
  setDoc,
  collection,
  addDoc,
  serverTimestamp,
} = require("firebase/firestore");

const PROJECT_ID = "adopt-a-task-15475";
const EMAIL = "user1@test.com";
const PASSWORD = "password123";

function normalizeTitleLower(title) {
  return String(title || "").trim().toLowerCase();
}

// Your allowed tags (matches ProductIdeaTag)
const ALLOWED_TAGS = [
  "copywriting",
  "NPD",
  "marketing",
  "design",
  "automation",
  "tools",
  "general",
];

function normalizeTags(tags) {
  const cleaned = (tags || [])
    .map((t) => String(t).trim())
    .filter(Boolean);

  // keep only allowed tags
  const filtered = cleaned.filter((t) => ALLOWED_TAGS.includes(t));

  // de-dupe preserving order
  return Array.from(new Set(filtered));
}

async function ensureUser(auth) {
  try {
    const cred = await signInWithEmailAndPassword(auth, EMAIL, PASSWORD);
    return cred.user.uid;
  } catch (e) {
    const cred = await createUserWithEmailAndPassword(auth, EMAIL, PASSWORD);
    return cred.user.uid;
  }
}

async function main() {
  const app = initializeApp({
    apiKey: "x",
    authDomain: "x",
    projectId: PROJECT_ID,
  });

  const auth = getAuth(app);
  connectAuthEmulator(auth, "http://127.0.0.1:9099");

  const uid = await ensureUser(auth);
  console.log("Seed user UID:", uid);

  const db = getFirestore(app);
  connectFirestoreEmulator(db, "127.0.0.1", 8080);

  const ideas = [
    {
      id: "idea-1",
      title: "Rewrite homepage hero copy",
      summary: "Need clearer, benefit-focused copy for the homepage hero.",
      status: "active",
      priority: "high",
      tags: ["copywriting", "marketing"],
      archived: false,
    },
    {
      id: "idea-2",
      title: "Fix dashboard loading edge case",
      summary: "Sometimes loading state feels too fast or hard to capture in dev.",
      status: "active",
      priority: "medium",
      tags: ["tools", "general"],
      archived: false,
    },
    {
      id: "idea-3",
      title: "Automate weekly metrics report",
      summary: "Automate pulling weekly metrics from multiple sources into one report.",
      status: "draft",
      priority: "high",
      tags: ["automation", "tools"],
      archived: false,
    },
    {
      id: "idea-4",
      title: "Design category icons for tasks",
      summary: "Create simple icons for core categories.",
      status: "paused",
      priority: "low",
      tags: ["design"],
      archived: false,
    },
    {
      id: "idea-5",
      title: "Define MVP scope for task adoption flow",
      summary: "Define the MVP flow for adopting tasks internally.",
      status: "shipped",
      priority: "medium",
      tags: ["NPD", "general"],
      // seed one archived idea so you can test Archived toggle + queries
      archived: true,
    },
  ];

  for (const idea of ideas) {
    const titleLower = normalizeTitleLower(idea.title);
    const tags = normalizeTags(idea.tags);

    await setDoc(doc(db, "productIdeas", idea.id), {
      title: idea.title,
      titleLower,
      summary: idea.summary,
      status: idea.status,
      priority: idea.priority,
      ownerId: uid,
      tags,
      archivedAt: idea.archived ? serverTimestamp() : null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  // Notes for idea-1 (2+)
  await addDoc(collection(db, "productIdeas", "idea-1", "notes"), {
    body: "Tone should be friendly but confident.",
    authorId: uid,
    createdAt: serverTimestamp(),
  });
  await addDoc(collection(db, "productIdeas", "idea-1", "notes"), {
    body: "Deadline is Friday EOD.",
    authorId: uid,
    createdAt: serverTimestamp(),
  });

  // Notes for idea-2 (2+)
  await addDoc(collection(db, "productIdeas", "idea-2", "notes"), {
    body: "This is a good test case for async UI feedback states.",
    authorId: uid,
    createdAt: serverTimestamp(),
  });
  await addDoc(collection(db, "productIdeas", "idea-2", "notes"), {
    body: "Also useful for testing real-time updates across two tabs.",
    authorId: uid,
    createdAt: serverTimestamp(),
  });

  console.log("Seeding complete: 5 ideas + notes on idea-1 and idea-2.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
