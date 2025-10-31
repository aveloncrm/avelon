// Unified CRM Data Model
// This model establishes proper relationships between Contacts, Leads, Deals, and Activities

export type ContactType = 'lead' | 'customer' | 'partner'
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'unqualified' | 'converted'
export type LeadSource = 'website' | 'referral' | 'social_media' | 'email_campaign' | 'cold_call' | 'event' | 'partner'
export type LeadPriority = 'low' | 'medium' | 'high' | 'urgent'
export type DealStage = 'discovery' | 'proposal' | 'negotiation' | 'decision' | 'won' | 'lost'
export type ActivityType = 'call' | 'email' | 'meeting' | 'note' | 'task'

// Core Contact Entity - single source of truth for person/company data
export interface Contact {
  id: string
  name: string
  email: string
  phone: string
  company: string
  jobTitle: string
  type: ContactType
  createdAt: string
  updatedAt: string
  tags: string[]
  linkedInUrl?: string
  website?: string
  address?: string
}

// Lead - represents potential customer with qualification data
export interface Lead {
  id: string
  contactId: string // Reference to Contact
  source: LeadSource
  status: LeadStatus
  priority: LeadPriority
  score: number
  assignedTo: string
  estimatedValue: number
  notes: string
  createdAt: string
  lastContactedAt: string | null
  convertedToDealId?: string // Link to Deal when converted
  convertedAt?: string
}

// Deal - represents sales opportunity
export interface Deal {
  id: string
  contactId: string // Reference to Contact
  leadId?: string // Reference to original Lead (if converted from lead)
  name: string
  value: number
  stage: DealStage
  probability: number
  expectedCloseDate: string
  productService: string
  notes: string
  assignedTo: string
  createdAt: string
  lastActivityAt: string
  tags: string[]
  closedAt?: string
  lostReason?: string
}

// Activity - single timeline for all interactions
export interface Activity {
  id: string
  contactId: string // Reference to Contact
  leadId?: string // Optional reference to Lead
  dealId?: string // Optional reference to Deal
  type: ActivityType
  title: string
  description: string
  subject?: string
  createdAt: string
  createdBy: string
  metadata?: Record<string, any>
}

