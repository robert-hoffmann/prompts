---
applyTo: "*.html, *.css, *.vue"
---
# Modern Web Development Standards

Expert in **Vue 3.5+** (Composition API), **TypeScript**, **CSS3**, and **Bootstrap 5.3+**.

## Core Stack & Libraries

**Framework:**
- Vue 3.5+ with `<script setup>` + TypeScript
- Official libs only: Vue Router, Pinia, VueUse
- Approved 3rd party: Chart.js

**Styling:**
- Bootstrap 5.3+ (forms, validation, components)
- Modern CSS3 (nesting, variables, container queries)
- Custom styles only when Bootstrap insufficient

**JavaScript:**
- TypeScript with advanced features
- Modern ES features (we compile anyway)

## Code Formatting & Alignment

**Object & Property Alignment:**
- Align object properties and values to the longest key
- Align CSS properties to the longest property name
- Align variable declarations for related values
- Use consistent spacing for visual clarity

```typescript
// ✅ Aligned object properties
const config = {
    apiEndpoint      : '/api/v1/users',
    timeout          : 5000,
    retryAttempts    : 3,
    enableLogging    : true,
    maxResponseSize  : 1024 * 1024
};

// ✅ Aligned variable declarations
const firstName     = 'John';
const lastName      = 'Doe';
const emailAddress  = 'john.doe@example.com';
const isActive      = true;

// ✅ Aligned interface properties
interface UserConfig {
    id              : number;
    username        : string;
    email           : string;
    isAdmin         : boolean;
    lastLogin       : Date | null;
    preferences     : Record<string, any>;
}

// ✅ Aligned array/list formatting
const requiredFields = [
    'username',
    'email',
    'password',
    'confirmPassword',
    'acceptTerms'
];
```

```css
/* ✅ Aligned CSS properties */
.custom-card {
    padding          : 1.5rem;
    margin-bottom    : 2rem;
    border-radius    : 8px;
    background-color : var(--bs-white);
    box-shadow       : 0 2px 4px rgba(0, 0, 0, 0.1);
}
```

**Import Organization:**
- Group imports logically (Vue/framework, libraries, local)
- Add inline comments explaining purpose of custom imports
- Align import groups with blank lines

```typescript
// Vue core imports
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

// Store and composables
import { useAuthStore } from '@/stores/auth';      // User authentication state
import { useToast } from '@/composables/toast';    // Toast notification system

// Components
import UserCard from '@/components/UserCard.vue';  // User profile display component
```

## Documentation Requirements

**Comprehensive Documentation:**
- JSDoc comments for all functions, interfaces, and complex types
- Inline comments throughout code explaining logic and business rules
- Document component props, emits, and exposed methods
- Add `// INFO:` or `// IMPORTANT:` for critical business logic

```typescript
/**
 * Fetches user data from the API with retry logic
 *
 * @param userId - The unique identifier of the user
 * @param options - Optional configuration for the request
 * @returns Promise resolving to user data or null if not found
 *
 * @example
 * const user = await fetchUserData(123, { includeDetails: true });
 */
async function fetchUserData(
        userId  : number,
        options?: { includeDetails?: boolean }
    ): Promise<User | null> {

    // IMPORTANT: Retry logic handles temporary network failures
    const maxRetries = 3;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            // INFO: API returns 404 for non-existent users (not an error)
            const response = await api.get(`/users/${userId}`, options);
            return response.data;
        } catch (error) {
            // Log attempt but continue retrying
            console.warn(`Attempt ${attempt + 1} failed:`, error);
        }
    }

    return null; // All retries exhausted
}
```

## Vue Component Structure

