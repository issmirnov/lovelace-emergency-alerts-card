/**
 * Emergency Alerts Card for Home Assistant
 * Displays and manages emergency alerts from the Emergency Alerts integration
 *
 * @module emergency-alerts-card
 */

import { LitElement, html, PropertyValues, TemplateResult } from 'lit';
import {
  HomeAssistant,
  CardConfig,
  Alert,
  GroupedAlerts,
  ErrorNotification,
  LoadingState,
  EmergencyAlertEntity,
} from './types';
import { cardStyles } from './styles';
import { AlertService } from './services/alert-service';
import {
  formatTimeAgo,
  getSeverityIcon,
  getSeverityColor,
  getGroupTitle,
} from './utils/formatters';
import { shouldShowAlert } from './utils/filters';
import { sortAlerts } from './utils/sorters';
import { groupAlerts, getGroupCount } from './utils/groupers';
import {
  discoverAlertEntities,
  entityToAlert,
  createEntityStateHash,
} from './utils/entity-discovery';

/**
 * Custom Lovelace card for displaying emergency alerts
 * Integrates with the Emergency Alerts Home Assistant integration
 *
 * @element emergency-alerts-card
 */
export class EmergencyAlertsCard extends LitElement {
  /** Home Assistant instance passed by the frontend */
  hass?: HomeAssistant;

  /** Card configuration from Lovelace YAML */
  config?: CardConfig;

  /** Discovered and filtered alert entities */
  public alerts: Alert[] = [];

  /** Alerts grouped by configured strategy */
  public grouped: GroupedAlerts = {};

  /** Service for calling Home Assistant alert actions */
  private alertService?: AlertService;

  /** Set of entity IDs currently being acted upon (for loading states) */
  private loadingActions: LoadingState = new Set();

  /** Cache for compiled regex patterns (performance optimization) */
  private patternCache: Map<string, RegExp> = new Map();

  /** Hash of last seen entity states (for change detection) */
  private lastStatesHash: string = '';

  /** Current error notification to display */
  private currentError?: ErrorNotification;

  /** Interval ID for auto-refresh */
  private refreshInterval?: number;

  static get properties() {
    return {
      hass: { attribute: false },
      config: { attribute: false },
      alerts: { type: Array, state: true },
      grouped: { type: Object, state: true },
      loadingActions: { type: Object, state: true },
      currentError: { type: Object, state: true },
    };
  }

  static styles = cardStyles;

  /**
   * Sets the card configuration
   * Called by Home Assistant when card is initialized or config changes
   * @param config Card configuration from Lovelace YAML
   */
  setConfig(config: CardConfig): void {
    if (!config || !config.type) {
      throw new Error('Invalid configuration');
    }

    // Merge user config with defaults
    this.config = {
      show_acknowledged: true,
      show_cleared: false,
      show_escalated: true,
      group_by: 'severity',
      sort_by: 'first_triggered',
      severity_filter: ['critical', 'warning', 'info'],
      group_filter: [],
      status_filter: ['active', 'acknowledged', 'escalated'],
      compact_mode: false,
      show_timestamps: true,
      show_group_labels: true,
      show_severity_icons: true,
      max_alerts_per_group: 50,
      show_acknowledge_button: true,
      show_clear_button: true,
      show_escalate_button: true,
      button_style: 'compact',
      entity_patterns: ['binary_sensor.emergency_*'],
      refresh_interval: 30,
      ...config,
    };

    // Start auto-refresh if configured
    this._startAutoRefresh();
  }

  /**
   * Lifecycle: called when properties change
   * Implements performance optimization by checking if relevant entities changed
   * @param changedProps Map of changed properties
   */
  protected updated(changedProps: PropertyValues): void {
    super.updated(changedProps);

    if (changedProps.has('hass') && this.hass) {
      // Initialize alert service on first hass update
      if (!this.alertService) {
        this.alertService = new AlertService(this.hass, this._handleError.bind(this));
      } else {
        this.alertService.updateHass(this.hass);
      }

      // Only update alerts if relevant entities changed
      if (this._hasRelevantChanges()) {
        this._updateAlerts();
      }
    }
  }

