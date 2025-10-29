#!/usr/bin/env node

/**
 * Demo GraphQL Server
 * 
 * A simple server with mock data to test the integration form system
 */

const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const fs = require('fs');
const path = require('path');

// Load schema
const schemaPath = path.join(__dirname, '..', 'integration-schema.graphql');
const schemaString = fs.readFileSync(schemaPath, 'utf8');
const schema = buildSchema(schemaString);

// Mock data
const mockPlugins = [
  {
    id: 'salesforce',
    slug: 'salesforce',
    name: 'Salesforce',
    description: 'Connect to Salesforce CRM to sync contacts, leads, opportunities, and more',
    icon: 'https://cdn.example.com/salesforce.svg',
    category: 'CRM',
    enabled: true,
    documentationPath: '/docs/integrations/salesforce/index.md',
    supportUrl: 'https://docs.askparable.com/getting-api-keys/',
    variants: [
      {
        id: 'salesforce-oauth',
        name: 'OAuth 2.0',
        description: 'Secure OAuth 2.0 authentication (Recommended)',
        authMethod: 'OAUTH2',
        recommended: true,
        documentationPath: '/docs/integrations/salesforce/oauth.md',
        formFields: [
          {
            __typename: 'HostnameField',
            id: 'sf-oauth-subdomain',
            key: 'subdomain',
            label: 'Salesforce Subdomain',
            description: 'Your Salesforce subdomain (e.g., "mycompany" for mycompany.salesforce.com)',
            required: true,
            widget: 'HOSTNAME_INPUT',
            mode: 'READ_WRITE',
            placeholder: 'mycompany',
          },
          {
            __typename: 'StringField',
            id: 'sf-oauth-client-id',
            key: 'clientId',
            label: 'Client ID',
            description: 'OAuth application client ID from Salesforce',
            required: true,
            widget: 'TEXT_INPUT',
            mode: 'READ_WRITE',
            placeholder: '3MVG9...',
          },
          {
            __typename: 'SecretField',
            id: 'sf-oauth-client-secret',
            key: 'clientSecret',
            label: 'Client Secret',
            description: 'OAuth application client secret (will be encrypted)',
            required: true,
            widget: 'PASSWORD',
            mode: 'WRITE_ONLY',
            revealable: false,
          },
          {
            __typename: 'URLField',
            id: 'sf-oauth-callback',
            key: 'callbackUrl',
            label: 'Callback URL',
            description: 'OAuth callback URL configured in Salesforce',
            required: true,
            widget: 'URL_INPUT',
            mode: 'READ_WRITE',
            defaultValue: 'https://app.parable.io/integrations/callback',
          },
          {
            __typename: 'SelectField',
            id: 'sf-oauth-environment',
            key: 'environment',
            label: 'Environment',
            description: 'Salesforce environment type',
            required: true,
            widget: 'SELECT',
            mode: 'READ_WRITE',
            defaultValue: 'production',
            options: [
              { value: 'production', label: 'Production', description: 'Live production environment' },
              { value: 'sandbox', label: 'Sandbox', description: 'Testing/development environment' },
            ],
          },
        ],
        testConfig: {
          id: 'sf-oauth-test',
          method: 'HTTP_GET',
          endpoint: 'https://${subdomain}.salesforce.com/services/oauth2/token',
          timeoutMs: 5000,
          expectedResponse: {
            statusCode: 200,
            successMessage: '✓ Successfully connected to Salesforce',
            failureMessage: '✗ Unable to connect to Salesforce. Please check your credentials.',
          },
        },
      },
      {
        id: 'salesforce-api-key',
        name: 'API Key',
        description: 'Simple API key authentication',
        authMethod: 'API_KEY',
        recommended: false,
        documentationPath: '/docs/integrations/salesforce/api-key.md',
        formFields: [
          {
            __typename: 'HostnameField',
            id: 'sf-api-subdomain',
            key: 'subdomain',
            label: 'Salesforce Subdomain',
            description: 'Your Salesforce subdomain',
            required: true,
            widget: 'HOSTNAME_INPUT',
            mode: 'READ_WRITE',
            placeholder: 'mycompany',
          },
          {
            __typename: 'EmailField',
            id: 'sf-api-username',
            key: 'username',
            label: 'Username',
            description: 'Your Salesforce username (email)',
            required: true,
            widget: 'EMAIL_INPUT',
            mode: 'READ_WRITE',
            placeholder: 'admin@company.com',
          },
          {
            __typename: 'SecretField',
            id: 'sf-api-key',
            key: 'apiKey',
            label: 'Security Token',
            description: 'Your Salesforce security token',
            required: true,
            widget: 'PASSWORD',
            mode: 'WRITE_ONLY',
            revealable: false,
          },
        ],
        testConfig: {
          id: 'sf-api-test',
          method: 'HTTP_POST',
          endpoint: 'https://${subdomain}.salesforce.com/services/data/v58.0/',
          timeoutMs: 10000,
          expectedResponse: {
            statusCode: 200,
            successMessage: '✓ API credentials validated successfully',
            failureMessage: '✗ Invalid API credentials. Please verify your security token.',
          },
        },
      },
    ],
  },
];

