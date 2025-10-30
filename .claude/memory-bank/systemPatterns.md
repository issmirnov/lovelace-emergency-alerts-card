# System Patterns

> **Derived from**: projectbrief.md
> **Purpose**: Documents how the system is architected and key technical patterns

## Architecture Overview
### High-Level Structure
```
Home Assistant
    ├── Emergency Alerts Integration (separate project)
    │   ├── Creates binary_sensor.emergency_* entities
    │   ├── Provides services: acknowledge, clear, escalate
    │   └── Manages alert state
    │
    └── Emergency Alerts Card (this project)
        ├── Discovers emergency alert entities
        ├── Displays alerts in Lovelace UI
        ├── Provides action buttons
        └── Calls integration services
```

### Component Breakdown (Modular Architecture)
- **EmergencyAlertsCard (LitElement)**: Main web component (src/emergency-alerts-card.ts:645)
  - Extends Lit's `LitElement` for reactive UI
  - Orchestrates modules and handles UI rendering
  - Registered as `custom:emergency-alerts-card` in Home Assistant

- **Type System** (src/types.ts:155): Complete TypeScript interfaces
  - `HomeAssistant`, `HassEntity`, `HassEntities` - HA core types
  - `Alert`, `CardConfig`, `EmergencyAlertEntity` - Card-specific types
  - Eliminates all `any` types (previously 41 instances)

- **Service Layer** (src/services/alert-service.ts:132): Error handling wrapper
  - `AlertService` class with comprehensive error handling
  - Console logging, user notifications, error callbacks
  - Methods: acknowledge(), clear(), escalate(), deEscalate()

- **Utility Modules** (src/utils/): Pure functions for business logic
  - `formatters.ts` - Time, icons, colors, titles (100% test coverage)
  - `filters.ts` - Alert filtering with pattern matching and regex caching
  - `sorters.ts` - Sorting strategies (90% test coverage)
  - `groupers.ts` - Grouping algorithms (97% test coverage)
  - `entity-discovery.ts` - Entity discovery and state hashing (100% test coverage)

- **Styles Module** (src/styles.ts:271): CSS-in-JS styling
  - Extracted from main component
  - Includes error notifications and loading states

- **Configuration System**: User-facing configuration via YAML
  - 20+ config options for filtering, grouping, sorting, display
  - Defaults applied in `setConfig()` method

- **State Management**: Reactive properties + performance optimization
  - `alerts`: Array of discovered alert entities
  - `grouped`: Record of alerts grouped by selected strategy
  - `loadingActions`: Set<string> tracking async operations
  - Hash-based change detection (only updates when emergency alerts change)
  - Auto-updates when `hass` property changes

### Data Flow
```
Home Assistant State Change
    ↓
hass property updated (via Lit lifecycle)
    ↓
updated() lifecycle hook
    ↓
_hasRelevantChanges() performs hash comparison (OPTIMIZED)
    ↓ (only if emergency alerts changed)
discoverAlertEntities() from entity-discovery.ts
    ↓
shouldShowAlert() filters via filters.ts
    ↓
sortAlerts() sorts via sorters.ts
    ↓
groupAlerts() groups via groupers.ts
    ↓
Reactive properties update (alerts, grouped)
    ↓
render() generates UI with formatters.ts
    ↓
User clicks action button
    ↓
_handle* methods add to loadingActions Set
    ↓
alertService.* method (with error handling)
    ↓
HA Service Call via hass.callService()
    ↓
Remove from loadingActions Set
    ↓
Integration updates entity state
    ↓
Error notification shown if failed
    ↓
Cycle repeats
```

## Design Patterns

### Pattern: Service Layer for Error Handling
**Where Used**: src/services/alert-service.ts
**Why**: Centralized error handling, logging, and user notifications
**Implemented**: October 2025 (Refactoring)
**Example**:
```typescript
export class AlertService {
  async acknowledge(entity_id: string): Promise<void> {
    try {
      await this.hass.callService('emergency_alerts', 'acknowledge', { entity_id });
    } catch (error) {
      this.handleError('acknowledge alert', entity_id, error as Error);
      throw error; // Re-throw for caller handling
    }
  }

  private handleError(action: string, entity_id: string, error: Error): void {
    console.error(`[Emergency Alerts Card] Failed to ${action}:`, error);
    if (this.onError) {
      this.onError({ message: `Failed to ${action}`, entity_id, error });
    }
  }
}
```

