# Salesforce OAuth 2.0 Integration

Configure Salesforce using OAuth 2.0 authentication for secure, token-based access.

## Overview

OAuth 2.0 is the **recommended** authentication method for Salesforce integrations. It provides:

- ✅ Enhanced security with token-based authentication
- ✅ Granular permission control
- ✅ Automatic token refresh
- ✅ No password storage required

## Prerequisites

Before you begin, you'll need:

1. **Salesforce Administrator Access** - Required to create Connected Apps
2. **Salesforce Edition** - Professional, Enterprise, Unlimited, or Developer Edition
3. **API Access Enabled** - Verify API access is enabled for your org

## Step 1: Create a Connected App in Salesforce

1. Log in to Salesforce as an Administrator
2. Navigate to **Setup** → **Apps** → **App Manager**
3. Click **New Connected App**
4. Fill in the basic information:
   - **Connected App Name**: `Parable Integration`
   - **API Name**: `Parable_Integration`
   - **Contact Email**: Your email address

### Enable OAuth Settings

5. Check **Enable OAuth Settings**
6. Set the **Callback URL**:
   ```
   https://app.parable.io/integrations/callback
   ```
7. Select OAuth Scopes:
   - `Access and manage your data (api)`
   - `Perform requests on your behalf at any time (refresh_token, offline_access)`
   - `Access your basic information (id, profile, email, address, phone)`

8. Click **Save**

> ⚠️ **Important**: After saving, it may take 2-10 minutes for the Connected App to be activated.

## Step 2: Retrieve OAuth Credentials

1. After the app is created, click **Manage Consumer Details**
2. You may need to verify your identity with a verification code
3. Copy the following values:
   - **Consumer Key** (this is your Client ID)
   - **Consumer Secret** (this is your Client Secret)

> 🔒 **Security Note**: Keep these credentials secure. Never commit them to version control or share them publicly.

## Step 3: Configure the Integration

Return to Parable and enter the following information:

| Field | Description | Example |
|-------|-------------|---------|
| **Subdomain** | Your Salesforce instance subdomain | `mycompany` (for mycompany.salesforce.com) |
| **Client ID** | Consumer Key from Step 2 | `3MVG9...` |
| **Client Secret** | Consumer Secret from Step 2 | `[hidden]` |
| **Callback URL** | OAuth redirect URL | `https://app.parable.io/integrations/callback` |
| **Environment** | Production or Sandbox | `production` |

## Step 4: Test Connection

1. Click **Test Connection**
2. You'll be redirected to Salesforce to authorize the app
3. Review the requested permissions
4. Click **Allow**
5. You'll be redirected back to Parable with a success message

## Troubleshooting

### "Invalid client credentials" error

**Cause**: The Client ID or Client Secret is incorrect.

**Solution**: 
- Double-check the Consumer Key and Consumer Secret from your Connected App
- Ensure you copied the entire key without any extra spaces
- Verify the Connected App is activated (wait 10 minutes after creation)

### "Redirect URI mismatch" error

**Cause**: The callback URL doesn't match the one configured in Salesforce.

**Solution**:
- Verify the Callback URL in your Connected App matches exactly: `https://app.parable.io/integrations/callback`
- No trailing slashes or extra characters

### "Insufficient permissions" error

**Cause**: The Connected App doesn't have the required OAuth scopes.

**Solution**:
- Edit your Connected App
- Ensure the following scopes are selected:
  - `api`
  - `refresh_token`
  - `id`

## Security Best Practices

1. **Use OAuth Policies**: Configure IP restrictions in the Connected App
2. **Rotate Credentials**: Periodically rotate your Client Secret
3. **Monitor Usage**: Review OAuth token usage in Salesforce Setup → Identity → OAuth Usage
4. **Limit Scopes**: Only grant the minimum required permissions

## API Rate Limits

Salesforce enforces API rate limits based on your edition:

| Edition | Daily API Calls |
|---------|----------------|
| Developer | 15,000 |
| Professional | 1,000 per license |
| Enterprise | 1,000 per license |
| Unlimited | 1,000 per license |

Parable optimizes API usage to stay within these limits.

## Support

Need help? Contact us:
- 📧 Email: support@parable.io
- 💬 Chat: [app.parable.io/support](https://app.parable.io/support)
- 📚 Docs: [docs.askparable.com](https://docs.askparable.com)

## Related Documentation

- [Salesforce API Key Setup](./api-key.md)
- [Salesforce Data Sync Configuration](./data-sync.md)
- [Managing Multiple Salesforce Orgs](./multi-org.md)

