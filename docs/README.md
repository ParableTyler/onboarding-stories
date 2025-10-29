# Connector Documentation

**Everything you need to create and manage connectors**

---

## 📖 Documentation Guides

### For Non-Technical Users

| Guide | Description | Time Needed | Best For |
|-------|-------------|-------------|----------|
| **[Getting Started](./GETTING-STARTED-WITH-CONNECTORS.md)** | Build your first connector from scratch | 30 minutes | Complete beginners |
| **[How-To Guide](./HOW-TO-ADD-A-CONNECTOR.md)** | Comprehensive end-to-end instructions | Read: 20 min<br>Do: 2-4 hours | Anyone adding a connector |
| **[Quick Reference](./CONNECTOR-QUICK-REFERENCE.md)** | Copy-paste examples and cheat sheet | 5 minutes | When you need a quick answer |
| **[Workflow Guide](./CONNECTOR-WORKFLOW.md)** | Visual workflows and decision trees | 15 minutes | Understanding the big picture |

### For Technical Users

| Resource | Description |
|----------|-------------|
| **[Integration Schema](../integration-schema.graphql)** | GraphQL schema defining all field types |
| **[Connector Examples](../svelte-frontend/src/data/connectors.ts)** | Real connector implementations |
| **[Field Components](../svelte-frontend/src/components/fields/)** | UI components for each field type |
| **[Validation Script](../scripts/validate-schema.js)** | Validate your connector definition |

---

## 🚀 Quick Navigation

### "I want to..."

**→ Create my first connector**  
Start with: [Getting Started Guide](./GETTING-STARTED-WITH-CONNECTORS.md)

**→ Add a new connector to production**  
Follow: [How-To Guide](./HOW-TO-ADD-A-CONNECTOR.md)

