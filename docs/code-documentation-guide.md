# Code Documentation Guide: For Humans and AI

This guide explains the importance of code documentation, the special `AGENT_TODO` tag system, and how proper documentation benefits both human developers and AI coding assistants.

---

## The AGENT_TODO System

### What is AGENT_TODO?

`AGENT_TODO` is a special comment tag used to communicate instructions directly to AI coding agents. When an AI assistant encounters this tag in your code, it understands that:

1. **There's work to be done**     — The comment explains what changes need to be made
2. **Context is provided**         — The developer has left specific guidance on how to approach the task
3. **Completion should be marked** — Once the task is done, the tag should be changed to `AGENT_DONE` with an explanation of what was accomplished

### How It Works

**Before AI intervention:**
```python
from __future__ import annotations

# For flexible return type annotation
from typing import Any

# HTTP library for API calls
import requests


# AGENT_TODO: Implement error handling for network timeouts
# Should retry up to 3 times with exponential backoff
def fetch_data(
        url: str
    ) -> dict[str, Any]:
    response = requests.get(url)
    return response.json()
```

**After AI intervention:**
```python
from __future__ import annotations

# For flexible return type annotation
from typing import Any  

# HTTP library for API calls
import requests

# Retry logic with backoff
from tenacity import (
    retry,              # Decorator for automatic retries
    stop_after_attempt, # Stop after N attempts
    wait_exponential    # Exponential backoff between retries
)


# AGENT_DONE: Added retry logic with exponential backoff (max 3 retries)
# Implemented using tenacity library for robust retry handling
@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
def fetch_data(
        url: str
    ) -> dict[str, Any]:
    response = requests.get(url, timeout=30)
    response.raise_for_status()
    return response.json()
```

### Why Use AGENT_TODO?

| Benefit | Description |
|---------|-------------|
| **Clear Intent** | Explicitly tells the AI what you want done |
| **Contextual Guidance** | Provides domain-specific knowledge the AI might not infer |
| **Trackable Progress** | Easy to search for incomplete tasks |
| **Audit Trail** | `AGENT_DONE` comments document what was changed and why |

---

## The Value of Code Documentation

### Documentation Isn't Just for Humans Anymore

Traditionally, code documentation served one primary audience: **human developers**. But in the age of AI-assisted development, documentation has gained a powerful second purpose — it provides **context for AI systems** to understand your codebase faster and more accurately.

### How AI Uses Documentation

When an AI coding assistant analyzes your code, it relies on multiple signals to understand:
- What a function or class does
- What parameters it expects and returns
- Edge cases and constraints
- Business logic and domain rules
- Relationships between components

**Well-documented code accelerates AI comprehension exponentially.**

---

## Documentation Levels and Their Impact

### 1. Class-Level Documentation

Class documentation provides the "big picture" context that helps AI understand the role and responsibility of a component.

```python
from __future__ import annotations

# For clean data container classes
from dataclasses import (
    dataclass,  # Decorator for auto-generated methods
    field       # Customize field behavior
)

# Type annotations
from typing import (
    Any,       # For flexible/dynamic types
    Protocol   # For structural subtyping (duck typing)
)

# For audit logging and compliance tracking
import logging


class PaymentGateway(Protocol):
    """Protocol for payment gateway implementations."""

    def charge(
            self,
            amount : float,
            token  : str
        ) -> dict[str, Any]:
        ...


@dataclass
class PaymentProcessor:
    """
    Handles payment transactions for the e-commerce platform.

    This processor supports multiple payment gateways (Stripe, PayPal, Square)
    and implements retry logic for failed transactions. All transactions are
    logged for audit purposes and PCI compliance.

    Attributes:
        gateway      : The active payment gateway instance
        max_retries  : Maximum retry attempts for failed transactions (default: 3)
        audit_logger : Logger instance for compliance tracking

    Example:
        processor = PaymentProcessor(gateway=StripeGateway())
        result    = processor.charge(amount=99.99, card_token='tok_xxx')
    """
    gateway      : PaymentGateway
    max_retries  : int            = 3
    audit_logger : logging.Logger = field(default_factory=lambda: logging.getLogger(__name__))

    def charge(
            self,
            amount     : float,
            card_token : str
        ) -> dict[str, Any]:
        """Process a payment charge through the configured gateway."""
        # Implementation here
        ...
```

