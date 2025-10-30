/**
 * Formatting utilities for Emergency Alerts Card
 */

/**
 * Formats an ISO timestamp into a human-readable "time ago" string
 * @param iso ISO 8601 timestamp string
 * @returns Formatted string like "5m ago" or "2h ago"
 */
export function formatTimeAgo(iso: string): string {
  if (!iso) return '';

  const now = new Date();
  const then = new Date(iso);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMins / 60);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  return `${diffHours}h ago`;
}

/**
 * Gets the Material Design icon name for a severity level
 * @param severity Alert severity level
 * @returns MDI icon name
 */
export function getSeverityIcon(severity: string): string {
  switch (severity) {
    case 'critical':
      return 'mdi:alert-circle';
    case 'warning':
      return 'mdi:alert';
    case 'info':
      return 'mdi:information';
    default:
      return 'mdi:help-circle';
  }
}

/**
 * Gets the color hex code for a severity level
 * @param severity Alert severity level
 * @returns Hex color code
 */
export function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'critical':
      return '#f44336';
    case 'warning':
      return '#ff9800';
    case 'info':
      return '#2196f3';
    default:
      return '#9e9e9e';
  }
}

/**
 * Capitalizes the first letter of a string
 * @param str Input string
 * @returns Capitalized string
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Gets a human-readable title for a group
 * @param group Group name
 * @param groupBy Grouping strategy being used
 * @returns Formatted group title
 */
export function getGroupTitle(group: string, groupBy: string): string {
  if (groupBy === 'none') {
    return 'All Alerts';
  }
  return capitalize(group);
}

/**
 * Formats snooze_until timestamp into a static display (v2.0)
 * @param snooze_until ISO 8601 timestamp when snooze expires
 * @returns Formatted string like "until 2:30 PM" or empty if not snoozed
 */
export function formatSnoozeTime(snooze_until?: string): string {
  if (!snooze_until) return '';

  const snoozeDate = new Date(snooze_until);
  const timeStr = snoozeDate.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });

  return `until ${timeStr}`;
}
