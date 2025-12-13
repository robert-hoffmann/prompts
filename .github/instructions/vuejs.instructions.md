---
applyTo: "*.html,*.css,*.vue"
---

# Web Development Standards (Vue.js 3 + CSS3 + Bootstrap 5.3+)

> **CRITICAL: Use MODERN Web Technologies**
>
> Most AI models are trained on legacy patterns. This file enforces modern idioms.
> When in doubt, prefer the newest syntax and features over deprecated patterns.

## Platform & Environment

- **HTML5**          : Semantic markup, modern APIs, ARIA accessibility
- **CSS3**           : Native nesting, container queries, `:has()`, custom properties
- **Vue.js 3.4+**    : Composition API, `<script setup>`, defineModel, typed props
- **Bootstrap 5.3+** : CSS variables, `data-bs-theme`, utility API

---

# CSS3 — MODERN FEATURES REQUIRED

> **Stop using preprocessors for features CSS now handles natively!**
>
> Native CSS nesting, custom properties, and container queries are widely supported.

## Native CSS Nesting (REQUIRED)

```css
/* ✅ MODERN — Native CSS Nesting */
.card {
    padding       : 1rem;
    border-radius : var(--bs-border-radius);

    /* Pseudo-classes with & */
    &:hover {
        box-shadow : var(--bs-box-shadow);
    }

    /* Nested selectors */
    .card-header {
        font-weight : 600;

        &.primary {
            color : var(--bs-primary);
        }
    }

    /* Nested media queries */
    @media (min-width: 768px) {
        padding : 2rem;
    }
}
```

## Container Queries (REQUIRED for Component-Based Design)

```css
/* Container queries — responsive to parent, not viewport */
.card-container {
    container-type : inline-size;
    container-name : card;
}

.card {
    padding: 1rem;

    @container card (min-width: 400px) {
        display               : grid;
        grid-template-columns : 1fr 2fr;
        gap                   : 1rem;
    }

    @container card (min-width: 600px) {
        grid-template-columns : 1fr 3fr;
    }
}
```

## Modern Selectors

| Selector | Purpose | Example |
|----------|---------|---------|
| `:has()` | Parent selection | `.form-group:has(.is-invalid)` |
| `:is()`  | Grouping (full specificity) | `:is(h1, h2, h3) { margin-top: 0; }` |
| `:where()` | Grouping (zero specificity) | `:where(.btn) { cursor: pointer; }` |
| `:focus-visible` | Keyboard focus only | `button:focus-visible { outline: 2px solid; }` |

```css
/* :has() for parent selection — game changer */
.form-group:has(.is-invalid) {
    border-left : 3px solid var(--bs-danger);
}

.card:has(> img:first-child) {
    padding-top : 0;
}

/* :focus-visible for keyboard-only focus styles */
.btn:focus-visible {
    outline        : 2px solid var(--bs-primary);
    outline-offset : 2px;
}
```

## CSS Layers (@layer)

```css
/* Define layer order — later layers override earlier */
@layer reset, base, components, utilities;

@layer reset {
    *, *::before, *::after {
        box-sizing: border-box;
    }
}

@layer components {
    .card {
        /* Component styles */
    }
}

@layer utilities {
    .visually-hidden {
        position : absolute;
        width    : 1px;
        height   : 1px;
        clip     : rect(0, 0, 0, 0);
    }
}
```

## CSS Property Ordering

Order properties logically within each rule:

1. **Layout**     — `display`, `position`, `grid-*`, `flex-*`, `z-index`
2. **Box Model**  — `width`, `height`, `margin`, `padding`, `border`
3. **Typography** — `font-*`, `line-height`, `text-*`
4. **Visual**     — `background`, `color`, `box-shadow`, `opacity`
5. **Animation**  — `transition`, `animation`, `transform`

---

# Bootstrap 5.3+ — MODERN PATTERNS

> **Bootstrap 5.3+ uses CSS custom properties extensively.**
> Customize via CSS variables, not Sass overrides when possible.

## Bootstrap CSS Variables

```css
/* Override Bootstrap variables at :root or component level */
:root {
    --bs-primary       : #0d6efd;
    --bs-body-bg       : #f8f9fa;
    --bs-border-radius : 0.5rem;
}

/* Component-level overrides */
.card {
    --bs-card-border-radius : 1rem;
    --bs-card-spacer-y      : 1.5rem;
    --bs-card-spacer-x      : 1.5rem;
}
```

## Dark Mode (data-bs-theme)

