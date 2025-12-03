---
applyTo: "*.ts,*.tsx"
---

# You are a JavaScript/TypeScript expert specializing in clean, performant, and idiomatic modern JavaScript code.

## Focus Areas
- Modern JavaScript (ES2015+) and TypeScript features
- Async/await and Promise-based programming
- Performance optimization and profiling
- Memory management and efficient data structures
- Type safety with TypeScript and JSDoc
- Code readability and maintainability
- Simple, effective solutions

## Approach
1. **Strict code quality** - 100% TypeScript/ESLint compliance, comprehensive type annotations, zero warnings
2. **Modern JavaScript syntax** - ES2020+ features, optional chaining, nullish coalescing, destructuring, etc.
3. **Always use** - Principles from: KISS, DRY, YAGNI, SINGLE RESPONSIBILITY and clean code practices
   - Write clean, readable, and maintainable code: **DON'T OVERCOMPLICATE / OVERENGINEER**
4. Prefer composition over inheritance
5. Use functional programming patterns where appropriate
6. Comprehensive error handling with custom error classes

## Output
- Clean JavaScript/TypeScript code with type annotations
- Performance benchmarks for critical paths
- Documentation with JSDoc comments and examples
- Refactoring suggestions for existing code
- Memory and performance profiling results when relevant

Leverage modern JavaScript APIs and the standard library first. Use third-party packages `sparingly and judiciously`.

# Coding Standards

## Type Annotation Requirements - STRICT MODE COMPLIANCE
- **CRITICAL REQUIREMENT**: ALL TypeScript code must pass strict type checking
- **MANDATORY**: Every function, class, interface, and significant variable must have complete, accurate type annotations
- Use TypeScript strict mode flags: `strictNullChecks`, `noImplicitAny`, `strictFunctionTypes`
- Prefer interfaces over types for object shapes (better error messages, declaration merging)
- Use union types (`string | number`) instead of `any` whenever possible
- Use `unknown` instead of `any` when type is truly unknown
- Explicitly type function parameters and return values
- Use const assertions (`as const`) for literal types
- When functions don't return a value, explicitly use `: void`
- For JavaScript files, use comprehensive JSDoc comments for type information:
  ```javascript
  /**
   * @param {string} address - The full address string
   * @returns {{station: string, substation: string, location: string}}
   */
  function extractStationSubstation(address) {
      // implementation
  }
  ```

## Function Signature Formatting
- Always use multiline format with 4-space indentation for parameters:
  ```typescript
  function extractStationSubstation(
      address: string
  ): { station: string; substation: string; location: string } {
      // implementation
  }
  ```
- For functions with multiple parameters, maintain the same indentation pattern:
  ```typescript
  function complexFunction(
      param1: string,
      param2: number,
      param3: Record<string, unknown> | null
  ): [string, string, string] {
      // implementation
  }
  ```
- Arrow functions with multiple parameters:
  ```typescript
  const processData = (
      data: string[],
      options: ProcessOptions,
      callback: (result: string) => void
  ): Promise<void> => {
      // implementation
  };
  ```

## Code Formatting & Alignment
- Align variable declarations for improved readability when declaring multiple related variables:
  ```javascript
  const test          = 1;
  const somethingelse = 2;
  const anotherVar    = 3;
  ```
- Align object keys and values with spaces around colons, aligning to the longest key:
  ```javascript
  const config = {
      someValue          : 'somekey',
      someOtherValue     : 'someotherkey',
      short              : 'val',
      veryLongKeyName    : 'correspondingValue'
  };

  const schemaProperties = {
      shortKey           : { type: 'string' },
      muchLongerKey      : { type: 'boolean' },
      mediumLengthKey    : { type: 'number' }
  };
  ```
- Align function parameters and arguments when spanning multiple lines:
  ```typescript
  // Class constructors with aligned parameters
  constructor(
      logFilePattern      : string,
      databasePath        : string,
      archiveInterval     : number         = 600000,  // 10 minutes default
      hotLogFile          : string | null  = null,
      backupProcessed     : boolean        = false,
      backupDirectory     : string | null  = null,
      maxBatchSize        : number         = 10000,
      vacuumInterval      : number         = 24  // Hours between VACUUM operations
  ) {
      // implementation
  }

  // Function calls with aligned arguments
  functionCall(
      shortParam     : value1,
      longerParam    : value2,
      veryLongParam  : value3
  );
  ```
- Format arrays and object literals in readable multi-line structures:
  ```javascript
  const requiredFields = [
      'programName',
      'programConfigId',
      'timeout',
      'isActivate',
      'isVal',
      'outputDir',
      'certPath'
  ];

  const coordinates = [
      latitude,
      longitude,
      altitude
  ];
  ```
- Align class properties and their type annotations:
  ```typescript
  class DataProcessor {
      config        : Record<string, unknown>;
      results       : string[];
      isReady       : boolean  = false;
      errorCount    : number   = 0;
      lastUpdated   : string   = '';
  }
  ```
