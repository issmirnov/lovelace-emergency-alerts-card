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

  .alert-acknowledged {
    opacity: 0.7;
    background: var(--disabled-text-color, #bdbdbd);
  }

  .alert-escalated {
    border-left-color: #9c27b0;
    background: rgba(156, 39, 176, 0.1);
  }

  .alert-cleared {
    opacity: 0.5;
    background: var(--disabled-text-color, #e0e0e0);
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

  .acknowledge-btn {
    background: var(--primary-color, #1976d2);
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

  .de-escalate-btn {
    background: var(--warning-color, #ff9800);
    color: white;
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
`;
