export type CampaignType = 'email' | 'social' | 'webinar' | 'content' | 'paid_ads' | 'event'
export type CampaignStatus = 'draft' | 'scheduled' | 'active' | 'paused' | 'completed'

export interface LeadGenerationCampaign {
  id: string
  name: string
  type: CampaignType
  status: CampaignStatus
  targetAudience: string
  channels: string[]
  startDate: string
  endDate: string | null
  budget: number
  spent: number
  leadsGenerated: number
  qualifiedLeads: number
  costPerLead: number
  conversionRate: number
  createdBy: string
  createdAt: string
  description: string
}

export interface NurtureCampaign {
  id: string
  name: string
  status: CampaignStatus
  type: 'email_drip' | 'educational' | 'promotional' | 'onboarding'
  targetSegment: string
  emailsSent: number
  opensRate: number
  clicksRate: number
  conversions: number
  conversionRate: number
  startDate: string
  endDate: string | null
  createdBy: string
  createdAt: string
  steps: CampaignStep[]
}

export interface CampaignStep {
  id: string
  order: number
  type: 'email' | 'sms' | 'wait' | 'condition'
  subject?: string
  content?: string
  delay: number
  delayUnit: 'hours' | 'days' | 'weeks'
}

export const mockLeadGenCampaigns: LeadGenerationCampaign[] = [
  {
    id: '1',
    name: 'Q4 Enterprise Outreach',
    type: 'email',
    status: 'active',
    targetAudience: 'Enterprise decision-makers in tech',
    channels: ['email', 'linkedin'],
    startDate: '2025-10-01T00:00:00Z',
    endDate: '2025-12-31T00:00:00Z',
    budget: 15000,
    spent: 8500,
    leadsGenerated: 45,
    qualifiedLeads: 28,
    costPerLead: 189,
    conversionRate: 62.2,
    createdBy: 'John Smith',
    createdAt: '2025-09-28T10:00:00Z',
    description: 'Targeted email campaign for enterprise customers with high-value offerings.',
  },
  {
    id: '2',
    name: 'TechConf 2025 Lead Gen',
    type: 'event',
    status: 'completed',
    targetAudience: 'Tech startup founders and CTOs',
    channels: ['event', 'networking'],
    startDate: '2025-10-14T00:00:00Z',
    endDate: '2025-10-14T00:00:00Z',
    budget: 5000,
    spent: 4800,
    leadsGenerated: 32,
    qualifiedLeads: 18,
    costPerLead: 150,
    conversionRate: 56.3,
    createdBy: 'Emily Davis',
    createdAt: '2025-09-20T14:00:00Z',
    description: 'Conference booth and networking event for tech startups.',
  },
  {
    id: '3',
    name: 'LinkedIn Ads - SMB Focus',
    type: 'paid_ads',
    status: 'active',
    targetAudience: 'Small to medium business owners',
    channels: ['linkedin', 'paid_ads'],
    startDate: '2025-10-10T00:00:00Z',
    endDate: '2025-11-10T00:00:00Z',
    budget: 8000,
    spent: 3200,
    leadsGenerated: 67,
    qualifiedLeads: 34,
    costPerLead: 48,
    conversionRate: 50.7,
    createdBy: 'Robert Brown',
    createdAt: '2025-10-05T09:00:00Z',
    description: 'Targeted LinkedIn advertising campaign for SMB market.',
  },
  {
    id: '4',
    name: 'Webinar Series: AI in Business',
    type: 'webinar',
    status: 'scheduled',
    targetAudience: 'Business leaders interested in AI',
    channels: ['webinar', 'email'],
    startDate: '2025-10-25T00:00:00Z',
    endDate: '2025-11-25T00:00:00Z',
    budget: 10000,
    spent: 2000,
    leadsGenerated: 12,
    qualifiedLeads: 8,
    costPerLead: 167,
    conversionRate: 66.7,
    createdBy: 'John Smith',
    createdAt: '2025-10-12T11:00:00Z',
    description: 'Monthly webinar series on AI applications in business.',
  },
  {
    id: '5',
    name: 'Content Marketing - SEO Blog',
    type: 'content',
    status: 'active',
    targetAudience: 'Organic search traffic',
    channels: ['blog', 'seo'],
    startDate: '2025-09-01T00:00:00Z',
    endDate: null,
    budget: 12000,
    spent: 9000,
    leadsGenerated: 156,
    qualifiedLeads: 62,
    costPerLead: 58,
    conversionRate: 39.7,
    createdBy: 'Emily Davis',
    createdAt: '2025-08-25T10:00:00Z',
    description: 'Ongoing content marketing and SEO optimization strategy.',
  },
]

