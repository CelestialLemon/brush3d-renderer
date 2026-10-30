#!/usr/bin/env bash
# Publishes the demo to the gh-pages branch, which GitHub Pages serves:
#   main/   the demo as on main
#   pr-<n>/ a preview of each open pull request
#
#   pages.sh <folder> <built dir>   puts a build in a folder
#   pages.sh <folder>               takes a folder away (a closed pull request)
#   pages.sh                        only cleans up
#
# Every run also takes away the previews of pull requests that are no longer open, so they never pile up. gh-pages keeps no
# history: each run replaces it with one commit holding the site as it is now, pushed with a lease and retried if another run
# got there first. Needs GH_TOKEN, GITHUB_REPOSITORY and an `origin` that can push.
set -euo pipefail

folder="${1:-}" built="${2:-}"
case "$folder" in ''|main|pr-[0-9]*) ;; *) echo "Not a folder this site has: $folder"; exit 1 ;; esac
if [ -n "$built" ]; then built="$(cd "$built" && pwd)"; fi

git config user.name 'github-actions[bot]'
git config user.email '41898282+github-actions[bot]@users.noreply.github.com'
open_prs=" $(gh pr list --repo "$GITHUB_REPOSITORY" --state open --limit 500 --json number --jq '.[].number' | tr '\n' ' ') "
site="$(mktemp -d)" repo="$(git rev-parse --absolute-git-dir)"

for attempt in 1 2 3 4 5; do
  rm -rf "$site" && mkdir -p "$site"
  lease=""
  if git fetch --quiet --depth=1 origin gh-pages 2>/dev/null; then
    lease="$(git rev-parse FETCH_HEAD)"
    git archive FETCH_HEAD | tar -x -C "$site"
  fi

  if [ -n "$folder" ]; then
    rm -rf "${site:?}/$folder"
    if [ -n "$built" ]; then cp -r "$built" "$site/$folder"; fi
  fi
  for dir in "$site"/pr-*/; do
    [ -d "$dir" ] || continue
    name="$(basename "$dir")"
    if [[ "$open_prs" != *" ${name#pr-} "* ]]; then echo "Removing $name: its pull request is closed"; rm -rf "$dir"; fi
  done

  touch "$site/.nojekyll"
  cat > "$site/index.html" <<'HTML'
<!doctype html>
<meta charset="utf-8">
<title>brush3d-renderer</title>
<meta http-equiv="refresh" content="0; url=./main/">
<p><a href="./main/">The brush3d-renderer demo</a>. Each open pull request has a preview at <code>./pr-&lt;number&gt;/</code>.</p>
HTML

  # One commit with no parent: the branch only ever holds the site as it is now.
  tree="$(cd "$site" && GIT_DIR="$repo" GIT_INDEX_FILE="$site.index" GIT_WORK_TREE="$site" bash -c 'git add -A . && git write-tree')"
  rm -f "$site.index"
  if [ -n "$lease" ] && [ "$tree" = "$(git rev-parse "$lease^{tree}")" ]; then echo "Nothing changed"; break; fi
  commit="$(git commit-tree "$tree" -m "Site: ${folder:-clean up} (${GITHUB_SHA::7})")"
  if git push --quiet --force-with-lease="refs/heads/gh-pages:$lease" origin "$commit:refs/heads/gh-pages"; then
    echo "Published (attempt $attempt)"; break
  fi
  if [ "$attempt" = 5 ]; then echo "Couldn't publish: gh-pages kept moving"; exit 1; fi
  echo "gh-pages moved on; trying again"; sleep $((attempt * 3))
done

# A push made with GITHUB_TOKEN doesn't start a Pages build, so ask for one.
gh api -X POST "repos/$GITHUB_REPOSITORY/pages/builds" --silent || echo "Couldn't request a Pages build"
