/**
 * Alert service for Home Assistant integration
 * Handles all service calls with proper error handling and user feedback
 */

import { HomeAssistant, ErrorNotification } from '../types';

/**
 * Callback function type for error notifications
 */
export type ErrorCallback = (error: ErrorNotification) => void;

/**
 * Service for managing emergency alerts
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
   * Acknowledges an alert
   * Marks the alert as seen/handled by the user
   * @param entity_id Entity ID of the alert to acknowledge
   * @returns Promise that resolves when service call completes
   */
  async acknowledge(entity_id: string): Promise<void> {
    try {
      await this.hass.callService('emergency_alerts', 'acknowledge', { entity_id });
    } catch (error) {
      this.handleError('acknowledge alert', entity_id, error as Error);
      throw error; // Re-throw to allow caller to handle if needed
    }
  }

  /**
   * Clears an alert
   * Manually resets the alert state
   * @param entity_id Entity ID of the alert to clear
   * @returns Promise that resolves when service call completes
   */
  async clear(entity_id: string): Promise<void> {
    try {
      await this.hass.callService('emergency_alerts', 'clear', { entity_id });
    } catch (error) {
      this.handleError('clear alert', entity_id, error as Error);
      throw error;
    }
  }

  /**
   * Escalates an alert
   * Triggers urgent notification actions (e.g., SMS, sirens)
   * @param entity_id Entity ID of the alert to escalate
   * @returns Promise that resolves when service call completes
   */
  async escalate(entity_id: string): Promise<void> {
    try {
      await this.hass.callService('emergency_alerts', 'escalate', { entity_id });
    } catch (error) {
      this.handleError('escalate alert', entity_id, error as Error);
      throw error;
    }
  }

  /**
   * De-escalates an alert
   * Returns an escalated alert back to acknowledged state
   * Note: Currently uses acknowledge service to reset escalated state
   * @param entity_id Entity ID of the alert to de-escalate
   * @returns Promise that resolves when service call completes
   */
  async deEscalate(entity_id: string): Promise<void> {
    try {
      // De-escalation is currently handled by acknowledging the alert
      // This may change in future versions of the integration
      await this.hass.callService('emergency_alerts', 'acknowledge', { entity_id });
    } catch (error) {
      this.handleError('de-escalate alert', entity_id, error as Error);
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
