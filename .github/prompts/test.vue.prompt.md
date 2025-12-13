---
agent: agent
---

Create a self-contained `vuejs.html` in [tests](../../tests/), that feels like a real single-page application for an internal platform.

Project scenario:
You are building the **SocialPulse Dashboard** — a user interface for the SocialPulse API, an internal social-media-style platform. The SPA consumes the REST API running at `http://localhost:8000` and provides a clean, intuitive interface for browsing user profiles and social connections.

Constraints:
- Produce only one `.html` file (fully self-contained).
- Load Vue.js 3.4+ and Bootstrap 5.3+ from CDN.
- The code must run in modern browsers (Chrome, Firefox, Edge).
- All API calls go to `http://localhost:8000` (the SocialPulse API).

---

## API Endpoints (from SocialPulse API)

The backend provides these endpoints:

| Method | Path                              | Description                              | Response Model       |
|--------|-----------------------------------|------------------------------------------|----------------------|
| GET    | `/health`                         | Health check                             | `{"status": "ok"}`   |
| GET    | `/users/{user_id}`                | Get full user profile                    | `UserProfile`        |
| GET    | `/users/{user_id}/followers`      | Paginated list of followers              | `list[FollowConnection]` |
| GET    | `/users/{user_id}/following`      | Paginated list of users being followed   | `list[FollowConnection]` |
| GET    | `/search?q=&page=&limit=`         | Search users by query string             | `SearchResult`       |

### Data Models Reference

**UserProfile:**
```json
{
    "user_id"         : "uuid",
    "username"        : "string",
    "display_name"    : "string",
    "email"           : "string",
    "bio"             : "string | null",
    "avatar_url"      : "string | null",
    "follower_count"  : 0,
    "following_count" : 0,
    "is_verified"     : false,
    "created_at"      : "datetime",
    "tags"            : ["string"]
}
```

**UserSummary:**
```json
{
    "user_id"      : "uuid",
    "username"     : "string",
    "display_name" : "string",
    "avatar_url"   : "string | null",
    "is_verified"  : false
}
```

**SearchResult:**
```json
{
    "query" : "string",
    "total" : 0,
    "page"  : 1,
    "limit" : 20,
    "users" : [UserSummary]
}
```

**FollowConnection:**
```json
{
    "user_id"         : "uuid",
    "connection_id"   : "uuid",
    "connection_type" : "follower | following",
    "since"           : "datetime"
}
```

---

## UI Components & Features

### 1. Navigation Header
- App title: "SocialPulse"
- API health indicator (green dot if `/health` returns ok, red if offline)
- Dark/light mode toggle using Bootstrap's `data-bs-theme`

### 2. Search Panel
- Search input with debounced API calls (300ms delay)
- Display search results as a list of user cards
- Show "No results" message when empty
- Loading spinner during API calls

### 3. User Profile View
- Click on any user card to view their full profile
- Display all profile fields in a Bootstrap card layout
- Show interest tags as Bootstrap badges
- Verified users get a checkmark icon next to their name
- Tab navigation for:
  - **About**     — Bio and account details
  - **Followers** — Paginated list with "Load more" button
  - **Following** — Paginated list with "Load more" button

### 4. User Cards (reusable component)
- Avatar (use placeholder if `avatar_url` is null)
- Display name with verified badge if applicable
- Username (prefixed with @)
- Click to view profile

---

## Technical Requirements

### Vue.js 3.4+ (Composition API)
- Use `<script setup>` syntax
- Use `ref()`, `computed()`, `watch()` for reactivity
- Use `onMounted()` for initial data loading
- Create reusable components using Vue's component system

### Bootstrap 5.3+
- Use Bootstrap CSS variables for theming
- Implement dark mode with `data-bs-theme` attribute
- Use Bootstrap components: cards, badges, buttons, spinners, tabs, alerts
- Responsive layout using Bootstrap grid

