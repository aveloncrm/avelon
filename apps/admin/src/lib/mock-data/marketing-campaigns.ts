import { PlatformType } from './marketing-platforms'

export type CampaignStatus = 'draft' | 'active' | 'scheduled' | 'completed' | 'paused'
export type CampaignType = 'product_launch' | 'seasonal' | 'awareness' | 'engagement' | 'promotional'

export interface MarketingCampaign {
  id: string
  name: string
  description: string
  type: CampaignType
  status: CampaignStatus
  startDate: string
  endDate: string
  platforms: PlatformType[]
  postsCount: number
  budget?: number
  spent?: number
  metrics: {
    reach: number
    impressions: number
    engagement: number
    clicks: number
    conversions: number
    engagementRate: number
    conversionRate: number
  }
  goals: string[]
  tags: string[]
  thumbnail?: string
  createdBy: string
  createdAt: string
  updatedAt: string
}

export const mockCampaigns: MarketingCampaign[] = [
  {
    id: '1',
    name: 'Q4 Product Launch Campaign',
    description: 'Major product launch campaign for our new AI-powered platform',
    type: 'product_launch',
    status: 'active',
    startDate: '2025-10-01T00:00:00Z',
    endDate: '2025-12-31T23:59:59Z',
    platforms: ['instagram', 'twitter', 'linkedin', 'facebook'],
    postsCount: 24,
    budget: 50000,
    spent: 32500,
    metrics: {
      reach: 450000,
      impressions: 1250000,
      engagement: 45000,
      clicks: 12500,
      conversions: 850,
      engagementRate: 3.6,
      conversionRate: 6.8,
    },
    goals: ['Generate 1000 sign-ups', 'Achieve 500K reach', '50K in revenue'],
    tags: ['product-launch', 'ai', 'q4'],
    thumbnail: '/mock-images/campaign-product-launch.jpg',
    createdBy: 'Sarah Johnson',
    createdAt: '2025-09-25T10:00:00Z',
    updatedAt: '2025-10-17T14:30:00Z',
  },
  {
    id: '2',
    name: 'Holiday Season Promotion',
    description: 'Black Friday and Cyber Monday special offers campaign',
    type: 'promotional',
    status: 'scheduled',
    startDate: '2025-11-20T00:00:00Z',
    endDate: '2025-12-05T23:59:59Z',
    platforms: ['instagram', 'facebook', 'twitter', 'tiktok'],
    postsCount: 18,
    budget: 35000,
    spent: 0,
    metrics: {
      reach: 0,
      impressions: 0,
      engagement: 0,
      clicks: 0,
      conversions: 0,
      engagementRate: 0,
      conversionRate: 0,
    },
    goals: ['$100K in sales', '250K reach', '5% conversion rate'],
    tags: ['holiday', 'black-friday', 'sale'],
    thumbnail: '/mock-images/campaign-holiday.jpg',
    createdBy: 'Mike Chen',
    createdAt: '2025-10-10T09:00:00Z',
    updatedAt: '2025-10-10T09:00:00Z',
  },
  {
    id: '3',
    name: 'Brand Awareness October',
    description: 'Monthly brand awareness and thought leadership content',
    type: 'awareness',
    status: 'active',
    startDate: '2025-10-01T00:00:00Z',
    endDate: '2025-10-31T23:59:59Z',
    platforms: ['linkedin', 'twitter'],
    postsCount: 15,
    budget: 15000,
    spent: 12000,
    metrics: {
      reach: 180000,
      impressions: 420000,
      engagement: 18500,
      clicks: 5200,
      conversions: 320,
      engagementRate: 4.4,
      conversionRate: 6.2,
    },
    goals: ['200K reach', 'Establish thought leadership', '500 newsletter sign-ups'],
    tags: ['awareness', 'content-marketing', 'thought-leadership'],
    thumbnail: '/mock-images/campaign-awareness.jpg',
    createdBy: 'Emma Davis',
    createdAt: '2025-09-28T11:00:00Z',
    updatedAt: '2025-10-17T10:00:00Z',
  },
  {
    id: '4',
    name: 'Webinar Series Promotion',
    description: 'Promotional campaign for AI in Marketing webinar series',
    type: 'engagement',
    status: 'completed',
    startDate: '2025-09-01T00:00:00Z',
    endDate: '2025-09-30T23:59:59Z',
    platforms: ['linkedin', 'facebook', 'instagram'],
    postsCount: 12,
    budget: 10000,
    spent: 9500,
    metrics: {
      reach: 125000,
      impressions: 285000,
      engagement: 12800,
      clicks: 4500,
      conversions: 680,
      engagementRate: 4.5,
      conversionRate: 15.1,
    },
    goals: ['500 registrations', '100K reach', '80% attendance'],
    tags: ['webinar', 'education', 'lead-gen'],
    thumbnail: '/mock-images/campaign-webinar.jpg',
    createdBy: 'John Smith',
    createdAt: '2025-08-20T14:00:00Z',
    updatedAt: '2025-10-01T09:00:00Z',
  },
  {
    id: '5',
    name: 'Summer Content Series',
    description: 'Seasonal content campaign with tips and best practices',
    type: 'engagement',
    status: 'completed',
    startDate: '2025-06-01T00:00:00Z',
    endDate: '2025-08-31T23:59:59Z',
    platforms: ['instagram', 'tiktok', 'twitter'],
    postsCount: 36,
    budget: 25000,
    spent: 24500,
    metrics: {
      reach: 580000,
      impressions: 1450000,
      engagement: 95000,
      clicks: 18500,
      conversions: 1250,
      engagementRate: 6.6,
      conversionRate: 6.8,
    },
    goals: ['500K reach', '5% engagement rate', '1000 conversions'],
    tags: ['summer', 'content-series', 'seasonal'],
    thumbnail: '/mock-images/campaign-summer.jpg',
    createdBy: 'Sarah Johnson',
    createdAt: '2025-05-15T10:00:00Z',
    updatedAt: '2025-09-01T10:00:00Z',
  },
]

export const getCampaignsByStatus = (status: CampaignStatus) => {
  return mockCampaigns.filter(campaign => campaign.status === status)
}

export const getCampaignById = (id: string) => {
  return mockCampaigns.find(campaign => campaign.id === id)
}

export const getCampaignStats = () => {
  const active = mockCampaigns.filter(c => c.status === 'active')
  const totalBudget = mockCampaigns.reduce((sum, c) => sum + (c.budget || 0), 0)
  const totalSpent = mockCampaigns.reduce((sum, c) => sum + (c.spent || 0), 0)
  const totalReach = mockCampaigns.reduce((sum, c) => sum + c.metrics.reach, 0)
  const totalConversions = mockCampaigns.reduce((sum, c) => sum + c.metrics.conversions, 0)

  return {
    total: mockCampaigns.length,
    active: active.length,
    scheduled: mockCampaigns.filter(c => c.status === 'scheduled').length,
    completed: mockCampaigns.filter(c => c.status === 'completed').length,
    totalBudget,
    totalSpent,
    totalReach,
    totalConversions,
    avgEngagementRate: (mockCampaigns.reduce((sum, c) => sum + c.metrics.engagementRate, 0) / mockCampaigns.length).toFixed(1),
  }
}

