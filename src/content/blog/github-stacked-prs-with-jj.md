---
title: "Using Jujutsu with GitHub Stacked PRs"
description: "Use Jujutsu bookmarks and GitHub's gh stack link command to manage stacked pull requests without giving up jj's native history editing workflow."
pubDate: 2026-07-22
tags: ["jujutsu", "github", "stacked prs", "version control"]
---

Stacked pull requests and Jujutsu fit together naturally. A Jujutsu bookmark can mark each pull request boundary, while `jj rebase`, `jj squash`, and `jj absorb` handle the history beneath those boundaries. GitHub's new `gh stack link` command connects those bookmarks into a native stack without taking over the local workflow.

New to Jujutsu? Start with the [Jujutsu documentation](https://docs.jj-vcs.dev/). New to stacked pull requests? Read [GitHub's introduction to Stacked PRs](https://github.github.com/gh-stack/).

A stack is an ordered chain of pull requests. The bottom PR targets the repository's main branch, and every PR above it targets the branch belonging to the PR below. GitHub can then present each layer as a focused diff while understanding the chain as one mergeable unit.

```text
main
  └── model     → PR #1, base: main
       └── api  → PR #2, base: model
            └── ui → PR #3, base: api
```

## Build the stack in Jujutsu

In Jujutsu, bookmarks are movable labels rather than containers for commits. We can edit the commit graph directly, then place one bookmark at the top of each diff we want GitHub to expose as a pull request.

Start the first change from the repository's trunk revision:

```bash
jj new trunk() -m "Add the data model"
# Edit files. The changes are recorded in the working-copy commit.
jj bookmark create feature/01-model -r @
```

Create each dependent layer on top of the previous one and give it its own bookmark:

```bash
jj new -m "Add the API"
# Edit files for the API layer.
jj bookmark create feature/02-api -r @

jj new -m "Add the UI"
# Edit files for the UI layer.
jj bookmark create feature/03-ui -r @
```

There is no separate commit step here. Jujutsu's working copy is itself a mutable commit, and `jj new` starts the next change on top of it. The bookmarks mark the three points that GitHub needs to see as branches.

## Publish the stack to GitHub

GitHub Stacked PRs is currently in private preview, so the feature must be enabled for the repository. Install the official CLI extension if you do not already have it:

```bash
gh extension install github/gh-stack
```

Push the bookmarks with Jujutsu first:

```bash
jj git push --remote origin \
  --bookmark feature/01-model \
  --bookmark feature/02-api \
  --bookmark feature/03-ui
```

Pushing through `jj` establishes remote bookmark tracking and preserves its usual safety checks. Now pass the same bookmarks to GitHub in bottom-to-top order:

```bash
gh stack link --remote origin --base main \
  feature/01-model \
  feature/02-api \
  feature/03-ui
```

`gh stack link` looks for an open pull request for each bookmark. It creates any that are missing, corrects their base branches to match the order above, and links them into a native GitHub stack. New pull requests are drafts by default; add `--open` if they should be ready for review immediately.

The command does not create GitHub Stack metadata in the local repository. Jujutsu remains the source of truth for the commit graph, while GitHub tracks only the pull requests and their order.

## Update a layer

Suppose review feedback requires a change to the model at the bottom of the stack. Edit that revision directly:

```bash
jj edit feature/01-model
# Make the requested changes.
```

Jujutsu rewrites the model change and automatically rebases the API and UI changes on top of it. Push all three bookmarks because their commit IDs may have changed:

```bash
jj git push --remote origin \
  --bookmark feature/01-model \
  --bookmark feature/02-api \
  --bookmark feature/03-ui
```

There is no need to run `gh stack link` again. The bookmark names, pull request bases, and stack order have not changed; only the commits behind those bookmarks moved.

## Add another layer

To grow the stack, create another change on top of its current highest bookmark:

```bash
jj new feature/03-ui -m "Add integration tests"
# Edit files for the integration-test layer.
jj bookmark create feature/04-integration -r @

jj git push --remote origin --bookmark feature/04-integration
```

Then link the complete ordered stack again:

```bash
gh stack link --remote origin --base main \
  feature/01-model \
  feature/02-api \
  feature/03-ui \
  feature/04-integration
```

This invocation is idempotent. `gh stack link` recognizes the first three pull requests and appends the new one to the top. You can instead pass the GitHub stack number followed by only the new bookmark, but repeating the full list keeps the intended order visible in the command itself.

## Restructure a published stack

Locally, Jujutsu makes structural changes routine. You can use `jj rebase` to reorder layers, `jj squash` to combine them, or insert a new change anywhere in the graph. Move the bookmarks to the new pull request boundaries and Jujutsu will handle the descendant rebases.

GitHub's remote stack is less flexible: the Stacks API can append pull requests to the top, but it cannot reorder or remove existing members. After changing the composition of a published stack, dissolve the remote stack and recreate it:

```bash
gh stack unstack <stack-number>

# Restructure with jj, then push every moved bookmark.
jj git push --remote origin --bookmark feature/01-model # ...

# Pass the new order from bottom to top.
gh stack link --remote origin --base main <bookmark> <bookmark> <bookmark>
```

If a layer disappeared entirely, close its pull request and delete its bookmark separately. Pull requests that are queued for merge or have auto-merge enabled may prevent GitHub from fully dissolving the stack, so remove those states before restructuring.

## Merge and synchronize

GitHub merges a stack from the bottom upward. Merging the top pull request lands the entire stack atomically; merging a lower pull request lands that PR and everything below it while leaving the higher layers open.

The whole-stack merge is the simplest fit for this workflow. After it lands, fetch the new trunk and begin the next work from `trunk()`:

```bash
jj git fetch --remote origin
jj new trunk()
```

A partial merge needs more care. GitHub automatically rebases the remaining branches on its servers, producing new Git commits that do not preserve the local Jujutsu change IDs. Run `jj git fetch --remote origin` before doing more local work, inspect the resulting local and remote bookmark positions, and explicitly reconcile any bookmark conflicts. If retaining Jujutsu's local change identity matters, prefer merging the complete stack.

## The division of responsibility

That is the whole integration. Jujutsu owns the commit graph, automatic descendant rebases, undo history, and bookmark updates. `gh stack link` turns an ordered list of those bookmarks into pull requests and records their relationship on GitHub.

There is no second local stack model to synchronize and no need to replace `jj rebase`, `jj squash`, or `jj absorb`. The only convention is to bookmark each pull request boundary and pass those bookmarks to GitHub from bottom to top.
