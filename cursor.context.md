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