# Project status — José Luis portal

## V2 — low-attention app UX

### Product contract
- [x] Treat the portal as an app, not an information-heavy website.
- [x] Home is designed to be understandable with very low attention.
- [x] No explanatory paragraphs on the main screens.
- [x] Progressive disclosure: details appear only after entering or requesting them.
- [x] Whole cards/rows are interaction targets where appropriate.
- [x] Calm state is visually dominant; urgency appears only when real.
- [x] Desktop keeps familiar sidebar navigation.
- [x] Mobile keeps familiar bottom navigation.
- [x] Maximum four permanent destinations: Inicio, Oportunidades, Documentos, Perfil.

### Home
- [x] Single dominant state: `Todo al día` or a real upcoming deadline.
- [x] Only three primary objects: Procesos, Documentos, Nuevas.
- [x] No activity feed.
- [x] No charts.
- [x] No completion percentages.
- [x] No repeated `Ver ...` call-to-action text; cards themselves are clickable.
- [x] Deadline is secondary unless it becomes urgent.

### Opportunities
- [x] Compact list with at most two descriptive lines per item.
- [x] One opportunity object follows the whole lifecycle.
- [x] Filters are compact chips.
- [x] Full row is clickable.
- [x] Primary list avoids funding/deadline/status columns competing simultaneously.
- [x] Manual opportunity creation remains available with one `+` control.

### Opportunity detail
- [x] First view prioritizes title, country, funding and deadline.
- [x] Ready / Easy / To solve shown as three small state counters.
- [x] A single `Siguiente` card exposes the next useful task.
- [x] All detailed requirements are hidden behind `Detalles`.
- [x] Ready requirements are not visually dominant.
- [x] English and motivation-letter actions remain contextual microflows.
- [x] Status editing remains available inside expanded details.

### Documents
- [x] Files/Wallet-style category list.
- [x] Categories show only label and count.
- [x] Search remains available.
- [x] Upload is one `+` action.
- [x] Duplicate avoidance metadata remains in the client model.
- [x] No storage statistics or document-dashboard clutter.

### Profile
- [x] Profile is a short list of reusable data blocks.
- [x] Edit is one compact action.
- [x] No completeness percentage.
- [x] CV starter generation remains available.

### Interaction and language
- [x] `Action needed` replaced by `Por resolver`.
- [x] `Easy fix` replaced by `Fácil`.
- [x] `Ready` displayed as `Listo`.
- [x] Auto-save remains silent and non-blocking.
- [x] No optional field blocks saving.
- [x] Large click/tap targets are used for rows and cards.
- [x] Mobile layout avoids horizontal information tables.

### Validation
- [x] JavaScript syntax validation in GitHub Actions.
- [x] Static-file smoke checks.
- [x] CI checks the v2 low-attention contract.
- [x] CI explicitly guards against reintroducing `Actividad reciente` and old explanatory Home copy.
- [x] Latest CI run is green after final v2 commit.
- [x] Latest GitHub Pages deployment is green after final v2 commit.
- [ ] Human visual check on desktop.
- [ ] Human visual check on mobile.

## Functional safety backlog — not solved by visual simplification

### Browser-private document layer
- [ ] Store actual uploaded file blobs in IndexedDB.
- [ ] SHA-256 duplicate detection.
- [ ] Local preview/download.
- [ ] Explicit current-version controls.

### Real radar data
- [ ] Replace generic seed entries with exact verified opportunities.
- [ ] Verify primary-source URL, deadline, funding and eligibility.
- [ ] Extract exact required documents and language rules.

### Production / multi-device
- [ ] Authentication.
- [ ] Private encrypted object storage.
- [ ] Private database.
- [ ] Cross-device sync.
- [ ] Separate radar/admin actions from José Luis actions.
- [ ] Backups and recovery.

## V2 visual definition of done
The UX is accepted when José Luis can, at a glance:
1. know whether anything is urgent;
2. see how many processes and documents exist;
3. notice whether there are new opportunities;
4. enter any of those areas with one obvious click/tap;
5. identify the next unresolved requirement in an opportunity without reading explanatory prose.
