---
agent: edit
description: 'Document file in the project, following conventions from copilot-instructions and language-specific instructions.'
---

# Document File

Please document the file `${file}` following the project's established conventions.

## Guidelines

Apply the documentation and formatting standards from:
1. **General conventions**           — as defined in `copilot-instructions.md`
2. **Language-specific conventions** — from the appropriate `*.instructions.md` file for this file type

## Code Preservation Policy

**CRITICAL — Preserve ALL existing code:**
- **DO NOT** - remove any existing functionality
- **DO NOT** - remove or modify commented-out sections
- **DO NOT** - change core logic or behavior
- **ONLY**   - add documentation, comments, and formatting improvements

## What to Add

1. **File-level docstring**             — Module purpose and main functionality
2. **Import documentation**             — Inline comments explaining each import's purpose
3. **Function/Method/Class docstrings** — Using the appropriate style for the language
4. **Inline comments**                  — Explain complex logic, business rules, and data transformations
5. **Section headers**                  — Organize code into logical blocks with `===` or `---` separators
6. **Alignment formatting**             — Apply the universal alignment rule for related items