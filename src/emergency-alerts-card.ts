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
      ...config
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
      'active': [],
      'acknowledged': [],
      'escalated': [],
      'cleared': []
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
      const hasEmergencyAttributes = entity.attributes && 
        (entity.attributes.severity || entity.attributes.group);
      
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
          status: this._getAlertStatus(entity)
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
    if (this.config.severity_filter && 
        !this.config.severity_filter.includes(alert.severity)) {
      return false;
    }
    
    // Group filter
    if (this.config.group_filter && 
        this.config.group_filter.length > 0 &&
        !this.config.group_filter.includes(alert.group)) {
      return false;
    }
    
    // Status filter
    if (this.config.status_filter && 
        !this.config.status_filter.includes(alert.status)) {
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
        case 'first_triggered':
          const aTime = a.first_triggered ? new Date(a.first_triggered).getTime() : 0;
          const bTime = b.first_triggered ? new Date(b.first_triggered).getTime() : 0;
          return bTime - aTime; // Newest first
        case 'severity':
          const severityOrder = { 'critical': 0, 'warning': 1, 'info': 2 };
          return (severityOrder[a.severity as keyof typeof severityOrder] || 3) - 
                 (severityOrder[b.severity as keyof typeof severityOrder] || 3);
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
        return { 'all': alerts };
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
                    : ''} ${alert.escalated
                    ? 'alert-escalated'
                    : ''} ${alert.cleared
                    ? 'alert-cleared'
                    : ''}"
                >
                  ${this.config?.show_severity_icons ? html`
                    <ha-icon
                      class="alert-icon"
                      icon="${this._getSeverityIcon(alert.severity)}"
                      style="color: ${this._getSeverityColor(alert.severity)};"
                    ></ha-icon>
                  ` : ''}
                  
                  <div class="alert-content">
                    <div class="alert-name">${alert.name}</div>
                    <div class="alert-meta">
                      ${this.config?.show_group_labels ? html`
                        <span>${alert.group}</span>
                      ` : ''}
                      ${this.config?.show_timestamps && alert.first_triggered ? html`
                        <span>• ${this._formatTimeAgo(alert.first_triggered)}</span>
                      ` : ''}
                    </div>
                  </div>
                  
                  ${alert.state === 'on' && this._shouldShowActions(alert) ? html`
                    <div class="action-buttons">
                      ${this.config?.show_acknowledge_button && !alert.acknowledged ? html`
                        <button
                          class="action-btn acknowledge-btn"
                          @click="${() => this._handleAcknowledge(alert.entity_id)}"
                        >
                          ${this.config?.button_style === 'icons_only' ? '✓' : 'Acknowledge'}
                        </button>
                      ` : ''}
                      ${this.config?.show_escalate_button ? html`
                        <button
                          class="action-btn escalate-btn"
                          @click="${() => this._handleEscalate(alert.entity_id)}"
                        >
                          ${this.config?.button_style === 'icons_only' ? '↑' : 'Escalate'}
                        </button>
                      ` : ''}
                      ${this.config?.show_clear_button ? html`
                        <button
                          class="action-btn clear-btn"
                          @click="${() => this._handleClear(alert.entity_id)}"
                        >
                          ${this.config?.button_style === 'icons_only' ? '×' : 'Clear'}
                        </button>
                      ` : ''}
                    </div>
                  ` : ''}
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
}

// Register the card
customElements.define('emergency-alerts-card', EmergencyAlertsCard);

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
