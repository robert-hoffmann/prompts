---
agent: agent
---

Create a self-contained `typescript.ts` in [tests](../../tests/), that feels like a real Express micro-service from an internal platform repo.

Project scenario:
You are building **SocialPulse API** — a user profile and social graph service for an internal social-media-style platform. The API provides endpoints to query user profiles, search users, and retrieve social connections.

Constraints:
- Produce only one `.ts` file.
- Dependencies: `express`, `cors`, `uuid` (assume installed with their `@types/*` packages).
- The code must run on Node.js 18+ with TypeScript 5.0+ on Windows.
- All data is mocked in-memory (no database required).
- Use strict TypeScript mode (`strict: true` in tsconfig).

---

## Data Models (Interfaces & Types)

Define the following interfaces with proper typing:

### `UserProfile`
| Field             | Type                | Constraints / Notes                              |
|-------------------|---------------------|--------------------------------------------------|
| `userId`          | `string`            | UUID format, primary identifier                  |
| `username`        | `string`            | 3-30 chars, alphanumeric + underscores only      |
| `displayName`     | `string`            | 1-100 chars                                      |
| `email`           | `string`            | Valid email format                               |
| `bio`             | `string \| null`    | Max 500 chars, optional                          |
| `avatarUrl`       | `string \| null`    | Valid URL or null                                |
| `followerCount`   | `number`            | >= 0                                             |
| `followingCount`  | `number`            | >= 0                                             |
| `isVerified`      | `boolean`           | Default `false`                                  |
| `createdAt`       | `Date`              | Account creation timestamp                       |
| `tags`            | `string[]`          | Interest tags, max 10 items                      |

### `UserSummary`
A lightweight projection for lists: `userId`, `username`, `displayName`, `avatarUrl`, `isVerified`.

### `SearchResult`
| Field    | Type            | Notes                         |
|----------|-----------------|-------------------------------|
| `query`  | `string`        | The original search term      |
| `total`  | `number`        | Total matches found           |
| `page`   | `number`        | Current page (1-indexed)      |
| `limit`  | `number`        | Items per page                |
| `users`  | `UserSummary[]` | Matching user summaries       |

### `FollowConnection`
| Field            | Type                              | Notes                              |
|------------------|-----------------------------------|------------------------------------|
| `userId`         | `string`                          | The user being queried             |
| `connectionId`   | `string`                          | The connected user's ID            |
| `connectionType` | `'follower' \| 'following'`       |                                    |
| `since`          | `Date`                            | When the connection was established|

### `ApiError`
| Field     | Type     | Notes                    |
|-----------|----------|--------------------------|
| `status`  | `number` | HTTP status code         |
| `detail`  | `string` | Error message            |

---

## Mock Data Layer

1. Create a `MockDatabase` class that:
   - Generates 50 realistic fake users on initialization (use seeded random for reproducibility).
   - Generates random follow relationships between users.
   - Provides methods: `getUser(userId)`, `searchUsers(query, page, limit)`, `getFollowers(userId)`, `getFollowing(userId)`.

2. Search should match against `username`, `displayName`, and `tags` (case-insensitive partial match).

---

## API Endpoints

| Method | Path                              | Description                              | Response Type          |
|--------|-----------------------------------|------------------------------------------|------------------------|
| GET    | `/health`                         | Health check                             | `{ status: 'ok' }`     |
| GET    | `/users/:userId`                  | Get full user profile                    | `UserProfile`          |
| GET    | `/users/:userId/followers`        | Paginated list of followers              | `FollowConnection[]`   |
| GET    | `/users/:userId/following`        | Paginated list of users being followed   | `FollowConnection[]`   |
| GET    | `/search`                         | Search users by query string             | `SearchResult`         |

### Query Parameters
- `/search`: `q` (required), `page` (default 1), `limit` (default 20, max 100)
- `/users/:userId/followers` and `/following`: `page`, `limit`

### Error Handling
- Return `404` with `{ "detail": "User not found" }` for invalid `userId`.
- Return `400` for empty search query with `{ "detail": "Query parameter 'q' is required" }`.
- Return `400` for invalid pagination parameters.

---

## Additional Requirements

1. **Logging**           : Create a simple logger utility that logs each request (method, path, response time in ms).
2. **CORS**              : Enable CORS for all origins (for local dev).
3. **Startup message**   : Log "SocialPulse API started" and the number of mock users loaded on server start.
4. **Type Safety**       : Use discriminated unions for Result types, proper type guards where needed.
5. **Validation**        : Create validation helper functions for query parameters (page, limit, userId format).
6. **Entry point**       : Start the Express server on `0.0.0.0:8000`.

---

## TypeScript Patterns to Use

- Use `interface` for data models
- Use `type` for unions and utility types
- Use `readonly` for immutable properties where appropriate
- Use `satisfies` operator for configuration objects
- Use type guards for runtime type checking
- Use explicit return types on all functions

---

## Output Format (strict)

Return exactly one fenced code block labeled `typescript` containing the complete file contents.
Do not include any other text.
