export interface Onboarding {
  id: string;
  company: string;
  domain: string;
  status: 'discovery' | 'implementation' | 'testing' | 'live' | 'on-hold';
  csContact: string;
  salesContact: string;
  note: string;
}

export const onboardings: Onboarding[] = [
  {
    id: '1',
    company: 'Acme Corporation',
    domain: 'acmecorp.com',
    status: 'implementation',
    csContact: 'Emily Parker',
    salesContact: 'John Smith',
    note: 'Need to follow up on API key creation by end of week',
  },
  {
    id: '2',
    company: 'TechStart Inc',
    domain: 'techstart.io',
    status: 'testing',
    csContact: 'Michael Chen',
    salesContact: 'Sarah Williams',
    note: 'Scheduled demo for Nov 5th',
  },
  {
    id: '3',
    company: 'Global Solutions',
    domain: 'globalsolutions.com',
    status: 'discovery',
    csContact: 'Amanda Johnson',
    salesContact: 'Robert Davis',
    note: 'Waiting on security review from their team',
  },
];