```vue
<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useMyStore } from '@/stores/myStore';  // Application state management

// Props with defaults and validation
interface Props {
    data     : Record<string, any>;
    size?    : 'sm' | 'md' | 'lg';
    disabled?: boolean;
    items?   : string[];
}

const props = withDefaults(defineProps<Props>(), {
    size     : 'md',
    disabled : false,
    items    : () => []
});

// Emits with typed payloads
const emit = defineEmits<{
    update    : [key: string, value: any];
    delete    : [id: number];
    'sort-by' : [field: string, order: 'asc' | 'desc'];
}>();

const store  = useMyStore();
const router = useRouter();
const count  = ref<number>(0);

const doubled = computed(() => count.value * 2);

/**
 * Handles data fetch and emits update event
 *
 * IMPORTANT: This triggers a store refresh which may affect other components
 */
async function handleAction() {
    try {
        // INFO: Store.fetchData() validates data before updating state
        await store.fetchData();
        emit('update', 'status', 'success');
    } catch (error) {
        console.error('Error:', error);
        emit('update', 'status', 'error');
    }
}

function handleSort(field: string) {
    emit('sort-by', field, 'asc');
}
</script>

<template>
    <div class="container">
        <form class="needs-validation" novalidate>
            <div class="mb-3">
                <label for="input" class="form-label">Input</label>
                <input
                    id="input"
                    v-model="count"
                    type="number"
                    class="form-control"
                    :class="`form-control-${props.size}`"
                    :disabled="props.disabled"
                    required
                >
                <div class="invalid-feedback">Required field</div>
            </div>
            <button @click="handleAction" class="btn btn-primary">
                Submit
            </button>
        </form>
    </div>
</template>

<style scoped>
.container {
    --card-padding : 1rem;

    padding : var(--card-padding);

    .custom-card {
        border-radius : 8px;

        &:hover {
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        @container (min-width: 400px) {
            display: grid;
        }
    }
}
</style>
```

## Key Principles

**Vue:**
- Always `<script setup lang="ts">`
- Use `withDefaults()` for optional props
- Type all refs: `ref<boolean>(false)`
- Typed emits with payload signatures
- Align properties with spaces
- Use official Vue libraries (Router, Pinia)
- VueUse for composables when needed

**CSS:**
- Bootstrap 5.3+ first (especially forms/validation)
- Modern nesting, variables, `:is()`, `:where()`, `@container`
- Align properties to longest name
- Custom styles only when Bootstrap lacks feature

**TypeScript:**
- Use advanced features (decorators, satisfies, etc)
- Explicit types everywhere
- Modern ES syntax (optional chaining, nullish coalescing)
- JSDoc for all public functions

**HTML:**
- Semantic elements (`<nav>`, `<main>`, `<article>`)
- ARIA for accessibility
- Bootstrap classes for layout/components

## Quick Patterns

```vue
<!-- Advanced Props & Emits -->
<script setup lang="ts">
interface User {
    id   : number;
    name : string;
}

interface Props {
    users       : User[];
    title?      : string;
    maxItems?   : number;
    loading?    : boolean;
    sortable?   : boolean;
    filterFn?   : (user: User) => boolean;
}

const props = withDefaults(defineProps<Props>(), {
    title    : 'User List',
    maxItems : 10,
    loading  : false,
    sortable : true,
    filterFn : () => true
});

const emit = defineEmits<{
    select       : [user: User];
    'update:sort': [field: keyof User, direction: 'asc' | 'desc'];
    delete       : [userId: number];
}>();

/**
 * Handles user selection and emits select event
 * @param user - The selected user object
 */
function handleUserClick(user: User) {
    emit('select', user);
}
</script>

<!-- Bootstrap Form with Validation -->
<template>
    <form class="needs-validation" novalidate>
        <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input
                id="email"
                v-model="email"
                type="email"
                class="form-control"
                :class="{ 'is-invalid': errors.email }"
                required
            >
            <div class="invalid-feedback">{{ errors.email }}</div>
        </div>
    </form>
</template>

<!-- Modern CSS -->
<style scoped>
.card {
    --border-radius : 8px;

    border-radius : var(--border-radius);

    &:has(.error) {
        border-left: 3px solid var(--bs-danger);
    }

    @media (prefers-color-scheme: dark) {
        background: var(--bs-dark);
    }
}
</style>

<!-- TypeScript Advanced -->
<script setup lang="ts">
const config = {
    theme : 'dark',
    items : []
} satisfies AppConfig;

const data = ref<User[]>([]);
const name = user?.profile?.name ?? 'Guest';
</script>
```

## Checklist

- ✅ Use Bootstrap components/utilities first
- ✅ Use `withDefaults()` for optional props
- ✅ Type all Vue refs/props/emits explicitly
- ✅ Align object/CSS properties to longest key/name
- ✅ Add JSDoc for all functions and complex types
- ✅ Include inline comments for business logic
- ✅ Group and comment imports logically
- ✅ Modern CSS (nesting, variables, container queries)
- ✅ Official Vue libs only (+ Chart.js, VueUse)
- ✅ ARIA attributes for accessibility
- ✅ Handle async errors with try/catch