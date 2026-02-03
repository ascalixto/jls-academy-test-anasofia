# Git Recovery Playbook

## What I check first 
- What branch am I on?
- Did I already push this change, or is it only local?
- Did this reach `main`?
- Am I dealing with:
  - a local commit?
  - a pushed commit?
  - a merged PR?

---

## “I committed locally and regret it” → Undo (not pushed)
Use this when the commit only exists on your computer.

**In GitHub Desktop**
- Open GitHub Desktop
- Make sure you are on the correct branch
- Use **Undo last commit**
- Your changes return to the working directory
- Edit or discard them as needed

Safe because nothing was shared yet.

---

## “I pushed it and need to undo safely” → Revert (pushed)
Use this when the commit was already pushed to GitHub.

**In GitHub Desktop**
- Make sure you are on the branch with the bad commit
- Select the commit in the history
- Choose **Revert this commit**
- A new commit is created that undoes the previous one
- Push the revert commit

This keeps history intact and is safe for shared branches.

---

## “My commits are messy, I want to redo them” → Reset to commit
Use this when commits are confusing but you want to redo the work cleanly.

**In GitHub Desktop**
- Open the commit history
- Right-click the commit you want to return to
- Choose **Reset to this commit**
- Your later commits are removed
- Your changes return to the working directory
- Create a new, clean commit

Only do this if the commits were not shared yet.

---

## “A PR merged into main needs rollback” → Revert PR
Use this when something already merged into `main` and must be undone.

**On GitHub.com**
- Open the merged Pull Request
- Click **Revert**
- GitHub creates a new “revert PR”
- Create and merge that revert PR

Result: `main` returns to the state before the original PR, using a clean and traceable rollback.

---

## Mental model reminder
- **Undo / Reset** → for local or unshared mistakes
- **Revert** → for anything already shared
- **Revert PR** → for mistakes that reached `main`

Goal: fix the problem without breaking history or teammates.
