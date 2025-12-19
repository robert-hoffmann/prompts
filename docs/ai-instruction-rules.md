# AI Instruction File Development Rules

> **Purpose:** Definitive guidelines for creating and verifying custom AI instruction files and agents targeting **frontier coding models** (GPT-4+, Claude 3+, Gemini Ultra, etc.)

---

## Core Principles

### 1. Precision Over Verbosity

> **Research finding:** Longer prompts perform WORSE 73% of the time.

| Task Complexity | Optimal Token Range | Guidance                                    |
| --------------- | ------------------- | ------------------------------------------- |
| Simple          | 15-25 tokens        | Direct commands, minimal context            |
| Moderate        | 40-60 tokens        | Focused instructions with essential context |
| Complex         | 60-100 tokens       | Structured reasoning, verification steps    |
| Beyond 100      | ⚠️ Performance degrades | Refactor into smaller, focused sections   |

**Rule:** Every token must earn its place. Remove filler words, redundant phrases, and over-explanation.

---

### 2. Structure Hierarchy

> **Research finding:** Models follow a strict priority order for instructions.

**Always structure instructions in this order:**

```
1. Direct Commands      ("Do X")           — Highest priority
2. Negative Constraints ("Don't do Y")     — Clear boundaries
3. Context/Examples     (When essential)   — Minimal, targeted
4. Role Context         (If truly needed)  — Functional, not theatrical
5. Style/Tone           (Last priority)    — Only when relevant
```

**Rule:** Lead with actionable commands. Push nice-to-haves to the end.

---

### 3. Formatting Standards

> **Research finding:** XML tags beat everything else by 31%.

**Preferred Formats (by effectiveness):**

| Format          | Impact    | Use Case                                    |
| --------------- | --------- | ------------------------------------------- |
| XML tags        | +31%      | Structured sections, input/output boundaries|
| Markdown        | +12%      | Documentation, hierarchical content         |
| Numbered lists  | +8%       | Sequential steps, priority ordering         |
| Bullet points   | Neutral   | Unordered options, feature lists            |
| ALL CAPS        | **-23%**  | ❌ NEVER use for emphasis                   |
| Emojis          | **-15%**  | ❌ Avoid in technical instructions          |

**Rule:** Use XML tags for structural boundaries. Use Markdown for readability. Never use ALL CAPS or emojis in instruction files.

---

## Instruction Design Rules

### Rule 1: Zero-Shot First, Few-Shot Sparingly

> **Research finding:** Few-shot examples hurt performance on 60% of tasks due to anchoring.

**DO:**
```xml
<instruction>
Generate a Python function that validates email addresses.
Requirements:
- Use regex pattern matching
- Return boolean
- Handle edge cases: empty string, missing @, invalid TLD
</instruction>
```

**DON'T:**
```xml
<instruction>
Here's an example of a validation function:
def validate_phone(phone): ...  <!-- Model anchors to this pattern -->

Now write a similar function for emails.
</instruction>
```

**When few-shot IS appropriate:**
- Novel output formats the model hasn't seen
- Domain-specific conventions (rare)
- Exact style matching requirements

---

### Rule 2: Verification Over Chain-of-Thought

> **Research finding:** "Verify your answer" improves accuracy 2.3x more than CoT. CoT only helps 23% of tasks.

**Preferred approach:**

```xml
<instruction>
Implement the requested feature.
After implementation, verify:
- Does it handle edge cases?
- Are there potential runtime errors?
- Does it match the stated requirements?
</instruction>
```

**Reserve CoT for:**
- Multi-step mathematical calculations
- Complex logical derivations
- Debugging with explicit trace requirements

---

### Rule 3: Functional Context Over Role-Playing

> **Research finding:** Role-playing prompts reduce factual accuracy by 31%.

**DON'T:**
```xml
<instruction>
You are a senior software architect with 20 years of experience...
Act as an expert in distributed systems...
Pretend you are the world's best Python developer...
</instruction>
```

**DO:**
```xml
<instruction>
Apply these architectural principles:
- SOLID design patterns
- Microservices best practices
- Horizontal scalability considerations
</instruction>
```

**Rule:** Define capabilities and constraints, not personas.

---

### Rule 4: Meta-Cognitive Prompting for Complex Tasks

> **Research finding:** Meta-cognitive approaches work best for frontier models.

**Structure for complex/ambiguous tasks:**

```xml
<instruction>
1. Understand the requirement: [Parse and interpret the request]
2. Form initial approach: [Outline solution strategy]
3. Critical evaluation: [Identify potential issues, edge cases, or gaps]
4. Refine and implement: [Adjust based on evaluation]
5. Verify correctness: [Confirm solution meets all requirements]
</instruction>
```

**When to apply:**
- Ambiguous requirements
- Multiple valid interpretations
- High-stakes code changes
- Complex refactoring

---

### Rule 5: Direct Commands with Clear Scope

**Structure commands with explicit boundaries:**

```xml
<instruction>
REQUIRED:
- Use TypeScript strict mode
- Handle all error cases with try/catch
- Return typed responses

FORBIDDEN:
- No any types
- No console.log in production code
- No synchronous file operations

SCOPE:
- Apply to: **/*.ts, **/*.tsx
- Exclude: test files, configuration files
</instruction>
```

---

## Token Economy Guidelines

### Scaling Behavior

```
Tokens 1-10:    Linear performance gains      → Maximum impact zone
Tokens 10-100:  Logarithmic gains             → Diminishing returns
Tokens 100+:    Performance degradation       → Refactor needed
```

### Token Optimization Strategies