  /**
   * Performance optimization: checks if any emergency alert entities changed
   * Compares hash of entity IDs and last_updated timestamps
   * @returns true if emergency alerts have changed
   */
  private _hasRelevantChanges(): boolean {
    if (!this.hass || !this.config) return false;

    const patterns = this.config.entity_patterns || ['binary_sensor.emergency_*'];
    const alertEntities = discoverAlertEntities(
      this.hass.states,
      patterns,
      this.patternCache
    );

    const currentHash = createEntityStateHash(alertEntities);
    const hasChanges = currentHash !== this.lastStatesHash;

    if (hasChanges) {
      this.lastStatesHash = currentHash;
    }

    return hasChanges;
  }

  /**
   * Discovers and processes all emergency alert entities
   * Applies filtering, sorting, and grouping based on configuration
   */
  private _updateAlerts(): void {
    if (!this.hass || !this.config) return;

    const patterns = this.config.entity_patterns || ['binary_sensor.emergency_*'];

    // Discover alert entities from Home Assistant
    const alertEntities: EmergencyAlertEntity[] = discoverAlertEntities(
      this.hass.states,
      patterns,
      this.patternCache
    );

    // Convert to normalized Alert objects
    const allAlerts: Alert[] = alertEntities.map(entityToAlert);

    // Filter alerts based on configuration
    const filteredAlerts = allAlerts.filter((alert) =>
      shouldShowAlert(alert, this.config!)
    );

    // Sort alerts
    sortAlerts(filteredAlerts, this.config);

    // Group alerts
    this.alerts = filteredAlerts;
    this.grouped = groupAlerts(filteredAlerts, this.config);
  }

  /**
   * Starts auto-refresh timer if configured
   */
  private _startAutoRefresh(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }

