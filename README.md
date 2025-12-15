# 🚀 Copilot Prompt Collection

> **Supercharge your GitHub Copilot** with battle-tested prompts and instructions for cleaner, better-documented code.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## ✨ What's This?

A curated collection of **GitHub Copilot prompt files** and **instruction files** designed to:

- 📝 Generate **beautifully documented** code with proper comments
- 🎯 Enforce **consistent coding standards** across your projects
- ⚡ Boost productivity with **opinionated, modern best practices**
- 🧠 Help Copilot understand your **project conventions**

---

## 📁 What's Included

### 🎓 Instructions (Auto-Applied Rules)

Instructions are automatically applied based on file type when you open matching files.

| File | Applies To | Purpose |
|------|------------|---------|
| [`vuejs.instructions.md`](.github/instructions/vuejs.instructions.md) | `.html`, `.css`, `.vue` | Vue 3.5+ / CSS3 nesting / Bootstrap 5.3+ standards |
| [`ts.instructions.md`](.github/instructions/ts.instructions.md) | `*.js`, `*.jsx`, `*.ts`, `*.tsx`, `*.html`, `*.vue` | Modern JS/TS ES2020+ with comprehensive JSDoc |
| [`python.instructions.md`](.github/instructions/python.instructions.md) | `.py`, `.ipynb` | Modern Python 3.10+ with full type hints (Windows-first) |

### 💬 Prompts (On-Demand Actions)

Prompts are invoked manually via Copilot Chat using the `/` command or by selecting the prompt file.

| File | Mode | What It Does |
|------|------|--------------|
| [`diagram-generate.prompt.md`](.github/prompts/diagram-generate.prompt.md) | Ask | Generate Mermaid diagrams with clickable elements linking to source |
| [`doc-ask.prompt.md`](.github/prompts/doc-ask.prompt.md) | Ask | Document Python files with extensive inline comments (preview) |
| [`doc-edit.prompt.md`](.github/prompts/doc-edit.prompt.md) | Edit | Document Python files with inline editing (modifies file directly) |
| [`test.python.prompt.md`](.github/prompts/test.python.prompt.md) | Agent | Generate a Python FastAPI service to verify instruction adherence |
| [`test.vue.prompt.md`](.github/prompts/test.vue.prompt.md) | Agent | Generate a Vue.js SPA to verify instruction adherence |

### 🤖 Agents (Custom AI Personas)

Agents are specialized AI personas with specific expertise and tool access.