// Mock Data
export const mockContacts: Contact[] = [
  {
    id: 'c1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@techcorp.com',
    phone: '+1 (555) 123-4567',
    company: 'TechCorp Inc.',
    jobTitle: 'VP of Sales',
    type: 'lead',
    createdAt: '2025-10-10T10:00:00Z',
    updatedAt: '2025-10-16T14:30:00Z',
    tags: ['enterprise', 'decision-maker'],
    linkedInUrl: 'https://linkedin.com/in/sarahjohnson',
  },
  {
    id: 'c2',
    name: 'Michael Chen',
    email: 'mchen@innovate.io',
    phone: '+1 (555) 234-5678',
    company: 'Innovate Solutions',
    jobTitle: 'CTO',
    type: 'lead',
    createdAt: '2025-10-17T09:15:00Z',
    updatedAt: '2025-10-17T09:15:00Z',
    tags: ['tech', 'hot-lead'],
  },
  {
    id: 'c3',
    name: 'Amanda Martinez',
    email: 'amanda.m@globalcorp.com',
    phone: '+1 (555) 345-6789',
    company: 'Global Corp',
    jobTitle: 'Marketing Director',
    type: 'lead',
    createdAt: '2025-10-12T11:20:00Z',
    updatedAt: '2025-10-16T15:45:00Z',
    tags: ['marketing', 'mid-market'],
  },
  {
    id: 'c4',
    name: 'David Wilson',
    email: 'dwilson@startup.com',
    phone: '+1 (555) 456-7890',
    company: 'StartupXYZ',
    jobTitle: 'Founder & CEO',
    type: 'lead',
    createdAt: '2025-10-14T16:45:00Z',
    updatedAt: '2025-10-14T16:45:00Z',
    tags: ['startup', 'founder'],
  },
  {
    id: 'c5',
    name: 'Lisa Anderson',
    email: 'l.anderson@enterprise.net',
    phone: '+1 (555) 567-8901',
    company: 'Enterprise Networks',
    jobTitle: 'Operations Manager',
    type: 'lead',
    createdAt: '2025-10-08T08:30:00Z',
    updatedAt: '2025-10-15T11:20:00Z',
    tags: ['operations', 'enterprise'],
  },
  {
    id: 'c6',
    name: 'James Taylor',
    email: 'jtaylor@medtech.com',
    phone: '+1 (555) 678-9012',
    company: 'MedTech Solutions',
    jobTitle: 'IT Director',
    type: 'lead',
    createdAt: '2025-10-05T13:00:00Z',
    updatedAt: '2025-10-11T09:45:00Z',
    tags: ['healthcare', 'it'],
  },
  {
    id: 'c7',
    name: 'Emma Thompson',
    email: 'ethompson@finance.com',
    phone: '+1 (555) 789-0123',
    company: 'Finance Pro',
    jobTitle: 'CFO',
    type: 'customer',
    createdAt: '2025-09-28T10:00:00Z',
    updatedAt: '2025-10-16T11:00:00Z',
    tags: ['finance', 'vip', 'customer'],
  },
  {
    id: 'c8',
    name: 'Robert Garcia',
    email: 'rgarcia@retail.com',
    phone: '+1 (555) 890-1234',
    company: 'Retail Plus',
    jobTitle: 'Store Manager',
    type: 'lead',
    createdAt: '2025-10-03T14:20:00Z',
    updatedAt: '2025-10-10T10:00:00Z',
    tags: ['retail', 'small-business'],
  },
  {
    id: 'c9',
    name: 'Jennifer Lee',
    email: 'jlee@consulting.io',
    phone: '+1 (555) 901-2345',
    company: 'Lee Consulting',
    jobTitle: 'Principal Consultant',
    type: 'lead',
    createdAt: '2025-10-16T12:30:00Z',
    updatedAt: '2025-10-16T12:30:00Z',
    tags: ['consulting', 'professional-services'],
  },
  {
    id: 'c10',
    name: 'Christopher Davis',
    email: 'cdavis@manufacturing.com',
    phone: '+1 (555) 012-3456',
    company: 'Manufacturing Co',
    jobTitle: 'Plant Director',
    type: 'lead',
    createdAt: '2025-10-09T09:00:00Z',
    updatedAt: '2025-10-16T14:00:00Z',
    tags: ['manufacturing', 'industrial'],
  },
]