```html
<!-- Toggle at root or any container -->
<html :data-bs-theme="darkMode ? 'dark' : 'light'">

<!-- Or scope to specific components -->
<div data-bs-theme="dark" class="p-4">
    <!-- Dark mode content -->
</div>
```

```css
/* Custom dark mode overrides */
[data-bs-theme="dark"] {
    --custom-bg     : #1a1a2e;
    --custom-text   : #eaeaea;

    .custom-component {
        background : var(--custom-bg);
        color      : var(--custom-text);
    }
}
```

## Bootstrap 5.3+ Features to Leverage

| Feature | Description |
|---------|-------------|
| `data-bs-theme` | Native dark/light mode switching |
| CSS Variables   | Runtime theming without recompilation |
| Color modes     | Automatic component adaptation |
| Utility API     | Extend utilities via Sass (when needed) |
| `color-mix()`   | Dynamic color adjustments |

---

# Vue.js 3.4+ — MODERN PATTERNS

> **Use Composition API with `<script setup>` exclusively.**
> Options API is legacy — Composition API is more type-safe and performant.

## Modern Component Structure

```vue
<script setup lang="ts">
/**
 * UserCard component displays user information with actions.
 *
 * @component
 */

// ============================================================================
// Imports
// ============================================================================
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'; // Vue reactivity
import { useRouter }                                    from 'vue-router'; // Router composable

import type { User } from '@/types'; // Type imports

// ============================================================================
// Props & Emits (Typed)
// ============================================================================

interface Props {
    user         : User;
    showActions? : boolean;
}

const props = withDefaults(defineProps<Props>(), {
    showActions: true
});

const emit = defineEmits<{
    update : [user: User];
    delete : [id: string];
}>();

// ============================================================================
// Reactive State
// ============================================================================
const isLoading  = ref(false);
const isExpanded = ref(false);

// ============================================================================
// Computed Properties
// ============================================================================
const fullName = computed(() => `${props.user.firstName} ${props.user.lastName}`);

const userInitials = computed(() =>
    `${props.user.firstName[0]}${props.user.lastName[0]}`.toUpperCase()
);

// ============================================================================
// Methods
// ============================================================================

/**
 * Handle user update action.
 */
async function handleUpdate(): Promise<void> {
    isLoading.value = true;
    try {
        // API call here
        emit('update', props.user);
    } finally {
        isLoading.value = false;
    }
}

// ============================================================================
// Lifecycle
// ============================================================================
onMounted(() => {
    // Setup code
});

onUnmounted(() => {
    // Cleanup code
});
</script>

<template>
    <article class="card">
        <header class="card-header">
            <h3>{{ fullName }}</h3>
        </header>
        <div class="card-body">
            <slot />
        </div>
        <footer v-if="showActions" class="card-footer">
            <button
                class="btn btn-primary"
                :disabled="isLoading"
                @click="handleUpdate"
            >
                Update
            </button>
        </footer>
    </article>
</template>
```

## Vue 3.4+ Features (REQUIRED)

| Feature | Description | Example |
|---------|-------------|---------|
| `defineModel()` | Two-way binding macro | `const modelValue = defineModel<string>()` |
| Generic components | Type-safe generics | `<script setup lang="ts" generic="T">` |
| `v-bind` shorthand | Same-name binding | `:id` instead of `:id="id"` |
| Improved hydration | Better SSR mismatches | Automatic |

```vue
<script setup lang="ts">
// defineModel — Vue 3.4+ two-way binding
const searchQuery = defineModel<string>('search', { default: '' });
const isOpen      = defineModel<boolean>({ default: false });

// Generic components — Vue 3.3+
</script>

<script setup lang="ts" generic="T extends { id: string }">
import type { PropType } from 'vue';

const props = defineProps<{
    items    : T[];
    selected : T | null;
}>();

const emit = defineEmits<{
    select: [item: T];
}>();
</script>
```

## Composables Pattern

```typescript
// composables/useAsync.ts
import { ref, type Ref } from 'vue';

interface UseAsyncReturn<T> {
    data      : Ref<T | null>;
    error     : Ref<Error | null>;
    isLoading : Ref<boolean>;
    execute   : () => Promise<void>;
}

/**
 * Composable for async operations with loading/error state.
 *
 * @param   asyncFn - Async function to execute
 * @returns         - Reactive state and execute function
 */
export function useAsync<T>(asyncFn: () => Promise<T>): UseAsyncReturn<T> {
    const data      = ref<T | null>(null) as Ref<T | null>;
    const error     = ref<Error | null>(null);
    const isLoading = ref(false);

    async function execute(): Promise<void> {
        isLoading.value = true;
        error.value     = null;
        try {
            data.value = await asyncFn();
        } catch (e) {
            error.value = e instanceof Error ? e : new Error(String(e));
        } finally {
            isLoading.value = false;
        }
    }

    return { data, error, isLoading, execute };
}
```