| Strategy                        | Savings      | Example                                         |
| ------------------------------- | ------------ | ----------------------------------------------- |
| Remove filler phrases           | 20-40%       | "Please make sure to" → (remove)                |
| Consolidate redundant rules     | 15-30%       | Merge overlapping instructions                  |
| Use references over repetition  | 10-25%       | "Follow [Section X] rules" vs repeating them    |
| Abbreviate obvious context      | 10-20%       | Model knows common conventions                  |

**Before (67 tokens):**
```
When you are writing Python code, please make sure that you always 
follow PEP 8 style guidelines and ensure that all your functions 
have proper docstrings that explain what the function does.
```

**After (18 tokens):**
```
Python code requirements:
- PEP 8 compliant
- Docstrings on all functions
```

---

## Model-Specific Considerations

### Frontier Models (70B+ / GPT-4 / Claude 3+)

| Approach                    | Effectiveness | Notes                                      |
| --------------------------- | ------------- | ------------------------------------------ |
| Meta-cognitive prompting    | ✅ High       | Model can reliably self-reflect            |
| Reasoning instructions      | ✅ High       | "Verify", "Evaluate", "Consider edge cases"|
| Complex structured prompts  | ✅ Effective  | Can handle multi-part instructions         |
| Few-shot examples           | ⚠️ Usually hurts | Only for novel formats                   |
| Role-playing                | ❌ Avoid      | Reduces accuracy 31%                       |

### Key Insight

> Frontier models perform better **as themselves** with clear instructions than when cosplaying experts.

---

## Instruction File Structure Template

```xml
<!-- ============================================================================
     [INSTRUCTION FILE NAME]
     Applies to: [file patterns]
     ============================================================================ -->

<!-- ============================================================================
     SECTION 1: DIRECT COMMANDS (Highest Priority)
     ============================================================================ -->
<commands>
  <required>
    - [Mandatory behavior 1]
    - [Mandatory behavior 2]
  </required>
  
  <forbidden>
    - [Prohibited action 1]
    - [Prohibited action 2]
  </forbidden>
</commands>

<!-- ============================================================================
     SECTION 2: VERIFICATION REQUIREMENTS
     ============================================================================ -->
<verification>
  After completing the task, verify:
  - [Verification point 1]
  - [Verification point 2]
</verification>

<!-- ============================================================================
     SECTION 3: CONTEXT (Only if essential)
     ============================================================================ -->
<context>
  [Minimal, targeted context that cannot be inferred]
</context>

<!-- ============================================================================
     SECTION 4: EXAMPLES (Only for novel formats)
     ============================================================================ -->
<examples>
  [Single, minimal example if absolutely necessary]
</examples>
```

---

## Verification Checklist

Use this checklist when creating or reviewing instruction files:

### Structure & Priority
- [ ] Direct commands appear first
- [ ] Negative constraints follow commands
- [ ] Context/examples are minimal and last
- [ ] No role-playing or persona definitions

### Token Economy
- [ ] Simple tasks: < 30 tokens per rule
- [ ] Complex tasks: < 80 tokens per rule
- [ ] No filler phrases ("please make sure", "you should always")
- [ ] No redundant/overlapping rules

### Formatting
- [ ] XML tags used for structural boundaries
- [ ] Markdown used for readability
- [ ] No ALL CAPS for emphasis
- [ ] No emojis
- [ ] Numbered lists for sequential/priority items

### Content Quality
- [ ] Zero-shot preferred over few-shot
- [ ] Verification steps included for complex tasks
- [ ] Meta-cognitive structure for ambiguous tasks
- [ ] Commands are specific and actionable
- [ ] Scope/applicability is clearly defined

### Anti-Patterns Avoided
- [ ] No role-playing prompts
- [ ] No excessive examples (max 1 if needed)
- [ ] No chain-of-thought for simple tasks
- [ ] No vague instructions ("write good code")
- [ ] No personality traits or style definitions

---

## Meta-Prompting for Instruction Development

> **Research finding:** Asking the model to write its own prompt beats human-written prompts 78% of the time.

**When developing new instruction files:**

```xml
<meta-prompt>
Given this task domain: [domain]
And these constraints: [constraints]

Write an instruction set that would make you excel at:
- [specific capability 1]
- [specific capability 2]

Then evaluate your instruction set for:
- Token efficiency
- Clarity of commands
- Completeness of verification steps
</meta-prompt>
```

**Use this for:**
- Novel task domains
- Optimizing existing instruction files
- Discovering edge cases in requirements

---

## Quick Reference Card

| Principle                  | Rule                                             |
| -------------------------- | ------------------------------------------------ |
| **Length**                 | 15-60 tokens per instruction block               |
| **Structure**              | Commands → Constraints → Context → Examples      |
| **Formatting**             | XML tags > Markdown > Lists > Plain text         |
| **Examples**               | Zero-shot first; few-shot only for novel formats |
| **Reasoning**              | "Verify your answer" > "Think step by step"      |
| **Identity**               | Functional context > Role-playing                |
| **Complex tasks**          | Meta-cognitive structure with self-evaluation    |
| **Measurement**            | Task completion + factual accuracy               |

---

## Revision History

| Version | Date       | Changes                                      |
| ------- | ---------- | -------------------------------------------- |
| 1.0     | 2024-12-19 | Initial rules based on research synthesis    |

---

## References

- Stanford prompt length research (100K prompts, 12 tasks)
- MIT few-shot anchoring study
- DeepMind CoT effectiveness analysis
- Berkeley role-playing accuracy study
- Anthropic token scaling research
- Google meta-prompting breakthrough
- Meta-cognitive prompting (MP) framework research
