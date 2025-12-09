# Base Development Principles

These principles apply to **ALL** programming languages and file types.

### Design Principles

1. **KISS** (Keep It Simple, Stupid) — Favor straightforward solutions over clever ones
2. **DRY** (Don't Repeat Yourself) — Extract repeated logic into reusable components
3. **YAGNI** (You Aren't Gonna Need It) — Don't build features until they're actually needed
4. **Single Responsibility** — Each function, class, or module should do one thing well

### Guiding Mantra

> **DON'T OVERCOMPLICATE / OVERENGINEER**
>
> Write clean, readable, and maintainable code. If a solution feels complex, step back and simplify.

### Architectural Preferences

- **Prefer composition over inheritance** — Build behavior by combining small, focused components rather than deep inheritance hierarchies
- **Use third-party packages sparingly and judiciously** — Leverage the language's standard library first; only add dependencies when they provide significant value
- **Comprehensive error handling** — Use appropriate error/exception mechanisms with custom error types where beneficial

### Focus Areas (Universal)

These apply regardless of language:

- Performance optimization and profiling
- Memory management awareness
- Type safety (via annotations, hints, or static typing)
- Code readability and maintainability
- Simple, effective solutions
- Async/concurrent programming patterns (where applicable)

### Output Expectations

When generating or modifying code:

- Provide clean code with appropriate type annotations/hints
- Include performance benchmarks for critical paths (when relevant)
- Offer refactoring suggestions for existing code
- Include memory/performance profiling results when relevant




# Code Formatting & Alignment
> **Applies to:** All files (`*.*`)

## Core Alignment Principles

Consistent visual alignment improves code readability across **ALL** languages. These patterns should be adapted to each language's syntax while maintaining the core principle: **vertically align related elements**.

---

## Variable/Assignment Alignment

Align the assignment operators (or equivalent) when declaring multiple related variables:

```
<variable_name>      <assignment_op> <value>
<longer_name>        <assignment_op> <value>
<short>              <assignment_op> <value>
```

**Principle:** Pad variable names with spaces so assignment operators form a vertical column.

---

## Object/Dictionary/Map Alignment

When defining key-value structures, align both the keys and the separators:

```
<structure> = {
    <key>              : <value>,
    <longer_key>       : <value>,
    <short>            : <value>,
    <very_long_key>    : <value>
}
```

**Principle:** 
- Keys are left-aligned
- Colons/separators form a vertical column
- Values are left-aligned after the separator
- Use spaces before the colon/separator for alignment

---

## Nested Structure Alignment

For nested objects/dictionaries, maintain alignment within each level:

```
<structure> = {
    <section_a>  : {
        <key>      : <value>,
        <longer>   : <value>
    },
    <section_b>  : {
        <key>      : <value>,
        <longer>   : <value>
    }
}
```

**Principle:** Each nesting level has its own alignment context.

---

## Class/Type Property Alignment

When declaring class properties or type fields, align types and default values:

```
<class_definition>:
    <property>        : <type>
    <longer_prop>     : <type>   = <default>
    <short>           : <type>   = <default>
```

**Principle:** Align property names, type annotations, and default values into columns.

---

## Import/Include Statement Alignment

When importing multiple modules, align with explanatory comments:

```
<import> <module>       <comment: purpose>
<import> <module>       <comment: purpose>
<import> <longer_mod>   <comment: purpose>
```

**Principle:** Module names and trailing comments should form aligned columns.

---

## Array/List/Collection Formatting

For collections with multiple items, prefer vertical formatting:

```
<collection> = [
    <item_1>,
    <item_2>,
    <item_3>,
    <item_4>
]
```

**Principle:** One item per line, consistent indentation, trailing comma optional (follow language conventions).

---

## Function/Method Parameter Alignment

For functions with many parameters, break across lines with alignment:

```
<function_definition>(
    <param>          : <type>,
    <longer_param>   : <type>,
    <short>          : <type>   = <default>
) -> <return_type>:
```

**Principle:** Parameters align vertically, with types and defaults forming columns.

---

## General Rules

1. **Consistency within scope** — All related declarations in a block should follow the same alignment
2. **Don't over-align** — Only align items that are logically related
3. **Preserve alignment on edits** — When modifying aligned code, maintain the alignment pattern
4. **IDE/formatter compatibility** — Configure formatters to preserve manual alignment where possible




# Documentation Requirements
> **Applies to:** All files (`*.*`)

## Core Documentation Principles

Good documentation transcends language syntax. These principles apply to **ALL** programming languages.

---

## Function/Method Documentation

Every function, method, or callable should include:

1. **Brief description** — What the function does (one line)
2. **Parameters** — Each parameter with its type and purpose
3. **Return value** — What is returned and its type
4. **Exceptions/Errors** — What errors can be raised and when
5. **Example** — Usage example for non-trivial functions

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

1. **Purpose** — What this type represents
2. **Attributes/Properties** — Key fields and their purposes
3. **Usage context** — When and how to use this type

---

## Inline Comments

Add inline comments throughout code to explain:

- **Complex logic** — Algorithms, formulas, or non-obvious operations
- **Business rules** — Domain-specific requirements or constraints
- **Data transformations** — What data looks like before/after operations
- **Why, not what** — Explain reasoning, not obvious mechanics

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

## Variable Naming

- **Use descriptive names** — `customerOrderTotal` over `cot` or `x`
- **Comment when purpose isn't immediately clear** — especially for abbreviated names or domain terms
- **Consistent conventions** — Follow language idioms (camelCase, snake_case, etc.)

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
2. **Keep commented-out sections** — They often contain important context or fallback code
3. **Maintain existing structure** — Follow the file's established patterns and organization
4. **Respect existing formatting** — Match the surrounding code's style

---

## Spacing and Readability

1. **Consistent indentation** — Follow language conventions (spaces vs tabs, indent size)
2. **Blank lines for separation** — Use blank lines to separate logical blocks
3. **Alignment for related items** — See above: Code Formatting & Alignment
4. **Line length limits** — Keep lines readable (typically 80-120 characters)

---

## Grouping Related Code

Keep related elements together:

- **Group related functions** — Functions that work together should be near each other
- **Group related imports** — Organize imports by source (stdlib, third-party, local)
- **Group related constants** — Keep configuration values together

---

## Module/File Size

- **Prefer smaller, focused files** — Each file should have a clear, single purpose
- **Extract when too large** — If a file grows beyond ~500 lines, consider splitting
- **Balance granularity** — Don't create files so small they fragment understanding





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
- **Consistent naming** — Follow language conventions throughout the codebase
- **Domain terms** — Use consistent terminology from the problem domain

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

- **Use efficient algorithms** — Choose appropriate data structures and algorithms
- **Avoid premature optimization** — Profile first, optimize bottlenecks
- **Memory efficiency** — Use generators/iterators for large datasets
- **Lazy evaluation** — Defer computation until needed

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

1. **Ensure tests exist** before refactoring
2. **Make small, incremental changes**
3. **Verify behavior** after each change
4. **Keep commits focused** — One refactoring per commit




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