export const mockLeads: Lead[] = [
  {
    id: 'l1',
    contactId: 'c1',
    source: 'website',
    status: 'qualified',
    priority: 'high',
    score: 85,
    assignedTo: 'John Smith',
    estimatedValue: 50000,
    notes: 'Interested in enterprise plan. Follow up next week.',
    createdAt: '2025-10-10T10:00:00Z',
    lastContactedAt: '2025-10-15T14:30:00Z',
    convertedToDealId: 'd1',
    convertedAt: '2025-10-15T14:30:00Z',
  },
  {
    id: 'l2',
    contactId: 'c2',
    source: 'referral',
    status: 'new',
    priority: 'urgent',
    score: 92,
    assignedTo: 'Emily Davis',
    estimatedValue: 75000,
    notes: 'Referred by existing customer. High interest.',
    createdAt: '2025-10-17T09:15:00Z',
    lastContactedAt: null,
    convertedToDealId: 'd2',
  },
  {
    id: 'l3',
    contactId: 'c3',
    source: 'social_media',
    status: 'contacted',
    priority: 'medium',
    score: 68,
    assignedTo: 'John Smith',
    estimatedValue: 25000,
    notes: 'Downloaded whitepaper. Scheduled demo for next week.',
    createdAt: '2025-10-12T11:20:00Z',
    lastContactedAt: '2025-10-16T10:00:00Z',
    convertedToDealId: 'd3',
  },
  {
    id: 'l4',
    contactId: 'c4',
    source: 'event',
    status: 'new',
    priority: 'high',
    score: 78,
    assignedTo: 'Emily Davis',
    estimatedValue: 35000,
    notes: 'Met at TechConf 2025. Interested in growth plan.',
    createdAt: '2025-10-14T16:45:00Z',
    lastContactedAt: null,
    convertedToDealId: 'd4',
  },
  {
    id: 'l5',
    contactId: 'c5',
    source: 'email_campaign',
    status: 'qualified',
    priority: 'medium',
    score: 72,
    assignedTo: 'Robert Brown',
    estimatedValue: 45000,
    notes: 'Budget approved. Waiting for final decision.',
    createdAt: '2025-10-08T08:30:00Z',
    lastContactedAt: '2025-10-14T15:20:00Z',
    convertedToDealId: 'd5',
  },
  {
    id: 'l6',
    contactId: 'c6',
    source: 'cold_call',
    status: 'contacted',
    priority: 'low',
    score: 45,
    assignedTo: 'Robert Brown',
    estimatedValue: 15000,
    notes: 'Initial interest. Needs more information.',
    createdAt: '2025-10-05T13:00:00Z',
    lastContactedAt: '2025-10-11T09:45:00Z',
  },
  {
    id: 'l7',
    contactId: 'c7',
    source: 'partner',
    status: 'converted',
    priority: 'high',
    score: 95,
    assignedTo: 'John Smith',
    estimatedValue: 80000,
    notes: 'Deal closed! Onboarding scheduled.',
    createdAt: '2025-09-28T10:00:00Z',
    lastContactedAt: '2025-10-16T11:00:00Z',
    convertedToDealId: 'd6',
    convertedAt: '2025-10-16T11:00:00Z',
  },
  {
    id: 'l8',
    contactId: 'c8',
    source: 'website',
    status: 'unqualified',
    priority: 'low',
    score: 28,
    assignedTo: 'Emily Davis',
    estimatedValue: 5000,
    notes: 'Budget constraints. Not a good fit.',
    createdAt: '2025-10-03T14:20:00Z',
    lastContactedAt: '2025-10-06T16:30:00Z',
  },
  {
    id: 'l9',
    contactId: 'c9',
    source: 'social_media',
    status: 'new',
    priority: 'medium',
    score: 65,
    assignedTo: 'Robert Brown',
    estimatedValue: 20000,
    notes: 'LinkedIn connection. Exploring options.',
    createdAt: '2025-10-16T12:30:00Z',
    lastContactedAt: null,
  },
  {
    id: 'l10',
    contactId: 'c10',
    source: 'referral',
    status: 'qualified',
    priority: 'high',
    score: 88,
    assignedTo: 'John Smith',
    estimatedValue: 60000,
    notes: 'Strong interest. Proposal sent.',
    createdAt: '2025-10-09T09:00:00Z',
    lastContactedAt: '2025-10-15T13:00:00Z',
    convertedToDealId: 'd7',
  },
]

