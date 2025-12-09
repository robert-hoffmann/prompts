---
applyTo: "*.py,*.ipynb"
---

# Python-Specific Standards

## Platform & Environment
- **Target**: Windows Server compatible, Python 3.10+
- Use `pathlib.Path` for all file operations (Windows compatible path handling)
- Be mindful of NTFS behaviors and CRLF line endings

## Python-Specific Approach
1. **100% Pylance compliance** in `standard` mode - zero warnings
2. **Modern syntax**: pipe unions (`|`), match statements, walrus operator (`:=`)
3. **Generators** for memory efficiency on large datasets
4. **Zen of Python** as guiding philosophy

# Type Hinting - STRICT MODE

- Add `from __future__ import annotations` at top of every file
- **Every** function, method, class attribute, and variable must have type annotations
- Use modern syntax:
  - `str | None` not `Optional[str]`
  - `list[int]` not `List[int]`
  - `dict[str, Any]` not `Dict[str, Any]`
- Explicit `-> None` for functions without return values

## Preferred Python Patterns

- **`pathlib.Path`** over `os.path` for filesystem operations
- **`@dataclass`** for simple data containers
- **`Pydantic BaseModel`** for validation, settings, and external data parsing
- **`collections.abc`** for protocols (`Callable`, `Iterable`, `Mapping`) over `typing` variants

```python
from pathlib        import Path
from dataclasses    import dataclass
from pydantic       import BaseModel, Field

# Filesystem
config_file = Path('config') / 'settings.json'

# Simple data container
@dataclass
class Point:
    x     : float
    y     : float
    label : str = "origin"

# Validated model
class Config(BaseModel):
    host    : str
    port    : int   = Field(gt=0, le=65535)
    timeout : float = 30.0
```

## Python Function Signatures

Use multiline format with 8-space indentation:

```python
def complex_function(
        param1  : str,
        param2  : int,
        param3  : dict[str, Any] | None = None
    ) -> tuple[str, str, str]:
```

## Python-Specific Alignment Examples

> Base alignment rules from `copilot-instructions.md` apply. These show Python syntax:

```python
# Class attributes
class DataProcessor:
    config      : dict[str, Any]
    results     : list[str]
    is_ready    : bool = False

# Function with defaults (8-space indent)
def __init__(
        self,
        log_file_pattern : str,
        archive_interval : float      = 600.0,
        max_batch_size   : int        = 10000
    ) -> None:
```

## Import Organization

```python
# Standard library
import logging
from pathlib import Path

# Third-party
import pandas as pd

# Project-specific
from utils.nexcap import NEXCAP  # NEXCAP API integration

# Typing (minimal - prefer built-ins)
from typing import Any, Protocol, TypeVar
from collections.abc import Callable, Iterator
```

## Python Docstrings

Use Google-style docstrings:

```python
def process_data(items: list[str], limit: int = 100) -> dict[str, int]:
    """Process items and return frequency counts.

    Args:
        items: List of strings to process.
        limit: Maximum items to process.

    Returns:
        Dictionary mapping items to their counts.

    Raises:
        ValueError: If items is empty.
    """
```

## Key PEP Standards (Python 3.10+)

**Type Syntax:**
- PEP 585: `list[int]`, `dict[str, Any]` (built-in generics)
- PEP 604: `int | str`, `T | None` (union with `|`)
- PEP 563: `from __future__ import annotations`
- PEP 544: `Protocol` for structural subtyping

**Modern Features:**
- PEP 634-636: `match/case` pattern matching
- PEP 618: `zip(strict=True)`
- PEP 572: Walrus operator `:=`
- PEP 570: Positional-only parameters (`/`)
- PEP 616: `str.removeprefix()` / `removesuffix()`

**Deprecations:**
- Prefer `collections.abc` over `typing` for protocols
- Use `pyproject.toml` (PEP 621) over `setup.py`
- `distutils` is deprecated (PEP 632)