```vue
<script setup lang="ts">
import { useAsync } from '@/composables/useAsync';
import { fetchUsers } from '@/api/users';

const { data: users, isLoading, error, execute: loadUsers } = useAsync(fetchUsers);

onMounted(loadUsers);
</script>
```

## Vue.js Deprecations — AVOID THESE

| ❌ Legacy (Never Use) | ✅ Modern (Use This) |
|-----------------------|----------------------|
| Options API (`data()`, `methods`) | Composition API + `<script setup>` |
| `this.$refs` | `ref()` + template ref |
| `this.$emit` | `defineEmits()` |
| `.native` modifier | Remove (events pass through) |
| `v-on:keyup.enter` | `@keyup.enter` |
| Mixins | Composables |
| `Vue.prototype` | `app.config.globalProperties` or provide/inject |

---

# HTML5 — SEMANTIC & ACCESSIBLE

## Semantic Elements (REQUIRED)

```html
<body>
    <header>
        <nav aria-label="Main navigation">
            <!-- Navigation -->
        </nav>
    </header>

    <main id="main-content">
        <section aria-labelledby="dashboard-heading">
            <h1 id="dashboard-heading">Dashboard</h1>

            <article class="card">
                <!-- Self-contained content -->
            </article>
        </section>

        <aside aria-label="Related content">
            <!-- Supplementary content -->
        </aside>
    </main>

    <footer>
        <!-- Footer content -->
    </footer>
</body>
```

## ARIA Patterns

```html
<!-- Loading states -->
<div v-if="isLoading" role="status" aria-live="polite">
    <span class="spinner-border" aria-hidden="true"></span>
    <span class="visually-hidden">Loading...</span>
</div>

<!-- Dynamic regions -->
<div aria-live="polite" aria-atomic="true">
    {{ statusMessage }}
</div>

<!-- Icon buttons -->
<button type="button" aria-label="Close dialog" @click="close">
    <i class="bi-x-lg" aria-hidden="true"></i>
</button>

<!-- Form validation -->
<input
    id="email"
    v-model="email"
    type="email"
    :aria-invalid="!!errors.email"
    :aria-describedby="errors.email ? 'email-error' : undefined"
>
<span v-if="errors.email" id="email-error" role="alert">
    {{ errors.email }}
</span>
```

## HTML Attribute Order (Vue Components)

1. `id`
2. `class`
3. `v-if` / `v-show` / `v-for`
4. `v-model`
5. `:` (v-bind)
6. `@` (v-on)
7. Standard attributes
8. ARIA attributes

```html
<input
    id="searchInput"
    class="form-control"
    v-model="searchQuery"
    :disabled="isLoading"
    @input="handleSearch"
    type="search"
    placeholder="Search..."
    aria-label="Search items"
    aria-describedby="search-help"
>
```

---

# Modern Features Reference

## CSS (2024)

| Feature | Support | Use Case |
|---------|---------|----------|
| Native Nesting | ✅ All modern | Replace Sass nesting |
| Container Queries | ✅ All modern | Component-responsive design |
| `:has()` | ✅ All modern | Parent selection |
| `@layer` | ✅ All modern | Specificity management |
| `color-mix()` | ✅ All modern | Dynamic colors |
| `@scope` | 🟡 Partial | Scoped styles (Chrome) |
| Anchor Positioning | 🟡 Partial | Popover positioning |

## Vue.js 3.4+

| Feature | Version | Description |
|---------|---------|-------------|
| `defineModel()` | 3.4+ | Simplified v-model |
| Generic components | 3.3+ | Type-safe generics |
| `v-bind` shorthand | 3.4+ | Same-name binding |
| Suspense (stable) | 3.3+ | Async component loading |
| Teleport | 3.0+ | Portal rendering |

## Bootstrap 5.3+

| Feature | Description |
|---------|-------------|
| `data-bs-theme` | Color mode switching |
| CSS Variables | Runtime customization |
| Color modes | Auto light/dark |
| `color-mode()` mixin | Sass color mode helpers |