export const mockDeals: Deal[] = [
  {
    id: 'd1',
    contactId: 'c1',
    leadId: 'l1',
    name: 'TechCorp Enterprise Deal',
    value: 50000,
    stage: 'negotiation',
    probability: 75,
    expectedCloseDate: '2025-10-30T00:00:00Z',
    productService: 'Enterprise Plan - Annual',
    notes: 'Negotiating contract terms. Legal review in progress.',
    assignedTo: 'John Smith',
    createdAt: '2025-10-15T14:30:00Z',
    lastActivityAt: '2025-10-16T14:30:00Z',
    tags: ['enterprise', 'high-value'],
  },
  {
    id: 'd2',
    contactId: 'c2',
    leadId: 'l2',
    name: 'Innovate Solutions Tech Stack',
    value: 75000,
    stage: 'discovery',
    probability: 60,
    expectedCloseDate: '2025-11-15T00:00:00Z',
    productService: 'Custom Integration Package',
    notes: 'High potential. CTO is very interested. Need to schedule technical demo.',
    assignedTo: 'Emily Davis',
    createdAt: '2025-10-17T09:15:00Z',
    lastActivityAt: '2025-10-17T09:15:00Z',
    tags: ['tech', 'integration'],
  },
  {
    id: 'd3',
    contactId: 'c3',
    leadId: 'l3',
    name: 'Global Corp Marketing Suite',
    value: 25000,
    stage: 'proposal',
    probability: 50,
    expectedCloseDate: '2025-11-01T00:00:00Z',
    productService: 'Marketing Pro Plan',
    notes: 'Demo completed. Awaiting decision from management.',
    assignedTo: 'John Smith',
    createdAt: '2025-10-16T10:00:00Z',
    lastActivityAt: '2025-10-16T15:45:00Z',
    tags: ['marketing', 'mid-market'],
  },
  {
    id: 'd4',
    contactId: 'c4',
    leadId: 'l4',
    name: 'StartupXYZ Growth Package',
    value: 35000,
    stage: 'discovery',
    probability: 30,
    expectedCloseDate: '2025-11-20T00:00:00Z',
    productService: 'Growth Plan',
    notes: 'Met at conference. Need to schedule initial call.',
    assignedTo: 'Emily Davis',
    createdAt: '2025-10-14T16:45:00Z',
    lastActivityAt: '2025-10-14T16:45:00Z',
    tags: ['startup', 'conference'],
  },
  {
    id: 'd5',
    contactId: 'c5',
    leadId: 'l5',
    name: 'Enterprise Networks Implementation',
    value: 45000,
    stage: 'proposal',
    probability: 65,
    expectedCloseDate: '2025-10-25T00:00:00Z',
    productService: 'Enterprise Plan with Training',
    notes: 'Budget approved. Final proposal review in progress.',
    assignedTo: 'Robert Brown',
    createdAt: '2025-10-14T15:20:00Z',
    lastActivityAt: '2025-10-15T11:20:00Z',
    tags: ['enterprise', 'training'],
  },
  {
    id: 'd6',
    contactId: 'c7',
    leadId: 'l7',
    name: 'Finance Pro Annual Contract',
    value: 80000,
    stage: 'won',
    probability: 100,
    expectedCloseDate: '2025-10-16T00:00:00Z',
    productService: 'Enterprise Plan - Multi-year',
    notes: 'Deal closed! Contract signed. Onboarding team engaged.',
    assignedTo: 'John Smith',
    createdAt: '2025-09-28T10:00:00Z',
    lastActivityAt: '2025-10-16T11:00:00Z',
    tags: ['finance', 'multi-year', 'closed'],
    closedAt: '2025-10-16T11:00:00Z',
  },
  {
    id: 'd7',
    contactId: 'c10',
    leadId: 'l10',
    name: 'Manufacturing Co Digital Transform',
    value: 60000,
    stage: 'negotiation',
    probability: 70,
    expectedCloseDate: '2025-11-05T00:00:00Z',
    productService: 'Custom Enterprise Solution',
    notes: 'Strong interest. Finalizing pricing and implementation timeline.',
    assignedTo: 'John Smith',
    createdAt: '2025-10-15T13:00:00Z',
    lastActivityAt: '2025-10-16T14:00:00Z',
    tags: ['manufacturing', 'custom'],
  },
  {
    id: 'd8',
    contactId: 'c8',
    leadId: 'l8',
    name: 'Retail Plus Small Business',
    value: 5000,
    stage: 'lost',
    probability: 0,
    expectedCloseDate: '2025-10-10T00:00:00Z',
    productService: 'Starter Plan',
    notes: 'Lost to competitor. Budget constraints.',
    assignedTo: 'Emily Davis',
    createdAt: '2025-10-06T16:30:00Z',
    lastActivityAt: '2025-10-10T10:00:00Z',
    tags: ['retail', 'lost'],
    closedAt: '2025-10-10T10:00:00Z',
    lostReason: 'Budget constraints - chose competitor',
  },
]