| File | Purpose |
|------|---------|
| [`teacher.agent.md`](.github/agents/teacher.agent.md) | Explains code with analogies and cross-language comparisons (JS, C#, Python, PHP) |

### 🧪 Test Files

The [`tests/`](./tests/) folder contains generated code used to verify instruction adherence:

| File | Description |
|------|-------------|
| [`python.py`](./tests/python.py) | FastAPI micro-service generated via `test.python.prompt.md` |
| [`vuejs.html`](./tests/vuejs.html) | Vue.js SPA that consumes the Python API |
| [`requirements.txt`](./requirements.txt) | Dependencies for running test files (`pip install -r ./requirements.txt`) |

These files are **one-shotted** — generated in a single prompt to test how well the instructions are followed.

---

## 🔥 Key Features

### Common Principles Across All Languages

All instruction files share these core philosophies:

- ✅ **KISS, DRY, YAGNI, Single Responsibility** - Clean code practices
- ✅ **Standard library first** - Third-party packages used sparingly
- ✅ **Composition over inheritance** - Flexible, maintainable code
- ✅ **Comprehensive error handling** - Custom exceptions and error classes
- ✅ **Aligned formatting** - Visual clarity with consistent spacing

---

### For Python Devs 🐍

**Target:** Windows Server 2022 | Python 3.10+

```python
# ✅ Modern type hints with pipe syntax
def process_data(
        data   : list[str],
        config : dict[str, Any] | None = None
    ) -> tuple[bool, str]:
```

| Feature | Description |
|---------|-------------|
| **100% Pylance compliant** | Standard mode type checking, zero warnings |
| **Modern union syntax** | `str \| None` instead of `Optional[str]` |
| **Built-in generics** | `list[str]` instead of `List[str]` |
| **`pathlib` everywhere** | Modern file system operations |
| **Aligned properties** | Visual clarity at a glance |
| **Dataclasses & Pydantic** | Preferred over plain classes |

**Key PEPs enforced:** 585 (built-in generics), 604 (union types), 563 (postponed annotations), 634-636 (pattern matching), 618 (`zip(strict=True)`)

---

### For JavaScript/TypeScript Devs 💛

**Target:** ES2020+ | TypeScript Strict Mode

```javascript
/**
 * Extracts station and substation information from an address string.
 *
 * @param {string} address                                            - The full address string to parse
 * @returns {{station: string, substation: string, location: string}} - Parsed components
 * @throws {Error}                                                    - If the address format is invalid
 */
function extractStationSubstation(address) {
    // Implementation here
}
```

| Feature | Description |
|---------|-------------|
| **Comprehensive JSDoc** | Full type safety without TypeScript |
| **Strict TypeScript** | `strictNullChecks`, `noImplicitAny` enabled |
| **Modern syntax** | Optional chaining, nullish coalescing, destructuring |
| **`unknown` over `any`** | Safer type handling |
| **Multiline formatting** | Clear parameter documentation |

---

### For Web Devs 🌐

**Target:** Vue 3.5+ | Bootstrap 5.3+ | CSS3

```css
/* ✅ Modern CSS Nesting */
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

| Feature | Description |
|---------|-------------|
| **Native CSS nesting** | Modern `&` syntax for pseudo-classes |
| **CSS custom properties** | `var(--primary-color)` throughout |
| **Vue Composition API** | `<script setup>` with reactive patterns |
| **Section organization** | Clear `/* ========= */` dividers |
| **Semantic HTML5** | ARIA attributes, modern APIs |

---

## 🛠️ Prompt Highlights

### 📊 Diagram Generation

The [`diagram-generate.prompt.md`](.github/prompts/diagram-generate.prompt.md) creates comprehensive Mermaid diagrams:

- **Auto-detects diagram type** - Flowchart, Class, Sequence, State, ER diagrams
- **Clickable elements** - Links directly to source code lines in VS Code
- **Dual-theme colors** - Works in both light and dark modes
- **Proper syntax handling** - Escapes special characters, wraps labels correctly

### 📖 Documentation Prompts

Both [`doc-ask.prompt.md`](.github/prompts/doc-ask.prompt.md) and [`doc-edit.prompt.md`](.github/prompts/doc-edit.prompt.md) enforce:

- **Code preservation** - Never removes existing functionality
- **Section headers** - `# ========= STEP 1: Description =========`
- **Import documentation** - Explains why each import exists
- **Aligned formatting** - Colons and values lined up

### 🤖 Teacher Agent

The [`teacher.agent.md`](.github/agents/teacher.agent.md) is a custom agent that:

- **Explains code** - Clear, beginner-friendly explanations
- **Cross-language analogies** - Compares to JavaScript, C#, Python, and PHP
- **Structured output** - What it does, how it works, good practices, pitfalls
- **Uses Context7 MCP** - Fetches up-to-date documentation when needed

Perfect for onboarding new team members or understanding unfamiliar codebases.

---

## 🔌 MCP Integration (Model Context Protocol)

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

### Why HTTP-based MCP?

- **No local installation** - Works out of the box, no `npx` or Docker required
- **Portable** - Copy `.vscode/mcp.json` to any project
- **Shareable** - Safe to commit (no API keys in the URL)
- **Always up-to-date** - Server-side updates automatically

### What is Context7?

[Context7](https://context7.com/) provides **up-to-date documentation** for libraries directly in your AI context. Instead of getting outdated training data, Copilot can fetch current docs for any library.

The teacher agent and prompts use this to provide accurate, version-specific guidance.

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