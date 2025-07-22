# Emergency Alerts Card

[![Test Emergency Alerts Card](https://github.com/issmirnov/lovelace-emergency-alerts-card/actions/workflows/test.yml/badge.svg)](https://github.com/issmirnov/lovelace-emergency-alerts-card/actions/workflows/test.yml)
[![codecov](https://codecov.io/gh/issmirnov/lovelace-emergency-alerts-card/branch/main/graph/badge.svg)](https://codecov.io/gh/issmirnov/lovelace-emergency-alerts-card)

A custom Lovelace card for displaying emergency alerts from the Emergency Alerts integration.

## Features

- **Real-time Alert Display**: Shows active emergency alerts with severity indicators
- **Alert Grouping**: Groups alerts by severity (critical, warning, info)
- **Multiple Actions**: Acknowledge, Clear, and Escalate alerts with one-click buttons
- **Smart Button Logic**: Shows appropriate actions based on alert state
- **Time Tracking**: Shows when alerts were first triggered
- **Responsive Design**: Adapts to different screen sizes
- **Home Assistant Integration**: Seamlessly integrates with the Emergency Alerts integration

## Alert Action Buttons Explained

The Emergency Alerts Card provides three main action buttons for each alert, each with a specific purpose and smart display logic:

| Button      | When It Appears                                 | What It Does                                                      |
|-------------|-------------------------------------------------|-------------------------------------------------------------------|
| **ACK**     | Alert is active, not acknowledged, not escalated | Marks the alert as acknowledged (user has seen/handled the alert) |
| **ESC**     | Alert is active, not escalated                  | Escalates the alert (triggers escalation actions, e.g. urgent notification) |
| **DE-ESC**  | Alert is currently escalated                    | De-escalates the alert (returns to acknowledged state)            |
| **CLR**     | Alert is active or acknowledged (not cleared)   | Manually clears the alert (resets state, triggers clear actions)  |

**Button Logic:**
- Only the relevant buttons for the alert's current state are shown.
- "De-escalate" only appears if the alert is actually escalated.
- "Acknowledge" and "Escalate" are hidden if the alert is escalated or cleared.
- "Clear" is always available unless the alert is already cleared.

**Example Scenario:**
1. **Alert triggers** (e.g., "Water Leak Detected"): You see **ACK**, **ESC**, and **CLR**.
2. You click **ACK**: The alert is marked as acknowledged. **ESC** and **CLR** remain.
3. If you click **ESC**: The alert is escalated (urgent actions run). **DE-ESC** and **CLR** now appear.
4. If you click **DE-ESC**: The alert returns to acknowledged state.
5. If you click **CLR** at any point: The alert is cleared and all action buttons disappear.

This logic ensures you always see the right actions for the alert's current state, reducing confusion and making emergency management fast and intuitive.

## Prerequisites

This card requires the [Emergency Alerts Integration](https://github.com/issmirnov/emergency-alerts-integration) to be installed and configured in your Home Assistant instance.

## Installation

### Via HACS (Recommended)
1. Open HACS in your Home Assistant instance
2. Go to "Frontend"
3. Click the "+" button and search for "Emergency Alerts Card"
4. Install the card
5. Add the card to your Lovelace dashboard

### Manual Installation
1. Download the latest `emergency-alerts-card.js` from the [releases page](https://github.com/issmirnov/lovelace-emergency-alerts-card/releases)
2. Copy it to your `www` folder in your Home Assistant configuration directory
3. Add the card as a resource in Lovelace:
   ```yaml
   resources:
     - url: /local/emergency-alerts-card.js
       type: module
   ```
4. Add the card to your dashboard

## Configuration

### Basic Configuration
```yaml
type: custom:emergency-alerts-card
```

### Advanced Configuration
```yaml
type: custom:emergency-alerts-card
summary_entity: sensor.emergency_summary  # Optional: specific summary entity
```

## Development

### Setup
```bash
npm install
```

### Testing with Home Assistant Devcontainer

If you have the Emergency Alerts integration running in a devcontainer (as in this project structure), you can easily test the card:

```bash
# Quick deploy to Home Assistant
./dev-with-ha.sh

# Or manually:
npm run build:deploy

# For continuous development (rebuilds and deploys on changes)
npm run dev:deploy
```

This will:
1. Build the card from TypeScript
2. Copy `emergency-alerts-card.js` to `../emergency_alerts/config/www/`
3. Make it available in Home Assistant as `/local/emergency-alerts-card.js`

### Testing
```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm run test:watch

# Run all checks
./test.sh
```

### Building
```bash
# Development build
npm run dev

# Production build
npm run build

# Build and deploy to HA
npm run build:deploy

# Deploy existing build
npm run deploy

# Build and test
./test.sh --build
```

### Code Quality
```bash
# Lint code
npm run lint

# Format code
npm run format

# Check formatting
npm run format:check
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass: `./test.sh`
6. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) file for details. 