# 📋 Contribution Guidelines

## ⚠️ Important: Documentation Creation Policy

### ❌ DO NOT Create Documentation Files Unless Explicitly Requested

**Agents should NEVER create markdown (.md) or documentation files without an explicit user request.**

This includes but is not limited to:
- `.md` documentation files
- `.txt` summary files
- Architecture diagrams
- Quick start guides
- Reference files

### ✅ When IS It Okay to Create Documentation?

Only create documentation files when:

1. **User explicitly asks for documentation**
   - "Create a guide for..."
   - "Write documentation for..."
   - "Generate a markdown file..."
   - "Create an API reference..."

2. **User requests a specific type of documentation**
   - "Add CONTRIBUTING.md"
   - "Create a CHANGELOG"
   - "Write a deployment guide"

3. **Documentation is critical for functionality**
   - Installation instructions if project won't work without them
   - Setup instructions if configuration is required
   - However, prefer inline comments in code first

### 📝 What to Do Instead

**When asked to implement features or fix code:**

1. ✅ Create or modify **JavaScript/TypeScript files** as needed
2. ✅ Create or modify **configuration files** as needed (tsconfig.json, package.json, etc.)
3. ✅ Add **inline comments and JSDoc** in the code
4. ✅ Ask the user if documentation is needed: *"Would you like me to create documentation for this?"*
5. ❌ Do NOT automatically create markdown files

### 💡 Examples

**❌ DON'T DO THIS:**
```
User: "Add a new API endpoint"
Agent: Creates endpoint code + 3 markdown files explaining it
```

**✅ DO THIS:**
```
User: "Add a new API endpoint"
Agent: Creates endpoint code with JSDoc comments
Agent: Asks: "Would you like documentation for this endpoint?"
```

**❌ DON'T DO THIS:**
```
User: "Refactor the authentication system"
Agent: Creates new files + creates REFACTORING.md, ARCHITECTURE.md, etc.
```

**✅ DO THIS:**
```
User: "Refactor the authentication system"
Agent: Refactors the code, adds inline comments
Agent: Says: "If you need documentation, I can create it. Just ask!"
```

**✅ DO THIS (WITH EXPLICIT REQUEST):**
```
User: "Refactor the authentication system and create documentation"
Agent: Refactors the code + creates AUTH_GUIDE.md
```

---

## 🎯 General Contribution Rules

### Code Quality
- Follow existing code style and conventions
- Use meaningful variable and function names
- Add JSDoc comments for public functions
- Keep functions focused and single-purpose
- Write clean, readable code

### File Organization
- Maintain the existing directory structure
- Don't create unnecessary directories
- Group related files together
- Use consistent naming conventions

### Testing
- Test code changes before committing
- Ensure existing functionality isn't broken
- Verify edge cases are handled

### Git Practices
- Write clear, concise commit messages
- One feature per commit when possible
- Reference issues when relevant

---

## 📁 Project Structure (DO NOT MODIFY WITHOUT REASON)

```
botui/
├── index.html              ← Main entry point
├── README.md               ← Project overview
├── CONTRIBUTION_GUIDELINES.md ← This file (keep it!)
├── src/                    ← Application code
│   ├── App.js              ← Root component
│   ├── pages/              ← Page components
│   ├── composables/        ← State management
│   ├── services/           ← Business logic
│   └── utils/              ← Utilities
└── utils/                  ← Legacy utilities (keep for reference)
```

### ✅ OK to Create
- New files in `src/pages/`, `src/composables/`, `src/services/`, `src/utils/`
- Configuration files (if needed)
- New directories within `src/` (with good reason)

### ❌ DO NOT Create
- Markdown files (unless explicitly requested)
- Documentation files
- Architecture diagrams
- Summary or reference files
- Files outside `src/` or root (without asking first)

---

## 🔍 How to Add Features

### 1. Adding a New Page
```javascript
// ✅ Create src/pages/NewPage.js
export default {
  props: { /* ... */ },
  template: `<!-- ... -->`,
  setup() { /* ... */ }
}

// ✅ Import in App.js and add to routing
// ❌ Do NOT create documentation about this
```

