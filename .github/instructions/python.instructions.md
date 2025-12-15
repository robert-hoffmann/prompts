---
applyTo: "**/*.py, **/*.ipynb"
---

# Python-Specific Standards

> **CRITICAL: Use MODERN Python (3.10+)**
>
> Most AI models are trained on legacy Python code. This file enforces modern idioms.
> When in doubt, prefer the newest syntax and stdlib features over deprecated patterns.

## Platform & Environment

- **Target**        : Windows Server compatible, Python 3.10+ (prefer 3.12+)
- **Path handling** : Use `pathlib.Path` exclusively (Windows compatible)
- **Line endings**  : Be mindful of NTFS behaviors and CRLF

## Python-Specific Approach

1. **100% Pylance compliance** in `standard` mode — zero warnings
2. **Modern syntax** : pipe unions (`|`), match statements, walrus operator (`:=`)
3. **Generators**    : for memory efficiency on large datasets
4. **Zen of Python** : as guiding philosophy

---

# Type Hinting — STRICT MODE

> **Every** function, method, class attribute, and variable must have type annotations.

```python
from __future__ import annotations  # PEP 563 — ALWAYS first import
```

## Modern Type Syntax (REQUIRED)

| ✅ Modern (Use This)         | ❌ Legacy (Never Use)          |
|------------------------------|--------------------------------|
| `str \| None`                | `Optional[str]`                |
| `list[int]`                  | `List[int]`                    |
| `dict[str, Any]`             | `Dict[str, Any]`               |
| `tuple[int, ...]`            | `Tuple[int, ...]`              |
| `type[MyClass]`              | `Type[MyClass]`                |
| `collections.abc.Callable`   | `typing.Callable`              |
| `collections.abc.Iterable`   | `typing.Iterable`              |

- Explicit `-> None` for functions without return values
- Use `Self` (3.11+) for methods returning `self`
- Use `TypeVar` and `Generic` for reusable generic types
- Use `Protocol` for structural subtyping (duck typing)

---

# Data Modeling — MODERN PATTERNS

> **Stop using plain dicts and tuples for structured data!**
>
> AI models often generate legacy patterns. Use dataclasses or Pydantic.

## Decision Tree: Which to Use?

```
Is the data from external sources (API, file, user input)?
├─ YES → Use Pydantic BaseModel (validation + serialization)
└─ NO  → Is it a simple internal data container?
         ├─ YES → Use @dataclass (lightweight, fast)
         └─ NO  → Is it configuration/settings?
                  ├─ YES → Use Pydantic BaseSettings
                  └─ NO  → Use @dataclass or Pydantic based on complexity
```

## Dataclasses — Modern Features (3.10+)

```python
# Dataclasses for lightweight internal data containers
from dataclasses import (
    dataclass, # Decorator to auto-generate __init__, __repr__, etc.
    field      # Customize field behavior (default_factory, metadata)
)

@dataclass(slots=True, frozen=True, kw_only=True)
class Point:
    """
    Immutable point with memory-efficient slots.

    Attributes:
        x     : X coordinate.
        y     : Y coordinate.
        label : Optional label for the point.
    """
    x     : float
    y     : float
    label : str = "origin"

@dataclass(slots=True)
class Container:
    """Container with mutable default handled correctly."""
    items : list[str]      = field(default_factory=list)
    meta  : dict[str, Any] = field(default_factory=dict)
```

**Dataclass Best Practices:**
- `slots=True`                 — Memory efficient, faster attribute access
- `frozen=True`                — Immutable (when appropriate)
- `kw_only=True`               — Force keyword arguments (clearer call sites)
- `field(default_factory=...)` — For mutable defaults (lists, dicts)

## Pydantic v2 — Validated Models

> **Use Pydantic v2 API** — v1 patterns are legacy.

