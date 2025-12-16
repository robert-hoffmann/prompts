# VS Code Copilot Cheat Sheet Guide

> **Maximizing Chat Tools, Slash Commands & Chat Participants**
>
> A comprehensive guide for creating advanced custom instruction files, prompts, agents, subagents, and mastering chat interactions in VS Code.

---

## Table of Contents

1. [Overview](#overview)
2. [Chat Tools (`#`-mentions)](#chat-tools)
   - [What Are Chat Tools?](#what-are-chat-tools)
   - [Built-in Tools Reference](#built-in-tools-reference)
   - [Tool Sets](#tool-sets)
   - [Advanced Tool Usage](#advanced-tool-usage)
3. [Slash Commands (`/`)](#slash-commands)
   - [What Are Slash Commands?](#what-are-slash-commands)
   - [Built-in Commands Reference](#built-in-commands-reference)
   - [Custom Reusable Prompts](#custom-reusable-prompts)
4. [Chat Participants (`@`)](#chat-participants)
   - [What Are Chat Participants?](#what-are-chat-participants)
   - [Built-in Participants Reference](#built-in-participants-reference)
   - [When to Use Each Participant](#when-to-use-each-participant)
5. [Combining Tools, Commands & Participants](#combining-tools-commands--participants)
6. [Custom Instruction Files Best Practices](#custom-instruction-files-best-practices)
7. [Agent & Subagent Design Patterns](#agent--subagent-design-patterns)
8. [Quick Reference Tables](#quick-reference-tables)

---

## Overview

VS Code Copilot provides three primary mechanisms for enhancing your chat interactions:

| Mechanism           | Prefix | Purpose                                          |
|---------------------|--------|--------------------------------------------------|
| **Chat Tools**      | `#`    | Add context or perform specialized tasks         |
| **Slash Commands**  | `/`    | Shortcuts to specific functionality              |
| **Chat Participants** | `@`  | Domain-specific request handling                 |

**Key Insight:** These mechanisms can be combined in a single prompt to create powerful, context-rich queries that produce highly relevant responses.

---

## Chat Tools

### What Are Chat Tools?

Chat tools (prefixed with `#`) are specialized utilities that accomplish specific tasks while processing your request. They can:

- **Provide context** — files, codebase search, terminal output
- **Perform actions**  — create files, run commands, edit code
- **Access data**      — search results, test failures, git changes

### Built-in Tools Reference

#### Context & Search Tools

| Tool               | Description                                                    | Example Usage                                    |
|--------------------|----------------------------------------------------------------|--------------------------------------------------|
| `#codebase`        | Semantic code search across workspace                          | `How does authentication work? #codebase`        |
| `#changes`         | Current source control changes                                 | `Review my #changes for potential issues`        |
| `#selection`       | Current editor text selection                                  | `Explain #selection`                             |
| `#problems`        | Issues from Problems panel                                     | `Help me fix #problems`                          |
| `#testFailure`     | Unit test failure information                                  | `Why is #testFailure occurring?`                 |
| `#usages`          | Find references, implementations, definitions                  | `Show all #usages of this function`              |
| `#searchResults`   | Results from the Search view                                   | `Summarize #searchResults`                       |
| `#githubRepo`      | Code search in a GitHub repository                             | `How does routing work #githubRepo microsoft/vscode` |

#### File System Tools

| Tool               | Description                                                    | Example Usage                                    |
|--------------------|----------------------------------------------------------------|--------------------------------------------------|
| `#readFile`        | Read file content                                              | `Explain #readFile:src/auth.ts`                  |
| `#fileSearch`      | Search files by glob pattern                                   | `Find all test files #fileSearch`                |
| `#textSearch`      | Find text in files                                             | `Search for TODO comments #textSearch`           |
| `#listDirectory`   | List files in a directory                                      | `What's in #listDirectory:src/components`        |
| `#createFile`      | Create a new file                                              | `#createFile a new utility function`             |
| `#createDirectory` | Create a new directory                                         | `#createDirectory for my new feature`            |
| `#editFiles`       | Apply edits to workspace files                                 | `#editFiles to add error handling`               |

#### Terminal & Task Tools

| Tool                 | Description                                                  | Example Usage                                    |
|----------------------|--------------------------------------------------------------|--------------------------------------------------|
| `#runInTerminal`     | Run shell command in terminal                                | `#runInTerminal npm install axios`               |
| `#terminalLastCommand` | Last terminal command and output                           | `What went wrong with #terminalLastCommand?`     |
| `#terminalSelection` | Current terminal selection                                   | `Explain #terminalSelection`                     |
| `#getTerminalOutput` | Output from a running terminal command                       | `Parse #getTerminalOutput for errors`            |
| `#runTask`           | Run existing workspace task                                  | `#runTask build`                                 |
| `#createAndRunTask`  | Create and execute a new task                                | `#createAndRunTask to lint the project`          |
| `#getTaskOutput`     | Output from a running task                                   | `Show me #getTaskOutput from the build`          |

#### Notebook Tools

| Tool                    | Description                                                | Example Usage                                    |
|-------------------------|------------------------------------------------------------|-------------------------------------------------|
| `#editNotebook`         | Make edits to a notebook                                   | `#editNotebook add a visualization cell`         |
| `#getNotebookSummary`   | List of notebook cells and details                         | `Summarize #getNotebookSummary`                  |
| `#readNotebookCellOutput` | Read output from cell execution                          | `Analyze #readNotebookCellOutput from cell 3`    |
| `#runCell`              | Execute a notebook cell                                    | `#runCell 5`                                     |

#### Project & Extension Tools

| Tool                  | Description                                                  | Example Usage                                    |
|-----------------------|--------------------------------------------------------------|--------------------------------------------------|
| `#new`                | Scaffold a new VS Code workspace                             | `#new TypeScript project with Express`           |
| `#newJupyterNotebook` | Create a new Jupyter notebook                                | `#newJupyterNotebook for data analysis`          |
| `#newWorkspace`       | Create a new workspace                                       | `#newWorkspace for my microservice`              |
| `#extensions`         | Search/ask about VS Code extensions                          | `Best Python linter #extensions`                 |
| `#installExtension`   | Install a VS Code extension                                  | `#installExtension ESLint`                       |
| `#VSCodeAPI`          | VS Code functionality & extension development                | `#VSCodeAPI how to create a custom tree view?`   |
| `#getProjectSetupInfo` | Project scaffolding instructions                            | `#getProjectSetupInfo for a Vite project`        |

#### Web & External Tools

| Tool                | Description                                                   | Example Usage                                    |
|---------------------|---------------------------------------------------------------|--------------------------------------------------|
| `#fetch`            | Fetch content from a web page                                 | `Summarize #fetch https://docs.python.org/3/`    |
| `#openSimpleBrowser` | Preview locally-deployed web app                             | `#openSimpleBrowser http://localhost:3000`       |

#### Agent & Workflow Tools

| Tool           | Description                                                        | Example Usage                                    |
|----------------|-------------------------------------------------------------------|--------------------------------------------------|
| `#runSubagent` | Run task in isolated subagent context                              | `#runSubagent to research authentication patterns` |
| `#todos`       | Track implementation progress with todo list                       | `#todos show my current progress`                |
| `#runVscodeCommand` | Execute a VS Code command                                     | `Enable zen mode #runVscodeCommand`              |

### Tool Sets

Tool sets bundle related capabilities and can be enabled/disabled together:

| Tool Set         | Enables                                           |
|------------------|---------------------------------------------------|
| `#edit`          | Modifications to workspace files                  |
| `#search`        | File and text searching in workspace              |
| `#runCommands`   | Terminal commands with output reading             |
| `#runNotebooks`  | Notebook cell execution                           |
| `#runTasks`      | Task execution with output reading                |

### Advanced Tool Usage

#### Chaining Multiple Tools

```
Analyze #changes, compare with #codebase patterns, and suggest improvements
```

#### Tool with File Context

```
Refactor #readFile:src/utils.ts following the patterns in #codebase
```

#### Dynamic Context Building

```
Based on #problems and #testFailure, generate fixes using #editFiles
```

---

## Slash Commands

### What Are Slash Commands?

Slash commands (prefixed with `/`) are shortcuts to specific functionality within chat. They provide quick access to common actions without typing full natural language prompts.

### Built-in Commands Reference

#### Code Generation & Documentation

| Command    | Description                                                       | Example Usage                           |
|------------|-------------------------------------------------------------------|-----------------------------------------|
| `/doc`     | Generate documentation comments (inline chat)                     | Select code → `/doc`                    |
| `/explain` | Explain code block, file, or concept                              | `/explain async/await in JavaScript`    |
| `/fix`     | Fix code or resolve errors                                        | Select buggy code → `/fix`              |
| `/tests`   | Generate tests for functions/methods                              | `/tests for the UserService class`      |

#### Testing & Debugging

| Command         | Description                                                  | Example Usage                           |
|-----------------|--------------------------------------------------------------|-----------------------------------------|
| `/setupTests`   | Help setting up testing framework                            | `/setupTests for React with Jest`       |
| `/fixTestFailure` | Suggestions to fix failing tests                           | `/fixTestFailure`                       |
| `/startDebugging` | Generate launch.json and start debugging                   | `/startDebugging`                       |

#### Project Scaffolding

| Command        | Description                                                   | Example Usage                           |
|----------------|---------------------------------------------------------------|-----------------------------------------|
| `/new`         | Scaffold new workspace or file                                | `/new Express app with TypeScript`      |
| `/newNotebook` | Generate new Jupyter notebook                                 | `/newNotebook data analysis with pandas`|

#### Utility Commands

| Command   | Description                                                        | Example Usage                           |
|-----------|--------------------------------------------------------------------|-----------------------------------------|
| `/clear`  | Start new chat session                                             | `/clear`                                |
| `/search` | Generate search query for Search view                              | `/search all TODO comments`             |

#### Custom Prompt Commands

| Syntax              | Description                                                 |
|---------------------|-------------------------------------------------------------|
| `/<prompt-name>`    | Run a reusable prompt file defined in your workspace        |

**Example:** If you have `.github/prompts/code-review.prompt.md`, use `/code-review` to execute it.

### Custom Reusable Prompts

Create `.prompt.md` files in `.github/prompts/` or `.vscode/prompts/`:

```markdown
---
mode: agent
tools: ['#codebase', '#changes']
description: Perform thorough code review
---

Review the provided code for:
1. Security vulnerabilities
2. Performance issues
3. Code style consistency
4. Potential bugs

Provide actionable feedback with specific line references.
```

**Invoke with:** `/code-review`

---

## Chat Participants

### What Are Chat Participants?

Chat participants (prefixed with `@`) are specialized handlers for domain-specific requests. Each participant has expertise in a particular area and can provide more accurate responses within their domain.

### Built-in Participants Reference

| Participant   | Domain                                           | Best For                                      |
|---------------|--------------------------------------------------|-----------------------------------------------|
| `@workspace`  | Current workspace context                        | Questions about your codebase structure       |
| `@vscode`     | VS Code features, settings, extension APIs       | Editor configuration, keybindings, extensions |
| `@terminal`   | Integrated terminal, shell commands              | Command-line operations, scripting            |
| `@github`     | GitHub repositories, issues, PRs                 | Repository queries, PR management             |

### When to Use Each Participant

#### `@workspace` — Codebase Questions

```
@workspace how is authentication implemented?
@workspace what patterns are used for error handling?
@workspace explain the project structure
```

**Best for:**
- Understanding existing code architecture
- Finding implementations of specific features
- Navigating large codebases

#### `@vscode` — Editor Configuration

```
@vscode how to enable word wrapping?
@vscode configure auto-save on focus change
@vscode what's the keybinding for multi-cursor?
```

**Best for:**
- Editor settings and configuration
- Keybinding questions
- Extension development questions

#### `@terminal` — Shell & Command Line

```
@terminal list the 5 largest files in this workspace
@terminal how to find all .py files modified today?
@terminal explain the output of this command
@terminal /explain top shell command
```

**Best for:**
- Shell command suggestions
- Terminal output interpretation
- System administration tasks

#### `@github` — Repository Management

```
@github What are all of the open PRs assigned to me?
@github Show me the recent merged PRs from @teammate
@github summarize issue #123
```

**Best for:**
- Pull request queries
- Issue management
- Repository statistics

---

## Combining Tools, Commands & Participants

### Power Patterns

#### Pattern 1: Contextual Code Review

```
@workspace /explain #changes and suggest improvements based on #codebase patterns
```

#### Pattern 2: Targeted Test Generation

```
/tests for #selection using patterns from #codebase
```

#### Pattern 3: Issue Investigation

```
@terminal /explain #terminalLastCommand — why did it fail? Check #problems for related errors
```

#### Pattern 4: Documentation with Context

```
/doc for #selection following the style in #readFile:docs/API.md
```

#### Pattern 5: Multi-Repo Comparison

```
Compare authentication in #codebase with #githubRepo auth0/auth0.js
```

### Effective Prompt Structure

```
[Participant] [Command] [Context Tools] [Natural Language Details]
```

**Examples:**

```
@workspace /explain #selection — focus on the state management pattern
@vscode /fix #problems in the current file
@terminal #runInTerminal npm audit — then summarize vulnerabilities
```

---

## Custom Instruction Files Best Practices

### File Locations

| Path                                | Scope                      |
|-------------------------------------|----------------------------|
| `.github/copilot-instructions.md`   | Repository-wide defaults   |
| `.github/instructions/*.md`         | Language/file-type specific |
| `.vscode/settings.json`             | Workspace-specific overrides |

### Instruction File Structure

```markdown
---
applyTo: "**/*.ts, **/*.tsx"
---

# TypeScript Development Standards

## Code Style
- Use explicit return types for all functions
- Prefer `interface` over `type` for object shapes

## Patterns
- Use dependency injection for services
- Implement error boundaries for React components

## Tools to Use
When generating TypeScript code:
- Always run `#runInTerminal npx tsc --noEmit` to verify
- Check `#problems` for type errors
```

### Key Principles

1. **Be Specific**       — Include exact patterns and examples
2. **Be Actionable**     — Provide concrete rules, not vague guidelines
3. **Reference Tools**   — Tell the AI which `#tools` to use when
4. **Version Control**   — Store instructions in `.github/` for team sharing

---

## Agent & Subagent Design Patterns

### When to Use Agents

Agents (`Ctrl+Shift+I`) are best for:
- Multi-step implementation tasks
- Complex refactoring across files
- Autonomous problem-solving with iteration

### Agent Configuration

Configure available tools in the **Tools** picker:
- Enable/disable built-in tools
- Add MCP servers for extended capabilities
- Include extension-provided tools

### Subagent Delegation Pattern

Use `#runSubagent` for isolated subtasks:

```
#runSubagent Research authentication best practices for Node.js APIs. 
Return a summary of recommended patterns and libraries.
```

**Benefits:**
- Isolates context for complex research
- Prevents main thread context pollution
- Enables parallel investigation

### Custom Agent Definition

Create custom agents in `.vscode/agents/`:

```yaml
name: code-reviewer
description: Read-only planning and review agent
tools:
  - "#codebase"
  - "#changes"
  - "#problems"
instructions: |
  You are a code review specialist. 
  Never modify files directly.
  Provide detailed feedback with line references.
  Focus on: security, performance, maintainability.
```

---

## Quick Reference Tables

### Tool Categories at a Glance

| Category        | Tools                                                                |
|-----------------|----------------------------------------------------------------------|
| **Search**      | `#codebase`, `#fileSearch`, `#textSearch`, `#searchResults`, `#usages` |
| **Read**        | `#readFile`, `#selection`, `#changes`, `#problems`, `#testFailure`   |
| **Write**       | `#editFiles`, `#createFile`, `#createDirectory`, `#editNotebook`     |
| **Execute**     | `#runInTerminal`, `#runTask`, `#runCell`, `#runVscodeCommand`        |
| **External**    | `#fetch`, `#githubRepo`, `#extensions`                               |
| **Workflow**    | `#runSubagent`, `#todos`, `#new`, `#newWorkspace`                    |

### Command Quick Reference

| Action                  | Command                          |
|-------------------------|----------------------------------|
| Explain code            | `/explain`                       |
| Fix errors              | `/fix`                           |
| Generate tests          | `/tests`                         |
| Add documentation       | `/doc`                           |
| Create project          | `/new`                           |
| Create notebook         | `/newNotebook`                   |
| Start debugging         | `/startDebugging`                |
| Clear chat              | `/clear`                         |
| Run custom prompt       | `/<prompt-name>`                 |

### Participant Quick Reference

| Question Domain          | Use Participant                  |
|--------------------------|----------------------------------|
| Codebase structure       | `@workspace`                     |
| VS Code configuration    | `@vscode`                        |
| Terminal/shell commands  | `@terminal`                      |
| GitHub repos/issues/PRs  | `@github`                        |

---

## Tips for Maximum Effectiveness

1. **Layer Context**
   - Combine `#codebase` with `#changes` for informed reviews
   - Use `#problems` with `/fix` for targeted debugging

2. **Be Specific with Participants**
   - Use `@workspace` for "how" questions about your code
   - Use `@vscode` for "how to configure" questions

3. **Leverage Tool Sets**
   - Enable `#edit` tool set when you want autonomous file modifications
   - Enable `#runCommands` when terminal operations are needed

4. **Create Reusable Prompts**
   - Store common workflows as `.prompt.md` files
   - Use frontmatter to specify required tools and modes

5. **Use Subagents for Research**
   - Delegate research tasks to `#runSubagent`
   - Keep main context focused on implementation

---

## Related Documentation

- [vscode-custom-agents-guide.md](vscode-custom-agents-guide.md) — Detailed agent configuration
- [ai-context-window-guide.md](ai-context-window-guide.md) — Managing context effectively
- [code-documentation-guide.md](code-documentation-guide.md) — Documentation standards

---

*Last updated: December 2024*
*Source: [VS Code Copilot Cheat Sheet](https://code.visualstudio.com/docs/copilot/reference/copilot-vscode-features)*
