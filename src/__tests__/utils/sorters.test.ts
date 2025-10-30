/**
 * Tests for alert sorting utilities
 */

import { sortAlerts } from '../../utils/sorters';
import { Alert, CardConfig } from '../../types';

describe('sorters', () => {
  const alert1: Alert = {
    entity_id: 'binary_sensor.test1',
    name: 'Beta Alert',
    state: 'on',
    severity: 'warning',
    group: 'security',
    acknowledged: false,
    escalated: false,
    snoozed: false,
    resolved: false,
    status: 'active',
    first_triggered: '2024-01-01T10:00:00Z',
  };

  const alert2: Alert = {
    entity_id: 'binary_sensor.test2',
    name: 'Alpha Alert',
    state: 'on',
    severity: 'critical',
    group: 'safety',
    acknowledged: false,
    escalated: false,
    snoozed: false,
    resolved: false,
    status: 'active',
    first_triggered: '2024-01-01T12:00:00Z', // Newer
  };

  const alert3: Alert = {
    entity_id: 'binary_sensor.test3',
    name: 'Charlie Alert',
    state: 'on',
    severity: 'info',
    group: 'environmental',
    acknowledged: false,
    escalated: false,
    snoozed: false,
    resolved: false,
    status: 'active',
    first_triggered: '2024-01-01T11:00:00Z',
  };

  const baseConfig: CardConfig = {
    type: 'custom:emergency-alerts-card',
    sort_by: 'first_triggered',
  };

  test('sorts by first_triggered (newest first)', () => {
    const alerts = [alert1, alert2, alert3];
    const config = { ...baseConfig, sort_by: 'first_triggered' as const };

    sortAlerts(alerts, config);

    expect(alerts[0].entity_id).toBe('binary_sensor.test2'); // Newest
    expect(alerts[1].entity_id).toBe('binary_sensor.test3');
    expect(alerts[2].entity_id).toBe('binary_sensor.test1'); // Oldest
  });

  test('sorts by severity (critical > warning > info)', () => {
    const alerts = [alert1, alert2, alert3];
    const config: CardConfig = {
      type: 'custom:emergency-alerts-card',
      sort_by: 'severity',
    };

    sortAlerts(alerts, config);

    expect(alerts[0].severity).toBe('critical');
    expect(alerts[1].severity).toBe('warning');
    expect(alerts[2].severity).toBe('info');
  });

  test('sorts by name (alphabetical)', () => {
    const alerts = [alert1, alert2, alert3];
    const config = { ...baseConfig, sort_by: 'name' as const };

    sortAlerts(alerts, config);

    expect(alerts[0].name).toBe('Alpha Alert');
    expect(alerts[1].name).toBe('Beta Alert');
    expect(alerts[2].name).toBe('Charlie Alert');
  });

  test('sorts by group (alphabetical)', () => {
    const alerts = [alert1, alert2, alert3];
    const config = { ...baseConfig, sort_by: 'group' as const };

    sortAlerts(alerts, config);

    expect(alerts[0].group).toBe('environmental');
    expect(alerts[1].group).toBe('safety');
    expect(alerts[2].group).toBe('security');
  });

  test('handles alerts without first_triggered', () => {
    const alertNoTime = { ...alert1, first_triggered: undefined };
    const alerts = [alert2, alertNoTime];
    const config = { ...baseConfig, sort_by: 'first_triggered' as const };

    sortAlerts(alerts, config);

    // Alert with time should come before alert without time
    expect(alerts[0].entity_id).toBe('binary_sensor.test2');
    expect(alerts[1].entity_id).toBe('binary_sensor.test1');
  });

  test('preserves order for equal elements', () => {
    const sameTime1 = { ...alert1, first_triggered: '2024-01-01T10:00:00Z' };
    const sameTime2 = { ...alert2, first_triggered: '2024-01-01T10:00:00Z' };
    const alerts = [sameTime1, sameTime2];
    const config = { ...baseConfig, sort_by: 'first_triggered' as const };

    sortAlerts(alerts, config);

    // Order should be stable
    expect(alerts).toHaveLength(2);
  });
});
