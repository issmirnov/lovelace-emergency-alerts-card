/**
 * Emergency Alerts Card for Home Assistant
 * Displays and manages emergency alerts from the Emergency Alerts integration
 *
 * @module emergency-alerts-card
 */
import { LitElement, PropertyValues, TemplateResult } from 'lit';
import { HomeAssistant, CardConfig, Alert, GroupedAlerts } from './types';
/**
 * Custom Lovelace card for displaying emergency alerts
 * Integrates with the Emergency Alerts Home Assistant integration
 *
 * @element emergency-alerts-card
 */
export declare class EmergencyAlertsCard extends LitElement {
    /** Home Assistant instance passed by the frontend */
    hass?: HomeAssistant;
    /** Card configuration from Lovelace YAML */
    config?: CardConfig;
    /** Discovered and filtered alert entities */
    alerts: Alert[];
    /** Alerts grouped by configured strategy */
    grouped: GroupedAlerts;
    /** Service for calling Home Assistant alert actions */
    private alertService?;
    /** Set of entity IDs currently being acted upon (for loading states) */
    private loadingActions;
    /** Cache for compiled regex patterns (performance optimization) */
    private patternCache;
    /** Hash of last seen entity states (for change detection) */
    private lastStatesHash;
    /** Current error notification to display */
    private currentError?;
    /** Interval ID for auto-refresh */
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
        loadingActions: {
            type: ObjectConstructor;
            state: boolean;
        };
        currentError: {
            type: ObjectConstructor;
            state: boolean;
        };
    };
    static styles: import("lit").CSSResult;
    /**
     * Sets the card configuration
     * Called by Home Assistant when card is initialized or config changes
     * @param config Card configuration from Lovelace YAML
     */
    setConfig(config: CardConfig): void;
    /**
     * Lifecycle: called when properties change
     * Implements performance optimization by checking if relevant entities changed
     * @param changedProps Map of changed properties
     */
    protected updated(changedProps: PropertyValues): void;
    /**
     * Performance optimization: checks if any emergency alert entities changed
     * Compares hash of entity IDs and last_updated timestamps
     * @returns true if emergency alerts have changed
     */
    private _hasRelevantChanges;
    /**
     * Discovers and processes all emergency alert entities
     * Applies filtering, sorting, and grouping based on configuration
     */
    private _updateAlerts;
    /**
     * Starts auto-refresh timer if configured
     */
    private _startAutoRefresh;
    /**
     * Lifecycle: cleanup when element is removed
     */
    disconnectedCallback(): void;
    /**
     * Handles errors from alert service
     * Displays error notification to user
     * @param error Error notification object
     */
    private _handleError;
    /**
     * Dismisses the current error notification
     */
    private _dismissError;
    /**
     * Handles acknowledge action with loading state
     * @param entity_id Entity ID to acknowledge
     */
    private _handleAcknowledge;
    /**
     * Handles clear action with loading state
     * @param entity_id Entity ID to clear
     */
    private _handleClear;
    /**
     * Handles escalate action with loading state
     * @param entity_id Entity ID to escalate
     */
    private _handleEscalate;
    /**
     * Handles de-escalate action with loading state
     * @param entity_id Entity ID to de-escalate
     */
    private _handleDeEscalate;
    /**
     * Determines if action buttons should be shown for an alert
     * @param alert Alert to check
     * @returns true if actions should be displayed
     */
    private _shouldShowActions;
    /**
     * Renders the card UI
     * @returns Lit template
     */
    render(): TemplateResult;
    /**
     * Renders error notification if present
     * @returns Lit template
     */
    private _renderErrorNotification;
    /**
     * Renders all alert groups
     * @returns Lit template
     */
    private _renderAlerts;
    /**
     * Renders a single alert group
     * @param group Group name
     * @param alerts Alerts in the group
     * @returns Lit template
     */
    private _renderAlertGroup;
    /**
     * Renders a single alert item
     * @param alert Alert to render
     * @returns Lit template
     */
    private _renderAlert;
    /**
     * Renders alert severity icon
     * @param alert Alert to render icon for
     * @returns Lit template
     */
    private _renderAlertIcon;
    /**
     * Renders alert content (name and metadata)
     * @param alert Alert to render content for
     * @returns Lit template
     */
    private _renderAlertContent;
    /**
     * Renders action buttons for an alert
     * @param alert Alert to render actions for
     * @returns Lit template
     */
    private _renderAlertActions;
    /**
     * Renders acknowledge button if appropriate
     * @param alert Alert to render button for
     * @param isLoading Whether action is in progress
     * @returns Lit template
     */
    private _renderAcknowledgeButton;
    /**
     * Renders escalate/de-escalate button if appropriate
     * @param alert Alert to render button for
     * @param isLoading Whether action is in progress
     * @returns Lit template
     */
    private _renderEscalateButton;
    /**
     * Renders clear button if appropriate
     * @param alert Alert to render button for
     * @param isLoading Whether action is in progress
     * @returns Lit template
     */
    private _renderClearButton;
    /**
     * Returns stub configuration for card picker
     * @returns Default configuration
     */
    static getStubConfig(): CardConfig;
    /**
     * Returns card editor element
     * @returns Editor element
     */
    static getConfigElement(): HTMLElement;
}
/**
 * Card editor for Home Assistant Lovelace UI
 * Provides visual configuration interface for the Emergency Alerts Card
 * Note: This editor will be refactored in a future update to use the modular architecture
 */
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
    static styles: any;
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
    render(): TemplateResult<1>;
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
