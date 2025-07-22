#!/bin/bash

# Simple HACS Requirements Test
# Tests the key requirements that HACS validates

set -e

echo "🔍 Testing HACS Requirements..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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
        "INFO")
            echo -e "${BLUE}ℹ️  $message${NC}"
            ;;
    esac
}

# Test 1: Check if hacs.json exists and is valid JSON
echo ""
print_status "INFO" "Test 1: hacs.json validation"
if [ -f "hacs.json" ]; then
    if jq empty hacs.json 2>/dev/null; then
        print_status "PASS" "hacs.json exists and is valid JSON"
    else
        print_status "FAIL" "hacs.json is not valid JSON"
        exit 1
    fi
else
    print_status "FAIL" "hacs.json is missing"
    exit 1
fi

# Test 2: Check required fields in hacs.json
echo ""
print_status "INFO" "Test 2: Required fields in hacs.json"
required_fields=("name" "filename" "homeassistant")
for field in "${required_fields[@]}"; do
    if jq -e "has(\"$field\")" hacs.json >/dev/null 2>&1; then
        print_status "PASS" "hacs.json has '$field' field"
    else
        print_status "FAIL" "hacs.json missing '$field' field"
        exit 1
    fi
done

# Test 3: Check if the specified file exists
echo ""
print_status "INFO" "Test 3: File existence check"
filename=$(jq -r '.filename' hacs.json)
if [ -f "$filename" ]; then
    print_status "PASS" "File '$filename' exists"
else
    print_status "FAIL" "File '$filename' does not exist"
    exit 1
fi

# Test 4: Check if the file contains customElements.define
echo ""
print_status "INFO" "Test 4: File content validation"
if grep -q "customElements.define" "$filename"; then
    print_status "PASS" "File contains customElements.define"
else
    print_status "FAIL" "File does not contain customElements.define"
    exit 1
fi

# Test 5: Check file size
echo ""
print_status "INFO" "Test 5: File size check"
if [[ "$OSTYPE" == "darwin"* ]]; then
    file_size=$(stat -f%z "$filename")
else
    file_size=$(stat -c%s "$filename")
fi
if [ "$file_size" -gt 1000 ]; then
    print_status "PASS" "File size is reasonable ($file_size bytes)"
else
    print_status "FAIL" "File seems too small ($file_size bytes)"
    exit 1
fi

# Test 6: Check README.md
echo ""
print_status "INFO" "Test 6: README.md check"
if [ -f "README.md" ]; then
    if [[ "$OSTYPE" == "darwin"* ]]; then
        readme_size=$(stat -f%z "README.md")
    else
        readme_size=$(stat -c%s "README.md")
    fi
    if [ "$readme_size" -gt 500 ]; then
        print_status "PASS" "README.md exists and has reasonable size ($readme_size bytes)"
    else
        print_status "FAIL" "README.md seems too small ($readme_size bytes)"
        exit 1
    fi
else
    print_status "FAIL" "README.md is missing"
    exit 1
fi

# Test 7: Check package.json
echo ""
print_status "INFO" "Test 7: package.json check"
if [ -f "package.json" ]; then
    if jq empty package.json 2>/dev/null; then
        print_status "PASS" "package.json exists and is valid JSON"
    else
        print_status "FAIL" "package.json is not valid JSON"
        exit 1
    fi
else
    print_status "FAIL" "package.json is missing"
    exit 1
fi

# Test 8: Check repository structure
echo ""
print_status "INFO" "Test 8: Repository structure check"
if [ -d "src" ] && [ -f "src/emergency-alerts-card.ts" ]; then
    print_status "PASS" "Source directory and main file exist"
else
    print_status "FAIL" "Source directory or main file missing"
    exit 1
fi

echo ""
print_status "PASS" "All HACS requirements tests passed!"
print_status "INFO" "This covers the key requirements that HACS validates"
print_status "INFO" "For full validation, run in GitHub Actions or with a valid GITHUB_TOKEN" 