export const mockNurtureCampaigns: NurtureCampaign[] = [
  {
    id: '1',
    name: 'New Lead Welcome Series',
    status: 'active',
    type: 'onboarding',
    targetSegment: 'All new leads',
    emailsSent: 450,
    opensRate: 45.5,
    clicksRate: 12.3,
    conversions: 28,
    conversionRate: 6.2,
    startDate: '2025-09-01T00:00:00Z',
    endDate: null,
    createdBy: 'John Smith',
    createdAt: '2025-08-28T10:00:00Z',
    steps: [
      {
        id: 's1',
        order: 1,
        type: 'email',
        subject: 'Welcome to Our Platform!',
        content: 'Thank you for your interest...',
        delay: 0,
        delayUnit: 'hours',
      },
      {
        id: 's2',
        order: 2,
        type: 'wait',
        delay: 2,
        delayUnit: 'days',
      },
      {
        id: 's3',
        order: 3,
        type: 'email',
        subject: 'Getting Started Guide',
        content: 'Here are some resources to help you...',
        delay: 0,
        delayUnit: 'hours',
      },
      {
        id: 's4',
        order: 4,
        type: 'wait',
        delay: 3,
        delayUnit: 'days',
      },
      {
        id: 's5',
        order: 5,
        type: 'email',
        subject: 'Case Study: How Others Succeed',
        content: 'Learn from our customers...',
        delay: 0,
        delayUnit: 'hours',
      },
    ],
  },
  {
    id: '2',
    name: 'Qualified Lead Nurture',
    status: 'active',
    type: 'educational',
    targetSegment: 'Qualified leads',
    emailsSent: 180,
    opensRate: 52.8,
    clicksRate: 18.5,
    conversions: 22,
    conversionRate: 12.2,
    startDate: '2025-09-15T00:00:00Z',
    endDate: null,
    createdBy: 'Emily Davis',
    createdAt: '2025-09-10T14:00:00Z',
    steps: [
      {
        id: 's6',
        order: 1,
        type: 'email',
        subject: 'Advanced Features Demo',
        content: 'Schedule a personalized demo...',
        delay: 0,
        delayUnit: 'hours',
      },
      {
        id: 's7',
        order: 2,
        type: 'wait',
        delay: 1,
        delayUnit: 'weeks',
      },
      {
        id: 's8',
        order: 3,
        type: 'email',
        subject: 'ROI Calculator & Pricing',
        content: 'See how much you can save...',
        delay: 0,
        delayUnit: 'hours',
      },
    ],
  },
  {
    id: '3',
    name: 'Re-engagement Campaign',
    status: 'active',
    type: 'promotional',
    targetSegment: 'Inactive leads (60+ days)',
    emailsSent: 95,
    opensRate: 28.4,
    clicksRate: 8.2,
    conversions: 5,
    conversionRate: 5.3,
    startDate: '2025-10-01T00:00:00Z',
    endDate: '2025-11-30T00:00:00Z',
    createdBy: 'Robert Brown',
    createdAt: '2025-09-25T09:00:00Z',
    steps: [
      {
        id: 's9',
        order: 1,
        type: 'email',
        subject: 'We Miss You! Special Offer Inside',
        content: 'Come back and get 20% off...',
        delay: 0,
        delayUnit: 'hours',
      },
      {
        id: 's10',
        order: 2,
        type: 'wait',
        delay: 5,
        delayUnit: 'days',
      },
      {
        id: 's11',
        order: 3,
        type: 'email',
        subject: 'Last Chance - Offer Expires Soon',
        content: 'Your exclusive offer expires...',
        delay: 0,
        delayUnit: 'hours',
      },
    ],
  },
]

export const getCampaignStats = () => {
  const totalLeads = mockLeadGenCampaigns.reduce((sum, c) => sum + c.leadsGenerated, 0)
  const totalQualified = mockLeadGenCampaigns.reduce((sum, c) => sum + c.qualifiedLeads, 0)
  const totalSpent = mockLeadGenCampaigns.reduce((sum, c) => sum + c.spent, 0)
  
  return {
    totalCampaigns: mockLeadGenCampaigns.length,
    activeCampaigns: mockLeadGenCampaigns.filter(c => c.status === 'active').length,
    totalLeads,
    totalQualified,
    qualificationRate: (totalQualified / totalLeads * 100).toFixed(1),
    totalSpent,
    averageCostPerLead: Math.round(totalSpent / totalLeads),
  }
}

