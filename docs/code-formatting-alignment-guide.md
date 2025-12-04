# Code Formatting & Alignment Guide

## The Typography of Code

Just as typography and formatting are essential in letters, books, and documents, **code formatting and alignment are critical to software readability**. Well-formatted code allows developers to scan and analyze complex logic in an instant—the same way proper paragraph structure and typography help readers quickly grasp written content.

---

## Why Alignment Matters

### Visual Scanning
When code is properly aligned, your eyes can:
- **Instantly spot patterns** - Related values line up vertically
- **Detect anomalies** - Misaligned items stand out immediately
- **Group related concepts** - Visual proximity indicates logical relationship
- **Navigate faster** - Consistent structure reduces cognitive load

### The Book Analogy
Consider how a well-formatted book uses:
- **Consistent margins** → Code uses consistent indentation
- **Paragraph spacing** → Code uses blank lines between logical blocks
- **Chapter headings** → Code uses section headers with `===` or `---`
- **Aligned columns in tables** → Code aligns variable declarations and object keys

---

## Core Alignment Principles

### 1. Variable Declaration Alignment

Align related variable assignments to the longest identifier:

**Python:**
```python
# Aligned - Easy to scan
test          = 1
somethingelse = 2
another_var   = 3

# Unaligned - Harder to read
test = 1
somethingelse = 2
another_var = 3
```

**JavaScript:**
```javascript
// Aligned - Easy to scan
const test          = 1;
const somethingelse = 2;
const anotherVar    = 3;

// Unaligned - Harder to read
const test = 1;
const somethingelse = 2;
const anotherVar = 3;
```

### 2. Dictionary/Object Key Alignment

Align keys and values with spaces around colons:

**Python:**
```python
# Aligned - Instant comprehension
config = {
    'somevalue'           : 'somekey',
    'someothervalue'      : 'someotherkey',
    'short'               : 'val',
    'very_long_key_name'  : 'corresponding_value'
}

# Unaligned - Requires more effort to parse
config = {
    'somevalue': 'somekey',
    'someothervalue': 'someotherkey',
    'short': 'val',
    'very_long_key_name': 'corresponding_value'
}
```

**JavaScript:**
```javascript
// Aligned - Instant comprehension
const config = {
    someValue          : 'somekey',
    someOtherValue     : 'someotherkey',
    short              : 'val',
    veryLongKeyName    : 'correspondingValue'
};

// Unaligned - Requires more effort to parse
const config = {
    someValue: 'somekey',
    someOtherValue: 'someotherkey',
    short: 'val',
    veryLongKeyName: 'correspondingValue'
};
```

### 3. Function Parameter Alignment

**Python (8-space indentation for parameters):**
```python
def __init__(
        self,
        log_file_pattern       : str,
        database_path          : str,
        archive_interval       : float         = 600.0,  # 10 minutes default
        hot_log_file           : str | None    = None,
        backup_processed_files : bool          = False,
        backup_directory       : str | None    = None,
        max_batch_size         : int           = 10000
    ) -> None:
```

**JavaScript (4-space indentation for parameters):**
```javascript
constructor(
    logFilePattern,
    databasePath,
    archiveInterval  = 600000,  // 10 minutes default
    hotLogFile       = null,
    backupProcessed  = false,
    backupDirectory  = null,
    maxBatchSize     = 10000
) {
    // implementation
}
```

### 4. Class Attribute Alignment

**Python:**
```python
class DataProcessor:
    config        : dict[str, Any]
    results       : list[str]
    is_ready      : bool = False
    error_count   : int  = 0
    last_updated  : str  = ""
```

**JavaScript:**
```javascript
class DataProcessor {
    constructor() {
        this.config       = {};     // Configuration object
        this.results      = [];     // Processing results array
        this.isReady      = false;  // Ready state flag
        this.errorCount   = 0;      // Count of errors encountered
        this.lastUpdated  = '';     // Last update timestamp
    }
}
```

### 5. Import Statement Alignment

**Python:**
```python
# Standard library imports
import logging       # For error and debug logging
import pandas as pd  # Data manipulation and analysis library

# Type hinting imports
from typing import (
    Any,        # Generic type for flexible data structures
    Protocol,   # For structural subtyping
    TypeVar     # For generic type variables
)
```

**JavaScript:**
```javascript
// Core Node.js modules
import fs         from 'fs';          // File system operations
import path       from 'path';        // Path manipulation utilities
import crypto     from 'crypto';      // Cryptographic functions

// Third-party libraries
import express    from 'express';     // Web framework
import axios      from 'axios';       // HTTP client
```

---

## Section Headers for Code Structure

Use visual separators to organize code into logical sections:

**Python:**
```python
# ============================================================================
# Configuration and Constants
# ============================================================================

MAX_RETRIES = 3
TIMEOUT_MS  = 5000

# ============================================================================
# Helper Functions
# ============================================================================

def validate_input(data: dict[str, Any]) -> bool:
    # implementation
    pass

# ============================================================================
# Main Business Logic
# ============================================================================

def process_data(input_data: list[str]) -> dict[str, Any]:
    # implementation
    pass
```

**JavaScript:**
```javascript
// ============================================================================
// Configuration and Constants
// ============================================================================

const MAX_RETRIES = 3;
const TIMEOUT_MS  = 5000;

// ============================================================================
// Helper Functions
// ============================================================================

function validateInput(data) {
    // implementation
}

// ============================================================================
// Main Business Logic
// ============================================================================

function processData(input) {
    // implementation
}
```

---

## Benefits Summary

| Benefit | Description |
|---------|-------------|
| **Faster Code Review** | Aligned code reduces review time significantly |
| **Easier Debugging** | Patterns and anomalies become visually obvious |
| **Better Onboarding** | New team members understand code structure faster |
| **Reduced Errors** | Visual consistency helps catch mistakes early |
| **Professional Quality** | Well-formatted code signals attention to detail |

---

## The Bottom Line

**Code is read far more often than it is written.** Investing time in proper alignment and formatting pays dividends every time someone—including your future self—needs to understand, modify, or debug that code.

Just as you wouldn't publish a book with inconsistent margins, random spacing, and misaligned text, you shouldn't commit code that lacks visual structure and alignment.

**Format your code like you format your documents: with intention, consistency, and respect for the reader.**
