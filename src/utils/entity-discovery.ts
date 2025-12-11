/**
 * Entity discovery and status utilities
 */

import {
  HassEntity,
  HassEntities,
  Alert,
  AlertStatus,
  EmergencyAlertEntity,
  Severity,
  AlertGroup,
} from '../types';
import { matchesEntityPattern } from './filters';

/**
 * Determines the current status of an alert based on its attributes (v2.0)
 * Priority: resolved > escalated > snoozed > acknowledged > active > inactive
 * @param entity Emergency alert entity
 * @returns Current alert status
 */
export function getAlertStatus(entity: HassEntity): AlertStatus {
  const attrs = entity.attributes;

  // If entity itself is off/inactive, treat as inactive regardless of flags
  if (entity.state !== 'on') {
    return 'inactive';
  }

  if (attrs.resolved) return 'resolved';
  if (attrs.escalated) return 'escalated';
  if (attrs.snoozed) return 'snoozed';
  if (attrs.acknowledged) return 'acknowledged';
  if (entity.state === 'on') return 'active';
  return 'inactive';
}

/**
 * Checks if an entity has emergency alert attributes
 * @param entity Entity to check
 * @returns true if entity has severity or group attributes
 */
export function hasEmergencyAttributes(entity: HassEntity): boolean {
  return !!(entity.attributes && (entity.attributes.severity || entity.attributes.group));
}

/**
 * Converts a Home Assistant entity to an Alert object (v2.0)
 * @param entity Emergency alert entity from HA
 * @returns Normalized Alert object
 */
export function entityToAlert(entity: EmergencyAlertEntity): Alert {
  const attrs = entity.attributes;

  return {
    entity_id: entity.entity_id,
    name: attrs.friendly_name || entity.entity_id,
    state: entity.state,
    severity: (attrs.severity || 'info') as Severity,
    group: (attrs.group || 'other') as AlertGroup,
    acknowledged: !!attrs.acknowledged,
    escalated: !!attrs.escalated,
    snoozed: !!attrs.snoozed, // NEW in v2.0
    resolved: !!attrs.resolved, // RENAMED from cleared
    first_triggered: attrs.first_triggered,
    last_cleared: attrs.last_cleared,
    snooze_until: attrs.snooze_until, // NEW in v2.0
    status: getAlertStatus(entity),
  };
}

/**
 * Discovers all emergency alert entities from Home Assistant states
 * Filters entities based on configured patterns and presence of emergency attributes
 * @param hassStates All Home Assistant entity states
 * @param patterns Entity ID patterns to match (supports wildcards)
 * @param patternCache Optional cache for compiled regex patterns (for performance)
 * @returns Array of discovered alert entities
 */
export function discoverAlertEntities(
  hassStates: HassEntities,
  patterns: string[],
  patternCache?: Map<string, RegExp>
): EmergencyAlertEntity[] {
  const alertEntities: EmergencyAlertEntity[] = [];

  for (const entity of Object.values(hassStates)) {
    // Check if entity matches configured patterns
    const matchesPattern = matchesEntityPattern(entity.entity_id, patterns, patternCache);

    // Also check if entity has emergency alert attributes (allows custom entity names)
    const hasAttributes = hasEmergencyAttributes(entity);

    if (matchesPattern || hasAttributes) {
      alertEntities.push(entity as EmergencyAlertEntity);
    }
  }

  return alertEntities;
}

/**
 * Creates a hash of relevant entity IDs and their last_updated timestamps
 * Used to detect if any emergency alerts have changed
 * @param entities Emergency alert entities
 * @returns Hash string representing current state
 */
export function createEntityStateHash(entities: EmergencyAlertEntity[]): string {
  return entities
    .map(e => `${e.entity_id}:${e.last_updated}`)
    .sort()
    .join('|');
}
