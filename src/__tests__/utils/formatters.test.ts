/**
 * Tests for formatting utilities
 */

import {
  formatTimeAgo,
  getSeverityIcon,
  getSeverityColor,
  capitalize,
  getGroupTitle,
} from '../../utils/formatters';

describe('formatters', () => {
  describe('formatTimeAgo', () => {
    test('returns empty string for empty input', () => {
      expect(formatTimeAgo('')).toBe('');
    });

    test('returns "just now" for times less than 1 minute ago', () => {
      const now = new Date();
      const thirtySecondsAgo = new Date(now.getTime() - 30 * 1000);
      expect(formatTimeAgo(thirtySecondsAgo.toISOString())).toBe('just now');
    });

    test('returns minutes ago for times less than 1 hour', () => {
      const now = new Date();
      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
      const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);

      expect(formatTimeAgo(fiveMinutesAgo.toISOString())).toBe('5m ago');
      expect(formatTimeAgo(thirtyMinutesAgo.toISOString())).toBe('30m ago');
    });

    test('returns hours ago for times more than 1 hour', () => {
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      const fiveHoursAgo = new Date(now.getTime() - 5 * 60 * 60 * 1000);

      expect(formatTimeAgo(oneHourAgo.toISOString())).toBe('1h ago');
      expect(formatTimeAgo(fiveHoursAgo.toISOString())).toBe('5h ago');
    });

    test('handles edge case of exactly 60 minutes', () => {
      const now = new Date();
      const sixtyMinutesAgo = new Date(now.getTime() - 60 * 60 * 1000);
      expect(formatTimeAgo(sixtyMinutesAgo.toISOString())).toBe('1h ago');
    });
  });

  describe('getSeverityIcon', () => {
    test('returns correct icon for critical severity', () => {
      expect(getSeverityIcon('critical')).toBe('mdi:alert-circle');
    });

    test('returns correct icon for warning severity', () => {
      expect(getSeverityIcon('warning')).toBe('mdi:alert');
    });

    test('returns correct icon for info severity', () => {
      expect(getSeverityIcon('info')).toBe('mdi:information');
    });

    test('returns default icon for unknown severity', () => {
      expect(getSeverityIcon('unknown')).toBe('mdi:help-circle');
      expect(getSeverityIcon('')).toBe('mdi:help-circle');
    });
  });

  describe('getSeverityColor', () => {
    test('returns correct color for critical severity', () => {
      expect(getSeverityColor('critical')).toBe('#f44336');
    });

    test('returns correct color for warning severity', () => {
      expect(getSeverityColor('warning')).toBe('#ff9800');
    });

    test('returns correct color for info severity', () => {
      expect(getSeverityColor('info')).toBe('#2196f3');
    });

    test('returns default color for unknown severity', () => {
      expect(getSeverityColor('unknown')).toBe('#9e9e9e');
      expect(getSeverityColor('')).toBe('#9e9e9e');
    });
  });

  describe('capitalize', () => {
    test('capitalizes first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('world')).toBe('World');
    });

    test('handles single character strings', () => {
      expect(capitalize('a')).toBe('A');
    });

    test('handles empty strings', () => {
      expect(capitalize('')).toBe('');
    });

    test('does not modify already capitalized strings', () => {
      expect(capitalize('Hello')).toBe('Hello');
    });

    test('only capitalizes first letter', () => {
      expect(capitalize('hello world')).toBe('Hello world');
    });
  });

  describe('getGroupTitle', () => {
    test('returns "All Alerts" for none grouping', () => {
      expect(getGroupTitle('any', 'none')).toBe('All Alerts');
    });

    test('capitalizes group name for severity grouping', () => {
      expect(getGroupTitle('critical', 'severity')).toBe('Critical');
      expect(getGroupTitle('warning', 'severity')).toBe('Warning');
    });

    test('capitalizes group name for status grouping', () => {
      expect(getGroupTitle('active', 'status')).toBe('Active');
      expect(getGroupTitle('acknowledged', 'status')).toBe('Acknowledged');
    });

    test('capitalizes group name for group grouping', () => {
      expect(getGroupTitle('security', 'group')).toBe('Security');
      expect(getGroupTitle('safety', 'group')).toBe('Safety');
    });

    test('handles any grouping strategy', () => {
      expect(getGroupTitle('test', 'custom')).toBe('Test');
    });
  });
});
