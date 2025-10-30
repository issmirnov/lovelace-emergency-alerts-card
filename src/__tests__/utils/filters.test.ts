/**
 * Tests for alert filtering utilities
 */

import { shouldShowAlert, matchesEntityPattern } from '../../utils/filters';
import { Alert, CardConfig } from '../../types';

describe('filters', () => {
  describe('shouldShowAlert', () => {
    const baseAlert: Alert = {
      entity_id: 'binary_sensor.test',
      name: 'Test Alert',
      state: 'on',
      severity: 'critical',
      group: 'security',
      acknowledged: false,
      escalated: false,
      snoozed: false,
      resolved: false,
      status: 'active',
    };

    const baseConfig: CardConfig = {
      type: 'custom:emergency-alerts-card',
      severity_filter: ['critical', 'warning', 'info'],
      group_filter: [],
      status_filter: ['active', 'acknowledged', 'escalated', 'snoozed'],
      show_acknowledged: true,
      show_snoozed: true,
      show_resolved: false,
      show_escalated: true,
    };

    test('shows alert when all filters pass', () => {
      expect(shouldShowAlert(baseAlert, baseConfig)).toBe(true);
    });

    test('filters by severity', () => {
      const config = { ...baseConfig, severity_filter: ['warning', 'info'] };
      expect(shouldShowAlert(baseAlert, config)).toBe(false);

      const config2 = { ...baseConfig, severity_filter: ['critical'] };
      expect(shouldShowAlert(baseAlert, config2)).toBe(true);
    });

    test('filters by group', () => {
      const config = { ...baseConfig, group_filter: ['safety'] };
      expect(shouldShowAlert(baseAlert, config)).toBe(false);

      const config2 = { ...baseConfig, group_filter: ['security', 'safety'] };
      expect(shouldShowAlert(baseAlert, config2)).toBe(true);
    });

    test('filters by status', () => {
      const config = { ...baseConfig, status_filter: ['acknowledged'] };
      expect(shouldShowAlert(baseAlert, config)).toBe(false);

      const config2 = { ...baseConfig, status_filter: ['active'] };
      expect(shouldShowAlert(baseAlert, config2)).toBe(true);
    });

    test('filters acknowledged alerts when show_acknowledged is false', () => {
      const acknowledgedAlert = { ...baseAlert, acknowledged: true };
      const config = { ...baseConfig, show_acknowledged: false };
      expect(shouldShowAlert(acknowledgedAlert, config)).toBe(false);
    });

    test('filters snoozed alerts when show_snoozed is false', () => {
      const snoozedAlert = { ...baseAlert, snoozed: true };
      const config = { ...baseConfig, show_snoozed: false };
      expect(shouldShowAlert(snoozedAlert, config)).toBe(false);

      const config2 = { ...baseConfig, show_snoozed: true };
      expect(shouldShowAlert(snoozedAlert, config2)).toBe(true);
    });

    test('filters resolved alerts when show_resolved is false', () => {
      const resolvedAlert = { ...baseAlert, resolved: true };
      expect(shouldShowAlert(resolvedAlert, baseConfig)).toBe(false);

      const config = { ...baseConfig, show_resolved: true };
      expect(shouldShowAlert(resolvedAlert, config)).toBe(true);
    });

    test('filters escalated alerts when show_escalated is false', () => {
      const escalatedAlert = { ...baseAlert, escalated: true };
      const config = { ...baseConfig, show_escalated: false };
      expect(shouldShowAlert(escalatedAlert, config)).toBe(false);
    });

    test('combines multiple filters', () => {
      const alert: Alert = {
        ...baseAlert,
        severity: 'warning' as const,
        group: 'safety' as const,
        acknowledged: true,
      };

      const config = {
        ...baseConfig,
        severity_filter: ['warning'],
        group_filter: ['safety'],
        show_acknowledged: true,
      };

      expect(shouldShowAlert(alert, config)).toBe(true);
    });
  });

  describe('matchesEntityPattern', () => {
    test('matches exact entity ID', () => {
      const patterns = ['binary_sensor.test'];
      expect(matchesEntityPattern('binary_sensor.test', patterns)).toBe(true);
      expect(matchesEntityPattern('binary_sensor.other', patterns)).toBe(false);
    });

    test('matches wildcard patterns', () => {
      const patterns = ['binary_sensor.emergency_*'];
      expect(matchesEntityPattern('binary_sensor.emergency_fire', patterns)).toBe(true);
      expect(matchesEntityPattern('binary_sensor.emergency_water', patterns)).toBe(true);
      expect(matchesEntityPattern('binary_sensor.other', patterns)).toBe(false);
    });

    test('matches multiple patterns', () => {
      const patterns = ['binary_sensor.emergency_*', 'binary_sensor.alert_*'];
      expect(matchesEntityPattern('binary_sensor.emergency_fire', patterns)).toBe(true);
      expect(matchesEntityPattern('binary_sensor.alert_leak', patterns)).toBe(true);
      expect(matchesEntityPattern('binary_sensor.other', patterns)).toBe(false);
    });

    test('uses pattern cache for performance', () => {
      const patterns = ['binary_sensor.emergency_*'];
      const cache = new Map<string, RegExp>();

      expect(matchesEntityPattern('binary_sensor.emergency_fire', patterns, cache)).toBe(true);
      expect(cache.size).toBe(1);

      // Second call should use cached regex
      expect(matchesEntityPattern('binary_sensor.emergency_water', patterns, cache)).toBe(true);
      expect(cache.size).toBe(1); // Cache size unchanged
    });

    test('matches complex wildcard patterns', () => {
      const patterns = ['*.emergency_*'];
      expect(matchesEntityPattern('binary_sensor.emergency_fire', patterns)).toBe(true);
      expect(matchesEntityPattern('sensor.emergency_temp', patterns)).toBe(true);
    });
  });
});
