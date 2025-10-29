export interface OrganizationUser {
  name: string;
  email: string;
  parableRole: 'sponsor' | 'integrator' | 'project-manager';
  jobTitle: string;
  lastSeen: string;
}

export interface OrganizationPlugin {
  id: string;
  name: string;
  icon: string;
  status: 'connected' | 'not-connected';
  prioritized: boolean;
  nextNudgeDate: string | null;
}

export interface Organization {
  id: string;
  name: string;
  domain: string;
  users: OrganizationUser[];
  plugins: OrganizationPlugin[];
  prioritizedIntegrations: number;
  connectedIntegrations: number;
}

export const organizations: Organization[] = [
  {
    id: '1',
    name: 'Nike',
    domain: 'nike.com',
    users: [
      { name: 'Sarah Johnson', email: 'sarah@nike.com', parableRole: 'sponsor', jobTitle: 'VP of Engineering', lastSeen: '2025-10-29T10:30:00Z' },
      { name: 'Alex Martinez', email: 'alex@nike.com', parableRole: 'sponsor', jobTitle: 'Head of AI', lastSeen: '2025-10-29T09:45:00Z' },
      { name: 'Mike Chen', email: 'mike@nike.com', parableRole: 'integrator', jobTitle: 'Director of IT', lastSeen: '2025-10-28T15:20:00Z' },
      { name: 'Emma Davis', email: 'emma@nike.com', parableRole: 'project-manager', jobTitle: 'Product Manager', lastSeen: '2025-10-27T09:15:00Z' },
    ],
    plugins: [
      { id: 'sf', name: 'Salesforce', icon: 'https://img.logo.dev/salesforce.com?token=pk_N2gy3fJKQ0aldg9QTg7cHA', status: 'not-connected', prioritized: true, nextNudgeDate: '2025-11-02' },
      { id: 'slack', name: 'Slack', icon: 'https://img.logo.dev/slack.com?token=pk_N2gy3fJKQ0aldg9QTg7cHA', status: 'connected', prioritized: false, nextNudgeDate: null },
      { id: 'zoom', name: 'Zoom', icon: 'https://img.logo.dev/zoom.us?token=pk_N2gy3fJKQ0aldg9QTg7cHA', status: 'connected', prioritized: false, nextNudgeDate: null },
      { id: 'hubspot', name: 'HubSpot', icon: 'https://img.logo.dev/hubspot.com?token=pk_N2gy3fJKQ0aldg9QTg7cHA', status: 'not-connected', prioritized: true, nextNudgeDate: '2025-10-31' },
      { id: 'github', name: 'GitHub', icon: 'https://img.logo.dev/github.com?token=pk_N2gy3fJKQ0aldg9QTg7cHA', status: 'connected', prioritized: false, nextNudgeDate: null },
    ],
    prioritizedIntegrations: 2,
    connectedIntegrations: 3,
  },
  {
    id: '2',
    name: 'Walmart',
    domain: 'walmart.com',
    users: [
      { name: 'David Williams', email: 'david@walmart.com', parableRole: 'sponsor', jobTitle: 'CTO', lastSeen: '2025-10-29T08:45:00Z' },
      { name: 'Lisa Anderson', email: 'lisa@walmart.com', parableRole: 'sponsor', jobTitle: 'Director of IT', lastSeen: '2025-10-29T11:00:00Z' },
    ],
    plugins: [
      { id: 'slack', name: 'Slack', icon: 'https://img.logo.dev/slack.com?token=pk_N2gy3fJKQ0aldg9QTg7cHA', status: 'connected', prioritized: false, nextNudgeDate: null },
      { id: 'github', name: 'GitHub', icon: 'https://img.logo.dev/github.com?token=pk_N2gy3fJKQ0aldg9QTg7cHA', status: 'connected', prioritized: false, nextNudgeDate: null },
      { id: 'jira', name: 'Jira', icon: 'https://img.logo.dev/atlassian.com?token=pk_N2gy3fJKQ0aldg9QTg7cHA', status: 'connected', prioritized: false, nextNudgeDate: null },
    ],
    prioritizedIntegrations: 0,
    connectedIntegrations: 3,
  },
  {
    id: '3',
    name: 'Target',
    domain: 'target.com',
    users: [
      { name: 'James Brown', email: 'james@target.com', parableRole: 'sponsor', jobTitle: 'Engineering Manager', lastSeen: '2025-10-28T16:30:00Z' },
      { name: 'Maria Garcia', email: 'maria@target.com', parableRole: 'integrator', jobTitle: 'IT Manager', lastSeen: '2025-10-29T09:20:00Z' },
      { name: 'Tom Wilson', email: 'tom@target.com', parableRole: 'integrator', jobTitle: 'Systems Engineer', lastSeen: '2025-10-26T14:45:00Z' },
      { name: 'Amy Taylor', email: 'amy@target.com', parableRole: 'project-manager', jobTitle: 'Business Analyst', lastSeen: '2025-10-29T10:15:00Z' },
    ],
    plugins: [
      { id: 'sf', name: 'Salesforce', icon: 'https://img.logo.dev/salesforce.com?token=pk_N2gy3fJKQ0aldg9QTg7cHA', status: 'not-connected', prioritized: true, nextNudgeDate: '2025-10-30' },
      { id: 'hubspot', name: 'HubSpot', icon: 'https://img.logo.dev/hubspot.com?token=pk_N2gy3fJKQ0aldg9QTg7cHA', status: 'not-connected', prioritized: true, nextNudgeDate: '2025-11-01' },
      { id: 'zoom', name: 'Zoom', icon: 'https://img.logo.dev/zoom.us?token=pk_N2gy3fJKQ0aldg9QTg7cHA', status: 'connected', prioritized: false, nextNudgeDate: null },
      { id: 'github', name: 'GitHub', icon: 'https://img.logo.dev/github.com?token=pk_N2gy3fJKQ0aldg9QTg7cHA', status: 'connected', prioritized: false, nextNudgeDate: null },
      { id: 'notion', name: 'Notion', icon: 'https://img.logo.dev/notion.so?token=pk_N2gy3fJKQ0aldg9QTg7cHA', status: 'not-connected', prioritized: false, nextNudgeDate: null },
    ],
    prioritizedIntegrations: 2,
    connectedIntegrations: 2,
  },
  {
    id: '4',
    name: 'CVS Health',
    domain: 'cvshealth.com',
    users: [
      { name: 'Robert Martinez', email: 'robert@cvshealth.com', parableRole: 'sponsor', jobTitle: 'Head of IT', lastSeen: '2025-10-29T07:30:00Z' },
      { name: 'Jennifer Lee', email: 'jennifer@cvshealth.com', parableRole: 'integrator', jobTitle: 'Systems Analyst', lastSeen: '2025-10-28T13:45:00Z' },
    ],
    plugins: [
      { id: 'sf', name: 'Salesforce', icon: 'https://img.logo.dev/salesforce.com?token=pk_N2gy3fJKQ0aldg9QTg7cHA', status: 'not-connected', prioritized: true, nextNudgeDate: '2025-11-05' },
      { id: 'slack', name: 'Slack', icon: 'https://img.logo.dev/slack.com?token=pk_N2gy3fJKQ0aldg9QTg7cHA', status: 'connected', prioritized: false, nextNudgeDate: null },
      { id: 'github', name: 'GitHub', icon: 'https://img.logo.dev/github.com?token=pk_N2gy3fJKQ0aldg9QTg7cHA', status: 'connected', prioritized: false, nextNudgeDate: null },
    ],
    prioritizedIntegrations: 1,
    connectedIntegrations: 2,
  },
  {
    id: '5',
    name: 'Walgreens',
    domain: 'walgreens.com',
    users: [
      { name: 'Chris Anderson', email: 'chris@walgreens.com', parableRole: 'sponsor', jobTitle: 'VP of Operations', lastSeen: '2025-10-29T12:00:00Z' },
      { name: 'Nicole Thomas', email: 'nicole@walgreens.com', parableRole: 'sponsor', jobTitle: 'Marketing Director', lastSeen: '2025-10-29T11:30:00Z' },
      { name: 'Alex Johnson', email: 'alex@walgreens.com', parableRole: 'integrator', jobTitle: 'IT Manager', lastSeen: '2025-10-27T16:20:00Z' },
    ],
    plugins: [
      { id: 'sf', name: 'Salesforce', icon: 'https://img.logo.dev/salesforce.com?token=pk_N2gy3fJKQ0aldg9QTg7cHA', status: 'connected', prioritized: false, nextNudgeDate: null },
      { id: 'slack', name: 'Slack', icon: 'https://img.logo.dev/slack.com?token=pk_N2gy3fJKQ0aldg9QTg7cHA', status: 'connected', prioritized: false, nextNudgeDate: null },
      { id: 'zoom', name: 'Zoom', icon: 'https://img.logo.dev/zoom.us?token=pk_N2gy3fJKQ0aldg9QTg7cHA', status: 'connected', prioritized: false, nextNudgeDate: null },
    ],
    prioritizedIntegrations: 0,
    connectedIntegrations: 3,
  },
  {
    id: '6',
    name: 'Home Depot',
    domain: 'homedepot.com',
    users: [
      { name: 'Patricia White', email: 'patricia@homedepot.com', parableRole: 'sponsor', jobTitle: 'COO', lastSeen: '2025-10-28T10:15:00Z' },
      { name: 'Kevin Harris', email: 'kevin@homedepot.com', parableRole: 'integrator', jobTitle: 'Operations Manager', lastSeen: '2025-10-29T08:30:00Z' },
    ],
    plugins: [
      { id: 'sf', name: 'Salesforce', icon: 'https://img.logo.dev/salesforce.com?token=pk_N2gy3fJKQ0aldg9QTg7cHA', status: 'not-connected', prioritized: true, nextNudgeDate: '2025-11-03' },
      { id: 'slack', name: 'Slack', icon: 'https://img.logo.dev/slack.com?token=pk_N2gy3fJKQ0aldg9QTg7cHA', status: 'connected', prioritized: false, nextNudgeDate: null },
    ],
    prioritizedIntegrations: 1,
    connectedIntegrations: 1,
  },
  {
    id: '7',
    name: 'Kroger',
    domain: 'kroger.com',
    users: [
      { name: 'Daniel Clark', email: 'daniel@kroger.com', parableRole: 'sponsor', jobTitle: 'CIO', lastSeen: '2025-10-29T14:00:00Z' },
      { name: 'Rachel Moore', email: 'rachel@kroger.com', parableRole: 'integrator', jobTitle: 'Project Manager', lastSeen: '2025-10-29T09:45:00Z' },
      { name: 'Steve Jackson', email: 'steve@kroger.com', parableRole: 'integrator', jobTitle: 'IT Director', lastSeen: '2025-10-28T11:30:00Z' },
    ],
    plugins: [
      { id: 'sf', name: 'Salesforce', icon: 'https://img.logo.dev/salesforce.com?token=pk_N2gy3fJKQ0aldg9QTg7cHA', status: 'not-connected', prioritized: true, nextNudgeDate: '2025-10-31' },
      { id: 'slack', name: 'Slack', icon: 'https://img.logo.dev/slack.com?token=pk_N2gy3fJKQ0aldg9QTg7cHA', status: 'connected', prioritized: false, nextNudgeDate: null },
      { id: 'github', name: 'GitHub', icon: 'https://img.logo.dev/github.com?token=pk_N2gy3fJKQ0aldg9QTg7cHA', status: 'connected', prioritized: false, nextNudgeDate: null },
      { id: 'zoom', name: 'Zoom', icon: 'https://img.logo.dev/zoom.us?token=pk_N2gy3fJKQ0aldg9QTg7cHA', status: 'connected', prioritized: false, nextNudgeDate: null },
    ],
    prioritizedIntegrations: 1,
    connectedIntegrations: 3,
  },
  {
    id: '8',
    name: 'Costco',
    domain: 'costco.com',
    users: [
      { name: 'Laura Martin', email: 'laura@costco.com', parableRole: 'sponsor', jobTitle: 'VP of Technology', lastSeen: '2025-10-29T13:20:00Z' },
    ],
    plugins: [
      { id: 'slack', name: 'Slack', icon: 'https://img.logo.dev/slack.com?token=pk_N2gy3fJKQ0aldg9QTg7cHA', status: 'connected', prioritized: false, nextNudgeDate: null },
      { id: 'notion', name: 'Notion', icon: 'https://img.logo.dev/notion.so?token=pk_N2gy3fJKQ0aldg9QTg7cHA', status: 'connected', prioritized: false, nextNudgeDate: null },
    ],
    prioritizedIntegrations: 0,
    connectedIntegrations: 2,
  },
  {
    id: '9',
    name: 'Procter & Gamble',
    domain: 'pg.com',
    users: [
      { name: 'Brian Thompson', email: 'brian@pg.com', parableRole: 'sponsor', jobTitle: 'VP of IT', lastSeen: '2025-10-29T15:00:00Z' },
      { name: 'Sandra Lewis', email: 'sandra@pg.com', parableRole: 'sponsor', jobTitle: 'IT Director', lastSeen: '2025-10-28T14:30:00Z' },
      { name: 'Mark Walker', email: 'mark@pg.com', parableRole: 'integrator', jobTitle: 'Senior IT Analyst', lastSeen: '2025-10-29T10:00:00Z' },
      { name: 'Nancy Hall', email: 'nancy@pg.com', parableRole: 'project-manager', jobTitle: 'Business Systems Analyst', lastSeen: '2025-10-27T09:00:00Z' },
    ],
    plugins: [
      { id: 'sf', name: 'Salesforce', icon: 'https://img.logo.dev/salesforce.com?token=pk_N2gy3fJKQ0aldg9QTg7cHA', status: 'not-connected', prioritized: true, nextNudgeDate: '2025-11-01' },
      { id: 'slack', name: 'Slack', icon: 'https://img.logo.dev/slack.com?token=pk_N2gy3fJKQ0aldg9QTg7cHA', status: 'connected', prioritized: false, nextNudgeDate: null },
      { id: 'jira', name: 'Jira', icon: 'https://img.logo.dev/atlassian.com?token=pk_N2gy3fJKQ0aldg9QTg7cHA', status: 'connected', prioritized: false, nextNudgeDate: null },
      { id: 'notion', name: 'Notion', icon: 'https://img.logo.dev/notion.so?token=pk_N2gy3fJKQ0aldg9QTg7cHA', status: 'connected', prioritized: false, nextNudgeDate: null },
    ],
    prioritizedIntegrations: 1,
    connectedIntegrations: 3,
  },
  {
    id: '10',
    name: 'PepsiCo',
    domain: 'pepsico.com',
    users: [
      { name: 'George Allen', email: 'george@pepsico.com', parableRole: 'sponsor', jobTitle: 'SVP Operations', lastSeen: '2025-10-29T11:45:00Z' },
      { name: 'Michelle Young', email: 'michelle@pepsico.com', parableRole: 'sponsor', jobTitle: 'IT Director', lastSeen: '2025-10-29T12:30:00Z' },
      { name: 'Paul King', email: 'paul@pepsico.com', parableRole: 'integrator', jobTitle: 'Technology Manager', lastSeen: '2025-10-28T15:15:00Z' },
    ],
    plugins: [
      { id: 'slack', name: 'Slack', icon: 'https://img.logo.dev/slack.com?token=pk_N2gy3fJKQ0aldg9QTg7cHA', status: 'connected', prioritized: false, nextNudgeDate: null },
      { id: 'zoom', name: 'Zoom', icon: 'https://img.logo.dev/zoom.us?token=pk_N2gy3fJKQ0aldg9QTg7cHA', status: 'connected', prioritized: false, nextNudgeDate: null },
      { id: 'hubspot', name: 'HubSpot', icon: 'https://img.logo.dev/hubspot.com?token=pk_N2gy3fJKQ0aldg9QTg7cHA', status: 'connected', prioritized: false, nextNudgeDate: null },
      { id: 'jira', name: 'Jira', icon: 'https://img.logo.dev/atlassian.com?token=pk_N2gy3fJKQ0aldg9QTg7cHA', status: 'connected', prioritized: false, nextNudgeDate: null },
    ],
    prioritizedIntegrations: 0,
    connectedIntegrations: 4,
  },
];
