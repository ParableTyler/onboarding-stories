# Connector Creation Workflow

**Visual guide to the connector creation process**

---

## 🗺️ The Big Picture

```
┌─────────────────────────────────────────────────────────────────┐
│                    CONNECTOR CREATION PROCESS                    │
└─────────────────────────────────────────────────────────────────┘

Step 1: PLAN                Step 2: CODE                Step 3: DOCUMENT
┌──────────────┐           ┌──────────────┐           ┌──────────────┐
│ Gather Info  │           │ Add to       │           │ Write Guide  │
│              │──────────▶│ connectors.ts│──────────▶│ in Markdown  │
│ • API docs   │           │              │           │              │
│ • Auth type  │           │ • Connector  │           │ • Setup steps│
│ • Endpoints  │           │ • Variant(s) │           │ • Screenshots│
└──────────────┘           │ • Fields     │           │ • Troublesh. │
                           │ • Test       │           └──────────────┘
                           └──────────────┘                   │
                                  │                           │
                                  ▼                           ▼
                           ┌──────────────┐           ┌──────────────┐
                           │ Step 4: TEST │           │ Step 5: SHIP │
                           │              │           │              │
                           │ • Visual     │──────────▶│ • Review     │
                           │ • Validate   │           │ • Deploy     │
                           │ • Credentials│           │ • Monitor    │
                           └──────────────┘           └──────────────┘
```

---

## 📋 Step 1: Planning Phase

**Goal**: Gather all the information you need before coding

### Information Checklist

#### About the Service
```
□ Service name
□ Category (CRM, Storage, Analytics, etc.)
□ Logo URL
□ Support/documentation URL
□ Brief description (1-2 sentences)
```

#### About Authentication
```
□ Authentication type (API Key, OAuth, etc.)
□ Required credentials
   □ Field 1: _________________
   □ Field 2: _________________
   □ Field 3: _________________
□ Optional configuration
   □ Regions/data centers?
   □ Permissions/scopes?
   □ Feature toggles?
```

#### About Testing
```
□ Test endpoint URL
□ Test method (GET, POST)
□ Expected success response
□ Expected error response
□ Timeout duration
```

### Example: Planning Zoom Integration

```
Service Info:
✅ Name: Zoom
✅ Category: Communication
✅ Logo: https://img.logo.dev/zoom.us?token=...
✅ Support: https://marketplace.zoom.us/docs/
✅ Description: "Host virtual meetings and webinars"

Authentication:
✅ Type: OAuth 2.0
✅ Required Fields:
   - Client ID (text input)
   - Client Secret (password)
   - Region (dropdown: US, EU)
   - Scopes (multi-select: meetings, users, recordings)

Testing:
✅ Endpoint: https://api.zoom.us/v2/users/me
✅ Method: GET
✅ Success: 200 status code
✅ Timeout: 5000ms
```

---

## 💻 Step 2: Coding Phase

**Goal**: Add your connector definition to the codebase

### File Structure

```
svelte-frontend/
└── src/
    └── data/
        └── connectors.ts  ← You'll edit this file
```

### The Anatomy of a Connector

