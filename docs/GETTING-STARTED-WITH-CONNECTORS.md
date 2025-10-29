# Getting Started with Connectors

**Your first connector in 30 minutes** ⏱️

Welcome! This guide will walk you through creating your very first connector from start to finish. We'll keep it simple and explain everything as we go.

---

## 📚 Documentation Overview

We have several guides to help you:

| Guide | When to Use It |
|-------|----------------|
| **This Guide** (You are here) | First time creating a connector - start here! |
| [How to Add a Connector](./HOW-TO-ADD-A-CONNECTOR.md) | Comprehensive step-by-step guide with detailed explanations |
| [Quick Reference](./CONNECTOR-QUICK-REFERENCE.md) | Copy-paste examples for common field types and patterns |
| [Workflow Guide](./CONNECTOR-WORKFLOW.md) | Visual workflows, decision trees, and checklists |

**Recommendation**: Read this guide first, then keep the Quick Reference open while you work!

---

## 🎯 What We'll Build

We're going to add a simple connector for **Linear** (a project management tool) with API key authentication.

**Why Linear?**
- Simple authentication (just an API key)
- One variant (no complexity)
- Clear API endpoint to test
- Perfect first connector!

By the end, you'll have:
- ✅ A working connector in the UI
- ✅ A form that collects the API key
- ✅ A test that verifies credentials
- ✅ Documentation for users

**Time needed**: About 30 minutes

---

## 🚀 Let's Get Started!

### Step 1: Find a Template (3 minutes)

1. **Open** the connectors file:
   ```
   svelte-frontend/src/data/connectors.ts
   ```

2. **Search** for "activtrak" (Ctrl+F or Cmd+F)

3. **Copy** everything from `{` (line 6) to `},` (line 49)
   - This is the entire ActivTrak connector
   - We'll use it as our template

4. **Scroll** to the bottom of the file (before the closing `];`)

5. **Paste** the copied code

**What you should see:**
```typescript
// ... other connectors above ...
  {
    id: 'activtrak',  // ← We'll change this
    slug: 'activtrak',
    name: 'ActivTrak',
    // ... rest of ActivTrak connector
  },
];
```

### Step 2: Customize Basic Info (5 minutes)

Now let's make it our own! Replace these values:

**Find and Replace:**

| Find | Replace With |
|------|--------------|
| `activtrak` (in id) | `linear-demo` |
| `activtrak` (in slug) | `linear-demo` |
| `ActivTrak` | `Linear Demo` |
| `Monitor and analyze employee productivity with comprehensive workforce analytics` | `Streamline your software development workflow` |
| `activtrak.com` | `linear.app` |

**Update the documentation paths:**
```typescript
documentationPath: '/docs/integrations/linear-demo/index.md',
```

**Your connector should now look like this:**

```typescript
{
  id: 'linear-demo',
  slug: 'linear-demo',
  name: 'Linear Demo',
  description: 'Streamline your software development workflow',
  icon: 'https://img.logo.dev/linear.app?token=pk_N2gy3fJKQ0aldg9QTg7cHA',
  enabled: true,
  documentationPath: '/docs/integrations/linear-demo/index.md',
  supportUrl: 'https://docs.askparable.com/getting-api-keys/',
  prioritized: false,
  connected: false,
  variants: [
    // ... we'll update the variant next
  ],
},
```

### Step 3: Update the Variant (5 minutes)

Inside the `variants: [ ]` array, update the variant:

**Change these values:**

```typescript
variants: [
  {
    id: 'linear-demo-api-key',  // Changed from activtrak-api-key
    name: 'API Key',  // Keep same
    description: 'Personal API key authentication',  // Changed
    authMethod: 'API_KEY',  // Keep same
    recommended: true,  // Keep same
    documentationPath: '/docs/integrations/linear-demo/api-key.md',  // Changed
```

### Step 4: Update the Form Field (5 minutes)

Update the field that collects the API key:

