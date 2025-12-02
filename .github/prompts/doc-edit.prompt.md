---
agent: edit
description: 'Document a Python file in the project, following specific conventions for style, formatting, and documentation.'
---

Please document the file `${file}` following the conventions observed in the project.

**CRITICAL: Code Preservation Policy**
- NEVER remove any existing functionality from the code
- NEVER remove or delete any commented-out sections
- NEVER modify the core logic or behavior of existing functions
- Only ADD documentation, comments, and formatting improvements
- Preserve all existing code structure and implementation details

**General Style:**
- Add extensive inline comments to explain the logic, especially for complex parts. The goal is to make the code understandable even for a developer new to the project.
- Use section headers like `---` or `===` to structure the code into logical blocks (e.g., `# ================================= STEP 1: Description =================================`).

**Import Documentation:**
- Add inline comments to all imports explaining their purpose and usage in the module:
  ```python
  import logging      # For error and debug logging
  import pandas as pd # Data manipulation and analysis library
  import io           # Input/output operations (for string buffers)
  import traceback    # For detailed error stack traces
  ```
- For custom/project-specific imports, be especially detailed about their functionality:
  ```python
  from tools.nexcap import NEXCAP   # NEXCAP API integration
  from tools.google import GOOGLE   # Google Drive API integration
  from tools.skywise import SKYWISE # Skywise platform integration
  ```
- Group imports logically and add section comments when appropriate:
  ```python
  # Standard library imports for various functionalities
  import logging
  import pandas as pd

  # Custom tool imports - these are project-specific modules
  from tools.nexcap import NEXCAP
  from tools.google import GOOGLE
  ```
  When importing multiple items from the same module, list them vertically for clarity:
  ```python
  # Modern type hinting imports - minimal usage, prefer built-ins
  from typing import (
      Any,        # Generic type for flexible data structures
      Protocol,   # For structural subtyping
      TypeVar     # For generic type variables
  )

  # Collections from standard library for type hints
  from collections.abc import (
      Iterator,   # For iterator type hints
      Generator,  # For generator type hints
      Callable    # For function type hints
  )
  ```

**MANDATORY: Pylance Type Checking Compliance**
- **CRITICAL REQUIREMENT**: ALL code must pass Pylance type checking in `standard` mode, with modern `python 3.10.7` syntax
- **NO EXCEPTIONS**: Every function, method, class, and variable must have complete, accurate type annotations
- Always add: `from __future__ import annotations` at the top of the file to support forward references
- Use modern `python 3.10.7` union syntax with pipe operator (`|`) instead of deprecated `Union`
- Use modern `| None` syntax instead of `Optional`
- Use built-in collection types (`list`, `dict`, `tuple`, `set`) instead of deprecated `typing` equivalents
- **Class attributes** must be explicitly typed:
  ```python
  class DataProcessor:
      config   : dict[str, Any]
      results  : list[str]
      is_ready : bool = False
  ```
- **Instance variables** in `__init__` must be typed:
  ```python
  def __init__(
    self,
    data: list[dict[str, Any]]
  ) -> None:
      self.data: list[dict[str, Any]] = data
      self.processed_count: int       = 0
  ```
- **Complex return types** must use precise compound types with modern syntax:
  ```python
  # Good - specific and clear with modern syntax
  def parse_config(self) -> dict[str, str | int | bool]:

  # Avoid - too generic
  def parse_config(self) -> Any:
  ```
- **Optional parameters** must use modern `| None` syntax:
  ```python
  def process_data(
          self,
          data   : list[str],
          config : dict[str, Any] | None = None
      ) -> tuple[bool, str]:
  ```
- **Generator functions** must specify yield type:
  ```python
  from collections.abc import Iterator, Generator

  def read_lines(self, file_path: str) -> Iterator[str]:
      # or for more complex generators:
  def process_chunks(self, data: list[str]) -> Generator[dict[str, Any], None, None]:
  ```
- When functions don't return a value, explicitly use `-> None`
- **All variables** should have type hints when the type cannot be inferred:
  ```python
  # Good - type can be inferred
  count = 0
  names = ["alice", "bob"]

  # Required - type annotation needed
  results : list[dict[str, Any]]     = []
  config  : dict[str, str] | None = None
  ```