// Resolvers
const root = {
  plugins: ({ category, enabled }) => {
    let filtered = mockPlugins;
    
    if (category) {
      filtered = filtered.filter(p => p.category === category);
    }
    
    if (enabled !== undefined) {
      filtered = filtered.filter(p => p.enabled === enabled);
    }
    
    return filtered;
  },
  
  plugin: ({ id }) => {
    return mockPlugins.find(p => p.id === id);
  },
  
  pluginBySlug: ({ slug }) => {
    return mockPlugins.find(p => p.slug === slug);
  },
  
  variant: ({ id }) => {
    for (const plugin of mockPlugins) {
      const variant = plugin.variants.find(v => v.id === id);
      if (variant) return variant;
    }
    return null;
  },
  
  testPluginConfig: ({ input }) => {
    // Mock test - always succeed for demo
    console.log('Testing config:', input);
    
    return {
      success: true,
      message: '✓ Connection test successful',
      details: 'Successfully connected to the service',
      durationMs: 234,
    };
  },
  
  createPluginConfig: ({ input }) => {
    console.log('Creating config:', input);
    
    return {
      success: true,
      id: 'config-' + Date.now(),
      config: {
        id: 'config-' + Date.now(),
        plugin: mockPlugins.find(p => p.id === input.pluginId),
        variant: mockPlugins
          .find(p => p.id === input.pluginId)
          ?.variants.find(v => v.id === input.variantId),
        name: input.name,
        config: input.config,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };
  },
  
  updatePluginConfig: ({ id, input }) => {
    console.log('Updating config:', id, input);
    
    return {
      success: true,
      id: id,
    };
  },
  
  deletePluginConfig: ({ id }) => {
    console.log('Deleting config:', id);
    return true;
  },
};

// Create Express app
const app = express();

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// GraphQL endpoint
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true, // Enable GraphiQL UI
}));

// Simple HTML page to test the form
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Integration Forms Demo</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          max-width: 800px;
          margin: 50px auto;
          padding: 20px;
        }
        h1 { color: #333; }
        .card {
          background: #f9f9f9;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
        }
        a {
          color: #6366f1;
          text-decoration: none;
        }
        a:hover { text-decoration: underline; }
        code {
          background: #e5e7eb;
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <h1>🚀 Integration Forms Demo Server</h1>
      
      <div class="card">
        <h2>GraphQL Playground</h2>
        <p>Test GraphQL queries and mutations:</p>
        <p><a href="/graphql">Open GraphiQL →</a></p>
      </div>
      
      <div class="card">
        <h2>Example Queries</h2>
        
        <h3>Get all plugins</h3>
        <pre><code>query {
  plugins {
    slug
    name
    category
    variants {
      name
      recommended
    }
  }
}</code></pre>
        
        <h3>Get Salesforce plugin</h3>
        <pre><code>query {
  pluginBySlug(slug: "salesforce") {
    name
    description
    variants {
      id
      name
      formFields {
        __typename
        ... on StringField { key, label }
        ... on SecretField { key, label }
      }
    }
  }
}</code></pre>
        
        <h3>Test connection</h3>
        <pre><code>mutation {
  testPluginConfig(input: {
    pluginId: "salesforce"
    variantId: "salesforce-oauth"
    config: "{\\"subdomain\\":\\"test\\"}"
  }) {
    success
    message
  }
}</code></pre>
      </div>
      
      <div class="card">
        <h2>Next Steps</h2>
        <ol>
          <li>Try the queries above in GraphiQL</li>
          <li>Build a React app using the generated hooks</li>
          <li>Render the <code>IntegrationFormCard</code> component</li>
        </ol>
      </div>
    </body>
    </html>
  `);
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`\n🚀 Demo server running!`);
  console.log(`\n  GraphQL endpoint: http://localhost:${PORT}/graphql`);
  console.log(`  GraphiQL UI:      http://localhost:${PORT}/graphql`);
  console.log(`  Demo page:        http://localhost:${PORT}/\n`);
});