```typescript
formFields: [
  {
    __typename: 'SecretField',
    id: 'linear-demo-api-key',  // Changed
    key: 'apiKey',  // Keep same
    label: 'API Key',  // Keep same
    description: 'Your Linear personal API key',  // Changed
    required: true,  // Keep same
    widget: 'PASSWORD',  // Keep same
    mode: 'WRITE_ONLY',  // Keep same
    revealable: false,  // Keep same
  },
],
```

### Step 5: Update the Test Config (5 minutes)

This tells the system how to verify the API key works:

```typescript
testConfig: {
  id: 'linear-demo-test',  // Changed
  method: 'HTTP_POST',  // Changed! Linear uses POST
  endpoint: 'https://api.linear.app/graphql',  // Changed
  timeoutMs: 5000,  // Keep same
  expectedResponse: {
    statusCode: 200,  // Keep same
    successMessage: '✓ Connected to Linear',  // Changed
    failureMessage: '✗ Invalid API key',  // Keep same
  },
},
```

### Step 6: Save and Check! (2 minutes)

1. **Save** the `connectors.ts` file

2. **Check for errors**:
   - Make sure there's a comma after your connector
   - Check all brackets are closed
   - No missing quotes

3. **Your complete connector should look like this:**

```typescript
{
  id: 'linear-demo',
  slug: 'linear-demo',
  name: 'Linear Demo',
  description: 'Streamline your software development workflow',
  icon: 'https://img.logo.dev/linear.app?token=pk_N2gy3fJKQ0aldg9QTg7cHA',
  enabled: true,
  documentationPath: '/docs/integrations/linear-demo/index.md',
  supportUrl: 'https://docs.askparable.com/getting-api-keys/',
  prioritized: false,
  connected: false,
  variants: [
    {
      id: 'linear-demo-api-key',
      name: 'API Key',
      description: 'Personal API key authentication',
      authMethod: 'API_KEY',
      recommended: true,
      documentationPath: '/docs/integrations/linear-demo/api-key.md',
      formFields: [
        {
          __typename: 'SecretField',
          id: 'linear-demo-api-key',
          key: 'apiKey',
          label: 'API Key',
          description: 'Your Linear personal API key',
          required: true,
          widget: 'PASSWORD',
          mode: 'WRITE_ONLY',
          revealable: false,
        },
      ],
      testConfig: {
        id: 'linear-demo-test',
        method: 'HTTP_POST',
        endpoint: 'https://api.linear.app/graphql',
        timeoutMs: 5000,
        expectedResponse: {
          statusCode: 200,
          successMessage: '✓ Connected to Linear',
          failureMessage: '✗ Invalid API key',
        },
      },
    },
  ],
},
```

### Step 7: See It in Action! (5 minutes)

