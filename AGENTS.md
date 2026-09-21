## Agent skills

### Issue tracker

Issues are tracked in GitHub. See backend `ineascents-backend/docs/agents/issue-tracker.md`.

### Triage labels

Using the default triage labels. See backend `ineascents-backend/docs/agents/triage-labels.md`.

### Domain docs

Domain docs use a single-context layout. See backend `ineascents-backend/docs/agents/domain.md`.

## Standing rules

- Conventional Commits, terse, no attribution. Push only on explicit owner approval.
- Inquiry contract: `POST /api/inquiries` shape + `throttle:10,1` compatible; landing creates Inquiries only, never Bookings.
- Terms per workspace `CONTEXT.md` (Inquiry, Signature Collection). Visual tokens per workspace `DESIGN.md`.
