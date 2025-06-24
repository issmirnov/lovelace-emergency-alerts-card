# Lovelace Emergency Alerts Card

A custom Lovelace card for Home Assistant to display and manage emergency alert sensors created by the Emergency Alerts integration.

## Features (Planned)
- Display all `binary_sensor.emergency_*` entities
- Group by state (active vs idle)
- Show name, triggered_at, and severity
- Optional: action buttons (acknowledge, etc.)

## Usage
- Install via HACS or copy to your Home Assistant `www` folder
- Add the card to your dashboard using the Lovelace UI

## Development
- Built with JavaScript/TypeScript
- Uses Home Assistant's Lovelace card API

## Future Plans
- Enhanced UI for grouping, severity, and actions 