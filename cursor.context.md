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