# Quick Start (2 minutes)

Get the Svelte form generator running instantly!

## Installation

```bash
cd /Users/tylermills/Parable/scripts/transcripts/svelte-frontend

# Install dependencies
npm install
```

This installs:
- ✅ Svelte 4.x
- ✅ bits-ui components
- ✅ Vite build tool
- ✅ TailwindCSS
- ✅ TypeScript

## Run

```bash
npm run dev
```

Expected output:
```
  VITE v5.0.0  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

## Open Browser

Visit: **http://localhost:3000**

You should see:
1. **Integration Setup** page
2. **Salesforce** card with OAuth 2.0 and API Key options
3. Click Salesforce to see the dynamic form

## Try It Out

### Test OAuth 2.0 Flow

1. **Click** on Salesforce card
2. **OAuth 2.0 tab** should be active (recommended)
3. **Fill in the form**:
   - Subdomain: `mycompany`
   - Client ID: `3MVG9test123`
   - Client Secret: `secret456`
   - Callback URL: (pre-filled)
   - Environment: `production`
   - Sandbox Mode: toggle on/off

4. **Click "Test Connection"** → See success message
5. **Click "Save Configuration"** → See alert (mock)

### Test API Key Flow

1. **Click** "API Key" tab
2. **Fill in different fields**:
   - Subdomain: `mycompany`
   - Username: `admin@company.com`
   - Security Token: `token123`
   - Stakeholder Emails: (optional)
   - API Scopes: Select multiple options

3. **Test & Save**

### Test Validation

1. **Leave required field empty** → Red error appears
2. **Enter invalid email** → "Invalid email format"
3. **Enter invalid URL** → "Invalid URL format"
4. **Fields validate on input**

## What You're Seeing

### Plugin List
- Grid of available integrations
- Category badges
- Click to open form

### Integration Form
- **Tabs** for different auth methods (OAuth, API Key)
- **★ Recommended** badge on best option
- **Dynamic fields** based on variant selected
- **Inline markdown** help text
- **Test connection** button
- **Documentation links**

### bits-ui Components
- **Tabs** - Variant switcher
- **Select** - Dropdown menus
- **Switch** - Toggle switches
- **Checkbox** - Multi-select

## File Structure

```
src/
├── App.svelte              ← Main app
├── components/
│   ├── PluginList.svelte       ← Plugin grid
│   ├── IntegrationFormCard.svelte  ← Form wrapper
│   ├── VariantForm.svelte      ← Form logic
│   └── fields/              ← Field components
│       ├── FieldRenderer.svelte
│       ├── StringInput.svelte
│       ├── SecretInput.svelte
│       ├── EmailInput.svelte
│       ├── URLInput.svelte
│       ├── SelectInput.svelte (bits-ui)
│       ├── MultiSelectInput.svelte (bits-ui)
│       ├── BooleanInput.svelte (bits-ui)
│       └── MarkdownDisplay.svelte
│
├── stores/
│   └── pluginStore.ts       ← Svelte stores
│
├── data/
│   └── plugins.ts           ← Plugin definitions
│
└── types/
    └── index.ts             ← TypeScript types
```

## Customizing

### Add a New Plugin

Edit `src/data/plugins.ts`:

```typescript
export const plugins: Plugin[] = [
  // ... existing plugins
  {
    id: 'slack',
    slug: 'slack',
    name: 'Slack',
    description: 'Connect to Slack for notifications',
    icon: '💬',
    category: 'Communication',
    enabled: true,
    documentationPath: '/docs/integrations/slack/index.md',
    variants: [
      {
        id: 'slack-oauth',
        name: 'OAuth 2.0',
        authMethod: 'OAUTH2',
        recommended: true,
        formFields: [
          {
            __typename: 'StringField',
            id: 'slack-workspace',
            key: 'workspace',
            label: 'Workspace Name',
            required: true,
            widget: 'TEXT_INPUT',
            mode: 'READ_WRITE',
          },
          // ... more fields
        ],
        testConfig: {
          id: 'slack-test',
          method: 'HTTP_GET',
          endpoint: 'https://slack.com/api/auth.test',
          timeoutMs: 5000,
          expectedResponse: {
            successMessage: '✓ Connected to Slack',
            failureMessage: '✗ Connection failed',
          },
        },
      },
    ],
  },
];
```

Save the file → Refresh browser → See your new plugin!

### Change Styling

All components use Tailwind classes. Example:

```svelte
<!-- Change button color from blue to green -->
<button class="bg-green-600 hover:bg-green-700 text-white">
  Save
</button>
```

### Add Dark Mode Toggle

In `App.svelte`:

```svelte
<script>
  let darkMode = false;
  
  $: if (darkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
</script>

<button on:click={() => darkMode = !darkMode}>
  {darkMode ? '☀️' : '🌙'}
</button>
```

## Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

Output goes to `dist/` directory.

## Next Steps

1. ✅ **Form works** - Dynamic rendering from plugin definitions
2. ✅ **Validation works** - Email, URL, hostname, etc.
3. ✅ **UI looks good** - bits-ui + Tailwind

**When ready to add backend:**

1. Set up GraphQL server
2. Replace mock data in `plugins.ts` with GraphQL queries
3. Implement real connection testing
4. Add credential encryption
5. Save to database

**For now**, enjoy the fully functional frontend! 🎉

## Troubleshooting

### Port already in use

```bash
# Use different port
PORT=3001 npm run dev
```

### Dependencies not installed

```bash
rm -rf node_modules package-lock.json
npm install
```

### TypeScript errors

```bash
# Check types
npm run check
```

### Styles not loading

```bash
# Restart dev server
# Ctrl+C then npm run dev
```

## Questions?

Check the main [README.md](./README.md) for detailed documentation.

---

**Congratulations!** You now have a working Svelte form generator with bits-ui! 🚀

