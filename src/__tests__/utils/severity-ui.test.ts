import { shouldShowSnoozeButton, shouldShowEscalatedBadge } from '../../utils/severity-ui';
import type { Alert } from '../../types';

function makeAlert(overrides: Partial<Alert> = {}): Alert {
  return {
    entity_id: 'binary_sensor.emergency_test',
    name: 'Test',
    state: 'on',
    severity: 'warning',
    group: 'other',
    acknowledged: false,
    escalated: false,
    snoozed: false,
    resolved: false,
    status: 'active',
    ...overrides,
  } as Alert;
}

describe('shouldShowSnoozeButton', () => {
  test('shows for warning severity', () => {
    expect(shouldShowSnoozeButton(makeAlert({ severity: 'warning' }))).toBe(true);
  });

  test('shows for critical severity', () => {
    expect(shouldShowSnoozeButton(makeAlert({ severity: 'critical' }))).toBe(true);
  });

  test('hides for info severity (ambient, auto-clears)', () => {
    expect(shouldShowSnoozeButton(makeAlert({ severity: 'info' }))).toBe(false);
  });

  test('is severity-driven only — not affected by current snoozed state', () => {
    // Even if a pre-upgrade info alert had snoozed=true lying around, the
    // button should still hide because the integration won't honor a snooze
    // service call against an info alert anyway.
    expect(shouldShowSnoozeButton(makeAlert({ severity: 'info', snoozed: true }))).toBe(false);
  });
});

describe('shouldShowEscalatedBadge', () => {
  test('shows when warning alert is escalated', () => {
    expect(shouldShowEscalatedBadge(makeAlert({ severity: 'warning', escalated: true }))).toBe(true);
  });

  test('shows when critical alert is escalated', () => {
    expect(shouldShowEscalatedBadge(makeAlert({ severity: 'critical', escalated: true }))).toBe(true);
  });

  test('hidden when alert is not escalated', () => {
    expect(shouldShowEscalatedBadge(makeAlert({ escalated: false }))).toBe(false);
  });

  test('hidden for info severity even if escalated=true (stale attribute)', () => {
    // Regression: a pre-v4.4.0 install could have escalated=true on an info
    // alert from before we restricted escalation. Don't render a misleading
    // badge on an ambient card.
    expect(shouldShowEscalatedBadge(makeAlert({ severity: 'info', escalated: true }))).toBe(false);
  });
});
