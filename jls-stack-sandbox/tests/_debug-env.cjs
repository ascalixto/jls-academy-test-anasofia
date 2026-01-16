const { initializeTestEnvironment } = require("@firebase/rules-unit-testing");

(async () => {
  const rules = `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
`.trim();

  const env = await initializeTestEnvironment({
    projectId: "test-project",
    firestore: {
      rules,
      host: "127.0.0.1",
      port: 8080,
    },
  });

  const db = env.unauthenticatedContext().firestore();

  console.log("db type:", typeof db);
  console.log("db keys:", Object.keys(db || {}).slice(0, 15));

  await env.cleanup();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
