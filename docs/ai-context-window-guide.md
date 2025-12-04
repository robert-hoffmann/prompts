# AI Context Window Management Guide

When working with AI coding assistants, understanding and managing the **context window** is critical to getting accurate, focused, and efficient results. This guide explains why context matters, how to minimize waste, and how to structure your workflow for maximum AI effectiveness.

---

## What is a Context Window?

The context window is the **total amount of information** (measured in tokens) that an AI can process at once. Think of it as the AI's "working memory" — everything the AI considers when generating a response must fit within this window.

| Component | Consumes Tokens |
|-----------|-----------------|
| System instructions | ✅ Yes |
| Conversation history | ✅ Yes |
| Attached files | ✅ Yes |
| Your current prompt | ✅ Yes |
| **AI's thinking & response** | ✅ Yes |

**The critical insight:** Every token spent on context is a token *not available* for the AI's reasoning and response generation.

---

## Hidden Context Consumers

Before you even type your first prompt, a significant portion of your context window may already be consumed by **tools and configuration**:

### MCP Servers & AI Tools

Every enabled MCP server or AI tool adds to your context:

| Tool Type | Token Cost | Example |
|-----------|------------|---------|
| MCP server definitions | 500-2,000 per server | Database, API, file system servers |
| Tool schemas | 200-1,000 per tool | Function signatures, parameter descriptions |
| Tool responses | Variable | Query results, API responses |

**10 MCP servers × 1,000 tokens = 10,000 tokens gone before you start.**

### Instruction Files & System Prompts

Custom instructions are powerful but costly:

| Instruction Type | Typical Size |
|-----------------|--------------|
| Global instructions | 1,000-5,000 tokens |
| Language-specific rules | 500-2,000 tokens each |
| Project conventions | 500-3,000 tokens |
| Style guides | 1,000-4,000 tokens |

**If you have instructions for HTML, CSS, JS, TS, Python, and Vue — that's potentially 12,000+ tokens of rules loaded on every request.**

### The Compound Effect

```
┌─────────────────────────────────────────────────────────────────┐
│                    WHERE DID MY TOKENS GO?                      │
├─────────────────────────────────────────────────────────────────┤
│  MCP Servers (8)        │████████████░░░░░░░░░░░░░│  8,000     │
│  Instruction Files (6)  │██████████░░░░░░░░░░░░░░░│ 10,000     │
│  Tool Definitions       │██████░░░░░░░░░░░░░░░░░░░│  6,000     │
│  Conversation History   │████░░░░░░░░░░░░░░░░░░░░░│  4,000     │
│  ─────────────────────────────────────────────────────────────  │
│  CONSUMED BEFORE PROMPT │████████████████████████░│ 28,000     │
│  Your files + prompt    │██████████░░░░░░░░░░░░░░░│ 10,000     │
│  AI reasoning space     │████████████████████████████████████  │
│                         │  ONLY 62,000 REMAINING                │
└─────────────────────────────────────────────────────────────────┘
```

### Practical Recommendations

1. **Audit your MCP servers** — Disable servers you're not actively using
2. **Scope instruction files** — Use `applyTo` patterns so rules only load for relevant file types
3. **Keep instructions concise** — Every word costs tokens; be precise, not verbose
4. **Disable unused extensions** — AI-powered extensions may inject their own context
5. **Review periodically** — As projects evolve, remove outdated instructions

> **Rule of thumb:** If you haven't used a tool or instruction in the last week, consider disabling it.

---

## The Token Budget Mental Model

Imagine you have a fixed budget of **100,000 tokens** per request:

```
┌─────────────────────────────────────────────────────────────────┐
│                      CONTEXT WINDOW (100k)                      │
├─────────────────────────────────────────────────────────────────┤
│  System      │  Conversation  │  Files &   │  AI Thinking &     │
│  Prompts     │  History       │  Context   │  Response          │
│  (5k)        │  (10k)         │  (???)     │  (REMAINING)       │
└─────────────────────────────────────────────────────────────────┘
```

**If you load 70k tokens of files and docs:**
- Only **15k tokens remain** for AI reasoning
- AI may truncate thinking, miss edge cases, or produce shallow responses

**If you load 20k tokens of focused context:**
- A full **65k tokens remain** for deep analysis
- AI can consider more possibilities, catch more bugs, write better code

---

## Why Context Bloat Hurts AI Performance

### 1. Diluted Focus

When AI processes 10+ unrelated files, it must:
- Parse and understand each file's purpose
- Track relationships between components
- Remember details from early in the context while processing later content

**Result:** The AI spreads its attention thin, missing nuances in the code that actually matters.

### 2. Off-Topic Drift

Large contexts increase the chance of:
- AI making connections between unrelated code
- Suggestions influenced by patterns from irrelevant files
- Confusion about which file or function you're actually working on

### 3. Reduced Reasoning Depth

With less token budget for thinking:
- Fewer alternative approaches considered
- Less validation of generated code
- Simpler solutions chosen over optimal ones

---

## The Single-Focus Principle

> **Work on ONE thing at a time: one file, one class, one function, one task.**

This principle aligns perfectly with software engineering best practices:

| Principle | Software Engineering | AI Context Management |
|-----------|---------------------|----------------------|
| **Single Responsibility** | A class should have one reason to change | Give AI one clear objective per request |
| **Separation of Concerns** | Divide program into distinct sections | Don't mix unrelated code in context |
| **KISS** | Keep It Simple, Stupid | Keep prompts and context minimal |
| **YAGNI** | You Aren't Gonna Need It | Don't include files "just in case" |

### Why This Works

When you focus AI on a **single, well-scoped task**:

