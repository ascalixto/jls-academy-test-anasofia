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
      tags: ["copywriting", "marketing", "website"],
    },
    {
      id: "idea-2",
      title: "Fix loading state bug on dashboard",
      summary: "Dashboard gets stuck on loading when switching filters fast.",
      status: "active",
      tags: ["coding", "frontend", "bug"],
    },
    {
      id: "idea-3",
      title: "Automate weekly metrics report",
      summary: "Automate pulling weekly metrics from multiple sheets into one report.",
      status: "draft",
      tags: ["automation", "ops", "reporting"],
    },
    {
      id: "idea-4",
      title: "Design category icons for tasks",
      summary: "Create simple icons for categories.",
      status: "paused",
      tags: ["design", "ui", "branding"],
    },
    {
      id: "idea-5",
      title: "Define MVP scope for task adoption flow",
      summary: "Define the MVP flow for adopting tasks internally.",
      status: "shipped",
      tags: ["product", "strategy", "mvp"],
    },
  ];

  for (const idea of ideas) {
    await setDoc(doc(db, "productIdeas", idea.id), {
      title: idea.title,
      summary: idea.summary,
      status: idea.status,
      ownerId: uid,
      tags: idea.tags,
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
    body: "Bug happens when changing filters quickly.",
    authorId: uid,
    createdAt: serverTimestamp(),
  });
  await addDoc(collection(db, "productIdeas", "idea-2", "notes"), {
    body: "Check stale state updates after async fetch.",
    authorId: uid,
    createdAt: serverTimestamp(),
  });

  console.log("Seeding complete: 5 ideas + notes on idea-1 and idea-2.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
