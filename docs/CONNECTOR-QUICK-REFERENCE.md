# Connector Quick Reference Cheat Sheet

**Quick answers for the most common tasks**

---

## 🎯 Common Field Types

### Text Input
```typescript
{
  __typename: 'StringField',
  id: 'my-field-id',
  key: 'fieldName',
  label: 'Field Label',
  description: 'Help text',
  required: true,
  widget: 'TEXT_INPUT',
  mode: 'READ_WRITE',
  placeholder: 'example text',
}
```

### Password/Secret
```typescript
{
  __typename: 'SecretField',
  id: 'my-secret',
  key: 'apiKey',
  label: 'API Key',
  required: true,
  widget: 'PASSWORD',
  mode: 'WRITE_ONLY',
  revealable: false,
}
```

### Email
```typescript
{
  __typename: 'EmailField',
  id: 'my-email',
  key: 'email',
  label: 'Email Address',
  required: true,
  widget: 'EMAIL_INPUT',
  mode: 'READ_WRITE',
  placeholder: 'user@example.com',
}
```

### URL
```typescript
{
  __typename: 'URLField',
  id: 'my-url',
  key: 'serverUrl',
  label: 'Server URL',
  required: true,
  widget: 'URL_INPUT',
  mode: 'READ_WRITE',
  placeholder: 'https://example.com',
}
```

### Dropdown (Single Choice)
```typescript
{
  __typename: 'SelectField',
  id: 'my-select',
  key: 'region',
  label: 'Region',
  required: true,
  widget: 'SELECT',
  mode: 'READ_WRITE',
  defaultValue: 'us',
  options: [
    { value: 'us', label: 'United States' },
    { value: 'eu', label: 'Europe' },
  ],
  allowCustom: false,
}
```

### Checkboxes (Multiple Choice)
```typescript
{
  __typename: 'MultiSelectField',
  id: 'my-multiselect',
  key: 'permissions',
  label: 'Permissions',
  required: true,
  widget: 'MULTISELECT',
  mode: 'READ_WRITE',
  minSelections: 1,
  options: [
    { value: 'read', label: 'Read Access' },
    { value: 'write', label: 'Write Access' },
    { value: 'admin', label: 'Admin Access' },
  ],
}
```

### Toggle Switch (Yes/No)
```typescript
{
  __typename: 'BooleanField',
  id: 'my-toggle',
  key: 'enabled',
  label: 'Enable Feature',
  description: 'Turn this feature on or off',
  required: false,
  widget: 'TOGGLE',
  mode: 'READ_WRITE',
  defaultValue: 'false',
}
```

### Instructions/Help Text
```typescript
{
  __typename: 'MarkdownField',
  id: 'my-instructions',
  key: 'instructions',
  label: 'Setup Instructions',
  required: false,
  widget: 'MARKDOWN_DISPLAY',
  mode: 'READ_ONLY',
  content: `## How to get your API key

1. Log in to the service
2. Go to Settings → API
3. Click "Generate New Key"`,
}
```

---

## 🧪 Test Configurations

### Basic API Key Test (GET)
```typescript
testConfig: {
  id: 'my-test',
  method: 'HTTP_GET',
  endpoint: 'https://api.example.com/v1/user',
  timeoutMs: 5000,
  expectedResponse: {
    statusCode: 200,
    successMessage: '✓ Connected successfully',
    failureMessage: '✗ Invalid API key',
  },
}
```

### OAuth Test (GET)
```typescript
testConfig: {
  id: 'oauth-test',
  method: 'HTTP_GET',
  endpoint: 'https://api.example.com/v1/me',
  timeoutMs: 5000,
  expectedResponse: {
    statusCode: 200,
    successMessage: '✓ OAuth connection successful',
    failureMessage: '✗ Unable to authenticate',
  },
}
```

### POST Request Test
```typescript
testConfig: {
  id: 'post-test',
  method: 'HTTP_POST',
  endpoint: 'https://api.example.com/v1/auth/verify',
  timeoutMs: 10000,
  expectedResponse: {
    statusCode: 200,
    bodyPattern: '"success"\\s*:\\s*true',  // Regex to check response
    successMessage: '✓ Credentials verified',
    failureMessage: '✗ Verification failed',
  },
}
```

### Format Validation Only (No API Call)
```typescript
testConfig: {
  id: 'format-test',
  method: 'VALIDATE_FORMAT',
  timeoutMs: 1000,
  expectedResponse: {
    successMessage: '✓ Format is valid',
    failureMessage: '✗ Invalid format',
  },
}
```

### Dynamic URL Test (Using Form Values)
```typescript
testConfig: {
  id: 'dynamic-test',
  method: 'HTTP_GET',
  endpoint: 'https://${subdomain}.example.com/api/v1/test',  // Uses subdomain field
  timeoutMs: 5000,
  expectedResponse: {
    statusCode: 200,
    successMessage: '✓ Connected to ${subdomain}',
    failureMessage: '✗ Failed to connect',
  },
}
```

---

## 🔑 Authentication Method Values

Use these exact values for `authMethod`:

- `API_KEY` - API key or token authentication
- `OAUTH2` - OAuth 2.0 authentication
- `BASIC_AUTH` - Username and password
- `SERVICE_ACCOUNT` - Service account credentials
- `TOKEN` - Bearer token authentication
- `USERNAME_PASSWORD` - Simple username/password

