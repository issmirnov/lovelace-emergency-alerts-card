# Product Context

> **Derived from**: projectbrief.md
> **Purpose**: Explains why this project exists and what user value it provides

## Problem Statement
### Current Situation
Home Assistant users with the Emergency Alerts integration receive alert data as binary sensors, but there's no built-in UI to effectively visualize and manage these alerts. Users need to either:
- Create manual Lovelace cards using entities cards (complex and limited)
- Write custom automations to handle alert management (technical barrier)
- Monitor individual sensor entities separately (inefficient)

### Pain Points
- **No centralized alert dashboard**: Alerts scattered across multiple entity cards
- **Complex configuration**: Building a functional alert display requires significant YAML knowledge
- **Limited interactivity**: Standard entity cards don't provide action buttons for alert management
- **Poor visual hierarchy**: No automatic grouping by severity or status
- **Time-consuming setup**: Each alert type needs manual card configuration
- **No smart button logic**: Action buttons appear even when not relevant to alert state

### Impact
Home Assistant users who care about emergency monitoring cannot quickly assess their system's alert state or take immediate action when critical events occur. This defeats the purpose of having an emergency alert system - it should be obvious and actionable at a glance.

## Solution Overview
### Our Approach
Provide a single, drop-in Lovelace card that automatically discovers alert entities, displays them with clear severity indicators, groups them intelligently, and provides context-aware action buttons. The card works immediately after installation with zero configuration, but supports extensive customization for power users.

### Key Differentiators
- **Zero-config operation**: Automatically discovers and displays emergency alert entities
- **Smart button logic**: Only shows relevant actions based on current alert state
- **Intelligent grouping**: Automatically groups by severity, status, or custom groups
- **HACS distribution**: Easy installation through Home Assistant Community Store
- **Highly configurable**: 20+ configuration options for filtering, sorting, and display
- **Time tracking**: Shows how long alerts have been active ("X minutes ago")
- **Responsive design**: Works on desktop and mobile dashboards

## User Experience
### Target Users
- **Primary**: Home Assistant enthusiasts with emergency monitoring needs
  - Smart home owners monitoring security, safety, or environmental alerts
  - Users of the Emergency Alerts integration
  - Intermediate to advanced Home Assistant users

- **Secondary**: Home Assistant newcomers exploring alert systems
  - Learning about emergency monitoring
  - Testing the Emergency Alerts integration

### User Workflows

1. **Monitoring Alerts at a Glance**
   - User goal: Quickly see if any emergencies are active
   - Steps: Open Home Assistant dashboard → View Emergency Alerts Card
   - Outcome: Immediately see active alerts grouped by severity with visual indicators

2. **Responding to an Alert**
   - User goal: Acknowledge that they've seen and handled an alert
   - Steps: View alert → Click "ACK" button
   - Outcome: Alert marked as acknowledged, button disappears

3. **Escalating a Critical Situation**
   - User goal: Trigger urgent notifications when situation worsens
   - Steps: View alert → Click "ESC" button
   - Outcome: Alert escalated, integration triggers escalation automations (e.g., SMS, sirens)

4. **Clearing Resolved Alerts**
   - User goal: Manually clear alerts after resolving the issue
   - Steps: View alert → Click "CLR" button
   - Outcome: Alert cleared and removed from display (unless show_cleared: true)

5. **Filtering Specific Alert Types**
   - User goal: View only critical security alerts on a dedicated dashboard
   - Steps: Configure card with group_filter: ["security"] and severity_filter: ["critical"]
   - Outcome: Card shows only relevant alerts for that context

### User Interface Principles
- **Clarity first**: Severity colors (red, orange, blue) provide instant visual understanding
- **Progressive disclosure**: Default view shows essentials, configuration unlocks advanced features
- **Contextual actions**: Buttons adapt to alert state (no "acknowledge" button if already acknowledged)
- **Home Assistant consistency**: Follows HA design patterns, uses HA CSS variables
- **Mobile-friendly**: Touch-friendly button sizes, responsive layout
- **Accessibility**: Clear labels, color + text indicators (not color alone)

## Product Requirements

### Must Have
- Display active alerts from Emergency Alerts integration
- Show severity indicators (critical, warning, info)
- Action buttons: Acknowledge, Escalate, Clear
- Smart button logic (context-aware button visibility)
- Basic grouping by severity
- Call Home Assistant services for alert actions
- HACS compatibility
- Zero-config default behavior

### Should Have
- Multiple grouping options (severity, status, group, none)
- Filtering by severity, group, and status
- Sorting options (time, severity, name, group)
- Timestamp display ("X minutes ago")
- Compact mode for space-constrained dashboards
- Configuration for button visibility
- De-escalate button for escalated alerts

### Could Have
- Custom entity patterns for alert discovery
- Auto-refresh interval configuration
- Alert sound/notification on card
- Alert history view
- Custom severity colors
- Multi-language support
- Alert metrics/statistics
- Batch operations (acknowledge all, clear all)

## Success Metrics
- **Installation**: Successfully installable through HACS
- **Functionality**: All action buttons successfully call HA services
- **Code Quality**: Test coverage >80%, passing CI checks
- **HACS Compliance**: Passes HACS validation for official listing
- **Documentation**: Complete README with examples
- **User Adoption**: Community feedback and issue reports (engagement)

## Evolution

### Initial Development (June 2024)
- Basic card with hardcoded alert display
- Minimal configuration options
- Developed primarily with AI assistance (Claude/Cursor)

### Feature Expansion (July 2024)
- Added extensive configuration options
- Implemented grouping and filtering
- Enhanced button logic
- Added compact mode and display options

### HACS Preparation (August 2024)
- Restructured output to www/ folder for HACS compatibility
- Fixed HACS validation issues
- Improved documentation
- Added comprehensive examples

### Current State (Present)
- Fully functional core features
- HACS compliant
- Comprehensive documentation
- Active development with AI assistance
