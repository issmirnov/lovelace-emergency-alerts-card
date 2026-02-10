/**
 * Alert service for Home Assistant integration (v4.0)
 * Uses select entities and direct service calls
 */

import { HomeAssistant, ErrorNotification } from '../types';

/**
 * Callback function type for error notifications
 */
export type ErrorCallback = (error: ErrorNotification) => void;

/**
 * Service for managing emergency alerts (v4.0 select-based)
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
   * Converts binary_sensor entity ID to select entity ID
   * @param entity_id Binary sensor entity ID (e.g., binary_sensor.emergency_sun_up)
   * @returns Select entity ID (e.g., select.sun_up_state)
   */
  private _convertToSelectId(entity_id: string): string {
    // Remove binary_sensor.emergency_ prefix to get alert name
    const alertName = entity_id.replace('binary_sensor.emergency_', '');
    return `select.${alertName}_state`;
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
   * Acknowledges an alert (v4.0 - uses select entity)
   * Sets the select entity to "acknowledged" state
   * @param entity_id Binary sensor entity ID of the alert
   * @returns Promise that resolves when state changes
   */
  async acknowledge(entity_id: string): Promise<void> {
    try {
      const selectId = this._convertToSelectId(entity_id);
      await this.hass.callService('select', 'select_option', {
        entity_id: selectId,
        option: 'acknowledged',
      });
    } catch (error) {
      this.handleError('acknowledge alert', entity_id, error as Error);
      throw error;
    }
  }

  /**
   * Snoozes an alert (v4.0 - uses select entity)
   * Sets the select entity to "snoozed" state
   * @param entity_id Binary sensor entity ID of the alert
   * @returns Promise that resolves when state changes
   */
  async snooze(entity_id: string): Promise<void> {
    try {
      const selectId = this._convertToSelectId(entity_id);
      await this.hass.callService('select', 'select_option', {
        entity_id: selectId,
        option: 'snoozed',
      });
    } catch (error) {
      this.handleError('snooze alert', entity_id, error as Error);
      throw error;
    }
  }

  /**
   * Resolves an alert (v4.0 - uses select entity)
   * Sets the select entity to "resolved" state
   * @param entity_id Binary sensor entity ID of the alert
   * @returns Promise that resolves when state changes
   */
  async resolve(entity_id: string): Promise<void> {
    try {
      const selectId = this._convertToSelectId(entity_id);
      await this.hass.callService('select', 'select_option', {
        entity_id: selectId,
        option: 'resolved',
      });
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
