# Documentation Index

This directory contains guides and best practices for writing clean, maintainable, and AI-friendly code.

---

## Available Guides

### [AI Context Window Management Guide](./ai-context-window-guide.md)

A guide on understanding and managing AI context windows for more effective AI-assisted development.

**Key Topics:**
- **The Token Budget** — Why context size directly impacts AI reasoning quality
- **Single-Focus Principle** — Working on one file, one class, one function, one task at a time
- **Context Efficiency** — Avoiding bloated PRDs, excessive file attachments, and vague prompts
- **Separation of Concerns** — How well-structured code enables better AI assistance

---

### [AI Context Window: Practical Examples](./ai-context-window-practical-examples.md)

Concrete, actionable examples for implementing context window management principles in your daily workflow.

**Key Topics:**
- **Code Architecture** — Separation of concerns and single responsibility for smaller context surfaces
- **Lean Instructions** — Writing concise instruction files that don't bloat every request
- **Effective Prompts** — Crafting focused, specific prompts instead of vague requests
- **File Strategy** — Attaching only what's needed, not "just in case" files
- **Tool Management** — Disabling non-essential MCP servers and AI tools
- **Conversation Hygiene** — Clearing chat every 3-5 prompts to reset context

---

### [Code Documentation Guide](./code-documentation-guide.md)

A comprehensive guide on code documentation practices that benefit both human developers and AI coding assistants.

**Key Topics:**
- **The AGENT_TODO System** — A special comment tag system for communicating instructions to AI coding agents
- **Comment Tag Standards** — Usage of tags like `BUG`, `HACK`, `FIXME`, `TODO`, `INFO`, `IMPORTANT`, and `WARNING`
- **Documentation Best Practices** — How to write effective documentation that aids both human understanding and AI assistance

---

### [Code Formatting & Alignment Guide](./code-formatting-alignment-guide.md)

A guide on code formatting principles that improve readability and maintainability, treating code formatting like typography in written documents.

**Key Topics:**
- **Why Alignment Matters** — Visual scanning, pattern recognition, and cognitive load reduction
- **Variable Declaration Alignment** — Aligning related assignments for better readability
- **Object and Array Formatting** — Consistent formatting for data structures
- **The Book Analogy** — How typography principles from print translate to code formatting

---

## Quick Reference

| Guide | Focus | Audience |
|-------|-------|----------|
| [AI Context Window](./ai-context-window-guide.md) | Token management, focused prompts | All developers |
| [AI Context Practical](./ai-context-window-practical-examples.md) | Actionable examples, daily workflow | All developers |
| [Code Documentation](./code-documentation-guide.md) | Comments, tags, AI communication | All developers |
| [Code Formatting](./code-formatting-alignment-guide.md) | Visual alignment, readability | All developers |
