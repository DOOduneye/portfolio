---
name: pr
description: Use before every gh pr create, gh pr edit, or git commit in this repo. Defines the title, body and commit message style, which is terser than the default and overrides it.
---

# Pull requests and commits

## Title

`type: <2-5 plain words>` naming the area. Not a sentence, not a summary.

Types: `fix`, `feat`, `refactor`, `perf`, `chore`, `test`, `security`, `ci`.

- Good: `chore: repo cleanup`, `security: cloudflare access for admin`
- Bad: `Fix the admin token so the CMS is protected by Access instead` — that is a body, not a title

No em dashes. No issue IDs.

## Body

ONE line, hard cap 100 characters, stating what the PR changed. Frame it as the
outcome.

- Good: `Puts the CMS behind Cloudflare Access and closes a www hostname that served it ungated.`
- A plain addition is just `adds X to <system>`
- A scope-out folds into the same line as a clause

Never in a body: `## Summary` or `## Test plan` headers, checkbox lists, test
logs, mechanism or design reiteration, em dashes, `Co-Authored-By`, or
`Generated with Claude Code`. The diff holds the mechanism.

UI changes get screenshots, one per state. Images do not count against the cap.

## Commits

Subject under 72 characters, `type: what changed`. The body explains *why*, not
what. No AI attribution.

Unlike the PR body, a commit body should be as long as the reasoning needs.
That is where mechanism, rejected alternatives and gotchas belong.

## Stacking

Do not stack a PR on another PR's branch. Merging the child into a parent that
has already merged leaves the work on a dead branch, where it looks merged but
never reaches `main`. Base everything on `main` and take the conflicts.

## Merging

Never merge, close, or comment on a PR. Opening one is the only external action
to take. Review feedback goes to the repo owner, who decides what to answer.
