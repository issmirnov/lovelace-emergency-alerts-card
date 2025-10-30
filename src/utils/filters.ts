/**
 * Alert filtering utilities
 */

import { Alert, CardConfig } from '../types';

/**
 * Determines if an alert should be displayed based on configuration filters
 * Applies severity, group, and status filters in sequence
 * @param alert The alert to check
 * @param config Card configuration with filter settings
 * @returns true if alert should be displayed, false otherwise
 */
export function shouldShowAlert(alert: Alert, config: CardConfig): boolean {
  // Severity filter - only show configured severity levels
  if (config.severity_filter && !config.severity_filter.includes(alert.severity)) {
    return false;
  }

  // Group filter - only show alerts from specified groups (if filter is set)
  if (
    config.group_filter &&
    config.group_filter.length > 0 &&
    !config.group_filter.includes(alert.group)
  ) {
    return false;
  }

  // Status filter - only show alerts with specified statuses
  if (config.status_filter && !config.status_filter.includes(alert.status)) {
    return false;
  }

  // Individual status toggles - these override status_filter for specific states
  if (!config.show_acknowledged && alert.acknowledged) return false;
  if (!config.show_cleared && alert.cleared) return false;
  if (!config.show_escalated && alert.escalated) return false;

  return true;
}

/**
 * Determines if an entity matches any of the configured patterns
 * Supports wildcard patterns (e.g., "binary_sensor.emergency_*")
 * @param entityId Entity ID to check
 * @param patterns Array of patterns (can include wildcards)
 * @param patternCache Optional cache for compiled regex patterns
 * @returns true if entity matches any pattern
 */
export function matchesEntityPattern(
  entityId: string,
  patterns: string[],
  patternCache?: Map<string, RegExp>
): boolean {
  return patterns.some(pattern => {
    if (pattern.includes('*')) {
      // Use cached regex if available, otherwise compile and cache
      let regex: RegExp;
      if (patternCache && patternCache.has(pattern)) {
        regex = patternCache.get(pattern)!;
      } else {
        regex = new RegExp(pattern.replace(/\*/g, '.*'));
        if (patternCache) {
          patternCache.set(pattern, regex);
        }
      }
      return regex.test(entityId);
    }
    return entityId === pattern;
  });
}
