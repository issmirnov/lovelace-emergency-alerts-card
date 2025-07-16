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
}

interface Alert {
  entity_id: string;
  name: string;
  state: string;
  severity: string;
  group: string;
  acknowledged: boolean;
  escalated: boolean;
  first_triggered?: string;
  last_cleared?: string;
}

export class EmergencyAlertsCard extends LitElement {
  hass?: HomeAssistant;
  config?: CardConfig;

  public alerts: Alert[] = [];
  public grouped: Record<string, Alert[]> = {};
  private groupOrder: string[] = [];
  public severityOrder: string[] = ['critical', 'warning', 'info'];

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
    }
    .alert-item {
      display: flex;
      align-items: center;
      padding: 8px;
      margin: 4px 0;
      border-radius: 4px;
      background: var(--secondary-background-color);
    }
    .alert-critical {
      border-left: 4px solid #f44336;
    }
    .alert-warning {
      border-left: 4px solid #ff9800;
    }
    .alert-info {
      border-left: 4px solid #2196f3;
    }
    .acknowledged {
      opacity: 0.6;
    }
    .escalated {
      border-left: 4px solid var(--error-color, #f44336);
      background: rgba(244, 67, 54, 0.1);
    }
    .group-header {
      font-weight: bold;
      margin: 16px 0 8px 0;
      padding: 8px;
      border-radius: 4px;
    }
    .action-buttons {
      display: flex;
      gap: 6px;
      margin-left: auto;
    }

    .action-btn {
      padding: 4px 8px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.75em;
      transition: opacity 0.2s;
    }

    .action-btn:hover {
      opacity: 0.8;
    }

    .acknowledge-btn {
      background: var(--primary-color);
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
  `;

  setConfig(config: CardConfig): void {
    if (!config || !config.type) {
      throw new Error('Invalid configuration');
    }
    this.config = config;
  }

  protected updated(changedProps: PropertyValues): void {
    super.updated(changedProps);
    if (changedProps.has('hass')) {
      this._updateAlerts();
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

  private _updateAlerts(): void {
    if (!this.hass) return;

    const alerts: Alert[] = [];
    Object.values(this.hass.states).forEach((entity: any) => {
      if (entity.entity_id.startsWith('binary_sensor.emergency_')) {
        alerts.push({
          entity_id: entity.entity_id,
          name: entity.attributes.friendly_name || entity.entity_id,
          state: entity.state,
          severity: entity.attributes.severity || 'info',
          group: entity.attributes.group || 'other',
          acknowledged: !!entity.attributes.acknowledged,
          escalated: !!entity.attributes.escalated,
          first_triggered: entity.attributes.first_triggered,
          last_cleared: entity.attributes.last_cleared,
        });
      }
    });
    this.alerts = alerts;
    this.grouped = this._groupAlertsBySeverity(alerts);
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
    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
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

  render() {
    if (!this.hass) {
      return html`<div class="card">Loading...</div>`;
    }

    const totalActive = this.alerts.filter(a => a.state === 'on' && !a.acknowledged).length;

    return html`
      <div class="card">
        <div class="summary-header">Emergency Alerts (${totalActive} active)</div>

        ${this.severityOrder.map(sev => {
          const alerts = this.grouped[sev] || [];
          const activeCount = alerts.filter(a => a.state === 'on' && !a.acknowledged).length;

          if (alerts.length === 0) return '';

          return html`
            <div class="group-header alert-${sev}">
              ${sev.charAt(0).toUpperCase() + sev.slice(1)} (${activeCount})
            </div>
            ${alerts.map(
              alert => html`
                <div
                  class="alert-item alert-${alert.severity} ${alert.acknowledged
                    ? 'acknowledged'
                    : ''} ${alert.escalated
                    ? 'escalated'
                    : ''}"
                >
                  <ha-icon
                    icon="${this._getSeverityIcon(alert.severity)}"
                    style="color: ${this._getSeverityColor(alert.severity)}; margin-right: 8px;"
                  ></ha-icon>
                  <div style="flex: 1;">
                    <div>${alert.name}</div>
                    <div style="font-size: 0.8em; opacity: 0.7;">
                      ${alert.group} • ${this._formatTimeAgo(alert.first_triggered || '')}
                    </div>
                  </div>
                  ${alert.state === 'on' 
                    ? html`
                        <div class="action-buttons">
                          ${!alert.acknowledged
                            ? html`
                                <button
                                  class="action-btn acknowledge-btn"
                                  @click="${() => this._handleAcknowledge(alert.entity_id)}"
                                >
                                  Acknowledge
                                </button>
                              `
                            : ''}
                          <button
                            class="action-btn escalate-btn"
                            @click="${() => this._handleEscalate(alert.entity_id)}"
                          >
                            Escalate
                          </button>
                          <button
                            class="action-btn clear-btn"
                            @click="${() => this._handleClear(alert.entity_id)}"
                          >
                            Clear
                          </button>
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
