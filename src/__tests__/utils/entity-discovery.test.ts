/**
 * Tests for entity discovery utilities
 */

import {
  getAlertStatus,
  hasEmergencyAttributes,
  entityToAlert,
  discoverAlertEntities,
  createEntityStateHash,
} from '../../utils/entity-discovery';
import { HassEntity, EmergencyAlertEntity, HassEntities } from '../../types';

describe('entity-discovery', () => {
  describe('getAlertStatus', () => {
    test('returns cleared for cleared alerts', () => {
      const entity: HassEntity = {
        entity_id: 'test',
        state: 'on',
        attributes: { cleared: true, acknowledged: false, escalated: false },
        last_changed: '',
        last_updated: '',
        context: { id: '', parent_id: null, user_id: null },
      };

      expect(getAlertStatus(entity)).toBe('cleared');
    });

    test('returns acknowledged for acknowledged alerts', () => {
      const entity: HassEntity = {
        entity_id: 'test',
        state: 'on',
        attributes: { cleared: false, acknowledged: true, escalated: false },
        last_changed: '',
        last_updated: '',
        context: { id: '', parent_id: null, user_id: null },
      };

      expect(getAlertStatus(entity)).toBe('acknowledged');
    });

    test('returns escalated for escalated alerts', () => {
      const entity: HassEntity = {
        entity_id: 'test',
        state: 'on',
        attributes: { cleared: false, acknowledged: false, escalated: true },
        last_changed: '',
        last_updated: '',
        context: { id: '', parent_id: null, user_id: null },
      };

      expect(getAlertStatus(entity)).toBe('escalated');
    });

    test('returns active for active alerts', () => {
      const entity: HassEntity = {
        entity_id: 'test',
        state: 'on',
        attributes: { cleared: false, acknowledged: false, escalated: false },
        last_changed: '',
        last_updated: '',
        context: { id: '', parent_id: null, user_id: null },
      };

      expect(getAlertStatus(entity)).toBe('active');
    });

    test('returns inactive for off state', () => {
      const entity: HassEntity = {
        entity_id: 'test',
        state: 'off',
        attributes: { cleared: false, acknowledged: false, escalated: false },
        last_changed: '',
        last_updated: '',
        context: { id: '', parent_id: null, user_id: null },
      };

      expect(getAlertStatus(entity)).toBe('inactive');
    });
  });

  describe('hasEmergencyAttributes', () => {
    test('returns true if entity has severity attribute', () => {
      const entity: HassEntity = {
        entity_id: 'test',
        state: 'on',
        attributes: { severity: 'critical' },
        last_changed: '',
        last_updated: '',
        context: { id: '', parent_id: null, user_id: null },
      };

      expect(hasEmergencyAttributes(entity)).toBe(true);
    });

    test('returns true if entity has group attribute', () => {
      const entity: HassEntity = {
        entity_id: 'test',
        state: 'on',
        attributes: { group: 'security' },
        last_changed: '',
        last_updated: '',
        context: { id: '', parent_id: null, user_id: null },
      };

      expect(hasEmergencyAttributes(entity)).toBe(true);
    });

    test('returns false if entity has no emergency attributes', () => {
      const entity: HassEntity = {
        entity_id: 'test',
        state: 'on',
        attributes: { something: 'else' },
        last_changed: '',
        last_updated: '',
        context: { id: '', parent_id: null, user_id: null },
      };

      expect(hasEmergencyAttributes(entity)).toBe(false);
    });

    test('returns false if attributes is null', () => {
      const entity = {
        entity_id: 'test',
        state: 'on',
        attributes: null,
        last_changed: '',
        last_updated: '',
        context: { id: '', parent_id: null, user_id: null },
      } as any;

      expect(hasEmergencyAttributes(entity)).toBe(false);
    });
  });

  describe('entityToAlert', () => {
    test('converts entity to alert', () => {
      const entity: EmergencyAlertEntity = {
        entity_id: 'binary_sensor.test',
        state: 'on',
        attributes: {
          friendly_name: 'Test Alert',
          severity: 'critical',
          group: 'security',
          acknowledged: false,
          escalated: false,
          cleared: false,
          first_triggered: '2024-01-01T10:00:00Z',
        },
        last_changed: '',
        last_updated: '',
        context: { id: '', parent_id: null, user_id: null },
      };

      const alert = entityToAlert(entity);

      expect(alert).toMatchObject({
        entity_id: 'binary_sensor.test',
        name: 'Test Alert',
        state: 'on',
        severity: 'critical',
        group: 'security',
        acknowledged: false,
        escalated: false,
        cleared: false,
        first_triggered: '2024-01-01T10:00:00Z',
        status: 'active',
      });
    });

    test('uses defaults for missing attributes', () => {
      const entity: any = {
        entity_id: 'binary_sensor.test',
        state: 'on',
        attributes: {},
        last_changed: '',
        last_updated: '',
        context: { id: '', parent_id: null, user_id: null },
      };

      const alert = entityToAlert(entity);

      expect(alert.name).toBe('binary_sensor.test');
      expect(alert.severity).toBe('info');
      expect(alert.group).toBe('other');
    });
  });

  describe('discoverAlertEntities', () => {
    test('discovers entities matching patterns', () => {
      const states: HassEntities = {
        'binary_sensor.emergency_fire': {
          entity_id: 'binary_sensor.emergency_fire',
          state: 'on',
          attributes: { severity: 'critical' },
          last_changed: '',
          last_updated: '',
          context: { id: '', parent_id: null, user_id: null },
        },
        'binary_sensor.emergency_water': {
          entity_id: 'binary_sensor.emergency_water',
          state: 'on',
          attributes: { severity: 'warning' },
          last_changed: '',
          last_updated: '',
          context: { id: '', parent_id: null, user_id: null },
        },
        'binary_sensor.other': {
          entity_id: 'binary_sensor.other',
          state: 'on',
          attributes: {},
          last_changed: '',
          last_updated: '',
          context: { id: '', parent_id: null, user_id: null },
        },
      };

      const patterns = ['binary_sensor.emergency_*'];
      const entities = discoverAlertEntities(states, patterns);

      expect(entities).toHaveLength(2);
      expect(entities.find((e) => e.entity_id === 'binary_sensor.emergency_fire')).toBeDefined();
      expect(entities.find((e) => e.entity_id === 'binary_sensor.emergency_water')).toBeDefined();
    });

    test('discovers entities with emergency attributes', () => {
      const states: HassEntities = {
        'binary_sensor.custom_alert': {
          entity_id: 'binary_sensor.custom_alert',
          state: 'on',
          attributes: { severity: 'critical' },
          last_changed: '',
          last_updated: '',
          context: { id: '', parent_id: null, user_id: null },
        },
      };

      const patterns = ['binary_sensor.emergency_*'];
      const entities = discoverAlertEntities(states, patterns);

      expect(entities).toHaveLength(1);
      expect(entities[0].entity_id).toBe('binary_sensor.custom_alert');
    });

    test('uses pattern cache', () => {
      const states: HassEntities = {
        'binary_sensor.emergency_test': {
          entity_id: 'binary_sensor.emergency_test',
          state: 'on',
          attributes: { severity: 'info' },
          last_changed: '',
          last_updated: '',
          context: { id: '', parent_id: null, user_id: null },
        },
      };

      const patterns = ['binary_sensor.emergency_*'];
      const cache = new Map<string, RegExp>();

      discoverAlertEntities(states, patterns, cache);

      expect(cache.size).toBe(1);
      expect(cache.has('binary_sensor.emergency_*')).toBe(true);
    });
  });

  describe('createEntityStateHash', () => {
    test('creates hash from entity IDs and timestamps', () => {
      const entities: EmergencyAlertEntity[] = [
        {
          entity_id: 'test1',
          state: 'on',
          attributes: { severity: 'critical' } as any,
          last_changed: '',
          last_updated: '2024-01-01T10:00:00Z',
          context: { id: '', parent_id: null, user_id: null },
        },
        {
          entity_id: 'test2',
          state: 'on',
          attributes: { severity: 'warning' } as any,
          last_changed: '',
          last_updated: '2024-01-01T11:00:00Z',
          context: { id: '', parent_id: null, user_id: null },
        },
      ];

      const hash = createEntityStateHash(entities);

      expect(hash).toContain('test1:2024-01-01T10:00:00Z');
      expect(hash).toContain('test2:2024-01-01T11:00:00Z');
      expect(hash).toContain('|');
    });

    test('creates consistent hash regardless of order', () => {
      const entities1: EmergencyAlertEntity[] = [
        {
          entity_id: 'test1',
          state: 'on',
          attributes: {} as any,
          last_changed: '',
          last_updated: '2024-01-01T10:00:00Z',
          context: { id: '', parent_id: null, user_id: null },
        },
        {
          entity_id: 'test2',
          state: 'on',
          attributes: {} as any,
          last_changed: '',
          last_updated: '2024-01-01T11:00:00Z',
          context: { id: '', parent_id: null, user_id: null },
        },
      ];

      const entities2: EmergencyAlertEntity[] = [
        {
          entity_id: 'test2',
          state: 'on',
          attributes: {} as any,
          last_changed: '',
          last_updated: '2024-01-01T11:00:00Z',
          context: { id: '', parent_id: null, user_id: null },
        },
        {
          entity_id: 'test1',
          state: 'on',
          attributes: {} as any,
          last_changed: '',
          last_updated: '2024-01-01T10:00:00Z',
          context: { id: '', parent_id: null, user_id: null },
        },
      ];

      expect(createEntityStateHash(entities1)).toBe(createEntityStateHash(entities2));
    });
  });
});
