/**
 * Emergency Alerts Card for Home Assistant
 * Displays and manages emergency alerts from the Emergency Alerts integration
 *
 * @module emergency-alerts-card
 */

import { LitElement, html, css, PropertyValues, TemplateResult } from 'lit';
import {
  HomeAssistant,
  HassEntity,
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
    if (!config) {
      throw new Error('Invalid configuration');
    }

    // Merge user config with defaults (v2.0)
    // Note: type field is always provided by Home Assistant, no default needed
    this.config = {
      show_acknowledged: true,
      show_snoozed: true, // NEW in v2.0
      show_resolved: false, // RENAMED from show_cleared
      show_escalated: true,
      group_by: 'severity',
      sort_by: 'first_triggered',
      severity_filter: ['critical', 'warning', 'info'],
      group_filter: [],
      status_filter: ['active', 'acknowledged', 'snoozed', 'escalated'], // Updated for v2.0
      compact_mode: false,
      show_timestamps: true,
      show_group_labels: true,
      show_severity_icons: true,
      show_status_badge: true, // NEW in v2.0
      max_alerts_per_group: 50,
      show_acknowledge_button: true,
      show_snooze_button: true, // NEW in v2.0
      show_resolve_button: true, // RENAMED from show_clear_button
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
    const alertEntities = discoverAlertEntities(this.hass.states, patterns, this.patternCache);

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
    const filteredAlerts = allAlerts.filter(alert => shouldShowAlert(alert, this.config!));

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
   * Handles resolve action with loading state (v2.0 - renamed from clear)
   * @param entity_id Entity ID to resolve
   */
  private async _handleResolve(entity_id: string): Promise<void> {
    if (!this.alertService) return;

    this.loadingActions.add(entity_id);
    this.requestUpdate();

    try {
      await this.alertService.resolve(entity_id);
    } finally {
      this.loadingActions.delete(entity_id);
      this.requestUpdate();
    }
  }

  /**
   * Handles snooze action with loading state (v2.0 - NEW)
   * Silences alert for configured duration (default 5 minutes)
   * @param entity_id Entity ID to snooze
   */
  private async _handleSnooze(entity_id: string): Promise<void> {
    if (!this.alertService) return;

    this.loadingActions.add(entity_id);
    this.requestUpdate();

    try {
      await this.alertService.snooze(entity_id);
    } finally {
      this.loadingActions.delete(entity_id);
      this.requestUpdate();
    }
  }

  /**
   * Determines if action buttons should be shown for an alert (v2.0)
   * @param _alert Alert to check (unused - actions always shown for toggleable switches)
   * @returns true if actions should be displayed
   */
  private _shouldShowActions(_alert: Alert): boolean {
    // Show actions for all alert states (switches are toggleable)
    return true;
  }

  /**
   * Formats snooze_until timestamp (v2.0 helper)
   * @param snooze_until ISO timestamp when snooze expires
   * @returns Formatted string like "until 2:30 PM"
   */
  private _formatSnoozeTime(snooze_until?: string): string {
    if (!snooze_until) return '';

    const snoozeDate = new Date(snooze_until);
    const timeStr = snoozeDate.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
    });

    return `until ${timeStr}`;
  }

  /**
   * Renders status badge showing current alert state (v2.0)
   * @param alert Alert to render badge for
   * @returns Lit template
   */
  private _renderStatusBadge(alert: Alert): TemplateResult | string {
    if (!this.config?.show_status_badge) {
      return '';
    }

    return html`
      <span class="status-badge ${alert.status}"> ${alert.status.toUpperCase()} </span>
    `;
  }

  /**
   * Renders the card UI
   * @returns Lit template
   */
  render(): TemplateResult {
    if (!this.hass) {
      return html`<div class="card">Loading...</div>`;
    }

    const totalActive = this.alerts.filter(a => a.state === 'on').length;
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
      ${displayAlerts.map(alert => this._renderAlert(alert))}
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
      `state-${alert.status}`, // NEW: state-based class for animations
      alert.acknowledged ? 'alert-acknowledged' : '',
      alert.snoozed ? 'alert-snoozed' : '', // NEW in v2.0
      alert.escalated ? 'alert-escalated' : '',
      alert.resolved ? 'alert-resolved' : '', // RENAMED from alert-cleared
    ]
      .filter(Boolean)
      .join(' ');

    return html`
      <div class=${classes}>
        ${this._renderAlertIcon(alert)} ${this._renderStatusBadge(alert)}
        ${this._renderAlertContent(alert)}
        ${this._shouldShowActions(alert) ? this._renderAlertActions(alert) : ''}
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
        <div class="alert-name">
          ${alert.name} ${alert.escalated ? html`<span class="escalated-indicator">⚠️</span>` : ''}
        </div>
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
        ${this._renderSnoozeButton(alert, isLoading)} ${this._renderResolveButton(alert, isLoading)}
      </div>
    `;
  }

  /**
   * Renders acknowledge button if appropriate
   * @param alert Alert to render button for
   * @param isLoading Whether action is in progress
   * @returns Lit template
   */
  private _renderAcknowledgeButton(alert: Alert, isLoading: boolean): TemplateResult | string {
    if (!this.config?.show_acknowledge_button) {
      return '';
    }

    const isActive = alert.acknowledged;
    const label = isActive
      ? this.config?.button_style === 'icons_only'
        ? '✓'
        : '✓ Acknowledged'
      : this.config?.button_style === 'icons_only'
        ? '○'
        : 'Acknowledge';

    return html`
      <button
        class="action-btn acknowledge-btn ${isLoading ? 'loading' : ''} ${isActive
          ? 'acknowledged-active'
          : ''}"
        ?disabled=${isLoading}
        @click=${() => this._handleAcknowledge(alert.entity_id)}
        title="Mark as working on it (prevents auto-escalation). Turning this ON will turn other switches OFF."
      >
        ${isLoading ? '⏳' : label}
      </button>
    `;
  }

  /**
   * Renders snooze button (v2.0 - NEW)
   * Shows active state when snoozed with static timestamp
   * @param alert Alert to render button for
   * @param isLoading Whether action is in progress
   * @returns Lit template
   */
  private _renderSnoozeButton(alert: Alert, isLoading: boolean): TemplateResult | string {
    if (!this.config?.show_snooze_button) {
      return '';
    }

    const isActive = alert.snoozed;
    const label = isActive
      ? this.config?.button_style === 'icons_only'
        ? '🔕'
        : `🔕 Snoozed ${this._formatSnoozeTime(alert.snooze_until)}`
      : this.config?.button_style === 'icons_only'
        ? '💤'
        : 'Snooze (5m)';

    return html`
      <button
        class="action-btn snooze-btn ${isLoading ? 'loading' : ''} ${isActive
          ? 'snoozed-active'
          : ''}"
        ?disabled=${isLoading}
        @click=${() => this._handleSnooze(alert.entity_id)}
        title="Silence for 5 minutes (auto-expires). Turning this ON will turn other switches OFF."
      >
        ${isLoading ? '⏳' : label}
      </button>
    `;
  }

  /**
   * Renders resolve button (v2.0 - renamed from clear)
   * Shows active state when resolved
   * @param alert Alert to render button for
   * @param isLoading Whether action is in progress
   * @returns Lit template
   */
  private _renderResolveButton(alert: Alert, isLoading: boolean): TemplateResult | string {
    if (!this.config?.show_resolve_button) {
      return '';
    }

    const isActive = alert.resolved;
    const label = isActive
      ? this.config?.button_style === 'icons_only'
        ? '✓'
        : '✓ Resolved'
      : this.config?.button_style === 'icons_only'
        ? '×'
        : 'Resolve';

    return html`
      <button
        class="action-btn resolve-btn ${isLoading ? 'loading' : ''} ${isActive
          ? 'resolved-active'
          : ''}"
        ?disabled=${isLoading}
        @click=${() => this._handleResolve(alert.entity_id)}
        title="Mark as fixed (won't re-trigger until condition clears). Turning this ON will turn other switches OFF."
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
      show_snoozed: true, // NEW in v2.0
      show_resolved: false, // RENAMED from show_cleared
      show_escalated: true,
      group_by: 'severity',
      sort_by: 'first_triggered',
      severity_filter: ['critical', 'warning', 'info'],
      group_filter: [],
      status_filter: ['active', 'acknowledged', 'snoozed', 'escalated'], // Updated for v2.0
      compact_mode: false,
      show_timestamps: true,
      show_group_labels: true,
      show_severity_icons: true,
      show_status_badge: true, // NEW in v2.0
      max_alerts_per_group: 10,
      show_acknowledge_button: true,
      show_snooze_button: true, // NEW in v2.0
      show_resolve_button: true, // RENAMED from show_clear_button
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

/**
 * Card editor for Home Assistant Lovelace UI
 * Provides visual configuration interface for the Emergency Alerts Card
 * Note: This editor will be refactored in a future update to use the modular architecture
 */
export class EmergencyAlertsCardEditor extends LitElement {
  hass?: HomeAssistant;
  config?: CardConfig;

  static get properties() {
    return {
      hass: { attribute: false },
      config: { attribute: false },
    };
  }

  static styles = css`
    .editor {
      padding: 16px;
      background: var(--ha-card-background, white);
      border-radius: var(--ha-card-border-radius, 8px);
    }

    .section {
      margin-bottom: 24px;
      padding: 16px;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 8px;
    }

    .section-header {
      font-size: 1.1em;
      font-weight: bold;
      margin-bottom: 12px;
      color: var(--primary-text-color);
      border-bottom: 1px solid var(--divider-color, #e0e0e0);
      padding-bottom: 8px;
    }

    .field {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 12px 0;
      min-height: 40px;
    }

    .field label {
      flex: 1;
      margin-right: 16px;
      font-weight: 500;
      color: var(--primary-text-color);
    }

    .field-input {
      flex: 1;
      max-width: 300px;
    }

    ha-textfield,
    ha-select {
      width: 100%;
    }

    ha-switch {
      margin-left: auto;
    }

    .multi-select-container {
      display: flex;
      flex-direction: column;
      gap: 8px;
      max-height: 200px;
      overflow-y: auto;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 4px;
      padding: 8px;
    }

    .checkbox-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 4px 0;
    }

    .checkbox-label {
      font-size: 0.9em;
      color: var(--primary-text-color);
      cursor: pointer;
    }

    .checkbox-item:hover {
      background: var(--secondary-background-color, #f5f5f5);
      border-radius: 4px;
      padding: 4px 8px;
      margin: 0 -8px;
    }

    .checkbox-list {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 8px;
      margin-top: 8px;
    }

    .help-text {
      font-size: 0.8em;
      color: var(--secondary-text-color);
      margin-top: 4px;
      font-style: italic;
    }

    .array-input {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .array-item {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .array-item ha-textfield {
      flex: 1;
    }

    .remove-btn {
      --mdc-theme-primary: var(--error-color, #f44336);
    }
  `;

  setConfig(config: CardConfig): void {
    this.config = config;
  }

  private _valueChanged(field: string, value: unknown): void {
    if (!this.config) return;

    const newConfig = { ...this.config, [field]: value };
    this.config = newConfig;
    this._fireConfigChanged();
  }

  private _fireConfigChanged(): void {
    const event = new CustomEvent('config-changed', {
      detail: { config: this.config },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  private _updateStringArray(field: string, values: string[]): void {
    this._valueChanged(field, values);
  }

  private _addArrayItem(field: string): void {
    const currentArray = ((this.config as Record<string, unknown>)?.[field] as string[]) || [];
    this._updateStringArray(field, [...currentArray, '']);
  }

  private _removeArrayItem(field: string, index: number): void {
    const currentArray = ((this.config as Record<string, unknown>)?.[field] as string[]) || [];
    const newArray = currentArray.filter((_, i) => i !== index);
    this._updateStringArray(field, newArray);
  }

  private _updateArrayItem(field: string, index: number, value: string): void {
    const currentArray = ((this.config as Record<string, unknown>)?.[field] as string[]) || [];
    const newArray = [...currentArray];
    newArray[index] = value;
    this._updateStringArray(field, newArray);
  }

  private _toggleFilterValue(field: string, value: string, checked: boolean): void {
    const currentArray = ((this.config as Record<string, unknown>)?.[field] as string[]) || [];
    let newArray: string[];

    if (checked) {
      newArray = currentArray.includes(value) ? currentArray : [...currentArray, value];
    } else {
      newArray = currentArray.filter((v: string) => v !== value);
    }

    this._updateStringArray(field, newArray);
  }

  private _getSummaryEntityOptions() {
    if (!this.hass) return [];

    const summaryEntities = Object.values(this.hass.states)
      .filter((entity: HassEntity) => {
        const entityId = entity.entity_id;
        return (
          entityId.startsWith('sensor.emergency_alerts') &&
          (entityId.includes('summary') || entityId.includes('Summary'))
        );
      })
      .sort((a, b) => a.entity_id.localeCompare(b.entity_id));

    return summaryEntities.map(
      entity => html`
        <mwc-list-item value="${entity.entity_id}">
          ${entity.attributes?.friendly_name || entity.entity_id}
        </mwc-list-item>
      `
    );
  }

  private _getSeverityOptions() {
    return [
      { value: 'critical', label: 'Critical' },
      { value: 'warning', label: 'Warning' },
      { value: 'info', label: 'Info' },
    ];
  }

  private _getStatusOptions() {
    return [
      { value: 'active', label: 'Active' },
      { value: 'acknowledged', label: 'Acknowledged' },
      { value: 'snoozed', label: 'Snoozed' },
      { value: 'escalated', label: 'Escalated' },
      { value: 'resolved', label: 'Resolved' },
    ];
  }

  private _getGroupOptions() {
    if (!this.hass) return [];

    const groups = new Set<string>();
    Object.values(this.hass.states).forEach((entity: HassEntity) => {
      const group = (entity.attributes as Record<string, unknown>)?.group;
      if (typeof group === 'string') {
        groups.add(group);
      }
    });

    return Array.from(groups)
      .sort()
      .map(group => ({
        value: group,
        label: group.charAt(0).toUpperCase() + group.slice(1),
      }));
  }

  private _renderMultiSelectEditor(
    field: string,
    label: string,
    options: Array<{ value: string; label: string }>,
    helpText?: string
  ) {
    const selectedValues = ((this.config as Record<string, unknown>)?.[field] as string[]) || [];

    return html`
      <div class="field">
        <label>${label}</label>
        <div class="field-input">
          <div class="multi-select-container">
            ${options.map(
              option => html`
                <div class="checkbox-item">
                  <ha-checkbox
                    .checked=${selectedValues.includes(option.value)}
                    @change=${(e: Event) =>
                      this._toggleFilterValue(
                        field,
                        option.value,
                        (e.target as HTMLInputElement).checked
                      )}
                  ></ha-checkbox>
                  <span class="checkbox-label">${option.label}</span>
                </div>
              `
            )}
          </div>
          ${helpText ? html`<div class="help-text">${helpText}</div>` : ''}
        </div>
      </div>
    `;
  }

  private _renderStringArrayEditor(field: string, label: string, helpText?: string) {
    const values = ((this.config as Record<string, unknown>)?.[field] as string[]) || [];

    return html`
      <div class="field">
        <label>${label}</label>
        <div class="field-input">
          <div class="array-input">
            ${values.map(
              (value: string, index: number) => html`
                <div class="array-item">
                  <ha-textfield
                    .value=${value}
                    @input=${(e: Event) =>
                      this._updateArrayItem(field, index, (e.target as HTMLInputElement).value)}
                    placeholder="Enter value..."
                  ></ha-textfield>
                  <mwc-button
                    class="remove-btn"
                    @click=${() => this._removeArrayItem(field, index)}
                    outlined
                  >
                    Remove
                  </mwc-button>
                </div>
              `
            )}
            <mwc-button @click=${() => this._addArrayItem(field)} outlined>
              Add ${label.replace(/s$/, '')}
            </mwc-button>
          </div>
          ${helpText ? html`<div class="help-text">${helpText}</div>` : ''}
        </div>
      </div>
    `;
  }

  render() {
    if (!this.config) {
      return html``;
    }

    return html`
      <div class="editor">
        <!-- Basic Configuration -->
        <div class="section">
          <div class="section-header">Basic Configuration</div>

          <div class="field">
            <label>Summary Entity</label>
            <div class="field-input">
              <ha-select
                .value=${this.config.summary_entity || ''}
                @change=${(e: Event) =>
                  this._valueChanged('summary_entity', (e.target as HTMLSelectElement).value)}
              >
                <mwc-list-item value="">Auto-detect (recommended)</mwc-list-item>
                ${this._getSummaryEntityOptions()}
              </ha-select>
              <div class="help-text">Optional: Entity that provides summary information</div>
            </div>
          </div>

          <div class="field">
            <label>Group By</label>
            <div class="field-input">
              <ha-select
                .value=${this.config.group_by || 'severity'}
                @change=${(e: Event) =>
                  this._valueChanged('group_by', (e.target as HTMLSelectElement).value)}
              >
                <mwc-list-item value="severity">Severity</mwc-list-item>
                <mwc-list-item value="group">Group</mwc-list-item>
                <mwc-list-item value="status">Status</mwc-list-item>
                <mwc-list-item value="none">None</mwc-list-item>
              </ha-select>
            </div>
          </div>

          <div class="field">
            <label>Sort By</label>
            <div class="field-input">
              <ha-select
                .value=${this.config.sort_by || 'first_triggered'}
                @change=${(e: Event) =>
                  this._valueChanged('sort_by', (e.target as HTMLSelectElement).value)}
              >
                <mwc-list-item value="first_triggered">First Triggered</mwc-list-item>
                <mwc-list-item value="severity">Severity</mwc-list-item>
                <mwc-list-item value="name">Name</mwc-list-item>
                <mwc-list-item value="group">Group</mwc-list-item>
              </ha-select>
            </div>
          </div>
        </div>

        <!-- Display Options -->
        <div class="section">
          <div class="section-header">Display Options</div>

          <div class="field">
            <label>Show Acknowledged Alerts</label>
            <ha-switch
              .checked=${this.config.show_acknowledged ?? true}
              @change=${(e: Event) =>
                this._valueChanged('show_acknowledged', (e.target as HTMLInputElement).checked)}
            ></ha-switch>
          </div>

          <div class="field">
            <label>Show Snoozed Alerts</label>
            <ha-switch
              .checked=${this.config.show_snoozed ?? true}
              @change=${(e: Event) =>
                this._valueChanged('show_snoozed', (e.target as HTMLInputElement).checked)}
            ></ha-switch>
          </div>

          <div class="field">
            <label>Show Resolved Alerts</label>
            <ha-switch
              .checked=${this.config.show_resolved ?? false}
              @change=${(e: Event) =>
                this._valueChanged('show_resolved', (e.target as HTMLInputElement).checked)}
            ></ha-switch>
          </div>

          <div class="field">
            <label>Show Escalated Alerts</label>
            <ha-switch
              .checked=${this.config.show_escalated ?? true}
              @change=${(e: Event) =>
                this._valueChanged('show_escalated', (e.target as HTMLInputElement).checked)}
            ></ha-switch>
          </div>

          <div class="field">
            <label>Compact Mode</label>
            <ha-switch
              .checked=${this.config.compact_mode ?? false}
              @change=${(e: Event) =>
                this._valueChanged('compact_mode', (e.target as HTMLInputElement).checked)}
            ></ha-switch>
          </div>

          <div class="field">
            <label>Show Timestamps</label>
            <ha-switch
              .checked=${this.config.show_timestamps ?? true}
              @change=${(e: Event) =>
                this._valueChanged('show_timestamps', (e.target as HTMLInputElement).checked)}
            ></ha-switch>
          </div>

          <div class="field">
            <label>Show Group Labels</label>
            <ha-switch
              .checked=${this.config.show_group_labels ?? true}
              @change=${(e: Event) =>
                this._valueChanged('show_group_labels', (e.target as HTMLInputElement).checked)}
            ></ha-switch>
          </div>

          <div class="field">
            <label>Show Severity Icons</label>
            <ha-switch
              .checked=${this.config.show_severity_icons ?? true}
              @change=${(e: Event) =>
                this._valueChanged('show_severity_icons', (e.target as HTMLInputElement).checked)}
            ></ha-switch>
          </div>

          <div class="field">
            <label>Max Alerts Per Group</label>
            <div class="field-input">
              <ha-textfield
                type="number"
                .value=${String(this.config.max_alerts_per_group || 10)}
                @input=${(e: Event) =>
                  this._valueChanged(
                    'max_alerts_per_group',
                    parseInt((e.target as HTMLInputElement).value) || 10
                  )}
                min="1"
                max="100"
              ></ha-textfield>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="section">
          <div class="section-header">Action Buttons</div>

          <div class="field">
            <label>Show Acknowledge Button</label>
            <ha-switch
              .checked=${this.config.show_acknowledge_button ?? true}
              @change=${(e: Event) =>
                this._valueChanged(
                  'show_acknowledge_button',
                  (e.target as HTMLInputElement).checked
                )}
            ></ha-switch>
          </div>

          <div class="field">
            <label>Show Snooze Button</label>
            <ha-switch
              .checked=${this.config.show_snooze_button ?? true}
              @change=${(e: Event) =>
                this._valueChanged('show_snooze_button', (e.target as HTMLInputElement).checked)}
            ></ha-switch>
          </div>

          <div class="field">
            <label>Show Resolve Button</label>
            <ha-switch
              .checked=${this.config.show_resolve_button ?? true}
              @change=${(e: Event) =>
                this._valueChanged('show_resolve_button', (e.target as HTMLInputElement).checked)}
            ></ha-switch>
          </div>

          <div class="field">
            <label>Button Style</label>
            <div class="field-input">
              <ha-select
                .value=${this.config.button_style || 'compact'}
                @change=${(e: Event) =>
                  this._valueChanged('button_style', (e.target as HTMLSelectElement).value)}
              >
                <mwc-list-item value="compact">Compact</mwc-list-item>
                <mwc-list-item value="full">Full</mwc-list-item>
                <mwc-list-item value="icons_only">Icons Only</mwc-list-item>
              </ha-select>
            </div>
          </div>
        </div>

        <!-- Filtering -->
        <div class="section">
          <div class="section-header">Filtering</div>

          ${this._renderMultiSelectEditor(
            'severity_filter',
            'Severity Filter',
            this._getSeverityOptions(),
            'Select which severity levels to show (leave all unchecked to show all)'
          )}
          ${this._renderMultiSelectEditor(
            'group_filter',
            'Group Filter',
            this._getGroupOptions(),
            'Select which alert groups to show (leave all unchecked to show all)'
          )}
          ${this._renderMultiSelectEditor(
            'status_filter',
            'Status Filter',
            this._getStatusOptions(),
            'Select which statuses to show (leave all unchecked to show all)'
          )}
        </div>

        <!-- Advanced Options -->
        <div class="section">
          <div class="section-header">Advanced Options</div>

          ${this._renderStringArrayEditor(
            'entity_patterns',
            'Entity Patterns',
            'Patterns to match emergency alert entities (use * for wildcards)'
          )}

          <div class="field">
            <label>Refresh Interval (seconds)</label>
            <div class="field-input">
              <ha-textfield
                type="number"
                .value=${String(this.config.refresh_interval || 30)}
                @input=${(e: Event) =>
                  this._valueChanged(
                    'refresh_interval',
                    parseInt((e.target as HTMLInputElement).value) || 30
                  )}
                min="5"
                max="300"
              ></ha-textfield>
              <div class="help-text">How often to refresh alert data (5-300 seconds)</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

// Register the custom elements
customElements.define('emergency-alerts-card', EmergencyAlertsCard);
customElements.define('emergency-alerts-card-editor', EmergencyAlertsCardEditor);

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
