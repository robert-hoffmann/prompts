# Base Development Principles

These principles apply to **ALL** programming languages and file types.

### Design Principles

1. **KISS**  (Keep It Simple, Stupid)   — Favor straightforward solutions over clever ones
2. **DRY**   (Don't Repeat Yourself)    — Extract repeated logic into reusable components
3. **YAGNI** (You Aren't Gonna Need It) — Don't build features until they're actually needed
4. **Single Responsibility**            — Each function, class, or module should do one thing well

### Guiding Mantra

> **DON'T OVERCOMPLICATE / OVERENGINEER**
>
> Write clean, readable, and maintainable code. If a solution feels complex, step back and simplify.

### Architectural Preferences

- **Prefer composition over inheritance**                — Build behavior by combining small, focused components rather than deep inheritance hierarchies
- **Use third-party packages sparingly and judiciously** — Leverage the language's standard library first; only add dependencies when they provide significant value
- **Comprehensive error handling**                       — Use appropriate error/exception mechanisms with custom error types where beneficial

### Focus Areas (Universal)

These apply regardless of language:

- Performance optimization and profiling
- Memory management awareness
- Type safety (via annotations, hints, or static typing)
- Code readability and maintainability
- Simple, effective solutions
- Async/concurrent programming patterns (where applicable)
- Always use the most modern language features and idioms
- Always apply principles like: object-oriented programming, functional programming, modular design, reactive programming.

### Output Expectations

When generating or modifying code:

- Provide clean code with appropriate type annotations/hints
- Include performance benchmarks for critical paths (when relevant)
- Offer refactoring suggestions for existing code
- Include memory/performance profiling results when relevant

---

# Code Formatting & Alignment
> **Applies to:** All files (`*.*`)

## The Universal Alignment Rule

> **When you have a vertical list of related items with a separator, align the separators into a column.**

This applies to ALL languages, ALL contexts—code, comments, docstrings, configs, everything.

### The Pattern

```
<left>   <sep> <right>
<longer> <sep> <right>
<short>  <sep> <right>
```

Where:
- **Left elements** are padded with spaces to equal length
- **Separators** (`:`, `=`, `->`, `|`, etc.) form a vertical column
- **Right elements** start at the same column

### Examples Across Contexts

```python
# Variables
name        = "Alice"
age         = 30
is_active   = True

# Docstrings / Comments
# Args:
#     file_path   : Path to the input file.
#     max_retries : Number of retry attempts.
#     timeout     : Timeout in seconds.

# Dictionaries
config = {
    "host"     : "localhost",
    "port"     : 8080,
    "debug"    : True
}
```

```typescript
// Interfaces
interface User {
    id          : number;
    name        : string;
    createdAt   : Date;
}

// Objects
const settings = {
    theme       : "dark",
    fontSize    : 14,
    autoSave    : true
};
```

```css
/* Properties */
.container {
    display         : flex;
    justify-content : center;
    align-items     : stretch;
}
```

### When to Apply

1. **Logically related items** — Group declarations, config blocks, parameter lists
2. **Vertical lists** — 2+ items that share structure
3. **Clear separators** — `:`, `=`, `->`, `|`, or similar

### When NOT to Apply

- Single items (nothing to align with)
- Unrelated declarations
- Would require excessive padding (>20 spaces)

### The Mindset

> Imagine scanning the code quickly. Can your eye jump straight to what matters? If separators zigzag, alignment helps. If it's already clear, don't force it.

## Multiline Function Signatures

When a function has **2+ parameters**, format with one parameter per line:

```
function myFunction(
    param1   : Type1,
    param2   : Type2,
    param3   : Type3  = default
) -> ReturnType {
    // body
}
```

**The pattern mirrors verbose HTML/Vue attributes:**

```html
<MyComponent
    prop1   = "value1"
    prop2   = "value2"
    :prop3  = "dynamicValue"
    @event  = "handler"
/>
```

**Why:**
- Easier to scan parameters vertically
- Clean diffs when adding/removing parameters
- Aligns with the universal separator alignment rule
- Consistent across Python, TypeScript, JavaScript, etc.

---

# Documentation Requirements
> **Applies to:** All files (`*.*`)

## Core Documentation Principles

Good documentation transcends language syntax. These principles apply to **ALL** programming languages.

---

## Function/Method Documentation

Every function, method, or callable should include:

1. **Brief description** — What the function does (one line)
2. **Parameters**        — Each parameter with its type and purpose
3. **Return value**      — What is returned and its type
4. **Exceptions/Errors** — What errors can be raised and when
5. **Example**           — Usage example for non-trivial functions

```
<doc_block_start>
Brief description of what this function does.

<params_section>
    <param_name>: <type> - Description of the parameter
    <param_name>: <type> - Description of the parameter

<returns_section>
    <type> - Description of what is returned

<errors_section>
    <error_type> - When this error is raised

<example_section>
    <usage_example>
<doc_block_end>
```

**Principle:** A developer should understand how to use a function without reading its implementation.

---

## Class/Type Documentation

Every class, struct, or type definition should include:

1. **Purpose**               — What this type represents
2. **Attributes/Properties** — Key fields and their purposes
3. **Usage context**         — When and how to use this type

---

## Inline Comments

Add inline comments throughout code to explain:

- **Complex logic**        — Algorithms, formulas, or non-obvious operations
- **Business rules**       — Domain-specific requirements or constraints
- **Data transformations** — What data looks like before/after operations
- **Why, not what**        — Explain reasoning, not obvious mechanics

### Good Inline Comment Examples

```
# Calculate the weighted average, excluding zero-weight items
# to avoid division errors in edge cases

# Business rule: Orders over $1000 require manager approval
# per policy update 2024-03

# Transform: { id: 1, name: "x" } → { "1": "x" }
# for O(1) lookup in the validation step
```

### Avoid

```
# Increment counter (obvious from code)
# Loop through items (obvious from code)
```

---

## Import Statement Documentation

> **Applies to:** All languages with import/include/require statements

Imports are the entry point to understanding a file's dependencies. Document them clearly with inline comments explaining what each import provides.

**Single-line imports:**

```python
import asyncio # Async I/O event loop
import logging # Logging facility

from pathlib import Path # Filesystem path handling
```

```typescript
import express from 'express'; // Web framework
import axios   from 'axios';   // HTTP client
```

**Multi-import blocks** — when importing multiple items from the same package:
1. Document the package with a comment above or on the `from` line
2. Each import on its own line with aligned inline comments

```python
# Pydantic v2 for validated models and settings
from pydantic import (
    BaseModel,       # Base class for validated data models
    ConfigDict,      # Model configuration (strict, frozen, etc.)
    Field,           # Field constraints and metadata
    field_validator, # Field-level validation decorator
    model_validator  # Cross-field validation decorator
)
```

```typescript
// React hooks for state and lifecycle management
import {
    useState,    // Component state
    useEffect,   // Side effects and lifecycle
    useCallback, // Memoized callbacks
    useMemo      // Memoized values
} from 'react';
```

**Logical grouping** — organize imports into sections:

1. **Language built-ins / Standard library**
2. **Third-party packages**
3. **Project-specific / Local modules**

```python
# ============================================================================
# Standard Library
# ============================================================================
import asyncio # Async I/O
import logging # Logging facility

# ============================================================================
# Third-Party Packages
# ============================================================================
from pydantic import BaseModel # Validated data models

# ============================================================================
# Project-Specific
# ============================================================================
from myproject.utils import helper # Local utilities
```

**Principle:** A developer scanning imports should immediately understand what each dependency provides without looking it up.

---

## Variable Naming

- **Use descriptive names**                        — `customerOrderTotal` over `cot` or `x`
- **Comment when purpose isn't immediately clear** — especially for abbreviated names or domain terms
- **Consistent conventions**                       — Follow language idioms (camelCase, snake_case, etc.)

---

## Section Organization

For larger files, use section headers to organize code:

```
<comment_marker> ============================================================
<comment_marker> Section Name
<comment_marker> ============================================================
```

Or with lighter separators:

```
<comment_marker> ------------------------------------------------------------
<comment_marker> Subsection Name
<comment_marker> ------------------------------------------------------------
```

**Principle:** A developer scanning the file should quickly understand its structure.

---

## Documentation Goals

> **Make the code understandable even for developers new to the project.**

Ask yourself:
- Can someone unfamiliar with this codebase understand what this does?
- Are the business rules and constraints documented?
- Is the "why" explained, not just the "what"?

**Principle:** The code IS the documentation — write it so that it tells a clear story.

---

# Code Structure Guidelines
> **Applies to:** All files (`*.*`)

## Core Structure Principles

Well-organized code is easier to navigate, understand, and maintain. These principles apply to **ALL** programming languages.

---

## File Organization

Structure files in a logical, predictable order:

1. **File header/module documentation**
2. **Imports/includes/requires**
3. **Constants and configuration**
4. **Type definitions** (interfaces, types, classes)
5. **Helper/utility functions**
6. **Main logic/exports**
7. **Entry point** (if applicable)

---

## Section Headers

Use visual separators to divide code into logical sections:

### Major Sections (use `===`)

```
<comment> ============================================================================
<comment> Configuration and Constants
<comment> ============================================================================
```

### Minor Sections (use `---`)

```
<comment> ----------------------------------------------------------------------------
<comment> Helper Functions
<comment> ----------------------------------------------------------------------------
```

**Principle:** Consistent section markers make scanning large files fast and predictable.

---

## Code Preservation Rules

When modifying existing code:

1. **Preserve all existing functionality** — Don't remove features unless explicitly requested
2. **Keep commented-out sections**         — They often contain important context or fallback code
3. **Maintain existing structure**         — Follow the file's established patterns and organization
4. **Respect existing formatting**         — Match the surrounding code's style

---

## Spacing and Readability

1. **Consistent indentation**      — Follow language conventions (spaces vs tabs, indent size)
2. **Blank lines for separation**  — Use blank lines to separate logical blocks
3. **Alignment for related items** — See above: Code Formatting & Alignment
4. **Line length limits**          — Keep lines readable (typically 80-120 characters)

---

## Grouping Related Code

Keep related elements together:

- **Group related functions** — Functions that work together should be near each other
- **Group related imports**   — Organize imports by source (stdlib, third-party, local)
- **Group related constants** — Keep configuration values together

---

## Module/File Size

- **Prefer smaller, focused files** — Each file should have a clear, single purpose
- **Extract when too large**        — If a file grows beyond ~1500 lines (with documentation), consider splitting
- **Balance granularity**           — Don't create files so small they fragment understanding

---

# Refactoring Guidelines
> **Applies to:** All files (`*.*`)

## Core Refactoring Principles

These refactoring practices apply to **ALL** programming languages. The goal is to improve code quality without changing external behavior.

---

## Code Extraction

### Identify Duplicate Code

- Look for repeated patterns across functions or files
- Extract into reusable functions, methods, or utilities
- Use parameters to handle variations

### Break Down Complex Functions

- If a function does multiple things, split it into smaller functions
- Each function should have a single, clear purpose
- Aim for functions that fit on one screen (~20-30 lines)

---

## Naming Improvements

- **Improve variable names** — Rename unclear or abbreviated names to descriptive ones
- **Improve function names** — Names should describe what the function does
- **Consistent naming**      — Follow language conventions throughout the codebase
- **Domain terms**           — Use consistent terminology from the problem domain

---

## Code Cleanup

### Remove Dead Code

- Delete unused variables
- Delete unused functions/methods
- Delete unreachable code branches
- Remove unnecessary comments that state the obvious

### Simplify Logic

- Reduce nesting depth (early returns, guard clauses)
- Simplify boolean expressions
- Replace complex conditionals with named functions
- Use language idioms instead of verbose patterns

---

## Performance Optimization

- **Use efficient algorithms**     — Choose appropriate data structures and algorithms
- **Avoid premature optimization** — Profile first, optimize bottlenecks
- **Memory efficiency**            — Use generators/iterators for large datasets
- **Lazy evaluation**              — Defer computation until needed

---

## Logging and Observability

> **Use logging extensively so we can easily identify errors**

- Add logging at key decision points
- Log function entry/exit for complex operations
- Include relevant context in log messages
- Use appropriate log levels (debug, info, warning, error)

---

## Refactoring Checklist

When reviewing code for refactoring opportunities, check for:

- [ ] Duplicate code that could be extracted
- [ ] Functions doing too many things
- [ ] Unclear or abbreviated names
- [ ] Dead code or unused variables
- [ ] Deep nesting that could be flattened
- [ ] Missing error handling
- [ ] Missing logging for debugging
- [ ] Inefficient algorithms or data structures
- [ ] Magic numbers/strings that should be constants

---

## Safe Refactoring

1. **Make small, incremental changes** - to isolate issues
2. **Verify behavior**                 - after each change
3. **Keep commits focused**            — one refactoring per commit

---

# Important
> **Applies to:** All files (`*.*`)

  - **DO NOT REMOVE** relevant comment tags like: BUG, HACK, FIXME, TODO, INFO, IMPORTANT, WARNING
    - These are tags added by developers to indicate specific issues or important notes in the code.
  - There is a special tag `AGENT_TODO`, that when seen in then comments of code, indicates things that the agent should do, or deeply take into account.
    - This explains what changes the agent should make to the code, or what it should take into account when generating new code.
    - Once new code is generated, the agent should replace `AGENT_TODO` with `AGENT_DONE` and add a comment that explains what it did, and why it did it.
      - **Unless** the code is something like a JSON file where any type of tag or comment would actually break the file.

# Document generation
  - **Do not** create summary documents, manuals, or FAQs, unless the user specifically requests such a file.
  - **Do yes** ask the user if they want a such a document, if the changes are significant enough to warrant it.