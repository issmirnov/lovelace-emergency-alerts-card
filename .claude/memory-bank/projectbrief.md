# Project Brief

> **Foundation Document**: This file shapes all other memory bank files. Update this first when project scope or goals change.

## Project Name
Emergency Alerts Card for Home Assistant

## Purpose
Provides a custom Lovelace card for Home Assistant that displays and manages emergency alerts from the Emergency Alerts integration. The card allows users to visualize active alerts with severity indicators and take actions (acknowledge, escalate, de-escalate, clear) directly from their Home Assistant dashboard.

## Core Goals
1. **Display emergency alerts effectively** - Show active alerts with clear severity indicators and grouping options
2. **Enable quick alert management** - Provide intuitive action buttons for acknowledging, escalating, and clearing alerts
3. **HACS compatibility** - Be installable through the Home Assistant Community Store
4. **Highly configurable** - Support extensive customization for filtering, grouping, sorting, and display options
5. **Home Assistant integration** - Seamlessly integrate with the Emergency Alerts integration and follow Home Assistant UI patterns

## Scope
### In Scope
- Custom Lovelace card web component built with Lit
- Real-time alert display from binary sensors
- Action buttons: Acknowledge, Escalate, De-escalate, Clear
- Smart button logic based on alert state
- Grouping by severity, status, group, or none
- Sorting by first_triggered, severity, name, or group
- Filtering by severity, group, or status
- Display options: compact mode, timestamps, icons, labels
- HACS distribution and validation
- TypeScript implementation with Jest tests
- Comprehensive documentation and examples

### Out of Scope
- The Emergency Alerts integration itself (separate project)
- Alert creation or trigger logic (handled by integration)
- Backend automation or notification logic
- Mobile app development
- Multi-language internationalization (currently English only)

## Success Criteria
- Card successfully displays alerts from Emergency Alerts integration
- Action buttons correctly call Home Assistant services
- HACS validation passes for official repository listing
- Tests maintain >80% code coverage
- Documentation covers all configuration options
- Card is responsive and works on desktop and mobile
- Successfully deployed and installable through HACS

## Constraints
- **Technical**:
  - Must be compatible with Home Assistant 2023.8.0+
  - Must use web components standard (Lit framework)
  - Must follow Home Assistant's custom card conventions
  - Requires Emergency Alerts integration to be installed
  - Limited to browser JavaScript capabilities

- **Time**: Personal project with no strict deadlines

- **Resources**:
  - Solo developer with AI assistance (Claude/Cursor)
  - Limited JavaScript/TypeScript expertise
  - Personal project budget (free tools only)

- **External**:
  - Depends on Emergency Alerts integration
  - Must comply with HACS repository requirements
  - Must work within Home Assistant's frontend architecture

## Key Stakeholders
- **Primary Users**: Home Assistant users who want to monitor and manage emergency alerts
- **Maintainer**: issmirnov (with heavy AI assistance)
- **Decision Maker**: Project owner (issmirnov)
- **Related Projects**: Emergency Alerts integration (companion project)

## Context
This project was created as an experiment in AI-assisted development while building a useful component for the developer's own Home Assistant dashboard. The developer has basic understanding of the codebase and is learning TypeScript/Lit through this project.

The project follows a companion pattern where:
1. The Emergency Alerts integration creates binary sensors with alert data
2. This card consumes those sensors and provides a UI for managing them
3. The card calls services back to the integration to perform actions

The AI-assisted development approach means the code may contain inconsistencies or partially followed best practices, but the project serves as both a learning tool and a functional component.
