## Working with the developer
- The developer is a game designer with some technical experience, not a graphics engineer. Explain rendering problems in
  plain language (what it looks like on screen, with an analogy), not shader jargon.
- Keep it collaborative. Where engineering judgement is needed, give a recommendation and say why; when told "your call",
  decide. Art choices are the developer's: render a few options side by side (stills and videos) for them to pick.
- Record decisions where every agent can read them: issues, PRs, `docs/` and code comments. Never only in one agent's
  private memory, which other sessions and agents can't see.

## Working on an issue
- The developer takes one issue at a time, each in its own thread, and stays in the loop: ask questions at any point, and show
  alternatives before settling.
- Before building, read the issue, its epic (if any), `docs/ROADMAP.md` and `docs/DIRECTION.md`, and ask about anything unclear.
- An issue can take more than one PR: land the groundwork first and the look second, rather than one PR that's hard to review.
- Every PR gets a live preview at `https://celestiallemon.github.io/brush3d-renderer/pr-<number>/` (linked in a comment on it).
  For a look choice, build the candidates into the demo behind a button in the demo's controls and a URL option (say
  `?overcast=a`), so the developer can flip between them on the preview in any scene, hour and weather. Remove the ones not
  picked before the PR merges.
- Record each decision in the issue or PR, and update later issues it changes, so the next thread starts with the right picture.
- When an issue is done, update `docs/ROADMAP.md`. Merge only once the developer has approved.

## Workflow
- Before creating a PR always run review-with-sol loops unless asked otherwise.
- Always use the pr skill when creating a PR and babysit a PR unless asked otherwise.
