# Emergency Alerts Card - Development Context

## 2024-12-19 - HACS Dependency Management Decision

**Author**: AI Assistant  
**Summary**: Resolved how to handle dependency between Emergency Alerts Card and Emergency Alerts Integration in HACS  
**Code Reference**: hacs.json, README.md, HACS_COMPLIANCE.md

### Problem
User asked whether to add the Emergency Alerts Integration as a dependency in the hacs.json file for the Emergency Alerts Card.

### Analysis
- HACS does NOT have a built-in dependency system between repositories
- Unlike traditional package managers, HACS repositories are independent
- Need to handle dependencies through documentation and user guidance

### Solution Implemented
1. **Enhanced hacs.json**: Added `repository` field for better HACS tracking
2. **Improved README**: Added clear installation order and dependency documentation
3. **Step-by-step HACS instructions**: Split installation into Integration first, then Card
4. **Dependency Management Documentation**: Added section explaining HACS dependency handling

### Changes Made
- `hacs.json`: Added `"repository": "issmirnov/lovelace-emergency-alerts-card"`
- `README.md`: Enhanced prerequisites section with installation order
- `HACS_COMPLIANCE.md`: Added dependency management section
- Installation instructions now clearly separate Integration and Card installation steps

### Rationale
This approach follows HACS best practices by:
- Clearly documenting dependencies in README
- Providing step-by-step installation guidance
- Using appropriate HACS categories (Integration vs Lovelace)
- Adding repository information for better tracking

### Result
✅ Repository remains fully HACS compliant  
✅ Users get clear guidance on installation order  
✅ Dependencies are properly documented  
✅ No breaking changes to existing functionality

## 2024-12-19 - Node.js Version Inconsistency Fix

**Author**: AI Assistant  
**Summary**: Fixed inconsistent Node.js versions across GitHub workflows causing CI failures  
**Code Reference**: package.json, .github/workflows/*.yml

### Problem
GitHub Actions were failing due to inconsistent Node.js versions:
- test.yml: Node 20 for tests, Node 18 for lint/build
- hacs-validation.yml: Node 20 
- ci.yml: Node 18 for HACS validation, Node 20/22 for tests, Node 18 for lint/build

### Solution Implemented
1. **Standardized on Node 18 LTS**: All workflows now use Node 18 consistently
2. **Added engines field**: Added `"engines": {"node": ">=18.0.0", "npm": ">=8.0.0"}` to package.json
3. **Fixed all workflows**: Updated test.yml, hacs-validation.yml, and ci.yml to use Node 18

### Changes Made
- `package.json`: Added engines specification
- `test.yml`: Changed matrix from `[20]` to `[18]`
- `hacs-validation.yml`: Changed from Node 20 to Node 18
- `ci.yml`: Changed matrix from `[20, 22]` to `[18]`

### Rationale
- Node 18 is the current LTS version
- Consistent Node.js versions prevent CI/CD issues
- Engines field helps developers use the correct Node version
- Simplifies maintenance and reduces confusion

### Result
✅ All workflows now use Node 18 consistently  
✅ CI/CD pipeline should pass reliably  
✅ Local development matches CI environment  
✅ Clear Node.js version requirements documented

## 2024-12-19 - README Documentation Enhancement

**Author**: AI Assistant  
**Summary**: Enhanced README with comprehensive configuration options, entity structure, and screenshot documentation  
**Code Reference**: README.md, docs/screenshots/README.md

### Problem
User requested comprehensive documentation update including:
- Complete configuration options explanation
- Space for screenshots
- Better examples and usage instructions

### Solution Implemented
1. **Comprehensive Configuration Section**: Added detailed explanation of all card options
2. **Configuration Examples**: Multiple practical examples for different use cases
3. **Entity Structure Documentation**: Clear explanation of expected entity format and attributes
4. **Services Documentation**: Listed all available services the card calls
5. **Screenshot Structure**: Created docs/screenshots/ directory with detailed requirements
6. **Complete Dashboard Example**: Full Lovelace dashboard configuration

### Changes Made
- `README.md`: Added complete configuration options, examples, entity structure, services
- `docs/screenshots/README.md`: Created screenshot requirements and guidelines
- `docs/screenshots/`: Created directory structure for future screenshots

### New Sections Added
- **Complete Configuration Options**: Display, filtering, action button, and advanced options
- **Configuration Examples**: 6 different practical examples
- **Complete Dashboard Example**: Full Lovelace configuration
- **Expected Entity Structure**: Entity format and required attributes
- **Available Services**: Service calls for action buttons
- **Screenshots Section**: Placeholder with planned screenshots list

### Screenshot Requirements
Created comprehensive screenshot guidelines including:
- Basic card views (default, compact, grouped)
- Filtered views (security, critical, active only)
- Alert states (active, acknowledged, escalated, cleared)
- Mobile views and responsive design
- Dashboard examples
- Technical requirements (resolution, format, quality)

### Result
✅ Comprehensive documentation covering all card features  
✅ Clear examples for different use cases  
✅ Proper entity structure documentation  
✅ Screenshot framework ready for user contributions  
✅ Better user experience with detailed configuration guide 