**AI Benefit:** The AI immediately understands:
- This is a payment system (high sensitivity, needs careful handling)
- Multiple gateways are supported (polymorphic design expected)
- Retry logic exists (shouldn't duplicate this)
- Audit logging is required (must preserve in any modifications)

### 2. Function-Level Documentation

Function documentation provides the contract that AI can rely on when making changes or calling the function.

```javascript
/**
 * Calculates the total price including discounts, taxes, and shipping.
 * 
 * @param {Object[]} items          - Array of cart items
 * @param {number} items[].price    - Unit price of the item
 * @param {number} items[].quantity - Quantity ordered
 * @param {string} [couponCode]     - Optional discount coupon code
 * @param {string} shippingZone     - Shipping zone identifier (e.g., 'US-WEST', 'EU')
 * 
 * @returns {Object} Pricing breakdown
 * @returns {number} .subtotal - Sum before discounts
 * @returns {number} .discount - Total discount applied
 * @returns {number} .tax      - Calculated tax amount
 * @returns {number} .shipping - Shipping cost
 * @returns {number} .total    - Final amount to charge
 * 
 * @throws {InvalidCouponError} When coupon code is expired or invalid
 * @throws {ShippingZoneError}  When shipping zone is not supported
 * 
 * @example
 * const pricing = calculateTotal(
 *   [{ price: 29.99, quantity: 2 }],
 *   'SAVE10',
 *   'US-EAST'
 * );
 * // Returns: { subtotal: 59.98, discount: 6.00, tax: 4.32, shipping: 5.99, total: 64.29 }
 */
function calculateTotal(items, couponCode, shippingZone) {
    // ...
}
```

**AI Benefit:** The AI can:
- Generate correct function calls without guessing parameter types
- Handle errors appropriately (knows what exceptions to expect)
- Understand the return structure for downstream processing
- Use the example as a test case reference

### 3. Inline Documentation

Inline comments explain the "why" behind non-obvious code decisions.

```python
from __future__ import annotations

from dataclasses import dataclass  # For clean data container classes
from threading   import Lock       # For thread-safe inventory operations


# Module-level lock for inventory operations
inventory_lock: Lock = Lock()


class OutOfStockError(Exception):
    """Raised when requested items are not available in inventory."""


class PaymentError(Exception):
    """Raised when payment processing fails."""


@dataclass
class Order:
    """Represents a customer order."""
    items       : list[str]
    customer_id : str
    total       : float


def check_inventory(
        items: list[str]
    ) -> bool:
    """Check if all items are available in inventory."""
    ...


def deduct_inventory(
        items: list[str]
    ) -> None:
    """Remove items from available inventory."""
    ...


def restore_inventory(
        items: list[str]
    ) -> None:
    """Return items to available inventory (rollback operation)."""
    ...


def charge_customer(
        order: Order
    ) -> None:
    """Process payment for the given order."""
    ...


def process_order(
        order: Order
    ) -> None:
    """Process an order with inventory reservation and payment.

    Args:
        order: The order to process

    Raises:
        OutOfStockError : When items are not available
        PaymentError    : When payment fails (inventory is rolled back)
    """
    # IMPORTANT: Lock must be acquired before inventory check to prevent
    # race conditions in high-traffic scenarios (see incident #1247)
    with inventory_lock:
        if not check_inventory(order.items):
            raise OutOfStockError()

        # Deduct inventory BEFORE payment to reserve items
        # Payment failure will trigger rollback via compensating transaction
        deduct_inventory(order.items)

        try:
            charge_customer(order)
        except PaymentError:
            # Rollback inventory on payment failure
            # WARNING: Do not remove - this maintains inventory consistency
            restore_inventory(order.items)
            raise
```

**AI Benefit:** The AI learns:
- There's a concurrency concern (won't remove the lock "for simplicity")
- The operation order is intentional (won't "optimize" by reordering)
- The rollback is critical (won't refactor it away)
- There's historical context (incident #1247 provides reasoning)

---

## The Cost of Poor Documentation

### What Happens Without Documentation

When AI encounters undocumented code, it must:

1. **Infer purpose from naming** — Often ambiguous or misleading
2. **Analyze usage patterns** — Time-consuming and error-prone
3. **Make assumptions** — Risk of incorrect modifications
4. **Ask clarifying questions** — Slows down the workflow

### Real-World Impact

| Scenario | Well-Documented | Poorly Documented |
|----------|-----------------|-------------------|
| Understanding a class | Seconds | Minutes to hours |
| Safe refactoring | High confidence | Risk of breaking changes |
| Adding features | Knows constraints | May violate assumptions |
| Bug fixing | Clear context | May introduce new bugs |
| Code review | AI can validate intent | Can only check syntax |

---

## Best Practices for AI-Friendly Documentation

### DO ✅

- **Explain the "why"**    — AI can see *what* code does; tell it *why* it does it
- **Document constraints** — Business rules, performance requirements, security considerations
- **Note edge cases**      — Special handling that isn't obvious from the code
- **Include examples**     — Concrete usage helps AI understand intent
- **Mark sensitive areas** — Use tags like `WARNING`, `IMPORTANT`, `SECURITY`
- **Use standard formats** — JSDoc, docstrings, XML comments (AI recognizes these patterns)

### DON'T ❌

- **State the obvious**     — `// increment i` adds no value
- **Let documentation rot** — Outdated docs are worse than none
- **Write novels**          — Be concise; AI processes efficiently
- **Hide complexity**       — If code is complex, documentation should explain it, not mask it

---

## Comment Tags Reference

These tags are recognized by the **[Todo Tree](https://marketplace.visualstudio.com/items?itemName=Gruntfuggly.todo-tree)** VS Code extension, which provides a tree view of all tagged comments in your workspace. This makes it easy to track tasks, bugs, and important notes across your entire codebase.

Preserve these tags — they carry semantic meaning for both humans and AI:

| Tag | Purpose |
|-----|---------|
| `TODO` | Work that needs to be done |
| `FIXME` | Known bug or issue that needs fixing |
| `HACK` | Temporary workaround; needs proper solution |
| `BUG` | Identifies a known bug |
| `WARNING` | Caution area; modification may cause issues |
| `IMPORTANT` | Critical information that must not be overlooked |
| `INFO` | Additional context or explanation |

### AI-Specific Tags

The following tags are **custom additions** designed specifically for AI coding assistants (not part of Todo Tree's default set, though Todo Tree can be configured to highlight them):

| Tag | Purpose |
|-----|---------|
| `AGENT_TODO` | Instruction for AI coding agents — tells the AI what work needs to be done |
| `AGENT_DONE` | Marks completed AI task with explanation of what was changed and why |

---

## Conclusion

Documentation is no longer just a courtesy for future developers — it's a **force multiplier for AI-assisted development**. Every docstring, comment, and annotation you write:

- Reduces AI inference time
- Increases modification accuracy
- Preserves critical context
- Enables safer refactoring
- Creates an audit trail

**Write documentation as if you're training an AI to understand your code — because you are.**

---

## See Also

- [AI Context Window Management Guide](./ai-context-window-guide.md) — Managing tokens and context for effective AI assistance
- [Code Formatting & Alignment Guide](./code-formatting-alignment-guide.md) — Visual formatting principles for readable code
- [README.md](./README.md) — Documentation index
- [CONTRIBUTING.md](../CONTRIBUTING.md) — Contribution guidelines