export const mockActivities: Activity[] = [
  // Sarah Johnson (c1) - TechCorp
  {
    id: 'a1',
    contactId: 'c1',
    leadId: 'l1',
    dealId: 'd1',
    type: 'meeting',
    title: 'Contract Review Meeting',
    description: 'Discussed terms with legal team',
    createdAt: '2025-10-16T14:30:00Z',
    createdBy: 'John Smith',
  },
  {
    id: 'a2',
    contactId: 'c1',
    leadId: 'l1',
    dealId: 'd1',
    type: 'email',
    title: 'Proposal Sent',
    description: 'Sent detailed proposal with pricing',
    subject: 'TechCorp Enterprise Proposal',
    createdAt: '2025-10-15T10:00:00Z',
    createdBy: 'John Smith',
  },
  {
    id: 'a3',
    contactId: 'c1',
    leadId: 'l1',
    type: 'call',
    title: 'Initial Discovery Call',
    description: 'Discussed current challenges and requirements',
    createdAt: '2025-10-10T14:00:00Z',
    createdBy: 'John Smith',
    metadata: { duration: 1800, outcome: 'interested' },
  },
  // Michael Chen (c2) - Innovate Solutions
  {
    id: 'a4',
    contactId: 'c2',
    leadId: 'l2',
    dealId: 'd2',
    type: 'call',
    title: 'Discovery Call with CTO',
    description: 'Initial call with CTO about integration needs',
    createdAt: '2025-10-17T09:15:00Z',
    createdBy: 'Emily Davis',
    metadata: { duration: 1200, outcome: 'interested' },
  },
  {
    id: 'a5',
    contactId: 'c2',
    leadId: 'l2',
    dealId: 'd2',
    type: 'meeting',
    title: 'Meeting Booked',
    description: 'Technical demo scheduled',
    createdAt: '2025-10-17T11:15:00Z',
    createdBy: 'Emily Davis',
    metadata: { meetingDate: '2025-10-20T14:00:00Z', type: 'demo' },
  },
  // Amanda Martinez (c3) - Global Corp
  {
    id: 'a6',
    contactId: 'c3',
    leadId: 'l3',
    dealId: 'd3',
    type: 'meeting',
    title: 'Product Demo',
    description: 'Demonstrated marketing automation features',
    createdAt: '2025-10-16T15:45:00Z',
    createdBy: 'John Smith',
  },
  {
    id: 'a7',
    contactId: 'c3',
    leadId: 'l3',
    dealId: 'd3',
    type: 'email',
    title: 'Follow-up Email',
    description: 'Sent additional resources and case studies',
    subject: 'Demo follow-up and resources',
    createdAt: '2025-10-16T16:30:00Z',
    createdBy: 'John Smith',
  },
  {
    id: 'a8',
    contactId: 'c3',
    leadId: 'l3',
    type: 'email',
    title: 'Whitepaper Download',
    description: 'Downloaded marketing automation whitepaper',
    subject: 'Marketing Automation Guide',
    createdAt: '2025-10-12T11:20:00Z',
    createdBy: 'System',
  },
  // David Wilson (c4) - StartupXYZ
  {
    id: 'a9',
    contactId: 'c4',
    leadId: 'l4',
    dealId: 'd4',
    type: 'note',
    title: 'Conference Meeting',
    description: 'Met founder at TechConf 2025',
    createdAt: '2025-10-14T16:45:00Z',
    createdBy: 'Emily Davis',
  },
  // Lisa Anderson (c5) - Enterprise Networks
  {
    id: 'a10',
    contactId: 'c5',
    leadId: 'l5',
    dealId: 'd5',
    type: 'email',
    title: 'Proposal Submitted',
    description: 'Sent comprehensive proposal with training plan',
    subject: 'Enterprise Networks - Implementation Proposal',
    createdAt: '2025-10-15T11:20:00Z',
    createdBy: 'Robert Brown',
  },
  {
    id: 'a11',
    contactId: 'c5',
    leadId: 'l5',
    type: 'call',
    title: 'Budget Discussion',
    description: 'Confirmed budget availability',
    createdAt: '2025-10-14T15:20:00Z',
    createdBy: 'Robert Brown',
    metadata: { duration: 900, outcome: 'proposal_requested' },
  },
  // James Taylor (c6) - MedTech
  {
    id: 'a12',
    contactId: 'c6',
    leadId: 'l6',
    type: 'call',
    title: 'Cold Call Follow-up',
    description: 'Discussed initial interest and requirements',
    createdAt: '2025-10-11T09:45:00Z',
    createdBy: 'Robert Brown',
    metadata: { duration: 600, outcome: 'needs_info' },
  },
  // Emma Thompson (c7) - Finance Pro
  {
    id: 'a13',
    contactId: 'c7',
    leadId: 'l7',
    dealId: 'd6',
    type: 'note',
    title: 'Contract Signed',
    description: 'Three-year contract signed',
    createdAt: '2025-10-16T11:00:00Z',
    createdBy: 'John Smith',
  },
  {
    id: 'a14',
    contactId: 'c7',
    leadId: 'l7',
    dealId: 'd6',
    type: 'meeting',
    title: 'Final Negotiation',
    description: 'Finalized contract terms and pricing',
    createdAt: '2025-10-15T14:00:00Z',
    createdBy: 'John Smith',
  },
  // Robert Garcia (c8) - Retail Plus
  {
    id: 'a15',
    contactId: 'c8',
    leadId: 'l8',
    dealId: 'd8',
    type: 'note',
    title: 'Deal Lost',
    description: 'Customer chose competitor due to pricing',
    createdAt: '2025-10-10T10:00:00Z',
    createdBy: 'Emily Davis',
  },
  // Jennifer Lee (c9) - Lee Consulting
  {
    id: 'a16',
    contactId: 'c9',
    leadId: 'l9',
    type: 'note',
    title: 'LinkedIn Connection',
    description: 'Connected on LinkedIn, exploring options',
    createdAt: '2025-10-16T12:30:00Z',
    createdBy: 'Robert Brown',
  },
  // Christopher Davis (c10) - Manufacturing Co
  {
    id: 'a17',
    contactId: 'c10',
    leadId: 'l10',
    dealId: 'd7',
    type: 'meeting',
    title: 'Pricing Discussion',
    description: 'Negotiated pricing and payment terms',
    createdAt: '2025-10-16T14:00:00Z',
    createdBy: 'John Smith',
  },
  {
    id: 'a18',
    contactId: 'c10',
    leadId: 'l10',
    dealId: 'd7',
    type: 'email',
    title: 'Proposal Sent',
    description: 'Custom enterprise solution proposal',
    subject: 'Manufacturing Co - Digital Transformation Proposal',
    createdAt: '2025-10-15T13:00:00Z',
    createdBy: 'John Smith',
  },
]