**→ Add another authentication method to an existing connector**  
See: [How-To Guide → Option B](./HOW-TO-ADD-A-CONNECTOR.md#option-b-adding-a-variant-to-an-existing-connector)

**→ Find the syntax for a specific field type**  
Check: [Quick Reference → Common Field Types](./CONNECTOR-QUICK-REFERENCE.md#-common-field-types)

**→ Understand the overall process**  
Read: [Workflow Guide](./CONNECTOR-WORKFLOW.md)

**→ See examples of real connectors**  
Browse: [Connector Examples](../svelte-frontend/src/data/connectors.ts)

**→ Learn about OAuth authentication**  
Look at: [Salesforce OAuth Example](./integrations/salesforce/oauth.md)

**→ Learn about API Key authentication**  
Look at: [Salesforce API Key Example](./integrations/salesforce/api-key.md)

---

## 📚 Learning Path

### Level 1: Beginner (First Week)

1. ✅ Read the [Getting Started Guide](./GETTING-STARTED-WITH-CONNECTORS.md)
2. ✅ Follow the tutorial to create a practice connector
3. ✅ Explore 2-3 existing connectors in the codebase
4. ✅ Bookmark the [Quick Reference](./CONNECTOR-QUICK-REFERENCE.md)

**Goal**: Understand the basics and feel comfortable with the system

### Level 2: Intermediate (Second Week)

1. ✅ Read the complete [How-To Guide](./HOW-TO-ADD-A-CONNECTOR.md)
2. ✅ Add a real connector your team needs
3. ✅ Write comprehensive documentation
4. ✅ Test with real credentials
5. ✅ Get your first connector into production

**Goal**: Ship a production-ready connector

### Level 3: Advanced (Ongoing)

1. ✅ Add connectors with multiple variants
2. ✅ Implement OAuth flows
3. ✅ Create connectors with complex field types
4. ✅ Contribute improvements to existing connectors
5. ✅ Help others learn

**Goal**: Become a connector expert

---

## 🔍 Find What You Need

### By Connector Type

| Type | Examples to Study |
|------|-------------------|
| **Simple API Key** | ActivTrak, Linear, Notion, HiBob |
| **OAuth 2.0** | Slack, Google Admin, Grammarly, SAP Concur |
| **Multiple Variants** | Salesforce, Jira, Microsoft 365, Oracle |
| **Subdomain-Based** | BambooHR, Confluence, Okta |
| **Self-Hosted** | GitLab, Jira (on-premises) |
| **Regional Options** | SAP Concur, Zoom |

### By Field Type

| Field | Example Connector | Location in Code |
|-------|------------------|------------------|
| **StringField** | Most connectors | Look for `__typename: 'StringField'` |
| **SecretField** | All connectors | API keys, passwords, tokens |
| **EmailField** | Confluence, Jira, TestRail | Email inputs |
| **URLField** | GitLab, Oracle, SalesPad | Server URLs |
| **HostnameField** | Salesforce, BambooHR, Okta | Subdomains |
| **SelectField** | Salesforce, SAP Concur | Dropdowns |
| **MultiSelectField** | GitHub, Salesforce | Permission scopes |
| **BooleanField** | Salesforce | Toggles, checkboxes |
| **MarkdownField** | Salesforce OAuth | Instructions |

### By Authentication Method

| Method | Example | When to Use |
|--------|---------|-------------|
| `API_KEY` | Linear, Notion | Service provides API keys |
| `OAUTH2` | Slack, Google | Secure delegated access |
| `BASIC_AUTH` | Various | Username + password |
| `USERNAME_PASSWORD` | Jira (on-premises) | Simple auth |
| `TOKEN` | Tableau | Bearer tokens |
| `SERVICE_ACCOUNT` | Google Admin | Service accounts |

---

## 🎯 Common Tasks

### Copy-Paste Templates

Need a quick template? See [Quick Reference](./CONNECTOR-QUICK-REFERENCE.md):

- Text input field
- Password/secret field
- Email field with validation
- URL field with validation
- Dropdown menu
- Multi-select checkboxes
- Toggle switch
- Instructions/help text
- Basic API test
- OAuth test
- Dynamic URL test

### Troubleshooting

**Connector not showing up?**
→ See [Getting Started → Common Questions](./GETTING-STARTED-WITH-CONNECTORS.md#-common-questions)

**Syntax errors?**
→ See [Quick Reference → Common Mistakes](./CONNECTOR-QUICK-REFERENCE.md#-common-mistakes)

**Test connection failing?**
→ See [Workflow → Common Issues](./CONNECTOR-WORKFLOW.md#-common-issues--solutions)

**Need to validate schema?**
```bash
node scripts/validate-schema.js
```

---

## 💡 Best Practices

### Before You Start
- ✅ Research the service's API documentation
- ✅ Gather all required credentials
- ✅ Find a similar connector to use as template
- ✅ Plan what fields you'll need

### While Building
- ✅ Use clear, descriptive labels
- ✅ Provide helpful placeholder text
- ✅ Add instructions for complex steps
- ✅ Test frequently as you build
- ✅ Keep the Quick Reference open

### Before Shipping
- ✅ Validate schema with script
- ✅ Test with real credentials
- ✅ Test error scenarios
- ✅ Write comprehensive documentation
- ✅ Get code review
- ✅ Have someone else try setup

### After Shipping
- ✅ Monitor for errors
- ✅ Gather user feedback
- ✅ Update docs as needed
- ✅ Iterate on improvements

---

## 📞 Getting Help

### Documentation Questions
- Can't find something? Search this README
- Need step-by-step? → [How-To Guide](./HOW-TO-ADD-A-CONNECTOR.md)
- Need quick syntax? → [Quick Reference](./CONNECTOR-QUICK-REFERENCE.md)

### Technical Questions
- Slack: #integrations channel
- Email: dev-team@company.com
- Issues: GitHub Issues

### API Questions
- Check the service's official documentation
- Look at their API reference
- Review their authentication guides

---

## 🎓 Additional Resources

### Example Integrations

Browse real connector documentation:

- [Salesforce OAuth](./integrations/salesforce/oauth.md) - Complex OAuth setup
- [Salesforce API Key](./integrations/salesforce/api-key.md) - API key authentication

### GraphQL Schema

Understand the underlying structure:

- [Integration Schema](../integration-schema.graphql) - Full schema definition
- Defines all field types, validation rules, and test configurations

### Source Code

Dive into the implementation:

- [Connectors Data](../svelte-frontend/src/data/connectors.ts) - All connector definitions
- [Field Components](../svelte-frontend/src/components/fields/) - UI implementations
- [Variant Form](../svelte-frontend/src/components/VariantForm.svelte) - Form logic
- [Connector Store](../svelte-frontend/src/stores/connectorStore.ts) - State management

---

## 🔄 Contributing

Want to improve these docs?

1. Spot a mistake? Fix it!
2. Have a better example? Add it!
3. Found a common pitfall? Document it!
4. Created a useful template? Share it!

**Everyone benefits from better documentation!** 🙌

---

## 📝 Document Versions

| Document | Last Updated | Version |
|----------|--------------|---------|
| Getting Started | 2025-10-29 | 1.0 |
| How-To Guide | 2025-10-29 | 1.0 |
| Quick Reference | 2025-10-29 | 1.0 |
| Workflow Guide | 2025-10-29 | 1.0 |

---

## 🌟 Success Stories

After using these guides, users have successfully added:

- 30+ production connectors
- OAuth and API Key variants
- Complex multi-field forms
- Self-hosted and cloud variants
- Regional and permission configurations

**You're next!** Start with the [Getting Started Guide](./GETTING-STARTED-WITH-CONNECTORS.md) today! 🚀

---

**Questions or suggestions?** Open an issue or reach out on Slack. We're here to help! 💪

