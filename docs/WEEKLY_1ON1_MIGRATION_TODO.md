# Weekly 1:1 Preparation — migration TODO

Goal: reuse the mature low-attention UX of `joseluis` to build a no-login weekly 1:1 preparation workspace for Lucas.

## Progress model
- Current task progress: progress inside the active TODO item.
- Overall progress: weighted progress across the full migration list.

## Phase 1 — Audit and isolate the base
- [x] Identify `ortiz-luis/joseluis` as the source UI.
- [x] Confirm static GitHub Pages architecture and low-attention UX contract.
- [x] Identify authentication/backend code that should not be inherited by the no-login version.
- [x] Create isolated branch `prototype/weekly-1on1-prep`.
- [ ] Record reusable UI primitives and modules to keep.

## Phase 2 — Define the 1:1 product model
- [ ] Define top-level navigation: Home, Next 1:1, Topics, Deliverables, History.
- [ ] Define Topic object: status, latest evidence, next action, Lucas need, related deliverables.
- [ ] Define Deliverable object separately from Topic.
- [ ] Define deliverable maturity states: Work in progress, Candidate, Ready to show, Shown/reviewed, Archived/superseded.
- [ ] Define weekly meeting object and carry-over rules.
- [ ] Define decision/request object for Lucas.

## Phase 3 — Remove application-specific and login layers
- [ ] Remove login gate and auth/session UI from prototype.
- [ ] Remove application/opportunity-specific wording and flows.
- [ ] Remove document-upload/backend behaviors that are irrelevant to 1:1 preparation.
- [ ] Keep safe browser-local persistence for the first version.

## Phase 4 — Rebuild navigation and Home
- [ ] Rename/rebuild sidebar and mobile nav.
- [ ] Build Next 1:1 header with meeting date.
- [ ] Add `Ready for next 1:1` section.
- [ ] Add `Still cooking` section.
- [ ] Add compact topic readiness table/cards.
- [ ] Add explicit `Need from Lucas` surface.

## Phase 5 — Topics workspace
- [ ] Build topic list and topic detail page.
- [ ] Seed Monday topics: CAQTUS Mapping, Error Budgets, Portfolio/Other topics.
- [ ] Add evidence links, latest update, open questions and next action.
- [ ] Add `Add to next 1:1`, `Needs Lucas decision`, `Ready to show`, `Not ready` actions.

## Phase 6 — Deliverables workspace
- [ ] Build deliverables list independent of topics.
- [ ] Support types: presentation, PDF, one-pager, dashboard, demo, notebook, report, chart, technical note, proposal, link.
- [ ] Add maturity state and readiness criteria.
- [ ] Add target meeting, audience, version, last update, missing dependencies and link/file location.
- [ ] Seed Monday candidate deliverables: CAQTUS Mapping mini-deck, Error Budgets V0 demo/review note, Portfolio Status one-pager.

## Phase 7 — Weekly meeting workflow
- [ ] Build agenda view for the next 1:1.
- [ ] Allow ordering topics/deliverables for the meeting.
- [ ] Add decisions/questions to obtain from Lucas.
- [ ] Add post-meeting notes and decisions.
- [ ] Carry unresolved items automatically into the following week.
- [ ] Archive shown deliverables with Lucas feedback.

## Phase 8 — Historical view
- [ ] Build meeting history list.
- [ ] Show what was presented, decisions taken, feedback and carry-over.
- [ ] Keep superseded deliverables accessible without cluttering current views.

## Phase 9 — Monday 2026-09-07 content
- [ ] CAQTUS Mapping: current state, authoritative-vs-to-validate separation, one prediction-to-test path, next alignment step.
- [ ] Error Budgets: current V0, what is real vs synthetic, traceability/SPECS-results status, exact review ask for Lucas.
- [ ] Portfolio: concise state of CAQTUS depumping, MAGMA, Kurdak/Paper Club and secondary items.
- [ ] Finalize `Need from Lucas` list.
- [ ] Mark only genuinely mature deliverables as Ready to show.

## Phase 10 — Validation and deployment
- [ ] Desktop visual smoke check.
- [ ] Mobile visual smoke check.
- [ ] Verify no login requirement.
- [ ] Verify no sensitive data is committed to the public UI repository.
- [ ] Verify local persistence survives reload.
- [ ] Verify weekly carry-over flow.
- [ ] Create/choose final dedicated repository.
- [ ] Transfer prototype from `joseluis` branch to final repo.
- [ ] Enable GitHub Pages and validate published URL.

## Definition of done for V1
At a glance, the Home page must answer:
1. When is the next 1:1?
2. What is mature enough to show?
3. What is still being prepared?
4. Which topics need Lucas to decide or validate something?
5. What changed since the previous 1:1?

A Topic is not a Deliverable. A Topic is a workstream; a Deliverable is a concrete object that can be opened and shown.