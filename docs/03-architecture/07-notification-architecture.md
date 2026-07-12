# Notification Architecture

## 1. Design Principle

No business module sends email/SMS/push directly. Every module emits a domain event
(e.g., `case.status_changed`, `document.requested`, `payment.received`,
`transfer.assigned`) onto the internal event bus (`03-backend-api-architecture.md` §5);
the **Notification Module** subscribes to the events relevant to it, resolves the
recipient(s), their channel preferences, and locale, and dispatches through the
appropriate provider. This keeps template content, channel logic, and delivery
provider integration in one place instead of scattered across every module
(FR-NOTIF-01 through FR-NOTIF-04).

## 2. Channels & Providers

| Channel | Provider | Usage |
|---|---|---|
| Email (transactional) | Resend | Account verification, status changes, payment confirmations, document requests — default channel for all P0 notification types |
| SMS | Twilio or regional provider (market-dependent) | Time-sensitive events only (transfer confirmed, visa document ready) — P1, added after email pipeline is proven |
| In-app | Internal (`notifications` table + read state) | Mirrors every email notification so nothing is channel-exclusive; primary surface for the Notification Center screen (Screen 35) |
| Push (P2) | Deferred until a mobile app exists | N/A at launch |

## 3. Event → Notification Mapping (representative, not exhaustive)

| Event | Recipient(s) | Channel(s) |
|---|---|---|
| `case.submitted` | Hospital Staff (assigned department) | Email + in-app |
| `case.status_changed` | Patient | Email + in-app (+ SMS if status is time-critical, e.g., `Accepted`) |
| `case.manager_assigned` | Patient | Email + in-app |
| `message.new` | Recipient of the message | In-app immediately; email digest if unread after 1 hour |
| `document.requested` | Patient | Email + in-app |
| `document.verified` / `document.rejected` | Patient | Email + in-app |
| `payment.due` | Patient | Email + in-app, reminder at T-3 days if unpaid |
| `payment.received` | Patient, Admin (for reconciliation) | Email (receipt) + in-app |
| `transfer.assigned` | Patient, Driver | Email/SMS + in-app |
| `sla.breach_risk` | Case Manager, Admin | In-app + email (internal-only event, not patient-facing) |

## 4. Templates

- Templates are stored server-side (not hardcoded per-call strings), versioned, and
  localized per supported locale — a template lookup takes `(event_type, locale)` and
  falls back to the platform default locale (`en`) if a translation is missing, logging
  the gap for content-team follow-up rather than failing the send.
- Legally sensitive templates (invitation letters, payment receipts, refund
  confirmations) go through the same templating engine but are treated as
  admin-editable-only content, not marketing-editable, given their compliance
  significance.

## 5. Delivery Reliability

- Notification dispatch runs through the background job queue
  (`03-backend-api-architecture.md` §6), not inline in the request path, so a slow or
  failing email provider never blocks the triggering user action (e.g., submitting an
  application doesn't wait on the notification email actually sending).
- Failed sends retry with backoff; persistent failures surface to Observability
  (`08-observability.md`) rather than failing silently, since a silently-undelivered
  "visa document ready" notification has real patient-facing consequences.

## 6. User Preferences

- Per FR-NOTIF-04, users can configure channel preference per notification category
  (e.g., "Messages: in-app only, no email") from the Notification Preferences screen
  (Screen 36) — but security- and compliance-critical notifications (password reset,
  payment confirmations) are never fully suppressible, only their non-essential channel
  variants are.