```python
# Pydantic v2 for validated models, settings, and external data parsing
from pydantic import (
    BaseModel,       # Base class for validated data models
    ConfigDict,      # Model configuration (strict, frozen, etc.)
    Field,           # Field constraints and metadata (gt, le, min_length)
    field_validator, # Decorator for field-level validation (v2 API)
    model_validator  # Decorator for cross-field validation (v2 API)
)

class UserConfig(BaseModel):
    """
    User configuration with validation.

    Attributes:
        username : Unique username (3-50 chars).
        email    : Valid email address.
        port     : Network port (1-65535).
        timeout  : Request timeout in seconds.
    """
    model_config = ConfigDict(
        strict              = True,
        frozen              = True,
        validate_assignment = True
    )

    username : str   = Field(min_length=3, max_length=50)
    email    : str   = Field(pattern=r'^[\w\.-]+@[\w\.-]+\.\w+$')
    port     : int   = Field(gt=0, le=65535, default=8080)
    timeout  : float = Field(gt=0, default=30.0)

    @field_validator('username')
    @classmethod
    def username_alphanumeric(cls, v: str) -> str:
        """Ensure username contains only alphanumeric characters."""
        if not v.isalnum():
            raise ValueError('must be alphanumeric')
        return v.lower()

    @model_validator(mode='after')
    def validate_model(self) -> Self:
        """Cross-field validation after all fields are set."""
        # Example: custom validation logic here
        return self
```

**Pydantic v2 Patterns:**
- `model_config = ConfigDict(...)` — NOT inner `class Config:`
- `@field_validator`               — NOT `@validator`
- `@model_validator`               — NOT `@root_validator`
- `model_dump()`                   — NOT `.dict()`
- `model_dump_json()`              — NOT `.json()`

---

# Modern Python Features — USE THESE

## Pattern Matching (3.10+)

```python
def handle_response(response: dict[str, Any]) -> str:
    """Handle API response with pattern matching."""
    match response:
        case {"status": "ok", "data": data}:
            return f"Success: {data}"
        case {"status": "error", "message": msg}:
            return f"Error: {msg}"
        case {"status": status}:
            return f"Unknown status: {status}"
        case _:
            return "Invalid response format"
```

## Walrus Operator (3.8+)

```python
# Process while reading — avoid redundant calls
while (line := file.readline()):
    process(line)

# Filter and capture in comprehensions
valid_items = [
    cleaned
    for item in items
    if (cleaned := item.strip())  # Assign and filter in one step
]
```

## Modern String Methods (3.9+)

```python
# Use removeprefix/removesuffix — NOT lstrip/rstrip for this!
filename = "test_data.csv"
name     = filename.removeprefix("test_").removesuffix(".csv")  # "data"
```

## Exception Groups (3.11+)

```python
# Handle multiple exceptions with ExceptionGroup
try:
    async with asyncio.TaskGroup() as tg:
        tg.create_task(task1())
        tg.create_task(task2())
except* ValueError as eg:
    for exc in eg.exceptions:
        log.error(f"ValueError: {exc}")
except* TypeError as eg:
    for exc in eg.exceptions:
        log.error(f"TypeError: {exc}")
```

## TaskGroup for Async (3.11+)

```python
async def fetch_all(urls: list[str]) -> list[Response]:
    """Fetch multiple URLs concurrently with structured concurrency."""
    results: list[Response] = []

    async with asyncio.TaskGroup() as tg:
        for url in urls:
            tg.create_task(fetch_and_append(url, results))

    return results
```

---

# Import Organization

> **Every import must be documented.** Imports are the first thing developers see — make them informative.

## Import Documentation Rules

1. **Section headers**     — Group imports with `===` separators (Futures, Standard Library, Third-Party, Project)
2. **Single-line imports** — Add inline comment explaining what the import provides
3. **Multi-import blocks** — Each import on its own line with aligned inline comments
4. **Alignment**           — Align both the imports and their comments into columns

## Example

