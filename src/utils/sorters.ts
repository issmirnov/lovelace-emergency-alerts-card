/**
 * Alert sorting utilities
 */

import { Alert, CardConfig } from '../types';

/**
 * Severity order for sorting (critical > warning > info)
 */
const SEVERITY_ORDER: Record<string, number> = {
  critical: 0,
  warning: 1,
  info: 2,
};

/**
 * Sorts alerts in-place based on configuration
 * Supports sorting by first_triggered (newest first), severity, name, or group
 * @param alerts Array of alerts to sort (modified in-place)
 * @param config Card configuration with sort settings
 */
export function sortAlerts(alerts: Alert[], config: CardConfig): void {
  alerts.sort((a, b) => {
    switch (config.sort_by) {
      case 'first_triggered': {
        // Sort by time, newest first
        const aTime = a.first_triggered ? new Date(a.first_triggered).getTime() : 0;
        const bTime = b.first_triggered ? new Date(b.first_triggered).getTime() : 0;
        return bTime - aTime;
      }
      case 'severity': {
        // Sort by severity (critical, warning, info)
        // Note: Must check for undefined explicitly since critical=0 is falsy
        const aOrder = SEVERITY_ORDER[a.severity] !== undefined ? SEVERITY_ORDER[a.severity] : 3;
        const bOrder = SEVERITY_ORDER[b.severity] !== undefined ? SEVERITY_ORDER[b.severity] : 3;
        return aOrder - bOrder;
      }
      case 'name':
        // Alphabetical by name
        return a.name.localeCompare(b.name);
      case 'group':
        // Alphabetical by group
        return a.group.localeCompare(b.group);
      default:
        return 0;
    }
  });
}
