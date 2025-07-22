# HACS Validation Options

This repository provides multiple ways to validate HACS compliance, ensuring consistency between local development and GitHub Actions.

## Validation Scripts

### 1. Local Custom Validation (`validate-hacs.sh`)
**Command**: `npm run validate:hacs` or `./validate-hacs.sh`

**Features**:
- ✅ Fast local validation
- ✅ Cross-platform compatibility (macOS/Linux)
- ✅ No external dependencies (except jq)
- ✅ Comprehensive checks for HACS requirements
- ✅ Build and test validation

**Use when**: You want quick local feedback during development.

### 2. Official HACS Action Validation (`validate-hacs-official.sh`)
**Command**: `npm run validate:hacs:official` or `./validate-hacs-official.sh`

**Features**:
- ✅ Uses the exact same validation as GitHub Actions
- ✅ Official HACS validation logic
- ✅ Docker-based for consistency
- ✅ Matches production validation exactly

**Requirements**:
- Docker installed and running
- Optional: `GITHUB_TOKEN` for full validation

**Use when**: You want to ensure your local validation matches GitHub Actions exactly.

## Running Official Validation

### Basic Mode (No Token)
```bash
./validate-hacs-official.sh
```
This runs the official HACS validation logic but will fail on GitHub API calls (expected).

### Full Mode (With Token)
```bash
export GITHUB_TOKEN=your_github_token_here
./validate-hacs-official.sh
```
This runs complete validation including GitHub API checks.

## GitHub Actions Validation

The repository includes GitHub Actions workflows that automatically run HACS validation:

- **`.github/workflows/hacs.yml`** - HACS validation on push/PR
- **`.github/workflows/ci.yml`** - Full CI including HACS validation
- **`.github/workflows/test.yml`** - Comprehensive testing

## Validation Checklist

Both validation methods check for:

- ✅ `hacs.json` structure and required fields
- ✅ `package.json` requirements
- ✅ README.md content and size
- ✅ Repository structure
- ✅ Build output validation
- ✅ File content validation (customElements.define)
- ✅ Cross-platform compatibility

## Troubleshooting

### Docker Issues
If you get Docker platform warnings on Apple Silicon:
```bash
# The warning is harmless, but you can suppress it:
export DOCKER_DEFAULT_PLATFORM=linux/amd64
./validate-hacs-official.sh
```

### GitHub Token Issues
If you don't have a GitHub token:
- Use the basic mode (expected to fail on API calls)
- Or use the local custom validation instead
- For full validation, run in GitHub Actions

### File Path Issues
If you get file not found errors:
- Ensure you're running from the repository root
- Check that `dist/emergency-alerts-card.js` exists
- Run `npm run build` to generate the file

## Recommended Workflow

1. **During development**: Use `npm run validate:hacs` for quick feedback
2. **Before committing**: Use `npm run validate:hacs:official` to match CI
3. **In CI/CD**: GitHub Actions automatically runs official validation
4. **For releases**: All validations must pass in GitHub Actions

## Validation Results

All validation scripts provide clear, colored output:
- 🟢 **PASS** - Validation successful
- 🔴 **FAIL** - Validation failed (check output for details)
- 🟡 **WARN** - Warning (non-blocking)
- 🔵 **INFO** - Informational message 