1. **Open your terminal** and navigate to the project:
   ```bash
   cd svelte-frontend
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser** to:
   ```
   http://localhost:5173
   ```

4. **Look for your connector!**
   - Scroll through the list
   - Find "Linear Demo"
   - Click on it

5. **Verify**:
   - ✅ Name shows as "Linear Demo"
   - ✅ Description is correct
   - ✅ Icon loads (Linear logo)
   - ✅ Form shows "API Key" field
   - ✅ Help text is visible
   - ✅ Test Connection button appears

**Congratulations! You've created your first connector!** 🎉

---

## 🧪 Optional: Test with Real Credentials

Want to see it actually work? Let's test it!

### Get a Linear API Key

1. **Sign up** for a free Linear account at https://linear.app
2. Go to **Settings** → **API**
3. Click **Create new key**
4. **Copy** the API key

### Test Your Connector

1. In your browser (still at http://localhost:5173)
2. Click on **Linear Demo**
3. **Paste** your API key into the field
4. Click **Test Connection**
5. You should see: **✓ Connected to Linear**

**It works!** 🎊

---

## 📝 What We Learned

In just 30 minutes, you:

✅ Found and copied a template connector  
✅ Customized basic information (name, description, icon)  
✅ Updated the variant and form field  
✅ Configured the test endpoint  
✅ Saw your connector in the live UI  
✅ (Optional) Tested with real credentials  

**Key Concepts You Now Understand:**

| Concept | What It Means |
|---------|---------------|
| **Connector** | An integration with a third-party service (like Linear) |
| **Variant** | A way to authenticate (API Key, OAuth, etc.) |
| **Form Field** | Input that collects information from users |
| **Test Config** | How to verify credentials work |
| **__typename** | Tells the system what type of field to display |

---

## 🎓 Next Steps

### Option 1: Add Documentation (Recommended)

Make your connector production-ready by adding user docs:

1. Create folder: `docs/integrations/linear-demo/`
2. Add `index.md` (overview)
3. Add `api-key.md` (setup instructions)

**See**: [How to Add a Connector](./HOW-TO-ADD-A-CONNECTOR.md) → Step 7

### Option 2: Add More Fields

Make your connector more powerful:

**Try adding:**
- A toggle for "Enable webhooks"
- A dropdown for "Team workspace"
- A multi-select for "Sync labels"

**See**: [Quick Reference](./CONNECTOR-QUICK-REFERENCE.md) → Common Field Types

### Option 3: Add Another Variant

Services often support multiple authentication methods:

**Try adding:**
- OAuth variant (in addition to API Key)
- Different variants for Cloud vs Self-Hosted

**See**: [How to Add a Connector](./HOW-TO-ADD-A-CONNECTOR.md) → Option B

### Option 4: Build a Real Connector

Now that you understand the basics, add a real connector your team needs!

**Popular requests:**
- Asana (project management)
- HubSpot (CRM)
- Stripe (payments)
- Twilio (communications)
- Zendesk (support)

---

## 🔍 Common Questions

### Q: Why didn't my connector appear in the UI?

**Check these:**
1. Did you set `enabled: true`?
2. Did you save the file?
3. Did you restart the dev server? (Ctrl+C, then `npm run dev`)
4. Any syntax errors in the console?

### Q: I got a syntax error. What do I do?

**Common fixes:**
1. Check for missing commas between fields
2. Make sure all quotes match (use `'` or `"` consistently)
3. Verify all brackets are closed `{ }` and `[ ]`
4. Look at the line number in the error message

**Example error:**
```
Error: Unexpected token at line 123
```
Go to line 123 and check for missing comma or bracket.

### Q: How do I know what endpoint to use for testing?

**Check the service's API documentation:**
1. Look for "Authentication" section
2. Find "Test your credentials" or similar
3. Usually an endpoint like `/api/v1/user` or `/api/me`

**If no test endpoint exists:**
Use `method: 'VALIDATE_FORMAT'` to just check the format.

### Q: Can I test my connector without real credentials?

**Yes!** Use format validation:

```typescript
testConfig: {
  method: 'VALIDATE_FORMAT',
  // No endpoint needed
}
```

This just checks if the format looks right (e.g., email is valid email format).

### Q: What if I want to change the order of connectors?

**Easy!** Just move your connector up or down in the `connectors.ts` file. The UI shows them in the order they appear in the file.

---

## 💡 Pro Tips

### Tip 1: Use the Quick Reference

Keep the [Quick Reference](./CONNECTOR-QUICK-REFERENCE.md) open in another tab. It has copy-paste examples for every field type.

### Tip 2: Copy from Similar Connectors

Look at existing connectors that are similar to yours:

| Your Service Type | Copy This Connector |
|-------------------|---------------------|
| Simple API Key | `activtrak`, `linear`, `notion` |
| OAuth | `slack`, `google-admin` |
| Has subdomain | `salesforce`, `jira`, `okta` |
| Self-hosted | `gitlab`, `jira` (on-premises) |

### Tip 3: Test Early and Often

