---
description: Project configuration and memory bank system for Claude Code
alwaysApply: true
---

# Project Configuration

This file contains project-specific intelligence and configuration for Claude Code sessions.

## Memory Bank System

This project uses a Memory Bank system to maintain context across sessions. All memory files are stored in `.claude/memory-bank/` and should be read at the start of every conversation.

### Core Memory Files (Read these in order):
1. **memory-rules.md** - System documentation
2. **projectbrief.md** - Foundation document
3. **productContext.md** - Product vision
4. **systemPatterns.md** - Architecture patterns
5. **techContext.md** - Technical setup
6. **activeContext.md** - Current work focus
7. **progress.md** - Status tracking

## Instructions for Claude

### On Every Session Start:
1. **Read all core memory bank files** in the order listed above
2. Verify understanding of current context
3. Check activeContext.md for immediate priorities
4. Review progress.md to understand what's complete and what's pending

### When User Says "update memory bank":
1. **Review ALL memory bank files** (mandatory - don't skip any)
2. Update files that need changes based on recent work
3. Pay special attention to activeContext.md and progress.md
4. Document any new patterns discovered
5. Update project intelligence in this file if needed

### Planning Mode (via /plan command):
1. Read Memory Bank (automatic)
2. Verify context completeness
3. Ask 4-6 clarifying questions based on findings
4. Draft comprehensive plan
5. Get user approval
6. Implement systematically

## Project Intelligence

This section grows as patterns and preferences are discovered during work on this project.

### Project-Specific Patterns

**Switch-Based Architecture (v2.0)**
- Card controls backend via switch entities, not service calls
- Switch entity naming: `switch.{alert_name}_{acknowledged,snoozed,resolved}`
- Backend enforces mutual exclusivity automatically
- Snooze uses `turn_on` (not toggle) since it auto-expires
- AlertService converts `binary_sensor` IDs to `switch` IDs automatically

**Modular Code Organization**
- Main component in `src/emergency-alerts-card.ts` (645 lines)
- Utilities in `src/utils/` (formatters, filters, sorters, groupers, entity-discovery)
- Service layer in `src/services/alert-service.ts`
- Each module has single responsibility, 100% test coverage target

**Testing Approach**
- Jest with 90 unit tests across utils and services
- Integration tests needed for main component
- High coverage for utils (87%) and services (100%)
- Tests organized by module in `src/__tests__/`

### User Preferences

**Documentation Style**
- User prefers SIMPLE, current-focused documentation
- NO version comparison or migration drama (user quote: "don't make it a huge deal since no one used v1 anyway")
- Document current functionality as if it's the only version
- Remove historical context unless specifically relevant

**Development Workflow**
- Fast iterations with Claude Code and Cursor
- Heavy AI assistance expected and embraced
- Test coverage matters (>80% target)
- HACS compliance is important for distribution

**Communication**
- Direct, concise responses
- Avoid over-explaining or verbose updates
- Focus on what's needed, not what was done

### Lessons Learned

**v2.0 Switch Architecture Benefits**
- Moving state management to backend (switches) eliminated frontend race conditions
- Switch entities provide visibility and direct control in HA UI
- Backend timers (escalation, snooze expiry) more reliable than frontend timers
- Clean separation: card is just a UI, backend handles logic

**AI-Assisted Development Works**
- Despite being AI-generated, code quality is high with proper guidance
- Type safety, tests, and modularity prevent typical AI code issues
- Comprehensive documentation helps both humans and AI understand codebase
- JSDoc comments critical for AI to maintain context across sessions

**HACS Compliance**
- Compiled file should be at repository root (not in dist/)
- Simple hacs.json: just `"filename": "card-name.js"` (no path)
- Follow established patterns (card-mod, button-card, boilerplate-card)
- HACS loads from `/hacsfiles/repo-name/card-name.js`
- Sourcemaps are helpful for debugging
- GitHub Actions validation saves time vs manual checks
- Repository topics matter for discoverability

### Known Gotchas

**HACS File Path (FIXED in v2.0.1)**
- HACS expects compiled file at repository root, not in dist/
- `hacs.json` should have just filename: `"filename": "card-name.js"` (NO path)
- Don't use `"content_in_root": false` with file in dist/ - causes 404 errors
- Pattern: Research popular cards (card-mod, button-card) for examples
- If getting 404 on `/hacsfiles/...`, check file location and hacs.json

**Entity ID Conversion**
- AlertService must convert `binary_sensor.emergency_foo` to `switch.emergency_foo_acknowledged`
- Pattern: Replace `binary_sensor.` with `switch.` + append `_switchType`
- Works for ANY binary_sensor, not just those with `emergency_` prefix

**Mutual Exclusivity**
- Enforced by BACKEND, not frontend
- Frontend just toggles switches, backend handles turning off others
- Don't try to manage exclusivity in card code

**Snooze Auto-Expiry**
- Snooze automatically turns OFF after 5 minutes
- Use `turn_on` not `toggle` since it's one-way activation
- Backend handles expiry timer

**Alert Status Priority**
- Order matters: resolved > escalated > snoozed > acknowledged > active
- Status determined in `getAlertStatus()` in entity-discovery.ts:16

**Card Registration (FIXED in v2.0.4)**
- Custom cards MUST use 'custom:' prefix in type registration
- Registration: `window.customCards.push({ type: 'custom:emergency-alerts-card', ... })`
- Without 'custom:' prefix, card won't appear in HA dashboard picker
- Home Assistant requirement for all custom cards

**HACS Manifest Validation (FIXED in v2.0.4)**
- NEVER add 'type' field to hacs.json manifest
- HACS determines type from GitHub Actions workflow category parameter
- Error: `extra keys not allowed @ data['type']`
- Valid fields: name, render_readme, filename, homeassistant (version)

**setConfig Validation (FIXED in v2.0.5)**
- Don't validate config.type in setConfig() - HA provides it via framework
- HA may call setConfig() with minimal config during initialization
- Only validate: `if (!config)` - not `if (!config || !config.type)`
- Otherwise card crashes when added via UI with empty config

### Effective Approaches

**When Making Documentation Updates**
- Read existing docs first to understand current state
- Make targeted updates, don't rewrite everything
- Remove outdated version markers and historical context
- Keep it simple and current-focused

**When Working with Memory Bank**
- Read all files in order at session start
- Update based on actual work done, not speculation
- Keep activeContext.md and progress.md current
- Document patterns as they're discovered, not preemptively

**When Updating Code**
- Start with types (types.ts)
- Write utils with tests (src/utils/, src/__tests__/)
- Update main component last
- Maintain modular structure

**When Debugging**
- Check console logs (AlertService prefixes with "[Emergency Alerts Card]")
- Verify switch entities exist in HA (`switch.emergency_*_{acknowledged,snoozed,resolved}`)
- Use browser DevTools with sourcemaps enabled
- Check binary_sensor attributes for expected values

---

## Notes

- Memory Bank files are in `.claude/memory-bank/`
- Templates are provided - fill them out based on actual project
- Update frequently to maintain accuracy
- The Memory Bank is the primary context system for this project