```typescript
{
  // ═══════════════════════════════════════════════════════════
  // METADATA - Basic information about the service
  // ═══════════════════════════════════════════════════════════
  id: 'zoom',                    // Unique identifier
  slug: 'zoom',                  // URL-friendly name
  name: 'Zoom',                  // Display name
  description: 'Host virtual meetings...',
  icon: 'https://...',           // Logo URL
  category: 'Communication',     // Grouping
  enabled: true,                 // Show in UI?
  documentationPath: '/docs/integrations/zoom/index.md',
  supportUrl: 'https://...',
  prioritized: false,            // Internal priority flag
  connected: false,              // Initial connection state
  
  // ═══════════════════════════════════════════════════════════
  // VARIANTS - Different authentication methods
  // ═══════════════════════════════════════════════════════════
  variants: [
    {
      id: 'zoom-oauth',          // Variant identifier
      name: 'OAuth 2.0',         // Variant display name
      description: 'Secure OAuth...',
      authMethod: 'OAUTH2',      // Auth type
      recommended: true,         // Is this the best option?
      documentationPath: '/docs/integrations/zoom/oauth.md',
      
      // ═════════════════════════════════════════════════════
      // FORM FIELDS - What users need to fill out
      // ═════════════════════════════════════════════════════
      formFields: [
        {
          __typename: 'StringField',  // Field type
          id: 'zoom-client-id',       // Unique field ID
          key: 'clientId',            // Saved as this name
          label: 'Client ID',         // Label users see
          description: 'OAuth client ID...',
          required: true,             // Must fill out?
          widget: 'TEXT_INPUT',       // UI component
          mode: 'READ_WRITE',         // Visibility
          placeholder: 'abc123...',   // Example text
        },
        // ... more fields
      ],
      
      // ═════════════════════════════════════════════════════
      // TEST CONFIG - How to verify credentials work
      // ═════════════════════════════════════════════════════
      testConfig: {
        id: 'zoom-test',
        method: 'HTTP_GET',         // Test method
        endpoint: 'https://api.zoom.us/v2/users/me',
        timeoutMs: 5000,
        expectedResponse: {
          statusCode: 200,
          successMessage: '✓ Connected',
          failureMessage: '✗ Failed',
        },
      },
    },
  ],
}
```

### Workflow in connectors.ts

```
1. Open connectors.ts
         │
         ▼
2. Scroll to bottom (before closing ];)
         │
         ▼
3. Find a similar connector to copy
   (API Key? Copy ActivTrak)
   (OAuth? Copy Slack)
   (Multiple variants? Copy Salesforce)
         │
         ▼
4. Paste and modify:
   • Change IDs
   • Update names
   • Modify fields
   • Update test config
         │
         ▼
5. Add comma after previous entry
         │
         ▼
6. Save file
```

---

## 📝 Step 3: Documentation Phase

**Goal**: Write clear instructions for users

### Documentation Structure

```
docs/
└── integrations/
    └── zoom/                   ← Create this folder
        ├── index.md            ← Overview
        └── oauth.md            ← Variant-specific guide
```

### Documentation Template Outline

#### `index.md` - Overview
```markdown
1. Introduction
   • What is this service?
   • What can you do with it?

2. Authentication Methods
   • List all variants
   • Recommend the best one
   • Link to detailed guides

3. Quick Links
   • Setup guides
   • Support contact
   • API documentation
```

#### `oauth.md` - Detailed Setup
```markdown
1. Prerequisites
   • What you need before starting
   • Required permissions/access

2. Step-by-Step Instructions
   • Numbered steps
   • Screenshots (if helpful)
   • Code examples

3. Configuration in Parable
   • What to enter in each field
   • Where to find values

4. Troubleshooting
   • Common errors
   • Solutions
   • Who to contact

5. Security Best Practices
   • Credential management
   • Permission scoping
   • Monitoring

6. Next Steps
   • What to do after connecting
```

### Documentation Writing Tips

**✅ DO:**
- Use simple language
- Include specific examples
- Add screenshots for complex UIs
- Provide troubleshooting for common errors
- Link to official documentation
- Show example values

**❌ DON'T:**
- Assume technical knowledge
- Use jargon without explanation
- Skip error scenarios
- Forget to update screenshots when UI changes
- Leave out contact information

---

## 🧪 Step 4: Testing Phase

**Goal**: Verify everything works correctly

### Testing Checklist

#### Visual Testing
```bash
cd svelte-frontend
npm run dev
# Open http://localhost:3000
```

**Check:**
```
□ Connector appears in list
□ Icon loads correctly
□ Name and description are clear
□ Clicking opens the form
□ All variants show as tabs
□ All fields render properly
□ Help text is visible
□ Placeholders make sense
□ Required fields are marked
```