    if (this.config?.refresh_interval && this.config.refresh_interval > 0) {
      this.refreshInterval = window.setInterval(() => {
        this._updateAlerts();
      }, this.config.refresh_interval * 1000);
    }
  }

  /**
   * Lifecycle: cleanup when element is removed
   */
  public disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  /**
   * Handles errors from alert service
   * Displays error notification to user
   * @param error Error notification object
   */
  private _handleError(error: ErrorNotification): void {
    this.currentError = error;
    this.requestUpdate();

    // Auto-dismiss error after 5 seconds
    setTimeout(() => {
      if (this.currentError === error) {
        this.currentError = undefined;
        this.requestUpdate();
      }
    }, 5000);
  }

  /**
   * Dismisses the current error notification
   */
  private _dismissError(): void {
    this.currentError = undefined;
  }

  /**
   * Handles acknowledge action with loading state
   * @param entity_id Entity ID to acknowledge
   */
  private async _handleAcknowledge(entity_id: string): Promise<void> {
    if (!this.alertService) return;

    this.loadingActions.add(entity_id);
    this.requestUpdate();

    try {
      await this.alertService.acknowledge(entity_id);
    } finally {
      this.loadingActions.delete(entity_id);
      this.requestUpdate();
    }
  }

  /**
   * Handles clear action with loading state
   * @param entity_id Entity ID to clear
   */
  private async _handleClear(entity_id: string): Promise<void> {
    if (!this.alertService) return;

    this.loadingActions.add(entity_id);
    this.requestUpdate();

    try {
      await this.alertService.clear(entity_id);
    } finally {
      this.loadingActions.delete(entity_id);
      this.requestUpdate();
    }
  }

  /**
   * Handles escalate action with loading state
   * @param entity_id Entity ID to escalate
   */
  private async _handleEscalate(entity_id: string): Promise<void> {
    if (!this.alertService) return;

    this.loadingActions.add(entity_id);
    this.requestUpdate();

    try {
      await this.alertService.escalate(entity_id);
    } finally {
      this.loadingActions.delete(entity_id);
      this.requestUpdate();
    }
  }

  /**
   * Handles de-escalate action with loading state
   * @param entity_id Entity ID to de-escalate
   */
  private async _handleDeEscalate(entity_id: string): Promise<void> {
    if (!this.alertService) return;

    this.loadingActions.add(entity_id);
    this.requestUpdate();

    try {
      await this.alertService.deEscalate(entity_id);
    } finally {
      this.loadingActions.delete(entity_id);
      this.requestUpdate();
    }
  }

  /**
   * Determines if action buttons should be shown for an alert
   * @param alert Alert to check
   * @returns true if actions should be displayed
   */
  private _shouldShowActions(alert: Alert): boolean {
    return !alert.cleared;
  }

  /**
   * Renders the card UI
   * @returns Lit template
   */
  render(): TemplateResult {
    if (!this.hass) {
      return html`<div class="card">Loading...</div>`;
    }

    const totalActive = this.alerts.filter((a) => a.state === 'on').length;
    const cardClass = this.config?.compact_mode ? 'compact' : '';

    return html`
      <div class="card ${cardClass}">
        <div class="summary-header">Emergency Alerts (${totalActive} active)</div>

        ${this._renderErrorNotification()} ${this._renderAlerts()}
      </div>
    `;
  }

  /**
   * Renders error notification if present
   * @returns Lit template
   */
  private _renderErrorNotification(): TemplateResult | string {
    if (!this.currentError) return '';

    return html`
      <div class="error-notification">
        <span class="error-icon">⚠️</span>
        <span class="error-message">${this.currentError.message}</span>
        <button class="error-dismiss" @click=${this._dismissError}>×</button>
      </div>
    `;
  }

  /**
   * Renders all alert groups
   * @returns Lit template
   */
  private _renderAlerts(): TemplateResult | string {
    if (this.alerts.length === 0) {
      return html`<div class="no-alerts">No alerts to display</div>`;
    }

    return html`
      ${Object.entries(this.grouped).map(([group, alerts]) =>
        this._renderAlertGroup(group, alerts)
      )}
    `;
  }

  /**
   * Renders a single alert group
   * @param group Group name
   * @param alerts Alerts in the group
   * @returns Lit template
   */
  private _renderAlertGroup(group: string, alerts: Alert[]): TemplateResult | string {
    if (alerts.length === 0) return '';

    const groupCount = getGroupCount(alerts, this.config!.group_by || 'severity');
    const groupTitle = getGroupTitle(group, this.config!.group_by || 'severity');
    const severityClass = this.config?.group_by === 'severity' ? `alert-${group}` : '';

    const maxAlerts = this.config?.max_alerts_per_group || 50;
    const displayAlerts = alerts.slice(0, maxAlerts);

    return html`
      <div class="group-header ${severityClass}">
        <span>${groupTitle} (${groupCount})</span>
      </div>
      ${displayAlerts.map((alert) => this._renderAlert(alert))}
    `;
  }

  /**
   * Renders a single alert item
   * @param alert Alert to render
   * @returns Lit template
   */
  private _renderAlert(alert: Alert): TemplateResult {
    const classes = [
      'alert-item',
      `alert-${alert.severity}`,
      alert.acknowledged ? 'alert-acknowledged' : '',
      alert.escalated ? 'alert-escalated' : '',
      alert.cleared ? 'alert-cleared' : '',
    ]
      .filter(Boolean)
      .join(' ');

    return html`
      <div class=${classes}>
        ${this._renderAlertIcon(alert)} ${this._renderAlertContent(alert)}
        ${alert.state === 'on' && this._shouldShowActions(alert)
          ? this._renderAlertActions(alert)
          : ''}
      </div>
    `;
  }

  /**
   * Renders alert severity icon
   * @param alert Alert to render icon for
   * @returns Lit template
   */
  private _renderAlertIcon(alert: Alert): TemplateResult | string {
    if (!this.config?.show_severity_icons) return '';

    return html`
      <ha-icon
        class="alert-icon"
        icon="${getSeverityIcon(alert.severity)}"
        style="color: ${getSeverityColor(alert.severity)};"
      ></ha-icon>
    `;
  }

  /**
   * Renders alert content (name and metadata)
   * @param alert Alert to render content for
   * @returns Lit template
   */
  private _renderAlertContent(alert: Alert): TemplateResult {
    return html`
      <div class="alert-content">
        <div class="alert-name">${alert.name}</div>
        <div class="alert-meta">
          ${this.config?.show_group_labels ? html`<span>${alert.group}</span>` : ''}
          ${this.config?.show_timestamps && alert.first_triggered
            ? html`<span>• ${formatTimeAgo(alert.first_triggered)}</span>`
            : ''}
        </div>
      </div>
    `;
  }

  /**
   * Renders action buttons for an alert
   * @param alert Alert to render actions for
   * @returns Lit template
   */
  private _renderAlertActions(alert: Alert): TemplateResult {
    const isLoading = this.loadingActions.has(alert.entity_id);

    return html`
      <div class="action-buttons">
        ${this._renderAcknowledgeButton(alert, isLoading)}
        ${this._renderEscalateButton(alert, isLoading)}
        ${this._renderClearButton(alert, isLoading)}
      </div>
    `;
  }

  /**
   * Renders acknowledge button if appropriate
   * @param alert Alert to render button for
   * @param isLoading Whether action is in progress
   * @returns Lit template
   */
  private _renderAcknowledgeButton(
    alert: Alert,
    isLoading: boolean
  ): TemplateResult | string {
    if (
      !this.config?.show_acknowledge_button ||
      alert.acknowledged ||
      alert.escalated
    ) {
      return '';
    }

    const label = this.config?.button_style === 'icons_only' ? '✓' : 'ACK';

    return html`
      <button
        class="action-btn acknowledge-btn ${isLoading ? 'loading' : ''}"
        ?disabled=${isLoading}
        @click=${() => this._handleAcknowledge(alert.entity_id)}
      >
        ${isLoading ? '⏳' : label}
      </button>
    `;
  }

  /**
   * Renders escalate/de-escalate button if appropriate
   * @param alert Alert to render button for
   * @param isLoading Whether action is in progress
   * @returns Lit template
   */
  private _renderEscalateButton(
    alert: Alert,
    isLoading: boolean
  ): TemplateResult | string {
    if (!this.config?.show_escalate_button || alert.cleared) {
      return '';
    }

    if (alert.escalated) {
      const label = this.config?.button_style === 'icons_only' ? '↓' : 'DE-ESC';
      return html`
        <button
          class="action-btn de-escalate-btn ${isLoading ? 'loading' : ''}"
          ?disabled=${isLoading}
          @click=${() => this._handleDeEscalate(alert.entity_id)}
        >
          ${isLoading ? '⏳' : label}
        </button>
      `;
    }

    if (!alert.acknowledged && !alert.escalated) {
      const label = this.config?.button_style === 'icons_only' ? '↑' : 'ESC';
      return html`
        <button
          class="action-btn escalate-btn ${isLoading ? 'loading' : ''}"
          ?disabled=${isLoading}
          @click=${() => this._handleEscalate(alert.entity_id)}
        >
          ${isLoading ? '⏳' : label}
        </button>
      `;
    }

    return '';
  }

  /**
   * Renders clear button if appropriate
   * @param alert Alert to render button for
   * @param isLoading Whether action is in progress
   * @returns Lit template
   */
  private _renderClearButton(alert: Alert, isLoading: boolean): TemplateResult | string {
    if (!this.config?.show_clear_button) {
      return '';
    }

    const label = this.config?.button_style === 'icons_only' ? '×' : 'CLR';

    return html`
      <button
        class="action-btn clear-btn ${isLoading ? 'loading' : ''}"
        ?disabled=${isLoading}
        @click=${() => this._handleClear(alert.entity_id)}
      >
        ${isLoading ? '⏳' : label}
      </button>
    `;
  }

  /**
   * Returns stub configuration for card picker
   * @returns Default configuration
   */
  static getStubConfig(): CardConfig {
    return {
      type: 'custom:emergency-alerts-card',
      summary_entity: '',
      show_acknowledged: true,
      show_cleared: false,
      show_escalated: true,
      group_by: 'severity',
      sort_by: 'first_triggered',
      severity_filter: ['critical', 'warning', 'info'],
      group_filter: [],
      status_filter: ['active', 'acknowledged', 'escalated'],
      compact_mode: false,
      show_timestamps: true,
      show_group_labels: true,
      show_severity_icons: true,
      max_alerts_per_group: 10,
      show_acknowledge_button: true,
      show_clear_button: true,
      show_escalate_button: true,
      button_style: 'compact',
      entity_patterns: ['binary_sensor.emergency_*'],
      refresh_interval: 30,
    };
  }

  /**
   * Returns card editor element
   * @returns Editor element
   */
  static getConfigElement() {
    return document.createElement('emergency-alerts-card-editor');
  }
}

// Note: Card editor component is currently in the original file
// TODO: Extract and refactor the editor component similarly

// Register the custom element
customElements.define('emergency-alerts-card', EmergencyAlertsCard);

// Declare types for Home Assistant
declare global {
  interface Window {
    customCards: Array<{
      type: string;
      name: string;
      description: string;
    }>;
  }
}

// Register with Home Assistant
(window.customCards = window.customCards || []).push({
  type: 'emergency-alerts-card',
  name: 'Emergency Alerts Card',
  description: 'A card to display emergency alerts from the Emergency Alerts integration',
});
