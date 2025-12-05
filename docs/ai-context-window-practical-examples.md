# AI Context Window: Practical Examples

This guide provides **concrete, actionable examples** for implementing the principles from the [AI Context Window Management Guide](./ai-context-window-guide.md). Rather than theory, this focuses on what to actually *do* in your daily workflow.

---

## Table of Contents

1. [Code Architecture for AI Efficiency](#code-architecture-for-ai-efficiency)
2. [Writing Lean Instruction Files](#writing-lean-instruction-files)
3. [Crafting Effective Prompts](#crafting-effective-prompts)
4. [File Attachment Strategy](#file-attachment-strategy)
5. [Tool & MCP Server Management](#tool--mcp-server-management)
6. [Conversation Hygiene](#conversation-hygiene)
7. [Documentation as Context Compression](#documentation-as-context-compression)

---

## Code Architecture for AI Efficiency

### Apply Separation of Concerns & Single Responsibility

The way you structure your code directly impacts how efficiently AI can assist you. Well-separated code means **smaller context windows** for any given task.

#### ❌ BAD: Monolithic File

```python
# app.py - 2,000 lines of everything
class App:
    def __init__(self):
        self.db = self._connect_database()
        self.cache = self._setup_cache()
        self.email = self._configure_email()
    
    def _connect_database(self): ...
    def _setup_cache(self): ...
    def _configure_email(self): ...
    
    # 50+ methods for users, orders, payments, notifications...
    def create_user(self): ...
    def update_user(self): ...
    def delete_user(self): ...
    def create_order(self): ...
    def process_payment(self): ...
    def send_notification(self): ...
    # ... hundreds more lines
```

**AI Problem:** To fix a bug in `process_payment()`, AI must load the entire 2,000-line file. Most of it is irrelevant noise.

#### ✅ GOOD: Separated Concerns

```
src/
├── services/
│   ├── user_service.py      # ~150 lines - User CRUD only
│   ├── order_service.py     # ~200 lines - Order management only
│   ├── payment_service.py   # ~180 lines - Payment processing only
│   └── email_service.py     # ~100 lines - Email delivery only
├── repositories/
│   ├── user_repository.py   # Database operations for users
│   └── order_repository.py  # Database operations for orders
└── models/
    ├── user.py              # User data structure
    └── order.py             # Order data structure
```

**AI Benefit:** To fix a payment bug, AI only needs `payment_service.py` (~180 lines). Clean, focused, 10x more efficient.

### Practical Refactoring Checklist

When reviewing your code structure, ask:

- [ ] Does each file have ONE clear responsibility?
- [ ] Can I describe what this file does in ONE sentence?
- [ ] Are there functions here that belong in a utility module?
- [ ] Is this class trying to do too many things?
- [ ] Could I work on this file without needing to load 5+ other files?

---

## Writing Lean Instruction Files

Instruction files are loaded on **every request** for matching file types. Every word costs tokens.

### ❌ BAD: Verbose Instructions

```markdown
---
applyTo: "*.py"
---
# Python Development Instructions

## Introduction

Welcome to our Python development standards. This document outlines the comprehensive 
guidelines that all developers should follow when writing Python code for our projects.
We believe in clean, maintainable code that follows industry best practices and...

[500 more words of preamble]

## Type Hints

When writing Python code, you should always use type hints. Type hints are a feature
introduced in Python 3.5 that allow you to annotate the types of variables, function
parameters, and return values. This helps with code documentation, IDE support, and
static analysis tools like mypy and Pylance...

[200 more words explaining what type hints are]

### Examples of Type Hints

Here are some examples of how to use type hints:

```python
def add(a: int, b: int) -> int:
    return a + b


# This function takes two integers and returns an integer...

[Continues for 50+ more examples with explanations]
```

**Token Cost:** ~3,000-5,000 tokens loaded on EVERY Python file you open.

### ✅ GOOD: Concise Instructions

```markdown
---
applyTo: "*.py"
---
# Python Standards

## Core
- Python 3.10+ | Windows Server 2022
- KISS, DRY, YAGNI, Single Responsibility
- Standard library first, third-party sparingly

## Type Hints
- Modern syntax: `str | None` not `Optional[str]`
- Built-in generics: `list[str]` not `List[str]`
- 100% Pylance standard mode compliant

## Style
- Aligned properties and parameters
- Docstrings for public functions
- Preserve tags: `TODO`, `FIXME`, `BUG`, `HACK`, `WARNING`, `IMPORTANT`
```

**Token Cost:** ~300-500 tokens. The AI is smart—it doesn't need verbose explanations.

### Instruction File Principles

| Principle | Application |
|-----------|-------------|
| **Assume AI competence** | Don't explain what type hints are—just say to use them |
| **Rules, not tutorials** | State what to do, not how Python works |
| **Bullet points > paragraphs** | Scannable, dense information |
| **Examples only when ambiguous** | Show format/style examples, skip obvious ones |
| **Scope narrowly** | Use `applyTo` patterns to limit when rules load |

---

## Crafting Effective Prompts

Your prompt is part of the context window. Make every word count.

### ❌ BAD: Vague, Bloated Prompts

> "I have this Python application that handles user authentication. It was written a while ago and I think it could be improved. The code is in the auth folder. Can you take a look at everything and make suggestions for how to make it better? Also, we're using FastAPI and SQLAlchemy if that matters. Oh, and we recently upgraded to Python 3.11. The team has been complaining about some bugs but I'm not sure exactly what they are. Maybe you can find them?"

**Problems:**
- No specific task
- No specific file
- Vague requirements ("make it better")
- Irrelevant context (team complaints)
- AI must search entire folder

### ✅ GOOD: Focused, Specific Prompts

> "In `auth/token_service.py`, the `validate_token()` function (line 45) doesn't handle expired tokens gracefully—it raises a generic exception. Refactor it to raise a custom `TokenExpiredError` with the expiration timestamp."

**Why this works:**
- Exact file and line number
- Specific function name
- Clear problem statement
- Explicit expected outcome
- AI can work with minimal context

### Prompt Templates

**For Bug Fixes:**
```
In `{file}`, the `{function}` function has a bug: {description}.
Expected behavior: {expected}
Actual behavior: {actual}
Fix it by: {approach, if known}
```

**For Refactoring:**
```
Refactor `{function}` in `{file}` to:
- {specific change 1}
- {specific change 2}
Keep: {constraints}
```

**For New Features:**
```
Add a `{function_name}` function to `{file}` that:
- Takes: {parameters}
- Returns: {return type}
- Does: {behavior}
- Handles: {edge cases}
```

### Avoid PRD Dumps

Instead of attaching a 30-page Product Requirements Document:

| Instead Of | Do This |
|------------|---------|
| Attaching full PRD | Extract the 3-5 relevant requirements |
| "See section 4.2.3" | Quote the specific requirement inline |
| "Based on the spec" | State the requirement explicitly |
| Entire user story | The specific acceptance criteria you're implementing |

**Example transformation:**

❌ *Attaches 15-page PRD*
> "Implement the user profile feature from section 3"

✅ Direct prompt:
> "Add a `get_profile()` endpoint to `user_routes.py` that returns: `{id, name, email, avatar_url, created_at}`. Requires authentication. Return 404 if user not found."

---

## File Attachment Strategy

Every attached file consumes tokens. Be strategic.

### The "Need to Know" Principle

Before attaching a file, ask: **"Does AI absolutely need this to complete the task?"**

| Attach | Don't Attach |
|--------|--------------|
| The file you're editing | Files "for context" |
| Direct dependencies (interfaces, types) | The entire models folder |
| Specific related function | The whole utility module |
| Relevant test file | All test files |

### ❌ BAD: Kitchen Sink Approach

```
Attached files:
├── src/services/user_service.py
├── src/services/order_service.py
├── src/services/payment_service.py
├── src/services/email_service.py
├── src/models/user.py
├── src/models/order.py
├── src/models/payment.py
├── src/repositories/user_repository.py
├── src/repositories/order_repository.py
├── src/utils/helpers.py
├── src/utils/validators.py
├── tests/test_user_service.py
├── tests/test_order_service.py
└── README.md

"Fix the bug in user registration"
```

**Problem:** 14 files attached. AI has no idea which file contains the bug.

### ✅ GOOD: Surgical Precision

```
Attached files:
├── src/services/user_service.py    # Contains the register() function
└── src/models/user.py              # User model for type reference

"In `user_service.py`, the `register()` function doesn't validate 
email uniqueness before insert. Add a check that raises `DuplicateEmailError`."
```

**Result:** 2 files, clear task, focused context.

### When AI Needs More Context

Let AI ask for what it needs rather than preemptively overloading:

1. Start with minimal files
2. If AI says "I need to see X to complete this"
3. Add that specific file
4. Continue

This is more token-efficient than guessing what AI might need.

---

## Tool & MCP Server Management

Every enabled tool/server adds to your context before you type anything.

### Audit Your Tools Regularly

```
┌─────────────────────────────────────────────────────────────────┐
│              TOOL AUDIT CHECKLIST (Monthly)                     │
├─────────────────────────────────────────────────────────────────┤
│  □ List all enabled MCP servers                                 │
│  □ For each: "Have I used this in the past 2 weeks?"            │
│  □ Disable servers for languages/frameworks not in use          │
│  □ Remove experimental tools that didn't pan out                │
│  □ Check for duplicate functionality between tools              │
└─────────────────────────────────────────────────────────────────┘
```

### Context-Aware Tool Profiles

Consider creating different tool configurations for different work:

| Profile | Enabled Tools | Use Case |
|---------|---------------|----------|
| **Python Dev** | Pylance, pytest, database | Python backend work |
| **Frontend** | ESLint, TypeScript, browser | React/Vue development |
| **DevOps** | Docker, K8s, terraform | Infrastructure tasks |
| **Minimal** | Core editor only | Quick questions, reviews |

### The Hidden Cost of "Just In Case" Tools

Each tool you keep enabled "just in case" costs tokens on every request:

```
Tool: Database Explorer MCP
├── Schema: ~1,500 tokens
├── Tool definitions: ~800 tokens
└── Always loaded: YES

Annual token cost if you query AI 50 times/day:
50 × 2,300 × 365 = 41,975,000 tokens/year

For a tool you use twice a month.
```

**Rule:** If you haven't used it in 2 weeks, disable it. Re-enable when needed.

---

## Conversation Hygiene

Long conversations accumulate context that may no longer be relevant.

### Clear Chat Every 3-5 Prompts

The conversation history grows with every exchange:

```
Prompt 1: "Explain this function"        →  Context: 2k tokens
Prompt 2: "Now refactor it"              →  Context: 5k tokens
Prompt 3: "Add error handling"           →  Context: 9k tokens
Prompt 4: "Write tests for it"           →  Context: 14k tokens
Prompt 5: "Different question entirely"  →  Context: 18k tokens ← All previous context still loaded!
```

### When to Start Fresh

| Scenario | Action |
|----------|--------|
| Switching to a different file | New conversation |
| Changing topics completely | New conversation |
| Previous attempts didn't work | New conversation (fresh start) |
| After 3-5 successful prompts | New conversation |
| AI seems confused or repetitive | New conversation |

### Conversation Anti-Patterns

❌ **The Marathon Session**
> 50 messages across 6 different topics, 3 files, and 2 hours

❌ **The Retry Loop**
> Same question rephrased 10 times in one conversation (context keeps growing)

❌ **The Context Hoarder**
> "Keep all this in mind for later" (AI can't selectively forget)

### Fresh Start Benefits

| Benefit | Description |
|---------|-------------|
| **Clean slate** | No confusion from previous attempts |
| **Full token budget** | Maximum reasoning capacity |
| **Focused context** | Only current task loaded |
| **Better accuracy** | No cross-contamination from unrelated code |

---

## Documentation as Context Compression

Good documentation is a **one-time token investment** that saves tokens on **every future interaction**.

### The Documentation Paradox

```
Undocumented function:
├── AI must read function body: ~200 tokens
├── AI must analyze callers: ~500 tokens
├── AI must infer purpose: ~300 tokens
├── AI may misunderstand: HIGH RISK
└── Total per interaction: ~1,000 tokens + uncertainty

Well-documented function:
├── Docstring provides contract: ~100 tokens
├── AI understands immediately: YES
├── No inference needed: 0 tokens
└── Total per interaction: ~100 tokens + certainty
```

### Documentation ROI

```
Investment: 10 minutes writing a good docstring (~100 tokens)
Return: Saves ~900 tokens per AI interaction with that function
Break-even: After 1 AI interaction
Profit: Every subsequent interaction
```

### High-Value Documentation Targets

Focus documentation efforts where AI will benefit most:

| Priority | Target | Why |
|----------|--------|-----|
| **High** | Public APIs and interfaces | AI uses these to understand contracts |
| **High** | Functions with non-obvious behavior | AI can't infer business logic |
| **High** | Complex algorithms | AI needs to understand intent, not just code |
| **Medium** | Configuration and constants | AI needs to know valid values |
| **Medium** | Error handling patterns | AI should preserve these |
| **Low** | Simple getters/setters | Self-explanatory |
| **Low** | Obvious operations | Don't state the obvious |

### Use AGENT_TODO for Explicit Instructions

When you know you'll ask AI to do something, leave explicit instructions:

```python
# AGENT_TODO: Add input validation for email format
# Should use regex pattern for RFC 5322 compliance
# Raise ValueError with descriptive message on invalid input
def register_user(email: str, password: str) -> User:
    ...
```

Now when you ask AI to "implement the AGENT_TODO in register_user", it has:
- Exact task description
- Technical requirements
- Expected error handling

No lengthy prompt needed. The documentation IS the prompt.

---

## Quick Reference Card

### Before Starting AI Session

```
□ One specific task identified
□ Minimal files attached (1-3 max)
□ Unused MCP servers disabled
□ Fresh conversation (if switching topics)
□ Specific prompt written (not vague)
```

### During AI Session

```
□ Adding files only when AI requests them
□ Keeping prompts focused and specific
□ Not dumping PRDs or specs
□ Clearing chat every 3-5 prompts
```

### Code Organization (Ongoing)

```
□ Files have single responsibility
□ Functions are focused and small
□ Public APIs are documented
□ AGENT_TODO tags for planned work
□ No monolithic "god" files
```

---

## Summary

| Practice | Token Impact | Effort |
|----------|--------------|--------|
| Separate concerns in code | ⬇️ High savings | Medium (architectural) |
| Lean instruction files | ⬇️ Medium savings | Low (one-time edit) |
| Specific prompts | ⬇️ High savings | Low (per prompt) |
| Minimal file attachments | ⬇️ High savings | Low (per prompt) |
| Disable unused tools | ⬇️ Medium savings | Low (periodic audit) |
| Clear chat regularly | ⬇️ High savings | Low (habit) |
| Good documentation | ⬇️ High savings | Medium (ongoing) |

**The compound effect:** Implementing all these practices together can reduce your effective context usage by **50-70%**, leaving dramatically more tokens for AI reasoning and response quality.

---

## See Also

- [AI Context Window Management Guide](./ai-context-window-guide.md) — The theory behind context management
- [Code Documentation Guide](./code-documentation-guide.md) — Documentation best practices and the AGENT_TODO system
- [Code Formatting & Alignment Guide](./code-formatting-alignment-guide.md) — Visual formatting for scannable code
- [README.md](./README.md) — Documentation index
- [CONTRIBUTING.md](../CONTRIBUTING.md) — Contribution guidelines