### Pattern: Entity State Hashing for Performance
**Where Used**: src/utils/entity-discovery.ts, src/emergency-alerts-card.ts
**Why**: Avoid re-processing entities when nothing changed (critical for large HA instances)
**Implemented**: October 2025 (Refactoring)
**Example**:
```typescript
// Create hash from entity IDs + timestamps
export function createEntityStateHash(entities: EmergencyAlertEntity[]): string {
  return entities
    .map((e) => `${e.entity_id}:${e.last_updated}`)
    .sort()
    .join('|');
}

// Component uses hash comparison
private _hasRelevantChanges(): boolean {
  const currentHash = createEntityStateHash(alertEntities);
  const hasChanges = currentHash !== this.lastStatesHash;
  if (hasChanges) {
    this.lastStatesHash = currentHash;
  }
  return hasChanges;
}
```

### Pattern: Regex Caching for Performance
**Where Used**: src/utils/filters.ts
**Why**: Avoid recompiling regex patterns on every entity scan
**Implemented**: October 2025 (Refactoring)
**Example**:
```typescript
export function matchesEntityPattern(
  entityId: string,
  patterns: string[],
  patternCache?: Map<string, RegExp>
): boolean {
  return patterns.some((pattern) => {
    if (pattern.includes('*')) {
      let regex: RegExp;
      if (patternCache && patternCache.has(pattern)) {
        regex = patternCache.get(pattern)!; // Reuse cached regex
      } else {
        regex = new RegExp(pattern.replace(/\*/g, '.*'));
        if (patternCache) {
          patternCache.set(pattern, regex); // Cache for next time
        }
      }
      return regex.test(entityId);
    }
    return entityId === pattern;
  });
}
```

### Pattern: Loading State with Set
**Where Used**: src/emergency-alerts-card.ts
**Why**: Track multiple concurrent async operations
**Implemented**: October 2025 (Refactoring)
**Example**:
```typescript
private loadingActions: Set<string> = new Set();

private async _handleAcknowledge(entity_id: string): Promise<void> {
  this.loadingActions.add(entity_id);
  this.requestUpdate(); // Show loading indicator

  try {
    await this.alertService.acknowledge(entity_id);
  } finally {
    this.loadingActions.delete(entity_id);
    this.requestUpdate(); // Hide loading indicator
  }
}

// In render()
${this.loadingActions.has(alert.entity_id) ? '⏳' : '✓'}
```

### Pattern: Reactive Property Pattern (Lit)
**Where Used**: Throughout EmergencyAlertsCard class
**Why**: Automatically triggers re-renders when data changes
**Example**:
```typescript
static get properties() {
  return {
    hass: { attribute: false },
    alerts: { type: Array, state: true },
    grouped: { type: Object, state: true },
  };
}

protected updated(changedProps: PropertyValues): void {
  super.updated(changedProps);
  if (changedProps.has('hass') && this._hasRelevantChanges()) {
    this._updateAlerts(); // Only runs when emergency alerts changed
  }
}
```

### Pattern: Strategy Pattern for Grouping
**Where Used**: src/utils/groupers.ts
**Why**: Different grouping strategies selected at runtime based on config
**Example**:
```typescript
export function groupAlerts(
  alerts: Alert[],
  groupBy: 'severity' | 'status' | 'group' | 'none'
): Record<string, Alert[]> {
  switch (groupBy) {
    case 'severity': return groupAlertsBySeverity(alerts);
    case 'status': return groupAlertsByStatus(alerts);
    case 'group': return groupAlertsByGroup(alerts);
    case 'none': return groupAlertsNone(alerts);
  }
}
```

### Pattern: Filter Chain Pattern
**Where Used**: src/utils/filters.ts
**Why**: Multiple sequential filters applied to determine alert visibility
**Example**:
```typescript
export function shouldShowAlert(alert: Alert, config: CardConfig): boolean {
  // Severity filter
  if (!config.severity_filter.includes(alert.severity)) return false;
  // Group filter
  if (config.group_filter.length > 0 && !config.group_filter.includes(alert.group)) return false;
  // Status filter
  if (!config.status_filter.includes(alert.status)) return false;
  return true;
}
```

## Key Technical Decisions

