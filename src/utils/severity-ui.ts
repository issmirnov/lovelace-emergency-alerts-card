/**
 * Severity-aware UI predicates.
 *
 * The integration (v4.4.0+) treats info-severity alerts as ambient: they
 * auto-clear when the underlying trigger flips, and the select option list
 * drops `snoozed` + `escalated` for them. The card mirrors that policy here
 * so the buttons and badges match what the underlying state machine can
 * actually produce.
 *
 * Keeping these as pure functions (not class methods) so we can unit-test
 * the policy in isolation from the card's Lit rendering.
 */
import type { Alert } from '../types';

/**
 * Should the snooze button be visible for this alert?
 *
 * False for info severity — those alerts can't enter the snoozed state
 * (the integration's INFO_ALERT_STATES doesn't include it), so a snooze
 * button would silently do nothing on click.
 */
export function shouldShowSnoozeButton(alert: Alert): boolean {
  return alert.severity !== 'info';
}

/**
 * Should the ⚠️ escalated badge render for this alert?
 *
 * Requires both: the alert reports escalated=true AND severity is not info.
 * Info alerts can't escalate in v4.4.0+, but a pre-upgrade alert may still
 * have a stale escalated=true attribute lying around — don't render a
 * misleading badge on an ambient card.
 */
export function shouldShowEscalatedBadge(alert: Alert): boolean {
  return alert.escalated && alert.severity !== 'info';
}