---

## 📝 Common Patterns

### Subdomain-Based Service (like Salesforce, Jira)
```typescript
formFields: [
  {
    __typename: 'HostnameField',
    id: 'service-subdomain',
    key: 'subdomain',
    label: 'Subdomain',
    description: 'Your company subdomain',
    required: true,
    widget: 'HOSTNAME_INPUT',
    mode: 'READ_WRITE',
    placeholder: 'mycompany',
  },
]
```

### Service with Regions/Data Centers
```typescript
formFields: [
  {
    __typename: 'SelectField',
    id: 'service-region',
    key: 'region',
    label: 'Data Center',
    required: true,
    widget: 'SELECT',
    mode: 'READ_WRITE',
    defaultValue: 'us',
    options: [
      { value: 'us', label: 'United States', description: 'US servers' },
      { value: 'eu', label: 'Europe', description: 'EU servers' },
      { value: 'ap', label: 'Asia Pacific', description: 'APAC servers' },
    ],
    allowCustom: false,
  },
]
```

### OAuth with Scopes/Permissions
```typescript
formFields: [
  {
    __typename: 'StringField',
    id: 'oauth-client-id',
    key: 'clientId',
    label: 'Client ID',
    required: true,
    widget: 'TEXT_INPUT',
    mode: 'READ_WRITE',
  },
  {
    __typename: 'SecretField',
    id: 'oauth-client-secret',
    key: 'clientSecret',
    label: 'Client Secret',
    required: true,
    widget: 'PASSWORD',
    mode: 'WRITE_ONLY',
    revealable: false,
  },
  {
    __typename: 'MultiSelectField',
    id: 'oauth-scopes',
    key: 'scopes',
    label: 'Permissions',
    required: true,
    widget: 'MULTISELECT',
    mode: 'READ_WRITE',
    minSelections: 1,
    options: [
      { value: 'read', label: 'Read Access' },
      { value: 'write', label: 'Write Access' },
    ],
  },
]
```

### Self-Hosted/On-Premises Service
```typescript
formFields: [
  {
    __typename: 'URLField',
    id: 'server-url',
    key: 'serverUrl',
    label: 'Server URL',
    description: 'Your self-hosted server address',
    required: true,
    widget: 'URL_INPUT',
    mode: 'READ_WRITE',
    placeholder: 'https://service.yourcompany.com',
  },
  // ... authentication fields
]
```

---

## ⚡ Quick Tips

### Field Naming
- **id**: `service-field-name` (kebab-case, globally unique)
- **key**: `fieldName` (camelCase, what gets saved)
- **label**: `Field Name` (Title Case, what users see)

### Required vs Optional
- `required: true` → User must fill this out
- `required: false` → User can leave blank

### Mode Options
- `READ_WRITE` → Users can see and edit (usernames, URLs)
- `WRITE_ONLY` → Hidden after entry (passwords, secrets)
- `READ_ONLY` → Display only, can't edit (instructions)

### Widget Types Reference
- `TEXT_INPUT` → Single-line text
- `TEXTAREA` → Multi-line text
- `PASSWORD` → Masked password field
- `EMAIL_INPUT` → Email with validation
- `URL_INPUT` → URL with validation
- `HOSTNAME_INPUT` → Hostname/subdomain
- `SELECT` → Dropdown menu
- `MULTISELECT` → Checkboxes (multiple)
- `TOGGLE` → On/off switch
- `MARKDOWN_DISPLAY` → Read-only instructions

### Common Placeholders
- Email: `admin@company.com`
- URL: `https://example.com`
- Subdomain: `mycompany`
- API Key: `sk_live_...` (show format)
- Username: `admin`

---

## 🔍 Finding Examples

Looking for a specific pattern? Check these connectors:

- **Simple API Key**: `activtrak`, `linear`, `notion`
- **OAuth 2.0**: `slack`, `google-admin`, `grammarly`
- **Multiple Variants**: `salesforce`, `jira`, `microsoft-365`
- **Subdomain + Credentials**: `bamboohr`, `confluence`, `okta`
- **Self-Hosted**: `gitlab`, `jira` (on-premises)
- **Regional Selection**: `sap-concur`
- **Complex Forms**: `salesforce` (OAuth variant)

---

## 🚨 Common Mistakes

### ❌ Missing Comma
```typescript
{
  key: 'field1',
  label: 'Field 1'
}  // ← Missing comma here
{
  key: 'field2',
```

### ✅ Correct
```typescript
{
  key: 'field1',
  label: 'Field 1'
},  // ← Comma added
{
  key: 'field2',
```

### ❌ Wrong Quote Types
```typescript
label: 'Field Name',
description: "Help text",  // Mixed quotes - inconsistent
```

### ✅ Correct
```typescript
label: 'Field Name',
description: 'Help text',  // Consistent single quotes
```

### ❌ Forgot __typename
```typescript
{
  id: 'my-field',
  key: 'field',
  // Missing __typename!
}
```

### ✅ Correct
```typescript
{
  __typename: 'StringField',  // Always include this!
  id: 'my-field',
  key: 'field',
}
```

---

## 📚 Need More Help?

- **Full Guide**: See `HOW-TO-ADD-A-CONNECTOR.md`
- **Examples**: Check `src/data/connectors.ts`
- **Schema**: See `integration-schema.graphql`
- **Support**: Ask in #integrations Slack channel

