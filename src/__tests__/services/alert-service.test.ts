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
    test('calls select.select_option service for v4 architecture', async () => {
      await alertService.acknowledge('binary_sensor.emergency_test');

      expect(mockHass.callService).toHaveBeenCalledWith('select', 'select_option', {
        entity_id: 'select.test_state',
        option: 'acknowledged',
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

      expect(mockHass.callService).toHaveBeenCalledWith('select', 'select_option', {
        entity_id: 'select.binary_sensor.custom_alert_state',
        option: 'acknowledged',
      });
    });
  });

  describe('resolve', () => {
    test('calls select.select_option service for v4', async () => {
      await alertService.resolve('binary_sensor.emergency_test');

      expect(mockHass.callService).toHaveBeenCalledWith('select', 'select_option', {
        entity_id: 'select.test_state',
        option: 'resolved',
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

      expect(mockHass.callService).toHaveBeenCalledWith('select', 'select_option', {
        entity_id: 'select.binary_sensor.custom_alert_state',
        option: 'resolved',
      });
    });
  });

  describe('snooze', () => {
    test('calls select.select_option service for v4', async () => {
      await alertService.snooze('binary_sensor.emergency_test');

      expect(mockHass.callService).toHaveBeenCalledWith('select', 'select_option', {
        entity_id: 'select.test_state',
        option: 'snoozed',
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

      expect(mockHass.callService).toHaveBeenCalledWith('select', 'select_option', {
        entity_id: 'select.binary_sensor.custom_alert_state',
        option: 'snoozed',
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
