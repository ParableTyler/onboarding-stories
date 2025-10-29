# Svelte + bits-ui Integration Form Generator

A frontend-only implementation of GraphQL-based integration form generation using Svelte and [bits-ui](https://bits-ui.com).

## Features

✅ **Svelte + bits-ui** - Modern UI components  
✅ **GraphQL Schema** - Type-safe form definitions  
✅ **Dynamic Form Rendering** - Forms generated from plugin definitions  
✅ **Multiple Variants** - Support for OAuth, API Key, etc.  
✅ **Built-in Validation** - Email, URL, hostname, etc.  
✅ **Markdown Documentation** - Inline setup guides  
✅ **Dark Mode** - Full dark mode support  
✅ **No Backend Required** - Client-side only (for now)

## Quick Start

```bash
cd svelte-frontend

# Install dependencies
npm install

# Start dev server
npm run dev

# Open browser
open http://localhost:3000
```

## Project Structure

```
svelte-frontend/
├── src/
│   ├── components/
│   │   ├── PluginList.svelte              # Plugin selection grid
│   │   ├── IntegrationFormCard.svelte     # Main form with tabs
│   │   ├── VariantForm.svelte             # Form renderer per variant
│   │   └── fields/
│   │       ├── FieldRenderer.svelte       # Field type router
│   │       ├── StringInput.svelte         # String/hostname fields
│   │       ├── SecretInput.svelte         # Password fields
│   │       ├── EmailInput.svelte          # Email with validation
│   │       ├── URLInput.svelte            # URL with validation
│   │       ├── SelectInput.svelte         # Dropdown (bits-ui)
│   │       ├── MultiSelectInput.svelte    # Multi-select (bits-ui)
│   │       ├── BooleanInput.svelte        # Toggle switch (bits-ui)
│   │       └── MarkdownDisplay.svelte     # Inline docs
│   │
│   ├── stores/
│   │   └── pluginStore.ts                 # Svelte stores for state
│   │
│   ├── data/
│   │   └── plugins.ts                     # Plugin definitions (mock data)
│   │
│   ├── types/
│   │   └── index.ts                       # TypeScript types
│   │
│   ├── App.svelte                         # Main app component
│   ├── main.ts                            # Entry point
│   └── app.css                            # Global styles (Tailwind)
│
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## How It Works

### 1. Plugin Definitions

Plugins are defined in `src/data/plugins.ts`:

```typescript
{
  id: 'salesforce',
  name: 'Salesforce',
  variants: [
    {
      id: 'salesforce-oauth',
      name: 'OAuth 2.0',
      formFields: [
        {
          __typename: 'HostnameField',
          key: 'subdomain',
          label: 'Salesforce Subdomain',
          required: true,
        },
        // ... more fields
      ],
      testConfig: { /* test connection config */ }
    }
  ]
}
```

### 2. Dynamic Form Rendering

The `FieldRenderer` component switches on `field.__typename`:

```svelte
{#if field.__typename === 'StringField'}
  <StringInput {field} {value} {error} on:change />
  
{:else if field.__typename === 'SecretField'}
  <SecretInput {field} {value} {error} on:change />
  
{:else if field.__typename === 'SelectField'}
  <SelectInput {field} {value} {error} on:change />
```

### 3. bits-ui Components

Using bits-ui for enhanced UI:

- **Select** - Dropdown menus with search
- **Switch** - Toggle switches for booleans
- **Checkbox** - Multi-select with checkboxes
- **Tabs** - Variant tabs (OAuth vs API Key)

### 4. Validation

Built-in validation for each field type:

```typescript
// Email validation
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// URL validation
try {
  new URL(value);
} catch {
  error = 'Invalid URL';
}

// Hostname validation
const hostnameRegex = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/;
```

## Adding New Plugins

1. **Add plugin definition** to `src/data/plugins.ts`:

```typescript
export const plugins: Plugin[] = [
  // ... existing plugins
  {
    id: 'google-workspace',
    name: 'Google Workspace',
    description: 'Connect to Google Workspace...',
    icon: '📧',
    category: 'Productivity',
    enabled: true,
    documentationPath: '/docs/integrations/google/index.md',
    variants: [
      {
        id: 'google-oauth',
        name: 'OAuth 2.0',
        authMethod: 'OAUTH2',
        recommended: true,
        formFields: [
          // Define your fields here
        ],
        testConfig: { /* ... */ }
      }
    ]
  }
];
```

2. **Create documentation** at `../docs/integrations/google/oauth.md`

3. **Done!** The form will automatically render

## Customizing Styles

### Tailwind Classes

Edit component styles directly in `.svelte` files:

```svelte
<button class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg">
  Click Me
</button>
```

### Dark Mode

Dark mode classes are automatically applied:

```svelte
<div class="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
  Content
</div>
```

Toggle dark mode by adding `class="dark"` to `<html>` element.

## Future Enhancements

### Parse GraphQL Schema Files

Instead of hardcoding plugins in TypeScript, parse actual GraphQL schema files:

```typescript
import { parse } from 'graphql';
import schemaFile from '../integration-schema.graphql?raw';

const schema = parse(schemaFile);
// Extract plugin definitions from schema
```

### Add Backend Integration

When ready to add server-side logic:

1. Set up GraphQL server
2. Replace mock data with actual queries
3. Implement connection testing
4. Add credential encryption
5. Save configurations to database

### Additional Field Types

Add support for:
- Date pickers
- File uploads
- Array inputs (tags)
- Conditional fields (show/hide based on other fields)

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ⚠️ IE11 (not supported)

## Dependencies

| Package | Purpose |
|---------|---------|
| `svelte` | Framework |
| `bits-ui` | UI component library |
| `vite` | Build tool |
| `tailwindcss` | Styling |
| `marked` | Markdown rendering |
| `graphql` | Schema parsing (future) |

## Development

```bash
# Install dependencies
npm install

# Start dev server (hot reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type check
npm run check
```

## Troubleshooting

### "Cannot find package 'bits-ui'"

**Solution:** Install dependencies:
```bash
npm install
```

### Styles not loading

**Solution:** Make sure Tailwind is configured:
```bash
# Check postcss.config.js exists
# Check tailwind.config.js exists
# Restart dev server
```

### Dark mode not working

**Solution:** Add class to HTML:
```javascript
// In your app initialization
if (localStorage.theme === 'dark') {
  document.documentElement.classList.add('dark');
}
```

## License

MIT

## Related

- [bits-ui Documentation](https://bits-ui.com)
- [Svelte Documentation](https://svelte.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [GraphQL](https://graphql.org)

---

Built with ❤️ using Svelte, bits-ui, and TailwindCSS

