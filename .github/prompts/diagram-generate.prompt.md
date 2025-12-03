---
agent: ask
description: 'Generate a comprehensive Mermaid diagram from a source file with clickable elements, dual-theme colors, and detailed documentation.'
---

Please generate a comprehensive `Mermaid` diagram from the following file:

Filename: ${file}

## Instructions:

### 1. Analysis & Diagram Type Selection
- Analyze the file at the given path thoroughly
- Determine the most appropriate diagram type based on content:
  - **Flowchart**          : For procedural code, algorithms, decision flows
  - **Class Diagram**      : For object-oriented code with classes and relationships
  - **Sequence Diagram**   : For interaction patterns, API calls, workflows
  - **Git Graph**          : For version control workflows
  - **State Diagram**      : For state machines or status transitions
  - **Entity Relationship**: For data models and database schemas

### 2. Mermaid Syntax Requirements
**CRITICAL**: Follow these syntax rules to prevent parsing errors:

#### Node Label Formatting
- **ALWAYS** wrap node labels containing special characters in double quotes: `["label text"]`
- **REQUIRED** for labels with: emojis, line breaks (`<br/>`), parentheses, quotes, or special symbols
- **Examples**:
  - ✅ Correct  : `NODE1["🚀 Start Process<br/>Initialize system"]`
  - ❌ Incorrect: `NODE1[🚀 Start Process<br/>Initialize system]`

#### Special Character Handling
- **Remove single quotes** from function calls in labels: use `get_api locations` instead of `get_api('locations')`
- **Escape problematic characters** or simplify labels to avoid parsing conflicts
- **Use HTML entities** if needed: `&lt;` for `<`, `&gt;` for `>`, `&amp;` for `&`

#### Subgraph Syntax
- **Always quote subgraph titles**: `subgraph UTILS ["🛠️ Utility Functions"]`
- Use consistent formatting for all subgraph elements

#### Edge Labels
- Keep edge labels simple and avoid special characters in edge text
- Use pipe syntax for complex edge labels: `A -->|"simple text"| B`

### 3. Color Scheme Requirements
Apply a dual-theme compatible color scheme that works in both light and dark modes:
```
Primary   : #2563eb (blue-600)
Secondary : #7c3aed (violet-600)
Success   : #059669 (emerald-600)
Warning   : #d97706 (amber-600)
Error     : #dc2626 (red-600)
Neutral   : #6b7280 (gray-500)
Background: #f8fafc (slate-50) for light, #1e293b (slate-800) for dark
```

### 4. Clickable Elements
- Add click events to diagram elements using Mermaid's click syntax
- Format: `click elementId "vscode://file/${file}:lineNumber" "Open in VS Code"`
- Include line numbers where each function, class, or significant code block begins
- Ensure all major components are clickable and link to their source code location

### 5. Output Structure
Generate a markdown file with the following structure:

```markdown
# [Filename] - Code Structure Diagram

## Overview
[Provide a comprehensive explanation of the code structure, purpose, and key components]

## Architecture Summary
[Describe the overall architecture, design patterns used, and key relationships]

## Component Details
[List and explain each major component, function, or class shown in the diagram]

## Mermaid Diagram

```mermaid
[Your generated diagram here with clickable elements and dual-theme colors]
```

## Notes
[Any additional notes about implementation details, dependencies, or important considerations]

## Legend
[Explain the color coding and symbols used in the diagram]
```

### 6. File Saving
- Save the generated diagram as a `.md` file in the same directory as the source file
- Naming convention: `[original_filename]_diagram.md`
- Example: If analyzing `scheduler.py`, save as `scheduler_diagram.md`

### 7. Quality Requirements
- Ensure diagram is comprehensive but not cluttered
- Include all public methods, classes, and significant private methods
- Show relationships, dependencies, and data flow where applicable
- Use consistent styling and clear labeling
- Validate that all click links reference correct line numbers
- **VALIDATE MERMAID SYNTAX**: Test all node labels with special characters in quotes

### 8. Syntax Validation Checklist
Before finalizing the diagram, verify:
- [ ] All node labels with emojis, line breaks, or special chars are quoted: `["text"]`
- [ ] No single quotes in function calls within labels
- [ ] Subgraph titles are properly quoted
- [ ] Edge labels are simple and clean
- [ ] No unescaped special characters that could break parsing
- [ ] Consistent node ID naming (no spaces, special chars in IDs)

### 9. Additional Enhancements
- Include a table of contents for complex diagrams
- Add timestamps and file version information
- Include cross-references to related files if applicable
- Ensure proper escaping of special characters in code elements