### Decision: Modular Architecture (Refactoring)
- **Context**: Single-file component grew to 1409 lines, became difficult to maintain and test
- **Options Considered**:
  - Keep single-file component
  - Split into modules with Rollup bundling
- **Decision**: Modular architecture with 9 focused modules
- **Rationale**: Better maintainability, testability, reduced cognitive load, easier AI-assisted development
- **Consequences**: More files to navigate, but each module is focused and testable. Build process remains the same (single output file).
- **Result**: Main component reduced from 1409 to 645 lines. Test coverage increased from 34% to 86-100% for modules.
- **Date**: October 2025 (Comprehensive Refactoring)

### Decision: Single-File Component (SUPERSEDED)
- **Context**: Need to organize TypeScript code for maintainability
- **Options Considered**:
  - Multi-file structure with separate modules
  - Single-file component
- **Decision**: Single-file component
- **Rationale**: Simplifies build process, easier deployment, all code in one place for AI-assisted development
- **Consequences**: Large file (~1409 lines), became difficult to maintain
- **Date**: Initial development (June 2024)
- **Status**: SUPERSEDED by modular architecture decision (October 2025)

### Decision: Use Lit Framework
- **Context**: Need a modern web component framework for Home Assistant
- **Options Considered**:
  - Vanilla Web Components
  - Lit (Home Assistant standard)
  - Other frameworks (React, Vue)
- **Decision**: Lit framework
- **Rationale**: Home Assistant's official recommendation, reactive properties, template system
- **Consequences**: Learning curve, but good integration with HA ecosystem
- **Date**: Initial development (June 2024)

### Decision: Entity Pattern Matching
- **Context**: How to discover emergency alert entities
- **Options Considered**:
  - Hardcode entity IDs in config
  - Auto-discover by naming convention
  - Pattern matching with wildcards
- **Decision**: Pattern matching with configurable patterns
- **Rationale**: Flexibility + zero-config defaults, supports custom entity naming
- **Consequences**: More complex matching logic, but highly flexible
- **Date**: Early development (June 2024)

### Decision: Smart Button Logic
- **Context**: Which action buttons to show for each alert
- **Options Considered**:
  - Always show all buttons
  - Hide buttons based on alert state
  - Disable buttons instead of hiding
- **Decision**: Hide irrelevant buttons based on state
- **Rationale**: Cleaner UI, prevents confusion, clear visual feedback
- **Consequences**: More complex button rendering logic
- **Date**: Feature expansion (July 2024)

## Component Relationships

### EmergencyAlertsCard ↔ Home Assistant
- **Interaction**:
  - HA provides `hass` object with state and `callService` method
  - Card reads entity states via `this.hass.states`
  - Card calls services via `this.hass.callService()`
- **Dependencies**:
  - Card depends on HA's custom element registration
  - Card depends on HA providing `hass` object
- **Interface**:
  - `hass.states: Record<string, EntityState>`
  - `hass.callService(domain, service, data)`

### EmergencyAlertsCard ↔ Emergency Alerts Integration
- **Interaction**:
  - Integration creates `binary_sensor.emergency_*` entities
  - Card reads entity attributes (severity, group, acknowledged, etc.)
  - Card calls integration services (acknowledge, clear, escalate)
- **Dependencies**:
  - Card requires integration to be installed
  - Card expects specific entity attributes
- **Interface**:
  - Entity attributes: `severity`, `group`, `acknowledged`, `escalated`, `cleared`, `first_triggered`
  - Services: `emergency_alerts.acknowledge`, `emergency_alerts.clear`, `emergency_alerts.escalate`

## Code Organization

