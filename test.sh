#!/bin/bash

# Emergency Alerts Card Test Runner
# Tests the Lovelace frontend card

set -e

echo "🎨 Emergency Alerts Card Test Suite"
echo "==================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${2}${1}${NC}"
}

# Function to run frontend tests
run_frontend_tests() {
    print_status "🧪 Running Frontend Tests..." "$YELLOW"
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        print_status "Installing frontend dependencies..." "$YELLOW"
        npm ci
    fi
    
    # Run Jest tests
    print_status "Running Jest unit tests..." "$YELLOW"
    npm test -- --coverage --watchAll=false
    
    if [ $? -eq 0 ]; then
        print_status "✅ Frontend tests passed!" "$GREEN"
    else
        print_status "❌ Frontend tests failed!" "$RED"
        exit 1
    fi
}

# Function to run TypeScript compilation check
run_typescript_check() {
    print_status "🔧 Checking TypeScript Compilation..." "$YELLOW"
    
    npx tsc --noEmit
    
    if [ $? -eq 0 ]; then
        print_status "✅ TypeScript compilation successful!" "$GREEN"
    else
        print_status "❌ TypeScript compilation errors!" "$RED"
        exit 1
    fi
}

# Function to run linting
run_linting() {
    print_status "🔍 Running Code Quality Checks..." "$YELLOW"
    
    # ESLint
    if npm list eslint &>/dev/null; then
        print_status "Running ESLint..." "$YELLOW"
        npm run lint
        if [ $? -eq 0 ]; then
            print_status "✅ ESLint passed!" "$GREEN"
        else
            print_status "⚠️  ESLint warnings/errors found" "$YELLOW"
        fi
    else
        print_status "⚠️  ESLint not configured, skipping" "$YELLOW"
    fi
    
    # Prettier
    if npm list prettier &>/dev/null; then
        print_status "Checking Prettier formatting..." "$YELLOW"
        npm run format:check
        if [ $? -eq 0 ]; then
            print_status "✅ Prettier formatting check passed!" "$GREEN"
        else
            print_status "⚠️  Prettier formatting issues found" "$YELLOW"
            print_status "Run 'npm run format' to fix formatting" "$YELLOW"
        fi
    else
        print_status "⚠️  Prettier not configured, skipping" "$YELLOW"
    fi
}

# Function to build the card
run_build() {
    print_status "🏗️  Building Card..." "$YELLOW"
    
    npm run build
    
    if [ $? -eq 0 ]; then
        print_status "✅ Build successful!" "$GREEN"
        if [ -f "dist/emergency-alerts-card.js" ]; then
            print_status "📦 Built file: dist/emergency-alerts-card.js" "$GREEN"
        fi
    else
        print_status "❌ Build failed!" "$RED"
        exit 1
    fi
}

# Function to validate package structure
validate_structure() {
    print_status "📋 Validating Package Structure..." "$YELLOW"
    
    required_files=(
        "src/emergency-alerts-card.ts"
        "package.json"
        "tsconfig.json"
        "hacs.json"
        "README.md"
    )
    
    for file in "${required_files[@]}"; do
        if [ ! -f "$file" ]; then
            print_status "❌ Missing required file: $file" "$RED"
            exit 1
        fi
    done
    
    print_status "✅ Package structure valid!" "$GREEN"
}

# Main execution
main() {
    # Parse command line arguments
    RUN_BUILD=false
    SKIP_LINT=false
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --build)
                RUN_BUILD=true
                shift
                ;;
            --skip-lint)
                SKIP_LINT=true
                shift
                ;;
            -h|--help)
                echo "Usage: $0 [options]"
                echo "Options:"
                echo "  --build        Include build step"
                echo "  --skip-lint    Skip linting checks"
                echo "  -h, --help     Show this help message"
                exit 0
                ;;
            *)
                echo "Unknown option: $1"
                echo "Use -h or --help for usage information"
                exit 1
                ;;
        esac
    done
    
    print_status "🚀 Starting Emergency Alerts Card tests..." "$YELLOW"
    
    # Validate structure
    validate_structure
    
    # TypeScript compilation check
    run_typescript_check
    
    # Run tests
    run_frontend_tests
    
    # Run linting if not skipped
    if [ "$SKIP_LINT" = false ]; then
        run_linting
    fi
    
    # Run build if requested
    if [ "$RUN_BUILD" = true ]; then
        run_build
    fi
    
    print_status "🎉 All tests completed successfully!" "$GREEN"
    if [ "$RUN_BUILD" = true ]; then
        print_status "📦 Card ready for distribution!" "$GREEN"
    fi
    print_status "📊 Check coverage report: coverage/lcov-report/index.html" "$YELLOW"
}

# Run main function with all arguments
main "$@" 