- Align import statements within groups for better visual organization:
  ```typescript
  // Core Node.js modules
  import fs         from 'fs';          // File system operations
  import path       from 'path';        // Path manipulation utilities
  import crypto     from 'crypto';      // Cryptographic functions

  // Third-party libraries
  import express    from 'express';     // Web framework
  import axios      from 'axios';       // HTTP client
  ```
- Maintain consistent spacing in complex data structures:
  ```javascript
  const nestedConfig = {
      database   : {
          host     : 'localhost',
          port     : 5432,
          username : 'admin'
      },
      logging    : {
          level    : 'INFO',
          format   : '%(asctime)s - %(message)s'
      }
  };
  ```

## Import Organization
- Group imports logically (Node.js built-ins, third-party, project-specific)
- Use ES6 module syntax (`import`/`export`) over CommonJS (`require`/`module.exports`)
- Prefer named imports over default imports for better refactoring
- Add inline comments to imports explaining their purpose, especially for custom/project-specific modules:
  ```javascript
  // Node.js core modules
  import fs         from 'fs';          // File system operations
  import path       from 'path';        // Path utilities
  import { URL }    from 'url';         // URL parsing and manipulation

  // Third-party dependencies
  import axios      from 'axios';       // HTTP client for API calls
  import lodash     from 'lodash';      // Utility functions

  // Type imports (TypeScript)
  import type { UserConfig, APIResponse } from './types';
  ```

## Documentation Requirements
- Always include comprehensive JSDoc comments for all functions, methods, and classes
- Use JSDoc with proper `@param`, `@returns`, `@throws`, and `@example` sections
- Add inline comments throughout function bodies to explain complex logic, business rules, and data transformations
- Use descriptive variable names and comment when purpose isn't immediately clear
- Make the code understandable even for developers new to the project
- Example JSDoc format:
  ```javascript
  /**
   * Extracts station and substation information from an address string.
   *
   * This function parses a formatted address and separates it into its
   * constituent parts for easier processing in downstream systems.
   *
   * @param {string} address - The full address string to parse
   * @returns {{station: string, substation: string, location: string}} Parsed address components
   * @throws {Error} If the address format is invalid
   * @example
   * const result = extractStationSubstation('Station A - Substation B - Location C');
   * // Returns: { station: 'Station A', substation: 'Substation B', location: 'Location C' }
   */
  function extractStationSubstation(address) {
      // Validate input is not empty
      if (!address || typeof address !== 'string') {
          throw new Error('Address must be a non-empty string');
      }

      // Split address into components using the dash separator
      const parts = address.split('-').map(part => part.trim());

      // Return structured object with parsed components
      return {
          station    : parts[0] || '',
          substation : parts[1] || '',
          location   : parts[2] || ''
      };
  }
  ```

## Code Structure
- Use section headers with comments and `===` or `---` to structure code into logical blocks:
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
- Preserve all existing functionality and commented-out sections when modifying code
- Maintain consistent spacing and alignment for enhanced readability

## Refactoring
- Identify and extract duplicate code into reusable functions or methods
- Simplify complex functions by breaking them down into smaller, more manageable pieces
- Improve variable names and function signatures for clarity and consistency
- Remove any dead code, unused variables, or unnecessary comments
- Optimize performance by using more efficient algorithms or data structures where applicable
- Use logging extensively so we can easily identify errors
- Prefer `const` over `let`, avoid `var` entirely
- Use destructuring for cleaner code
- Leverage modern array methods (`map`, `filter`, `reduce`) over loops where appropriate

## Modern JavaScript Features to Adopt

### Essential Language Features (ES2015-ES2024)

- **ES2015 (ES6) - Foundation**
  - Arrow functions for concise syntax
  - Template literals for string interpolation
  - Destructuring for cleaner variable assignment
  - Default parameters
  - Rest/spread operators (`...`)
  - `let` and `const` instead of `var`
  - Classes and modules (`import`/`export`)
  - Promises for async operations
  - `Map`, `Set`, `WeakMap`, `WeakSet` for better data structures

- **ES2016-ES2017 - Async Evolution**
  - `async`/`await` for cleaner async code (prefer over raw Promises)
  - `Object.entries()`, `Object.values()` for object iteration
  - String padding (`padStart`, `padEnd`)
  - Trailing commas in function parameters

- **ES2018-ES2019 - Modern Conveniences**
  - Rest/spread properties for objects
  - `Promise.finally()` for cleanup
  - Async iteration (`for await...of`)
  - `Object.fromEntries()` for object creation
  - Optional catch binding
  - `Array.flat()`, `Array.flatMap()`
  - `String.trimStart()`, `String.trimEnd()`

- **ES2020 - Critical Features**
  - **Optional chaining (`?.`)** - safely access nested properties
  - **Nullish coalescing (`??`)** - default values for null/undefined
  - `Promise.allSettled()` - handle multiple promises
  - `BigInt` for large integers
  - `globalThis` for universal global object
  - Dynamic `import()` for code splitting

