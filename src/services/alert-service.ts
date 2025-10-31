/**
 * Alert service for Home Assistant integration (v2.0)
 * Handles switch toggles and service calls with proper error handling
 */

import { HomeAssistant, ErrorNotification } from '../types';

/**
 * Callback function type for error notifications
 */
export type ErrorCallback = (error: ErrorNotification) => void;

/**
 * Service for managing emergency alerts (v2.0 switch-based)
 */
export class AlertService {
  private hass: HomeAssistant;
  private onError?: ErrorCallback;

  /**
   * Creates a new AlertService instance
   * @param hass Home Assistant instance
   * @param onError Optional callback for error notifications
   */
  constructor(hass: HomeAssistant, onError?: ErrorCallback) {
    this.hass = hass;
    this.onError = onError;
  }

  /**
   * Converts binary_sensor entity ID to switch entity ID
   * Handles any binary_sensor entity, not just those with emergency_ prefix
   * @param entity_id Binary sensor entity ID (e.g., binary_sensor.emergency_foo or binary_sensor.custom_alert)
   * @param switchType Type of switch (acknowledged, snoozed, resolved)
   * @returns Switch entity ID (e.g., switch.foo_acknowledged or switch.custom_alert_acknowledged)
   */
  private _convertToSwitchId(entity_id: string, switchType: string): string {
    // Replace binary_sensor domain with switch domain
    let switchId = entity_id.replace('binary_sensor.', 'switch.');

    // Remove "emergency_" prefix if present (integration doesn't use it for switches)
    switchId = switchId.replace('emergency_', '');

    // Append switch type
    return switchId + `_${switchType}`;
  }

  /**
   * Handles errors by logging to console and notifying user
   * @param action Human-readable action that failed (e.g., "acknowledge alert")
   * @param entity_id Entity ID that the action was performed on
   * @param error The error that occurred
   */
  private handleError(action: string, entity_id: string, error: Error): void {
    const message = `Failed to ${action}`;

    // Log to console for debugging
    // eslint-disable-next-line no-console
    console.error(`[Emergency Alerts Card] ${message}:`, error);
    // eslint-disable-next-line no-console
    console.error(`Entity: ${entity_id}`);

    // Notify user via callback
    if (this.onError) {
      this.onError({
        message,
        entity_id,
        error,
      });
    }
  }

  /**
   * Acknowledges an alert (v2.0 - toggles switch)
   * Toggles the acknowledged switch (mutual exclusivity enforced by backend)
   * @param entity_id Binary sensor entity ID of the alert
   * @returns Promise that resolves when switch toggle completes
   */
  async acknowledge(entity_id: string): Promise<void> {
    try {
      const switchId = this._convertToSwitchId(entity_id, 'acknowledged');
      await this.hass.callService('switch', 'toggle', { entity_id: switchId });
    } catch (error) {
      this.handleError('acknowledge alert', entity_id, error as Error);
      throw error; // Re-throw to allow caller to handle if needed
    }
  }

  /**
   * Snoozes an alert (v2.0 - turns on switch)
   * Silences the alert for configured duration (default 5 minutes)
   * Auto-expires after duration, mutual exclusivity enforced by backend
   * @param entity_id Binary sensor entity ID of the alert
   * @returns Promise that resolves when switch turns on
   */
  async snooze(entity_id: string): Promise<void> {
    try {
      const switchId = this._convertToSwitchId(entity_id, 'snoozed');
      // Use turn_on (not toggle) since snooze auto-expires
      await this.hass.callService('switch', 'turn_on', { entity_id: switchId });
    } catch (error) {
      this.handleError('snooze alert', entity_id, error as Error);
      throw error;
    }
  }

  /**
   * Resolves an alert (v2.0 - toggles switch)
   * Marks the problem as fixed, prevents re-trigger until condition clears
   * @param entity_id Binary sensor entity ID of the alert
   * @returns Promise that resolves when switch toggle completes
   */
  async resolve(entity_id: string): Promise<void> {
    try {
      const switchId = this._convertToSwitchId(entity_id, 'resolved');
      await this.hass.callService('switch', 'toggle', { entity_id: switchId });
    } catch (error) {
      this.handleError('resolve alert', entity_id, error as Error);
      throw error;
    }
  }

  /**
   * Updates the Home Assistant instance
   * Call this when hass object changes
   * @param hass New Home Assistant instance
   */
  updateHass(hass: HomeAssistant): void {
    this.hass = hass;
  }

  /**
   * Updates the error callback
   * @param callback New error callback function
   */
  setErrorCallback(callback: ErrorCallback): void {
    this.onError = callback;
  }
}
