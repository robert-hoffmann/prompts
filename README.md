# Copilot Prompt Collection

> The actual prompts, settings, and guidelines I use daily for maintaining a mission-critical production application in the aerospace industry.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## What's This?

This isn't a theoretical "best practices" collection, it's the exact setup i'm running in production right now.

These prompts and instructions make Copilot generate code that's:

- **Actually documented** — with inline comments that explain the *why*, not just the *what*
- **Consistently formatted** — aligned properties, organized sections, predictable structure
- **Type-safe** — full type hints in Python, strict TypeScript, proper JSDoc
- **Easy to review** — clean, readable output that makes code review straightforward

A note on workflow: These prompts work best in `Ask` and `Edit` modes where you review suggestions before applying them. Agent mode is useful for scaffolding or exploratory tasks, but remember, AI makes mistakes. Always peer-review generated code regardless of the mode used.

---

## What's Included

### Instructions (Auto-Applied Rules)

These get applied automatically based on file type when you open matching files.

| File | Applies To | Purpose |
|------|------------|---------|
| [`python.instructions.md`](.github/instructions/python.instructions.md) | `.py`, `.ipynb` | Python 3.10+ with full type hints (Windows-first) |
| [`ts.instructions.md`](.github/instructions/ts.instructions.md) | `*.js`, `*.jsx`, `*.ts`, `*.tsx`, `*.html`, `*.vue` | ES2020+ with comprehensive JSDoc |
| [`vuejs.instructions.md`](.github/instructions/vuejs.instructions.md) | `.html`, `.css`, `.vue` | Vue 3.5+ / CSS3 nesting / Bootstrap 5.3+ |

### Prompts (On-Demand)

Invoke these manually via Copilot Chat.

| File | Mode | What It Does |
|------|------|--------------|
| [`diagram-generate.prompt.md`](.github/prompts/diagram-generate.prompt.md) | Ask | Generate Mermaid diagrams with clickable links to source |
| [`doc-ask.prompt.md`](.github/prompts/doc-ask.prompt.md) | Ask | Document files with extensive inline comments |
| [`doc-edit.prompt.md`](.github/prompts/doc-edit.prompt.md) | Edit | Same, but modifies the file directly |
| [`test.python.prompt.md`](.github/prompts/test.python.prompt.md) | Agent | Generate a test FastAPI service |
| [`test.vue.prompt.md`](.github/prompts/test.vue.prompt.md) | Agent | Generate a test Vue.js SPA |

### Agents (Custom AI Personas)

| File | Purpose |
|------|---------|
| [`teacher.agent.md`](.github/agents/teacher.agent.md) | Explains code with analogies and cross-language comparisons |

### Test Files

The [`tests/`](./tests/) folder contains generated code used to verify the instructions actually work:

| File | Description |
|------|-------------|
| [`python.py`](./tests/python.py) | FastAPI micro-service generated via `test.python.prompt.md` |
| [`vuejs.html`](./tests/vuejs.html) | Vue.js SPA that consumes the Python API |

These files are **one-shotted**—generated in a single prompt to test how well the instructions are followed.

---

## Core Principles

All instruction files share these foundations:

- **KISS, DRY, YAGNI, Single Responsibility** — the classics, enforced
- **Standard library first** — third-party packages only when they genuinely help
- **Composition over inheritance** — flexible, testable code
- **Comprehensive error handling** — custom exceptions where they make sense
- **Aligned formatting** — visual consistency that makes code scannable

---

## Language-Specific Details

### Python

**Target:** Windows Server 2022 | Python 3.10+

```python
# Modern type hints with pipe syntax
def process_data(
        data   : list[str],
        config : dict[str, Any] | None = None
    ) -> tuple[bool, str]:
```

| What | Why |
|------|-----|
| **Pylance standard mode** | Zero warnings, full type checking |
| **`str \| None`** | Modern union syntax, not `Optional[str]` |
| **`list[str]`** | Built-in generics, not `List[str]` |
| **`pathlib` everywhere** | Modern file system ops |
| **Dataclasses & Pydantic** | Preferred over plain classes |

**PEPs enforced:** 585 (built-in generics), 604 (union types), 563 (postponed annotations), 634-636 (pattern matching), 618 (`zip(strict=True)`)

---

### JavaScript / TypeScript

