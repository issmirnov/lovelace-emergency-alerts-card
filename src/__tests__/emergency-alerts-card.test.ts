/**
 * Tests for Emergency Alerts Card
 */

// Import the card class directly instead of relying on custom element registration
import { EmergencyAlertsCard } from '../emergency-alerts-card';

describe('EmergencyAlertsCard', () => {
  let card: EmergencyAlertsCard;
  let mockHass: any;

  beforeEach(() => {
    // Create a fresh card instance directly
    card = new EmergencyAlertsCard();

    // Setup mock hass
    mockHass = {
      states: {
        'binary_sensor.emergency_door_open': {
          entity_id: 'binary_sensor.emergency_door_open',
          state: 'on',
          attributes: {
            friendly_name: 'Emergency: Door Open',
            severity: 'critical',
            group: 'security',
            acknowledged: false,
            escalated: false,
            first_triggered: '2023-01-01T12:00:00Z',
          },
        },
      },
      callService: jest.fn().mockResolvedValue({}),
      config: {
        language: 'en',
      },
    };

    card.hass = mockHass;
    card.config = {
      type: 'custom:emergency-alerts-card',
    };
  });

  test('should create card element', () => {
    expect(card).toBeDefined();
    expect(card).toBeInstanceOf(EmergencyAlertsCard);
  });

  test('should render with default config', () => {
    card.setConfig({
      type: 'custom:emergency-alerts-card',
    });

    expect(card.config).toBeDefined();
    expect(card.config?.type).toBe('custom:emergency-alerts-card');
  });

  test('should throw error for invalid config', () => {
    expect(() => {
      card.setConfig({} as any);
    }).toThrow('Invalid configuration');
  });

  test('should group alerts by severity', () => {
    const alerts = [
      { severity: 'critical', entity_id: '1' },
      { severity: 'warning', entity_id: '2' },
      { severity: 'critical', entity_id: '3' },
    ] as any[];

    const grouped = card._groupAlertsBySeverity(alerts);

    expect(grouped.critical).toHaveLength(2);
    expect(grouped.warning).toHaveLength(1);
    expect(grouped.info).toHaveLength(0);
  });

  test('should format time correctly', () => {
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    expect(card._formatTimeAgo(fiveMinutesAgo.toISOString())).toBe('5 minutes ago');
    expect(card._formatTimeAgo(oneHourAgo.toISOString())).toBe('1 hour ago');
    expect(card._formatTimeAgo('')).toBe('');
  });

  test('should handle acknowledge action', async () => {
    const entityId = 'binary_sensor.emergency_door_open';

    await card._handleAcknowledge(entityId);

    expect(mockHass.callService).toHaveBeenCalledWith('emergency_alerts', 'acknowledge', {
      entity_id: entityId,
    });
  });

  test('should get severity icon correctly', () => {
    expect(card._getSeverityIcon('critical')).toBe('mdi:alert-circle');
    expect(card._getSeverityIcon('warning')).toBe('mdi:alert');
    expect(card._getSeverityIcon('info')).toBe('mdi:information');
    expect(card._getSeverityIcon('unknown')).toBe('mdi:help-circle');
  });

  test('should get severity color correctly', () => {
    expect(card._getSeverityColor('critical')).toBe('#f44336');
    expect(card._getSeverityColor('warning')).toBe('#ff9800');
    expect(card._getSeverityColor('info')).toBe('#2196f3');
    expect(card._getSeverityColor('unknown')).toBe('#9e9e9e');
  });

  test('should handle missing hass gracefully', () => {
    card.hass = undefined;

    // Should not throw error and return loading state
    const result = card.render();
    expect(result).toBeDefined();
  });

  test('should update alerts when hass changes', () => {
    // Initially no alerts
    expect(card.alerts).toHaveLength(0);

    // Trigger the private update method directly
    (card as any)._updateAlerts();

    // Should have one alert from mockHass
    expect(card.alerts).toHaveLength(1);
    expect(card.alerts[0].entity_id).toBe('binary_sensor.emergency_door_open');
    expect(card.alerts[0].severity).toBe('critical');
  });

  test('should handle acknowledge action without hass', async () => {
    card.hass = undefined;

    // Should not throw error
    await expect(card._handleAcknowledge('test_entity')).resolves.toBeUndefined();
  });

  test('should handle clear action', async () => {
    const entityId = 'binary_sensor.emergency_door_open';

    await card._handleClear(entityId);

    expect(mockHass.callService).toHaveBeenCalledWith('emergency_alerts', 'clear', {
      entity_id: entityId,
    });
  });

  test('should handle escalate action', async () => {
    const entityId = 'binary_sensor.emergency_door_open';

    await card._handleEscalate(entityId);

    expect(mockHass.callService).toHaveBeenCalledWith('emergency_alerts', 'escalate', {
      entity_id: entityId,
    });
  });

  test('should handle clear action without hass', async () => {
    card.hass = undefined;

    // Should not throw error
    await expect(card._handleClear('test_entity')).resolves.toBeUndefined();
  });

  test('should handle escalate action without hass', async () => {
    card.hass = undefined;

    // Should not throw error
    await expect(card._handleEscalate('test_entity')).resolves.toBeUndefined();
  });
});
