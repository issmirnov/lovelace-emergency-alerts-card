#!/bin/bash

# HACS Validation Script for Emergency Alerts Card
# This script validates that the repository meets HACS requirements

set -e

echo "🔍 Starting HACS validation..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    local status=$1
    local message=$2
    case $status in
        "PASS")
            echo -e "${GREEN}✅ $message${NC}"
            ;;
        "FAIL")
            echo -e "${RED}❌ $message${NC}"
            ;;
        "WARN")
            echo -e "${YELLOW}⚠️  $message${NC}"
            ;;
    esac
}

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -f "hacs.json" ]; then
    print_status "FAIL" "Must run from the lovelace-emergency-alerts-card directory"
    exit 1
fi

# Check if jq is available
if ! command -v jq &> /dev/null; then
    print_status "FAIL" "jq is required for validation. Please install it."
    exit 1
fi

# Validate hacs.json
echo ""
echo "📋 Validating hacs.json..."
if [ ! -f "hacs.json" ]; then
    print_status "FAIL" "hacs.json is missing"
    exit 1
fi

if ! jq empty hacs.json 2>/dev/null; then
    print_status "FAIL" "hacs.json is not valid JSON"
    exit 1
fi

# Check required fields
required_fields=("name" "type" "content_in_root")
for field in "${required_fields[@]}"; do
    if ! jq -e ".$field" hacs.json >/dev/null 2>&1; then
        print_status "FAIL" "hacs.json missing '$field' field"
        exit 1
    fi
done

# Check specific values
if [ "$(jq -r '.type' hacs.json)" != "dashboard" ]; then
    print_status "FAIL" "hacs.json type should be 'dashboard' for cards (HACS 2024+ schema)"
    exit 1
fi

if [ "$(jq -r '.content_in_root' hacs.json)" != "true" ]; then
    print_status "FAIL" "hacs.json content_in_root should be true for cards"
    exit 1
fi

print_status "PASS" "hacs.json validation passed"

# Validate package.json
echo ""
echo "📦 Validating package.json..."
if [ ! -f "package.json" ]; then
    print_status "FAIL" "package.json is missing"
    exit 1
fi

if ! jq empty package.json 2>/dev/null; then
    print_status "FAIL" "package.json is not valid JSON"
    exit 1
fi

# Check required fields
required_pkg_fields=("name" "version" "description")
for field in "${required_pkg_fields[@]}"; do
    if ! jq -e ".$field" package.json >/dev/null 2>&1; then
        print_status "FAIL" "package.json missing '$field' field"
        exit 1
    fi
done

print_status "PASS" "package.json validation passed"

# Check for license
echo ""
echo "📄 Checking license..."
if [ ! -f "LICENSE" ]; then
    print_status "WARN" "LICENSE file not found (recommended for HACS)"
else
    print_status "PASS" "LICENSE file exists"
fi

if ! jq -e '.license' package.json >/dev/null 2>&1; then
    print_status "WARN" "package.json missing 'license' field (recommended)"
else
    print_status "PASS" "package.json has 'license' field"
fi

# Validate README
echo ""
echo "📖 Validating README..."
if [ ! -f "README.md" ]; then
    print_status "FAIL" "README.md is missing"
    exit 1
fi

readme_size=$(stat -c%s "README.md")
if [ "$readme_size" -lt 500 ]; then
    print_status "FAIL" "README.md seems too small ($readme_size bytes)"
    exit 1
fi

if ! grep -qi "install" README.md; then
    print_status "FAIL" "README.md should contain installation instructions"
    exit 1
fi

if ! grep -qi "config" README.md; then
    print_status "FAIL" "README.md should contain configuration examples"
    exit 1
fi

print_status "PASS" "README.md validation passed"

# Validate repository structure
echo ""
echo "🏗️  Validating repository structure..."
if [ ! -d "src" ]; then
    print_status "FAIL" "src/ directory is missing"
    exit 1
fi

if [ ! -f "src/emergency-alerts-card.ts" ]; then
    print_status "FAIL" "Main source file src/emergency-alerts-card.ts is missing"
    exit 1
fi

if [ ! -f "tsconfig.json" ]; then
    print_status "FAIL" "tsconfig.json is missing"
    exit 1
fi

if [ ! -f "rollup.config.js" ]; then
    print_status "FAIL" "rollup.config.js is missing"
    exit 1
fi

print_status "PASS" "Repository structure validation passed"

# Build and validate output
echo ""
echo "🔨 Building and validating output..."
if ! npm run build >/dev/null 2>&1; then
    print_status "FAIL" "Build failed"
    exit 1
fi

if [ ! -f "dist/emergency-alerts-card.js" ]; then
    print_status "FAIL" "Main card file not found in dist/"
    exit 1
fi

file_size=$(stat -c%s "dist/emergency-alerts-card.js")
if [ "$file_size" -lt 1000 ]; then
    print_status "FAIL" "Card file seems too small ($file_size bytes)"
    exit 1
fi

if ! grep -q "customElements.define" dist/emergency-alerts-card.js; then
    print_status "FAIL" "Card file doesn't contain customElements.define"
    exit 1
fi

print_status "PASS" "Build validation passed"

# Run tests
echo ""
echo "🧪 Running tests..."
if ! npm test -- --watchAll=false >/dev/null 2>&1; then
    print_status "FAIL" "Tests failed"
    exit 1
fi

print_status "PASS" "Tests passed"

# Final summary
echo ""
echo "🎉 HACS validation completed successfully!"
echo "✅ Repository is HACS compliant"
echo ""
echo "📋 Summary:"
echo "  - hacs.json: ✅ Valid"
echo "  - package.json: ✅ Valid"
echo "  - README.md: ✅ Valid"
echo "  - Repository structure: ✅ Valid"
echo "  - Build output: ✅ Valid"
echo "  - Tests: ✅ Passed"
echo ""
echo "🚀 Ready for HACS submission!" 