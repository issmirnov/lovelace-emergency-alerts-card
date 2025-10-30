/**
 * Type definitions for Emergency Alerts Card
 * Based on Home Assistant and custom-card-helpers types
 */

/**
 * Home Assistant entity state object
 */
export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
  last_changed: string;
  last_updated: string;
  context: {
    id: string;
    parent_id: string | null;
    user_id: string | null;
  };
}

/**
 * Collection of all entity states in Home Assistant
 */
export type HassEntities = Record<string, HassEntity>;

/**
 * Service call data structure
 */
export interface ServiceData {
  entity_id?: string | string[];
  [key: string]: unknown;
}

/**
 * Main Home Assistant object passed to custom cards
 */
export interface HomeAssistant {
  states: HassEntities;
  callService: (domain: string, service: string, serviceData?: ServiceData) => Promise<void>;
  config: {
    language: string;
    [key: string]: unknown;
  };
  localize: (key: string, ...args: unknown[]) => string;
  [key: string]: unknown;
}

/**
 * Configuration for the Emergency Alerts Card (v2.0)
 */
export interface CardConfig {
  type: string;
  summary_entity?: string;
  [key: string]: unknown; // Allow dynamic field access in editor

  // Display options
  show_acknowledged?: boolean;
  show_snoozed?: boolean; // NEW in v2.0
  show_resolved?: boolean; // RENAMED from show_cleared
  show_escalated?: boolean;
  group_by?: 'severity' | 'group' | 'status' | 'none';
  sort_by?: 'first_triggered' | 'severity' | 'name' | 'group';

  // Filtering
  severity_filter?: string[];
  group_filter?: string[];
  status_filter?: string[];

  // Visual options
  compact_mode?: boolean;
  show_timestamps?: boolean;
  show_group_labels?: boolean;
  show_severity_icons?: boolean;
  show_status_badge?: boolean; // NEW in v2.0
  max_alerts_per_group?: number;

  // Action options (v2.0 - switch-based)
  show_acknowledge_button?: boolean;
  show_snooze_button?: boolean; // NEW in v2.0
  show_resolve_button?: boolean; // RENAMED from show_clear_button
  button_style?: 'compact' | 'full' | 'icons_only';

  // Advanced
  entity_patterns?: string[];
  refresh_interval?: number;
}

/**
 * Severity levels for alerts
 */
export type Severity = 'critical' | 'warning' | 'info';

/**
 * Alert group categories
 */
export type AlertGroup = 'security' | 'safety' | 'environmental' | 'maintenance' | 'other';

/**
 * Alert status states (v2.0 switch-based)
 */
export type AlertStatus =
  | 'active'
  | 'acknowledged'
  | 'escalated'
  | 'snoozed'
  | 'resolved'
  | 'inactive';

/**
 * Normalized alert object with all relevant data (v2.0)
 */
export interface Alert {
  entity_id: string;
  name: string;
  state: string;
  severity: Severity;
  group: AlertGroup;
  acknowledged: boolean;
  escalated: boolean;
  snoozed: boolean; // NEW in v2.0
  resolved: boolean; // RENAMED from cleared
  first_triggered?: string;
  last_cleared?: string;
  snooze_until?: string; // NEW in v2.0 - ISO timestamp
  status: AlertStatus;
}

/**
 * Emergency alert entity attributes from the integration (v2.0)
 */
export interface EmergencyAlertAttributes extends Record<string, unknown> {
  friendly_name: string;
  severity: Severity;
  group: AlertGroup;
  acknowledged: boolean;
  escalated: boolean;
  snoozed: boolean; // NEW in v2.0
  resolved: boolean; // RENAMED from cleared
  first_triggered?: string;
  last_cleared?: string;
  snooze_until?: string; // NEW in v2.0 - ISO timestamp when snooze expires
}

/**
 * Emergency alert entity (binary sensor)
 */
export interface EmergencyAlertEntity extends HassEntity {
  attributes: EmergencyAlertAttributes;
}

/**
 * Grouped alerts by category
 */
export type GroupedAlerts = Record<string, Alert[]>;

/**
 * Error notification structure
 */
export interface ErrorNotification {
  message: string;
  entity_id?: string;
  error?: Error;
}

/**
 * Loading state tracker for async actions
 */
export type LoadingState = Set<string>;