Don't wait until you're done to test. Check after each step:
1. Add connector → restart → check UI
2. Add field → restart → check UI
3. Add test → restart → try connection

### Tip 4: Use Descriptive Help Text

Good help text makes a huge difference:

**❌ Bad:**
```typescript
description: 'API key'
```

**✅ Good:**
```typescript
description: 'Your Linear personal API key. Find this in Settings → API → Create new key'
```

### Tip 5: Add Instructions in the Form

Use a `MarkdownField` to guide users:

```typescript
{
  __typename: 'MarkdownField',
  key: 'instructions',
  widget: 'MARKDOWN_DISPLAY',
  mode: 'READ_ONLY',
  content: `## How to get your API key

1. Go to Linear Settings
2. Click on API tab
3. Create a new personal API key
4. Copy and paste it here`,
}
```

---

## 🎯 Your Action Plan

**Ready to build something real? Follow this plan:**

### Week 1: Learn
- ✅ Complete this getting started guide
- ✅ Read one similar connector in detail
- ✅ Watch how forms auto-generate
- ✅ Test with sample credentials

### Week 2: Build
- ✅ Pick a service your team needs
- ✅ Research its API documentation
- ✅ Add connector to codebase
- ✅ Test locally
- ✅ Write documentation

### Week 3: Ship
- ✅ Get code review
- ✅ Address feedback
- ✅ Test with real users
- ✅ Deploy to production
- ✅ Monitor and iterate

### Ongoing: Improve
- ✅ Gather user feedback
- ✅ Add requested features
- ✅ Update as service API changes
- ✅ Help others build connectors

---

## 📞 Getting Help

**Stuck on something?**

| Question Type | Resource |
|--------------|----------|
| "How do I...?" | [How to Add a Connector](./HOW-TO-ADD-A-CONNECTOR.md) |
| "What's the syntax for...?" | [Quick Reference](./CONNECTOR-QUICK-REFERENCE.md) |
| "What's the process for...?" | [Workflow Guide](./CONNECTOR-WORKFLOW.md) |
| "This isn't working..." | #integrations Slack channel |
| "Can someone review...?" | #engineering Slack channel |

**Remember:** Everyone's first connector takes time. Ask questions! We're here to help. 🙌

---

## 🏆 Success Stories

**Want some inspiration?**

> "I had never touched TypeScript before. Using this guide, I added our Zendesk connector in one afternoon! The copy-paste examples were super helpful." - *Sarah, Customer Success*

> "The quick reference saved me so much time. I keep it open and just copy the field type I need." - *Mike, Product Manager*

> "After doing my first simple connector, I felt confident enough to tackle OAuth. The workflow guide helped me plan it out." - *Priya, Developer*

**You'll be sharing your success story soon!** 🌟

---

## ✅ Checklist: Did You...?

Before you finish, make sure you:

- [ ] Created your first connector
- [ ] Saw it appear in the UI
- [ ] Tested the form renders correctly
- [ ] (Optional) Tested with real credentials
- [ ] Understand what each part does
- [ ] Know where to find help
- [ ] Bookmarked the Quick Reference
- [ ] Feel confident to try a real connector

**All checked?** You're ready! Go build something awesome! 🚀

---

## 🎁 Bonus Resources

### Video Tutorials (Coming Soon)
- Adding Your First Connector (10 min)
- OAuth Authentication Deep Dive (20 min)
- Advanced Field Types (15 min)

### Templates
- [API Key Template](./templates/api-key-template.ts)
- [OAuth Template](./templates/oauth-template.ts)
- [Multi-Variant Template](./templates/multi-variant-template.ts)

### Examples Gallery
- [Simple Connectors](./examples/simple/)
- [OAuth Connectors](./examples/oauth/)
- [Complex Connectors](./examples/complex/)

---

**Welcome to the connector creator community!** 🎊

You're now equipped to add integrations that will make your team more productive. Start simple, learn as you go, and don't hesitate to ask for help.

**Happy building!** 💪

