# Emergency Alerts Card

[![CI](https://github.com/issmirnov/lovelace-emergency-alerts-card/actions/workflows/ci.yml/badge.svg)](https://github.com/issmirnov/lovelace-emergency-alerts-card/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/issmirnov/lovelace-emergency-alerts-card/branch/main/graph/badge.svg)](https://codecov.io/gh/issmirnov/lovelace-emergency-alerts-card)

A custom Lovelace card for displaying emergency alerts from the Emergency Alerts integration.

## 📢 Project Status

### Current Stable Version: v1.0.0 (main branch)
The current stable version uses a button-based interface with acknowledge, escalate, and clear actions.

### 🚧 v2.0.0 In Development ([PR #2](https://github.com/issmirnov/lovelace-emergency-alerts-card/pull/2))
A major rewrite is underway featuring:
- **Switch-based architecture** (replacing service call buttons with toggleable switches)
- **Snooze functionality** (5-minute auto-expiring silence)
- **Automatic escalation** (after 5 minutes if not acknowledged)
- **Enhanced visual feedback** (status badges, animations, active state indicators)
- **Improved UX** (tooltips, better state representation)

**Status**: All tests passing (90/90), ready for testing and review.

### Development Approach

This project serves as an experiment in AI-assisted development, built primarily with Claude Code and Cursor. The codebase demonstrates:
- Full TypeScript with comprehensive type safety
- Test-driven development (90 unit tests with Jest)
- Modern web components using Lit
- CI/CD with automated testing and validation

**Note**: While AI-assisted, the code follows industry best practices with:
- ✅ Comprehensive test coverage
- ✅ TypeScript strict mode
- ✅ ESLint + Prettier enforcement
- ✅ Pre-commit hooks
- ✅ HACS validation

Feel free to contribute improvements or provide feedback on the v2.0 rewrite!

## Features

- **Real-time Alert Display**: Shows active emergency alerts with severity indicators
- **Alert Grouping**: Groups alerts by severity, status, group, or none
- **Switch-Based Actions** (v2.0): Toggle switches for Acknowledge, Snooze (5min), and Resolve
- **Visual State Indicators**: Animated status badges, color-coded borders, and pulsing effects
- **Smart State Management**: Backend enforces mutual exclusivity - only one response state active at a time
- **Automatic Escalation**: Alerts auto-escalate after 5 minutes if not acknowledged
- **Time Tracking**: Shows when alerts were first triggered and snooze expiration times
- **Responsive Design**: Adapts to different screen sizes with mobile-optimized layouts
- **Home Assistant Integration**: Seamlessly integrates with the Emergency Alerts integration v2.0+

## v2.0 Alert Action Switches Explained

**BREAKING CHANGE**: v2.0 introduces a switch-based architecture replacing the old button-based system.

The Emergency Alerts Card now provides **three toggle switches** for each alert, with mutual exclusivity enforced by the backend:

| Switch         | What It Does | Behavior | Visual State |
|----------------|--------------|----------|--------------|
| **Acknowledge** | Mark as "working on it" - prevents auto-escalation | Toggle ON/OFF | Green glow when active |
| **Snooze (5m)** | Silence for 5 minutes - auto-expires | Turns ON (auto-turns OFF after 5min) | Orange glow with pulse animation |
| **Resolve**    | Mark as fixed - won't re-trigger until condition fully clears | Toggle ON/OFF | Blue glow when active |

**Key v2.0 Behaviors:**

- **Mutual Exclusivity**: Only ONE switch can be ON at a time. Turning one ON automatically turns others OFF.
- **Auto-Escalation**: If an active alert isn't acknowledged within 5 minutes, it automatically escalates (pulsing red animation).
- **Snooze Auto-Expiry**: Snooze automatically expires after 5 minutes, returning alert to previous state.
- **Tooltips**: Hover over switches to see detailed explanations of their behavior.
- **Visual Feedback**: Active switches show colored glows, status badges, and animations.

**Example Scenario:**
1. **Alert triggers** (e.g., "Water Leak Detected"): All switches OFF, alert shows as "ACTIVE" badge.
2. You toggle **Acknowledge** ON: Alert badge changes to "ACKNOWLEDGED" (green), alert won't auto-escalate.
3. You toggle **Snooze** ON: Acknowledge automatically turns OFF, "SNOOZED" badge appears (orange with pulse), shows "until 2:35 PM".
4. After 5 minutes: Snooze expires, returns to acknowledged state (or active if it wasn't acknowledged before).
5. You toggle **Resolve** ON: All other switches turn OFF, "RESOLVED" badge appears (blue), alert fades to 50% opacity.
6. Condition re-occurs: If physical condition re-triggers while resolved, alert won't re-activate until resolve is turned OFF.

**Escalation (Automatic Only in v2.0):**
- Escalation is **automatic** - no manual escalate button.
- Alerts escalate after 5 minutes if not acknowledged.
- Escalated alerts show pulsing red "ESCALATED" badge and wider border.
- Acknowledging an escalated alert returns it to acknowledged state (de-escalates automatically).

## Quick Start

1. **Install Emergency Alerts Integration** via HACS
2. **Install Emergency Alerts Card** via HACS (Dashboard section)
3. **Add to your dashboard**:
   ```yaml
   type: custom:emergency-alerts-card
   ```
4. **Configure alert automations** in the integration

That's it! The card will automatically discover and display your emergency alerts.

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
# Show/hide different alert types (v2.0)
show_acknowledged: true          # Show acknowledged alerts
show_snoozed: true              # Show snoozed alerts (NEW in v2.0)
show_resolved: false            # Show resolved alerts (RENAMED from show_cleared)
show_escalated: true            # Show escalated alerts

# Grouping and sorting
group_by: "severity"            # "severity", "group", "status", or "none"
sort_by: "first_triggered"      # "first_triggered", "severity", "name", "group"

# Visual appearance (v2.0)
compact_mode: false             # More compact display
show_timestamps: true           # Show "X minutes ago"
show_group_labels: true         # Show group names
show_severity_icons: true       # Show severity icons
show_status_badge: true         # Show status badges (NEW in v2.0)
max_alerts_per_group: 10        # Limit alerts per group
```

#### Filtering Options
```yaml
type: custom:emergency-alerts-card
# Filter by severity levels
severity_filter: ["critical", "warning", "info"]

# Filter by alert groups
group_filter: ["security", "safety", "environment"]

# Filter by alert status (v2.0 - updated status types)
status_filter: ["active", "acknowledged", "snoozed", "escalated", "resolved"]
```

#### Action Switch Options (v2.0)
```yaml
type: custom:emergency-alerts-card
# Show/hide action switches (v2.0 - switch-based, not buttons)
show_acknowledge_button: true    # Show acknowledge switch
show_snooze_button: true        # Show snooze switch (NEW in v2.0)
show_resolve_button: true       # Show resolve switch (RENAMED from show_clear_button)

# Note: show_escalate_button removed in v2.0 - escalation is automatic
# Button appearance
button_style: "compact"         # "compact", "full", "icons_only"
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

#### Show Only Active Alerts (v2.0)
```yaml
type: custom:emergency-alerts-card
show_acknowledged: false
show_snoozed: false
show_resolved: false
status_filter: ["active"]
```

#### Compact Mobile-Friendly View
```yaml
type: custom:emergency-alerts-card
compact_mode: true
button_style: "icons_only"
show_timestamps: false
show_status_badge: true
max_alerts_per_group: 3
```

#### Security-Focused Dashboard (v2.0)
```yaml
type: custom:emergency-alerts-card
group_filter: ["security"]
severity_filter: ["critical", "warning"]
show_status_badge: true
show_snooze_button: true
show_acknowledge_button: true
```

#### Group by Alert Status (v2.0)
```yaml
type: custom:emergency-alerts-card
group_by: "status"
show_group_labels: true
show_acknowledged: true
show_snoozed: true
show_resolved: true
```

#### Critical Alerts Only
```yaml
type: custom:emergency-alerts-card
severity_filter: ["critical"]
show_acknowledge_button: true
show_snooze_button: false
show_status_badge: true
```

### Complete Dashboard Example (v2.0)

Here's a complete Lovelace dashboard configuration showing different card variations:

```yaml
resources:
  - url: /local/emergency-alerts-card.js
    type: module

views:
  - title: Emergency Dashboard
    cards:
      # Basic emergency alerts card with v2.0 features
      - type: custom:emergency-alerts-card
        summary_entity: sensor.emergency_summary
        show_status_badge: true

      # Compact view for mobile
      - type: custom:emergency-alerts-card
        compact_mode: true
        show_timestamps: false
        show_status_badge: true
        button_style: "icons_only"
        max_alerts_per_group: 5

      # Grouped by status (v2.0 - includes snoozed and resolved)
      - type: custom:emergency-alerts-card
        group_by: "status"
        show_acknowledged: true
        show_snoozed: true
        show_resolved: true
        show_status_badge: true
        title: "Alert Status Overview"

      # Security-focused view with snooze enabled
      - type: custom:emergency-alerts-card
        group_by: "group"
        group_filter: ["security"]
        severity_filter: ["critical", "warning"]
        show_snooze_button: true
        show_status_badge: true
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

### Required Attributes (v2.0)
```yaml
# State
state: 'on' (alert active) or 'off' (alert inactive)

# Required attributes
friendly_name: "Emergency: Fire Alarm Triggered"
severity: "critical" | "warning" | "info"
group: "security" | "safety" | "environmental" | "maintenance"

# Status tracking (v2.0 - updated)
acknowledged: boolean
escalated: boolean        # Auto-set by backend after 5 minutes
snoozed: boolean         # NEW in v2.0
resolved: boolean        # RENAMED from "cleared"
first_triggered: "2024-12-19T10:30:00Z"     # ISO datetime string
snooze_until: "2024-12-19T10:35:00Z"        # NEW in v2.0 - ISO datetime (optional)
last_resolved: "2024-12-19T11:00:00Z"       # RENAMED from last_cleared (optional)
```

### Example Entity (v2.0)
```yaml
binary_sensor.emergency_fire_alarm:
  state: 'on'
  friendly_name: "Emergency: Fire Alarm Triggered"
  severity: "critical"
  group: "safety"
  acknowledged: false
  escalated: false
  snoozed: false
  resolved: false
  first_triggered: "2024-12-19T10:30:00Z"
```

## Available Services (v2.0)

**BREAKING CHANGE**: v2.0 uses **switch entities** instead of service calls.

The Emergency Alerts Card toggles switch entities when action buttons are clicked. For each alert binary sensor, the backend creates three switch entities:

### Switch Entity Pattern
```yaml
# For binary_sensor: binary_sensor.emergency_fire_alarm
# The backend creates these switches:

switch.emergency_fire_alarm_acknowledged   # Acknowledge switch
switch.emergency_fire_alarm_snoozed       # Snooze switch
switch.emergency_fire_alarm_resolved      # Resolve switch
```

### Acknowledge Alert (v2.0)
```yaml
service: switch.toggle
data:
  entity_id: switch.emergency_fire_alarm_acknowledged
```

### Snooze Alert (v2.0 - NEW)
```yaml
service: switch.turn_on
data:
  entity_id: switch.emergency_fire_alarm_snoozed
```

### Resolve Alert (v2.0 - RENAMED from clear)
```yaml
service: switch.toggle
data:
  entity_id: switch.emergency_fire_alarm_resolved
```

### Note on Escalation
Escalation in v2.0 is **automatic** (5-minute timer) and has no manual service call. To de-escalate, simply acknowledge the alert, which automatically turns off escalation.

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

Contributions are welcome! This project is a learning experiment in AI-assisted development, and we appreciate:
- Bug reports and fixes
- Feature suggestions
- Code improvements and refactoring
- Documentation enhancements
- Test coverage improvements

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes**
4. **Add tests** for new functionality
5. **Run all checks**: `npm run lint && npm test && npm run build`
6. **Commit with descriptive messages**
7. **Push to your fork** and submit a pull request

### Development Workflow

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run linting
npm run lint

# Format code
npm run format

# Build
npm run build

# Run all checks (recommended before committing)
npm run lint && npm test && npm run build
```

### Testing v2.0

If you'd like to test the upcoming v2.0 release:

1. Checkout the `v2-rewrite` branch
2. Build and install: `npm run build`
3. Copy `dist/emergency-alerts-card.js` to your Home Assistant `www` folder
4. Requires: Emergency Alerts Integration v2.0+ (with switch-based backend)

See [PR #2](https://github.com/issmirnov/lovelace-emergency-alerts-card/pull/2) for full v2.0 details and breaking changes.

## Project Structure

```
lovelace-emergency-alerts-card/
├── src/
│   ├── emergency-alerts-card.ts    # Main card component
│   ├── types.ts                     # TypeScript interfaces
│   ├── styles.ts                    # Card styling
│   ├── services/
│   │   └── alert-service.ts        # Alert action service
│   └── utils/
│       ├── entity-discovery.ts     # Entity detection
│       ├── formatters.ts           # Display formatting
│       ├── filters.ts              # Alert filtering
│       ├── groupers.ts             # Alert grouping
│       └── sorters.ts              # Alert sorting
├── __tests__/                      # Jest unit tests
├── dist/                           # Build output
└── www/                            # HACS distribution
```

## Testing

The project maintains comprehensive test coverage (90 tests):

```bash
# Run all tests
npm test

# Watch mode for development
npm run test:watch

# Coverage report
npm test -- --coverage
```

Test categories:
- **Service tests**: Alert actions (acknowledge, resolve, snooze)
- **Utility tests**: Entity discovery, formatting, filtering, grouping, sorting
- **Integration tests**: End-to-end card behavior

## Acknowledgments

- Built with [Lit](https://lit.dev/) web components
- Tested with [Jest](https://jestjs.io/)
- Developed using [Claude Code](https://claude.ai/claude-code) and [Cursor](https://cursor.sh/)
- Inspired by the Home Assistant community

## License

MIT License - see [LICENSE](LICENSE) file for details. 
