# Project status — José Luis portal

## V1 status

### Done
- [x] Calm, low-stress product principles frozen in README.
- [x] Familiar desktop sidebar and mobile bottom navigation.
- [x] Responsive Home, Opportunities, Opportunity detail, Documents and Profile.
- [x] Landing prioritizes reassurance, processes, dossier and discreet new opportunities.
- [x] Adaptive deadline emphasis instead of permanent urgency.
- [x] Opportunity lifecycle: New → Considering → Preparing → Ready → Submitted → Closed.
- [x] One opportunity object changes state instead of being duplicated.
- [x] Opportunity editing and manual creation.
- [x] Requirement grouping: Ready / Easy fix / Action needed.
- [x] Contextual motivation-letter draft.
- [x] Contextual English-certificate guidance.
- [x] Profile as reusable structured data.
- [x] Dossier page with categories and versions.
- [x] Local duplicate detection using file name/size/last-modified fingerprint.
- [x] Auto-save to browser localStorage.
- [x] No mandatory fields for saving except a title when creating a new opportunity.
- [x] Browser-side starter CV generator and version entry.
- [x] Seed radar entries clearly marked as requiring verification where concrete programme data is not yet known.
- [x] Public-repository privacy guardrail documented.
- [x] JavaScript/static smoke-test workflow.
- [x] GitHub Pages deployment workflow.

### Intentionally not stored in this public repository
- [ ] Real passports, certificates, transcripts, recommendation letters or CV files.
- [ ] Sensitive personal profile fields.
- [ ] Authentication secrets.

These require a private authenticated persistence layer before production use.

## V1.1 — next safe functional upgrade
- [ ] Persist actual uploaded file blobs locally with IndexedDB, not only their metadata.
- [ ] Add local preview/download for browser-stored files.
- [ ] Use cryptographic SHA-256 for true duplicate detection.
- [ ] Add explicit document-current/version controls.
- [ ] Generate formatted PDF/DOCX CV instead of a plain-text starter export.
- [ ] Add structured reusable recommendation contacts.
- [ ] Add writing-sample suggestions.
- [ ] Add per-opportunity history UI.
- [ ] Improve search so results appear instead of navigating on the first match.
- [ ] Add accessibility audit and keyboard-flow tests.

## Production / multi-device version
- [ ] Private authentication.
- [ ] Private encrypted object storage for documents.
- [ ] Server-side database for profile, opportunities and history.
- [ ] Cross-device sync.
- [ ] Role separation between radar/admin updates and José Luis user actions.
- [ ] Secure backups and recovery.
- [ ] Automated deadline monitoring/notifications.
- [ ] Radar ingestion pipeline.

## Data work still required
- [ ] Replace generic radar placeholders with the exact opportunities already identified for José Luis.
- [ ] Verify every official URL, deadline, funding rule, eligibility condition and language requirement from primary sources.
- [ ] Extract the exact document requirements per opportunity.
- [ ] Mark each requirement as core / frequent / opportunity-specific.
- [ ] Load only confirmed personal facts/documents; do not invent missing information.

## Definition of done for a real-user release
A release for José Luis is considered production-ready only when:
1. the site is deployed and passes smoke checks;
2. real opportunities are verified against primary sources;
3. personal documents are stored outside the public Git repository;
4. uploaded files persist and can be recovered;
5. no save action is blocked by incomplete optional information;
6. the first screen communicates calm and control rather than workload;
7. desktop and mobile workflows are tested end-to-end.
