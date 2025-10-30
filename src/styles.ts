/**
 * Styles for Emergency Alerts Card
 * Using Lit's css template tag for scoped styles
 */

import { css } from 'lit';

export const cardStyles = css`
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

  /* v2.0 Alert state classes with animations */
  .alert-acknowledged {
    opacity: 0.7;
    background: rgba(76, 175, 80, 0.1);
    transition: opacity 0.3s ease, background 0.3s ease;
  }

  .alert-snoozed {
    opacity: 0.6;
    background: rgba(255, 152, 0, 0.1);
    transition: opacity 0.3s ease, background 0.3s ease;
  }

  .alert-escalated {
    border-left-color: #f44336;
    background: rgba(244, 67, 54, 0.1);
    animation: pulse 2s ease-in-out infinite;
  }

  .alert-resolved {
    opacity: 0.5;
    background: rgba(33, 150, 243, 0.1);
    transition: opacity 0.5s ease, background 0.5s ease;
  }

  /* v2.0 State-based classes for additional styling */
  .state-snoozed {
    border-left-width: 6px;
  }

  .state-escalated {
    border-left-width: 6px;
  }

  .state-resolved {
    filter: grayscale(0.3);
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
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  /* Responsive design for narrow columns */
  @media (max-width: 600px) {
    .action-buttons {
      flex-direction: column;
      gap: 4px;
      margin-left: 0;
      margin-top: 8px;
      width: 100%;
    }

    .action-btn {
      width: 100%;
      justify-content: center;
    }

    .alert-item {
      flex-direction: column;
      align-items: stretch;
    }

    .alert-content {
      margin-right: 0;
      margin-bottom: 8px;
    }
  }

  /* For very narrow columns (mobile) */
  @media (max-width: 400px) {
    .action-buttons {
      gap: 3px;
    }

    .action-btn {
      padding: 5px 8px;
      font-size: 0.75em;
    }
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

  .action-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .action-btn:active:not(:disabled) {
    transform: translateY(0);
  }

  .action-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .action-btn.loading {
    opacity: 0.6;
    position: relative;
  }

  /* v2.0 Button styles - switch-based */
  .acknowledge-btn {
    background: var(--primary-color, #1976d2);
    color: white;
  }

  .snooze-btn {
    background: var(--warning-color, #ff9800);
    color: white;
  }

  .resolve-btn {
    background: var(--success-color, #4caf50);
    color: white;
  }

  /* v2.0 Active button states */
  .acknowledged-active {
    background: var(--success-color, #4caf50) !important;
    box-shadow: 0 0 0 2px var(--success-color, #4caf50);
  }

  .snoozed-active {
    background: var(--warning-color, #ff9800) !important;
    box-shadow: 0 0 0 2px var(--warning-color, #ff9800);
    animation: pulse-subtle 2s ease-in-out infinite;
  }

  .resolved-active {
    background: var(--info-color, #2196f3) !important;
    box-shadow: 0 0 0 2px var(--info-color, #2196f3);
    opacity: 0.8;
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

  /* Compact mode responsive adjustments */
  @media (max-width: 600px) {
    .compact .action-buttons {
      gap: 3px;
    }

    .compact .action-btn {
      padding: 3px 6px;
      font-size: 0.65em;
    }
  }

  .no-alerts {
    text-align: center;
    padding: 32px;
    color: var(--secondary-text-color);
    font-style: italic;
  }

  .error-notification {
    background: var(--error-color, #f44336);
    color: white;
    padding: 12px;
    margin: 8px 0;
    border-radius: 6px;
    display: flex;
    align-items: center;
    gap: 8px;
    animation: slideIn 0.3s ease;
  }

  @keyframes slideIn {
    from {
      transform: translateY(-10px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .error-notification .error-icon {
    font-size: 1.2em;
  }

  .error-notification .error-message {
    flex: 1;
  }

  .error-notification .error-dismiss {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    font-size: 1.2em;
    padding: 4px;
    opacity: 0.8;
  }

  .error-notification .error-dismiss:hover {
    opacity: 1;
  }

  /* v2.0 Status Badge Styles */
  .status-badge {
    display: inline-block;
    padding: 3px 8px;
    border-radius: 12px;
    font-size: 0.65em;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-right: 8px;
    animation: fadeIn 0.3s ease;
  }

  .status-badge.active {
    background: var(--error-color, #f44336);
    color: white;
  }

  .status-badge.acknowledged {
    background: var(--success-color, #4caf50);
    color: white;
  }

  .status-badge.snoozed {
    background: var(--warning-color, #ff9800);
    color: white;
  }

  .status-badge.escalated {
    background: var(--error-color, #f44336);
    color: white;
    animation: pulse-badge 1.5s ease-in-out infinite;
  }

  .status-badge.resolved {
    background: var(--info-color, #2196f3);
    color: white;
  }

  .status-badge.inactive {
    background: var(--disabled-text-color, #bdbdbd);
    color: white;
  }

  /* v2.0 Escalated Indicator */
  .escalated-indicator {
    font-size: 0.9em;
    margin-left: 6px;
    animation: wiggle 0.5s ease-in-out infinite;
  }

  /* v2.0 Animations */
  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.8;
      transform: scale(1.02);
    }
  }

  @keyframes pulse-subtle {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.9;
    }
  }

  @keyframes pulse-badge {
    0%,
    100% {
      box-shadow: 0 0 0 0 rgba(244, 67, 54, 0.7);
    }
    50% {
      box-shadow: 0 0 0 4px rgba(244, 67, 54, 0);
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes wiggle {
    0%,
    100% {
      transform: rotate(0deg);
    }
    25% {
      transform: rotate(-5deg);
    }
    75% {
      transform: rotate(5deg);
    }
  }
`;
