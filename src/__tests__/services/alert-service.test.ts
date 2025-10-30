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
    test('calls Home Assistant acknowledge service', async () => {
      await alertService.acknowledge('binary_sensor.test');

      expect(mockHass.callService).toHaveBeenCalledWith(
        'emergency_alerts',
        'acknowledge',
        { entity_id: 'binary_sensor.test' }
      );
    });

    test('handles errors and notifies callback', async () => {
      const error = new Error('Service call failed');
      mockHass.callService.mockRejectedValueOnce(error);

      await expect(alertService.acknowledge('binary_sensor.test')).rejects.toThrow();

      expect(onErrorMock).toHaveBeenCalledWith({
        message: 'Failed to acknowledge alert',
        entity_id: 'binary_sensor.test',
        error,
      });
    });

    test('logs error to console', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const error = new Error('Test error');
      mockHass.callService.mockRejectedValueOnce(error);

      try {
        await alertService.acknowledge('binary_sensor.test');
      } catch (e) {
        // Expected
      }

      expect(consoleSpy).toHaveBeenCalledWith(
        '[Emergency Alerts Card] Failed to acknowledge alert:',
        error
      );
      expect(consoleSpy).toHaveBeenCalledWith('Entity: binary_sensor.test');

      consoleSpy.mockRestore();
    });
  });

  describe('clear', () => {
    test('calls Home Assistant clear service', async () => {
      await alertService.clear('binary_sensor.test');

      expect(mockHass.callService).toHaveBeenCalledWith('emergency_alerts', 'clear', {
        entity_id: 'binary_sensor.test',
      });
    });

    test('handles errors and notifies callback', async () => {
      const error = new Error('Service call failed');
      mockHass.callService.mockRejectedValueOnce(error);

      await expect(alertService.clear('binary_sensor.test')).rejects.toThrow();

      expect(onErrorMock).toHaveBeenCalledWith({
        message: 'Failed to clear alert',
        entity_id: 'binary_sensor.test',
        error,
      });
    });
  });

  describe('escalate', () => {
    test('calls Home Assistant escalate service', async () => {
      await alertService.escalate('binary_sensor.test');

      expect(mockHass.callService).toHaveBeenCalledWith('emergency_alerts', 'escalate', {
        entity_id: 'binary_sensor.test',
      });
    });

    test('handles errors and notifies callback', async () => {
      const error = new Error('Service call failed');
      mockHass.callService.mockRejectedValueOnce(error);

      await expect(alertService.escalate('binary_sensor.test')).rejects.toThrow();

      expect(onErrorMock).toHaveBeenCalledWith({
        message: 'Failed to escalate alert',
        entity_id: 'binary_sensor.test',
        error,
      });
    });
  });

  describe('deEscalate', () => {
    test('calls Home Assistant acknowledge service for de-escalation', async () => {
      await alertService.deEscalate('binary_sensor.test');

      expect(mockHass.callService).toHaveBeenCalledWith(
        'emergency_alerts',
        'acknowledge',
        { entity_id: 'binary_sensor.test' }
      );
    });

    test('handles errors and notifies callback', async () => {
      const error = new Error('Service call failed');
      mockHass.callService.mockRejectedValueOnce(error);

      await expect(alertService.deEscalate('binary_sensor.test')).rejects.toThrow();

      expect(onErrorMock).toHaveBeenCalledWith({
        message: 'Failed to de-escalate alert',
        entity_id: 'binary_sensor.test',
        error,
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
      } catch (e) {
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