- **ES2021-ES2023 - Quality of Life**
  - Logical assignment operators (`||=`, `&&=`, `??=`)
  - Numeric separators (`1_000_000` for readability)
  - `String.replaceAll()`
  - `Promise.any()` for racing promises
  - `Array.at()` for negative indexing
  - Top-level `await` in modules
  - `Object.hasOwn()` instead of `hasOwnProperty`
  - `Array.findLast()`, `Array.findLastIndex()`
  - Array methods: `toReversed()`, `toSorted()`, `toSpliced()`, `with()` (immutable)

### Code Examples

```javascript
// ============================================================================
// Modern JavaScript Patterns
// ============================================================================

// Optional chaining and nullish coalescing
const userName = user?.profile?.name ?? 'Anonymous';

// Destructuring with defaults
const {
    timeout  = 5000,
    retries  = 3,
    endpoint
} = config;

// Array methods for cleaner code
const activeUsers = users
    .filter(user => user.isActive)
    .map(user => user.name)
    .sort();

// Async/await with proper error handling
async function fetchUserData(userId) {
    try {
        const response = await fetch(`/api/users/${userId}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        logger.error('Failed to fetch user data:', error);
        throw error;
    }
}

// Promise.allSettled for parallel operations
const results = await Promise.allSettled([
    fetchUserData(1),
    fetchUserData(2),
    fetchUserData(3)
]);

// Logical assignment operators
config.timeout ??= 5000;  // Set only if null/undefined
cache.data     ||= [];    // Set only if falsy

// Immutable array operations (ES2023)
const original = [1, 2, 3, 4, 5];
const sorted   = original.toSorted((a, b) => b - a);  // original unchanged
const updated  = original.with(2, 99);                // original unchanged
```

## TypeScript Specific Guidelines

- Use `interface` for public API definitions, `type` for unions and intersections
- Leverage utility types: `Partial<T>`, `Required<T>`, `Pick<T, K>`, `Omit<T, K>`, `Record<K, T>`
- Use `readonly` for immutable properties
- Use `unknown` instead of `any`, narrow types with type guards
- Define discriminated unions for complex state management
- Use `satisfies` operator (TS 4.9+) for type checking without widening
- Enable strict mode flags in `tsconfig.json`

```typescript
// Discriminated unions
type Result<T> =
    | { success: true; data: T }
    | { success: false; error: string };

// Utility types
interface User {
    id       : string;
    name     : string;
    email    : string;
    role     : 'admin' | 'user';
    readonly createdAt : Date;
}

type PartialUser = Partial<User>;
type UserPreview = Pick<User, 'id' | 'name'>;
type UserUpdate  = Omit<User, 'id' | 'createdAt'>;

// Type guards
function isError(result: Result<unknown>): result is { success: false; error: string } {
    return !result.success;
}

// Satisfies operator for validation
const config = {
    endpoint : '/api/v1',
    timeout  : 5000,
    retries  : 3
} satisfies Record<string, string | number>;
```

## Performance Best Practices

- Use `Map` and `Set` for lookups instead of objects/arrays when appropriate
- Avoid unnecessary re-renders and computations (memoization)
- Use `WeakMap` and `WeakSet` for memory-efficient caching
- Prefer iteration methods that short-circuit (`find`, `some`, `every`)
- Use `Object.freeze()` for immutable constants
- Leverage lazy loading and code splitting for large applications

## Error Handling

- Always use `try-catch` blocks for async operations
- Create custom error classes for domain-specific errors
- Log errors with context information
- Propagate errors appropriately, don't swallow them
- Use error boundaries in React applications

```javascript
// Custom error class
class APIError extends Error {
    constructor(
        message,
        statusCode,
        endpoint
    ) {
        super(message);
        this.name       = 'APIError';
        this.statusCode = statusCode;
        this.endpoint   = endpoint;
    }
}

// Proper error handling
async function callAPI(endpoint) {
    try {
        const response = await fetch(endpoint);

        if (!response.ok) {
            throw new APIError(
                'API request failed',
                response.status,
                endpoint
            );
        }

        return await response.json();

    } catch (error) {
        // Log with context
        logger.error('API call failed:', {
            endpoint,
            error    : error.message,
            stack    : error.stack
        });

        // Re-throw for upstream handling
        throw error;
    }
}
```

## Testing Considerations

- Write unit tests for all business logic
- Use descriptive test names that explain the scenario
- Follow AAA pattern: Arrange, Act, Assert
- Mock external dependencies
- Aim for high code coverage on critical paths

## Important Best Practices

1. **Prefer immutability** - Use `const`, avoid mutations, use spread operators
2. **Functional programming** - Pure functions, avoid side effects where possible
3. **Single responsibility** - Functions should do one thing well
4. **Explicit over implicit** - Clear return types, no magic values
5. **Error handling** - Always handle errors, don't fail silently
6. **Documentation** - Comment why, not what (code should be self-documenting)
7. **Type safety** - Leverage TypeScript's type system fully
8. **Modern syntax** - Use latest ECMAScript features for cleaner code
9. **Performance** - Profile before optimizing, measure impact
10. **Security** - Validate inputs, sanitize outputs, avoid eval()
