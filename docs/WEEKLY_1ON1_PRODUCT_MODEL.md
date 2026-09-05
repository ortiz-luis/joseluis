# Weekly 1:1 Preparation — product model V1

## Permanent navigation

1. **Inicio** — next 1:1 cockpit.
2. **Próximo 1:1** — agenda, order, asks and showable material for the next meeting.
3. **Temas** — persistent workstreams across weeks.
4. **Entregables** — concrete objects that can be opened and shown.
5. **Histórico** — previous meetings, what was shown, Lucas feedback, decisions and carry-over.

Desktop uses sidebar navigation; mobile uses bottom navigation with the same destinations.

---

## 1. Topic object

A Topic is a persistent workstream. It is **not** itself something shown in the meeting.

```js
{
  id,
  title,
  summary,
  status,                 // active | waiting | blocked | low-priority | closed
  priority,               // high | medium | low
  latestUpdate,
  lastUpdated,
  evidence: [{label, url, kind}],
  nextAction,
  openQuestions: [],
  needFromLucas,
  includeInNext1on1,
  relatedDeliverableIds: [],
  notes
}
```

V1 seed topics:
- CAQTUS Mapping
- Error Budgets
- Portfolio / Other topics
- CAQTUS Depumping
- MAGMA
- Paper Club / Kurdak

---

## 2. Deliverable object

A Deliverable is a concrete object that can be opened, shown, reviewed or sent.

```js
{
  id,
  title,
  topicId,
  type,                    // presentation | pdf | one-pager | dashboard | demo | notebook | report | chart | technical-note | proposal | link
  maturity,                // work-in-progress | candidate | ready-to-show | shown-reviewed | archived-superseded
  version,
  targetMeetingId,
  audience: [],
  objective,
  readinessCriteria: [{label, done}],
  missingDependencies: [],
  link,
  lastUpdated,
  reviewAsk,
  shownHistory: [{meetingId, feedback, decision}]
}
```

### Maturity semantics

**Work in progress**
Useful work exists, but it should not yet consume meeting time.

**Candidate**
Close enough that a small amount of work could make it showable.

**Ready to show**
Can be opened in front of Lucas now. Its purpose and desired review/decision are explicit.

**Shown / reviewed**
Was actually presented or reviewed. Lucas feedback/decision is recorded.

**Archived / superseded**
Kept for traceability but removed from current attention.

---

## 3. Weekly meeting object

```js
{
  id,                       // e.g. 2026-09-07
  date,
  manager: 'Lucas',
  status,                   // preparing | ready | completed
  agendaItems: [
    {kind: 'topic'|'deliverable', id, order, plannedMinutes}
  ],
  asks: [decisionRequestId],
  mentionOnlyTopicIds: [],
  notesBefore,
  notesAfter,
  decisions: [],
  carryOverIds: []
}
```

The next meeting is the focal object on Home.

---

## 4. Decision / request object

```js
{
  id,
  meetingId,
  topicId,
  deliverableId,
  question,
  whyNow,
  desiredOutcome,
  status,                   // planned | asked | answered | deferred
  answer,
  followUp
}
```

This keeps the meeting outcome-oriented: every major item should ideally have a clear `Need from Lucas`.

---

## 5. Carry-over rules

After a meeting:

1. Mark actually shown deliverables as `shown-reviewed`.
2. Record Lucas feedback and decisions.
3. Any unresolved decision becomes a follow-up item.
4. Topics remain persistent unless explicitly closed.
5. Candidate deliverables remain candidates unless superseded.
6. Items not discussed do not automatically become urgent.
7. The next weekly meeting is created from unresolved high-value items, not by blindly copying the full agenda.

---

## 6. Home information architecture

### A. Next 1:1
- meeting date
- readiness state
- number of planned showable deliverables
- number of explicit asks for Lucas

### B. Ready for next 1:1
Only `ready-to-show` deliverables targeted to the next meeting.

### C. Still cooking
`candidate` deliverables that could become useful but are not yet ready.

### D. Needs Lucas
Explicit decision/request cards.

### E. Topics
Compact overview of only the topics relevant to the next meeting.

### F. Since last 1:1
A short list of meaningful changes, not an activity feed.

---

## 7. Next 1:1 page

The page should answer, in order:
1. What are we opening first?
2. What concrete deliverables will be shown?
3. What does Luis want Lucas to decide/review?
4. What should only be mentioned briefly?
5. What is intentionally not being shown yet?

Recommended meeting sections:
- Main item 1
- Main item 2
- Portfolio / mentions
- Decisions / asks
- Post-meeting notes

---

## 8. Monday 2026-09-07 seed

### Main item 1 — CAQTUS Mapping
Deliverable candidate:
- `CAQTUS Mapping — Processing alignment mini-deck`
- type: presentation
- maturity target: ready-to-show
- objective: show current understanding, separate confirmed/to-validate, and propose one simulation → observable → test path.
- need from Lucas: confirm direction and alignment sequence with Julien/System Performance.

### Main item 2 — Error Budgets
Deliverable candidate:
- `Error Budgets V0 — live dashboard + review note`
- type: dashboard
- maturity target: ready-to-show
- objective: show real V0 structure and ask whether the direction is correct before scaling.
- need from Lucas: direction review.

### Portfolio
Deliverable candidate:
- `Weekly portfolio status — 2026-09-07`
- type: one-pager
- maturity target: candidate/ready-to-show depending final update.
- objective: cover secondary workstreams quickly.

---

## V1 product rule

The system must never confuse activity with readiness.

A lot of work can exist inside a Topic while there is still **nothing mature enough to show**. Conversely, one mature Deliverable can justify meeting time even if the underlying Topic is not globally finished.