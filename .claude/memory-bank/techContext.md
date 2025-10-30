# Technical Context

> **Derived from**: projectbrief.md
> **Purpose**: Documents technologies, tools, and technical setup

## Technology Stack

### Core Technologies
- **Language(s)**: TypeScript 5.x
- **Runtime**: Browser JavaScript (ES6+)
- **Framework(s)**: Lit 3.x (Web Components)
- **Database**: None (reads from Home Assistant state)

### Major Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| lit | ^3.0.0 | Web components framework, reactive properties, templating |
| typescript | ^5.0.0 | Type safety, modern JavaScript features |
| rollup | ^3.0.0 | Module bundler for production build (with sourcemaps) |
| jest | ^29.0.0 | Testing framework with jsdom |
| eslint | ^8.0.0 | Code linting (TypeScript ESLint) |
| prettier | ^3.0.0 | Code formatting |
| husky | ^9.0.0 | Git hooks management (pre-commit) |
| lint-staged | ^15.0.0 | Run linters on staged files only |

### Development Tools
- **Build System**: Rollup with TypeScript plugin
- **Package Manager**: npm (requires >=8.0.0)
- **Linter/Formatter**: ESLint + Prettier (TypeScript rules)
- **Testing**: Jest with jsdom environment, ts-jest for TypeScript support

## Development Setup

### Prerequisites
```bash
# Required installations
- Node.js >= 20.0.0
- npm >= 8.0.0
- Home Assistant instance (for testing)
- Emergency Alerts Integration (optional, for full testing)
```

### Installation
```bash
# Steps to set up development environment
git clone https://github.com/issmirnov/lovelace-emergency-alerts-card
cd lovelace-emergency-alerts-card
npm install
```

### Configuration
- **Environment Variables**: None required

- **Config Files**:
  - `tsconfig.json`: TypeScript compiler options
  - `rollup.config.js`: Build configuration (Rollup bundler)
  - `jest.config.js`: Test configuration
  - `.eslintrc.js`: Linter rules
  - `.prettierrc.js`: Formatter rules
  - `hacs.json`: HACS metadata for distribution

### Running Locally
```bash
# Development build (watch mode)
npm run dev

# Production build
npm run build

# Build and deploy to Home Assistant devcontainer
npm run build:deploy

# Deploy existing build
npm run deploy

# Test
npm test

# Test with coverage
npm test -- --coverage

# Test watch mode
npm run test:watch

# Lint
npm run lint

# Format
npm run format

# Format check
npm run format:check

# HACS validation
npm run validate:hacs

# All checks (test.sh script)
./test.sh
```

## Technical Constraints

### Performance Requirements
- Card must render quickly (<100ms) even with many alerts
- Entity discovery runs on every Home Assistant state change
- No specific throughput requirements (browser-based UI)
- Memory footprint should be minimal (runs in user's browser)

### Browser/Platform Support
- Modern browsers supporting Web Components
- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Requires ES6+ JavaScript support
- Home Assistant 2023.8.0+ required

### Security Requirements
- No authentication/authorization (handled by Home Assistant)
- No data persistence (reads from HA state)
- No external API calls
- Runs in user's browser with HA permissions
- No sensitive data stored

## Infrastructure

### Deployment
- **Environment(s)**: User's Home Assistant instance (production)
- **Hosting**: Deployed as static JavaScript file in Home Assistant's www/ folder
- **CI/CD**: GitHub Actions
  - Runs tests on every push
  - Runs ESLint and Prettier checks
  - Uploads coverage to Codecov
  - HACS validation on pull requests

### Monitoring
- No built-in logging (runs in user's browser)
- Error tracking: Browser console (user-facing)
- Performance monitoring: Browser DevTools (user-facing)
- GitHub Actions for CI status

## External Integrations

### Home Assistant
- **Purpose**: Platform for running the card
- **Authentication**: Uses HA's session authentication
- **API Used**:
  - `hass.states`: Read entity states
  - `hass.callService()`: Call integration services
- **Documentation**: https://developers.home-assistant.io/

### Emergency Alerts Integration
- **Purpose**: Provides alert entities and services
- **Authentication**: N/A (internal HA integration)
- **Services Used**:
  - `emergency_alerts.acknowledge`
  - `emergency_alerts.clear`
  - `emergency_alerts.escalate`
- **Entity Pattern**: `binary_sensor.emergency_*`
- **Documentation**: https://github.com/issmirnov/emergency-alerts-integration

### HACS (Home Assistant Community Store)
- **Purpose**: Distribution platform
- **Authentication**: N/A
- **Requirements**:
  - `hacs.json` metadata file
  - `www/` folder structure
  - Valid README.md
  - Repository tags for versions
- **Documentation**: https://hacs.xyz/

### GitHub Actions (CI/CD)
- **Purpose**: Automated testing and validation
- **Workflows**:
  - `ci.yml`: Run tests, linting, coverage
- **Integrations**:
  - Codecov for coverage reporting
  - HACS validation action

## Technical Debt

### Resolved in October 2025 Refactoring:
- ✅ ~~**Large single-file component**~~ → Split into 9 modules (645 lines max)
- ✅ ~~**Minimal error handling**~~ → AlertService with comprehensive error handling
- ✅ ~~**No loading states**~~ → Set-based loading state tracking
- ✅ ~~**Inefficient entity discovery**~~ → Hash-based change detection
- ✅ ~~**No sourcemaps**~~ → Enabled and validated in CI
- ✅ ~~**No git hooks**~~ → Husky + lint-staged for pre-commit validation
- ✅ ~~**Low test coverage (34%)**~~ → Increased to 87% for utils, 100% for services
- ✅ ~~**41 instances of `any`**~~ → Proper TypeScript interfaces throughout
- ✅ ~~**Regex recreation in hot path**~~ → Regex caching with Map

### Remaining Technical Debt:
- **Component test coverage**: Main component needs integration tests (utils/services well-tested)
- **Hardcoded severity levels**: Can't customize severity colors or levels
- **No accessibility testing**: ARIA attributes not thoroughly tested
- **Limited internationalization**: English-only, no i18n support
- **No performance optimization for large lists**: Could use memoization, virtual scrolling (not needed yet)
- **No confirmation dialogs**: Destructive actions execute immediately

## Version History

### v1.1.0 (October 2025) - Comprehensive Refactoring
- Modular architecture (9 focused modules)
- Comprehensive error handling (AlertService)
- Loading states for all async operations
- Performance optimization (hash-based change detection, regex caching)
- Test coverage: 87% utils, 100% services (up from 34% overall)
- Sourcemaps enabled and validated
- Git hooks with Husky + lint-staged
- Enhanced CI/CD with artifact uploads
- Full type safety (eliminated 41 `any` types)
- JSDoc documentation throughout
- See REFACTORING_SUMMARY.md for complete details

### v1.0.0 (August 2024)
- Initial stable release
- Core features implemented
- HACS compliance achieved
- Basic test coverage (34%)
- Comprehensive documentation

### Pre-1.0 (June-July 2024)
- Initial development with AI assistance
- Feature expansion phase
- HACS preparation and fixes
- Build system restructuring (www/ folder)
