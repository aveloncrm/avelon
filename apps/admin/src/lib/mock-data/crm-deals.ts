export type DealStage = 'discovery' | 'proposal' | 'negotiation' | 'decision' | 'won' | 'lost'

export interface Deal {
  id: string
  name: string
  value: number
  stage: DealStage
  probability: number
  expectedCloseDate: string
  contactName: string
  contactEmail: string
  company: string
  productService: string
  notes: string
  assignedTo: string
  createdAt: string
  lastActivityAt: string
  activities: Activity[]
  tags: string[]
}

export interface Activity {
  id: string
  type: 'call' | 'email' | 'meeting' | 'note' | 'task'
  title: string
  description: string
  createdAt: string
  createdBy: string
}

export const mockDeals: Deal[] = [
  {
    id: '1',
    name: 'TechCorp Enterprise Deal',
    value: 50000,
    stage: 'negotiation',
    probability: 75,
    expectedCloseDate: '2025-10-30T00:00:00Z',
    contactName: 'Sarah Johnson',
    contactEmail: 'sarah.johnson@techcorp.com',
    company: 'TechCorp Inc.',
    productService: 'Enterprise Plan - Annual',
    notes: 'Negotiating contract terms. Legal review in progress.',
    assignedTo: 'John Smith',
    createdAt: '2025-10-10T10:00:00Z',
    lastActivityAt: '2025-10-16T14:30:00Z',
    tags: ['enterprise', 'high-value'],
    activities: [
      {
        id: 'a1',
        type: 'meeting',
        title: 'Contract Review Meeting',
        description: 'Discussed terms with legal team',
        createdAt: '2025-10-16T14:30:00Z',
        createdBy: 'John Smith',
      },
      {
        id: 'a2',
        type: 'email',
        title: 'Proposal Sent',
        description: 'Sent detailed proposal with pricing',
        createdAt: '2025-10-15T10:00:00Z',
        createdBy: 'John Smith',
      },
    ],
  },
  {
    id: '2',
    name: 'Innovate Solutions Tech Stack',
    value: 75000,
    stage: 'discovery',
    probability: 60,
    expectedCloseDate: '2025-11-15T00:00:00Z',
    contactName: 'Michael Chen',
    contactEmail: 'mchen@innovate.io',
    company: 'Innovate Solutions',
    productService: 'Custom Integration Package',
    notes: 'High potential. CTO is very interested. Need to schedule technical demo.',
    assignedTo: 'Emily Davis',
    createdAt: '2025-10-17T09:15:00Z',
    lastActivityAt: '2025-10-17T09:15:00Z',
    tags: ['tech', 'integration'],
    activities: [
      {
        id: 'a3',
        type: 'call',
        title: 'Discovery Call',
        description: 'Initial call with CTO',
        createdAt: '2025-10-17T09:15:00Z',
        createdBy: 'Emily Davis',
      },
    ],
  },
  {
    id: '3',
    name: 'Global Corp Marketing Suite',
    value: 25000,
    stage: 'proposal',
    probability: 50,
    expectedCloseDate: '2025-11-01T00:00:00Z',
    contactName: 'Amanda Martinez',
    contactEmail: 'amanda.m@globalcorp.com',
    company: 'Global Corp',
    productService: 'Marketing Pro Plan',
    notes: 'Demo completed. Awaiting decision from management.',
    assignedTo: 'John Smith',
    createdAt: '2025-10-12T11:20:00Z',
    lastActivityAt: '2025-10-16T15:45:00Z',
    tags: ['marketing', 'mid-market'],
    activities: [
      {
        id: 'a4',
        type: 'meeting',
        title: 'Product Demo',
        description: 'Demonstrated marketing automation features',
        createdAt: '2025-10-16T15:45:00Z',
        createdBy: 'John Smith',
      },
      {
        id: 'a5',
        type: 'email',
        title: 'Follow-up Email',
        description: 'Sent additional resources and case studies',
        createdAt: '2025-10-16T16:30:00Z',
        createdBy: 'John Smith',
      },
    ],
  },
  {
    id: '4',
    name: 'StartupXYZ Growth Package',
    value: 35000,
    stage: 'discovery',
    probability: 30,
    expectedCloseDate: '2025-11-20T00:00:00Z',
    contactName: 'David Wilson',
    contactEmail: 'dwilson@startup.com',
    company: 'StartupXYZ',
    productService: 'Growth Plan',
    notes: 'Met at conference. Need to schedule initial call.',
    assignedTo: 'Emily Davis',
    createdAt: '2025-10-14T16:45:00Z',
    lastActivityAt: '2025-10-14T16:45:00Z',
    tags: ['startup', 'conference'],
    activities: [
      {
        id: 'a6',
        type: 'note',
        title: 'Conference Meeting',
        description: 'Met founder at TechConf 2025',
        createdAt: '2025-10-14T16:45:00Z',
        createdBy: 'Emily Davis',
      },
    ],
  },
  {
    id: '5',
    name: 'Enterprise Networks Implementation',
    value: 45000,
    stage: 'proposal',
    probability: 65,
    expectedCloseDate: '2025-10-25T00:00:00Z',
    contactName: 'Lisa Anderson',
    contactEmail: 'l.anderson@enterprise.net',
    company: 'Enterprise Networks',
    productService: 'Enterprise Plan with Training',
    notes: 'Budget approved. Final proposal review in progress.',
    assignedTo: 'Robert Brown',
    createdAt: '2025-10-08T08:30:00Z',
    lastActivityAt: '2025-10-15T11:20:00Z',
    tags: ['enterprise', 'training'],
    activities: [
      {
        id: 'a7',
        type: 'email',
        title: 'Proposal Submitted',
        description: 'Sent comprehensive proposal with training plan',
        createdAt: '2025-10-15T11:20:00Z',
        createdBy: 'Robert Brown',
      },
    ],
  },
  {
    id: '6',
    name: 'Finance Pro Annual Contract',
    value: 80000,
    stage: 'won',
    probability: 100,
    expectedCloseDate: '2025-10-16T00:00:00Z',
    contactName: 'Emma Thompson',
    contactEmail: 'ethompson@finance.com',
    company: 'Finance Pro',
    productService: 'Enterprise Plan - Multi-year',
    notes: 'Deal closed! Contract signed. Onboarding team engaged.',
    assignedTo: 'John Smith',
    createdAt: '2025-09-28T10:00:00Z',
    lastActivityAt: '2025-10-16T11:00:00Z',
    tags: ['finance', 'multi-year', 'closed'],
    activities: [
      {
        id: 'a8',
        type: 'note',
        title: 'Contract Signed',
        description: 'Three-year contract signed',
        createdAt: '2025-10-16T11:00:00Z',
        createdBy: 'John Smith',
      },
    ],
  },
  {
    id: '7',
    name: 'Manufacturing Co Digital Transform',
    value: 60000,
    stage: 'negotiation',
    probability: 70,
    expectedCloseDate: '2025-11-05T00:00:00Z',
    contactName: 'Christopher Davis',
    contactEmail: 'cdavis@manufacturing.com',
    company: 'Manufacturing Co',
    productService: 'Custom Enterprise Solution',
    notes: 'Strong interest. Finalizing pricing and implementation timeline.',
    assignedTo: 'John Smith',
    createdAt: '2025-10-09T09:00:00Z',
    lastActivityAt: '2025-10-16T14:00:00Z',
    tags: ['manufacturing', 'custom'],
    activities: [
      {
        id: 'a9',
        type: 'meeting',
        title: 'Pricing Discussion',
        description: 'Negotiated pricing and payment terms',
        createdAt: '2025-10-16T14:00:00Z',
        createdBy: 'John Smith',
      },
    ],
  },
  {
    id: '8',
    name: 'Retail Plus Small Business',
    value: 5000,
    stage: 'lost',
    probability: 0,
    expectedCloseDate: '2025-10-10T00:00:00Z',
    contactName: 'Robert Garcia',
    contactEmail: 'rgarcia@retail.com',
    company: 'Retail Plus',
    productService: 'Starter Plan',
    notes: 'Lost to competitor. Budget constraints.',
    assignedTo: 'Emily Davis',
    createdAt: '2025-10-03T14:20:00Z',
    lastActivityAt: '2025-10-10T10:00:00Z',
    tags: ['retail', 'lost'],
    activities: [
      {
        id: 'a10',
        type: 'note',
        title: 'Deal Lost',
        description: 'Customer chose competitor due to pricing',
        createdAt: '2025-10-10T10:00:00Z',
        createdBy: 'Emily Davis',
      },
    ],
  },
]

export const getDealsByStage = (stage: DealStage) => {
  return mockDeals.filter(deal => deal.stage === stage)
}

export const getDealById = (id: string) => {
  return mockDeals.find(deal => deal.id === id)
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
    averageDealSize: Math.round(mockDeals.reduce((sum, d) => sum + d.value, 0) / mockDeals.length),
  }
}

