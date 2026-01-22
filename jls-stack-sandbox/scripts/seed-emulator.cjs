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

    // +15 more activities (same theme + style)
    {
      id: "idea-6",
      title: "Write task adoption onboarding email",
      summary: "Draft a short onboarding email to explain how task adoption works.",
      status: "draft",
      priority: "medium",
      tags: ["copywriting", "marketing"],
      archived: false,
    },
    {
      id: "idea-7",
      title: "Create task template for bug reports",
      summary: "Standardize bug report fields so issues are easier to reproduce.",
      status: "active",
      priority: "medium",
      tags: ["tools", "general"],
      archived: false,
    },
    {
      id: "idea-8",
      title: "Design empty state for no tasks",
      summary: "Create a helpful empty state with a clear CTA and friendly tone.",
      status: "draft",
      priority: "low",
      tags: ["design", "copywriting"],
      archived: false,
    },
    {
      id: "idea-9",
      title: "Add “owner” filter to task list",
      summary: "Filter tasks by owner to reduce noise for larger teams.",
      status: "paused",
      priority: "medium",
      tags: ["tools", "general"],
      archived: false,
    },
    {
      id: "idea-10",
      title: "Audit task statuses for consistency",
      summary: "Confirm status values are consistent across UI, seed data, and Firestore rules.",
      status: "active",
      priority: "high",
      tags: ["tools", "general"],
      archived: false,
    },
    {
      id: "idea-11",
      title: "Define success metrics for task adoption MVP",
      summary: "Pick 3–5 MVP metrics to track adoption and engagement.",
      status: "draft",
      priority: "high",
      tags: ["NPD", "marketing"],
      archived: false,
    },
    {
      id: "idea-12",
      title: "Automate daily reminder for unowned tasks",
      summary: "Send a daily reminder with a link to unadopted tasks.",
      status: "draft",
      priority: "medium",
      tags: ["automation", "tools"],
      archived: false,
    },
    {
      id: "idea-13",
      title: "Write microcopy for “Adopt task” button",
      summary: "Improve button + tooltip text so the action feels clear and low-risk.",
      status: "active",
      priority: "low",
      tags: ["copywriting", "design"],
      archived: false,
    },
    {
      id: "idea-14",
      title: "Create quick-start guide for internal users",
      summary: "One-page guide: how to adopt, update status, and add notes.",
      status: "draft",
      priority: "medium",
      tags: ["copywriting", "tools"],
      archived: false,
    },
    {
      id: "idea-15",
      title: "Add keyboard shortcuts for faster triage",
      summary: "Add simple shortcuts for status changes and opening the notes panel.",
      status: "paused",
      priority: "low",
      tags: ["tools", "general"],
      archived: false,
    },
    {
      id: "idea-16",
      title: "Design task priority badge styles",
      summary: "Create clear visual styles for low/medium/high priority badges.",
      status: "draft",
      priority: "low",
      tags: ["design"],
      archived: false,
    },
    {
      id: "idea-17",
      title: "Create weekly “shipped tasks” digest",
      summary: "Auto-generate a weekly recap of shipped tasks with highlights.",
      status: "draft",
      priority: "medium",
      tags: ["automation", "marketing"],
      archived: false,
    },
    {
      id: "idea-18",
      title: "Improve Firestore indexing for task queries",
      summary: "Add needed composite indexes for common filters (status, priority, tags).",
      status: "active",
      priority: "high",
      tags: ["tools", "automation"],
      archived: false,
    },
    {
      id: "idea-19",
      title: "Write PRD for “Notes” improvements",
      summary: "Define what better notes look like: pinning, sorting, and author visibility.",
      status: "draft",
      priority: "medium",
      tags: ["NPD", "tools"],
      archived: false,
    },
    {
      id: "idea-20",
      title: "Draft launch post for internal Slack",
      summary: "Short announcement post to explain the MVP and invite early adopters.",
      status: "shipped",
      priority: "low",
      tags: ["marketing", "copywriting"],
      archived: false,
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

  console.log("Seeding complete: 20 ideas + notes on idea-1 and idea-2.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