1. **Clarity**   — AI understands exactly what you want
2. **Depth**     — More tokens available for thorough analysis
3. **Accuracy**  — Less noise means fewer misinterpretations
4. **Speed**     — Smaller context processes faster
5. **Cost**      — Fewer tokens = lower API costs (for paid services)

---

## Practical Guidelines

### ✅ DO: Keep Context Tight

```
GOOD Context Setup:
├── The specific file you're editing
├── One or two directly related interfaces/types
├── A focused prompt describing ONE task
└── Relevant documentation snippet (if needed)
```

```
BAD Context Setup:
├── 10 files from across the codebase
├── The entire PRD document (50 pages)
├── All your instruction files
├── Conversation history from 3 different topics
└── A vague prompt like "improve this code"
```

### ✅ DO: Be Specific in Prompts

**Instead of:**
> "Review my code and suggest improvements"

**Say:**
> "In `UserService.ts`, the `validateEmail()` function on line 45 doesn't handle unicode characters. Add support for international email addresses."

### ✅ DO: Chunk Large Tasks

**Instead of:**
> "Refactor the entire authentication module"

**Break it down:**
1. "Refactor the `login()` function to use async/await"
2. "Add input validation to `register()`"
3. "Extract token management into a separate class"

### ❌ DON'T: Include "Just In Case" Files

If you're not sure whether a file is relevant, **don't include it**. You can always:
- Add it later if AI asks for context
- Let AI request specific files it needs
- Provide a brief description instead of the full file

### ❌ DON'T: Paste Entire Documents

PRDs, specifications, and design docs are often **10,000+ tokens** of context. Instead:
- Extract only the relevant section
- Summarize key requirements in your prompt
- Link to the doc and describe what's needed

---

## Context-Efficient Documentation

This connects directly to the principles in the [Code Documentation Guide](./code-documentation-guide.md). Well-documented code reduces the context AI needs because:

| Good Documentation | AI Benefit |
|-------------------|------------|
| Clear function docstrings | AI doesn't need to analyze usage patterns |
| Explicit type annotations | AI doesn't need to infer types from context |
| `AGENT_TODO` tags | AI knows exactly what to do without explanation |
| Comment tags (`WARNING`, `IMPORTANT`) | AI understands constraints without reading all code |

### The Documentation Paradox

> **Invest tokens in documentation once, save tokens on every AI interaction.**

A well-documented 100-line file provides more useful context than an undocumented 500-line file — and uses fewer tokens.

---

## Anti-Patterns to Avoid

### 🚫 The "Kitchen Sink" Approach

> "Here are all 47 files in my project. Make it better."

**Problem:** AI has no idea where to focus. Results will be shallow, generic, or completely off-target.

### 🚫 The "Novel-Length PRD"

> *Attaches 30-page Product Requirements Document*
> "Implement this feature"

**Problem:** Most of the PRD is irrelevant to any single implementation task. AI wastes tokens parsing business context, stakeholder notes, and unrelated features.

### 🚫 The "Endless Conversation"

> *50 messages back and forth, switching between 6 different topics*

**Problem:** AI must maintain context from early messages that may no longer be relevant. Consider starting fresh conversations for new topics.

### 🚫 The "Implicit Requirements"

> "You should know what I want based on the codebase"

**Problem:** AI must scan everything to find patterns and infer intent. Explicit instructions are always more token-efficient than implicit expectations.

---

## The Separation of Concerns Advantage

When your codebase follows **separation of concerns** and **single responsibility principle**, AI assistance becomes dramatically more effective:

### Well-Structured Code

```
src/
├── services/
│   ├── UserService.ts        # Only user operations
│   ├── PaymentService.ts     # Only payment operations
│   └── EmailService.ts       # Only email operations
├── models/
│   ├── User.ts               # User data structure
│   └── Payment.ts            # Payment data structure
└── utils/
    ├── validation.ts         # Input validation
    └── formatting.ts         # Output formatting
```

**AI benefit:** To work on user validation, AI only needs `UserService.ts` + `validation.ts`. Clean, focused, efficient.

### Poorly-Structured Code

```
src/
├── app.ts                    # 2000 lines of everything
├── helpers.ts                # 50 unrelated utility functions
└── types.ts                  # Every type in the system
```

**AI problem:** Any task requires loading massive files. AI must parse thousands of lines to find the 50 lines that matter.

---

## Quick Reference: Context Efficiency Checklist

Before starting an AI coding session, ask yourself:

- [ ] **Single task?** — Am I asking AI to do ONE specific thing?
- [ ] **Minimal files?** — Have I included only files directly relevant to this task?
- [ ] **Focused prompt?** — Is my request specific and unambiguous?
- [ ] **No bloat?** — Have I removed "just in case" context?
- [ ] **Fresh start?** — If switching topics, should I start a new conversation?

---

## Summary

| Principle | Action |
|-----------|--------|
| **Tokens are finite** | Every byte of context costs reasoning capacity |
| **Focus beats breadth** | One file deeply understood > ten files skimmed |
| **Explicit beats implicit** | Clear instructions > hoping AI figures it out |
| **Small tasks compound** | Three focused requests > one vague mega-request |
| **Structure enables focus** | Well-organized code = efficient AI context |

---

## See Also

- [Code Documentation Guide](./code-documentation-guide.md) — Write documentation that reduces AI context needs
- [Code Formatting & Alignment Guide](./code-formatting-alignment-guide.md) — Visual formatting for scannable code
- [README.md](./README.md) — Documentation index
- [CONTRIBUTING.md](../CONTRIBUTING.md) — Contribution guidelines
