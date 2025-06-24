# Emergency Alerts Card

[![Test Emergency Alerts Card](https://github.com/issmirnov/lovelace-emergency-alerts-card/actions/workflows/test.yml/badge.svg)](https://github.com/issmirnov/lovelace-emergency-alerts-card/actions/workflows/test.yml)
[![codecov](https://codecov.io/gh/issmirnov/lovelace-emergency-alerts-card/branch/main/graph/badge.svg)](https://codecov.io/gh/issmirnov/lovelace-emergency-alerts-card)

A custom Lovelace card for displaying emergency alerts from the Emergency Alerts integration.

## Features

- **Real-time Alert Display**: Shows active emergency alerts with severity indicators
- **Alert Grouping**: Groups alerts by severity (critical, warning, info)
- **Acknowledgment Support**: One-click alert acknowledgment
- **Time Tracking**: Shows when alerts were first triggered
- **Responsive Design**: Adapts to different screen sizes
- **Home Assistant Integration**: Seamlessly integrates with the Emergency Alerts integration

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