```python
# ============================================================================
# Futures (always first)
# ============================================================================
from __future__ import annotations  # PEP 563: Postponed evaluation

# ============================================================================
# Standard Library
# ============================================================================
import asyncio # Async I/O event loop
import logging # Logging facility

from pathlib import Path # Filesystem path handling

# datetime — Date and time manipulationfrom datetime import (
    datetime,  # Date and time objects
    timedelta, # Time duration representation
    UTC        # UTC timezone (3.11+) — NOT timezone.utc
)

# dataclasses — Decorator for auto-generating special methods
from dataclasses import (
    dataclass, # Auto-generate __init__, __repr__, etc.
    field      # Customize field behavior (default_factory, metadata)
)

# ============================================================================
# Third-Party Packages
# ============================================================================

# pydantic — Data validation using Python type hints
from pydantic import (
    BaseModel,       # Base class for validated data models
    ConfigDict,      # Model configuration (strict, frozen, etc.)
    Field,           # Field constraints and metadata (gt, le, min_length)
    field_validator, # Decorator for field-level validation (v2 API)
    model_validator  # Decorator for cross-field validation (v2 API)
)

# ============================================================================
# Project-Specific
# ============================================================================
from myproject.utils import helper_function  # Project utility helpers

# ============================================================================
# Typing (minimal — prefer built-ins)
# ============================================================================

# typing — Type hints for static analysis
from typing import (
    Any,      # Any type (use sparingly)
    Protocol, # Structural subtyping (duck typing)
    Self,     # Return type for self (3.11+)
    TypeVar   # Generic type variable
)

# collections.abc — Abstract base classes for containers
from collections.abc import (
    Callable, # Callable protocol
    Iterator, # Iterator protocol
    Mapping,  # Mapping protocol (dict-like)
    Sequence  # Sequence protocol (list-like)
)
```

---

# Function Signatures & Docstrings

Format with **one parameter per line**, aligned colons:

```python
def process_data(
    items   : Sequence[str],
    limit   : int  = 100,
    verbose : bool = False,
    *,
    callback : Callable[[str], None] | None = None
) -> dict[str, int]:
    """
    Process items and return frequency counts.

    Args:
        items    : Sequence of strings to process.
        limit    : Maximum items to process.
        verbose  : Enable detailed logging.
        callback : Optional callback for each processed item.

    Returns:
        Dictionary mapping items to their occurrence counts.

    Raises:
        ValueError : If items is empty.
        TypeError  : If items contains non-string elements.

    Example:
        >>> process_data(['a', 'b', 'a'], limit=50)
        {'a': 2, 'b': 1}
    """
    if not items:
        raise ValueError("items cannot be empty")

    # Implementation here...
```

**Key points:**
- Each parameter on its own line
- Align `:` separators into a column
- Use `*` to force keyword-only arguments for clarity
- Use `Sequence[T]` over `list[T]` in parameters for flexibility
- Google-style docstrings with aligned Args

---

# Key PEP Standards Reference

## Type Syntax (3.10+)
| PEP   | Feature                                           |
|-------|---------------------------------------------------|
| 585   | `list[int]`, `dict[str, Any]` (built-in generics) |
| 604   | `int \| str`, `T \| None` (union with `\|`)       |
| 563   | `from __future__ import annotations`              |
| 544   | `Protocol` for structural subtyping               |
| 673   | `Self` type for methods returning self            |

## Modern Features (3.10+)
| PEP     | Feature                               |
|---------|---------------------------------------|
| 634-636 | `match/case` pattern matching         |
| 618     | `zip(strict=True)`                    |
| 572     | Walrus operator `:=`                  |
| 570     | Positional-only parameters (`/`)      |
| 616     | `str.removeprefix()` / `removesuffix` |

## Python 3.11+ Features
| Feature              | Description                          |
|----------------------|--------------------------------------|
| `Self` type          | For methods returning `self`         |
| `asyncio.TaskGroup`  | Structured concurrency               |
| `ExceptionGroup`     | Handle multiple exceptions           |
| `datetime.UTC`       | Preferred over `timezone.utc`        |
| `tomllib`            | Built-in TOML parsing                |

## Python 3.12+ Features
| Feature              | Description                          |
|----------------------|--------------------------------------|
| `type` statement     | Type alias declarations              |
| Type parameter syntax| `def func[T](x: T) -> T:`            |
| f-string improvements| Nested quotes, expressions           |

## Deprecations — AVOID THESE
| ❌ Deprecated                | ✅ Use Instead                     |
|------------------------------|-----------------------------------|
| `typing.List`, `Dict`, etc.  | Built-in `list`, `dict`           |
| `typing.Callable`            | `collections.abc.Callable`        |
| `Optional[T]`                | `T \| None`                       |
| `Union[A, B]`                | `A \| B`                          |
| `setup.py`                   | `pyproject.toml` (PEP 621)        |
| `distutils`                  | `setuptools` or build backends    |
| `timezone.utc`               | `datetime.UTC` (3.11+)            |
| Pydantic v1 patterns         | Pydantic v2 API                   |