// Helper functions
export const getContactById = (id: string): Contact | undefined => {
  return mockContacts.find(c => c.id === id)
}

export const getLeadById = (id: string): Lead | undefined => {
  return mockLeads.find(l => l.id === id)
}

export const getDealById = (id: string): Deal | undefined => {
  return mockDeals.find(d => d.id === id)
}

export const getLeadByContactId = (contactId: string): Lead | undefined => {
  return mockLeads.find(l => l.contactId === contactId)
}

export const getDealsByContactId = (contactId: string): Deal[] => {
  return mockDeals.filter(d => d.contactId === contactId)
}

export const getActivitiesByContactId = (contactId: string): Activity[] => {
  return mockActivities.filter(a => a.contactId === contactId).sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

export const getActivitiesByLeadId = (leadId: string): Activity[] => {
  return mockActivities.filter(a => a.leadId === leadId).sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

export const getActivitiesByDealId = (dealId: string): Activity[] => {
  return mockActivities.filter(a => a.dealId === dealId).sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

// Enriched data with relationships
export interface EnrichedLead extends Lead {
  contact: Contact
  activities: Activity[]
  deal?: Deal
}

export interface EnrichedDeal extends Deal {
  contact: Contact
  lead?: Lead
  activities: Activity[]
}

export interface EnrichedContact extends Contact {
  lead?: Lead
  deals: Deal[]
  activities: Activity[]
  totalValue: number
  stage: 'contact' | 'lead' | 'deal' | 'customer'
}

export const getEnrichedLead = (leadId: string): EnrichedLead | undefined => {
  const lead = getLeadById(leadId)
  if (!lead) return undefined

  const contact = getContactById(lead.contactId)
  if (!contact) return undefined

  const activities = getActivitiesByLeadId(leadId)
  const deal = lead.convertedToDealId ? getDealById(lead.convertedToDealId) : undefined

  return {
    ...lead,
    contact,
    activities,
    deal,
  }
}

export const getEnrichedDeal = (dealId: string): EnrichedDeal | undefined => {
  const deal = getDealById(dealId)
  if (!deal) return undefined

  const contact = getContactById(deal.contactId)
  if (!contact) return undefined

  const lead = deal.leadId ? getLeadById(deal.leadId) : undefined
  const activities = getActivitiesByDealId(dealId)

  return {
    ...deal,
    contact,
    lead,
    activities,
  }
}

export const getEnrichedContact = (contactId: string): EnrichedContact | undefined => {
  const contact = getContactById(contactId)
  if (!contact) return undefined

  const lead = getLeadByContactId(contactId)
  const deals = getDealsByContactId(contactId)
  const activities = getActivitiesByContactId(contactId)
  const totalValue = deals.reduce((sum, d) => sum + d.value, 0)

  // Determine stage
  let stage: 'contact' | 'lead' | 'deal' | 'customer' = 'contact'
  if (contact.type === 'customer' || deals.some(d => d.stage === 'won')) {
    stage = 'customer'
  } else if (deals.length > 0 && deals.some(d => !['won', 'lost'].includes(d.stage))) {
    stage = 'deal'
  } else if (lead) {
    stage = 'lead'
  }

  return {
    ...contact,
    lead,
    deals,
    activities,
    totalValue,
    stage,
  }
}

export const getAllEnrichedContacts = (): EnrichedContact[] => {
  return mockContacts.map(c => getEnrichedContact(c.id)!).filter(Boolean)
}

export const getAllEnrichedLeads = (): EnrichedLead[] => {
  return mockLeads.map(l => getEnrichedLead(l.id)!).filter(Boolean)
}

export const getAllEnrichedDeals = (): EnrichedDeal[] => {
  return mockDeals.map(d => getEnrichedDeal(d.id)!).filter(Boolean)
}

// Statistics
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

export const getDealStats = () => {
  const activeDeals = mockDeals.filter(d => !['won', 'lost'].includes(d.stage))
  return {
    total: mockDeals.length,
    active: activeDeals.length,
    totalValue: mockDeals.reduce((sum, d) => sum + d.value, 0),
    pipelineValue: activeDeals.reduce((sum, d) => sum + d.value, 0),
    weightedPipelineValue: activeDeals.reduce((sum, d) => sum + (d.value * d.probability / 100), 0),
    wonDeals: mockDeals.filter(d => d.stage === 'won').length,
    lostDeals: mockDeals.filter(d => d.stage === 'lost').length,
    wonValue: mockDeals.filter(d => d.stage === 'won').reduce((sum, d) => sum + d.value, 0),
    lostValue: mockDeals.filter(d => d.stage === 'lost').reduce((sum, d) => sum + d.value, 0),
    averageDealSize: Math.round(mockDeals.reduce((sum, d) => sum + d.value, 0) / mockDeals.length),
  }
}

export const getContactStats = () => {
  const enrichedContacts = getAllEnrichedContacts()
  return {
    total: mockContacts.length,
    leads: enrichedContacts.filter(c => c.stage === 'lead').length,
    deals: enrichedContacts.filter(c => c.stage === 'deal').length,
    customers: enrichedContacts.filter(c => c.stage === 'customer').length,
    totalValue: enrichedContacts.reduce((sum, c) => sum + c.totalValue, 0),
  }
}

export const getConversionFunnel = () => {
  const stats = getContactStats()
  const leadStats = getLeadStats()
  const dealStats = getDealStats()

  return {
    contacts: stats.total,
    leads: leadStats.total,
    qualifiedLeads: leadStats.qualified,
    deals: dealStats.active,
    customers: dealStats.wonDeals,
    conversionRates: {
      contactToLead: leadStats.total / stats.total * 100,
      leadToQualified: leadStats.qualified / leadStats.total * 100,
      qualifiedToDeal: dealStats.total / leadStats.qualified * 100,
      dealToCustomer: dealStats.wonDeals / dealStats.total * 100,
    }
  }
}

