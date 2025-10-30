/**
 * Tests for alert grouping utilities
 */

import {
  groupAlertsBySeverity,
  groupAlertsByGroup,
  groupAlertsByStatus,
  groupAlertsNone,
  groupAlerts,
  getGroupCount,
} from '../../utils/groupers';
import { Alert, CardConfig } from '../../types';

describe('groupers', () => {
  const alert1: Alert = {
    entity_id: 'test1',
    name: 'Critical Alert',
    state: 'on',
    severity: 'critical',
    group: 'security',
    acknowledged: false,
    escalated: false,
    snoozed: false,
    resolved: false,
    status: 'active',
  };

  const alert2: Alert = {
    entity_id: 'test2',
    name: 'Warning Alert',
    state: 'on',
    severity: 'warning',
    group: 'safety',
    acknowledged: true,
    escalated: false,
    snoozed: false,
    resolved: false,
    status: 'acknowledged',
  };

  const alert3: Alert = {
    entity_id: 'test3',
    name: 'Info Alert',
    state: 'off',
    severity: 'info',
    group: 'security',
    acknowledged: false,
    escalated: false,
    snoozed: false,
    resolved: true,
    status: 'resolved',
  };

  describe('groupAlertsBySeverity', () => {
    test('groups alerts by severity level', () => {
      const alerts = [alert1, alert2, alert3];
      const grouped = groupAlertsBySeverity(alerts);

      expect(grouped.critical).toHaveLength(1);
      expect(grouped.warning).toHaveLength(1);
      expect(grouped.info).toHaveLength(1);
    });

    test('creates empty groups for all severity levels', () => {
      const alerts = [alert1]; // Only critical
      const grouped = groupAlertsBySeverity(alerts);

      expect(grouped.critical).toHaveLength(1);
      expect(grouped.warning).toHaveLength(0);
      expect(grouped.info).toHaveLength(0);
    });

    test('handles empty alerts array', () => {
      const grouped = groupAlertsBySeverity([]);

      expect(grouped.critical).toHaveLength(0);
      expect(grouped.warning).toHaveLength(0);
      expect(grouped.info).toHaveLength(0);
    });
  });

  describe('groupAlertsByGroup', () => {
    test('groups alerts by group category', () => {
      const alerts = [alert1, alert2, alert3];
      const grouped = groupAlertsByGroup(alerts);

      expect(grouped.security).toHaveLength(2);
      expect(grouped.safety).toHaveLength(1);
    });

    test('handles alerts without group', () => {
      const alertNoGroup = { ...alert1, group: '' as any };
      const grouped = groupAlertsByGroup([alertNoGroup]);

      expect(grouped.other).toHaveLength(1);
    });

    test('handles empty alerts array', () => {
      const grouped = groupAlertsByGroup([]);

      expect(Object.keys(grouped)).toHaveLength(0);
    });
  });

  describe('groupAlertsByStatus', () => {
    test('groups alerts by status', () => {
      const alerts = [alert1, alert2, alert3];
      const grouped = groupAlertsByStatus(alerts);

      expect(grouped.active).toHaveLength(1);
      expect(grouped.acknowledged).toHaveLength(1);
      expect(grouped.snoozed).toHaveLength(0);
      expect(grouped.escalated).toHaveLength(0);
      expect(grouped.resolved).toHaveLength(1);
    });

    test('creates empty groups for all status types', () => {
      const grouped = groupAlertsByStatus([alert1]);

      expect(grouped.active).toHaveLength(1);
      expect(grouped.acknowledged).toHaveLength(0);
      expect(grouped.snoozed).toHaveLength(0);
      expect(grouped.escalated).toHaveLength(0);
      expect(grouped.resolved).toHaveLength(0);
    });
  });

  describe('groupAlertsNone', () => {
    test('puts all alerts in a single group', () => {
      const alerts = [alert1, alert2, alert3];
      const grouped = groupAlertsNone(alerts);

      expect(grouped.all).toHaveLength(3);
      expect(Object.keys(grouped)).toHaveLength(1);
    });
  });

  describe('groupAlerts', () => {
    const baseConfig: CardConfig = {
      type: 'custom:emergency-alerts-card',
      group_by: 'severity',
    };

    test('groups by severity when configured', () => {
      const config = { ...baseConfig, group_by: 'severity' as const };
      const grouped = groupAlerts([alert1, alert2, alert3], config);

      expect(grouped.critical).toBeDefined();
      expect(grouped.warning).toBeDefined();
      expect(grouped.info).toBeDefined();
    });

    test('groups by group when configured', () => {
      const config = { ...baseConfig, group_by: 'group' as const };
      const grouped = groupAlerts([alert1, alert2, alert3], config);

      expect(grouped.security).toBeDefined();
      expect(grouped.safety).toBeDefined();
    });

    test('groups by status when configured', () => {
      const config = { ...baseConfig, group_by: 'status' as const };
      const grouped = groupAlerts([alert1, alert2, alert3], config);

      expect(grouped.active).toBeDefined();
      expect(grouped.acknowledged).toBeDefined();
    });

    test('groups in single group when none', () => {
      const config = { ...baseConfig, group_by: 'none' as const };
      const grouped = groupAlerts([alert1, alert2, alert3], config);

      expect(grouped.all).toHaveLength(3);
    });

    test('defaults to severity grouping', () => {
      const config = { ...baseConfig, group_by: undefined };
      const grouped = groupAlerts([alert1, alert2, alert3], config);

      expect(grouped.critical).toBeDefined();
    });
  });

  describe('getGroupCount', () => {
    const alerts = [alert1, alert2, alert3]; // 2 'on', 1 'off'

    test('returns total count for status grouping', () => {
      expect(getGroupCount(alerts, 'status')).toBe(3);
    });

    test('returns active alert count for other grouping', () => {
      expect(getGroupCount(alerts, 'severity')).toBe(2);
      expect(getGroupCount(alerts, 'group')).toBe(2);
      expect(getGroupCount(alerts, 'none')).toBe(2);
    });

    test('returns 0 for empty group', () => {
      expect(getGroupCount([], 'severity')).toBe(0);
    });
  });
});
