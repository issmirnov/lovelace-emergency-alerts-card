import { LitElement, PropertyValues } from 'lit';
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
    show_acknowledged?: boolean;
    show_cleared?: boolean;
    show_escalated?: boolean;
    group_by?: 'severity' | 'group' | 'status' | 'none';
    sort_by?: 'first_triggered' | 'severity' | 'name' | 'group';
    severity_filter?: string[];
    group_filter?: string[];
    status_filter?: string[];
    compact_mode?: boolean;
    show_timestamps?: boolean;
    show_group_labels?: boolean;
    show_severity_icons?: boolean;
    max_alerts_per_group?: number;
    show_acknowledge_button?: boolean;
    show_clear_button?: boolean;
    show_escalate_button?: boolean;
    button_style?: 'compact' | 'full' | 'icons_only';
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
export declare class EmergencyAlertsCard extends LitElement {
    hass?: HomeAssistant;
    config?: CardConfig;
    alerts: Alert[];
    grouped: Record<string, Alert[]>;
    private groupOrder;
    severityOrder: string[];
    private refreshInterval?;
    static get properties(): {
        hass: {
            attribute: boolean;
        };
        config: {
            attribute: boolean;
        };
        alerts: {
            type: ArrayConstructor;
            state: boolean;
        };
        grouped: {
            type: ObjectConstructor;
            state: boolean;
        };
    };
    static styles: import("lit").CSSResult;
    setConfig(config: CardConfig): void;
    protected updated(changedProps: PropertyValues): void;
    private _startAutoRefresh;
    disconnectedCallback(): void;
    _groupAlertsBySeverity(alerts: Alert[]): Record<string, Alert[]>;
    _groupAlertsByGroup(alerts: Alert[]): Record<string, Alert[]>;
    _groupAlertsByStatus(alerts: Alert[]): Record<string, Alert[]>;
    private _updateAlerts;
    private _getAlertStatus;
    private _shouldShowAlert;
    private _sortAlerts;
    private _groupAlerts;
    _handleAcknowledge(entity_id: string): Promise<void>;
    _handleClear(entity_id: string): Promise<void>;
    _handleEscalate(entity_id: string): Promise<void>;
    _handleDeEscalate(entity_id: string): Promise<void>;
    _formatTimeAgo(iso: string): string;
    _getSeverityIcon(severity: string): string;
    _getSeverityColor(severity: string): string;
    private _getGroupTitle;
    private _getGroupCount;
    render(): import("lit-html").TemplateResult<1>;
    private _shouldShowActions;
    static getConfigElement(): HTMLElement;
    static getStubConfig(): CardConfig;
}
export declare class EmergencyAlertsCardEditor extends LitElement {
    hass?: HomeAssistant;
    config?: CardConfig;
    static get properties(): {
        hass: {
            attribute: boolean;
        };
        config: {
            attribute: boolean;
        };
    };
    static styles: import("lit").CSSResult;
    setConfig(config: CardConfig): void;
    private _valueChanged;
    private _fireConfigChanged;
    private _updateStringArray;
    private _addArrayItem;
    private _removeArrayItem;
    private _updateArrayItem;
    private _toggleFilterValue;
    private _getSummaryEntityOptions;
    private _getSeverityOptions;
    private _getStatusOptions;
    private _getGroupOptions;
    private _renderMultiSelectEditor;
    private _renderStringArrayEditor;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface Window {
        customCards: Array<{
            type: string;
            name: string;
            description: string;
        }>;
    }
}
export {};