**Target:** ES2020+ | TypeScript Strict Mode

```javascript
/**
 * Extracts station and substation info from an address string.
 *
 * @param {string} address                                            - The full address to parse
 * @returns {{station: string, substation: string, location: string}} - Parsed components
 * @throws {Error}                                                    - If format is invalid
 */
function extractStationSubstation(address) {
    // ...
}
```

| What | Why |
|------|-----|
| **Comprehensive JSDoc** | Type safety without TypeScript if needed |
| **Strict TypeScript** | `strictNullChecks`, `noImplicitAny` |
| **`unknown` over `any`** | Safer type handling |
| **Modern syntax** | Optional chaining, nullish coalescing |

---

### Web (Vue / CSS)

**Target:** Vue 3.5+ | Bootstrap 5.3+ | CSS3

```css
/* Modern CSS Nesting */
.card {
    padding: 1rem;

    &:hover {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .card-header {
        font-weight: bold;
    }
}
```

| What | Why |
|------|-----|
| **Native CSS nesting** | No preprocessor needed for basic nesting |
| **CSS custom properties** | `var(--primary-color)` throughout |
| **Vue Composition API** | `<script setup>` with reactive patterns |
| **Semantic HTML5** | ARIA attributes, accessibility |

---

## About the Prompts

### Diagram Generation

[`diagram-generate.prompt.md`](.github/prompts/diagram-generate.prompt.md) creates Mermaid diagrams that:

- Auto-detect the right diagram type (flowchart, class, sequence, etc.)
- Include clickable elements linking to source code
- Work in both light and dark themes
- Handle special characters properly

### Documentation Prompts

Both [`doc-ask.prompt.md`](.github/prompts/doc-ask.prompt.md) and [`doc-edit.prompt.md`](.github/prompts/doc-edit.prompt.md):

- Preserve existing code (never remove functionality)
- Add section headers for organization
- Document imports (why each one exists)
- Align formatting for readability

### Teacher Agent

[`teacher.agent.md`](.github/agents/teacher.agent.md) explains code with:

