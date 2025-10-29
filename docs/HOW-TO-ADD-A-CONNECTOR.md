# How to Add a New Connector or Variant

**A Step-by-Step Guide for Non-Technical Users**

This guide will walk you through adding a new integration (like Salesforce, Slack, or GitHub) to the Parable integration system. Don't worry if you're not a developer—we'll explain everything in plain English!

---

## Table of Contents

1. [Understanding the Basics](#understanding-the-basics)
2. [Before You Start](#before-you-start)
3. [Option A: Adding a Brand New Connector](#option-a-adding-a-brand-new-connector)
4. [Option B: Adding a Variant to an Existing Connector](#option-b-adding-a-variant-to-an-existing-connector)
5. [Testing Your Connector](#testing-your-connector)
6. [Common Questions](#common-questions)

---

## Understanding the Basics

### What is a Connector?

A **connector** is an integration with a third-party service. For example:
- **Salesforce** (customer relationship management)
- **Slack** (team messaging)
- **GitHub** (code hosting)

### What is a Variant?

A **variant** is a different way to connect to the same service. Most services offer multiple authentication methods:

**Example: Salesforce has two variants:**
1. **OAuth 2.0** - More secure, uses temporary tokens
2. **API Key** - Simpler, uses username + security token

Think of variants like different doors into the same building—they all get you inside, but some are more secure or convenient than others.

### What You'll Create

When you add a connector, you're creating:
1. ✅ A **definition** (telling the system what information to collect)
2. ✅ A **form** (auto-generated for users to fill out)
3. ✅ **Documentation** (instructions for users)
4. ✅ A **test** (to verify the connection works)

---

## Before You Start

### Gather This Information

Before adding a connector, collect the following details:

#### About the Service
- [ ] Service name (e.g., "Salesforce")
- [ ] Brief description (1-2 sentences)
- [ ] Logo/icon URL
- [ ] Category (CRM, Storage, Analytics, etc.)
- [ ] Support/help URL

#### About Authentication
- [ ] What type of authentication? (OAuth, API Key, Username/Password)
- [ ] What credentials are needed? (e.g., API key, client ID, subdomain)
- [ ] How do users obtain these credentials?
- [ ] How to test if credentials work? (What API endpoint to call)

#### Documentation Needs
- [ ] Step-by-step setup instructions
- [ ] Screenshots (if helpful)
- [ ] Common troubleshooting issues
- [ ] Security best practices

### Tools You'll Need

- **Text Editor** - VS Code, Sublime Text, or even Notepad
- **Basic Understanding** - How to copy, paste, and edit text
- **Access** - Permission to edit files in this project

---

## Option A: Adding a Brand New Connector

### Step 1: Open the Connectors File

1. Navigate to: `svelte-frontend/src/data/connectors.ts`
2. Open this file in your text editor
3. Scroll to the bottom (before the closing `];`)

### Step 2: Copy a Template

**Find a similar connector** to use as a template:

- **For API Key authentication**: Copy the `ActivTrak` connector
- **For OAuth authentication**: Copy the `Slack` connector
- **For multiple variants**: Copy the `Salesforce` connector

Let's say you're adding **Zoom** with OAuth. Here's what you do:

```typescript
{
  id: 'zoom',                           // Unique ID (lowercase, no spaces)
  slug: 'zoom',                         // Same as ID
  name: 'Zoom',                         // Display name (what users see)
  description: 'Host virtual meetings and webinars',  // Short description
  icon: 'https://img.logo.dev/zoom.us?token=pk_N2gy3fJKQ0aldg9QTg7cHA',
  enabled: true,                        // Set to true to activate
  documentationPath: '/docs/integrations/zoom/index.md',
  supportUrl: 'https://docs.askparable.com/getting-api-keys/',
  prioritized: false,                   // For internal priority tracking
  connected: false,                     // Initial state
  variants: [
    // We'll add variants in the next step
  ],
},
```

**💡 Tip**: Replace `YOUR_SERVICE_NAME` with your actual service name everywhere.

### Step 3: Define Your Variant

Inside the `variants: [ ]` array, add your authentication method:

```typescript
variants: [
  {
    id: 'zoom-oauth',                   // Format: service-method
    name: 'OAuth 2.0',                  // What users will see
    description: 'Secure OAuth 2.0 authentication',
    authMethod: 'OAUTH2',               // OAUTH2, API_KEY, or TOKEN
    recommended: true,                  // Is this the best option?
    documentationPath: '/docs/integrations/zoom/oauth.md',
    formFields: [
      // We'll add fields in the next step
    ],
    testConfig: {
      // We'll add test config in step 5
    },
  },
],
```

### Step 4: Add Form Fields

Now define what information you need from users. Here are the most common field types:

#### Text Input (for usernames, IDs, etc.)

```typescript
{
  __typename: 'StringField',
  id: 'zoom-account-id',                // Unique ID
  key: 'accountId',                     // What to save it as
  label: 'Account ID',                  // Label users see
  description: 'Your Zoom account ID',  // Help text
  required: true,                       // Is this required?
  widget: 'TEXT_INPUT',
  mode: 'READ_WRITE',
  placeholder: 'abc123',                // Example text
},
```

#### Password/Secret Field (for API keys, tokens)

```typescript
{
  __typename: 'SecretField',
  id: 'zoom-client-secret',
  key: 'clientSecret',
  label: 'Client Secret',
  description: 'Your OAuth client secret',
  required: true,
  widget: 'PASSWORD',
  mode: 'WRITE_ONLY',                   // Hidden after entry
  revealable: false,                    // Can users view it?
},
```

#### Email Field

```typescript
{
  __typename: 'EmailField',
  id: 'zoom-email',
  key: 'email',
  label: 'Email Address',
  description: 'Your Zoom account email',
  required: true,
  widget: 'EMAIL_INPUT',
  mode: 'READ_WRITE',
  placeholder: 'admin@company.com',
},
```

#### Dropdown Menu (for choosing options)

```typescript
{
  __typename: 'SelectField',
  id: 'zoom-region',
  key: 'region',
  label: 'Data Center Region',
  description: 'Choose your Zoom data center',
  required: true,
  widget: 'SELECT',
  mode: 'READ_WRITE',
  defaultValue: 'us',
  options: [
    { value: 'us', label: 'United States', description: 'US servers' },
    { value: 'eu', label: 'Europe', description: 'EU servers' },
    { value: 'au', label: 'Australia', description: 'Australian servers' },
  ],
  allowCustom: false,                   // Can users type custom values?
},
```

#### Toggle Switch (for yes/no options)

```typescript
{
  __typename: 'BooleanField',
  id: 'zoom-recording-enabled',
  key: 'enableRecording',
  label: 'Enable Recording Access',
  description: 'Allow access to meeting recordings',
  required: false,
  widget: 'TOGGLE',
  mode: 'READ_WRITE',
  defaultValue: 'false',
},
```

#### Multi-Select (for permissions/scopes)

```typescript
{
  __typename: 'MultiSelectField',
  id: 'zoom-scopes',
  key: 'scopes',
  label: 'Permissions',
  description: 'Select required API permissions',
  required: true,
  widget: 'MULTISELECT',
  mode: 'READ_WRITE',
  minSelections: 1,
  options: [
    { value: 'meeting:read', label: 'Read Meetings', description: 'View meeting info' },
    { value: 'meeting:write', label: 'Create Meetings', description: 'Schedule meetings' },
    { value: 'user:read', label: 'Read Users', description: 'View user profiles' },
  ],
},
```

#### Setup Instructions (Markdown display)

```typescript
{
  __typename: 'MarkdownField',
  id: 'zoom-setup-guide',
  key: 'setupGuide',
  label: 'Setup Instructions',
  required: false,
  widget: 'MARKDOWN_DISPLAY',
  mode: 'READ_ONLY',
  content: `## Before you begin

1. Log in to Zoom Marketplace
2. Create a new OAuth app
3. Copy your Client ID and Client Secret

[View detailed guide →](/docs/integrations/zoom/oauth.md)`,
},
```

### Step 5: Add Test Configuration

This tells the system how to verify credentials work:

```typescript
testConfig: {
  id: 'zoom-test',
  method: 'HTTP_GET',                   // HTTP_GET, HTTP_POST, or CUSTOM
  endpoint: 'https://api.zoom.us/v2/users/me',  // API to test
  timeoutMs: 5000,                      // How long to wait
  expectedResponse: {
    statusCode: 200,                    // Success = 200
    successMessage: '✓ Connected to Zoom',
    failureMessage: '✗ Invalid credentials',
  },
},
```

**Common Test Methods:**
- `HTTP_GET` - Most API key tests
- `HTTP_POST` - OAuth token exchanges
- `VALIDATE_FORMAT` - Just check if format is correct (no API call)

### Step 6: Save Your Changes

1. Double-check your syntax (commas, brackets, quotes)
2. Save the `connectors.ts` file
3. Add a comma after your connector entry (if not the last one)

---

## Option B: Adding a Variant to an Existing Connector

Sometimes a service supports multiple authentication methods. For example, **Jira** offers both Cloud and On-Premises versions.

### Step 1: Find the Connector

1. Open `svelte-frontend/src/data/connectors.ts`
2. Search for your connector (e.g., search "jira")
3. Find the `variants: [` array

### Step 2: Add Your New Variant

Inside the `variants` array, add a comma after the last variant, then add:

```typescript
{
  id: 'jira-server',                    // New variant ID
  name: 'Server Edition',               // Display name
  description: 'For self-hosted Jira Server',
  authMethod: 'API_KEY',
  recommended: false,                   // If not the primary option
  documentationPath: '/docs/integrations/jira/server.md',
  formFields: [
    // Different fields than the Cloud variant
    {
      __typename: 'URLField',
      id: 'jira-server-url',
      key: 'serverUrl',
      label: 'Server URL',
      description: 'Your Jira server address',
      required: true,
      widget: 'URL_INPUT',
      mode: 'READ_WRITE',
      placeholder: 'https://jira.yourcompany.com',
    },
    // ... more fields
  ],
  testConfig: {
    id: 'jira-server-test',
    method: 'HTTP_GET',
    endpoint: '${serverUrl}/rest/api/2/myself',  // Use ${fieldKey} for dynamic values
    timeoutMs: 5000,
    expectedResponse: {
      statusCode: 200,
      successMessage: '✓ Connected to Jira Server',
      failureMessage: '✗ Invalid credentials',
    },
  },
},
```

**💡 Dynamic URLs**: Use `${fieldKey}` in endpoints to insert values from form fields. For example, `${serverUrl}` will be replaced with the user's entered server URL.

---

## Step 7: Write Documentation

### Create Documentation Files

1. Navigate to: `docs/integrations/`
2. Create a folder for your service: `docs/integrations/zoom/`
3. Create these files:
   - `index.md` - Overview of the integration
   - `oauth.md` - Specific to OAuth variant (or `api-key.md`, etc.)

### Documentation Template

**`index.md`** (Overview)

```markdown
# Zoom Integration

Connect Parable to Zoom to sync meeting data and user information.

## Available Authentication Methods

### OAuth 2.0 (Recommended)
Secure authentication using OAuth 2.0 protocol.
- **Security**: ⭐⭐⭐⭐⭐
- **Setup Time**: ~5 minutes
- **Best For**: Production environments

[Setup OAuth →](./oauth.md)

## What You Can Do

Once connected, you can:
- ✅ Sync meeting data
- ✅ Retrieve participant information
- ✅ Access recordings
- ✅ Manage user accounts

## Support

Need help? Contact support@parable.io
```

**`oauth.md`** (Detailed Setup Guide)

```markdown
# Zoom OAuth 2.0 Setup

Step-by-step guide for connecting Zoom using OAuth 2.0.

## Prerequisites

Before you begin, you'll need:
- Admin access to Zoom Marketplace
- Permission to create OAuth apps in your organization

## Step 1: Create OAuth App in Zoom

1. Go to [Zoom Marketplace](https://marketplace.zoom.us/)
2. Click **Develop** → **Build App**
3. Choose **OAuth** app type
4. Click **Create**

## Step 2: Configure OAuth Settings

1. **App Name**: Enter "Parable Integration"
2. **App Type**: Choose "Account-level app"
3. **Redirect URL**: Enter `https://app.parable.io/integrations/callback`
4. Click **Continue**

## Step 3: Copy Credentials

1. On the **App Credentials** page, you'll see:
   - **Client ID**: Copy this value
   - **Client Secret**: Click to reveal, then copy

⚠️ **Important**: Keep your Client Secret secure! Never share it publicly.

## Step 4: Configure in Parable

1. In Parable, select **Zoom** connector
2. Choose **OAuth 2.0** variant
3. Fill in the form:
   - **Client ID**: Paste from Step 3
   - **Client Secret**: Paste from Step 3
   - **Scopes**: Select permissions you need
4. Click **Test Connection**

## Step 5: Authorize Access

1. Click **Connect to Zoom**
2. You'll be redirected to Zoom
3. Review permissions and click **Authorize**
4. You'll return to Parable with a success message

## Troubleshooting

### "Invalid Client" Error

**Problem**: Client ID or Client Secret is incorrect.

**Solution**:
1. Double-check you copied the full Client ID and Secret
2. Ensure no extra spaces were copied
3. Try regenerating the Client Secret in Zoom

### "Redirect URI Mismatch" Error

**Problem**: The callback URL doesn't match Zoom's settings.

**Solution**:
1. In Zoom Marketplace, go to your app settings
2. Verify the Redirect URL is exactly: `https://app.parable.io/integrations/callback`
3. Save changes and try again

### Connection Times Out

**Problem**: Network or firewall blocking the connection.

**Solution**:
1. Check your organization's firewall settings
2. Ensure `*.zoom.us` is not blocked
3. Try from a different network

## Security Best Practices

1. **Use a Service Account**: Create a dedicated Zoom user for integrations
2. **Minimum Scopes**: Only select permissions you actually need
3. **Monitor Access**: Review API usage regularly in Zoom admin
4. **Rotate Credentials**: Update Client Secret periodically

## API Rate Limits

Zoom enforces the following limits:
- **Light**: 30 requests/second
- **Medium**: 10 requests/second
- **Heavy**: 5 requests/second

Parable automatically handles rate limiting.

## Next Steps

After connecting:
1. Configure data sync settings
2. Set up webhooks (optional)
3. Test your integration with sample data

## Support

- 📧 **Email**: support@parable.io
- 💬 **Chat**: app.parable.io/support
- 📚 **Docs**: docs.askparable.com
```

---

## Testing Your Connector

### 1. Visual Check

1. Save all your files
2. Open the terminal and navigate to `svelte-frontend/`:
   ```bash
   cd svelte-frontend
   npm run dev
   ```
3. Open your browser to `http://localhost:3000`
4. Look for your new connector in the list
5. Click on it and verify:
   - ✅ Name and description appear correctly
   - ✅ Icon loads
   - ✅ Variant tabs show up
   - ✅ Form fields render properly
   - ✅ Help text is clear

### 2. Validate the Configuration

Run the schema validator:

```bash
node scripts/validate-schema.js
```

This checks for common errors like:
- Missing required fields
- Invalid field types
- Syntax errors

### 3. Test with Real Credentials

1. Fill out the form with actual credentials
2. Click **Test Connection**
3. Verify you get the expected result:
   - ✅ Success message on valid credentials
   - ✅ Clear error message on invalid credentials
   - ✅ Connection completes within timeout period

### 4. Test Edge Cases

Try these scenarios:
- ❌ Leave required fields empty
- ❌ Enter invalid email format
- ❌ Enter malformed URL
- ❌ Use wrong credentials
- ✅ All should show helpful error messages

---

## Common Questions

### Q: How do I know what fields to include?

**A**: Check the service's API documentation. Look for:
- "Authentication" or "Getting Started" sections
- Required credentials (API keys, tokens, etc.)
- Optional configuration (regions, endpoints, etc.)

### Q: What if the service doesn't have a public API to test?

**A**: Use `VALIDATE_FORMAT` as the test method:

```typescript
testConfig: {
  id: 'service-test',
  method: 'VALIDATE_FORMAT',
  timeoutMs: 1000,
  expectedResponse: {
    successMessage: '✓ Credentials format validated',
    failureMessage: '✗ Invalid credential format',
  },
}
```

### Q: Can I make certain fields appear only if others are filled?

**A**: Not yet! This is a planned feature called "conditional fields." For now, all fields show at once.

### Q: What's the difference between `mode: 'READ_WRITE'` and `mode: 'WRITE_ONLY'`?

**A**:
- `READ_WRITE` - Users can see the value after saving (like usernames)
- `WRITE_ONLY` - Value is hidden after entry (like passwords)
- `READ_ONLY` - Users can't edit it (like instructions)

### Q: How do I get a service's logo URL?

**A**: Use this pattern:
```
https://img.logo.dev/DOMAIN?token=pk_N2gy3fJKQ0aldg9QTg7cHA
```

Replace `DOMAIN` with the service's website (e.g., `zoom.us`, `slack.com`).

### Q: What if my connector needs more than simple HTTP testing?

**A**: Use custom testing:

```typescript
testConfig: {
  id: 'custom-test',
  method: 'CUSTOM',
  customScript: `
    // Custom JavaScript code to test connection
    const response = await fetch(endpoint, { headers });
    return response.ok;
  `,
  timeoutMs: 10000,
  expectedResponse: {
    successMessage: '✓ Custom test passed',
    failureMessage: '✗ Custom test failed',
  },
}
```

### Q: Can I reorder the connectors in the list?

**A**: Yes! Just move your connector definition up or down in the `connectors.ts` file. The display order matches the file order.

### Q: What if I make a mistake?

**A**: Don't worry! Common fixes:

1. **Syntax errors**: Use an online JSON/TypeScript validator
2. **Missing comma**: Add commas between objects
3. **Wrong quotes**: Use `'single'` or `"double"` quotes consistently
4. **Lost your place**: Use `git checkout connectors.ts` to start over

---

## Full Example: Adding Zoom

Here's a complete example putting it all together:

```typescript
{
  id: 'zoom',
  slug: 'zoom',
  name: 'Zoom',
  description: 'Host virtual meetings and webinars with video conferencing',
  icon: 'https://img.logo.dev/zoom.us?token=pk_N2gy3fJKQ0aldg9QTg7cHA',
  enabled: true,
  documentationPath: '/docs/integrations/zoom/index.md',
  supportUrl: 'https://docs.askparable.com/integrations/zoom/',
  prioritized: false,
  connected: false,
  variants: [
    {
      id: 'zoom-oauth',
      name: 'OAuth 2.0',
      description: 'Secure OAuth 2.0 authentication',
      authMethod: 'OAUTH2',
      recommended: true,
      documentationPath: '/docs/integrations/zoom/oauth.md',
      formFields: [
        {
          __typename: 'StringField',
          id: 'zoom-client-id',
          key: 'clientId',
          label: 'Client ID',
          description: 'OAuth client ID from Zoom Marketplace',
          required: true,
          widget: 'TEXT_INPUT',
          mode: 'READ_WRITE',
        },
        {
          __typename: 'SecretField',
          id: 'zoom-client-secret',
          key: 'clientSecret',
          label: 'Client Secret',
          description: 'OAuth client secret (will be encrypted)',
          required: true,
          widget: 'PASSWORD',
          mode: 'WRITE_ONLY',
          revealable: false,
        },
        {
          __typename: 'SelectField',
          id: 'zoom-region',
          key: 'region',
          label: 'Data Center',
          description: 'Your Zoom data center region',
          required: true,
          widget: 'SELECT',
          mode: 'READ_WRITE',
          defaultValue: 'us',
          options: [
            { value: 'us', label: 'United States', description: 'US servers' },
            { value: 'eu', label: 'Europe', description: 'EU servers' },
          ],
          allowCustom: false,
        },
        {
          __typename: 'MultiSelectField',
          id: 'zoom-scopes',
          key: 'scopes',
          label: 'API Scopes',
          description: 'Select required permissions',
          required: true,
          widget: 'MULTISELECT',
          mode: 'READ_WRITE',
          minSelections: 1,
          options: [
            { value: 'meeting:read', label: 'Read Meetings' },
            { value: 'meeting:write', label: 'Create Meetings' },
            { value: 'user:read', label: 'Read Users' },
            { value: 'recording:read', label: 'Read Recordings' },
          ],
        },
      ],
      testConfig: {
        id: 'zoom-oauth-test',
        method: 'HTTP_GET',
        endpoint: 'https://api.zoom.us/v2/users/me',
        timeoutMs: 5000,
        expectedResponse: {
          statusCode: 200,
          successMessage: '✓ Successfully connected to Zoom',
          failureMessage: '✗ Unable to connect. Please check your credentials.',
        },
      },
    },
  ],
},
```

---

## Next Steps

After adding your connector:

1. **Test thoroughly** with real credentials
2. **Get feedback** from a colleague
3. **Document edge cases** you discovered
4. **Update this guide** if you found something confusing

## Need Help?

- 📧 Email the dev team
- 💬 Ask in the #integrations Slack channel
- 📚 Check existing connectors for examples

---

**Remember**: Every connector starts somewhere! Don't be afraid to copy from existing examples and modify them to fit your needs. You've got this! 🚀

