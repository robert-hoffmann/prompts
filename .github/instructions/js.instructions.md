---
applyTo: "*.js, *.jsx, *.ts, *.tsx"
---

# JavaScript/TypeScript Expert Guide

You are a JavaScript/TypeScript expert specializing in clean, performant, and idiomatic modern code.

## Modern JavaScript Features (ES2020+ Required)

| Feature | Usage | Example |
|---------|-------|-------|
| Optional chaining | Safe nested access | `user?.profile?.name` |
| Nullish coalescing | Default for null/undefined | `value ?? 'default'` |
| Logical assignment | Conditional assign | `x ??= defaultValue` |
| Immutable arrays (ES2023) | Non-mutating ops | `arr.toSorted()`, `arr.with(i, val)` |
| Object.groupBy (ES2024) | Group by key | `Object.groupBy(arr, fn)` |

**Always prefer:** `async/await`, destructuring, template literals, `Map`/`Set` for lookups, `const` over `let`.

---

## TypeScript Guidelines

**STRICT MODE REQUIRED:** All code must pass `strictNullChecks`, `noImplicitAny`, `strictFunctionTypes`.

| Rule | Do | Don't |
|------|-----|-------|
| Type annotations | Explicit on all functions | Rely on inference for public APIs |
| Unknown types | `unknown` | `any` |
| Object shapes | `interface` | `type` (unless union/intersection) |
| Void returns | `: void` explicit | Omit return type |

### TypeScript Patterns

```typescript
// Use `interface` for public API definitions, `type` for unions and intersections
interface User {
    id          : string;
    name        : string;
    email       : string;
    role        : 'admin' | 'user';
    readonly createdAt : Date;
}

// Discriminated unions for complex state management
type Result<T> =
    | { success: true ; data: T }
    | { success: false; error: string };

// Utility types: Partial<T>, Required<T>, Pick<T, K>, Omit<T, K>, Record<K, T>
type PartialUser = Partial<User>;
type UserPreview = Pick<User, 'id' | 'name'>;
type UserUpdate  = Omit<User, 'id' | 'createdAt'>;

// Type guards for narrowing
function isError(result: Result<unknown>): result is { success: false; error: string } {
    return !result.success;
}

// Satisfies operator (TS 4.9+) for type checking without widening
const config = {
    endpoint : '/api/v1',
    timeout  : 5000,
    retries  : 3
} satisfies Record<string, string | number>;
```

### TypeScript Features to Leverage

- Use `readonly` for immutable properties
- Define discriminated unions for complex state management
- Use `satisfies` operator (TS 4.9+) for type checking without widening
- Enable strict mode flags in `tsconfig.json`

---

## JavaScript JSDoc Requirements

For JavaScript files, use comprehensive JSDoc for type information:

```javascript
/**
 * Extracts station and substation information from an address string.
 *
 * @param   {string} address                                          - The full address string to parse
 * @returns {{station: string, substation: string, location: string}} - Parsed address components
 * @throws  {Error}                                                   - If the address format is invalid
 * @example
 * const result = extractStationSubstation('Station A - Substation B');
 */
function extractStationSubstation(address) {
    // implementation...
}
```

---

## Function Signature Formatting

Use multiline format with aligned parameters:

```typescript
// TypeScript function
function complexFunction(
    param1   : string,
    param2   : number,
    param3   : Record<string, unknown> | null = null
): [string, string, string] {
    // implementation
}

// Constructor with defaults
constructor(
    logFilePattern      : string,
    databasePath        : string,
    archiveInterval     : number         = 600000,  // 10 minutes
    maxBatchSize        : number         = 10000
) {
    // implementation
}
```

```javascript
// JavaScript with JSDoc
/**
 * @param {string} param1         - First parameter
 * @param {number} param2         - Second parameter
 * @returns {[string, string]}    - Result tuple
 */
function complexFunction(param1, param2) {
    // implementation
}
```

---

## Import Organization

Group imports by source with section headers:

```typescript
// ============================================================================
// Node.js core | Third-party | Type imports | Project modules
// ============================================================================
import fs         from 'fs';          // File system operations
import path       from 'path';        // Path manipulation

import express    from 'express';     // Web framework
import axios      from 'axios';       // HTTP client

import type { UserConfig } from './types';

import { logger } from './utils/logger';
```

**Rules:** ES6 modules over CommonJS, named imports over default, inline comments for custom modules.

---

## Performance Best Practices

- Use `Map`/`Set` for O(1) lookups over objects/arrays
- Use `WeakMap`/`WeakSet` for memory-efficient caching
- Prefer short-circuit methods: `find`, `some`, `every`
- Use `for...of` when iteration performance matters
- Leverage lazy loading and dynamic `import()` for code splitting

---

## Error Handling Pattern

Use custom error classes for domain-specific errors:

```typescript
class AppError extends Error {
    constructor(message: string, public code: string, public details: object = {}) {
        super(message);
        this.name      = this.constructor.name;
        this.timestamp = new Date().toISOString();
        Error.captureStackTrace?.(this, this.constructor);
    }
}

class ValidationError extends AppError {
    constructor(message: string, public field: string) {
        super(message, 'VALIDATION_ERROR', { field });
    }
}

class APIError extends AppError {
    constructor(message: string, public statusCode: number, public endpoint: string) {
        super(message, 'API_ERROR', { statusCode, endpoint });
    }
}
```

**Error handling rules:**
- Always `try-catch` async operations
- Log errors with context (endpoint, params, stack)
- Re-throw for upstream handling — don't swallow errors


---

## JS/TS-Specific Best Practices

| Principle | JS/TS Application |
|-----------|-------------------|
| **Immutability** | Use `const`, spread operators, `toSorted()`/`with()` |
| **Type safety** | TypeScript strict mode or comprehensive JSDoc |
| **Modern syntax** | ES2020+ features for cleaner, safer code |
| **Security** | Validate inputs, sanitize outputs, avoid `eval()` |