### Directory Structure (After Refactoring)
```
lovelace-emergency-alerts-card/
├── src/                              # TypeScript source (modular)
│   ├── emergency-alerts-card.ts      # Main component (645 lines)
│   ├── types.ts                      # TypeScript interfaces (155 lines)
│   ├── styles.ts                     # CSS-in-JS styles (271 lines)
│   ├── services/                     # Service layer
│   │   └── alert-service.ts          # Error handling service (132 lines)
│   ├── utils/                        # Pure utility functions
│   │   ├── formatters.ts             # Time/icon/color formatting
│   │   ├── filters.ts                # Alert filtering logic
│   │   ├── sorters.ts                # Sorting strategies
│   │   ├── groupers.ts               # Grouping strategies
│   │   └── entity-discovery.ts       # Entity discovery & hashing
│   ├── test-setup.ts                 # Jest test configuration
│   └── __tests__/                    # Test files (6 comprehensive suites)
│       ├── utils/
│       │   ├── formatters.test.ts    # 36 tests, 100% coverage
│       │   ├── filters.test.ts       # 26 tests
│       │   ├── sorters.test.ts       # 7 tests, 90% coverage
│       │   ├── groupers.test.ts      # 17 tests, 97% coverage
│       │   └── entity-discovery.test.ts # 12 tests, 100% coverage
│       └── services/
│           └── alert-service.test.ts # 11 tests, 100% coverage
├── dist/                             # Build output (Rollup)
│   ├── emergency-alerts-card.js      # Bundled JavaScript
│   └── emergency-alerts-card.js.map  # Sourcemap (for debugging)
├── www/                              # HACS distribution folder
│   └── dist/                         # Copy of dist/ for HACS
├── coverage/                         # Jest coverage reports
├── .github/workflows/                # CI/CD (GitHub Actions)
│   └── ci.yml                        # Enhanced with sourcemap validation
├── .husky/                           # Git hooks
│   └── pre-commit                    # Lint and format on commit
├── rollup.config.js                  # Build configuration (sourcemaps enabled)
├── tsconfig.json                     # TypeScript config
├── jest.config.js                    # Test config
├── package.json                      # NPM dependencies + lint-staged
├── README.md                         # Documentation
├── hacs.json                         # HACS metadata
├── REFACTORING_SUMMARY.md            # Comprehensive refactoring documentation
└── .claude/                          # Memory bank
    └── memory-bank/                  # Context files
```

### Module Responsibilities (After Refactoring)
- **emergency-alerts-card.ts** (645 lines): Main Lit component
  - Lit component lifecycle
  - Reactive property management
  - Configuration handling
  - Orchestrates utility modules
  - Renders UI
  - Handles user interactions

- **types.ts** (155 lines): Type definitions
  - Home Assistant interfaces (HomeAssistant, HassEntity, HassEntities)
  - Card-specific types (Alert, CardConfig, EmergencyAlertEntity)
  - Eliminates all `any` types

- **styles.ts** (271 lines): Styling
  - CSS-in-JS with Lit's css template
  - Component styles
  - Error notification styles
  - Loading state styles

- **services/alert-service.ts** (132 lines): Service layer
  - Wraps Home Assistant service calls
  - Comprehensive error handling
  - Console logging for debugging
  - User error notifications

- **utils/formatters.ts**: Formatting functions (100% test coverage)
  - formatTimeAgo(): Human-readable timestamps
  - getSeverityIcon(): MDI icon names
  - getSeverityColor(): Hex color codes
  - capitalize(): String formatting
  - getGroupTitle(): Group display names

- **utils/filters.ts**: Filtering logic
  - shouldShowAlert(): Filter chain for alert visibility
  - matchesEntityPattern(): Pattern matching with regex caching

- **utils/sorters.ts**: Sorting strategies (90% test coverage)
  - sortAlerts(): Strategy pattern for sorting
  - Multiple sort options: time, severity, name, group

- **utils/groupers.ts**: Grouping algorithms (97% test coverage)
  - groupAlerts(): Strategy pattern for grouping
  - groupAlertsBySeverity(), ByGroup(), ByStatus(), None()
  - getGroupCount(): Count alerts in groups

- **utils/entity-discovery.ts**: Entity discovery (100% test coverage)
  - discoverAlertEntities(): Pattern-based discovery
  - hasEmergencyAttributes(): Validation
  - entityToAlert(): Entity transformation
  - createEntityStateHash(): Performance optimization
  - getAlertStatus(): Status determination

## Conventions

### Naming
- **Private methods**: Prefix with `_` (e.g., `_updateAlerts()`, `_shouldShowAlert()`)
- **Public methods**: No prefix (e.g., `render()`, `setConfig()`)
- **Event handlers**: `_handle*` pattern (e.g., `_handleAcknowledge()`)
- **Grouping methods**: `_groupAlertsBy*` pattern
- **CSS classes**: Kebab-case (e.g., `alert-item`, `action-btn`)
- **Config properties**: Snake_case (e.g., `show_acknowledged`, `group_by`)

