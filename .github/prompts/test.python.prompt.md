---
agent: agent
---

Create a self-contained `python.py` in [tests](../../tests/), that feels like a real FastAPI micro-service from an internal platform repo.

Project scenario:
You are building **SocialPulse API** — a user profile and social graph service for an internal social-media-style platform. The API provides endpoints to query user profiles, search users, and retrieve social connections.

Constraints:
- Produce only one `.py` file.
- Dependencies: `fastapi`, `pydantic`, `uvicorn` (assume installed).
- The code must run on Python 3.10+ on Windows.
- All data is mocked in-memory (no database required).

---

## Data Models (Pydantic)

Define the following Pydantic models with proper validation:

### `UserProfile`
| Field         | Type              | Constraints / Notes                              |
|---------------|-------------------|--------------------------------------------------|
| `user_id`     | `str`             | UUID format, primary identifier                  |
| `username`    | `str`             | 3-30 chars, alphanumeric + underscores only      |
| `display_name`| `str`             | 1-100 chars                                      |
| `email`       | `str`             | Valid email format                               |
| `bio`         | `str \| None`     | Max 500 chars, optional                          |
| `avatar_url`  | `str \| None`     | Valid URL or None                                |
| `follower_count`  | `int`         | >= 0                                             |
| `following_count` | `int`         | >= 0                                             |
| `is_verified` | `bool`            | Default `False`                                  |
| `created_at`  | `datetime`        | Account creation timestamp                       |
| `tags`        | `list[str]`       | Interest tags, max 10 items                      |

### `UserSummary`
A lightweight projection for lists: `user_id`, `username`, `display_name`, `avatar_url`, `is_verified`.

### `SearchResult`
| Field    | Type               | Notes                         |
|----------|--------------------|-------------------------------|
| `query`  | `str`              | The original search term      |
| `total`  | `int`              | Total matches found           |
| `page`   | `int`              | Current page (1-indexed)      |
| `limit`  | `int`              | Items per page                |
| `users`  | `list[UserSummary]`| Matching user summaries       |

### `FollowConnection`
| Field          | Type       | Notes                              |
|----------------|------------|------------------------------------|
| `user_id`      | `str`      | The user being queried             |
| `connection_id`| `str`      | The connected user's ID            |
| `connection_type` | `Literal["follower", "following"]` |                   |
| `since`        | `datetime` | When the connection was established|

---

## Mock Data Layer

1. Create a `MockDatabase` class that:
   - Generates 50 realistic fake users on initialization (use random but deterministic seed for reproducibility).
   - Generates random follow relationships between users.
   - Provides methods: `get_user(user_id)`, `search_users(query, page, limit)`, `get_followers(user_id)`, `get_following(user_id)`.

2. Search should match against `username`, `display_name`, and `tags` (case-insensitive partial match).

---

## API Endpoints

| Method | Path                              | Description                              | Response Model       |
|--------|-----------------------------------|------------------------------------------|----------------------|
| GET    | `/health`                         | Health check                             | `{"status": "ok"}`   |
| GET    | `/users/{user_id}`                | Get full user profile                    | `UserProfile`        |
| GET    | `/users/{user_id}/followers`      | Paginated list of followers              | `list[FollowConnection]` |
| GET    | `/users/{user_id}/following`      | Paginated list of users being followed   | `list[FollowConnection]` |
| GET    | `/search`                         | Search users by query string             | `SearchResult`       |

### Query Parameters
- `/search`: `q` (required), `page` (default 1), `limit` (default 20, max 100)
- `/users/{user_id}/followers` and `/following`: `page`, `limit`

### Error Handling
- Return `404` with `{"detail": "User not found"}` for invalid `user_id`.
- Return `422` for validation errors (handled by FastAPI).
- Return `400` for empty search query.

---

## Additional Requirements

1. **Logging**            : Use Python's `logging` module to log each request (method, path, response time).
2. **CORS**               : Enable CORS for all origins (for local dev).
3. **Startup event**      : Log "SocialPulse API started" and the number of mock users loaded.
4. **Lifespan or events** : Use modern FastAPI lifespan context manager pattern.
5. **Entry point**        : Include `if __name__ == "__main__":` block that runs uvicorn on `0.0.0.0:8000`.
   - Use `"tests.python:app"` as the app import string (full module path for running from project root with `python -m tests.python`).

---

## Output Format (strict)

Return exactly one fenced code block labeled `python` containing the complete file contents.
Do not include any other text.