#### Schema Validation
```bash
node scripts/validate-schema.js
```

**This checks for:**
```
□ No syntax errors
□ All required properties present
□ Valid field types
□ Correct structure
□ No duplicate IDs
```

#### Functional Testing

**Test with Real Credentials:**
```
□ Fill out form with valid credentials
□ Click "Test Connection"
□ Verify success message appears
□ Check connection saves correctly
```

**Test with Invalid Credentials:**
```
□ Use wrong API key
□ Verify clear error message
□ Check error doesn't expose secrets
```

**Test Edge Cases:**
```
□ Leave required fields empty
□ Enter invalid email format
□ Enter malformed URL
□ Select no options in multi-select
□ Toggle all boolean switches
```

#### User Acceptance Testing

**Have a colleague try it:**
```
□ Can they complete setup without help?
□ Is documentation clear?
□ Did they encounter any confusion?
□ What suggestions do they have?
```

---

## 🚀 Step 5: Shipping Phase

**Goal**: Deploy your connector for users

### Pre-Deployment Checklist

```
CODE:
□ All fields have clear labels
□ Descriptions explain what's needed
□ Test config is correct
□ No hardcoded credentials
□ IDs are unique
□ Syntax is valid

DOCUMENTATION:
□ Setup guide is complete
□ Screenshots are current
□ Troubleshooting covers common issues
□ Links are not broken
□ Contact info is correct
□ Security best practices included

TESTING:
□ Schema validates
□ Visual check passes
□ Works with real credentials
□ Errors are clear
□ Edge cases handled
□ User tested successfully
```

### Deployment Steps

```
1. Create Pull Request
   │
   ▼
2. Request Code Review
   • Check for errors
   • Verify best practices
   • Test locally
   │
   ▼
3. Address Feedback
   • Fix any issues
   • Update documentation
   • Retest
   │
   ▼
4. Merge to Main
   │
   ▼
5. Deploy to Production
   │
   ▼
6. Monitor
   • Watch for errors
   • Gather user feedback
   • Fix issues quickly
   │
   ▼
7. Iterate
   • Improve based on feedback
   • Add requested features
   • Update documentation
```

### Post-Deployment Monitoring

**Week 1: Watch closely**
- Check error logs daily
- Monitor support tickets
- Gather initial feedback
- Fix critical issues immediately

**Week 2-4: Stabilize**
- Review usage patterns
- Optimize based on feedback
- Update documentation as needed
- Plan improvements

**Ongoing:**
- Monitor API changes from service
- Update when service updates
- Refresh documentation quarterly
- Rotate test credentials

---

## 🎯 Quick Decision Trees

### "What field type should I use?"

```
Need to collect...
│
├─ Simple text (username, ID)?
│  └─ StringField
│
├─ Password or secret?
│  └─ SecretField (mode: WRITE_ONLY)
│
├─ Email address?
│  └─ EmailField
│
├─ Website URL?
│  └─ URLField
│
├─ One choice from a list?
│  └─ SelectField
│
├─ Multiple choices from a list?
│  └─ MultiSelectField
│
├─ Yes/No toggle?
│  └─ BooleanField
│
└─ Instructions/help text?
   └─ MarkdownField
```

### "What auth method should I use?"

```
Service offers...
│
├─ Username + Password only?
│  └─ authMethod: 'USERNAME_PASSWORD'
│
├─ API key or token?
│  └─ authMethod: 'API_KEY'
│
├─ OAuth (with client ID/secret)?
│  └─ authMethod: 'OAUTH2'
│
├─ Basic authentication?
│  └─ authMethod: 'BASIC_AUTH'
│
└─ Service account JSON?
   └─ authMethod: 'SERVICE_ACCOUNT'
```

### "How should I test the connection?"

```
Can you make an API call?
│
├─ YES
│  │
│  ├─ GET request? → method: 'HTTP_GET'
│  │
│  └─ POST request? → method: 'HTTP_POST'
│
└─ NO (just validate format)
   └─ method: 'VALIDATE_FORMAT'
```

