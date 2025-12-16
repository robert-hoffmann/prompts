# VS Code Custom Agents - Complete Guide

> **Documentation Version:** December 2024  
> **VS Code Minimum Version:** 1.106+  
> **Source:** [VS Code Official Documentation](https://code.visualstudio.com/docs/copilot/customization/custom-agents)

---

## Table of Contents

1. [Overview](#overview)
2. [What are Custom Agents?](#what-are-custom-agents)
3. [Why Use Custom Agents?](#why-use-custom-agents)
4. [Agent File Structure](#agent-file-structure)
   - [File Naming and Location](#file-naming-and-location)
   - [Header (YAML Frontmatter)](#header-yaml-frontmatter)
   - [Body (Markdown Instructions)](#body-markdown-instructions)
5. [Creating a Custom Agent](#creating-a-custom-agent)
6. [Handoffs - Workflow Transitions](#handoffs---workflow-transitions)
7. [Available Tools Reference](#available-tools-reference)
   - [Built-in Tools](#built-in-tools)
   - [Tool Sets](#tool-sets)
   - [MCP Tools](#mcp-tools)
8. [Tool List Priority](#tool-list-priority)
9. [Subagents](#subagents)
10. [Agent Examples](#agent-examples)
11. [Sharing Agents](#sharing-agents)
12. [Best Practices](#best-practices)
13. [FAQ](#faq)
14. [Related Resources](#related-resources)

---

## Overview

Custom agents enable you to configure the AI to adopt different personas tailored to specific development roles and tasks. They were previously known as **custom chat modes** - the functionality remains the same, but the terminology has been updated.

Each custom agent can have:
- Its own **behavior and instructions**
- A specific set of **available tools**
- **Handoffs** to transition between agents in guided workflows

---

## What are Custom Agents?

The built-in agents (Ask, Edit, Agent, Plan) provide general-purpose configurations for chat in VS Code. For a more tailored chat experience, you can create your own **custom agents**.

Custom agents consist of:
- A set of **instructions** that define how the AI should operate
- A list of **tools** that are available for that agent
- Optional **handoffs** for workflow transitions

### Key Benefits

| Feature              | Description                                                                          |
|----------------------|--------------------------------------------------------------------------------------|
| **Specialized Focus** | Each agent can be optimized for a specific task (planning, reviewing, implementing) |
| **Tool Control**      | Specify exactly which tools are available, preventing accidental actions            |
| **Consistent Output** | Instructions ensure consistent, task-appropriate responses                          |
| **Workflow Chaining** | Use handoffs to create multi-step guided workflows                                   |
| **Reusability**       | Reuse agents in background agents and cloud agents                                   |

---

## Why Use Custom Agents?

Different tasks require different capabilities:

| Task Type      | Recommended Tools                         | Use Case                                                  |
|----------------|-------------------------------------------|-----------------------------------------------------------|
| **Planning**    | Read-only tools (search, fetch, usages)   | Research and analysis without accidental code changes     |
| **Implementing**| Full editing tools                        | Making actual code changes                                |
| **Reviewing**   | Read + analysis tools                     | Identifying issues without modification                   |
| **Debugging**   | Terminal + diagnostics tools              | Running commands and analyzing output                     |

---

## Agent File Structure

### File Naming and Location

Custom agent files:
- Use the `.agent.md` extension
- Are Markdown files with YAML frontmatter

**Storage Locations:**

| Location                      | Scope                                  | Path                                      |
|-------------------------------|----------------------------------------|-------------------------------------------|
| **Workspace**                  | Available only in that workspace       | `.github/agents/<name>.agent.md`         |
| **User Profile**               | Available across all workspaces        | Current profile folder                    |
| **Organization (Experimental)**| Shared across team members             | GitHub organization level                 |

> **Note:** VS Code also detects any `.md` files in the `.github/agents` folder as custom agents.

> **Migration:** If you have `.chatmode.md` files in `.github/chatmodes`, VS Code still recognizes them. Use Quick Fix to migrate them to the new format.

---

### Header (YAML Frontmatter)

The optional header is formatted as YAML frontmatter with the following fields:

```yaml
---
name: <string>              # Display name (defaults to filename if omitted)
description: <string>       # Brief description shown as placeholder in chat input
argument-hint: <string>     # Hint text shown in chat input to guide users
tools: [<tool-list>]        # List of available tools (built-in, MCP, extension)
model: <string>             # AI model to use (e.g., "Claude Sonnet 4")
infer: <boolean>            # Enable use as subagent (default: true)
target: <string>            # Target environment: "vscode" or "github-copilot"
mcp-servers: [<list>]       # MCP server configs (for target: github-copilot)
handoffs:                   # List of workflow transitions
  - label: <string>         # Button text shown to user
    agent: <string>         # Target agent identifier
    prompt: <string>        # Prompt to send to target agent
    send: <boolean>         # Auto-submit prompt (default: false)
---
```

#### Field Reference

| Field           | Type       | Required | Description                                                                      |
|-----------------|------------|----------|----------------------------------------------------------------------------------|
| `name`          | string     | No       | Display name of the agent. Defaults to filename if not specified.                |
| `description`   | string     | No       | Brief description shown as placeholder text in chat input.                       |
| `argument-hint` | string     | No       | Hint text to guide users on how to interact with the agent.                      |
| `tools`         | string[]   | No       | List of tool names. Use `<server>/*` for all MCP server tools.                   |
| `model`         | string     | No       | AI model to use. Defaults to currently selected model if not specified.          |
| `infer`         | boolean    | No       | Whether this agent can be used as a subagent (default: `true`).                  |
| `target`        | string     | No       | Target environment: `vscode` or `github-copilot`.                                |
| `mcp-servers`   | object[]   | No       | MCP server configurations for GitHub Copilot target.                             |
| `handoffs`      | object[]   | No       | List of handoff definitions for workflow transitions.                            |

> **Note:** If a specified tool is not available when using the agent, it is silently ignored.

---

### Body (Markdown Instructions)

The body contains the agent implementation as Markdown. This is where you provide:
- Specific prompts and guidelines
- Behavioral instructions
- Any other relevant information for the AI to follow

**Features:**
- Reference other files using Markdown links (e.g., `[instructions](./shared-instructions.md)`)
- Reference tools in body text using `#tool:<tool-name>` syntax

When you select the agent in the Chat view, these guidelines are prepended to the user's chat prompt.

---

## Creating a Custom Agent

### Method 1: Command Palette

1. Open Command Palette (`Ctrl+Shift+P`)
2. Run: `Chat: New Custom Agent`
3. Choose location:
   - **Workspace:** Creates in `.github/agents/` folder
   - **User Profile:** Creates in your profile folder
4. Enter a filename
5. Edit the generated `.agent.md` file

### Method 2: Agents Dropdown

1. Open Chat view
2. Click the agents dropdown
3. Select **Configure Custom Agents**
4. Select **Create new custom agent**
5. Follow the prompts

### Method 3: Manual Creation

Create a file manually at `.github/agents/<name>.agent.md` with the appropriate structure.

---

## Handoffs - Workflow Transitions

Handoffs enable guided sequential workflows that transition between agents with suggested next steps.

### How Handoffs Work

1. User completes a task with current agent
2. After chat response completes, handoff buttons appear
3. User clicks a handoff button
4. Context transfers to target agent with pre-filled prompt
5. If `send: true`, prompt auto-submits

### Handoff Configuration

```yaml
---
description: Generate an implementation plan
tools: ['search', 'fetch']
handoffs:
  - label: Start Implementation
    agent: implementation
    prompt: Now implement the plan outlined above.
    send: false
---
```

### Common Handoff Patterns

| From            | To                | Use Case                                               |
|-----------------|-------------------|--------------------------------------------------------|
| Planning        | Implementation    | Generate plan, then hand off to start coding           |
| Implementation  | Review            | Complete implementation, then check for quality/security|
| Write Tests     | Implement Code    | Write failing tests first, then implement to pass them |
| Review          | Fix Issues        | Identify problems, then hand off to fix them           |

---

## Available Tools Reference

### Built-in Tools

VS Code provides these built-in tools that you can reference in your agent's `tools` list:

#### File & Workspace Tools

| Tool                    | Description                                                 |
|-------------------------|-------------------------------------------------------------|
| `changes`               | List of source control changes                              |
| `codebase`              | Perform code search in current workspace                    |
| `createDirectory`       | Create a new directory in the workspace                     |
| `createFile`            | Create a new file in the workspace                          |
| `editFiles`             | Apply edits to files in the workspace                       |
| `fileSearch`            | Search for files using glob patterns                        |
| `listDirectory`         | List files in a directory                                   |
| `readFile`              | Read the content of a file                                  |
| `textSearch`            | Find text in files                                          |

#### Search & Analysis Tools

| Tool                    | Description                                                 |
|-------------------------|-------------------------------------------------------------|
| `usages`                | Find references, implementations, and definitions           |
| `problems`              | Get workspace issues from Problems panel                    |
| `searchResults`         | Get results from Search view                                |

#### External Content Tools

| Tool                    | Description                                                 |
|-------------------------|-------------------------------------------------------------|
| `fetch`                 | Fetch content from a web page                               |
| `githubRepo`            | Perform code search in a GitHub repository                  |

#### Terminal & Task Tools

| Tool                    | Description                                                 |
|-------------------------|-------------------------------------------------------------|
| `runInTerminal`         | Run a shell command in integrated terminal                  |
| `getTerminalOutput`     | Get output from terminal command                            |
| `terminalLastCommand`   | Get last run terminal command and output                    |
| `terminalSelection`     | Get current terminal selection                              |
| `createAndRunTask`      | Create and run a new task                                   |
| `runTask`               | Run an existing task                                        |
| `getTaskOutput`         | Get output from a task                                      |

#### Notebook Tools

| Tool                    | Description                                                 |
|-------------------------|-------------------------------------------------------------|
| `editNotebook`          | Make edits to a notebook                                    |
| `getNotebookSummary`    | Get list of notebook cells and details                      |
| `readNotebookCellOutput`| Read output from notebook cell execution                    |
| `runCell`               | Run a notebook cell                                         |

#### VS Code & Extension Tools

| Tool                    | Description                                                 |
|-------------------------|-------------------------------------------------------------|
| `extensions`            | Search for and ask about VS Code extensions                 |
| `installExtension`      | Install a VS Code extension                                 |
| `runVscodeCommand`      | Run a VS Code command                                       |
| `VSCodeAPI`             | Ask about VS Code functionality and extension development   |

#### Project & Workspace Tools

| Tool                    | Description                                                 |
|-------------------------|-------------------------------------------------------------|
| `new`                   | Scaffold a new VS Code workspace                            |
| `newJupyterNotebook`    | Scaffold a new Jupyter notebook                             |
| `newWorkspace`          | Create a new workspace                                      |
| `getProjectSetupInfo`   | Get project scaffolding instructions                        |

#### Utility Tools

| Tool                    | Description                                                 |
|-------------------------|-------------------------------------------------------------|
| `selection`             | Get current editor selection                                |
| `testFailure`           | Get unit test failure information                           |
| `runTests`              | Run unit tests in workspace                                 |
| `openSimpleBrowser`     | Open Simple Browser for local web app preview               |
| `todos`                 | Track implementation progress with todo list                |
| `runSubagent`           | Run task in isolated subagent context                       |

### Tool Sets

Tool sets are predefined collections of related tools:

| Tool Set        | Description                                          | Included Tools (typical)                    |
|-----------------|------------------------------------------------------|---------------------------------------------|
| `edit`          | Enable modifications in workspace                    | editFiles, createFile, createDirectory      |
| `search`        | Enable searching files in workspace                  | fileSearch, textSearch, codebase            |
| `runCommands`   | Enable terminal commands                             | runInTerminal, getTerminalOutput            |
| `runNotebooks`  | Enable notebook cell execution                       | runCell, readNotebookCellOutput             |
| `runTasks`      | Enable task execution                                | runTask, createAndRunTask, getTaskOutput    |

### MCP Tools

To include all tools from an MCP server:
```yaml
tools: ['<server-name>/*']
```

Example:
```yaml
tools: ['filesystem/*', 'github/*']
```

---

## Tool List Priority

When tools are specified in multiple places, they are resolved in this priority order:

1. **Prompt file tools** (if any)
2. **Referenced agent tools** in prompt file (if any)
3. **Default tools** for selected agent (if any)

---

## Subagents

Custom agents can be used as **subagents** - specialized agents invoked by the main agent for specific tasks.

### Enabling Subagent Use

```yaml
---
name: my-agent
infer: true    # Enable use as subagent (default)
---
```

Set `infer: false` to prevent an agent from being used as a subagent.

### Subagent Invocation

In the main agent's instructions or prompts:
```markdown
Use #tool:runSubagent to delegate complex research tasks to a specialized agent.
```

---

## Agent Examples

### Example 1: Planning Agent (Read-Only)

```markdown
---
description: Generate an implementation plan for new features or refactoring.
name: Planner
tools: ['fetch', 'githubRepo', 'search', 'usages', 'codebase', 'readFile']
model: Claude Sonnet 4
handoffs:
  - label: Implement Plan
    agent: agent
    prompt: Implement the plan outlined above.
    send: false
---

# Planning Instructions

You are in **planning mode**. Your task is to generate an implementation plan for a new feature or for refactoring existing code.

**DO NOT make any code edits**, just generate a plan.

## Plan Structure

The plan consists of a Markdown document with the following sections:

1. **Overview**: A brief description of the feature or refactoring task
2. **Requirements**: A list of requirements for the feature or task
3. **Implementation Steps**: A detailed list of steps to implement the feature
4. **Testing**: A list of tests needed to verify the implementation

## Guidelines

- Research the codebase thoroughly before creating the plan
- Consider edge cases and potential issues
- Break down complex tasks into smaller, manageable steps
- Include file paths where changes will be needed
```

### Example 2: Security Reviewer Agent

```markdown
---
description: Perform security-focused code review
name: Security Reviewer
tools: ['codebase', 'readFile', 'usages', 'textSearch', 'problems']
handoffs:
  - label: Fix Issues
    agent: agent
    prompt: Fix the security issues identified above.
    send: false
---

# Security Review Instructions

You are a **security-focused code reviewer**. Your task is to identify potential security vulnerabilities in the codebase.

## Review Focus Areas

1. **Input Validation**: Check for proper sanitization and validation
2. **Authentication/Authorization**: Verify proper access controls
3. **Data Exposure**: Look for sensitive data leaks
4. **Injection Vulnerabilities**: SQL, XSS, command injection risks
5. **Dependencies**: Check for known vulnerable dependencies

## Output Format

For each issue found:
- **Severity**: Critical / High / Medium / Low
- **Location**: File and line number
- **Description**: What the vulnerability is
- **Recommendation**: How to fix it
```

### Example 3: Documentation Agent

```markdown
---
description: Generate and improve code documentation
name: Documenter
tools: ['codebase', 'readFile', 'usages', 'editFiles']
---

# Documentation Instructions

You are a **documentation specialist**. Your task is to generate or improve code documentation.

## Documentation Standards

- Use JSDoc/TSDoc for TypeScript/JavaScript
- Use docstrings for Python
- Include parameter descriptions and return values
- Add usage examples for complex functions
- Document edge cases and exceptions

## Guidelines

1. Read the existing code thoroughly
2. Understand the function's purpose and behavior
3. Write clear, concise documentation
4. Include type information
5. Add examples where helpful
```

### Example 4: Test Writer Agent

```markdown
---
description: Write comprehensive unit tests
name: Test Writer
tools: ['codebase', 'readFile', 'usages', 'editFiles', 'runTests', 'testFailure']
handoffs:
  - label: Run Tests
    agent: agent
    prompt: Run the tests and fix any failures.
    send: false
---

# Test Writing Instructions

You are a **test writing specialist**. Your task is to write comprehensive unit tests.

## Testing Principles

1. **AAA Pattern**: Arrange, Act, Assert
2. **One assertion per test** (when practical)
3. **Test edge cases** and error conditions
4. **Use descriptive test names**
5. **Mock external dependencies**

## Coverage Goals

- Happy path scenarios
- Error conditions
- Boundary values
- Null/undefined handling
- Async behavior (if applicable)
```

---

## Sharing Agents

### Workspace Level

Store agents in `.github/agents/` folder of your repository:
- Automatically available to all workspace users
- Version controlled with your project
- Share with team via source control

### Organization Level (Experimental)

Enable organization-level agent discovery:

1. Set `github.copilot.chat.customAgents.showOrganizationAndEnterpriseAgents` to `true`
2. Define agents at GitHub organization level
3. Agents appear in dropdown for all organization members

See [GitHub documentation](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/create-custom-agents) for organization agent setup.

---

## Best Practices

### Agent Design

| Practice                          | Description                                                           |
|-----------------------------------|-----------------------------------------------------------------------|
| **Single Purpose**                 | Each agent should have one clear purpose                              |
| **Minimal Tools**                  | Only include tools the agent actually needs                           |
| **Clear Instructions**             | Write explicit, unambiguous instructions                              |
| **Read-Only for Planning**         | Planning agents shouldn't have edit tools                             |
| **Use Handoffs**                   | Create workflow chains for multi-step processes                       |

### Tool Selection

| Scenario                          | Recommended Tools                                                      |
|-----------------------------------|------------------------------------------------------------------------|
| Research/Analysis                 | `codebase`, `readFile`, `usages`, `search`                             |
| Code Generation                   | `editFiles`, `createFile`, `codebase`, `readFile`                      |
| Debugging                         | `runInTerminal`, `problems`, `testFailure`, `readFile`                 |
| External Research                 | `fetch`, `githubRepo`                                                  |

### Instructions Writing

1. **Be Specific**: Clearly define what the agent should and shouldn't do
2. **Provide Structure**: Define expected output formats
3. **Include Examples**: Show sample outputs when helpful
4. **Set Boundaries**: Explicitly state limitations
5. **Use Markdown**: Format instructions for readability

---

## FAQ

### Are custom agents different from chat modes?

Custom agents were previously known as **custom chat modes**. The functionality remains the same, but the terminology has been updated to better reflect their purpose.

VS Code still recognizes `.chatmode.md` files. Use Quick Fix to migrate them to `.agent.md` format.

### How do I hide agents from the dropdown?

1. Select **Configure Custom Agents** from agents dropdown
2. Hover over an agent
3. Click the eye icon to show/hide

### Can I use custom agents with subagents?

Yes! Custom agents can be used as subagents when `infer: true` (the default). This is an experimental feature - see [VS Code documentation](https://code.visualstudio.com/docs/copilot/chat/chat-sessions#_use-a-custom-agent-with-subagents-experimental).

### What happens if a tool is not available?

If a specified tool is not available when using the agent, it is silently ignored. The agent will work with whatever tools are available.

### Can agents use MCP servers?

Yes! Reference MCP tools using:
- Specific tool: `'mcp-server-name/tool-name'`
- All server tools: `'mcp-server-name/*'`

---

## Related Resources

| Resource                                                                                          | Description                                |
|---------------------------------------------------------------------------------------------------|--------------------------------------------|
| [Custom Instructions](https://code.visualstudio.com/docs/copilot/customization/custom-instructions) | Define global behavior rules               |
| [Prompt Files](https://code.visualstudio.com/docs/copilot/customization/prompt-files)             | Create reusable prompt templates           |
| [Chat Tools](https://code.visualstudio.com/docs/copilot/chat/chat-tools)                          | Full tools documentation                   |
| [MCP Servers](https://code.visualstudio.com/docs/copilot/customization/mcp-servers)               | Model Context Protocol integration         |
| [Awesome Copilot](https://github.com/github/awesome-copilot/tree/main)                            | Community-contributed examples             |
| [Background Agents](https://code.visualstudio.com/docs/copilot/agents/background-agents)          | Run agents autonomously                    |
| [Cloud Agents](https://code.visualstudio.com/docs/copilot/agents/cloud-agents)                    | Run agents in the cloud                    |

---

## Quick Reference Card

### File Location
```
.github/agents/<name>.agent.md
```

### Minimal Template
```markdown
---
description: Brief description of the agent
tools: ['codebase', 'readFile']
---

# Agent Instructions

Your instructions here...
```

### Full Template
```markdown
---
name: Agent Name
description: What this agent does
argument-hint: How to use this agent
tools: ['tool1', 'tool2', 'mcp-server/*']
model: Claude Sonnet 4
infer: true
handoffs:
  - label: Next Step
    agent: next-agent
    prompt: Continue with the next step
    send: false
---

# Agent Title

## Purpose
Describe what this agent does.

## Guidelines
1. Guideline one
2. Guideline two

## Output Format
Describe expected output structure.
```

---

*Last updated: December 2024*
