import { LitElement, html, css, PropertyValues } from 'lit';

// Type definitions
interface HomeAssistant {
  states: Record<string, any>;
  callService: (domain: string, service: string, data?: any) => Promise<any>;
  config: {
    language: string;
  };
}

interface CardConfig {
  type: string;
  summary_entity?: string;

  // Display options
  show_acknowledged?: boolean;
  show_cleared?: boolean;
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
  max_alerts_per_group?: number;

  // Action options
  show_acknowledge_button?: boolean;
  show_clear_button?: boolean;
  show_escalate_button?: boolean;
  button_style?: 'compact' | 'full' | 'icons_only';

  // Advanced
  entity_patterns?: string[];
  refresh_interval?: number;
}

interface Alert {
  entity_id: string;
  name: string;
  state: string;
  severity: string;
  group: string;
  acknowledged: boolean;
  escalated: boolean;
  cleared: boolean;
  first_triggered?: string;
  last_cleared?: string;
  status: string;
}

export class EmergencyAlertsCard extends LitElement {
  hass?: HomeAssistant;
  config?: CardConfig;

  public alerts: Alert[] = [];
  public grouped: Record<string, Alert[]> = {};
  private groupOrder: string[] = [];
  public severityOrder: string[] = ['critical', 'warning', 'info'];
  private refreshInterval?: number;

  static get properties() {
    return {
      hass: { attribute: false },
      config: { attribute: false },
      alerts: { type: Array, state: true },
      grouped: { type: Object, state: true },
    };
  }

  static styles = css`
    .card {
      padding: 16px;
      background: var(--ha-card-background, white);
      border-radius: var(--ha-card-border-radius, 8px);
      box-shadow: var(--ha-card-box-shadow, 0 2px 4px rgba(0, 0, 0, 0.1));
    }

    .summary-header {
      font-size: 1.2em;
      font-weight: bold;
      margin-bottom: 16px;
      text-align: center;
      color: var(--primary-text-color);
    }

    .alert-item {
      display: flex;
      align-items: center;
      padding: 12px;
      margin: 6px 0;
      border-radius: 8px;
      background: var(--secondary-background-color, #f5f5f5);
      transition: all 0.2s ease;
      border-left: 4px solid transparent;
    }

    .alert-item:hover {
      background: var(--secondary-background-color-hover, #e8e8e8);
    }

    .alert-critical {
      border-left-color: #f44336;
    }

    .alert-warning {
      border-left-color: #ff9800;
    }

    .alert-info {
      border-left-color: #2196f3;
    }

    .alert-acknowledged {
      opacity: 0.7;
      background: var(--disabled-text-color, #bdbdbd);
    }

    .alert-escalated {
      border-left-color: #9c27b0;
      background: rgba(156, 39, 176, 0.1);
    }

    .alert-cleared {
      opacity: 0.5;
      background: var(--disabled-text-color, #e0e0e0);
    }

    .group-header {
      font-weight: bold;
      margin: 20px 0 12px 0;
      padding: 8px 12px;
      border-radius: 6px;
      background: var(--primary-color, #1976d2);
      color: white;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .group-header.alert-critical {
      background: #f44336;
    }

    .group-header.alert-warning {
      background: #ff9800;
    }

    .group-header.alert-info {
      background: #2196f3;
    }

    .action-buttons {
      display: flex;
      gap: 8px;
      margin-left: auto;
      flex-wrap: wrap;
      justify-content: flex-end;
    }

    /* Responsive design for narrow columns */
    @media (max-width: 600px) {
      .action-buttons {
        flex-direction: column;
        gap: 4px;
        margin-left: 0;
        margin-top: 8px;
        width: 100%;
      }

      .action-btn {
        width: 100%;
        justify-content: center;
      }

      .alert-item {
        flex-direction: column;
        align-items: stretch;
      }

      .alert-content {
        margin-right: 0;
        margin-bottom: 8px;
      }
    }

    /* For very narrow columns (mobile) */
    @media (max-width: 400px) {
      .action-buttons {
        gap: 3px;
      }

      .action-btn {
        padding: 5px 8px;
        font-size: 0.75em;
      }
    }

    .action-btn {
      padding: 6px 12px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.8em;
      font-weight: 500;
      transition: all 0.2s ease;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .action-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .action-btn:active {
      transform: translateY(0);
    }

    .acknowledge-btn {
      background: var(--primary-color, #1976d2);
      color: white;
    }

    .clear-btn {
      background: var(--success-color, #4caf50);
      color: white;
    }

    .escalate-btn {
      background: var(--error-color, #f44336);
      color: white;
    }

    .de-escalate-btn {
      background: var(--warning-color, #ff9800);
      color: white;
    }

    .alert-content {
      flex: 1;
      margin-right: 12px;
    }

    .alert-name {
      font-weight: 500;
      color: var(--primary-text-color);
      margin-bottom: 4px;
    }

    .alert-meta {
      font-size: 0.8em;
      color: var(--secondary-text-color);
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .alert-icon {
      margin-right: 12px;
      font-size: 1.2em;
    }

    .compact .alert-item {
      padding: 8px;
      margin: 3px 0;
    }

    .compact .action-btn {
      padding: 4px 8px;
      font-size: 0.7em;
    }

    /* Compact mode responsive adjustments */
    @media (max-width: 600px) {
      .compact .action-buttons {
        gap: 3px;
      }

      .compact .action-btn {
        padding: 3px 6px;
        font-size: 0.65em;
      }
    }

    .no-alerts {
      text-align: center;
      padding: 32px;
      color: var(--secondary-text-color);
      font-style: italic;
    }
  `;

