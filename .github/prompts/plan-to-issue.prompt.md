---
description: "Create a GitHub issue from the current Plan"
name: "plan-to-issue"
argument-hint: "Use the current Plan"
agent: "agent"
tools: [github/issue_write, github/issue_read]
---

Use the current Plan already established in this conversation (Plan mode has just completed).
If no Plan is available in context, ask the user to provide it before proceeding.

Convert the Plan into a GitHub issue for the repository danielz0102/linku.

Requirements:

- Title: short, imperative, and specific.
- Body: include context, objectives, implementation steps, and testing/verification.
- Capture assumptions, risks, and dependencies explicitly.
- Use Markdown headings and task lists where helpful.
- Ensure the issue is actionable by a cloud agent without extra chat context.

Then create the issue using the GitHub tool:

- owner: danielz0102
- repo: linku
- method: create

Finally, return the created issue number and link.
