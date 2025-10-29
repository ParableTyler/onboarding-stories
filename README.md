# Integration Form System

A GraphQL-based integration plugin system with dynamic form generation.

## What This Is

This project provides a framework for building dynamic integration forms based on GraphQL schemas. The actual implementation is a **Svelte frontend** with bits-ui components.

## Quick Start

```bash
cd svelte-frontend
npm install
npm run dev
```

Then open http://localhost:3000

## Project Structure

```
transcripts/
├── integration-schema.graphql    # Core GraphQL schema
├── docs/                         # Integration documentation
│   └── integrations/
│       └── salesforce/
│           ├── oauth.md         # OAuth setup guide
│           └── api-key.md       # API Key setup guide
├── scripts/                      # Validation & testing scripts
│   ├── validate-schema.js
│   └── test-schema.js
└── svelte-frontend/             # 👈 Main implementation
    ├── README.md                 # Full documentation
    ├── QUICKSTART.md             # 2-minute setup
    └── src/                      # Svelte app
```

## Documentation

- **Main Documentation**: See [svelte-frontend/README.md](./svelte-frontend/README.md)
- **Quick Start Guide**: See [svelte-frontend/QUICKSTART.md](./svelte-frontend/QUICKSTART.md)
- **Integration Docs**: See [docs/integrations/](./docs/integrations/)

## Features

✅ **Svelte + bits-ui** - Modern UI components  
✅ **GraphQL Schema** - Type-safe form definitions  
✅ **Dynamic Forms** - Auto-generated from plugin data  
✅ **Multiple Variants** - OAuth, API Key, etc.  
✅ **Built-in Validation** - Email, URL, hostname  
✅ **Markdown Docs** - Inline setup guides  
✅ **Dark Mode** - Full dark mode support

## Core Schema

The GraphQL schema (`integration-schema.graphql`) defines:
- Plugin types
- Form field types (StringField, SecretField, EmailField, etc.)
- Validation rules
- Test configurations

The Svelte frontend reads this schema to generate forms dynamically.

## Adding New Integrations

**New to connector creation?** Start here:

📘 **[Getting Started Guide](./docs/GETTING-STARTED-WITH-CONNECTORS.md)** - Build your first connector in 30 minutes  
📗 **[How-To Guide](./docs/HOW-TO-ADD-A-CONNECTOR.md)** - Comprehensive step-by-step instructions  
📙 **[Quick Reference](./docs/CONNECTOR-QUICK-REFERENCE.md)** - Copy-paste examples for common patterns  
📕 **[Workflow Guide](./docs/CONNECTOR-WORKFLOW.md)** - Visual workflows and decision trees

**Quick Summary:**
1. Add connector definition to `svelte-frontend/src/data/connectors.ts`
2. Create documentation in `docs/integrations/<connector-name>/`
3. Refresh the browser - the form auto-generates!

## Scripts

   ```bash
# Validate GraphQL schema
node scripts/validate-schema.js

# Test schema structure
node scripts/test-schema.js
```

## License

MIT
