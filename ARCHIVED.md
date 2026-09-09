# Project archived — 2026-09-09

This repository is no longer under active development or maintenance.

## Final functional snapshot

- Snapshot branch: `archive/final-functional-2026-09-09`
- Snapshot commit: `ca4976fa076bdbf4a1a843237041436e23360793`
- Default branch: `main`

The snapshot branch preserves the last functional application state before archival changes.

## GitHub Actions policy after archival

Both workflows are intentionally `workflow_dispatch` only:

- `.github/workflows/pages.yml`
- `.github/workflows/validate.yml`

No workflow should run automatically on pushes or pull requests. This is intentional to avoid consuming GitHub Actions minutes on a completed project.

## GitHub Pages

The historical Pages site was deployed through the `pages.yml` workflow. The workflow is now manual-only. Unpublishing GitHub Pages from repository Settings is the final hosting-side shutdown step; it does not delete repository history.

## Backend preservation

Supabase project reference: `qqzrpzjtvrbtkbhmdjmp`.

At archival time the backend was intentionally left intact so the application can be restored later without rebuilding its state. Public-repository documentation must not contain private row contents, secrets, API service-role keys, user emails, document contents, or storage objects.

Non-sensitive archival counts on 2026-09-09:

- profiles: 3
- workspaces: 3
- workspace memberships: 3
- workspace state rows: 3
- documents: 2
- active central-catalog opportunities: 2
- login events: 4

These counts are only a sanity snapshot, not a data backup. The actual data remains in Supabase.

## Restore procedure

1. Unarchive the GitHub repository if it has been archived in Settings.
2. Re-enable/publish GitHub Pages.
3. Restore automatic workflow triggers only if active development is really needed.
4. Confirm the Supabase project still exists and review Auth, Storage, RLS policies and Edge Functions before opening the site to users.
5. Start from `archive/final-functional-2026-09-09` if the exact last functional frontend is needed.

## Important

Do not delete the Supabase project or storage merely because this GitHub repository is archived. They contain state that is not fully represented in Git history.
