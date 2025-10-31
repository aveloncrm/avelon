export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'unqualified' | 'converted'
export type LeadSource = 'website' | 'referral' | 'social_media' | 'email_campaign' | 'cold_call' | 'event' | 'partner'
export type LeadPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface Lead {
  id: string
  name: string
  email: string
  phone: string
  company: string
  jobTitle: string
  source: LeadSource
  status: LeadStatus
  priority: LeadPriority
  score: number
  assignedTo: string
  tags: string[]
  notes: string
  createdAt: string
  lastContactedAt: string | null
  estimatedValue: number
}

export const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@techcorp.com',
    phone: '+1 (555) 123-4567',
    company: 'TechCorp Inc.',
    jobTitle: 'VP of Sales',
    source: 'website',
    status: 'qualified',
    priority: 'high',
    score: 85,
    assignedTo: 'John Smith',
    tags: ['enterprise', 'decision-maker'],
    notes: 'Interested in enterprise plan. Follow up next week.',
    createdAt: '2025-10-10T10:00:00Z',
    lastContactedAt: '2025-10-15T14:30:00Z',
    estimatedValue: 50000,
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'mchen@innovate.io',
    phone: '+1 (555) 234-5678',
    company: 'Innovate Solutions',
    jobTitle: 'CTO',
    source: 'referral',
    status: 'new',
    priority: 'urgent',
    score: 92,
    assignedTo: 'Emily Davis',
    tags: ['tech', 'hot-lead'],
    notes: 'Referred by existing customer. High interest.',
    createdAt: '2025-10-17T09:15:00Z',
    lastContactedAt: null,
    estimatedValue: 75000,
  },
  {
    id: '3',
    name: 'Amanda Martinez',
    email: 'amanda.m@globalcorp.com',
    phone: '+1 (555) 345-6789',
    company: 'Global Corp',
    jobTitle: 'Marketing Director',
    source: 'social_media',
    status: 'contacted',
    priority: 'medium',
    score: 68,
    assignedTo: 'John Smith',
    tags: ['marketing', 'mid-market'],
    notes: 'Downloaded whitepaper. Scheduled demo for next week.',
    createdAt: '2025-10-12T11:20:00Z',
    lastContactedAt: '2025-10-16T10:00:00Z',
    estimatedValue: 25000,
  },
  {
    id: '4',
    name: 'David Wilson',
    email: 'dwilson@startup.com',
    phone: '+1 (555) 456-7890',
    company: 'StartupXYZ',
    jobTitle: 'Founder & CEO',
    source: 'event',
    status: 'new',
    priority: 'high',
    score: 78,
    assignedTo: 'Emily Davis',
    tags: ['startup', 'founder'],
    notes: 'Met at TechConf 2025. Interested in growth plan.',
    createdAt: '2025-10-14T16:45:00Z',
    lastContactedAt: null,
    estimatedValue: 35000,
  },
  {
    id: '5',
    name: 'Lisa Anderson',
    email: 'l.anderson@enterprise.net',
    phone: '+1 (555) 567-8901',
    company: 'Enterprise Networks',
    jobTitle: 'Operations Manager',
    source: 'email_campaign',
    status: 'qualified',
    priority: 'medium',
    score: 72,
    assignedTo: 'Robert Brown',
    tags: ['operations', 'enterprise'],
    notes: 'Budget approved. Waiting for final decision.',
    createdAt: '2025-10-08T08:30:00Z',
    lastContactedAt: '2025-10-14T15:20:00Z',
    estimatedValue: 45000,
  },
  {
    id: '6',
    name: 'James Taylor',
    email: 'jtaylor@medtech.com',
    phone: '+1 (555) 678-9012',
    company: 'MedTech Solutions',
    jobTitle: 'IT Director',
    source: 'cold_call',
    status: 'contacted',
    priority: 'low',
    score: 45,
    assignedTo: 'Robert Brown',
    tags: ['healthcare', 'it'],
    notes: 'Initial interest. Needs more information.',
    createdAt: '2025-10-05T13:00:00Z',
    lastContactedAt: '2025-10-11T09:45:00Z',
    estimatedValue: 15000,
  },
  {
    id: '7',
    name: 'Emma Thompson',
    email: 'ethompson@finance.com',
    phone: '+1 (555) 789-0123',
    company: 'Finance Pro',
    jobTitle: 'CFO',
    source: 'partner',
    status: 'converted',
    priority: 'high',
    score: 95,
    assignedTo: 'John Smith',
    tags: ['finance', 'converted', 'vip'],
    notes: 'Deal closed! Onboarding scheduled.',
    createdAt: '2025-09-28T10:00:00Z',
    lastContactedAt: '2025-10-16T11:00:00Z',
    estimatedValue: 80000,
  },
  {
    id: '8',
    name: 'Robert Garcia',
    email: 'rgarcia@retail.com',
    phone: '+1 (555) 890-1234',
    company: 'Retail Plus',
    jobTitle: 'Store Manager',
    source: 'website',
    status: 'unqualified',
    priority: 'low',
    score: 28,
    assignedTo: 'Emily Davis',
    tags: ['retail', 'small-business'],
    notes: 'Budget constraints. Not a good fit.',
    createdAt: '2025-10-03T14:20:00Z',
    lastContactedAt: '2025-10-06T16:30:00Z',
    estimatedValue: 5000,
  },
  {
    id: '9',
    name: 'Jennifer Lee',
    email: 'jlee@consulting.io',
    phone: '+1 (555) 901-2345',
    company: 'Lee Consulting',
    jobTitle: 'Principal Consultant',
    source: 'social_media',
    status: 'new',
    priority: 'medium',
    score: 65,
    assignedTo: 'Robert Brown',
    tags: ['consulting', 'professional-services'],
    notes: 'LinkedIn connection. Exploring options.',
    createdAt: '2025-10-16T12:30:00Z',
    lastContactedAt: null,
    estimatedValue: 20000,
  },
  {
    id: '10',
    name: 'Christopher Davis',
    email: 'cdavis@manufacturing.com',
    phone: '+1 (555) 012-3456',
    company: 'Manufacturing Co',
    jobTitle: 'Plant Director',
    source: 'referral',
    status: 'qualified',
    priority: 'high',
    score: 88,
    assignedTo: 'John Smith',
    tags: ['manufacturing', 'industrial'],
    notes: 'Strong interest. Proposal sent.',
    createdAt: '2025-10-09T09:00:00Z',
    lastContactedAt: '2025-10-15T13:00:00Z',
    estimatedValue: 60000,
  },
]

export const getLeadsByStatus = (status: LeadStatus) => {
  return mockLeads.filter(lead => lead.status === status)
}

export const getLeadById = (id: string) => {
  return mockLeads.find(lead => lead.id === id)
}

export const getLeadStats = () => {
  return {
    total: mockLeads.length,
    new: mockLeads.filter(l => l.status === 'new').length,
    contacted: mockLeads.filter(l => l.status === 'contacted').length,
    qualified: mockLeads.filter(l => l.status === 'qualified').length,
    unqualified: mockLeads.filter(l => l.status === 'unqualified').length,
    converted: mockLeads.filter(l => l.status === 'converted').length,
    averageScore: Math.round(mockLeads.reduce((sum, l) => sum + l.score, 0) / mockLeads.length),
    totalEstimatedValue: mockLeads.reduce((sum, l) => sum + l.estimatedValue, 0),
  }
}

