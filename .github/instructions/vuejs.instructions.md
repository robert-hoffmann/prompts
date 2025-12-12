---
applyTo: "*.html,*.css,*.vue"
---

# Modern Web Development Standards

You are an expert in modern web development specializing in HTML5, Vue.js 3, CSS3, and Bootstrap 5.3+.

## Core Technologies

- **HTML5**          : Semantic markup, accessibility (ARIA), modern APIs
- **Vue.js 3**       : Composition API, reactive data, component architecture
- **CSS3**           : Modern features including nesting, custom properties, container queries
- **Bootstrap 5.3+** : Utility classes, component customization, dark mode support

---

## Focus Areas

- Clean, semantic HTML5 markup
- Modern CSS features (nesting, custom properties, container queries)
- Vue.js 3 Composition API patterns
- Accessibility (ARIA) compliance
- Responsive, mobile-first design
- Performance and maintainability

---

## CSS Organization & Architecture

### CSS Nesting (Modern Syntax)

- **ALWAYS use modern CSS nesting** for better organization and readability
- Nest related selectors logically to mirror HTML structure
- Use `&` for pseudo-classes, pseudo-elements, and modifier classes
- Keep nesting depth reasonable (max 3-4 levels) for maintainability

```css
/* ✅ GOOD - Modern CSS Nesting */
.card {
    padding       : 1rem;
    border-radius : 8px;

    &:hover {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .card-header {
        font-weight   : bold;
        margin-bottom : 0.5rem;

        &.primary {
            color: var(--bs-primary);
        }
    }

    .card-body {
        line-height: 1.6;

        p {
            margin-bottom: 1rem;

            &:last-child {
                margin-bottom: 0;
            }
        }
    }
}

/* ✅ GOOD - Media queries nested */
.container {
    padding: 1rem;

    @media (min-width: 768px) {
        padding: 2rem;
    }

    @media (min-width: 1200px) {
        padding   : 3rem;
        max-width : 1140px;
    }
}
```

### CSS Property Ordering

Within each rule, order properties logically:

1. **Layout**     (display, position, top/right/bottom/left, z-index)
2. **Box Model**  (width, height, margin, padding, border)
3. **Typography** (font-*, line-height, text-*, letter-spacing)
4. **Visual**     (background, color, box-shadow, opacity)
5. **Animation**  (transition, animation, transform)

```css
.example {
    /* Layout */
    display  : flex;
    position : relative;
    z-index  : 10;

    /* Box Model */
    width         : 100%;
    max-width     : 1200px;
    margin        : 0 auto;
    padding       : 2rem;
    border        : 1px solid var(--bs-border-color);
    border-radius : var(--border-radius);

    /* Typography */
    font-size   : 1rem;
    font-weight : 400;
    line-height : 1.6;
    text-align  : center;

    /* Visual */
    background : var(--bs-body-bg);
    color      : var(--bs-body-color);
    box-shadow : 0 2px 4px rgba(0, 0, 0, 0.1);

    /* Animation */
    transition: all 0.3s ease;
}
```

### CSS Custom Properties (Variables)

```css
:root {
    /* Color palette */
    --primary-color   : #0d6efd;
    --secondary-color : #6c757d;
    --success-color   : #198754;
    --danger-color    : #dc3545;

    /* Spacing */
    --spacing-xs : 0.25rem;
    --spacing-sm : 0.5rem;
    --spacing-md : 1rem;
    --spacing-lg : 2rem;

    /* Transitions */
    --transition-fast   : 0.15s;
    --transition-normal : 0.3s;
    --transition-slow   : 0.5s;

    /* Border radius */
    --border-radius: 8px;
}

.component {
    padding    : var(--spacing-md);
    color      : var(--primary-color);
    transition : all var(--transition-normal) ease;
}
```

---

## CSS Structure Example