- Clear, beginner-friendly language
- Cross-language analogies (JS, C#, Python, PHP)
- Structured output (what it does, how it works, pitfalls)
- Up-to-date docs via Context7 MCP

---

## MCP Integration

This repo includes a workspace-level MCP configuration in [`.vscode/mcp.json`](.vscode/mcp.json):

```json
{
    "servers": {
        "context7": {
            "type": "http",
            "url": "https://mcp.context7.com/mcp"
        }
    }
}
```

**Why HTTP-based?** No local installation, works out of the box, safe to commit (no API keys).

[Context7](https://context7.com/) provides up-to-date library documentation directly to your AI context—so Copilot references current docs instead of outdated training data.

---

## 🚀 Quick Start

### 1. Clone the repo

```bash
git clone https://github.com/robert-hoffmann/prompts.git
```

### 2. Copy to your project

```
your-project/
├── .vscode/
│   ├── mcp.json                   # MCP server configuration (Context7)
│   └── settings.json              # Recommended Pylance/Python settings
├── .github/
│   ├── copilot-instructions.md    # Global instructions (optional)
│   ├── agents/                    # Custom AI personas
│   │   └── teacher.agent.md       # Code explanation agent
│   ├── instructions/              # Auto-applied rules
│   │   ├── vuejs.instructions.md
│   │   ├── python.instructions.md
│   │   └── ts.instructions.md
│   └── prompts/                   # On-demand prompts
│       ├── diagram-generate.prompt.md
│       ├── doc-ask.prompt.md
│       ├── doc-edit.prompt.md
│       ├── test.python.prompt.md  # Generates test API
│       └── test.vue.prompt.md     # Generates test SPA
├── tests/                         # Generated test files
│   ├── python.py                  # FastAPI service
│   └── vuejs.html                 # Vue.js SPA
└── requirements.txt               # Test dependencies
```

### 3. Start coding! 🎉

- **Instructions** - Automatically applied when you open matching file types
- **Prompts**      - Invoke via Copilot Chat with `@workspace /prompt-name` or select from the prompt picker
- **Agents**       - Invoke via `@agent-name` in Copilot Chat (e.g., `@teacher explain this code`)

### 4. (Optional) Run the test suite

```bash
# Install test dependencies
pip install -r requirements.txt

# Run the FastAPI service
python -m tests.python

# Open tests/vuejs.html in your browser to test the Vue.js SPA
```

---

## 💡 Philosophy

> *"Code is read more than it is written."*

These prompts enforce:

| Principle | Implementation |
|-----------|----------------|
| **Extensive inline comments** | Make code readable for newcomers |
| **Section headers** | Visual structure with `===` separators |
| **Import documentation** | Explain why each import exists |
| **Aligned formatting** | Properties lined up for easy scanning |
| **Preserved tags** | `TODO`, `FIXME`, `BUG`, `HACK` stay in place |
| **Don't overengineer** | Simple, effective solutions |

---

## 📖 Example Output

**Before:**
```python
def get_user(id, include_posts=None):
    result = db.query(User).filter(User.id == id).first()
    if include_posts:
        result.posts = get_posts(id)
    return result
```

**After (with prompts applied):**
```python
def get_user(
        id            : int,
        include_posts : bool | None = None
    ) -> User | None:
    """
    Retrieve a user by ID with optional post loading.
    
    Args:
        id            : The unique user identifier
        include_posts : Whether to eagerly load user posts
        
    Returns:
        User object if found, None otherwise
    """
    # Query the database for the user by primary key
    result = db.query(User).filter(User.id == id).first()
    
    # Optionally load related posts to avoid N+1 queries
    if include_posts:
        result.posts = get_posts(id)
    
    return result
```

---

## 📚 Documentation & Guides

Want to dive deeper into the principles behind these prompts? Check out the [**Documentation Index**](./docs/README.md) for additional guides:

| Guide | What You'll Learn |
|-------|-------------------|
| [**AI Context Window Management Guide**](./docs/ai-context-window-guide.md) | Understanding token budgets, minimizing context bloat, the single-focus principle, and how to structure prompts for maximum AI effectiveness |
| [**AI Context Window: Practical Examples**](./docs/ai-context-window-practical-examples.md) | Concrete examples: lean instruction files, surgical file attachment, conversation hygiene, tool audits, and documentation as context compression |
| [**Code Documentation Guide**](./docs/code-documentation-guide.md) | The `AGENT_TODO` system for AI communication, comment tag standards (`BUG`, `HACK`, `FIXME`, etc.), and best practices for AI-friendly documentation |
| [**Code Formatting & Alignment Guide**](./docs/code-formatting-alignment-guide.md) | Why visual alignment matters, variable declaration formatting, and how typography principles from books translate to cleaner code |

These guides explain the *why* behind the formatting and documentation standards used throughout this collection.

---

## 🎁 Bonus: VS Code Settings

### Python Type Safety (Pylance)

Want **maximum type safety**? Check out the [`.vscode/settings.json`](.vscode/settings.json) in this repo, or add this to your own:

```jsonc
{
    // Pylance - The Brain 🧠
    "python.languageServer"                                      : "Pylance",
    "python.analysis.languageServerMode"                         : "full",
    "python.analysis.typeCheckingMode"                           : "standard",

    // Modern Python - Ditch the Old Stuff 🚫
    "python.analysis.typeEvaluation.deprecateTypingAliases"      : true,

    // Strict Inference - Catch More Bugs 🐛
    "python.analysis.typeEvaluation.strictDictionaryInference"   : true,
    "python.analysis.typeEvaluation.strictListInference"         : true,
    "python.analysis.typeEvaluation.strictSetInference"          : true,
    "python.analysis.typeEvaluation.enableReachabilityAnalysis"  : true,

    // Quality of Life ✨
    "python.analysis.autoFormatStrings"                          : true,
    "python.analysis.completeFunctionParens"                     : true,
    "python.analysis.generateWithTypeAnnotation"                 : true,

    // Inlay Hints - See Types Everywhere 👀
    "python.analysis.inlayHints.functionReturnTypes"             : true,
    "python.analysis.inlayHints.variableTypes"                   : true,

    // Debugging 🔍
    "debugpy.showPythonInlineValues"                             : true
}
```

---

## 🤝 Contributing

Found something useful? Have improvements? PRs welcome!

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## 📜 License

MIT - Use it, share it, make it better! 🎁

---

<p align="center">
  <b>Made with ❤️ for developers who care about code quality</b>
</p>