### Error Handling (IMPROVED October 2025)
- **AlertService** class provides comprehensive error handling
- All service calls wrapped in try-catch
- Console logging for debugging (with [Emergency Alerts Card] prefix)
- User notifications via error callback mechanism
- Config validation in `setConfig()` throws on invalid config
- Missing data handled with defaults (e.g., `entity.attributes.severity || 'info'`)

### State Management
- Lit's reactive properties for UI state (`alerts`, `grouped`)
- Home Assistant manages entity state
- No external state management libraries
- Component state resets on page reload (no persistence)

### Testing (EXPANDED October 2025)
- Jest with jsdom for DOM testing
- 6 comprehensive test suites (74 tests total)
- Tests in `src/__tests__/` organized by module (utils/, services/)
- Mock Home Assistant `hass` object
- Test coverage: 46.8% overall, 86.92% utils, 100% services
- CI runs tests on every push with coverage reporting
- Edge cases and error scenarios thoroughly tested

## Critical Paths

### Alert Discovery and Display (OPTIMIZED October 2025)
**Files**: src/emergency-alerts-card.ts, src/utils/*
**Flow**:
1. `updated()` lifecycle hook detects `hass` change
2. `_hasRelevantChanges()` performs hash comparison (OPTIMIZATION)
3. Only proceeds if emergency alert entities changed (OPTIMIZATION)
4. `discoverAlertEntities()` from entity-discovery.ts with pattern matching
5. `shouldShowAlert()` from filters.ts applies filters (severity, group, status)
6. `sortAlerts()` from sorters.ts sorts by configured strategy
7. `groupAlerts()` from groupers.ts groups alerts by configured strategy
8. `alerts` and `grouped` properties update (reactive)
9. `render()` generates HTML using formatters.ts

**Optimizations Applied**:
- Hash-based change detection prevents unnecessary re-scans
- Regex patterns cached in Map to avoid recompilation
- Only processes emergency alert entities, not all HA entities
- Empty groups are filtered out in render but created in grouping

### Action Button Click (IMPROVED October 2025)
**Files**: src/emergency-alerts-card.ts, src/services/alert-service.ts
**Flow**:
1. User clicks action button in UI
2. Button's `@click` handler calls `_handle*()` method
3. Entity ID added to `loadingActions` Set (LOADING STATE)
4. `requestUpdate()` called to show loading indicator (⏳)
5. `alertService.*()` method called with error handling
6. Service wraps `this.hass.callService()` in try-catch (ERROR HANDLING)
7. Home Assistant routes service call to Emergency Alerts integration
8. Integration updates entity state
9. Entity ID removed from `loadingActions` Set
10. HA broadcasts state change
11. Card's `hass` property updates
12. Triggers re-render with new state
13. If error occurred, user sees error notification (ERROR FEEDBACK)

**Improvements**:
- Comprehensive error handling via AlertService
- Loading indicators during async operations
- Console logging for debugging
- User error notifications
- No confirmation for destructive actions (still could be added if desired)

## Anti-Patterns (Historical - Mostly Fixed)

### Fixed in October 2025 Refactoring:
- ~~**Large single file**~~ → **FIXED**: Split into 9 focused modules (645 lines max)
- ~~**No error boundaries**~~ → **FIXED**: AlertService provides comprehensive error handling
- ~~**Repeated entity discovery**~~ → **FIXED**: Hash-based change detection prevents unnecessary scans
- ~~**No loading states**~~ → **FIXED**: Set-based loading state tracking with UI indicators
- ~~**Regex recreation in hot path**~~ → **FIXED**: Regex caching with Map
- ~~**CSS in TypeScript**~~ → **IMPROVED**: Extracted to styles.ts (still CSS-in-JS per Lit best practices)
- ~~**41 instances of `any`**~~ → **FIXED**: Proper TypeScript interfaces throughout
- ~~**No sourcemaps**~~ → **FIXED**: Sourcemaps enabled and validated in CI

### Remaining Considerations:
- **String-based severity ordering**: Hardcoded severity levels, not configurable (could add custom severity config)
- **No confirmation dialogs**: Destructive actions (clear, escalate) execute immediately (could add confirmation)
- **Component test coverage**: Utils/services well-tested (86-100%), but main component needs integration tests
