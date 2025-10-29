# Salesforce API Key Integration

Configure Salesforce using username and security token authentication.

## Overview

API Key authentication uses your Salesforce username and security token for direct API access.

> ⚠️ **Note**: OAuth 2.0 is the recommended authentication method. Use API Key authentication only if OAuth is not available in your organization.

### When to Use API Key Authentication

- Your Salesforce org doesn't allow Connected Apps
- You need a simpler setup for testing/development
- You're using a service account for automation

### Limitations

- Requires password + security token (less secure than OAuth)
- No granular permission control
- Credentials must be manually rotated
- Subject to concurrent session limits

## Prerequisites

1. **Salesforce Account** with API access enabled
2. **Security Token** - You'll need to reset/generate this

## Step 1: Reset Your Security Token

1. Log in to Salesforce
2. Click your profile icon → **Settings**
3. In the left sidebar: **My Personal Information** → **Reset My Security Token**
4. Click **Reset Security Token**
5. Check your email - Salesforce will send your new security token

> 💡 **Tip**: If you don't see the "Reset Security Token" option, your Salesforce admin may have disabled it. Contact your admin or use OAuth instead.

## Step 2: Configure the Integration

Enter the following information in Parable:

| Field | Description | Example |
|-------|-------------|---------|
| **Subdomain** | Your Salesforce instance subdomain | `mycompany` |
| **Username** | Your Salesforce login email | `admin@company.com` |
| **Security Token** | Token from Step 1 | `[hidden]` |
| **Stakeholder Emails** | (Optional) Emails to notify on errors | `ops@company.com` |
| **API Scopes** | Select required permissions | `api`, `refresh_token` |
| **Expiry Date** | (Optional) Credential rotation reminder | `2025-12-31` |

### Understanding API Scopes

| Scope | Description | Required |
|-------|-------------|----------|
| **api** | Basic API access to read/write data | ✅ Yes |
| **refresh_token** | Maintain session without re-authentication | Recommended |
| **full** | Complete access to all data | Only if needed |
| **chatter_api** | Access Chatter features | Optional |

## Step 3: Test Connection

1. Click **Test Connection**
2. Parable will verify your credentials
3. If successful, you'll see: ✓ API credentials validated successfully

## Troubleshooting

### "Invalid credentials" error

**Cause**: Username or security token is incorrect.

**Solution**:
1. Verify your username is correct (usually your email)
2. Reset your security token again and use the new one
3. Ensure you're using the token, not your password

### "Login must use security token" error

**Cause**: Your IP address is not trusted by Salesforce.

**Solution**:
1. Concatenate your password with the security token
2. Or add Parable's IP addresses to your Salesforce Trusted IP Ranges:
   - Contact support@parable.io for our current IP ranges
   - In Salesforce Setup → Network Access → add the IP ranges

### "API is disabled" error

**Cause**: API access is not enabled for your user or org.

**Solution**:
- Contact your Salesforce administrator to enable API access
- Verify your Salesforce edition includes API access
- Check user permissions include "API Enabled"

## Security Best Practices

1. **Use a Service Account**: Create a dedicated integration user
2. **Minimum Permissions**: Grant only required permissions to the integration user
3. **IP Restrictions**: Configure Network Access in Salesforce Setup
4. **Monitor Access**: Review login history regularly
5. **Rotate Credentials**: Set an expiry date reminder and rotate tokens periodically

## Creating a Service Account (Recommended)

For production use, create a dedicated service account:

1. **Setup** → **Users** → **New User**
2. Configure:
   - **Username**: `integration@company.com`
   - **Email**: Your team email
   - **Profile**: Create a custom profile with minimum required permissions
   - **API Enabled**: ✅ Checked
3. Log in as the service account once to verify
4. Reset the security token for this account
5. Use this account's credentials in Parable

### Minimum Required Permissions

Your service account profile should have:

- **System Permissions**:
  - API Enabled
  - View Setup and Configuration (if needed)

- **Object Permissions** (based on your needs):
  - Read, Create, Edit on required objects
  - Example: Contacts, Leads, Opportunities

## Credential Management

### Storing Credentials Securely

Parable encrypts all credentials at rest using AES-256 encryption. Your security token is:
- Never logged
- Never displayed in the UI after initial entry
- Encrypted in our database
- Only decrypted when making API calls

### Rotating Credentials

To rotate your security token:

1. Reset the token in Salesforce (Step 1)
2. In Parable, edit your integration
3. Enter the new security token
4. Click **Test Connection** to verify
5. Save changes

Set an **Expiry Date** in the configuration to receive reminder notifications.

## API Rate Limits

Same limits apply as OAuth authentication. See [OAuth documentation](./oauth.md#api-rate-limits) for details.

## Migration to OAuth

We recommend migrating to OAuth 2.0 when possible:

1. Set up OAuth integration (see [OAuth guide](./oauth.md))
2. Test the new OAuth integration
3. Switch your data pipelines to use OAuth
4. Disable the API Key integration

## Support

Need help? Contact us:
- 📧 Email: support@parable.io
- 💬 Chat: [app.parable.io/support](https://app.parable.io/support)
- 📚 Docs: [docs.askparable.com](https://docs.askparable.com)

## Related Documentation

- [Salesforce OAuth 2.0 Setup](./oauth.md) (Recommended)
- [Salesforce Data Sync Configuration](./data-sync.md)
- [Managing Multiple Salesforce Orgs](./multi-org.md)

