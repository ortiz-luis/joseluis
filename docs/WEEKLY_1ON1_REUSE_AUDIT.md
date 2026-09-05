# Weekly 1:1 prototype — reuse audit

## Keep almost as-is

### UX shell
- Desktop sidebar + mobile bottom navigation.
- Hash-based routing.
- Low-attention visual hierarchy.
- Large clickable rows/cards.
- Progressive disclosure instead of dense dashboards.
- Calm-by-default state with urgency only when justified.

### Client-side architecture
- Static HTML/CSS/JS structure suitable for GitHub Pages.
- Browser `localStorage` persistence for V1.
- Small state object with migrate/save/render cycle.
- Reusable list/detail pattern from Opportunities -> Topics.
- Reusable row/card patterns from Documents/Opportunities -> Deliverables.

### Interaction patterns
- Compact filters/chips.
- One dominant next-action card.
- Whole-row navigation targets.
- Silent autosave.
- Mobile-friendly non-tabular detail views.

## Adapt

### Opportunities -> Topics
Reuse lifecycle/list/detail mechanics, but replace job-application concepts with weekly workstreams.

Topic fields should include:
- id
- title
- status
- latestUpdate
- evidence[]
- nextAction
- openQuestions[]
- needFromLucas
- includeInNext1on1
- relatedDeliverableIds[]

### Documents -> Deliverables
Reuse list/category/detail mechanics, but model concrete showable outputs instead of a dossier wallet.

Deliverable fields should include:
- id
- title
- topicId
- type
- maturity
- version
- targetMeeting
- audience
- readinessCriteria[]
- missingDependencies[]
- link
- lastUpdated
- shownHistory[]

Maturity states:
1. work-in-progress
2. candidate
3. ready-to-show
4. shown-reviewed
5. archived-superseded

### Home -> Next 1:1 cockpit
Replace counts of applications/documents/new items with:
- next meeting date
- Ready for next 1:1
- Still cooking
- Needs Lucas
- compact topic readiness overview
- changes since last 1:1

## Remove from the prototype

- Authentication/login gate.
- Account/session controls.
- Workspace admin layer.
- Opportunity radar and job-specific seed data.
- Application requirements and dossier-specific guidance.
- Gmail-prefill and application-specific helpers.
- Private document backend/upload flows not needed for V1.
- Opportunity-specific admin/catalog sync modules.

## Keep out of Git

The UI repository can remain public only if it contains no confidential PASQAL material. V1 should store meeting content in browser-local state or use sanitized/demo seed data. Any future shared/private persistence must live behind a private backend or private repository/service.

## Migration strategy

Do not rewrite the app from zero. Start from the existing shell and replace the domain model in this order:
1. state/schema
2. navigation
3. Home
4. Topic list/detail
5. Deliverables list/detail
6. weekly meeting workflow
7. history
8. cleanup of obsolete scripts/styles

This preserves the visual behavior already accepted in `joseluis` while minimizing regression risk.