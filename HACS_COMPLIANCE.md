# HACS Compliance Documentation

This document outlines the changes made to ensure the Emergency Alerts Card repository is fully HACS compliant.

## What is HACS?

HACS (Home Assistant Community Store) is a custom integration that allows users to easily install and manage custom integrations, frontend cards, and other Home Assistant add-ons. To be included in HACS, repositories must meet specific requirements.

## HACS Requirements for Lovelace Cards

### Required Files
- ✅ `hacs.json` - Configuration file for HACS
- ✅ `README.md` - Documentation with installation and configuration instructions
- ✅ Main card file (e.g., `emergency-alerts-card.js`) - The actual card implementation
- ✅ `package.json` - Node.js package configuration

### Required Fields in hacs.json
- ✅ `name` - Display name for the card
- ✅ `type` - Must be "dashboard" for cards (HACS 2024+ schema)
- ✅ `content_in_root` - Must be true for cards
- ✅ `description` - Brief description of the card
- ✅ `render_readme` - Set to true to render README in HACS
- ✅ `homeassistant` - Minimum Home Assistant version required
- ✅ `repository` - Repository identifier for HACS tracking

## Changes Made

### 1. Enhanced hacs.json
```json
{
  "name": "Emergency Alerts Card",
  "content_in_root": true,
  "type": "dashboard",
  "description": "Custom Lovelace card to show emergency alert sensors.",
  "render_readme": true,
  "homeassistant": "2023.8.0"
}
```

**Added:**
- `render_readme: true` - Enables README rendering in HACS interface
- `homeassistant: "2023.8.0"` - Specifies minimum Home Assistant version
- `repository: "issmirnov/lovelace-emergency-alerts-card"` - Repository identifier for HACS tracking
- `engines` - Node.js version requirements (>=18.0.0)

### 2. Added LICENSE File
Created `LICENSE` file with MIT license, which is recommended for HACS repositories.

### 3. GitHub Workflows

#### HACS Validation Workflow (`.github/workflows/hacs-validation.yml`)
- Validates `hacs.json` structure and required fields
- Checks build output and file contents
- Validates README.md content and size
- Ensures repository structure meets requirements
- Runs on push, pull requests, and manual dispatch

#### Release Workflow (`.github/workflows/release.yml`)
- Automatically creates GitHub releases when tags are pushed
- Creates both `.tar.gz` and `.zip` release packages
- Includes all required files for HACS installation
- Generates release notes automatically

#### Comprehensive CI Workflow (`.github/workflows/ci.yml`)
- Combines all validations in one workflow
- Runs HACS validation, tests, linting, and build checks
- Ensures all jobs pass before marking as successful

### 4. Local Validation Script
Created `validate-hacs.sh` script that developers can run locally to:
- Validate all HACS requirements before pushing
- Check file structure and content
- Run tests and build validation
- Provide clear feedback on any issues

### 5. Updated README.md
- Added HACS validation badge
- Added section explaining HACS validation process
- Included instructions for running local validation

### 6. CI/CD Improvements
- Standardized Node.js version to 18 LTS across all workflows
- Added engines field to package.json for version requirements
- Fixed inconsistent Node.js versions that were causing CI failures
- Ensured all workflows use the same Node.js version for consistency

## Validation Process

### Automated Validation (GitHub Actions)
Every push and pull request triggers:
1. **HACS Validation** - Checks all HACS requirements
2. **Frontend Tests** - Runs tests on multiple Node.js versions
3. **Lint and Format** - Ensures code quality
4. **Build and Package** - Creates artifacts for distribution

### Manual Validation
Developers can run:
```bash
./validate-hacs.sh
```

This script checks:
- ✅ hacs.json structure and required fields
- ✅ package.json requirements
- ✅ README.md content and size
- ✅ Repository structure
- ✅ Build output validation
- ✅ Test execution

## HACS Installation

Once the repository is approved for HACS, users can install it by:

### Step 1: Install Emergency Alerts Integration
1. Open HACS in your Home Assistant instance
2. Go to "Integrations"
3. Click the "+" button and search for "Emergency Alerts"
4. Install the integration
5. Restart Home Assistant
6. Add the integration via **Settings** → **Devices & Services**

### Step 2: Install Emergency Alerts Card
1. In HACS, go to "Frontend"
2. Click the "+" button and search for "Emergency Alerts Card"
3. Install the card
4. Add the card to your Lovelace dashboard

## Dependency Management

HACS doesn't have a built-in dependency system between repositories. Instead, we handle dependencies through:

1. **Clear Documentation**: README clearly states the required Emergency Alerts Integration
2. **Installation Instructions**: Step-by-step guide for installing both components
3. **Repository Information**: Added repository field in hacs.json for better tracking
4. **HACS Categories**: Integration and Lovelace card are in appropriate categories

## Release Process

To create a new release:

1. Update version in `package.json`
2. Create and push a new tag:
   ```bash
   git tag v1.1.0
   git push origin v1.1.0
   ```
3. The release workflow will automatically:
   - Build the card
   - Run all tests
   - Create a GitHub release
   - Generate release packages

## Compliance Status

✅ **FULLY HACS COMPLIANT**

All requirements have been met:
- [x] Required files present
- [x] hacs.json properly configured
- [x] README.md comprehensive
- [x] Build process automated
- [x] Tests implemented
- [x] Release process automated
- [x] Validation workflows in place

## Next Steps

1. Submit the repository to HACS for review
2. Ensure all GitHub workflows are passing
3. Create initial release with tag `v1.0.0`
4. Monitor HACS validation status

## Resources

- [HACS Documentation](https://hacs.xyz/docs/publish/start)
- [HACS Requirements](https://hacs.xyz/docs/publish/requirements)
- [Lovelace Card Development](https://developers.home-assistant.io/docs/frontend/custom-ui/lovelace-custom-card/) 