**Function Signature Formatting:**
- Always use the following multiline format with 8-space indentation for parameters:
  ```python
  def extract_station_substation(
          address: str
      ) -> tuple[str, str, str]:
  ```

- For functions with multiple parameters, maintain the same indentation pattern:
  ```python
  def complex_function(
          param1 : str,
          param2 : int,
          param3 : dict[str, Any] | None
      ) -> tuple[str, str, str]:
  ```
- Place each parameter and the return type on its own line with proper indentation

**Code Formatting & Alignment:**
- Align variable assignments for improved readability when declaring multiple related variables:
  ```python
  test          = 1
  somethingelse = 2
  another_var   = 3
  ```
- Align dictionary keys and values for better visual structure with spaces around colons:
  ```python
  config = {
      'somevalue'      : 'somekey',
      'someothervalue' : 'someotherkey',
      'short'          : 'val'
  }
  ```
- For dictionary alignment, align colons to the longest key with spaces before and after the colon:
  ```python
  schema_properties = {
      "short_key"           : {"type": "string"},
      "much_longer_key"     : {"type": "boolean"},
      "medium_length_key"   : {"type": "number"}
  }
  ```
- Apply similar alignment principles to function arguments when spanning multiple lines:
  ```python
  function_call(
      short_param     = value1,
      longer_param    = value2,
      very_long_param = value3
  )
  ```
- For functions or classes where we assign, and provide defaults, also use alignment for the values
```python
    def __init__(
            self,
            log_file_pattern       : str,
            database_path          : str,
            archive_interval       : float         = 600.0,  # 10 minutes default
            hot_log_file           : str | None    = None,
            backup_processed_files : bool          = False,
            backup_directory       : str | None    = None,
            max_batch_size         : int           = 10000,
            vacuum_interval        : int           = 24  # Hours between VACUUM operations
        ) -> None:
  ```
- Format arrays and lists in a readable multi-line structure when they contain many elements:
  ```python
  required_fields = [
      "program_name",
      "program_config_id",
      "timeout",
      "is_activate",
      "is_val",
      "output_dir",
      "cert_path"
  ]
  ```
- Maintain consistent spacing and alignment in lists, tuples, and other data structures where it enhances readability.

**File-Level Docstring:**
- Start with a brief title for the module.
- Follow with a paragraph explaining the module's overall purpose and functionality.
- Include a "Main functionality" section with a bulleted list of key responsibilities.

**Function/Method/Class Docstrings:**
- Use Google-style docstrings for ALL functions, methods, and classes.
- Start with a concise, one-sentence summary.
- Provide a more detailed paragraph explaining what the function does, its purpose, and any important context.
- Document all parameters under an `Args:` section, including their types and a clear description:
  ```python
  def extract_station_substation(
          address: str
      ) -> tuple[str, str, str]:
      """
      Parse a hierarchical address string to extract station, substation, and capsule components.

      This function splits an address path and extracts the relevant hierarchical components
      based on the address structure convention used in the system.

      Args:
          address (str): The full hierarchical address path with forward slash separators

      Returns:
          tuple[str, str, str]: A tuple containing (station, substation, capsule)

      Example:
          >>> extract_station_substation("/CAP1/zone/area/STATION_A/SUB_B")
          ("STATION_A", "SUB_B", "CAP1")
      """
  ```
- Document the return value under a `Returns:` section, including its type and what it represents.
- If applicable, include a `Side Effects:` section for any external changes the function makes (e.g., file I/O, API calls).
- If helpful, provide a simple `Example:` of usage with actual code samples.

**Inline Documentation:**
- Add comprehensive inline comments throughout function bodies to explain:
  - Complex logic or algorithms
  - Business rules or domain-specific requirements
  - Data transformations and their purpose
  - Error handling strategies
  - Performance considerations
- Use descriptive variable names and add comments when the purpose isn't immediately clear
- Comment any regex patterns, complex calculations, or non-obvious code constructs
- Explain the purpose of loops, conditionals, and data structure manipulations

**Commented Code Preservation:**
- Preserve ALL existing commented-out code sections exactly as they are
- Do NOT remove any `# TODO`, `# FIXME`, or similar developer notes
- Maintain any integration test sections or debugging code that may be commented out
- Keep all existing code structure and organization intact