---

## 📊 Time Estimates

**How long does each phase take?**

| Phase | Simple Connector | Complex Connector | Notes |
|-------|-----------------|-------------------|-------|
| **Planning** | 30 min | 2 hours | Research, gather info |
| **Coding** | 1 hour | 4 hours | Add to connectors.ts |
| **Documentation** | 1 hour | 3 hours | Write setup guide |
| **Testing** | 30 min | 2 hours | All test types |
| **Review** | 30 min | 1 hour | Code review, fixes |
| **TOTAL** | ~4 hours | ~12 hours | First time |

**Notes:**
- Times are for your first connector
- Subsequent connectors are faster (60% of time)
- Complex = OAuth + multi-variant + custom fields
- Simple = Single API key field

---

## 🆘 Common Issues & Solutions

### Issue: "My connector doesn't appear"

**Check:**
1. Is `enabled: true`?
2. Did you save the file?
3. Did you restart the dev server?
4. Is there a syntax error? (check console)

### Issue: "Form fields don't show"

**Check:**
1. Are fields inside `formFields: [ ]` array?
2. Did you include `__typename` for each field?
3. Are there any missing commas?
4. Is the variant inside `variants: [ ]`?

### Issue: "Test connection fails"

**Check:**
1. Is the endpoint URL correct?
2. Does the API require authentication headers?
3. Is the timeout too short?
4. Are you testing with valid credentials?
5. Check network tab in browser dev tools

### Issue: "Validation errors"

**Fix:**
1. Run `node scripts/validate-schema.js`
2. Read error messages carefully
3. Check for missing required fields
4. Verify all IDs are unique
5. Ensure proper TypeScript syntax

---

## 🎓 Learning Path

**Recommended order for learning:**

1. **Start with reading** existing connectors
   - Read `ActivTrak` (simple API key)
   - Read `Slack` (OAuth)
   - Read `Salesforce` (multiple variants)

2. **Copy and modify** a simple connector
   - Clone ActivTrak
   - Change names and IDs
   - Test locally

3. **Add your first real connector**
   - Choose a simple service
   - Follow this guide
   - Ask for help when stuck

4. **Try a complex connector**
   - Multiple variants
   - OAuth flow
   - Custom fields

5. **Improve existing connectors**
   - Add missing fields
   - Improve documentation
   - Fix bugs

---

## 📞 Getting Help

**Stuck? Here's who to ask:**

| Question | Resource |
|----------|----------|
| "How do I add X field type?" | Quick Reference Guide |
| "Why isn't my connector showing?" | Troubleshooting section above |
| "Can someone review my connector?" | #integrations Slack channel |
| "Is this the right approach?" | Post in #engineering |
| "Service API is confusing" | Check service's official docs |
| "Something is broken" | File a GitHub issue |

**Remember**: Everyone's first connector takes time. Don't hesitate to ask questions! 🙌

---

## ✨ Success Criteria

**You'll know you're done when:**

✅ Connector appears in the UI  
✅ Form renders all fields correctly  
✅ Test connection works with valid credentials  
✅ Error messages are clear  
✅ Documentation is complete  
✅ A colleague can set it up without your help  
✅ Schema validation passes  
✅ Code review is approved  

**Congratulations! You've shipped a connector! 🎉**

---

## 🔄 Continuous Improvement

**After your connector is live:**

1. **Monitor usage**
   - Are people using it?
   - Where do they get stuck?
   - What features are they requesting?

2. **Gather feedback**
   - Support tickets
   - User interviews
   - Analytics

3. **Iterate**
   - Fix bugs quickly
   - Add requested features
   - Improve documentation
   - Optimize performance

4. **Stay updated**
   - Service API changes
   - New authentication methods
   - Security updates
   - Best practices

**The best connectors evolve over time!** 🌱

