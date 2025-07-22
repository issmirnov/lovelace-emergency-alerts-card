# Emergency Alerts Card

[![CI](https://github.com/issmirnov/lovelace-emergency-alerts-card/actions/workflows/ci.yml/badge.svg)](https://github.com/issmirnov/lovelace-emergency-alerts-card/actions/workflows/ci.yml)
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

### Required Components
1. **Emergency Alerts Integration** - Creates the alert sensors and entities
2. **Emergency Alerts Card** - Displays and manages the alerts (this component)

### Installation Order
1. Install the Emergency Alerts Integration first
2. Configure some alerts in your Home Assistant instance
3. Install this Emergency Alerts Card
4. Add the card to your Lovelace dashboard

## Installation

### Via HACS (Recommended)

#### Step 1: Install Emergency Alerts Integration
1. Open HACS in your Home Assistant instance
2. Go to "Integrations"
3. Click the "+" button and search for "Emergency Alerts"
4. Install the integration
5. Restart Home Assistant
6. Add the integration via **Settings** → **Devices & Services**

#### Step 2: Install Emergency Alerts Card
1. In HACS, go to "Dashboard" (new category for Lovelace cards)
2. Click the "+" button and search for "Emergency Alerts Card"
3. Install the card
4. Add the card to your Lovelace dashboard

> **Note**: In HACS 2024+, custom Lovelace cards are found under "Dashboard" instead of "Frontend"

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

### Complete Configuration Options

The Emergency Alerts Card supports extensive configuration options to customize its appearance and behavior:

#### Display Options
```yaml
type: custom:emergency-alerts-card
# Show/hide different alert types
show_acknowledged: true          # Show acknowledged alerts
show_cleared: false              # Show cleared alerts  
show_escalated: true             # Show escalated alerts

# Grouping and sorting
group_by: "severity"             # "severity", "group", "status", or "none"
sort_by: "first_triggered"       # "first_triggered", "severity", "name", "group"

# Visual appearance
compact_mode: false              # More compact display
show_timestamps: true            # Show "X minutes ago"
show_group_labels: true          # Show group names
show_severity_icons: true        # Show severity icons
max_alerts_per_group: 10         # Limit alerts per group
```

#### Filtering Options
```yaml
type: custom:emergency-alerts-card
# Filter by severity levels
severity_filter: ["critical", "warning", "info"]

# Filter by alert groups
group_filter: ["security", "safety", "environment"]

# Filter by alert status
status_filter: ["active", "acknowledged", "escalated"]
```

#### Action Button Options
```yaml
type: custom:emergency-alerts-card
# Show/hide action buttons
show_acknowledge_button: true    # Show acknowledge button
show_clear_button: true          # Show clear button  
show_escalate_button: true       # Show escalate button

# Button appearance
button_style: "compact"          # "compact", "full", "icons_only"
```

#### Advanced Options
```yaml
type: custom:emergency-alerts-card
# Custom entity detection patterns
entity_patterns:
  - "binary_sensor.emergency_*"
  - "binary_sensor.*"            # If entity has severity attribute

# Auto-refresh interval in seconds
refresh_interval: 30
```

### Configuration Examples

#### Show Only Active Alerts
```yaml
type: custom:emergency-alerts-card
show_acknowledged: false
show_cleared: false
status_filter: ["active"]
```

#### Compact Mobile-Friendly View
```yaml
type: custom:emergency-alerts-card
compact_mode: true
button_style: "icons_only"
show_timestamps: false
max_alerts_per_group: 3
```

#### Security-Focused Dashboard
```yaml
type: custom:emergency-alerts-card
group_filter: ["security"]
severity_filter: ["critical", "warning"]
show_escalate_button: true
show_acknowledge_button: false
```

#### Group by Alert Type
```yaml
type: custom:emergency-alerts-card
group_by: "group"
show_group_labels: true
```

#### Critical Alerts Only
```yaml
type: custom:emergency-alerts-card
severity_filter: ["critical"]
show_acknowledge_button: false
show_escalate_button: false
```

### Complete Dashboard Example

Here's a complete Lovelace dashboard configuration showing different card variations:

```yaml
resources:
  - url: /local/emergency-alerts-card.js
    type: module

views:
  - title: Emergency Dashboard
    cards:
      # Basic emergency alerts card
      - type: custom:emergency-alerts-card
        summary_entity: sensor.emergency_summary
      
      # Compact view for mobile
      - type: custom:emergency-alerts-card
        compact_mode: true
        show_timestamps: false
        button_style: "icons_only"
        max_alerts_per_group: 5
      
      # Grouped by status
      - type: custom:emergency-alerts-card
        group_by: "status"
        show_acknowledged: true
        show_cleared: true
        title: "Alert Status Overview"
      
      # Security-focused view
      - type: custom:emergency-alerts-card
        group_by: "group"
        group_filter: ["security"]
        severity_filter: ["critical", "warning"]
        title: "Security Alerts"
```

## Expected Entity Structure

The Emergency Alerts Card expects binary sensors with specific attributes from the Emergency Alerts Integration:

### Entity Format
```yaml
# Entity ID pattern
binary_sensor.emergency_[alert_name]

# Example entities
binary_sensor.emergency_fire_alarm
binary_sensor.emergency_door_open
binary_sensor.emergency_water_leak
```

### Required Attributes
```yaml
# State
state: 'on' (alert active) or 'off' (alert cleared)

# Required attributes
friendly_name: "Emergency: Fire Alarm Triggered"
severity: "critical" | "warning" | "info"
group: "security" | "safety" | "environmental" | "maintenance"

# Status tracking
acknowledged: boolean
escalated: boolean
cleared: boolean
first_triggered: "2024-12-19T10:30:00Z"  # ISO datetime string
last_cleared: "2024-12-19T11:00:00Z"     # ISO datetime string (optional)
```

### Example Entity
```yaml
binary_sensor.emergency_fire_alarm:
  state: 'on'
  friendly_name: "Emergency: Fire Alarm Triggered"
  severity: "critical"
  group: "safety"
  acknowledged: false
  escalated: false
  cleared: false
  first_triggered: "2024-12-19T10:30:00Z"
```

## Available Services

The Emergency Alerts Card calls these services when action buttons are clicked:

### Acknowledge Alert
```yaml
service: emergency_alerts.acknowledge
data:
  entity_id: binary_sensor.emergency_fire_alarm
```

### Escalate Alert
```yaml
service: emergency_alerts.escalate
data:
  entity_id: binary_sensor.emergency_fire_alarm
```

### Clear Alert
```yaml
service: emergency_alerts.clear
data:
  entity_id: binary_sensor.emergency_fire_alarm
```

### De-escalate Alert
```yaml
service: emergency_alerts.de_escalate
data:
  entity_id: binary_sensor.emergency_fire_alarm
```

## Screenshots

> **Note**: Screenshots will be added to the `docs/screenshots/` directory. These will show the card in various configurations and states.

### Planned Screenshots
- **Basic Card**: Default configuration showing mixed alert types
- **Compact Mode**: Mobile-friendly compact display
- **Grouped View**: Alerts grouped by severity/status/group
- **Action Buttons**: Different button styles (compact, full, icons_only)
- **Filtered Views**: Security-only, critical-only, etc.
- **Alert States**: Active, acknowledged, escalated, cleared states
- **Mobile View**: Card appearance on mobile devices

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

### HACS Validation
```bash
# Run HACS validation locally
./validate-hacs.sh

# Or using npm script
npm run validate:hacs

# This will check:
# - hacs.json structure and required fields
# - package.json requirements
# - README.md content and size
# - Repository structure
# - Build output validation
# - Test execution
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