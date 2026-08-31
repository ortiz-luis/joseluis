# José Luis — Opportunity & Dossier Portal

Personal application workspace designed around **calm, control and minimum friction**.

## Product principles

1. The landing page reassures before it asks for action.
2. One opportunity object evolves through its whole lifecycle; it is never duplicated.
3. Documents and profile data are reusable across applications.
4. Nothing is required just to save progress.
5. Known information is never requested twice.
6. Small problems are solved contextually, without unnecessary navigation.
7. Red is reserved for genuinely urgent situations.
8. The UI progressively reveals detail instead of presenting a bureaucratic form.

## Main pages

- **Inicio** — calm status, active processes, dossier readiness and discreet radar updates.
- **Oportunidades** — all opportunities with lifecycle states.
- **Oportunidad** — one evolving detail page from `new` to `submitted/closed`.
- **Documentos** — master dossier, reusable files and versions.
- **Perfil** — reusable structured personal/professional information.

## Data & privacy

This repository is public. Therefore **no real private documents or sensitive personal data belong in Git**.

The current static implementation stores user-entered portal state in the browser (`localStorage`) and keeps uploaded-file metadata locally. It does not upload personal files to GitHub.

Before using real documents across multiple devices, add a private authenticated backend/object store and migrate the persistence layer.

## Local use

Open `index.html` in a browser, or serve the folder with any static web server.

## GitHub Pages

The site is static and ready to be served by GitHub Pages. If Pages is not enabled yet, enable it for the `main` branch/root directory in repository settings.

## Definition of done for v1

- Desktop and mobile responsive navigation.
- Calm landing page with adaptive urgency.
- Opportunity lifecycle and filters.
- Opportunity detail with `Ready / Easy fix / Action needed` requirements.
- Master dossier with duplicate detection by file fingerprint metadata and versions.
- Reusable profile data.
- Auto-save and safe incomplete states.
- Seed radar opportunities that can be edited or removed.
- No sensitive files committed to the public repository.
