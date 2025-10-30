/**
 * Alert grouping utilities
 */

import { Alert, GroupedAlerts, CardConfig } from '../types';

/**
 * Severity levels in display order
 */
const SEVERITY_ORDER = ['critical', 'warning', 'info'];

/**
 * Groups alerts by severity level (critical, warning, info)
 * Creates empty groups for all severity levels
 * @param alerts Array of alerts to group
 * @returns Grouped alerts by severity
 */
export function groupAlertsBySeverity(alerts: Alert[]): GroupedAlerts {
  const grouped: GroupedAlerts = {};

  // Initialize empty groups for all severity levels
  SEVERITY_ORDER.forEach(severity => {
    grouped[severity] = [];
  });

  // Group alerts by their severity
  for (const alert of alerts) {
    if (!grouped[alert.severity]) {
      grouped[alert.severity] = [];
    }
    grouped[alert.severity].push(alert);
  }

  return grouped;
}

/**
 * Groups alerts by their group category (security, safety, etc.)
 * @param alerts Array of alerts to group
 * @returns Grouped alerts by category
 */
export function groupAlertsByGroup(alerts: Alert[]): GroupedAlerts {
  const grouped: GroupedAlerts = {};

  for (const alert of alerts) {
    const group = alert.group || 'other';
    if (!grouped[group]) {
      grouped[group] = [];
    }
    grouped[group].push(alert);
  }

  return grouped;
}

/**
 * Groups alerts by their status (active, acknowledged, escalated, cleared)
 * Creates predefined groups for all status types
 * @param alerts Array of alerts to group
 * @returns Grouped alerts by status
 */
export function groupAlertsByStatus(alerts: Alert[]): GroupedAlerts {
  const grouped: GroupedAlerts = {
    active: [],
    acknowledged: [],
    escalated: [],
    cleared: [],
  };

  for (const alert of alerts) {
    grouped[alert.status].push(alert);
  }

  return grouped;
}

/**
 * Groups all alerts into a single group
 * Used when group_by is 'none'
 * @param alerts Array of alerts
 * @returns All alerts in a single 'all' group
 */
export function groupAlertsNone(alerts: Alert[]): GroupedAlerts {
  return { all: alerts };
}

/**
 * Groups alerts based on configuration strategy
 * Delegates to specific grouping functions based on config.group_by
 * @param alerts Array of alerts to group
 * @param config Card configuration with grouping settings
 * @returns Grouped alerts according to strategy
 */
export function groupAlerts(alerts: Alert[], config: CardConfig): GroupedAlerts {
  switch (config.group_by) {
    case 'group':
      return groupAlertsByGroup(alerts);
    case 'status':
      return groupAlertsByStatus(alerts);
    case 'none':
      return groupAlertsNone(alerts);
    case 'severity':
    default:
      return groupAlertsBySeverity(alerts);
  }
}

/**
 * Gets the count of active alerts in a group
 * For status groups, returns total count; for others, counts only 'on' state alerts
 * @param alerts Array of alerts in the group
 * @param groupBy Grouping strategy being used
 * @returns Number of active/relevant alerts
 */
export function getGroupCount(alerts: Alert[], groupBy: string): number {
  if (groupBy === 'status') {
    // For status groups, show total count
    return alerts.length;
  }
  // For other grouping, show only active alerts (state === 'on')
  return alerts.filter(a => a.state === 'on').length;
}