```css
/* ============================================================================
   GLOBAL VARIABLES & CUSTOM PROPERTIES
   ============================================================================ */

:root {
    --primary-color   : #0d6efd;
    --secondary-color : #6c757d;
    --border-radius   : 8px;
    --transition-speed: 0.3s;
}

/* ============================================================================
   NAVIGATION & HEADER
   ============================================================================ */

.navbar {
    padding    : 1rem;
    background : var(--primary-color);

    .navbar-brand {
        display     : flex;
        align-items : center;
        gap         : 0.5rem;
        font-weight : bold;

        &:hover {
            opacity: 0.9;
        }
    }

    .navbar-nav {
        display : flex;
        gap     : 1rem;

        .nav-item {
            position: relative;

            &.active .nav-link {
                color            : white;
                background-color : rgba(255, 255, 255, 0.1);
            }
        }
    }
}

/* ============================================================================
   FORMS & INPUTS
   ============================================================================ */

.form-control {
    border-radius : var(--border-radius);
    transition    : all var(--transition-speed) ease;

    &:focus {
        border-color : var(--primary-color);
        box-shadow   : 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
    }

    &.is-invalid {
        border-color: var(--bs-danger);

        &:focus {
            box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.25);
        }
    }
}

/* ============================================================================
   TABLES & DATA DISPLAY
   ============================================================================ */

.table {
    border-collapse : separate;
    border-spacing  : 0;

    thead {
        background : var(--bs-light);
        position   : sticky;
        top        : 0;
        z-index    : 10;

        th {
            font-weight   : 600;
            border-bottom : 2px solid var(--bs-border-color);
            padding       : 0.75rem 1rem;

            &.sortable {
                cursor: pointer;

                &:hover {
                    background: var(--bs-secondary-bg);
                }
            }
        }
    }

    tbody tr {
        transition: background-color 0.2s ease;

        &:hover {
            background-color: var(--bs-light);
        }

        &.selected {
            background-color: var(--bs-primary-bg-subtle);
        }

        td {
            padding        : 0.75rem 1rem;
            vertical-align : middle;
        }
    }
}

/* ============================================================================
   DARK MODE OVERRIDES
   ============================================================================ */

[data-bs-theme="dark"] {
    .navbar {
        background: var(--bs-dark);

        .navbar-brand {
            color: var(--bs-light);
        }
    }

    .table thead {
        background: var(--bs-dark);

        th {
            border-color : var(--bs-border-color);
            color        : var(--bs-light);
        }
    }

    .table tbody tr:hover {
        background-color: rgba(255, 255, 255, 0.05);
    }
}
```

---

## Modern CSS Features to Leverage

### Container Queries

```css
.card-container {
    container-type : inline-size;
    container-name : card;

    .card {
        padding: 1rem;

        @container card (min-width: 400px) {
            display               : grid;
            grid-template-columns : 1fr 2fr;
            gap                   : 2rem;
        }
    }
}
```

### Modern Selectors

```css
/* :is() for grouping */
:is(h1, h2, h3, h4, h5, h6) {
    font-weight : 600;
    line-height : 1.2;
    margin-top  : 0;
}

/* :where() for zero-specificity */
:where(.btn) {
    padding       : 0.5rem 1rem;
    border-radius : 0.25rem;
}

/* :has() for parent selection */
.form-group:has(.is-invalid) {
    border-left: 3px solid var(--bs-danger);
}
```

---

## HTML5 Best Practices

### Semantic Markup

Use appropriate semantic elements for better accessibility and SEO:

```html
<!-- ✅ GOOD - Semantic HTML -->
<nav class="navbar navbar-expand-lg">
    <div class="container-fluid">
        <a class="navbar-brand" href="#">App Name</a>
        <button class="navbar-toggler" type="button">
            <span class="navbar-toggler-icon"></span>
        </button>
    </div>
</nav>

<main class="container">
    <section class="data-section">
        <header>
            <h1>Dashboard</h1>
            <p class="lead">Overview of your data</p>
        </header>

        <article class="data-table">
            <!-- Table content -->
        </article>
    </section>
</main>

<footer class="bg-dark text-light py-3">
    <div class="container">
        <p>&copy; 2025 Company Name</p>
    </div>
</footer>
```

### HTML Attribute Ordering

Use proper attribute ordering for consistency:
1. `id`
2. `class`
3. `v-*` (Vue directives)
4. `@` (Vue event handlers)
5. Other attributes

```html
<input
    id="searchInput"
    class="form-control"
    v-model="filters.search"
    @input="handleSearch"
    type="text"
    placeholder="Search..."
    aria-describedby="searchHelp"
>
```

---

## Accessibility (ARIA)

### Loading Indicators

```html
<div v-if="loading" role="status" aria-live="polite">
    <span class="spinner-border" aria-hidden="true"></span>
    <span class="visually-hidden">Loading data...</span>
</div>
```

### Form Inputs

```html
<div class="mb-3">
    <label for="searchInput" class="form-label">Search</label>
    <input
        id="searchInput"
        class="form-control"
        v-model="filters.search"
        type="text"
        placeholder="Enter search term"
        aria-describedby="searchHelp"
    >
    <small id="searchHelp" class="form-text">
        Search by name, category, or description
    </small>
</div>
```

### Buttons with Icons

```html
<button
    type="button"
    class="btn btn-primary"
    @click="refresh"
    aria-label="Refresh data"
>
    <i class="bi-arrow-clockwise" aria-hidden="true"></i>
    Refresh
</button>
```

---

## Vue.js 3 Best Practices

### Component Structure

