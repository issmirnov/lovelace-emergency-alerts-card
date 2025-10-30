/**
 * Tests for alert service
 */

import { AlertService } from '../../services/alert-service';
import { HomeAssistant, ErrorNotification } from '../../types';

describe('AlertService', () => {
  let mockHass: jest.Mocked<HomeAssistant>;
  let onErrorMock: jest.Mock<void, [ErrorNotification]>;
  let alertService: AlertService;

  beforeEach(() => {
    mockHass = {
      states: {},
      callService: jest.fn().mockResolvedValue(undefined),
      config: { language: 'en' },
      localize: jest.fn(),
    } as any;

    onErrorMock = jest.fn();
    alertService = new AlertService(mockHass, onErrorMock);
  });

  describe('acknowledge', () => {
    test('calls switch toggle service for acknowledged switch', async () => {
      await alertService.acknowledge('binary_sensor.emergency_test');

      expect(mockHass.callService).toHaveBeenCalledWith('switch', 'toggle', {
        entity_id: 'switch.emergency_test_acknowledged',
      });
    });

    test('handles errors and notifies callback', async () => {
      const error = new Error('Service call failed');
      mockHass.callService.mockRejectedValueOnce(error);

      await expect(alertService.acknowledge('binary_sensor.emergency_test')).rejects.toThrow();

      expect(onErrorMock).toHaveBeenCalledWith({
        message: 'Failed to acknowledge alert',
        entity_id: 'binary_sensor.emergency_test',
        error,
      });
    });

    test('logs error to console', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const error = new Error('Test error');
      mockHass.callService.mockRejectedValueOnce(error);

      try {
        await alertService.acknowledge('binary_sensor.emergency_test');
      } catch {
        // Expected
      }

      expect(consoleSpy).toHaveBeenCalledWith(
        '[Emergency Alerts Card] Failed to acknowledge alert:',
        error
      );
      expect(consoleSpy).toHaveBeenCalledWith('Entity: binary_sensor.emergency_test');

      consoleSpy.mockRestore();
    });

    test('handles non-emergency prefixed entity IDs correctly', async () => {
      await alertService.acknowledge('binary_sensor.custom_alert');

      expect(mockHass.callService).toHaveBeenCalledWith('switch', 'toggle', {
        entity_id: 'switch.custom_alert_acknowledged',
      });
    });
  });

  describe('resolve', () => {
    test('calls switch toggle service for resolved switch', async () => {
      await alertService.resolve('binary_sensor.emergency_test');

      expect(mockHass.callService).toHaveBeenCalledWith('switch', 'toggle', {
        entity_id: 'switch.emergency_test_resolved',
      });
    });

    test('handles errors and notifies callback', async () => {
      const error = new Error('Service call failed');
      mockHass.callService.mockRejectedValueOnce(error);

      await expect(alertService.resolve('binary_sensor.emergency_test')).rejects.toThrow();

      expect(onErrorMock).toHaveBeenCalledWith({
        message: 'Failed to resolve alert',
        entity_id: 'binary_sensor.emergency_test',
        error,
      });
    });

    test('handles non-emergency prefixed entity IDs correctly', async () => {
      await alertService.resolve('binary_sensor.custom_alert');

      expect(mockHass.callService).toHaveBeenCalledWith('switch', 'toggle', {
        entity_id: 'switch.custom_alert_resolved',
      });
    });
  });

  describe('snooze', () => {
    test('calls switch turn_on service for snoozed switch', async () => {
      await alertService.snooze('binary_sensor.emergency_test');

      expect(mockHass.callService).toHaveBeenCalledWith('switch', 'turn_on', {
        entity_id: 'switch.emergency_test_snoozed',
      });
    });

    test('handles errors and notifies callback', async () => {
      const error = new Error('Service call failed');
      mockHass.callService.mockRejectedValueOnce(error);

      await expect(alertService.snooze('binary_sensor.emergency_test')).rejects.toThrow();

      expect(onErrorMock).toHaveBeenCalledWith({
        message: 'Failed to snooze alert',
        entity_id: 'binary_sensor.emergency_test',
        error,
      });
    });

    test('handles non-emergency prefixed entity IDs correctly', async () => {
      await alertService.snooze('binary_sensor.custom_alert');

      expect(mockHass.callService).toHaveBeenCalledWith('switch', 'turn_on', {
        entity_id: 'switch.custom_alert_snoozed',
      });
    });
  });

  describe('updateHass', () => {
    test('updates Home Assistant instance', async () => {
      const newHass = {
        ...mockHass,
        callService: jest.fn().mockResolvedValue(undefined),
      } as any;

      alertService.updateHass(newHass);

      await alertService.acknowledge('binary_sensor.test');

      expect(newHass.callService).toHaveBeenCalled();
      expect(mockHass.callService).not.toHaveBeenCalled();
    });
  });

  describe('setErrorCallback', () => {
    test('updates error callback', async () => {
      const newCallback = jest.fn();
      alertService.setErrorCallback(newCallback);

      const error = new Error('Test');
      mockHass.callService.mockRejectedValueOnce(error);

      try {
        await alertService.acknowledge('test');
      } catch {
        // Expected
      }

      expect(newCallback).toHaveBeenCalled();
      expect(onErrorMock).not.toHaveBeenCalled();
    });
  });

  describe('without error callback', () => {
    test('does not crash when error callback is not provided', async () => {
      const serviceWithoutCallback = new AlertService(mockHass);
      const error = new Error('Test');
      mockHass.callService.mockRejectedValueOnce(error);

      await expect(serviceWithoutCallback.acknowledge('test')).rejects.toThrow();
      // Should not crash
    });
  });
});