### Modern CSS
- Use native CSS nesting where appropriate
- Use CSS custom properties for theming
- Ensure proper focus states for accessibility

### Error Handling
- Display user-friendly error messages for API failures
- Show "API offline" state when health check fails
- Handle 404 errors gracefully (user not found)

### Accessibility
- Use semantic HTML elements
- Add ARIA labels for interactive elements
- Ensure keyboard navigation works

---

## Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│  🟢 SocialPulse                          [🌙/☀️ Theme Toggle] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 🔍 Search users...                                   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────┐  ┌─────────────────────────────┐  │
│  │  Search Results     │  │  User Profile               │  │
│  │  ┌───────────────┐  │  │  ┌─────────────────────────┐│  │
│  │  │ User Card     │  │  │  │ Avatar + Name + Badge  ││  │
│  │  └───────────────┘  │  │  └─────────────────────────┘│  │
│  │  ┌───────────────┐  │  │  [About] [Followers] [Following]│
│  │  │ User Card     │  │  │  ┌─────────────────────────┐│  │
│  │  └───────────────┘  │  │  │ Tab Content             ││  │
│  │  ...                │  │  └─────────────────────────┘│  │
│  └─────────────────────┘  └─────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Additional Requirements

1. **Debounced Search**    : Implement debounce (300ms) for search input to avoid excessive API calls.
2. **Loading States**      : Show Bootstrap spinners during all API operations.
3. **Empty States**        : Display helpful messages when no data is available.
4. **Responsive Design**   : Works on mobile (stacked layout) and desktop (side-by-side).
5. **Smooth Transitions**  : Add subtle CSS transitions for UI state changes.
6. **Placeholder Avatar**  : Use generated avatars (see Image Resources below).
7. **Date Formatting**     : Format dates in a human-readable way (e.g., "Joined Dec 2024").

---

## Image Resources

For avatars and placeholder images, use these approaches:

### Option 1: Lorem Picsum (Recommended for Avatars)
Use [Lorem Picsum](https://picsum.photos/) for random placeholder images:

```javascript
// Random avatar by user ID (consistent per user)
const avatarUrl = `https://picsum.photos/seed/${userId}/100/100`;

// Random avatar with size
const avatarUrl = `https://picsum.photos/100/100`;

// Grayscale variant
const avatarUrl = `https://picsum.photos/100/100?grayscale`;
```

### Option 2: UI Avatars (Text-based)
Generate avatars from initials using [UI Avatars](https://ui-avatars.com/):

```javascript
// Avatar from name initials
const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&size=100&background=random`;
```

### Option 3: Inline SVG (Fallback)
Use inline SVG for a lightweight default avatar when no image is available:

```html
<!-- Default user avatar SVG -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <circle cx="50" cy="50" r="50" fill="#6c757d"/>
    <circle cx="50" cy="35" r="18" fill="#fff"/>
    <ellipse cx="50" cy="85" rx="30" ry="25" fill="#fff"/>
</svg>
```

Or as a data URI for use in `src` attributes:

```javascript
const defaultAvatar = `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="50" fill="#6c757d"/>
        <circle cx="50" cy="35" r="18" fill="#fff"/>
        <ellipse cx="50" cy="85" rx="30" ry="25" fill="#fff"/>
    </svg>
`)}`;
```

### Implementation Strategy
1. If `avatar_url` exists → use it directly
2. If `avatar_url` is null → use Lorem Picsum with `user_id` as seed (consistent avatar per user)
3. If image fails to load → fallback to inline SVG placeholder

---

## CDN Resources

Include these in the HTML `<head>`:

```html
<!-- Bootstrap 5.3 CSS -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">

<!-- Bootstrap Icons -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet">

<!-- Vue 3 -->
<script src="https://unpkg.com/vue@3/dist/vue.global.prod.js"></script>

<!-- Bootstrap 5.3 JS (for components like tabs) -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
```

---

## Output Format (strict)

Return exactly one fenced code block labeled `html` containing the complete file contents.
Do not include any other text.