  setConfig(config: CardConfig): void {
    if (!config || !config.type) {
      throw new Error('Invalid configuration');
    }

    // Set defaults
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

  protected updated(changedProps: PropertyValues): void {
    super.updated(changedProps);
    if (changedProps.has('hass')) {
      this._updateAlerts();
    }
  }

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

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  public _groupAlertsBySeverity(alerts: Alert[]): Record<string, Alert[]> {
    const grouped: Record<string, Alert[]> = {};
    this.severityOrder.forEach(sev => (grouped[sev] = []));

    for (const alert of alerts) {
      grouped[alert.severity] = grouped[alert.severity] || [];
      grouped[alert.severity].push(alert);
    }
    return grouped;
  }

  public _groupAlertsByGroup(alerts: Alert[]): Record<string, Alert[]> {
    const grouped: Record<string, Alert[]> = {};

    for (const alert of alerts) {
      const group = alert.group || 'other';
      grouped[group] = grouped[group] || [];
      grouped[group].push(alert);
    }
    return grouped;
  }

  public _groupAlertsByStatus(alerts: Alert[]): Record<string, Alert[]> {
    const grouped: Record<string, Alert[]> = {
      active: [],
      acknowledged: [],
      escalated: [],
      cleared: [],
    };

    for (const alert of alerts) {
      grouped[alert.status].push(alert);
    }
    return grouped;
  }

  private _updateAlerts(): void {
    if (!this.hass || !this.config) return;

    const alerts: Alert[] = [];
    const patterns = this.config.entity_patterns || ['binary_sensor.emergency_*'];

    Object.values(this.hass.states).forEach((entity: any) => {
      // Check if entity matches any pattern
      const matchesPattern = patterns.some(pattern => {
        if (pattern.includes('*')) {
          const regex = new RegExp(pattern.replace(/\*/g, '.*'));
          return regex.test(entity.entity_id);
        }
        return entity.entity_id === pattern;
      });

      // Also check if entity has emergency alert attributes
      const hasEmergencyAttributes =
        entity.attributes && (entity.attributes.severity || entity.attributes.group);

      if (matchesPattern || hasEmergencyAttributes) {
        const alert: Alert = {
          entity_id: entity.entity_id,
          name: entity.attributes.friendly_name || entity.entity_id,
          state: entity.state,
          severity: entity.attributes.severity || 'info',
          group: entity.attributes.group || 'other',
          acknowledged: !!entity.attributes.acknowledged,
          escalated: !!entity.attributes.escalated,
          cleared: !!entity.attributes.cleared,
          first_triggered: entity.attributes.first_triggered,
          last_cleared: entity.attributes.last_cleared,
          status: this._getAlertStatus(entity),
        };

        // Apply filters
        if (this._shouldShowAlert(alert)) {
          alerts.push(alert);
        }
      }
    });

    // Sort alerts
    this._sortAlerts(alerts);

    this.alerts = alerts;
    this.grouped = this._groupAlerts(alerts);
  }

  private _getAlertStatus(entity: any): string {
    if (entity.attributes.cleared) return 'cleared';
    if (entity.attributes.acknowledged) return 'acknowledged';
    if (entity.attributes.escalated) return 'escalated';
    if (entity.state === 'on') return 'active';
    return 'inactive';
  }

  private _shouldShowAlert(alert: Alert): boolean {
    if (!this.config) return true;

    // Severity filter
    if (this.config.severity_filter && !this.config.severity_filter.includes(alert.severity)) {
      return false;
    }

    // Group filter
    if (
      this.config.group_filter &&
      this.config.group_filter.length > 0 &&
      !this.config.group_filter.includes(alert.group)
    ) {
      return false;
    }

    // Status filter
    if (this.config.status_filter && !this.config.status_filter.includes(alert.status)) {
      return false;
    }

    // Individual status toggles
    if (!this.config.show_acknowledged && alert.acknowledged) return false;
    if (!this.config.show_cleared && alert.cleared) return false;
    if (!this.config.show_escalated && alert.escalated) return false;

    return true;
  }

  private _sortAlerts(alerts: Alert[]): void {
    if (!this.config) return;

    alerts.sort((a, b) => {
      switch (this.config!.sort_by) {
        case 'first_triggered': {
          const aTime = a.first_triggered ? new Date(a.first_triggered).getTime() : 0;
          const bTime = b.first_triggered ? new Date(b.first_triggered).getTime() : 0;
          return bTime - aTime; // Newest first
        }
        case 'severity': {
          const severityOrder = { critical: 0, warning: 1, info: 2 };
          return (
            (severityOrder[a.severity as keyof typeof severityOrder] || 3) -
            (severityOrder[b.severity as keyof typeof severityOrder] || 3)
          );
        }
        case 'name':
          return a.name.localeCompare(b.name);
        case 'group':
          return a.group.localeCompare(b.group);
        default:
          return 0;
      }
    });
  }

  private _groupAlerts(alerts: Alert[]): Record<string, Alert[]> {
    if (!this.config) return {};

    switch (this.config.group_by) {
      case 'group':
        return this._groupAlertsByGroup(alerts);
      case 'status':
        return this._groupAlertsByStatus(alerts);
      case 'none':
        return { all: alerts };
      case 'severity':
      default:
        return this._groupAlertsBySeverity(alerts);
    }
  }

  public async _handleAcknowledge(entity_id: string): Promise<void> {
    if (!this.hass) return;
    await this.hass.callService('emergency_alerts', 'acknowledge', { entity_id });
  }

  public async _handleClear(entity_id: string): Promise<void> {
    if (!this.hass) return;
    await this.hass.callService('emergency_alerts', 'clear', { entity_id });
  }

  public async _handleEscalate(entity_id: string): Promise<void> {
    if (!this.hass) return;
    await this.hass.callService('emergency_alerts', 'escalate', { entity_id });
  }

  public async _handleDeEscalate(entity_id: string): Promise<void> {
    if (!this.hass) return;
    // For de-escalation, we can use the acknowledge service to reset the escalated state
    await this.hass.callService('emergency_alerts', 'acknowledge', { entity_id });
  }

  public _formatTimeAgo(iso: string): string {
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

  public _getSeverityIcon(severity: string): string {
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

  public _getSeverityColor(severity: string): string {
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

  private _getGroupTitle(group: string): string {
    if (!this.config) return group;

    switch (this.config.group_by) {
      case 'group':
        return group.charAt(0).toUpperCase() + group.slice(1);
      case 'status':
        return group.charAt(0).toUpperCase() + group.slice(1);
      case 'severity':
        return group.charAt(0).toUpperCase() + group.slice(1);
      default:
        return 'All Alerts';
    }
  }

  private _getGroupCount(alerts: Alert[]): number {
    if (!this.config) return alerts.length;

    switch (this.config.group_by) {
      case 'status':
        return alerts.length; // Show total count for status groups
      default:
        return alerts.filter(a => a.state === 'on').length;
    }
  }

  render() {
    if (!this.hass) {
      return html`<div class="card">Loading...</div>`;
    }

    const totalActive = this.alerts.filter(a => a.state === 'on').length;
    const cardClass = this.config?.compact_mode ? 'compact' : '';

    if (this.alerts.length === 0) {
      return html`
        <div class="card">
          <div class="summary-header">Emergency Alerts (0 active)</div>
          <div class="no-alerts">No alerts to display</div>
        </div>
      `;
    }

    return html`
      <div class="card ${cardClass}">
        <div class="summary-header">Emergency Alerts (${totalActive} active)</div>

        ${Object.entries(this.grouped).map(([group, alerts]) => {
          if (alerts.length === 0) return '';

          const groupCount = this._getGroupCount(alerts);
          const groupTitle = this._getGroupTitle(group);
          const severityClass = this.config?.group_by === 'severity' ? `alert-${group}` : '';

          return html`
            <div class="group-header ${severityClass}">
              <span>${groupTitle} (${groupCount})</span>
            </div>
            ${alerts.slice(0, this.config?.max_alerts_per_group || 50).map(
              alert => html`
                <div
                  class="alert-item alert-${alert.severity} ${alert.acknowledged
                    ? 'alert-acknowledged'
                    : ''} ${alert.escalated ? 'alert-escalated' : ''} ${alert.cleared
                    ? 'alert-cleared'
                    : ''}"
                >
                  ${this.config?.show_severity_icons
                    ? html`
                        <ha-icon
                          class="alert-icon"
                          icon="${this._getSeverityIcon(alert.severity)}"
                          style="color: ${this._getSeverityColor(alert.severity)};"
                        ></ha-icon>
                      `
                    : ''}

                  <div class="alert-content">
                    <div class="alert-name">${alert.name}</div>
                    <div class="alert-meta">
                      ${this.config?.show_group_labels ? html` <span>${alert.group}</span> ` : ''}
                      ${this.config?.show_timestamps && alert.first_triggered
                        ? html` <span>• ${this._formatTimeAgo(alert.first_triggered)}</span> `
                        : ''}
                    </div>
                  </div>

                  ${alert.state === 'on' && this._shouldShowActions(alert)
                    ? html`
                        <div class="action-buttons">
                          ${this.config?.show_acknowledge_button && !alert.acknowledged && !alert.escalated
                            ? html`
                                <button
                                  class="action-btn acknowledge-btn"
                                  @click="${() => this._handleAcknowledge(alert.entity_id)}"
                                >
                                  ${this.config?.button_style === 'icons_only'
                                    ? '✓'
                                    : 'ACK'}
                                </button>
                              `
                            : ''}
                          ${this.config?.show_escalate_button
                            ? html`
                                <button
                                  class="action-btn ${alert.escalated ? 'de-escalate-btn' : 'escalate-btn'}"
                                  @click="${() => alert.escalated 
                                    ? this._handleDeEscalate(alert.entity_id) 
                                    : this._handleEscalate(alert.entity_id)}"
                                >
                                  ${this.config?.button_style === 'icons_only' 
                                    ? (alert.escalated ? '↓' : '↑') 
                                    : (alert.escalated ? 'DE-ESC' : 'ESC')}
                                </button>
                              `
                            : ''}
                          ${this.config?.show_clear_button
                            ? html`
                                <button
                                  class="action-btn clear-btn"
                                  @click="${() => this._handleClear(alert.entity_id)}"
                                >
                                  ${this.config?.button_style === 'icons_only' ? '×' : 'CLR'}
                                </button>
                              `
                            : ''}
                        </div>
                      `
                    : ''}
                </div>
              `
            )}
          `;
        })}
      </div>
    `;
  }

  private _shouldShowActions(alert: Alert): boolean {
    return !alert.cleared;
  }

  // Add static methods for Home Assistant card editor support
  static getConfigElement() {
    return document.createElement('emergency-alerts-card-editor');
  }

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
}

// Configuration Editor Class
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

    .checkbox-item {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .help-text {
      font-size: 0.8em;
      color: var(--secondary-text-color);
      margin-top: 4px;
      font-style: italic;
    }

    .entity-patterns {
      width: 100%;
      min-height: 100px;
      font-family: monospace;
      resize: vertical;
    }

    mwc-button {
      margin: 4px;
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

  private _valueChanged(field: string, value: any): void {
    if (!this.config) return;

    try {
      const newConfig = { ...this.config };

      // Handle nested object updates
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        const parentKey = parent as keyof CardConfig;
        const parentValue = newConfig[parentKey];

        if (parentValue && typeof parentValue === 'object') {
          (newConfig[parentKey] as any) = {
            ...parentValue,
            [child]: value,
          };
        } else {
          (newConfig[parentKey] as any) = {
            [child]: value,
          };
        }
      } else {
        // Type-safe assignment for known fields
        switch (field) {
          case 'button_style':
            if (['compact', 'full', 'icons_only'].includes(value)) {
              (newConfig as any)[field] = value;
            } else {
              console.warn(`Invalid button_style value: ${value}`);
              return;
            }
            break;
          case 'group_by':
            if (['severity', 'group', 'status', 'none'].includes(value)) {
              (newConfig as any)[field] = value;
            } else {
              console.warn(`Invalid group_by value: ${value}`);
              return;
            }
            break;
          case 'sort_by':
            if (['first_triggered', 'severity', 'name', 'group'].includes(value)) {
              (newConfig as any)[field] = value;
            } else {
              console.warn(`Invalid sort_by value: ${value}`);
              return;
            }
            break;
          default:
            (newConfig as any)[field] = value;
        }
      }

      this.config = newConfig;
      this._fireConfigChanged();
    } catch (error) {
      console.error(`Error updating field ${field}:`, error);
    }
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
    const currentArray = (this.config as any)?.[field] || [];
    this._updateStringArray(field, [...currentArray, '']);
  }

  private _removeArrayItem(field: string, index: number): void {
    const currentArray = (this.config as any)?.[field] || [];
    const newArray = currentArray.filter((_: any, i: number) => i !== index);
    this._updateStringArray(field, newArray);
  }

  private _updateArrayItem(field: string, index: number, value: string): void {
    const currentArray = (this.config as any)?.[field] || [];
    const newArray = [...currentArray];
    newArray[index] = value;
    this._updateStringArray(field, newArray);
  }

  private _toggleFilterValue(field: string, value: string, checked: boolean): void {
    const currentArray = (this.config as any)?.[field] || [];
    let newArray: string[];

    if (checked) {
      // Add value if not already present
      newArray = currentArray.includes(value) ? currentArray : [...currentArray, value];
    } else {
      // Remove value if present
      newArray = currentArray.filter((v: string) => v !== value);
    }

    this._updateStringArray(field, newArray);
  }

  private _getSummaryEntityOptions() {
    if (!this.hass) return [];

    const summaryEntities = Object.values(this.hass.states)
      .filter((entity: any) => {
        const entityId = entity.entity_id;
        return entityId.startsWith('sensor.emergency_alerts') && 
               (entityId.includes('summary') || entityId.includes('Summary'));
      })
      .sort((a: any, b: any) => a.entity_id.localeCompare(b.entity_id));

    return summaryEntities.map((entity: any) => html`
      <mwc-list-item value="${entity.entity_id}">
        ${entity.attributes?.friendly_name || entity.entity_id}
      </mwc-list-item>
    `);
  }

  private _getSeverityOptions() {
    return [
      { value: 'critical', label: 'Critical' },
      { value: 'warning', label: 'Warning' },
      { value: 'info', label: 'Info' }
    ];
  }

  private _getStatusOptions() {
    return [
      { value: 'active', label: 'Active' },
      { value: 'acknowledged', label: 'Acknowledged' },
      { value: 'escalated', label: 'Escalated' },
      { value: 'cleared', label: 'Cleared' }
    ];
  }

  private _getGroupOptions() {
    if (!this.hass) return [];

    const groups = new Set<string>();
    Object.values(this.hass.states).forEach((entity: any) => {
      if (entity.attributes?.group) {
        groups.add(entity.attributes.group);
      }
    });

    return Array.from(groups).sort().map(group => ({
      value: group,
      label: group.charAt(0).toUpperCase() + group.slice(1)
    }));
  }

  private _renderMultiSelectEditor(field: string, label: string, options: Array<{value: string, label: string}>, helpText?: string) {
    const selectedValues = (this.config as any)?.[field] || [];
    
    return html`
      <div class="field">
        <label>${label}</label>
        <div class="field-input">
          <div class="multi-select-container">
            ${options.map(option => html`
              <div class="checkbox-item">
                <ha-checkbox
                  .checked=${selectedValues.includes(option.value)}
                  @change=${(e: any) => this._toggleFilterValue(field, option.value, e.target.checked)}
                ></ha-checkbox>
                <span class="checkbox-label">${option.label}</span>
              </div>
            `)}
          </div>
          ${helpText ? html`<div class="help-text">${helpText}</div>` : ''}
        </div>
      </div>
    `;
  }

  private _renderStringArrayEditor(field: string, label: string, helpText?: string) {
    const values = (this.config as any)?.[field] || [];

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
                    @input=${(e: any) => this._updateArrayItem(field, index, e.target.value)}
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
                @change=${(e: Event) => {
                  const target = e.target as any;
                  this._valueChanged('summary_entity', target.value);
                }}
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
                @change=${(e: Event) => {
                  const target = e.target as any;
                  this._valueChanged('group_by', target.value);
                }}
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
                @change=${(e: Event) => {
                  const target = e.target as any;
                  this._valueChanged('sort_by', target.value);
                }}
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
              @change=${(e: any) => this._valueChanged('show_acknowledged', e.target.checked)}
            ></ha-switch>
          </div>

          <div class="field">
            <label>Show Cleared Alerts</label>
            <ha-switch
              .checked=${this.config.show_cleared ?? false}
              @change=${(e: any) => this._valueChanged('show_cleared', e.target.checked)}
            ></ha-switch>
          </div>

          <div class="field">
            <label>Show Escalated Alerts</label>
            <ha-switch
              .checked=${this.config.show_escalated ?? true}
              @change=${(e: any) => this._valueChanged('show_escalated', e.target.checked)}
            ></ha-switch>
          </div>

          <div class="field">
            <label>Compact Mode</label>
            <ha-switch
              .checked=${this.config.compact_mode ?? false}
              @change=${(e: any) => this._valueChanged('compact_mode', e.target.checked)}
            ></ha-switch>
          </div>

          <div class="field">
            <label>Show Timestamps</label>
            <ha-switch
              .checked=${this.config.show_timestamps ?? true}
              @change=${(e: any) => this._valueChanged('show_timestamps', e.target.checked)}
            ></ha-switch>
          </div>

          <div class="field">
            <label>Show Group Labels</label>
            <ha-switch
              .checked=${this.config.show_group_labels ?? true}
              @change=${(e: any) => this._valueChanged('show_group_labels', e.target.checked)}
            ></ha-switch>
          </div>

          <div class="field">
            <label>Show Severity Icons</label>
            <ha-switch
              .checked=${this.config.show_severity_icons ?? true}
              @change=${(e: any) => this._valueChanged('show_severity_icons', e.target.checked)}
            ></ha-switch>
          </div>

          <div class="field">
            <label>Max Alerts Per Group</label>
            <div class="field-input">
              <ha-textfield
                type="number"
                .value=${String(this.config.max_alerts_per_group || 10)}
                @input=${(e: any) =>
                  this._valueChanged('max_alerts_per_group', parseInt(e.target.value) || 10)}
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
              @change=${(e: any) => this._valueChanged('show_acknowledge_button', e.target.checked)}
            ></ha-switch>
          </div>

          <div class="field">
            <label>Show Clear Button</label>
            <ha-switch
              .checked=${this.config.show_clear_button ?? true}
              @change=${(e: any) => this._valueChanged('show_clear_button', e.target.checked)}
            ></ha-switch>
          </div>

          <div class="field">
            <label>Show Escalate Button</label>
            <ha-switch
              .checked=${this.config.show_escalate_button ?? true}
              @change=${(e: any) => this._valueChanged('show_escalate_button', e.target.checked)}
            ></ha-switch>
          </div>

          <div class="field">
            <label>Button Style</label>
            <div class="field-input">
              <ha-select
                .value=${this.config.button_style || 'compact'}
                @change=${(e: Event) => {
                  const target = e.target as any;
                  this._valueChanged('button_style', target.value);
                }}
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
                @input=${(e: any) =>
                  this._valueChanged('refresh_interval', parseInt(e.target.value) || 30)}
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

// Register the card and editor
customElements.define('emergency-alerts-card', EmergencyAlertsCard);
customElements.define('emergency-alerts-card-editor', EmergencyAlertsCardEditor);

declare global {
  interface Window {
    customCards: Array<{
      type: string;
      name: string;
      description: string;
    }>;
  }
}

(window.customCards = window.customCards || []).push({
  type: 'emergency-alerts-card',
  name: 'Emergency Alerts Card',
  description: 'A card to display emergency alerts from the Emergency Alerts integration',
});