### 2. Adding a New Composable
```javascript
// ✅ Create src/composables/useNewFeature.js
export function useNewFeature() {
  // Composable logic
}

// ✅ Use in pages/composables
// ❌ Do NOT create a guide on how to use it
```

### 3. Adding a New Service
```javascript
// ✅ Create src/services/newService.js
export const newService = {
  // Service methods with JSDoc
}

// ✅ Use in composables
// ❌ Do NOT create documentation
```

---

## 🚫 Anti-Patterns (DO NOT DO THIS)

### ❌ Auto-Creating Multiple Documentation Files
```
User: "Fix a bug"
Agent: Fixes bug + creates BUGFIX.md + CHANGELOG.md + UPDATE.md
```

### ❌ Creating Unnecessary Summary Files
```
User: "Add a feature"
Agent: Adds feature + creates SUMMARY.txt + CHANGES.md + NOTES.md
```

### ❌ Creating Architecture Docs Automatically
```
User: "Refactor the code"
Agent: Refactors + creates ARCHITECTURE.md + DESIGN.md + PATTERNS.md
```

### ❌ Creating Reference Guides
```
User: "Update the API"
Agent: Updates API + creates API_REFERENCE.md + USAGE_GUIDE.md
```

---

## ✨ Good Practices

### ✅ Ask Before Creating Docs
> "I've completed the feature. Would you like me to create documentation?"

### ✅ Use JSDoc for Code Documentation
```javascript
/**
 * Loads reminders from the API or cache
 * @param {string} userId - The user ID
 * @returns {Promise<Array>} Array of reminder objects
 */
export async function loadReminders(userId) {
  // implementation
}
```

### ✅ Use Inline Comments for Complex Logic
```javascript
// Cache-first strategy: show cached data, update in background
const cached = getCacheData(url);
if (cached) {
  reminders.value = cached;
}
// Fetch and update
fetchReminders(userId).then(data => {
  reminders.value = data;
});
```

### ✅ Keep Code Clean and Self-Documenting
```javascript
// Good: clear names and structure
function handleReminderCreation(userId, reminderData) {
  // implementation
}

// Bad: vague names
function handle(u, d) {
  // implementation
}
```

---

## 🤖 For AI Agents / Copilot

### Core Rule
**DO NOT create markdown, documentation, or summary files unless the user explicitly asks for them.**

### When Implementing Features
1. Create/modify only code files (JS, HTML, CSS, config)
2. Add JSDoc and inline comments
3. **STOP** - Do not create documentation
4. Ask the user: *"Need documentation for this?"*

### When Fixing Bugs
1. Fix the code
2. Add comments explaining the fix
3. **STOP** - Do not create debug logs or fix reports
4. Tell the user what was fixed in a message

### When Refactoring
1. Refactor the code
2. Maintain or improve structure
3. Add comments if logic changed
4. **STOP** - Do not create refactoring guides
5. Ask: *"Should I document this refactoring?"*

### Exception: Critical Setup Docs
Only create documentation if:
- Project won't work without it
- User explicitly requests it
- Setup requires external configuration
- Otherwise, add to README.md only

---

## ❓ FAQ

**Q: The user asked me to do something, can I create docs?**
A: Only if they explicitly mention documentation. Otherwise, ask first.

**Q: Is README.md okay to update?**
A: Yes, if the changes are essential. Keep it concise and remove outdated info.

**Q: What if the project really needs documentation?**
A: Update README.md instead of creating new files. Keep it simple and clear.

**Q: I created documentation by mistake, should I delete it?**
A: Yes, unless the user explicitly asked for it. Ask the user to confirm before deleting.

**Q: What about CHANGELOG.md?**
A: Do NOT create automatically. Only if user asks or project requires it for releases.

---

## 📞 Questions?

If unsure about creating a file:
1. Check this document first
2. Ask in the commit message or comment
3. **Default to NOT creating documentation files**
4. Ask the user if unsure

---

**Last Updated:** November 18, 2025
**Status:** Active - Follow these guidelines for all contributions