```javascript
const { createApp } = Vue;

createApp({
    data() {
        return {
            // Group related state
            filters: {
                search   : '',
                category : 'all',
                sortBy   : 'date'
            },

            // UI state
            loading     : false,
            darkMode    : localStorage.getItem('darkMode') === 'true',
            showFilters : true,

            // Data
            items      : [],
            totalItems : 0
        };
    },

    computed: {
        filteredItems() {
            return this.items.filter(item => {
                // Filter logic with clear comments
                const matchesSearch = item.name.toLowerCase()
                    .includes(this.filters.search.toLowerCase());

                const matchesCategory = this.filters.category === 'all'
                    || item.category === this.filters.category;

                return matchesSearch && matchesCategory;
            });
        },

        sortedItems() {
            // Sort filtered items based on selected criteria
            return [...this.filteredItems].sort((a, b) => {
                switch (this.filters.sortBy) {
                    case 'date':
                        return new Date(b.date) - new Date(a.date);
                    case 'name':
                        return a.name.localeCompare(b.name);
                    default:
                        return 0;
                }
            });
        }
    },

    methods: {
        /**
         * Load data from API endpoint
         * Handles loading state and error management
         */
        async loadData() {
            this.loading = true;
            try {
                const response  = await axios.get('/api/data');
                this.items      = response.data.items;
                this.totalItems = response.data.total;
            } catch (error) {
                console.error('Error loading data:', error);
                this.showError('Failed to load data. Please try again.');
            } finally {
                this.loading = false;
            }
        },

        /**
         * Toggle dark mode and persist preference
         */
        toggleDarkMode() {
            this.darkMode = !this.darkMode;
            localStorage.setItem('darkMode', this.darkMode);
        },

        /**
         * Display error message to user
         * @param {string} message - Error message to display
         */
        showError(message) {
            // Implementation for error display
            alert(message);
        }
    },

    mounted() {
        // Initialize component when mounted
        this.loadData();

        // Set up any event listeners or subscriptions
        window.addEventListener('resize', this.handleResize);
    },

    beforeUnmount() {
        // Clean up event listeners
        window.removeEventListener('resize', this.handleResize);
    }
}).mount('#app');
```

### Vue.js Code Organization

- **Group related data properties** logically (filters, UI state, data)
- **Use computed properties** for derived state instead of methods when possible
- **Add JSDoc comments** to methods explaining their purpose and parameters
- **Handle async operations** with proper error handling and loading states
- **Clean up resources** in lifecycle hooks (event listeners, timers, etc.)
- **Use meaningful variable names** that clearly indicate purpose
- **Align object properties** with consistent spacing

---

## Bootstrap 5.3+ Integration

### Dark Mode Toggle

```html
<!-- Dark mode toggle with Bootstrap -->
<div :data-bs-theme="darkMode ? 'dark' : 'light'">
    <!-- Bootstrap components automatically adapt -->
    <button class="btn btn-primary" @click="toggleDarkMode">
        <i :class="darkMode ? 'bi-sun' : 'bi-moon'"></i>
        Toggle Theme
    </button>
</div>
```

### Best Practices

- Leverage Bootstrap's CSS custom properties for theming
- Use utility classes for rapid prototyping
- Customize via CSS variables rather than Sass when possible
- Implement dark mode using `data-bs-theme` attribute

---

## Code Quality Standards

### HTML

- Use semantic HTML5 elements appropriately
- Include proper ARIA attributes for accessibility
- Keep markup clean and properly indented (2 or 4 spaces consistently)
- Use Vue directives appropriately (`v-if`, `v-for`, `v-bind`, `v-model`, `v-on`/`@`)
- Add `:key` bindings for `v-for` loops

### CSS

- **Use CSS custom properties** for maintainable theming
- **Implement responsive design** with mobile-first approach
- **Leverage modern CSS features** (nesting, `:is()`, `:where()`, container queries, `@layer`)
- **Avoid `!important`** unless absolutely necessary (document why if used)
- **Use meaningful class names** (BEM or similar methodology)
- **Always use nesting** for related selectors and modifiers
- **Align properties** for improved readability

### JavaScript/Vue

- Use modern ES6+ syntax (arrow functions, destructuring, async/await, template literals)
- Handle errors gracefully with try/catch blocks
- Implement loading states for async operations
- Use Vue reactivity system efficiently (avoid unnecessary re-renders)
- Add JSDoc comments to explain complex logic and method purposes
- Use `const` and `let` appropriately (prefer `const` when possible)
- Align object properties with consistent spacing

---

## Important Best Practices Summary

| # | Principle | Description |
|---|-----------|-------------|
| 1 | **Semantic HTML** | Use appropriate elements (`<nav>`, `<main>`, `<article>`, etc.) |
| 2 | **Accessibility** | Include ARIA labels, proper focus management, keyboard navigation |
| 3 | **CSS Nesting** | Use modern CSS nesting for organization and readability |
| 4 | **Custom Properties** | Use CSS variables for maintainable theming |
| 5 | **Mobile-first** | Design for mobile, enhance for larger screens |
| 6 | **Performance** | Minimize re-renders, use efficient selectors |
| 7 | **Dark Mode** | Support `data-bs-theme` for Bootstrap integration |
| 8 | **Vue Best Practices** | Computed properties, lifecycle cleanup, error handling |
| 9 | **Property Alignment** | Align CSS properties and JS object values for readability |
| 10 | **Documentation** | Comment complex logic, use JSDoc for methods |
