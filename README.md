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

| File | Languages | Purpose |
|------|-----------|---------|
| `html.instructions.md` | `.html`, `.css`, `.vue` | Vue 3.5+ / TypeScript / Bootstrap 5.3+ standards |
| `python.instructions.md` | `.py` | Modern Python 3.10+ with full type hints |

### 💬 Prompts (On-Demand Actions)

| File | Mode | What It Does |
|------|------|--------------|
| `doc-ask.prompt.md` | Ask | Document Python files with extensive inline comments |
| `doc-edit.prompt.md` | Edit | Same as above, but directly edits the file |
| `explain-code.prompt.md` | Ask | Beginner-friendly code explanations with JS/C#/PHP comparisons |

---

## 🔥 Key Features

### For Python Devs 🐍

```python
# ✅ Modern type hints with pipe syntax
def process_data(
    data   : list[str],
    config : dict[str, Any] | None = None
) -> tuple[bool, str]:
```

- **100% Pylance compliant** - No more squiggly lines!
- **`pathlib` everywhere** - Modern file system operations
- **Aligned properties** - Visual clarity at a glance
- **Standard library first** - Minimal dependencies

### For Web Devs 🌐

```typescript
// ✅ Aligned object properties
const config = {
    apiEndpoint     : '/api/v1/users',
    timeout         : 5000,
    retryAttempts   : 3,
    enableLogging   : true
};
```

- **Vue 3.5+ Composition API** with `<script setup>`
- **Bootstrap 5.3+** - Forms, validation, components
- **Modern CSS3** - Nesting, variables, container queries
- **TypeScript** - Full type safety

---

## 🚀 Quick Start

### 1. Clone the repo

```bash
git clone https://github.com/robert-hoffmann/prompts.git
```

### 2. Copy to your project

```
your-project/
├── .github/
│   ├── copilot-instructions.md   # Global instructions
│   ├── instructions/              # Auto-applied rules
│   │   ├── html.instructions.md
│   │   └── python.instructions.md
│   └── prompts/                   # On-demand prompts
│       ├── doc-ask.prompt.md
│       ├── doc-edit.prompt.md
│       └── explain-code.prompt.md
```

### 3. Start coding! 🎉

Instructions are automatically applied based on file type. Prompts can be invoked via Copilot Chat.

---

## 💡 Philosophy

> *"Code is read more than it is written."*

These prompts enforce:

- **Extensive inline comments** - Make code readable for newcomers
- **Section headers** - Visual structure with `===` separators
- **Import documentation** - Explain why each import exists
- **Aligned formatting** - Properties lined up for easy scanning
- **Preserved tags** - `TODO`, `FIXME`, `BUG`, `HACK` stay in place

---

## 📖 Example Output

Before:
```python
def get_user(id, include_posts=None):
    result = db.query(User).filter(User.id == id).first()
    if include_posts:
        result.posts = get_posts(id)
    return result
```

After (with prompts applied):
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

## 🎁 Bonus: VS Code Settings for Python Type Safety

Want **maximum type safety**? Drop this in your `.vscode/settings.json`:

```jsonc
{
    // Pylance - The Brain 🧠
    "python.languageServer"                                      : "Pylance",
    "python.analysis.languageServerMode"                         : "full",
    "python.analysis.typeCheckingMode"                           : "standard",

    // Modern Python - Ditch the Old Stuff 🚫
    "python.analysis.typeEvaluation.deprecateTypingAliases"      : true,   // Use list, dict, not List, Dict

    // Strict Inference - Catch More Bugs 🐛
    "python.analysis.typeEvaluation.strictDictionaryInference"   : true,
    "python.analysis.typeEvaluation.strictListInference"         : true,
    "python.analysis.typeEvaluation.strictSetInference"          : true,
    "python.analysis.typeEvaluation.enableReachabilityAnalysis"  : true,   // Dead code detection

    // Quality of Life ✨
    "python.analysis.autoFormatStrings"                          : true,   // Auto f-string conversion
    "python.analysis.completeFunctionParens"                     : true,   // Add () on completion
    "python.analysis.generateWithTypeAnnotation"                 : true,   // Generate typed code

    // Inlay Hints - See Types Everywhere 👀
    "python.analysis.inlayHints.functionReturnTypes"             : true,
    "python.analysis.inlayHints.variableTypes"                   : true,

    // Debugging 🔍
    "debugpy.showPythonInlineValues"                             : true
}
```

> 💡 **Pro tip:** These settings make Pylance enforce modern `list[str]` over deprecated `List[str]`, and catch unreachable code automatically!

---

## 🤝 Contributing

Found something useful? Have improvements? PRs welcome!

---

## 📜 License

MIT - Use it, share it, make it better! 🎁

---

<p align="center">
  <b>Made with ❤️ for developers who care about code quality</b>
</p>
